/*! Player
 * @author Jani Nykänen
 */

/*! Player class */
class Player
{
    /*! Consctuctor 
     * @param x X coord
     * @param y Y coord
     */
    constructor(x,y)
    {
        this.x = x;
        this.y = y;

        this.start = {x:x,y:y};

        this.speed = {x:0,y:0};
        this.target = {x:0,y:0};
        this.totalSpeed = 0.0;

        this.angle = 0.0;

        this.spr = new Sprite(128,128);
        this.shootSpr = new Sprite(128,128);

        this.gas = new Array(16);
        for(var i = 0; i < 16; i++)
        {
            this.gas[i] = new Gas();
        }
        this.gasTimer = 10;

        this.warpTimer = 0;

        this.isShooting = false;
        this.isSpcShooting = false;
        this.spcShootTimer = 0;
        this.shootPhase = 0;

        this.hurtTimer = 0;

        this.spcDeathTimer = 130;
        this.particleTimer = 0;
    }

    /*! Reset */
    Reset()
    {
        this.x = this.start.x;
        this.y = this.start.y;

        this.speed.x = 0;
        this.speed.y = 0;
        this.target.x = 0;
        this.target.y = 0;
        this.totalSpeed = 0.0;

        this.angle = 0.0;

        for(var i = 0; i < 16; i++)
        {
            this.gas[i].exist = false;
        }
        this.gasTimer = 10;

        this.warpTimer = 0;

        this.isShooting = false;
        this.isSpcShooting = false;
        this.spcShootTimer = 0;
        this.shootPhase = 0;

        this.hurtTimer = 0;

        this.spcDeathTimer = 130;
        this.particleTimer = 0;
    }

    /*! Controls */
    Controls()
    {
        if(this.isSpcShooting && this.spcDeathTimer > 120 )
        {
            this.target.x = 0;
            this.target.y = 0;

            if(this.spcShootTimer > 60 && Controls.mousestate[2] == State.Up)
            {
                MasterAudio.PlaySound(Assets.sounds.shoot,0.7);

                var sizeMod = this.spcShootTimer / 120.0;

                this.isSpcShooting = false;

                GameObjects.CreateBullet(
                        this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                        this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                        Math.cos(this.angle- Math.PI/2.0) * 0.075,
                        Math.sin(this.angle- Math.PI/2.0) * 0.075,sizeMod*(750 * (1 + (Status.level-1)/2.8)), BulletType.Special,sizeMod
                    );
            }

            return;
        }
        
        if(this.warpTimer <= 0)
        {
            
            this.target.x = VPad.axis.x / 50;
            this.target.y = VPad.axis.y / 50;

            if(this.spcDeathTimer > 120  && VPad.buttons.warp.state == State.Pressed)
            {
                this.warpTimer = 30;
                this.speed.x *= 2;
                this.speed.y *= 2;
                this.target.x *= 2;
                this.target.y *= 2;

                MasterAudio.PlaySound(Assets.sounds.warp,0.70);
            }
            else if(this.spcDeathTimer > 120  && this.isShooting == false)
            {
                if(Controls.mousestate[0] == State.Down)
                {
                    MasterAudio.PlaySound(Assets.sounds.shoot,0.6);

                    this.isShooting = true;
                    this.shootSpr.currentFrame = 0;
                    this.shootSpr.currentRow = 1;
                    this.shootSpr.changeFrameCount = 0;

                    if(Status.level >= 7 || (Status.level >= 5 && this.shootPhase <= (Status.level-3)-2) )
                    {
                        for(var i = -1; i <= 1; i++)
                        {
                            GameObjects.CreateBullet(
                            this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                            this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                                Math.cos(this.angle- Math.PI/2.0 + Math.PI/16.0*i) * 0.05,
                                Math.sin(this.angle- Math.PI/2.0 + Math.PI/16.0*i) * 0.05,20, BulletType.Friendly
                            );
                        }
                    }
                    else if(Status.level >= 4 || (Status.level >= 2 && this.shootPhase <= Status.level-2) )
                    {
                        for(var i = -1; i <= 1; i += 2)
                        {
                            GameObjects.CreateBullet(
                            this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                            this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                                Math.cos(this.angle- Math.PI/2.0 - Math.PI/24.0*i) * 0.05,
                                Math.sin(this.angle- Math.PI/2.0 - Math.PI/24.0*i) * 0.05,20, BulletType.Friendly
                            );
                        }
                    }
                    else
                    {

                        GameObjects.CreateBullet(
                            this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                            this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                            Math.cos(this.angle- Math.PI/2.0) * 0.05,
                            Math.sin(this.angle- Math.PI/2.0) * 0.05,20, BulletType.Friendly
                        );

                    }
                    
                    this.shootPhase ++;
                    if(this.shootPhase > 2)
                        this.shootPhase = 0;

                }
                else if(this.spcDeathTimer > 120 && Status.bombs > 0 && Controls.mousestate[2] == State.Pressed)
                {
                    MasterAudio.PlaySound(Assets.sounds.specialShoot,0.7);
                    Status.bombs --;
                    this.isSpcShooting = true;
                    this.spcShootTimer = 0;
                }
            
            }

        }
        else
        {
            if(VPad.buttons.warp.state == State.Released)
            {
                this.target.x /= 2;
                this.target.y /= 2;
            }
        }
    }

