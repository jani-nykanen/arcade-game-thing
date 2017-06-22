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
        m.Play(this.musicVol*vol,loop);
    }

    /*! Play sound
     * @param s Sound
     * @param vol Volume
     */
    static PlaySound(s,vol)
    {
        s.Play(vol);
    }
}