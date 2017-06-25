/*! Pause scene
 * @author Jani Nykänen
 */

/*! Pause class */
class Pause extends Scene
{
    /*! Init, see scene.js */
    Init(g,Super)
    {
        this.Super = Super;
        this.fb = new Framebuffer(g.gl,320,240);

        this.bmp = new Bitmap({width:320,height:240},this.fb.texture);

        this.flickerTimer = 0;
    }

    /*! Set the pause scene
     * In other words, copy game scene
     * to a framebuffer
     */
    Set(g)
    {
        this.fb.DrawTo(g,function()
        {

            var bmp = new Bitmap({width:320,height:240},ref.canvas.texture);

            g.SetFiltering(TextureFilter.Nearest);

            g.transf.Push();

            g.transf.Ortho2D(320,240);
            g.transf.Identity();
            g.transf.Use();

            g.DrawBitmap(bmp,0,0);

            g.transf.Pop();

            g.SetFiltering(TextureFilter.Linear);

        },ref.canvas);
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        g.SetFiltering(TextureFilter.Linear);

        g.ChangeShader(ShaderType.Default);
        g.SetDepthTesting(false);
        g.ClearScreen(0.0,0.0,0.0);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();
        g.eff.Use();

        g.SetFiltering(TextureFilter.Nearest);
        g.DrawBitmap(this.bmp,0,0);
        g.SetFiltering(TextureFilter.Linear);

        g.ChangeShader(ShaderType.NoTexture);

        g.eff.SetColor(0.0,0.0,0.0,0.5);
        g.eff.Use();
        g.FillRect(0,0,320,240);

        g.ChangeShader(ShaderType.Default);
        g.eff.SetColor(1,1,1,1);
        g.eff.Use();

        g.DrawText(HUD.font,Assets.textures.font24,"GAME PAUSED!" ,160 - 11*8,96,0,-12);
        
        var mod = 0.5 * (Math.sin(this.flickerTimer)+1);

        g.eff.SetColor(mod,mod,mod,mod);
        g.eff.Use();
        g.DrawText(HUD.font,Assets.textures.font16,"Press Enter to unpause",40,240-48,0,-2);

        g.eff.Reset();
        g.eff.Use();
        
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if(VPad.buttons.enter.state == State.Pressed)
        {
            ref.currentScene = "game";
            MasterAudio.Fade(1.0,1.0);
        }

        this.flickerTimer += 0.035 * timeMod;
    }

    /*! On loaded */
    OnLoaded()
    {

    }
}