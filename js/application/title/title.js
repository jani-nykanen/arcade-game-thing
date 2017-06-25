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
        this.phase = 1;

        Menu.Init();
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        if(this.phase == 1)
        {
            Menu.Draw(g);
        }
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        if(this.phase == 1)
        {
            Menu.Update(timeMod);
        }
    }

    /*! On loaded */
    OnLoaded()
    {

    }
}

