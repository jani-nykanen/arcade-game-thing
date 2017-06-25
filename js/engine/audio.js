/*! Audio master
 * @author Jani Nykänen
 */

/*! Audio master class */
class MasterAudio
{
    /*! Initialize */
    static Init()
    {
        this.soundVol = 1.0;
        this.musicVol = 1.0;

        this.currentTrack = null;

        this.doFade = 0;
        this.fadeSpeed = 0;
        this.doFade = false;
    }

    /*! Set global sound volume
     * @param vol Volume
     */
    static SetSoundVolume(vol)
    {
        this.soundVol = vol;
        Howler.volume(vol);
    }

    /*! Set global music volume
     * @param vol Volume
     */
    static SetMusicVolume(vol)
    {
        this.musicVol = vol;
    }

    /*! Play music
     * @param m Music track
     * @param vol Volume
     * @param loop Loop
     */
    static PlayMusic(m,vol,loop)
    {
        m.track.currentTime = 0;
        m.Play(this.musicVol*vol,loop);
        this.currentTrack = m.track;
    }

    /*! Play sound
     * @param s Sound
     * @param vol Volume
     */
    static PlaySound(s,vol)
    {
        if(this.soundVol == 0.0) return;
        s.Play(vol*this.soundVol);
    }

    /*! Fade in music
     * @param target Target volume
     * @param speed Speed
     */
    static Fade(target, speed)
    {
        if(this.musicVol == 0.0) return;

        this.doFade = true;
        this.fadeSpeed = speed;
        this.target = target;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.doFade)
        {
            var vol = this.currentTrack.volume;
            vol += this.fadeSpeed;
            if( (this.fadeSpeed > 0 && vol > this.target) 
                || (this.fadeSpeed < 0 && vol < this.target ) )
            {
                vol = this.target;
                this.doFade = false;
            }

            this.currentTrack.volume = vol;
        }
    }
}