/*! Game stage
 * @author Jani Nykänen
 */

/*! Stage class */
class Stage
{
    /*! Initialize
     * @param Super Application class object
     */
    static Init(Super)
    {
        this.spacePos = 0.0;
        this.sunAngle = 0.0;    
        this.shineValue = 0.0;

        this.earthAngle = 0.0;

        this.spaceFrame = new Framebuffer(Super.graphics.gl,320,240);
        this.canvasFrame = Super.canvas;
    }

    /*! Draw space
     * @param g Graphics object
     */
    static DrawSpace(g)
    {
        g.SetFiltering(TextureFilter.Linear);
        g.SetDepthTesting(true);
        
        g.ChangeShader(ShaderType.Fog);
        g.ClearScreen(0,0,0);

        g.transf.Identity();
        g.transf.Perspective(75.0,320.0/240.0,0.1,100.0);
        g.transf.View(vec3.fromValues(0,0,-1 + Stage.spacePos),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        g.transf.Scale(0.5,0.5,2.0);
        g.transf.Use();

        g.eff.SetFog(0,0,0,3.5,8);
        g.eff.Use();
        
        g.DrawMesh(Shapes.cylinder,Assets.textures.space.tex);
    }

    /*! Draw sun
     * @param g Graphics object
     */
    static DrawSun(g)
    {
        g.SetDepthTesting(false);
        g.ChangeShader(ShaderType.Default);

        // Draw "shine"
        g.transf.Identity();
        g.transf.Ortho2D(320,240);
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();
        g.DrawBitmap({width: 320, height: 240, tex : this.spaceFrame.texture},0,0);

        var shineMod = 0.8 + 0.1 * (Math.sin(this.shineValue) +1);
        g.eff.SetColor(shineMod,shineMod,shineMod,shineMod);
        g.eff.Use();

        shineMod = 0.9 + 0.05 * (Math.sin(this.shineValue) +1);
        g.DrawScaledBitmap(Assets.textures.sunShine,160-160*shineMod,120-120*shineMod,320*shineMod,240*shineMod);

        g.ChangeShader(ShaderType.Fog);
        
        // Draw the actual sun
        g.SetDepthTesting(true);

        g.transf.Identity();
        g.transf.Perspective(75.0,320.0/240.0,0.1,100.0);
        g.transf.View(vec3.fromValues(0,0,0),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        
        g.transf.Translate(0.0,0.0,5.0);
        g.transf.RotateQuaternion(this.sunAngle,this.sunAngle*2,this.sunAngle / 2);
        g.transf.Scale(0.25,0.25,0.25);
        g.transf.Use();

        g.eff.Reset();
        g.eff.SetFog(1,1,0.6,4.7,4.85);
        g.eff.Use();

        g.DrawMesh(Shapes.sphere,Assets.textures.sun.tex);
    }

    /*! Draw a planet
     * @param g Graphics object
     * @param angle Angle
     * @param z Z coordinate
     * @param radius Position radius
     * @param scale Scale
     * @param r Red component
     * @param gr Green component
     * @param b Blue component
     */
    static DrawPlanet(g,angle,z,radius,scale,r,gr,b)
    {
        g.transf.Identity();

         var posx = Math.cos(angle) * radius;
         var posy = Math.sin(angle) * radius;

         g.transf.Translate(posx,posy,z);
         g.transf.RotateQuaternion(Stage.sunAngle*2,Stage.sunAngle/2,-Stage.sunAngle);
         g.transf.Scale(scale,scale,scale);
         g.transf.Use();

         g.eff.Reset();
         g.eff.SetFog(0,0,0,z-0.2,z);
         g.eff.SetColor(r,gr,b,1);
         g.eff.Use();

         g.DrawMesh(Shapes.sphere,Assets.textures.earth.tex);

         g.eff.Reset();
    }

    /*! Draw small planets
     * @param g Graphics object
     */
    static DrawSmallPlanets(g)
    {
        g.ChangeShader(ShaderType.Fog);
        g.SetFiltering(TextureFilter.Linear);

        /*
         * Draw planet 1
         */
         this.DrawPlanet(g,this.earthAngle*1.25,4.0,0.5,0.1,0.45,0.2,0.1);
         this.DrawPlanet(g,-this.earthAngle/2 + Math.PI / 4.0,5.5,0.5,0.1,0.65,0.45,0.1);
         this.DrawPlanet(g,-this.earthAngle - Math.PI / 4.0,3.0,0.5,0.1,0.65,0.1,0.25);
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.spacePos += 0.025 * timeMod;
        if(this.spacePos >= 1.0)
            this.spacePos -= 1.0;

        this.sunAngle  += 0.005 * timeMod;
        this.shineValue += 0.025 * timeMod;
        this.earthAngle += 0.005 * timeMod;
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        this.spaceFrame.DrawTo(g,this.DrawSpace,this.canvasFrame);

        this.DrawSun(g);
        this.DrawSmallPlanets(g);
        
        g.ChangeShader(ShaderType.Default);
        g.SetFiltering(TextureFilter.Nearest);
    }
}