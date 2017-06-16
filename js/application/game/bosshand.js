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
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
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
        if(b.exist == false) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(dist < 0.325)
        {
            this.hurtTimer = 30;
            b.exist = false;
            b.deathTimer = 30;
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        for(var i = 0; i < this.ringPos.length; i ++)
        {
            g.DrawCenteredBitmap(Assets.textures.ring,this.ringPos[i].x,this.ringPos[i].y,0,0.35,0.35);
        }

        g.eff.Reset();
        if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/2) % 2 == 0)
        {
            g.eff.SetColor(2.0,0.0,0.0,1.0);
        }
        g.eff.Use();

        g.DrawCenteredBitmap(Assets.textures.palm,this.x,this.y,-this.angle - Math.PI /2,0.75,0.75);

        g.eff.Reset();
        g.eff.Use();
    }
    
}