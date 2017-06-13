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
    }

    /*! Controls */
    Controls()
    {
        this.target.x = VPad.axis.x / 50;
        this.target.y = VPad.axis.y / 50;
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
            this.spr.Animate(0,0,3,8 - this.totalSpeed*300,timeMod);
        }
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        

        var px = (this.x+1.0)/2 * 320;
        var py = (this.y+1.0)/2 * 240;

        this.angle = Math.atan2(Controls.mouse.vpos.y-py,Controls.mouse.vpos.x-px) + Math.PI/2;

        this.Controls();
        this.Move(timeMod);
        this.Animate(timeMod);
    }

    /*! Draw player
     * @param g Graphics object
     */
    Draw(g)
    {
        g.SetFiltering(TextureFilter.Linear);

        //g.DrawCenteredBitmapRegion(Assets.textures.bee,0,0,128,128,this.x,this.y,128,128,this.angle,0.5,0.5);
        g.DrawSpriteSpecial(Assets.textures.bee,this.spr,this.x,this.y,this.angle,0.5,0.5);

        g.SetFiltering(TextureFilter.Nearest);
    }
}