/*! Sound effect
 * @author Jani Nykänen
 */

/*! Sound effect class */
class Sound
{
    /*! Constructor */
    constructor()
    {
        this.sound = null;
    }

    /*! Play track */
    Play(vol)
    {
        if(this.sound != null)
        {
            this.sound.volume(vol);
            this.sound.stop();
            this.sound.play();
        }
    }
}