/*! Game Over scene
 * @author Jani Nykänen
 */

/*! GameOver class */
class GameOver extends Scene
{
    /*! Init, see scene.js */
    Init(g,Super)
    {
        this.Super = Super;
        this.fb = new Framebuffer(g.gl,320,240);

        this.bmp = new Bitmap({width:320,height:240},this.fb.texture);

        this.darkenTimer = 0;
        this.flickerTimer = 0;
    }

    /*! Set game over scene
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

        this.darkenTimer = 60;
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

        if(!Status.victory)
        {
            g.SetFiltering(TextureFilter.Nearest);
            g.DrawBitmap(this.bmp,0,0);
            g.SetFiltering(TextureFilter.Linear);

            g.ChangeShader(ShaderType.NoTexture);

            var mod = 1.0 - (1.0/60.0) * this.darkenTimer;

            g.eff.SetColor(0.15,0.015,0.02,mod*0.8);
            g.eff.Use();
            g.FillRect(0,0,320,240);

            g.ChangeShader(ShaderType.Default);

            g.eff.SetColor(1,1,1,1);
        }

        g.eff.Use();

        if(!Status.victory && this.darkenTimer >= 0)
        {
            var mod = 1.0 - (1.0/60.0) * this.darkenTimer;
            g.eff.SetColor(mod,mod,mod,mod);
            g.eff.Use();
        }

        g.DrawBitmapRegion(Assets.textures.logo,Status.victory ? 0 : 256,0,256,256,32,-16,256,256);

        g.DrawText(HUD.font,Assets.textures.font16,"SCORE:" ,160 - 4*8,132,-2);
        g.DrawText(HUD.font,Assets.textures.font24,Utility.IntToStringWithZeros(Status.score) ,160 - 8*8,132+13,0,-12);

        if(Status.victory || this.darkenTimer <= 0)
        {
            var mod = 0.5 * (Math.sin(this.flickerTimer)+1);

            g.eff.SetColor(mod,mod,mod,mod);
            g.eff.Use();
            g.DrawText(HUD.font,Assets.textures.font16,"Left click to continue",40,240-48,0,-2);

            g.eff.Reset();
            g.eff.Use();
        }
        
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if( (this.darkenTimer <= 0 || Status.victory) && Fade.timer <= 0 && Controls.mousestate[0] == State.Pressed)
        {
            MasterAudio.Fade(0.0,0.017);
            Fade.Set(function()
            {
                ref.currentScene = "game";
                ref.scenes.game.Reset();
                MasterAudio.PlayMusic(Assets.music.theme,0.0,true);
                MasterAudio.Fade(1.0,0.017);
            },0.5,FadeMode.In);
        }

        if(this.darkenTimer > 0)
            this.darkenTimer -= 1.0 * timeMod;
        else
        {
            this.darkenTimer = 0;

            this.flickerTimer += 0.035 * timeMod;
        }

        
    }

    /*! On loaded */
    OnLoaded()
    {

    }
}