/*! Game scene
 * @author Jani Nykänen
 */

/*! Game class */
class Game extends Scene
{
    /*! Init, see scene.js */
    Init(g,Super)
    {
        this.Super = Super;
        Stage.Init(Super);

        Camera.Init();
        GameObjects.Init(Super.graphics.gl);
        HUD.Init(Super.graphics.gl);
        Status.Init();

        Fade.Set(null,1.0,FadeMode.Out);
    }

    /*! Reset */
    Reset()
    {
        Status.Reset();
        Stage.Reset();
        GameObjects.Reset();

        Camera.x = GameObjects.player.x;
        Camera.y = GameObjects.player.y;
        Camera.shakeTimer = 0;
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        g.ChangeShader(ShaderType.Default);
        g.SetDepthTesting(false);
        g.ClearScreen(0.75,0.75,0.75);

        Stage.Draw(g);
        g.SetDepthTesting(false);

        if(GameObjects.player.spcDeathTimer > 0)
            GameObjects.Draw(g);

        g.transf.Ortho2D(this.Super.canvas.width,this.Super.canvas.height);
        g.transf.Identity();
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        if(GameObjects.player.hurtTimer > 0)
        {
            var transValue = 1.0 - Math.abs(GameObjects.player.hurtTimer-30) / 30.0;

            g.ChangeShader(ShaderType.NoTexture);
            g.eff.SetColor(1.0,0.0,0.0,0.35*transValue);
            g.eff.Use();

            g.FillRect(0,0,320,240);

            g.eff.Reset();
            g.ChangeShader(ShaderType.Default);
        }

        g.SetDepthTesting(false);
        if(GameObjects.boss.heart.exploded == false)
            HUD.Draw(g);

        if(GameObjects.player.spcDeathTimer > 0)
            GameObjects.DrawInCanvasSize(g);

    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if(GameObjects.player.spcDeathTimer > 0)
            GameObjects.Update(timeMod);
            
        Stage.Update(timeMod);

        Camera.Limit();
        Camera.Update(timeMod);

        HUD.Update(timeMod);

        Status.Update(timeMod);

        /* This will be removed eventually */
        if((Controls.keystate[225] == State.Down || Controls.keystate[18] == State.Down) && Controls.keystate[82] == State.Pressed)
        {
            Status.health = -1;
        }

        if((Controls.keystate[225] == State.Down || Controls.keystate[18] == State.Down) && Controls.keystate[84] == State.Pressed)
        {
            ref.currentScene = "title";
        }

        if(Fade.timer <= 0 &&  GameObjects.player.dead && GameObjects.player.deathTimer <= 0)
        {
            this.Super.scenes.gameover.Set(this.Super.graphics);
            ref.currentScene = "gameover";
        }

        if(Status.victory && Fade.timer <= 0)
        {
            Fade.Set(function()
            {
                ref.currentScene = "gameover";
            },1.0,FadeMode.In);
        }
        
        if(Fade.timer <= 0 && Status.victory == false)
        {
            if(VPad.buttons.enter.state == State.Pressed)
            {
                MasterAudio.Fade(0.5,1.0);
                ref.currentScene = "pause";
                ref.scenes.pause.Set(this.Super.graphics);
            }
        }
    }

    /*! On loaded */
    OnLoaded()
    {
        MasterAudio.PlayMusic(Assets.music.theme,0.0,true);
        MasterAudio.Fade(1.0,0.017);
    }
}