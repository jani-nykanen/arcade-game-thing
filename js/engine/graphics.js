/*! Graphics
 *
 * Base graphics functions
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
/*! Shader type */
var ShaderType =
{
    Fog : 0,
    NoTexture : 1,
    LimitPalette : 2,
    Fog : 3,
};

/*! Texture parameter type */
var TextureFilter =
{
    Nearest : 0,
    Linear : 1,
}

/*! Graphics class
 *
 * Base graphics class for rendering
 * WebGL content
 */
class Graphics
{
    /*! Init WebGL context
     * Initializes WebGL context and returns "gl" object
     * @return WebGL context
     */
    _InitWebGL()
    {
        var gl = null;
        gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    
        if(gl == null)
        {
             throw new Error( "Failed to initialize WebGL context!" );
        }
    
        return gl;
    }

    /*! Get shaders */
    _GetShader(gl, id, type)
    {
        var shaderScript, theSource, currentChild, shader;
        
        shaderScript = document.getElementById(id);
        
        if (!shaderScript) 
        {
            throw new Error( "No shader called " + id);
        }
        
        theSource = shaderScript.text;

        if (!type) 
        {
            if (shaderScript.type == 'x-shader/x-fragment') 
            {
                type = gl.FRAGMENT_SHADER;
            } 
            else if (shaderScript.type == 'x-shader/x-vertex') 
            {
                type = gl.VERTEX_SHADER;
            }
            else 
            {
                throw new Error( "Unknown shader type " + shaderScript.type);
            }
        }
        var shader = gl.createShader(type);

        gl.shaderSource(shader, theSource);
    
        // Compile the shader program
        gl.compileShader(shader);  

        // Check for errors
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
        {  
            throw new Error( "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
        }
            
        return shader;
    }

    /*! Build shaders*/
    _BuildShaders(frag,vertex)
    {
        var fragmentShader = this._GetShader(this.gl, frag);
        var vertexShader = this._GetShader(this.gl, vertex);
        
        // Create the shader program
        var shaderProgram = this.gl.createProgram();

        // Bind attrib locations
        this.gl.bindAttribLocation(shaderProgram,0,"vertexPos");
        this.gl.bindAttribLocation(shaderProgram,1,"vertexUV");

        this.gl.attachShader(shaderProgram, vertexShader);
        this.gl.attachShader(shaderProgram, fragmentShader);
        this.gl.linkProgram(shaderProgram);
        
        // Check errors
        if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS))
        {
             throw new Error( "Unable to initialize the shader program: " + this.gl.getProgramInfoLog(shaderProgram));
        }

