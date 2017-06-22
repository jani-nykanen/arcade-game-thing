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

        this.hurtTimer = 0;

        this.asteroidTimer = 120 + Math.random()*120;
        this.asteroidPhase = 0;

        this.colorModTimer = 0;
    }

    /*! Shoot an asteroid (or two) */
    ShootAsteroid()
    {
        var shootDir = Math.random() >= 0.5 ? -1 : 1;
        if(Math.random() >= 0.5)
        {
            GameObjects.CreateAsteroid(
                (-3.2)*shootDir,
                -2.4 + Math.random()*4.8,
                (0.01 + Math.random()*0.025)*shootDir/1.25,
                Math.random()*0.03 - 0.015,
                0.5 + Math.random()*0.9
            );

        }
        else
        {
            GameObjects.CreateAsteroid(
                (-2.4 + Math.random()*4.8)*(4/3),
                (-4.0 * 3/4)*shootDir,
                Math.random()*0.03 - 0.015,
                (0.01 + Math.random()*0.025)*shootDir/1.25,
                0.5 + Math.random()*0.9
            );
        }
    
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

        if(this.hurtTimer > 0)
            this.hurtTimer -= 1.0 * timeMod;

        this.asteroidTimer -= 1.0 * timeMod;
        if(this.asteroidTimer < 0)
        {
            this.asteroidTimer = 120 + 60 * Math.random()  + 60*this.asteroidPhase;

            if(this.asteroidPhase == 0)
            {
                for(var i = 0; i < 16 + Math.random()*12; i++)
                {
                    this.ShootAsteroid();
                }
            }
            else if(this.asteroidPhase == 1)
            {
                for(var i = 0; i < GameObjects.asteroids.length; i++)
                {
                    if(GameObjects.asteroids[i].exist == false) continue;

                    var o = GameObjects.asteroids[i];
                    o.speed.x = 0;
                    o.speed.y = 0;
                }
            }
            else if(this.asteroidPhase == 2)
            {
                for(var i = 0; i < GameObjects.asteroids.length; i++)
                {
                    if(GameObjects.asteroids[i].exist == false) continue;

                    var o = GameObjects.asteroids[i];
                    var angle = Math.random() * Math.PI * 2;
                    o.speed.x = Math.cos(angle)* (Math.random()*0.025 + 0.01);
                    o.speed.y = Math.sin(angle)* (Math.random()*0.025 + 0.01);
                }
            }

            if(this.asteroidPhase != 0)
                this.colorModTimer  = 20;

            this.asteroidPhase++;
            if(this.asteroidPhase == 3)
                this.asteroidPhase = 0;
        }

        if(this.colorModTimer  > 0)
            this.colorModTimer  -= 1.0 * timeMod;
    }

    /*! Check bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(b.exist == false || b.type == BulletType.Enemy || this.dead) return;

        var scale = 1.25 + 0.25/15 * this.bumpTimer;
        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(dist < 0.40 * scale)
        {
            Status.bossHealth -= b.power;
            Status.AddPoints(b.type == BulletType.Friendly ? 20 : 2000);
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
        if(this.dead) return;

        var dist = Math.hypot(this.x-p.x,this.y-p.y);

        if(dist < 0.45)
        {
            p.Hurt();
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        g.eff.SetColor(1,1,1,1);

        var scale = 1.25 + 0.25/15 * this.bumpTimer;

        if(this.hurtTimer > 0 && Math.floor(this.hurtTimer / 4) % 2 == 0)
        {
            g.eff.SetColor(2.0,0.5,0.5,1.0);
        }
        else if(this.colorModTimer  > 0)
        {
            var mod = 1- Math.abs(this.colorModTimer-10)/10.0;
            g.eff.SetColor(1.0+3*mod,1.0+3*mod,1.0+3*mod,1.0);
        }
        g.eff.Use();

        g.DrawCenteredBitmap(Assets.textures.heart,this.x,this.y,0,scale,scale);
    }
}