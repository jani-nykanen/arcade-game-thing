/*! Asteroid
 * @author Jani Nykänen
 */

/*! Bullet
 * @author Jani Nykänen
 */

/*! Asteroid class */
class Asteroid {

    /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.speed = {x:0,y:0};
        this.exist = false;   
        this.sizeMod = 1;
        this.angle = 0.0;
    }

    /*! Create asteroid
     * @param x X coordinate
     * @param y Y coordinate
     * @param sx Speed x
     * @param sy Speed y
     * @param sizeMod Size modifier
     */
    Create(x,y,sx,sy,sizeMod)
    {
        this.x = x;
        this.y = y;
        this.speed.x = sx;
        this.speed.y = sy;
        this.exist = true;
        this.sizeMod = sizeMod === null ? 1 : sizeMod;
        this.angle = Math.random() * Math.PI * 2;
    }

    OnBulletCollision(b)
    {
        if(this.dead || b.exist == false) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(dist < 0.325*this.sizeMod)
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
        if(this.exist == false) return;

        var dist = Math.hypot(this.x-p.x,this.y-p.y);

        if(dist < 0.5*this.sizeMod - 0.15)
        {
            p.Hurt();
        }
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist == false) return;

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        if(this.x < -2.8* (4/3) || this.x > 2.8* (4/3) || this.y < -3.2 || this.y > 3.2)
        {
            this.exist = false;
        }

        this.angle += Math.hypot(this.speed.x,this.speed.y) * timeMod;
    }

    /*! Draw
     * @param g Graphics object
     */
    Draw(g)
    {

        if( this.exist == false || 
            (this.x < (Camera.x-1.25)* (4/3) || this.x > (Camera.x+1.25)* (4/3) || this.y < Camera.y-1.25 || this.y > Camera.y+1.25)
        ) 
            return;

        var scale = 0.5 * this.sizeMod;
        g.DrawCenteredBitmap(Assets.textures.asteroid,this.x,this.y,this.angle,scale,scale);
    }
}