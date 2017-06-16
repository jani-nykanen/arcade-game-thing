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

    /*! On bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(b.exist == false) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(dist < 0.7)
        {
            b.exist = false;
            b.deathTimer = 30;
        }
    }

    /*! On player collision
     * @param p Player
     */
    OnPlayerCollision(p)
    {
        var dist = Math.hypot(this.x-p.x,this.y-p.y);

        if(dist < 0.75)
        {
            var angle = Math.atan2(this.y-p.y,this.x-p.x);
            p.x -= Math.cos(angle) * (0.75-dist);
            p.y -= Math.sin(angle) * (0.75-dist);
        }
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