/*! Gas!
 * @author Jani Nykänen
 */

/*! Gas class */
class Gas
{
    /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.timer = 0;
        this.tspeed = 0;
        this.exist = false;

        this.speed = {x:0,y:0};
    }
    
    /*! Create
     * @param x X coord
     * @param y Y coord
     * @param tspeed Timer speed
     * @param speed Movement speed
     */
    Create(x,y,tspeed,speed)
    {
        this.x = x;
        this.y = y;
        this.tspeed = tspeed;
        this.timer = 60;
        this.exist = true;
        this.speed.x = speed.x;
        this.speed.y = speed.y;
    }

    /*! Update gas (ehehehe)
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist)
        {
            this.timer -= this.tspeed * timeMod;
            if(this.timer <= 0.0)
                this.exist = false;

            this.x += this.speed.x * timeMod;
            this.y += this.speed.y * timeMod;

            if(this.speed.x > 0.0)
            {
                this.speed.x -= 0.0005 * timeMod;
                if(this.speed.x < 0)
                    this.speed.x = 0;
            }
            else if(this.speed.x < 0.0)
            {
                this.speed.x += 0.0005 * timeMod;
                if(this.speed.x > 0)
                    this.speed.x = 0;
            }

            if(this.speed.y > 0.0)
            {
                this.speed.y -= 0.0005 * timeMod;
                if(this.speed.y < 0)
                    this.speed.y = 0;
            }
            else if(this.speed.y < 0.0)
            {
                this.speed.y += 0.0005 * timeMod;
                if(this.speed.y > 0)
                    this.speed.y = 0;
            }
        }
    }

    /*! Draw the gas!
     * @param g Graphics object
     */
    Draw(g)
    {
        if(!this.exist) return;

        var scaleMod = 1.0/60.0 * this.timer;

        g.eff.SetColor(scaleMod,scaleMod,scaleMod,scaleMod);
        g.eff.Use();

        g.DrawCenteredBitmap(Assets.textures.gas,this.x,this.y,0.0,0.15*scaleMod,0.15*scaleMod);
    }
}