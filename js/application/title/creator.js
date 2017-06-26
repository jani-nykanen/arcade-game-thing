/*! Creator texts
 * @author Jani Nykänen
 */

/*! Creator class */
class Creator 
{
    /*! Init */
    static Init()
    {
        this.phase = 0;
        this.timer = 0;
        this.finished = false;
    }

  
    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.finished) return;

        this.timer += 1.0 * timeMod;
        if(this.timer >= 180.0)
        {
            this.timer -= 180.0;
            this.phase ++;
            if(this.phase == 2)
                this.finished = true;
        }
    }
    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.SetFiltering(TextureFilter.Linear);

        if(this.finished) return;

        g.ChangeShader(ShaderType.Default);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.spaceBg,0,0,256,240,0,0,320,240);

        if(this.timer >= 60 && this.timer <= 120)
        {
            g.eff.Reset();
        }
        else if(this.timer < 60)
        {
            var mod = 1.0/60.0 * this.timer;
            g.eff.SetColor(mod,mod,mod,mod);
        }
        else if(this.timer > 120)
        {
            var mod = 1.0 - 1.0/60.0 * (this.timer-120);
            g.eff.SetColor(mod,mod,mod,mod);
        }
        g.eff.Use();
        g.DrawBitmapRegion(Assets.textures.creators,this.phase*128,0,128,128,160-64,120-64,128,128);
        

    }
}