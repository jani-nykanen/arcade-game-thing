/*! Mesh
 *
 * Mesh creation and drawing routines
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
var _gl = null;

/*! Mesh class */
class Mesh
{
    /*! Constructor
     * @param vertices Vertices
     * @param indices Indices
     * @param uvCoords UV Coordinates
     */
    constructor(vertices,indices,uvCoords)
    {
        var gl = _gl;

        this.vertices = vertices;
        this.indices = indices;
        this.uvCoords = uvCoords;

        // Generate buffers

        this.vBuffer = gl.createBuffer();
        this.uvBuffer = gl.createBuffer();
        this.iBuffer = gl.createBuffer();

        if(vertices != null)
        {   
            gl.bindBuffer(gl.ARRAY_BUFFER,this.vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        }

        if(indices != null)
        {   
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this.iBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        }

        if(uvCoords != null)
        {   
            gl.bindBuffer(gl.ARRAY_BUFFER,this.uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvCoords), gl.STATIC_DRAW);
        }
    }

    /* Draw mesh
     * Draws a mesh
     * @param g Graphics object
     * @param mesh Mesh to be drawn
     * @param tex Texture
     */
    static Draw(g,mesh,tex)
    {
        var gl = g.gl;

        if(mesh == null) throw new Error("A null pointer in 'Mesh.Draw'");
        
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,tex);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.iBuffer);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER,mesh.uvBuffer);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0);

        gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);

    }

    /*! Init mesh stuff
     * Pass "gl" object so Mesh can
     * use it.
     * @param gl webGL context
     */
    static Init(gl)
    {
        _gl = gl;
    }
}