    /*! Limit movement to the game area */
    Limit()
    {
        if(this.x < -2.1* (4/3))
        {
            this.x = -2.1* (4/3);
            this.speed.x = 0;
        }
        else if(this.x > 2.1* (4/3))
        {
            this.x = 2.1* (4/3);
            this.speed.x = 0;
        }

        if(this.y < -2.6)
        {
            this.y = -2.6;
            this.speed.y = 0;
        }
        else if(this.y > 2.6)
        {
            this.y = 2.6;
            this.speed.y = 0;
        }
    }

    /*! Move
     * @param timeMod Time modifier
     */
    Move(timeMod)
    {
        if(this.target.x > this.speed.x)
        {
            this.speed.x += 0.005 * timeMod;
            this.speed.x = this.speed.x > this.target.x ? this.target.x : this.speed.x;
        }
        else if(this.target.x < this.speed.x)
        {
            this.speed.x -= 0.005 * timeMod;
            this.speed.x = this.speed.x < this.target.x ? this.target.x : this.speed.x;
        }

        if(this.target.y > this.speed.y)
        {
            this.speed.y += 0.005 * timeMod;
            this.speed.y = this.speed.y > this.target.y ? this.target.y : this.speed.y;
        }
        else if(this.target.y < this.speed.y)
        {
            this.speed.y -= 0.005 * timeMod;
            this.speed.y = this.speed.y < this.target.y ? this.target.y : this.speed.y;
        }

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        this.totalSpeed = Math.hypot(this.speed.x,this.speed.y);
    }

    /*! Animation routines
     * @param timeMod Time modifier
     */
    Animate(timeMod)
    {
        if(this.totalSpeed > 0.0)
        {
            this.spr.Animate(0,0,3,8 - Math.floor(this.totalSpeed*300),timeMod);
        }

        if(this.isShooting)
        {
            var speed = 3;
            if(Status.level == 8)
                speed = 2.25;
            else if(Status.level == 9)
                speed = 1.5;

            this.shootSpr.Animate(1,0,4,speed,timeMod);
            if(this.shootSpr.currentFrame == 4)
            {
                this.isShooting = false;
            }
        }

        if(this.isSpcShooting)
        {
            this.spr.Animate(0,0,3,1,timeMod);
        }
    }

