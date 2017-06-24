/*! Fading!
 * @author Jani Nykänen
 */

var FadeMode =
{
    In : 0,
    Out : 1,
};

/*! Fade class */
class Fade
{
    /*! Initialize */
    static Init()
    {
        this.timer = 0;
        this.speed = 0;
        this.mode = FadeMode.Out;
        this.cb = null;
    }

    /*! Set 
     * @param cb Callback
     * @param speed Speed
     * @param mode Mode
     */
    static Set(cb,speed,mode)
    {
        this.timer = 60;
        this.speed = speed;
        this.cb = cb;
        this.mode = mode;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.timer > 0)
        {
            this.timer -= 1.0 * timeMod;
            if(this.timer <= 0.0)
            {
                if(this.mode == FadeMode.In)
                {
                    if(this.cb != null)
                    {
                        this.cb();
                        this.cb = null;
                    }
                    this.mode = FadeMode.Out;
                    this.timer = 60;
                }
            }
        }
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {   
        if(this.timer <= 0) return;

        g.ChangeShader(ShaderType.NoTexture);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();

        var mod = 1.0/60.0 * this.timer;
        if(this.mode == FadeMode.In)
            mod = 1.0 - 1.0/60.0 * this.timer;

        g.eff.SetColor(0,0,0,mod);
        g.eff.Use();

        g.FillRect(0,0,320,240);

        g.ChangeShader(ShaderType.Default);
    }
}