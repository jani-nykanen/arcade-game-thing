/*! Control screen
 * @author Jani Nykänen
 */

/*! Control screen class */
class ControlScreen
{
        /*! Init */
    static Init()
    {
        this.fadeTimer = 50;
        this.mouseOverlay = false;
    }

  
    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.fadeTimer > 0)
        {
            this.fadeTimer -= 1.0 * timeMod;
            return;
        }
        
        var vpos = Controls.mouse.vpos;
        this.mouseOverlay = (vpos.x > 84 && vpos.x < 84 + 128 && vpos.y > 240-24);

        if(this.mouseOverlay && Fade.timer <= 0 && Controls.mousestate[0] == State.Pressed)
        {
            MasterAudio.PlaySound(Assets.sounds.choose,1.0);

            MasterAudio.Fade(0.0,-0.017);
            Fade.Set(function()
            {
                ref.currentScene = "game";
                ref.scenes.game.Reset();
                MasterAudio.PlayMusic(Assets.music.theme,0.0,true);
                MasterAudio.Fade(1.0,0.017);
                Camera.y = -0.5;
            },1.0,FadeMode.In);
        }
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        if(this.finished) return;

        g.ChangeShader(ShaderType.Default);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.spaceBg,0,Menu.spacePos,256,240,0,0,320,240);
 
        g.SetFiltering(TextureFilter.Nearest);

        g.eff.SetColor(1,1,1,1);
        if(this.fadeTimer > 0)
        {
            var mod = 1.0 - 1.0/60.0 * this.fadeTimer;
            g.eff.SetColor(mod,mod,mod,mod);
        }
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.controls,0,0,320,240,0,0,320,240);

        if(this.mouseOverlay )
        {
            g.eff.SetColor(1,1,0,1);
            g.eff.Use();
        }

        g.DrawText(HUD.font,Assets.textures.font24,"Continue",90,240-24,0,-14);

        g.SetFiltering(TextureFilter.Linear);
    }
}