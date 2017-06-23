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
        this.deathTimer = 0;
        this.bumpTimer = 0;
        this.bumpWaitTimer = 0;

        this.hurtTimer = 0;

        this.asteroidTimer = 120 + Math.random()*120;
        this.asteroidPhase = 0;
        this.colorModTimer = 0;

        this.shurikens = new Array(4);
        for(var i = 0; i < this.shurikens.length; i++)
        {
            this.shurikens[i] = 
            {
                x: 0,
                y: 0,
                radius: 0,
                angle : Math.PI/2 * i,
                centerAngle : Math.random()*Math.PI*2,
                sinMod : i * (Math.PI / 3),
                active: false,
            }
        }
        this.shurikenDeathTimer = 0;

        this.phase = 0;
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
                (0.01 + Math.random()*0.025)*shootDir/2,
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
                (0.01 + Math.random()*0.025)*shootDir/2,
                0.5 + Math.random()*0.9
            );
        }
    
    }

    /*! Shoot an asteroid (or two) */
    ShootBullet()
    {
        var shootDir = Math.random() >= 0.5 ? -1 : 1;
        if(Math.random() >= 0.5)
        {
            GameObjects.CreateBullet(
                Camera.x-(1.8)*shootDir,
                Camera.y-1.5 + Math.random()*3.0,
                (0.01 + Math.random()*0.025)*shootDir * 0.5,
                Math.random()*0.02 - 0.01,
                1,BulletType.Enemy);

        }
        else
        {
            GameObjects.CreateBullet(
                Camera.x-1.8 + Math.random()*3.6,
                Camera.y-(1.5)*shootDir,
                Math.random()*0.02 - 0.01,
                (0.01 + Math.random()*0.025)*shootDir * 0.5,
                1,BulletType.Enemy);
        }
    
    }

    /*! Update shurikens
     * @param timeMod Time modifier
     */
    UpdateShurikens(timeMod)
    {
        for(var i = 0; i < this.shurikens.length; i++)
        {
            var o = this.shurikens[i];

            if(o.active)
            {
                if(o.radius < 1.0 + this.phase * 0.1)
                {
                    o.radius += 0.01 * timeMod;
                    if(o.radius > 1.0+ this.phase * 0.1)
                        o.radius = 1.0+ this.phase * 0.1;
                }
                o.sinMod += 0.035 * timeMod;

                var rad = o.radius + (Math.sin(o.sinMod))* (0.25+0.025*this.phase ) ;

                o.x = this.x-Math.cos(o.angle) * rad;
                o.y = this.y-Math.sin(o.angle) * rad;

                o.centerAngle += 0.1 * timeMod;
            }
            else if(Status.bossHealth < 10000 - (i+1)*2000)
            {
                o.active = true;
                this.phase++;
            }

            o.angle += (0.025-0.0025*this.phase) * timeMod;
        }
    }

    /*! Death comes
     * @param timeMod The amount of kittens in your... mouth!
     */
    Die(timeMod)
    {
        if(this.shurikenDeathTimer > 0)
            this.shurikenDeathTimer -= 1.0 * timeMod;

        this.deathTimer += 1.0 * timeMod;
        if(this.deathTimer >= 120)
        {
            if(Stage.platformDead == false)
            {
                Stage.platformDead = true;
                Stage.platformTimer = 180;
                MasterAudio.PlaySound(Assets.sounds.weird,1.0);
            }
        }
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {

        this.bumpWaitTimer += (1.0 + 1.0 - 1.0/10000 * Status.bossHealth) * (this.dead ? 2 : 1) * timeMod;
        if(this.bumpWaitTimer >= 45)
        {
            MasterAudio.PlaySound(Assets.sounds.heart,1.0);
            this.bumpWaitTimer -= 45;
            this.bumpTimer = 15;
        }

        if(this.bumpTimer > 0)
        {
            this.bumpTimer -= (1.0 + 1.0 - 1.0/10000 * Status.bossHealth) * timeMod;
            if(this.bumpTimer < 0)
                this.bumpTimer = 0.0;
        }

        if(this.dead)
        {
            this.Die(timeMod);
            return;
        }

        // DEATH!
        if(Status.bossHealth <= 0)
        {
            for(var i = 0; i < GameObjects.bullets.length; i++)
            {
                if(GameObjects.bullets[i].type == BulletType.Enemy && GameObjects.bullets[i].exist)
                {
                    GameObjects.bullets[i].exist = false;
                    GameObjects.bullets[i].deathTimer = 30;
                }
            }

            for(var i = 0; i < GameObjects.asteroids.length; i++)
            {
                if(GameObjects.asteroids[i].exist)
                {
                    GameObjects.asteroids[i].exist = false;
                    GameObjects.asteroids[i].deathTimer = 30;
                }
            }

            this.hurtTimer = 0;
            this.shurikenDeathTimer = 30;
            this.dead = true;
            
            MasterAudio.Fade(0.0,0.-0.005);
            MasterAudio.PlaySound(Assets.sounds.bump,1.0);

            return;
        }

        if(this.hurtTimer > 0)
            this.hurtTimer -= 1.0 * timeMod;

        this.asteroidTimer -= 1.0 * timeMod;
        if(this.asteroidTimer < 0)
        {
            this.asteroidTimer = 120 + 60 * Math.random()  + 60*this.asteroidPhase;

            if(this.asteroidPhase == 0)
            {
                for(var i = 0; i < 9 + this.phase + Math.random()*(6+this.phase*2); i++)
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

                if(this.phase >= 2)
                {
                    for(var i = 0; i < 6 + this.phase*3 + Math.random()*(6+this.phase*2); i++)
                    {
                        this.ShootBullet();
                    }
                }
            }
            else if(this.asteroidPhase == 2)
            {
                for(var i = 0; i < GameObjects.asteroids.length; i++)
                {
                    if(GameObjects.asteroids[i].exist == false) continue;

                    var o = GameObjects.asteroids[i];
                    var angle = Math.random() * Math.PI * 2;
                    o.speed.x = Math.cos(angle)* (Math.random()*0.015 + 0.01);
                    o.speed.y = Math.sin(angle)* (Math.random()*0.015 + 0.01);
                }
            }

            if(this.asteroidPhase != 0)
            {
                this.colorModTimer  = 20;

                if(this.asteroidPhase == 1 && this.phase >= 2)
                    MasterAudio.PlaySound(Assets.sounds.enemyShoot,0.7);
                else
                    MasterAudio.PlaySound(Assets.sounds.getBack,0.7);
            }

            this.asteroidPhase++;
            if(this.asteroidPhase == 3)
                this.asteroidPhase = 0;
        }

        if(this.colorModTimer  > 0)
            this.colorModTimer  -= 1.0 * timeMod;

        this.UpdateShurikens(timeMod);
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

        for(var i = 0; i < this.shurikens.length; i++)
        {
            var o = this.shurikens[i];

            if(o.active)
            {
                dist = Math.hypot(o.x-b.x,o.y-b.y);
                if(dist < 0.375)
                {
                    b.exist = false;
                    b.deathTimer = 30;
                }
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

        if(dist < 0.45)
        {
            p.Hurt();
        }

        for(var i = 0; i < this.shurikens.length; i++)
        {
            var o = this.shurikens[i];

            if(o.active)
            {
                dist = Math.hypot(o.x-p.x,o.y-p.y);
                if(dist < 0.425)
                {
                    p.Hurt();
                }
            }
        }
    }

    /*! Draw shurikens
     * @paramg g Graphics object
     */
    DrawShurikens(g)
    {
        var scale = 0.75;

        if(this.dead)
        {
            if(this.shurikenDeathTimer > 0)
            {
                var mod = 1.0/30.0 *  this.shurikenDeathTimer;
                g.eff.SetColor(mod,mod,mod,mod);
                g.eff.Use();

                scale += 1.0- mod;
            }
            else
                return;
        }

        for(var i = 0; i < this.shurikens.length; i++)
        {
            var o = this.shurikens[i];

            if(o.active)
            {
                g.DrawRegularBitmapPortion(Assets.textures.palm,o.x,o.y,2,1,0,o.centerAngle,scale,scale);
            }
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        g.eff.SetColor(1,1,1,1);
        g.eff.Use();

        this.DrawShurikens(g);

        g.eff.SetColor(1,1,1,1);
        g.eff.Use();

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