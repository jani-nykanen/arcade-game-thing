/*! Texture loading
 *
 * Texture loading routines
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
 /*! Loader class */
 class Loader
 {
    /*! Pass webgl context to the loader
     * @param gl webgl context
     */
    static Init(gl)
    {
        this.gl = gl;

        this.loadableData = 0;
        this.currentlyLoaded = 0;
    }

    
    /*! Load a bitmap
     *@param src Image source
     */
    static LoadBitmap(src,sizeout)
    {
        var gl = Loader.gl;

        var tex = gl.createTexture();
        var img = new Image();
        var bmp = new Bitmap(img,tex);
        
        img.onload = function() 
        { 
            Loader.currentlyLoaded ++;
            Loader._HandleTexture(img, tex, bmp); 
        }
        img.src = src;

        this.loadableData ++;

        return bmp;
     }

     /*! Load music track
      * @param src Source path
      */
     static LoadMusic(src)
     {
        var track = new Audio();

        track.onload = function()
        {
            Loader.currentlyLoaded ++;
        }
        track.src = src;

        var m = new Music();
        m.track = track;

         this.loadableData ++;

        return m;
     }

     /*! Is every file loaded
      * @return Boolean, has loaded
      */
     static HasLoaded()
     {
         return (this.currentlyLoaded >= this.loadableData);
     }

     /*! Handle texture (private)
      * @param image Image
      * @param texture Texture output
      */
     static _HandleTexture(image, texture, sizeout) 
     {
        if(sizeout != null)
        {
            sizeout.width = image.width;
            sizeout.height = image.height;
        }

        var gl = Loader.gl;

        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.bindTexture(gl.TEXTURE_2D, null);
     }

 }

// TexLoader is still used somewhere... but where?
var TexLoader = Loader;