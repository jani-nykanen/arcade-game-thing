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

    /*! Draw score
     * @param g Graphics object
     */
    static DrawScore(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"SCORE:" ,160 - 4*8,0,0);
        g.DrawText(this.font,Assets.textures.font24,"00000000" ,160 - 8*8,11,0,-12);
    }

    /*! Draw HUD
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"FPS: " + (Math.round(60.0/this.timeMod)).toString() ,2,240-16,0);

        this.DrawScore(g);
    }
}