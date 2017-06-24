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
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        g.ChangeShader(ShaderType.Default);
        g.SetDepthTesting(false);
        g.ClearScreen(0.0,0.0,0.0);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();
        g.eff.Use();

        g.DrawScaledBitmap(Assets.textures.logo,0,0,320,240);
        
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if(Controls.mousestate[0] == State.Pressed)
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
    }

    /*! On loaded */
    OnLoaded()
    {

    }
}