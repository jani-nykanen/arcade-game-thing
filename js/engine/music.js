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
            this.track.volume = vol;
            this.track.play();
        }
    }

    /*! Add volume for fade out and fade in effect
     * @param amount How much
     */
    AddVolume(amount)
    {
        var vol = this.track.volume;
        vol += amount;
        if(vol < 0.0)
        {
            vol = 0.0;
        }
        else if(vol > 1.0)
        {
            vol = 1.0;
        }
        this.track.volume = vol;
    }
}