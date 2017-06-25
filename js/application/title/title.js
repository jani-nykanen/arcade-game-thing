/*! Title screen scene
 * @author Jani Nykänen
 */

/*! Title screen class */
class TitleScreen extends Scene
{
    /*! Init, see scene.js */
    Init(g,Super)
    {
        this.Super = Super;
        this.phase = 0;

        Menu.Init();
        Creator.Init();
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        if(this.phase == 1)
        {
            Menu.Draw(g);
        }
        else if(this.phase == 0)
        {
            Creator.Draw(g);
        }
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if(Fade.timer > 0) return;

        if(this.phase == 1)
        {
            Menu.Update(timeMod);
        }
        else if(this.phase == 0)
        {
            Creator.Update(timeMod);
            if(Creator.finished)
                this.phase = 1;
        }
    }

    /*! On loaded */
    OnLoaded()
    {
        MasterAudio.PlayMusic(Assets.music.menu,0.0,true);
        MasterAudio.Fade(1.0,0.017);
    }
}

