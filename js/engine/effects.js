/*! Effects
 *
 * Effect (colors, fog etc) routines
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */

/*! Effects class*/
 class Effects
 {
	/*! Constructor
	 * @param gl webGL context
	 * @param shader Shader object
	 */
    constructor(gl,shader)
    {
        this.gl = gl;

        this.colUnif = this.gl.getUniformLocation(shader, "tintColor");
		this.fogColUnif = this.gl.getUniformLocation(shader, "fogColor");
        this.fogMinUnif = this.gl.getUniformLocation(shader, "fogMin");
        this.fogMaxUnif = this.gl.getUniformLocation(shader, "fogMax");

        this.color = vec4.fromValues(1.0,1.0,1.0,1.0);
        this.fogColor = vec4.fromValues(1.0,1.0,1.0,1.0);
        this.fogEnabled = false;
        this.fogMin = 0.0;
        this.fogMax = 10.0;
    }

	/*! Reset gl uniforms
	 * @param shader Shader program
	 */
	ResetUniforms(shader)
	{
		this.colUnif = this.gl.getUniformLocation(shader, "tintColor");
		this.fogColUnif = this.gl.getUniformLocation(shader, "fogColor");
        this.fogMinUnif = this.gl.getUniformLocation(shader, "fogMin");
        this.fogMaxUnif = this.gl.getUniformLocation(shader, "fogMax");
	}

	/*! Reset effects */
    Reset()
    {
        vec4.set(this.color,1.0,1.0,1.0,1.0);
		
		vec4.set(this.fogColor,1.0,1.0,1.0,1.0);
		this.fogMin = 0.0;
		this.fogMax = 10.0;

		this.fogEnabled = false;
    }

	/*! Use effects */
    Use()
    {
        var gl = this.gl;

        gl.uniform4fv(this.colUnif,new Float32Array(this.color));
		
        gl.uniform4fv(this.fogColUnif,new Float32Array(this.fogColor));
		gl.uniform1f(this.fogMinUnif,this.fogMin);
		gl.uniform1f(this.fogMaxUnif,this.fogMax);
		
		// console.log(this.fogEnabled);
	}

	/*! Set color
	 * @param r  Red color component
	 * @param g  Green color component
	 * @param b  Blue color component
	 */
    SetColor(r,g,b,a)
    {
        vec4.set(this.color,r,g,b,a);
    }
	
	/*! Set fog
     * Set simple fog, based on distance
	 *
	 * @param r  Red color component
	 * @param g  Green color component
	 * @param b  Blue color component
	 * @param min Minimum
	 * @param max Maximum
	 */
	SetFog(r,g,b,min,max)
	{
		vec4.set(this.fogColor,r,g,b,1.0);
		this.fogMin = min;
		this.fogMax = max;
	}
 }