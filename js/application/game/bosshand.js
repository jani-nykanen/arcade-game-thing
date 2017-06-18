/*! Boss hand
 * @author Jani Nykänen
 */

/*! Boss hand class */
class BossHand
{
    /*! Constructor 
     * @param angle Hand angle
     */
    constructor(angle,index)
    {
        this.angle = angle;
        this.radius = 1.5;
        this.radStart = 1.65;
        this.radMod = angle;

        this.index = index;

        this.x = 0;
        this.y = 0;

        this.ringPos = new Array(6);
        for(var i = 0; i < this.ringPos.length; i++)
        {
            this.ringPos[i] = {x:0,y:0};
        }

        this.hurtTimer = 0;

        this.dead = false;
        this.deathTimer = 0;
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        if(this.dead)
        {
            if(this.deathTimer > 0)
                this.deathTimer -= 1.0 * timeMod;

            return;
        }

        this.x = Math.sin(this.angle) * this.radius;
        this.y = Math.cos(this.angle) * this.radius;

        this.radMod += 0.035 * timeMod;

        this.radius = this.radStart + Math.sin(this.radMod) * 0.35;

        var dist = 0;

        for(var i = 0; i < this.ringPos.length; i ++)
        {
            dist =  0.5 + ( (this.radius-0.5)/this.ringPos.length * i );

            var sign = (this.index == 0 || this.index == 2) ? 1 : -1;

            this.ringPos[i].x = Math.cos(this.angle) * dist * sign;
            this.ringPos[i].y = Math.sin(this.angle) * dist * sign;
        }
    
        if(this.hurtTimer > 0)
        {
            this.hurtTimer -= 1.0 * timeMod;
        }

    }

    /*! On bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(this.dead || b.exist == false || b.type == BulletType.Enemy) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(dist < 0.325)
        {
            Status.bossHealth -= b.power;
            Status.AddPoints(b.type == BulletType.Friendly ? 10 : 1000);
            if(this.hurtTimer <= 0)
                this.hurtTimer = 30;
            b.exist = false;
            b.deathTimer = 30;

            if(Status.bossHealth < 10000 - 400 * (Status.handsDefeated+1) - 200 * Math.pow(Status.handsDefeated,2))
            {
                this.dead = true;
                Status.handsDefeated ++;
                this.deathTimer = 60;
                Camera.Shake(60,4);

                var timeBonus = 10000 - Math.floor( ( (Status.time - Status.handsDefeated*(60*20) ) / (60 * 30) ) * 10000 );

                if(timeBonus < 0)
                    timeBonus = 0;

                GameObjects.CreateMessage("Time bonus:\n   " + String(timeBonus),64,96,-3);
                Status.score += timeBonus;
            }
        }
    }

    /*! On player collision
     * @param p Player
     */
    OnPlayerCollision(p)
    {
        if(this.dead) return;

        var dist = Math.hypot(this.x-p.x,this.y-p.y);

        if(dist < 0.375)
        {
            p.Hurt();
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        if(this.dead && this.deathTimer <= 0) return;

        if(this.dead)
        {
            var alpha = 1.0/60.0 * this.deathTimer;
            g.eff.SetColor(alpha,alpha,alpha,alpha);
            g.eff.Use();
        }

        for(var i = 0; i < this.ringPos.length; i ++)
        {
            g.DrawCenteredBitmap(Assets.textures.ring,this.ringPos[i].x,this.ringPos[i].y,0,0.35,0.35);
        }

        var scale = 0.75;

        g.eff.Reset();
        if(!this.dead)
        {
            if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/4) % 2 == 0)
            {
                g.eff.SetColor(2.0,0.5,0.5,1.0);
            }
        }
        else
        {
            var alpha = 1.0/60.0 * this.deathTimer;
            var whiteness = 255 * (1-alpha) + 1.0;
            g.eff.SetColor(whiteness,whiteness,whiteness,alpha);

            scale += 1.0-alpha;
        }
        g.eff.Use();

        g.DrawCenteredBitmap(Assets.textures.palm,this.x,this.y,-this.angle - Math.PI /2,scale,scale);

        g.eff.Reset();
        g.eff.Use();
    }
    
}