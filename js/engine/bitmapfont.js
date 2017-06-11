/*! Bitmap font
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
/*! BitmapFont class*/
class BitmapFont
{
	/*! Constructor */
	constructor(gl,fw,fh)
	{
		this.fw = fw;
		this.fh = fh;
		
		// this.mesh = new Mesh(...)

		this.uvBuffers = new Array(16*16);

		var step = 1.0/16.0;

		/* Generate 16*16 different UV buffers, for every character*/
		for(var y=0;y < 16; y++)
		{
			for(var x=0;x < 16; x++)
			{
				this.uvBuffers[y*16 +x] = gl.createBuffer();

				gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffers[y*16 +x] );

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
		this.vertices = [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0];
		this.indices = [0,1,2, 2,3,0];

		this.iBuffer = gl.createBuffer();
		this.vBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.vBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	}

	/*! Draw a single character
	 * @param g Graphics object
	 * @param bmp Bitmap to use for drawing
	 * @param char Character to draw
	 * @param x X coord
	 * @param y Y coord
	 */
	_DrawChar(g,tex,char)
	{
		var gl = g.gl;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,tex);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.vBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffers[char]);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}