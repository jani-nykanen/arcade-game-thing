/*! Bitmap
 * @author Jani Nykänen */

/*! Bitmap class */
class Bitmap
{   
    /*! Constructor
     * @param image Image
     * @param tex Texture
     */
    constructor(image,tex)
    {
        this.width = image.width;
        this.height = image.height;
        this.tex = tex;
    }
};