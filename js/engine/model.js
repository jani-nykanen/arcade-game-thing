/*! Model
 * @author Jani Nykänen
 * @version 1.0
*/

/*! Model class */
class Model
{
    /*! Constructor */
    constructor()
    {
        this.meshes = new Array();
    }

    /*! Add new mesh
     * @param mesh Mesh
     */
    PushMesh(mesh)
    {
        this.meshes.push(mesh);
    }
    
}