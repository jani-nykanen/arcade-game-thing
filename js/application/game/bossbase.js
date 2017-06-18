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
        this.plantSize = 0;
        this.plantDying = false;
        this.plantDead = false;
        this.hurtTimer = 0;
        this.faceDead = false;
        this.faceDeathTimer = 0;
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        if(this.plantDead == false)
        {
            if(this.plantDying == false)
            {
                this.plantScaleMod += 0.05 * timeMod;
                this.plantSize = 0.95 + 0.05 * Math.sin(this.plantScaleMod);

                if(Status.handsDefeated >= 4)
                    this.plantDying = true;
            }
            else
            {
                this.plantSize -= 0.005 * timeMod;
                if(this.plantSize < 0.625)
                {
                    this.plantDead = true;
                }
            }
        }
        else
        {
            if(this.hurtTimer > 0)
                this.hurtTimer -= 1.0 * timeMod;

            if(this.faceDeathTimer > 0)
                this.faceDeathTimer -= 0.5 * timeMod;

            if(!this.faceDead && Status.bossHealth <= 3000)
            {
                this.faceDeathTimer = 60;
                this.faceDead = true;
                Camera.Shake(60,6);
            }
        }
    }

    /*! On bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(b.exist == false) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(this.plantDead == false && dist < 0.7)
        {
            b.exist = false;
            b.deathTimer = 30;
        }
        else if(dist < 0.45)
        {
            Status.bossHealth -= b.power;
            Status.AddPoints(b.type == BulletType.Friendly ? 10 : 1000);
            if(this.hurtTimer <= 0)
                this.hurtTimer = 30;
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

        if(this.plantDead == false && dist < 0.75)
        {
            var angle = Math.atan2(this.y-p.y,this.x-p.x);
            p.x -= Math.cos(angle) * (0.75-dist);
            p.y -= Math.sin(angle) * (0.75-dist);
        }
        else if(dist < 0.5)
        {
            p.Hurt();
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {
        g.eff.Reset();
        if(this.plantDead == false)
        {
            var pscale = this.plantSize;
            g.DrawCenteredBitmap(Assets.textures.plant,this.x,this.y,0,1.75*pscale,1.75*pscale);
        }
        else
        {
            if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/4) % 2 == 0)
            {
                g.eff.SetColor(2.0,0.5,0.5,1.0);
            }
        }
        g.eff.Use();

        g.DrawCenteredBitmap(Status.bossHealth <= 3000 ? Assets.textures.face2 : Assets.textures.face1,
            this.x,this.y,0,1.0,1.0);

        if(this.faceDead && this.faceDeathTimer > 0)
        {
            var alpha = 1.0/60.0 * this.faceDeathTimer;
            g.eff.SetColor(alpha,alpha,alpha,alpha);
            g.eff.Use();

            g.DrawCenteredBitmap(Assets.textures.face1,
                this.x,this.y,0,1.0 + 2*(1-alpha),1.0 + 2*(1-alpha));
        }
    }
}