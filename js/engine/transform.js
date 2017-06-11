/*! Transformations
 *
 * Linear transformations
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
 /*! Transformation class */
class Transform
{
    /*! Init transformations
     *
     * Init transformation by passing gl object
     * to it
     * @param gl gl object
     */
    constructor(gl, shader)
    {
        this.gl = gl;

        this.projection = mat4.create();
        this.model = mat4.create();
        this.view = mat4.create();

		mat4.identity(this.projection);
		mat4.identity(this.model);
		mat4.identity(this.view);

		this.mUnif = this.gl.getUniformLocation(shader, "model");
		this.vUnif = this.gl.getUniformLocation(shader, "view");
		this.pUnif = this.gl.getUniformLocation(shader, "projection");

		this.modelStorage = new Array();
		this.modelIndex = -1;
    }
	
	/*! Identity matrix */
	Identity()
	{
		mat4.identity(this.model);
	}
	
	/*! Translate
     * Translation
	 * @param tx x translation
	 * @param ty y translation
	 * @param tz z translation
	 */
	Translate(tx,ty,tz)
	{
		mat4.translate(this.model,this.model,vec3.fromValues(tx,ty,tz));
	}
	
	/*! Rotate
     * Rotation
	 * @param angle Angle in radians
	 * @param rx x rotation
	 * @param ry y rotation
	 * @param rz z rotation
	 */
	Rotate(angle,rx,ry,rz)
	{
		mat4.rotate(this.model,this.model,angle,vec3.fromValues(rx,ry,rz));
	}

	/*! Rotate around a vector
	 * @param rx X component
	 * @param ry Y component
	 * @param rz Z component
	 */
	RotateQuaternion(rx,ry,rz)
	{
		var rq = quat.create();
		quat.identity(rq);
		
		quat.rotateY(rq,rq,ry);
		quat.rotateX(rq,rq,rx);
		quat.rotateZ(rq,rq,rz);

		var m = mat4.create();
		mat4.fromQuat(m,rq);

		mat4.multiply(this.model,this.model,m);
	}
	
	/*! Scale
     * Scaling
	 * @param sx x scale
	 * @param sy y scale
	 * @param sz z scale
	 */
	Scale(sx,sy,sz)
	{
		mat4.scale(this.model,this.model,vec3.fromValues(sx,sy,sz));
	}

	/*! Perspective
	 * Sets perspective
	 * @param fov Field of vision (vertical)
	 * @param aspect Aspect ratio of the viewport
	 * @param near Near
	 * @param far Far
	 */
	Perspective(fov,aspect,near,far)
	{
		mat4.perspective(this.projection,fov,aspect,near,far);
	}

	/*! Ortho 2D for 2D rendering
	 * @param width View width
	 * @param height View height
	 */
	Ortho2D(width,height)
	{
		mat4.identity(this.view);
		mat4.ortho(this.projection,0,width,height,0,0.0,1.0);
	}

	/*! View
	 * @param pos Eye position
	 * @param direction Eye direction
	 * @param up Where is up
	 */
	View(pos,direction,up)
	{
		mat4.lookAt(this.view,pos,direction,up);
	}

	/*! Push matrix to the stack*/
	Push()
	{
		this.modelIndex ++;
		
		if(this.modelStorage[this.modelIndex] == null)
		{
			this.modelStorage.push(mat4.clone(this.model));
		}
		else
		{
			mat4.copy(this.modelStorage[this.modelIndex],this.model);
		}
	}

	/*! Pop matrix from the stack */
	Pop()
	{
		if(this.modelIndex < 0) return;

		mat4.copy(this.model,this.modelStorage[this.modelIndex]);

		this.modelIndex --;
	}

	/*! Reset matrix stack pointer */
	ResetStackPointer()
	{
		this.modelIndex = -1;
	}

	/*! Use transformations */
	Use()
	{
		 this.gl.uniformMatrix4fv(this.mUnif, false, new Float32Array(this.model));
		 this.gl.uniformMatrix4fv(this.vUnif, false, new Float32Array(this.view));
		 this.gl.uniformMatrix4fv(this.pUnif, false, new Float32Array(this.projection));
	}

	/*! Reset gl uniforms
	 * @param shader Shader program
	 */
	ResetUniforms(shader)
	{
		this.mUnif = this.gl.getUniformLocation(shader, "model");
		this.vUnif = this.gl.getUniformLocation(shader, "view");
		this.pUnif = this.gl.getUniformLocation(shader, "projection");
	}
}