    /*! Move the camera
     * @param timeMod Time modifier
     */
    MoveCamera(timeMod)
    {
        var dist = Math.hypot(Camera.x-this.x,Camera.y-this.y);
        var angle = Math.atan2(Camera.y-this.y,Camera.x-this.x);

        Camera.x -= Math.cos(angle) * (dist/24);
        Camera.y -= Math.sin(angle) * (dist/24);

        var mvpx = Controls.mouse.vpos.x;
        var mvpy = Controls.mouse.vpos.y;

        if(mvpx < 0) mvpx = 0;
        else if(mvpx > 320) mvpx = 320;

        if(mvpy < 0) mvpy = 0;
        else if(mvpy > 240) mvpy = 240;

        var mposx = (mvpx-160.0)/320.0 + Camera.x * (4/3);
        var mposy = (mvpy-120.0)/240.0 + Camera.y;

        dist = Math.hypot(Camera.x* (4/3)-mposx,Camera.y-mposy);
        angle = Math.atan2(Camera.y-mposy,Camera.x* (4/3)-mposx);

        Camera.x -= Math.cos(angle) * (dist/16);
        Camera.y -= Math.sin(angle) * (dist/16);
    }

    /*! Hurt player */
    Hurt()
    {
        if(this.warpTimer <= 0 && this.hurtTimer <= 0)
        {
            this.hurtTimer = 60;
            Status.chain = 10;
            Status.chainExp = 0.0;
            Status.health --;

            if(Status.level > 1)
            {
                Status.level --;
                if(Status.level == 8)
                    Status.exp = 0.0;
                    
                GameObjects.CreateMessage("Level Down!",160 - 11*8,96,-3);
            }

            MasterAudio.PlaySound(Assets.sounds.hurt,0.8);

            Camera.Shake(60,1);
        }
    }

    /*! Aka "the ending death"
     * @param timeMod Time modifier
     */
    SpecialDeath(timeMod)
    {
        this.spcDeathTimer -= 0.125 * timeMod;
        if(this.spcDeathTimer <= 0.0)
        {
            Status.victory = true;
        }

        if(this.spcDeathTimer > 30)
        {
            this.particleTimer += 1.0 * timeMod;
            if(this.particleTimer >= 6.0)
            {
                for(var repeat = 0; repeat < 2 + Math.random()*4; repeat++)
                {
                    for(var i = 0; i < GameObjects.particles.length; i++)
                    {
                        if(GameObjects.particles[i].exist == false)
                        {
                            GameObjects.particles[i].Create(this.x,this.y,Math.random()*0.1 - 0.05,Math.random()*0.05);
                            break;
                        }
                    }
                }

                while(this.particleTimer >= 6.0)
                    this.particleTimer -= 6.0;
            }
        }
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(!this.isSpcShooting)
        {
            if(this.warpTimer <= 0.0)
            {
                var px = (this.x+1.0-Camera.x * (4/3))/2 * 320;
                var py = (this.y+1.0-Camera.y)/2 * 240;

                this.angle = Math.atan2(Controls.mouse.vpos.y-py,Controls.mouse.vpos.x-px) + Math.PI/2;

            }
            else
            {
                this.angle += Math.PI*2 / 30.0 * timeMod;
                this.warpTimer -= 1.0 * timeMod;
            }
        }

        if(this.isSpcShooting)
        {
            this.spcShootTimer += 1.0 * timeMod;
            if(this.spcShootTimer > 120)
            {
                MasterAudio.PlaySound(Assets.sounds.shoot,0.7);

                GameObjects.CreateBullet(
                        this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                        this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                        Math.cos(this.angle- Math.PI/2.0) * 0.075,
                        Math.sin(this.angle- Math.PI/2.0) * 0.075,750 * (1 + (Status.level-1)/2.8), BulletType.Special,1
                    );

                this.isSpcShooting = false;
            }
        }
        
        if(this.hurtTimer > 0)
        {
            this.hurtTimer -= 1.0 * timeMod;
        }


        this.Controls();
        this.Move(timeMod);
        this.Animate(timeMod);
        this.MoveCamera(timeMod);
        this.Limit();

        if(this.spcDeathTimer > 60 && this.totalSpeed > 0 && this.warpTimer <= 0.0)
        {
            this.gasTimer -= 1.0 * timeMod;
            if(this.gasTimer <= 0.0)
            {
                for(var i = 0; i < this.gas.length; i++)
                {
                    if(this.gas[i].exist == false)
                    {
                        this.gas[i].Create(
                            this.x - 0.175 * Math.cos(this.angle - Math.PI/2),
                            this.y - 0.175 * Math.sin(this.angle - Math.PI/2),1.5,{x:-this.speed.x/2,y:-this.speed.y/2});
                        break;
                    }
                }

                this.gasTimer = 3;
            }
        }

        for(var i = 0; i < this.gas.length; i++)
        {
            this.gas[i].Update(timeMod);
        }

        if(GameObjects.boss.heart.exploded && Stage.whiteningTimer <= 0)
        {
            this.SpecialDeath(timeMod);
        }
    }

