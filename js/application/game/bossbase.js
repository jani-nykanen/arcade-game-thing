/*! Boss base
 * @author Jani Nykänen
 */

/*! Boss base class */
class BossBase
{
    /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.plantScaleMod = 0.0;
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        this.plantScaleMod += 0.05 * timeMod;
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {
        g.eff.Reset();
        g.eff.Use();
        
        var pscale = 0.95 + 0.05 * Math.sin(this.plantScaleMod);

        g.DrawCenteredBitmap(Assets.textures.plant,this.x,this.y,0,1.75*pscale,1.75*pscale);
        g.DrawCenteredBitmap(Assets.textures.face1,this.x,this.y,0,1.0,1.0);
    }
}