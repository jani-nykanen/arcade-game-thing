/*! Music track
 * @author Jani Nykänen
 */

class Music
{
    /*! Constructor */
    constructor()
    {
        this.track = null;
    }

    /*! Play track */
    Play(vol,loop)
    {
        if(this.track != null)
        {
            this.track.loop = loop;
            this.track.vol = vol;
            this.track.play();
        }
    }
}