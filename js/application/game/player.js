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
    }

    /*! Controls */
    Controls()
    {
        if(this.warpTimer <= 0)
        {
            this.target.x = VPad.axis.x / 50;
            this.target.y = VPad.axis.y / 50;

            if(VPad.buttons.warp.state == State.Pressed)
            {
                this.warpTimer = 30;
                this.speed.x *= 2;
                this.speed.y *= 2;
                this.target.x *= 2;
                this.target.y *= 2;
            }
            else if(this.isShooting == false && Controls.mousestate[0] == State.Down)
            {
                this.isShooting = true;
                this.shootSpr.currentFrame = 0;
                this.shootSpr.currentRow = 1;
                this.shootSpr.changeFrameCount = 0;

                GameObjects.CreateBullet(
                     this.x + 0.175 * Math.cos(this.angle - Math.PI/2),
                     this.y + 0.175 * Math.sin(this.angle - Math.PI/2),
                     Math.cos(this.angle- Math.PI/2.0) * 0.05,
                     Math.sin(this.angle- Math.PI/2.0) * 0.05, BulletType.Friendly
                );
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
        if(this.x < -2.6* (4/3))
        {
            this.x = -2.6* (4/3);
            this.speed.x = 0;
        }
        else if(this.x > 2.6* (4/3))
        {
            this.x = 2.6* (4/3);
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
            this.shootSpr.Animate(1,0,4,3,timeMod);
            if(this.shootSpr.currentFrame == 4)
            {
                this.isShooting = false;
            }
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

        var mposx = (mvpx-160.0)/320.0 + Camera.x;
        var mposy = (mvpy-120.0)/240.0 + Camera.y;

        dist = Math.hypot(Camera.x-mposx,Camera.y-mposy);
        angle = Math.atan2(Camera.y-mposy,Camera.x-mposx);

        Camera.x -= Math.cos(angle) * (dist/20);
        Camera.y -= Math.sin(angle) * (dist/20);
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
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
        
        this.Controls();
        this.Move(timeMod);
        this.Animate(timeMod);
        this.MoveCamera(timeMod);
        this.Limit();

        if(this.totalSpeed > 0 && this.warpTimer <= 0.0)
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

        g.eff.Use();

        g.DrawSpriteSpecial(Assets.textures.bee,this.spr,this.x,this.y,this.angle,0.5*scaleMod,0.5*scaleMod);
        if(this.isShooting)
        {
            g.DrawSpriteSpecial(Assets.textures.bee,this.shootSpr,this.x,this.y,this.angle,0.5*scaleMod,0.5*scaleMod);
        }

        g.SetFiltering(TextureFilter.Nearest);
    }
}