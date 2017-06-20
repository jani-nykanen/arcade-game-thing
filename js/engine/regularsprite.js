/*! 2x2 sprite
 * @author Jani Nykänen
 */

/*! Regular sprite class */
class RegularSprite
{
    /*! Constructor 
     * @param gl webgl context
     * @param s Size
     */
    constructor(gl,s)
    {
        this.uvBuffers = new Array(s*s);

		var step = 1.0/s;

		for(var y=0;y < s; y++)
		{
			for(var x=0;x < s; x++)
			{
				this.uvBuffers[y*s +x] = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffers[y*s +x] );

				var uvCoords = 
				[
					x*step,(y)*step,
					(x+1)*step,(y)*step,
					(x+1)*step,(y+1)*step,
					x*step,(y+1)*step
				];
           		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvCoords), gl.STATIC_DRAW);
			}
		}

		/* Generate vertex & index buffers*/
		this.vertices = [-0.5,-0.5,0.0, 0.5,-0.5,0.0, 0.5,0.5,0.0, -0.5,0.5,0.0];
		this.indices = [0,1,2, 2,3,0];

		this.iBuffer = gl.createBuffer();
		this.vBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

        this.size = s;
    }

    /*! Draw
     * @param g Graphics object
     * @param ix Index X
     * @param iy Index Y
     */
    Draw(g,tex,ix,iy)
    {
        if(iy*this.size + ix >= this.size*this.size)
            return;

		var gl = g.gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,tex);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.vBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffers[iy*2+ix]);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}