    /*! On bullet collision
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        if(this.warpTimer > 0 || b.exist == false || b.type != BulletType.Enemy || this.hurtTimer > 0) return;

        var dist = Math.hypot(this.x-b.x,this.y-b.y);
        if(dist < 0.1)
        {
            this.Hurt();
            b.exist = false;
            b.deathTimer = 30;
        }
    }

    /*! Draw player
     * @param g Graphics object
     */
    Draw(g)
    {
        g.SetFiltering(TextureFilter.Linear);

        for(var i = 0; i < this.gas.length; i++)
        {
            this.gas[i].Draw(g);
        }

        g.eff.Reset();
       
        var scaleMod = 1;
        if(this.warpTimer > 0)
        {
            scaleMod = Math.abs(this.warpTimer - 15) / 15;

            g.eff.SetColor(scaleMod,scaleMod,1,1);
        }
        else if(this.hurtTimer > 0 && Math.floor(this.hurtTimer/4) % 2 == 0)
        {
            g.eff.SetColor(2.0,0.0,0.0,1.0);
        }

        g.eff.Use();

        if(this.spcDeathTimer > 120)
        {
            g.DrawSpriteSpecial(Assets.textures.bee,this.spr,this.x,this.y,this.angle,0.5*scaleMod,0.5*scaleMod);
        }
        else
        {
            if(this.spcDeathTimer <= 60)
            {
                var mod = 1.0/60.0 * (this.spcDeathTimer);
                g.eff.SetColor(mod,mod,mod,mod);
                g.eff.Use();
                g.DrawSpriteFrameSpecial(Assets.textures.bee,this.spr,this.x,this.y,
                        this.spr.currentFrame,this.spr.currentRow + 2,
                        this.angle,0.5*scaleMod,0.5*scaleMod);
            }
            else
            {
                g.DrawSpriteSpecial(Assets.textures.bee,this.spr,this.x,this.y,this.angle,0.5*scaleMod,0.5*scaleMod);
                var mod = 1.0 - 1.0/60.0 * (this.spcDeathTimer-60);
                g.eff.SetColor(1,1,1,mod);
                g.eff.Use();
                g.DrawSpriteFrameSpecial(Assets.textures.bee,this.spr,this.x,this.y,
                        this.spr.currentFrame,this.spr.currentRow + 2,
                        this.angle,0.5*scaleMod,0.5*scaleMod);
            }
        }

        g.eff.Reset();
        g.eff.Use();

        if(this.isShooting)
        {
            g.DrawSpriteSpecial(Assets.textures.bee,this.shootSpr,this.x,this.y,this.angle,0.5*scaleMod,0.5*scaleMod);
        }
        if(this.isSpcShooting)
        {
            var size = 0.25 * (1.0/120.0 * this.spcShootTimer);
            g.DrawCenteredBitmap(Assets.textures.circle,this.x + (0.15+size/2) * Math.cos(this.angle - Math.PI/2),
                        this.y + (0.15+size/2) * Math.sin(this.angle - Math.PI/2),0,size,size);
        }

        g.SetFiltering(TextureFilter.Nearest);
    }
}