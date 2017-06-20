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
        this.deathTimer = 0;
        this.power = 0;
        this.sizeMod = 1;
    }

    /*! Create bullet
     * @param x X coordinate
     * @param y Y coordinate
     * @param sx Speed x
     * @param sy Speed y
     * @param type Bullet type
     */
    Create(x,y,sx,sy,pow,type,sizeMod)
    {
        this.x = x;
        this.y = y;
        this.speed.x = sx;
        this.speed.y = sy;
        this.power = pow;
        this.type = type;
        this.exist = true;
        this.deathTimer = 0;
        this.sizeMod = sizeMod === null ? 1 : sizeMod;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist == false)
        {
            if(this.deathTimer > 0)
            {
                if(this.deathTimer == 30 && this.type == BulletType.Special)
                {
                    Camera.Shake(30,4 * this.sizeMod);
                }
                this.deathTimer -= 1.0 * timeMod;
                
            }

            return;   
        }

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        if(this.x < -2.3* (4/3) || this.x > 2.3* (4/3) || this.y < -2.8 || this.y > 2.8)
        {
            this.exist = false;
            this.deathTimer = 0.0;
        }
    }

    /*! Draw
     * @param g Graphics object
     */
    Draw(g)
    {
        if( (this.exist == false && this.deathTimer <= 0)
            || (this.x < (Camera.x-1.1)* (4/3) || this.x > (Camera.x+1.1)* (4/3) || this.y < Camera.y-1.1 || this.y > Camera.y+1.1)
        ) return;

        var scale = 0.175;

        if(this.exist == false)
        {
            if(this.type == BulletType.Special)
            {
                scale = 0.25 + (1.0 - 1.0/30.0*this.deathTimer)*0.75;
                scale *= this.sizeMod;
            }
            else
            {
                scale = 0.175 + (1.0 - 1.0/30.0*this.deathTimer)*0.125;
            }
        }

        g.eff.Reset();
        if(this.type == BulletType.Special)
        {
            if(this.deathTimer > 0 && !this.exist)
            {
                g.eff.SetColor(255.0,255.0,255.0,1.0/30.0 * this.deathTimer);
            }
            else
            {
                g.eff.SetColor(255.0,255.0,255.0,1.0);
                scale = 0.25 * this.sizeMod;
            }
        }
        else if(this.deathTimer > 0 && !this.exist)
        {
            var trval = 1.0/30.0 * this.deathTimer;
            g.eff.SetColor(1.0,1.0,1.0,trval);
        }
        g.eff.Use();

        // g.DrawCenteredBitmap(Assets.textures.bullet,this.x,this.y,0,scale,scale);
        var ix = this.type == BulletType.Enemy ? 1 : 0;
        g.DrawRegularBitmapPortion(Assets.textures.bullet,this.x,this.y,2,ix,0,0,scale,scale);
    }
}