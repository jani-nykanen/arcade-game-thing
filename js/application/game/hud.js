/*! HUD
 * @author Jani Nykänen
 */

/*! HUD class */
class HUD
{
    /*! Initialize */
    static Init(gl)
    {
        this.font = new BitmapFont(gl,16,16);
        this.timeMod = 0;
    }

    /*! Update HUD
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.timeMod = timeMod;
    }

    /*! Draw HUD
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"Press F4 to go full screen",2,240-16,0);
        g.DrawText(this.font,Assets.textures.font16,"FPS: " + (Math.round(60.0/this.timeMod)).toString() ,2,2,0);
    }
}