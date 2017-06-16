/*! Bullet
 * @author Jani Nykänen
 */

BulletType =
{
    Friendly : 0,
    Enemy : 1,
    Special : 2,
}

/*! Bullet class */
class Bullet {

    /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.speed = {x:0,y:0};
        this.type = BulletType.Friendly;
        this.exist = false;   
    }

    /*! Create bullet
     * @param x X coordinate
     * @param y Y coordinate
     * @param sx Speed x
     * @param sy Speed y
     * @param type Bullet type
     */
    Create(x,y,sx,sy,type)
    {
        this.x = x;
        this.y = y;
        this.speed.x = sx;
        this.speed.y = sy;
        this.type = type;
        this.exist = true;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist == false) return;

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        if(this.x < -2.3* (4/3) || this.x > 2.3* (4/3) || this.y < -2.8 || this.y > 2.8)
        {
            this.exist = false;
        }
    }

    /*! Draw
     * @param g Graphics object
     */
    Draw(g)
    {
        if(this.exist == false
        || (this.x < (Camera.x-1.1)* (4/3) || this.x > (Camera.x+1.1)* (4/3) || this.y < Camera.y-1.1 || this.y > Camera.y+1.1)
        ) return;

        var scale = 0.175;

        g.eff.Reset();
        if(this.type == BulletType.Special)
        {
            g.eff.SetColor(255.0,255.0,255.0,1.0);
            scale = 0.25;
        }
        g.eff.Use();

        g.DrawCenteredBitmap(Assets.textures.bullet,this.x,this.y,0,scale,scale);
    }
}