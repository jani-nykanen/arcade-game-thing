/*! Heart
 * @author Jani Nykänen
 */

/*! Heart class */
class Heart
{
        /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.dead = false;
        this.bumpTimer = 0;
        this.bumpWaitTimer = 0;
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        this.bumpWaitTimer += 1.0 * timeMod;
        if(this.bumpWaitTimer >= 45)
        {
            this.bumpWaitTimer -= 45;
            this.bumpTimer = 15;
        }

        if(this.bumpTimer > 0)
        {
            this.bumpTimer -= 1.0 * timeMod;
            if(this.bumpTimer < 0)
                this.bumpTimer = 0.0;
        }
    }

    /*! Check bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {

    }

    /*! On player collision
     * @param p Player
     */
    OnPlayerCollision(p)
    {

    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        g.eff.Reset();
        g.eff.Use();

        var scale = 1.25 + 0.25/15 * this.bumpTimer;

        g.DrawCenteredBitmap(Assets.textures.heart,this.x,this.y,0,scale,scale);
    }
}