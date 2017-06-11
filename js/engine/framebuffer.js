/*! Framebuffer
 * @author Jani Nykänen
 * @version 1.0
 */

/*! Framebuffer */
class Framebuffer
{
    /* Constuctor
     * @param gl webgl context
     * @param w Framebuffer width
     * @param h Framebuffer height
     */
    constructor(gl,w,h)
    {
        this.width = w;
        this.height = h;

        var framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
        framebuffer.width = w;
        framebuffer.height = h;

        // Create texture
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, framebuffer.width, framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Create renderbuffer
        var renderbuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, framebuffer.width, framebuffer.height);

        // Attach texture to the framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderbuffer);

        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        this.fb = framebuffer;
        this.texture = texture;

    }

    /*! Draw to a framebuffer
     * @param g Graphics object
     * @param callback Drawing callback
     * @param cbuf The current framebuffer
     */
    DrawTo(g,callback,cbuf)
    {
        g.gl.bindFramebuffer(g.gl.FRAMEBUFFER, this.fb);
        g.SetViewport(this.width,this.height);

        callback(g);

        g.gl.bindFramebuffer(g.gl.FRAMEBUFFER,cbuf != null ? cbuf.fb : null);

        g.SetViewport(cbuf != null ? cbuf.width : g.canvas.width,cbuf != null ? cbuf.height : g.canvas.height);
    }

}