        return shaderProgram;
    }

    /*! Constructor */
    constructor()
    {
        this.canvas = document.getElementById('glCanvas');
        this.gl = this._InitWebGL();

        this.shaderProgram = this._BuildShaders("frag-default","vertex-default");
        this.shaderNoTex = this._BuildShaders("frag-notex","vertex-notex");
        this.shaderLimitPalette = this._BuildShaders("frag-limit","vertex-default");
        this.shaderFog = this._BuildShaders("frag-fog","vertex-default");

        this.currentShader = this.shaderProgram;

        this.gl.useProgram(this.shaderLimitPalette);
        this.gl.uniform1i(this.gl.getUniformLocation(this.shaderLimitPalette, 'texSampler'), 0);

        this.gl.useProgram(this.shaderProgram);
        this.gl.uniform1i(this.gl.getUniformLocation(this.shaderProgram, 'texSampler'), 0);

        this.gl.useProgram(this.shaderFog);
        this.gl.uniform1i(this.gl.getUniformLocation(this.shaderFog, 'texSampler'), 0);

        this.transf = new Transform(this.gl,this.shaderProgram);
        this.eff = new Effects(this.gl,this.shaderProgram);

        this.gl.enableVertexAttribArray(0);
        this.gl.enableVertexAttribArray(1);

        this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
        this.gl.enable(this.gl.BLEND);

        this.filter = TextureFilter.Nearest;

        this.lastTexture = 0;

        this.regularSprites = new Array();
        this.regularSprites[2] = new RegularSprite(this.gl,2);
        this.regularSprites[4] = new RegularSprite(this.gl,4);
		
    }

    // Drawing functions:

    /*! Clear screen
     * Clear screen with a certain color
     * @param r Red component
     * @param g Green component
     * @param b Blue component
     */
    ClearScreen(r,g,b)
    {
        this.gl.clearColor(r, g, b, 1.0);
        
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /*! Set depth testing
     * @param enable Enable
     */
    SetDepthTesting(enable)
    {
        if(enable)
        {
            this.gl.depthFunc(this.gl.LEQUAL);
            this.gl.enable(this.gl.DEPTH_TEST);
        }
        else
        {
            this.gl.disable(this.gl.DEPTH_TEST);
        }
    }

    /*! Set gl viewport
    * Set WebGL viewport
    * @param w width
    * @param h height
    */
    SetViewport(w,h)
    {
        this.gl.viewport(0, 0, w, h);
    }

    /*! Set texture filtering type
     * @param type Type
     */
    SetFiltering(type)
    {
        this.filter = type;
    }

    /*! Draw text
	 * @param font Font
	 * @param bmp Bitmap to use for drawing
	 * @param text Text to draw
	 * @param x X coord
	 * @param y Y coord
	 * @param flag Flag (left, center etc.)
	 */
	DrawText(font,bmp, text, x, y, flag, offset)
	{
        if(font == null) return;

        font.fw = bmp.width / 16;
        font.fh = bmp.height / 16;

        if(offset == null)
            offset = 0;

        var tex = bmp.tex;

		this.transf.Push();

        this.transf.Translate(x,y,0);

        for(var i = 0; i < text.length; i++)
        {
            if(text.charCodeAt(i) == "\n".charCodeAt(0))
            {
                this.transf.Translate( -i* (font.fw+offset) * (3/4),font.fh+offset,0.0);
                continue;
            }

            this.transf.Scale(font.fw,font.fh,1);
            this.transf.Use();
            font._DrawChar(this,tex,text.charCodeAt(i));
            this.transf.Scale(1.0/font.fw,1.0/font.fh,1);
            this.transf.Translate( (font.fw+offset) * (3/4),0.0,0.0);
        }

        this.transf.Pop();
	}

    /* Draw mesh
     * Draws a mesh
     * @param mesh Mesh to be drawn
     * @param tex Texture
     */
    DrawMesh(mesh,tex)
    {
        var gl = this.gl;

        if(mesh == null) return;
        
        if(tex != null)
        {
            if(tex != this.lastTexture)
            {
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D,tex);
                this.lastTexture = tex;
            }

            switch(this.filter)
            {
            default:
            case TextureFilter.Nearest:
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                break;

            case TextureFilter.Linear:
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                break;
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.iBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.uvBuffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

    }

    /*! Draw full bitmap
     * @param bmp Bitmap
     * @param x X coordinate
     * @param y Y coordinate
     */
    DrawBitmap(bmp,x,y)
    {
        this.transf.Push();

        this.transf.Translate(x,y,0.0);
        this.transf.Scale(bmp.width,bmp.height,1);
        this.transf.Use();

        this.DrawMesh(Shapes.plane,bmp.tex);

        this.transf.Pop();
    }

    /*! Draw a centered bitmap to 2D plane (ignore bitmap size)
     * @param bmp Bitmap
     * @param x X coordinate
     * @param y Y coordinate
     * @param angle Angle
     * @param sx Scale x
     * @param sy Scale y
     */
    DrawCenteredBitmap(bmp,x,y,angle,sx,sy)
    {
        this.transf.Push();

        this.transf.Translate(x,y,0.0);
        if(angle != 0) this.transf.RotateQuaternion(0,0,angle);
        this.transf.Scale(sx,sy,1);
        this.transf.Use();

        this.DrawMesh(Shapes.planeCenter,bmp.tex);

        this.transf.Pop();
    }

    /*! Draw a regular bitmap portion
     * @param bmp Bitmap
     * @param x X coordinate
     * @param y Y coordinate
     * @param s Size
     * @param ix Index X
     * @param iy Index Y
     * @param angle Angle
     * @param sx Scale x
     * @param sy Scale y
     */
    DrawRegularBitmapPortion(bmp,x,y,s,ix,iy,angle,sx,sy)
    {
        if(this.regularSprites[s] == null)
        {
            this.regularSprites[s] = new RegularSprite(s);
        }

        this.transf.Push();

        this.transf.Translate(x,y,0.0);
        if(angle != 0) this.transf.RotateQuaternion(0,0,angle);
        this.transf.Scale(sx,sy,1);
        this.transf.Use();

        this.regularSprites[s].Draw(this,bmp.tex,ix,iy);

        this.transf.Pop();
    }

    /*! Draw bitmap region, scaled rotated, ignore bitmap size in drawing
     * @param bmp Bitmap
     * @param sx Source x
     * @param sy Source y
     * @param sw Source width
     * @param sh Source height
     * @param dx Destination x
     * @param dy Destination y
     * @param dw Destination width
     * @param dh Destination height
     * @param angle Angle
     * @param isx Image scale x
     * @param isy Image scale y
     */
    DrawCenteredBitmapRegion(bmp,sx,sy,sw,sh,dx,dy,dw,dh,angle,isx,isy)
    {
        var wmod = 1.0 / bmp.width;
        var hmod = 1.0 / bmp.height;

        // Edit values to fit 1.0x1.0 area
        sx *= wmod;
        sy *= hmod;
        sw *= wmod;
        sh *= hmod;

        var data = [sx,sy,sx+sw,sy,sx+sw,sy+sh,sx,sy+sh];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Shapes.planeCenterEditable.uvBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER,0,new Float32Array(data));
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);

        this.transf.Push();

        this.transf.Translate(dx,dy,0.0);
        this.transf.RotateQuaternion(0,0,angle);
        this.transf.Scale(isx,isy,1);
        this.transf.Use();

        this.DrawMesh(Shapes.planeCenterEditable,bmp.tex);

        this.transf.Pop();
    }

    /*! Draw full, scaled bitmap
     * @param bmp Bitmap
     * @param dx Destination x
     * @param dy Destination y
     * @param dw Destination width
     * @param dh Destination height
     */
    DrawScaledBitmap(bmp,dx,dy,dw,dh)
    {
        this.transf.Push();

        this.transf.Translate(dx,dy,0.0);
        this.transf.Scale(bmp.width * (dw/bmp.width),bmp.height * (dh/bmp.height),1);
        this.transf.Use();

        this.DrawMesh(Shapes.plane,bmp.tex);

        this.transf.Pop();
    }

    /*! Draw bitmap region
     * @param bmp Bitmap
     * @param sx Source x
     * @param sy Source y
     * @param sw Source width
     * @param sh Source height
     * @param dx Destination x
     * @param dy Destination y
     * @param dw Destination width
     * @param dh Destination height
     */
    DrawBitmapRegion(bmp,sx,sy,sw,sh,dx,dy,dw,dh)
    {
        var wmod = 1.0 / bmp.width;
        var hmod = 1.0 / bmp.height;

        // Edit values to fit 1.0x1.0 area
        sx *= wmod;
        sy *= hmod;
        sw *= wmod;
        sh *= hmod;

        var data = [sx,sy,sx+sw,sy,sx+sw,sy+sh,sx,sy+sh];

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Shapes.editablePlane.uvBuffer);
        this.gl.bufferSubData(this.gl.ARRAY_BUFFER,0,new Float32Array(data));
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER,null);

        this.transf.Push();

        this.transf.Translate(dx,dy,0.0);
        this.transf.Scale(dw,dh,1);
        this.transf.Use();

        this.DrawMesh(Shapes.editablePlane,bmp.tex);

        this.transf.Pop();
    }

    /*! Draw sprite (special for non-pixel perfect rendering)
     * @param bmp Bitmap
     * @param x X coord
     * @param y Y coord
     * @param angle Angle
     * @param sx Scale x
     * @param sy Scale y
     */
    DrawSpriteSpecial(bmp,spr,x,y,angle,sx,sy)
    {
        var sourcex = spr.currentFrame * spr.width;
        var sourcey = spr.currentRow * spr.height;

        this.DrawCenteredBitmapRegion(bmp,sourcex,sourcey,
            spr.width,spr.height,
            x,y,spr.width,spr.height,angle,sx,sy);
    }

    /*! Draw sprite (special for non-pixel perfect rendering)
     * @param bmp Bitmap
     * @param x X coord
     * @param y Y coord
     * @param column Frame 
     * @param row Row
     * @param angle Angle
     * @param sx Scale x
     * @param sy Scale y
     */
    DrawSpriteFrameSpecial(bmp,spr,x,y,column,row,angle,sx,sy)
    {
        var sourcex = column * spr.width;
        var sourcey = row * spr.height;

        this.DrawCenteredBitmapRegion(bmp,sourcex,sourcey,
            spr.width,spr.height,
            x,y,spr.width,spr.height,angle,sx,sy);
    }

    /*! Fill a rectangle
     * @param x X
     * @param y Y
     * @param w Width
     * @param h Height
     */
    FillRect(x,y,w,h)
    {
        this.transf.Push();

        this.transf.Translate(x,y,0.0);
        this.transf.Scale(w,h,1);
        this.transf.Use();

        this.DrawMesh(Shapes.plane,null);

        this.transf.Pop();
    }

    /*! Change shader program
     * @param shader Shader type
     */
    ChangeShader(shader)
    {
        var target = 0;
        switch(shader)
        {
        case ShaderType.Default:
            target = this.shaderProgram;
            break;

        case ShaderType.LimitPalette:
            target = this.shaderLimitPalette;
            break;

        case ShaderType.NoTexture:
            target = this.shaderNoTex;
            break;

        case ShaderType.Fog:
            target = this.shaderFog;
            break;

        default:
            return
        }

        this.currentShader = target;

        this.gl.useProgram(target);

        this.eff.ResetUniforms(target);
        this.transf.ResetUniforms(target);

        this.eff.Use();
        this.transf.Use();
    }
}