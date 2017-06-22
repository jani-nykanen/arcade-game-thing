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
        this.speed = {x:0,y:0};
        this.target = {x:0,y:0};
        this.angle = 0;
        this.plantScaleMod = 0.0;
        this.plantSize = 0;
        this.plantDying = false;
        this.plantDead = false;
        this.hurtTimer = 0;
        this.faceDead = false;
        this.faceDeathTimer = 0;

        this.ringPos = new Array(8);
        for(var i = 0; i < this.ringPos.length; i++)
        {
            this.ringPos[i] = {x:0,y:0};
        }

        this.dead = false;
        this.deathTimer = 0;

        this.shootTimer = 0;
        this.colorModTimer = 0;
        this.shootPhase = 0;
    }

    /*! Calculate ring positions */
    CalculateRingPos()
    {
        var radius = Math.hypot(this.x,this.y);
        var dist = 0;

        for(var i = 0; i < this.ringPos.length; i ++)
        {
            dist =  ( (radius)/this.ringPos.length * i );

            this.ringPos[i].x = Math.cos(this.angle) * dist;
            this.ringPos[i].y = Math.sin(this.angle) * dist;
        }
    }

    /*! Special movement, if hp <= 3000
     * @param timeMod Time modifier
     */
    SpecialMovement(timeMod)
    {
        var pangle = Math.atan2(this.y-GameObjects.player.y,this.x-GameObjects.player.x);
        
        this.target.x = -Math.cos(pangle) * 0.035;
        this.target.y = -Math.sin(pangle) * 0.035;

        if(this.target.x > this.speed.x)
        {
            this.speed.x += 0.00025 * timeMod;
            this.speed.x = this.speed.x > this.target.x ? this.target.x : this.speed.x;
        }
        else if(this.target.x < this.speed.x)
        {
            this.speed.x -= 0.00025 * timeMod;
            this.speed.x = this.speed.x < this.target.x ? this.target.x : this.speed.x;
        }

        if(this.target.y > this.speed.y)
        {
            this.speed.y += 0.00025 * timeMod;
            this.speed.y = this.speed.y > this.target.y ? this.target.y : this.speed.y;
        }
        else if(this.target.y < this.speed.y)
        {
            this.speed.y -= 0.00025 * timeMod;
            this.speed.y = this.speed.y < this.target.y ? this.target.y : this.speed.y;
        }

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        this.angle = Math.atan2(this.y,this.x);
        if(Math.hypot(this.x,this.y) > 2.45)
        {
            this.x = Math.cos(this.angle)*2.45;
            this.y = Math.sin(this.angle)*2.45;

            this.speed.x *= -1;
            this.speed.y *= -1;
        }
        this.CalculateRingPos();
    }

    /*! Shoot bullets */
    Shoot()
    {
        MasterAudio.PlaySound(Assets.sounds.enemyShoot,0.7);

        var sx,sy;

        for(var angle = 0; angle < Math.PI*2; angle += Math.PI*2 / 24 )
        {
            sx =  -Math.cos(angle) * 0.0135;
            sy =  -Math.sin(angle) * 0.0135;

            GameObjects.CreateBullet(
                        0,
                        0,
                        sx,
                        sy,1, BulletType.Enemy);
        }
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
                (0.01 + Math.random()*0.025)*shootDir /2,
                Math.random()*0.02 - 0.01,
                0.5 + Math.random()*0.75
            );

        }
        else
        {
            GameObjects.CreateAsteroid(
                (-2.4 + Math.random()*4.8)*(4/3),
                (-4.0 * 3/4)*shootDir,
                Math.random()*0.02 - 0.01,
                (0.01 + Math.random()*0.025)*shootDir /2,
                0.5 + Math.random()*0.75
            );
        }
    
    }

    /*! Shooting routines 
     * @param timeMod Time modifier 
     */
    ShootingRoutines(timeMod)
    {
        this.shootTimer -= 1.0 * timeMod;
        if(this.shootTimer <= 0.0)
        {
            if(this.faceDead && this.faceDeathTimer <= 0.0)
            {
                this.shootTimer += 120 + Math.random()*30 + this.shootPhase *60;

                if(this.shootPhase == 0)
                    this.Shoot();
                else
                {
                    MasterAudio.PlaySound(Assets.sounds.getBack,0.7);

                    for(var i = 0; i < GameObjects.bullets.length; i++)
                    {
                        if(GameObjects.bullets[i].exist && GameObjects.bullets[i].type == BulletType.Enemy)
                        {
                            GameObjects.bullets[i].speed.x  *= -1.25;
                            GameObjects.bullets[i].speed.y  *= -1.25;
                        }
                    }

                    if(this.shootPhase == 2)
                    {
                        for(var i = 0; i < 3 + Math.random()*6; i++)
                        {
                            this.ShootAsteroid();
                        }
                    }
                }
                    
                this.shootPhase ++;
                if(this.shootPhase == 3)
                    this.shootPhase = 0;

            }
            else
            {
                for(var i = 0; i < Math.floor(Math.random()*12) +6; i++)
                {
                    this.ShootAsteroid();
                }
                this.shootTimer += 60 + Math.random()*60
            }

            this.colorModTimer = 20;
        }

        if(this.colorModTimer > 0)
            this.colorModTimer -= 1.0 * timeMod;
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        if(this.dead)
        {
            if(this.deathTimer > 0)
            {
                this.deathTimer -= 0.5 * timeMod;
                if(this.deathTimer <= 0)
                {
                    Status.phase = 2;
                }
            }
            return;
        }

        if(Status.bossHealth <= 0)
        {
            MasterAudio.PlaySound(Assets.sounds.destroy,0.6);

            this.dead = true;
            this.deathTimer = 60;
            Camera.Shake(120,8.0);

            var timeBonus = Math.floor(150000 - Status.time);

            if(timeBonus < 0)
                timeBonus = 0;

            GameObjects.CreateMessage("Time bonus:\n   " + String(timeBonus),64,96,-3);
            Status.score += timeBonus;

            return;
        }

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
                if(this.plantSize < 0.45)
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
            else
            {
                this.ShootingRoutines(timeMod);
            }

            if(!this.faceDead && Status.bossHealth <= 4000)
            {
                Assets.sounds.destroy.Play(0.8);

                this.faceDeathTimer = 60;
                this.faceDead = true;
                Camera.Shake(60,6);

                var timeBonus = Math.floor(100000 - Status.time);

                if(timeBonus < 0)
                    timeBonus = 0;

                GameObjects.CreateMessage("Time bonus:\n   " + String(timeBonus),64,96,-3);
                Status.score += timeBonus;
            }

            if(this.faceDead && this.faceDeathTimer <= 0.0)
            {
                this.SpecialMovement(timeMod);
                this.plantScaleMod += 0.05 * timeMod;
                this.plantSize = 0.5 + 0.025 * Math.sin(this.plantScaleMod);
            }
        }
    }

    /*! On bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(b.exist == false || b.type == BulletType.Enemy || this.dead) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);

        if(this.plantDead == false && dist < 0.7)
        {
            b.exist = false;
            b.deathTimer = 30;
        }
        else if(dist < 0.45)
        {
            Status.bossHealth -= b.power;
            Status.AddPoints(b.type == BulletType.Friendly ? 15 : 1500);
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
        var alpha = 1.0;
        var whiteness = 1.0;
        var scale = 1.0;
        if(this.deathTimer > 0 && this.dead)
        {
            alpha = 1.0/60.0 * this.deathTimer;
            whiteness = 255 * (1-alpha) + 1.0;
            scale += 1.0-alpha;
        }

        g.eff.Reset();
        if(this.faceDead && this.faceDeathTimer <= 0)
        {
            if(this.colorModTimer > 0)
            {
                var mod = 1.0  - Math.abs(this.colorModTimer-10)/10;
                g.eff.SetColor(1.0+3*mod,1.0+3*mod,1.0+3*mod,1.0);
            }

            g.eff.Use();

            g.DrawCenteredBitmap(Assets.textures.plant,0,0,0,1.75*this.plantSize,1.75*this.plantSize);

            if(this.deathTimer <= 0.0 && this.dead)
                return;

            g.eff.SetColor(1.0,1.0,1.0,alpha);
            g.eff.Use();
            for(var i = 0; i < this.ringPos.length; i ++)
            {
                g.DrawCenteredBitmap(Assets.textures.ring,this.ringPos[i].x,this.ringPos[i].y,0,0.35,0.35);
            }
        }

        g.eff.Reset();
        if(this.plantDead == false)
        {
            g.DrawCenteredBitmap(Assets.textures.plant,this.x,this.y,0,1.75*this.plantSize,1.75*this.plantSize);
        }
        else
        {
            if(this.deathTimer > 0 && this.dead)
            {
                g.eff.SetColor(whiteness,whiteness,whiteness,alpha);
            }
            else
            {
                if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/4) % 2 == 0)
                {
                    g.eff.SetColor(2.0,0.5,0.5,1.0);
                }

            }
        }
        g.eff.Use();

        g.DrawRegularBitmapPortion(Assets.textures.face,
            this.x,this.y,2,Status.bossHealth <= 4000 ? 1 : 0,0 ,0,1.0*scale,1.0*scale);

        if(this.faceDead && this.faceDeathTimer > 0)
        {
            var alpha = 1.0/60.0 * this.faceDeathTimer;
            g.eff.SetColor(alpha,alpha,alpha,alpha);
            g.eff.Use();

            g.DrawRegularBitmapPortion(Assets.textures.face,
                this.x,this.y,2,0,0,0,1.0 + 2*(1-alpha),1.0 + 2*(1-alpha));
        }
    }
}