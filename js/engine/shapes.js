/*! Shapes
 *
 * Useful shapes, stored as meshes
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */

/*! Shapes class */
class Shapes
{
    /*! Gen sphere
     * @todo 99% same code as in cylinder, fix?
     */
    static _GenSphere()
    {
        var vertices = [];
        var indices = [];
        var uvCoords = [];

        // We could use radians as well, but degrees are easier
        // to undersand
        var step = 36.0;
        var zstep = 1.0 / 6;
        for(var z = -1.0; z < 1.0; z += zstep)
        {
            if(z > 1.0) z = 1.0;
            var radius = Math.sqrt(1 - Math.pow(z,2));
            var radiusUp =Math.sqrt(1 - Math.pow(z+zstep,2));

            for(var angle = 0; angle < 360.0; angle += step)
            {
                vertices.push(radius*Math.cos(angle * Math.PI / 180.0) );
                vertices.push(radius*Math.sin(angle * Math.PI / 180.0) );
                vertices.push(z);

                vertices.push(radius*Math.cos( (angle+step) * Math.PI / 180.0) );
                vertices.push(radius*Math.sin( (angle+step) * Math.PI / 180.0) );
                vertices.push(z);

                // We must push this vertice twice to "triangulate"
                // the surface we are pushing to the vertice buffer
                // @todo What did that ^ even mean...?
                for(var i = 0; i < 2; i++)
                {
                    vertices.push(radiusUp* Math.cos( (angle+step) * Math.PI / 180.0) );
                    vertices.push(radiusUp* Math.sin( (angle+step) * Math.PI / 180.0) );
                    vertices.push(z+zstep);
                }

                vertices.push(radiusUp*Math.cos( (angle) * Math.PI / 180.0) );
                vertices.push(radiusUp*Math.sin( (angle) * Math.PI / 180.0) );
                vertices.push(z+zstep);

                vertices.push(radius*Math.cos( (angle) * Math.PI / 180.0) );
                vertices.push(radius*Math.sin( (angle) * Math.PI / 180.0) );
                vertices.push(z);

                uvCoords.push(0.0); uvCoords.push(0.0);
                uvCoords.push(1.0); uvCoords.push(0.0);
                uvCoords.push(1.0); uvCoords.push(1.0);

                uvCoords.push(1.0); uvCoords.push(1.0);
                uvCoords.push(0.0); uvCoords.push(1.0);
                uvCoords.push(0.0); uvCoords.push(0.0);

                for(var i = 0; i < 6; i++)
                {
                    indices.push(indices.length);
                }
                
            }
        }

        this.sphere = new Mesh(vertices,indices,uvCoords);
    }

    /*! Generate cylinder shape*/
    static _GenCylinder()
    {
        var vertices = [];
        var indices = [];
        var uvCoords = [];

        var zstep = 0.5;
        var zmax = 5.0;

        // We could use radians as well, but degrees are easier
        // to undersand
        var step = 40.0;
        for(var z = 0.0; z < zmax; z += zstep)
        {
            for(var angle = 0; angle < 360.0; angle += step)
            {
                vertices.push(Math.cos(angle * Math.PI / 180.0) );
                vertices.push(Math.sin(angle * Math.PI / 180.0) );
                vertices.push(z);

                vertices.push(Math.cos( (angle+step) * Math.PI / 180.0) );
                vertices.push(Math.sin( (angle+step) * Math.PI / 180.0) );
                vertices.push(z);

                // We must push this vertice twice to "triangulate"
                // the surface we are pushing to the vertice buffer
                // @todo What did that ^ even mean...?
                for(var i = 0; i < 2; i++)
                {
                    vertices.push(Math.cos( (angle+step) * Math.PI / 180.0) );
                    vertices.push(Math.sin( (angle+step) * Math.PI / 180.0) );
                    vertices.push(z+zstep);
                }

                vertices.push(Math.cos( (angle) * Math.PI / 180.0) );
                vertices.push(Math.sin( (angle) * Math.PI / 180.0) );
                vertices.push(z+zstep);

                vertices.push(Math.cos( (angle) * Math.PI / 180.0) );
                vertices.push(Math.sin( (angle) * Math.PI / 180.0) );
                vertices.push(z);

                uvCoords.push(0.0); uvCoords.push(0.0);
                uvCoords.push(1.0); uvCoords.push(0.0);
                uvCoords.push(1.0); uvCoords.push(1.0);

                uvCoords.push(1.0); uvCoords.push(1.0);
                uvCoords.push(0.0); uvCoords.push(1.0);
                uvCoords.push(0.0); uvCoords.push(0.0);

                for(var i = 0; i < 6; i++)
                {
                    indices.push(indices.length);
                }
                
            }
        }

        this.cylinder = new Mesh(vertices,indices,uvCoords);
    }

    /*! Init shapes */
    static Init()
    {
        this.plane = new Mesh(
            [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0],
            [0,1,2, 2,3,0],
            [0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0]
        );

        //This mesh will be used to draw bitmap region
        this.editablePlane = new Mesh(
            [0.0,0.0,0.0, 1.0,0.0,0.0, 1.0,1.0,0.0, 0.0,1.0,0.0],
            [0,1,2, 2,3,0],
            [0.0,0.0, 1.0,0.0, 1.0,1.0, 0.0,1.0]
        );

        this._GenCylinder();
        this._GenSphere();

    }
}