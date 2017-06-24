/*! Particle
 * @author Jani Nykänen
 */

/*! Particle class */
class Particle
{
    /*! Constructor */
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.speed = {x:0,y:0};
        this.exist = false;
        this.size = 0.05;
    }

    /*! Create a particle
     * @param x X coord
     * @param y Y coord
     * @param sx Speed x
     * @param sy Speed y
     */
    Create(x,y,sx,sy)
    {
        this.x = GameObjects.player.x; // x;
        this.y = GameObjects.player.y; // y
        this.speed.x = sx;
        this.speed.y = sy;
        this.exist = true;
        this.size = 0.04 + Math.random()*0.035;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist == false) return;

        this.speed.y -= 0.001 * timeMod;

        if(this.speed.x > 0.0)
        {
            this.speed.x -= 0.0005 * timeMod;
            if(this.speed.x < 0.0)
                this.speed.x = 0.0;
        }
        else if(this.speed.x < 0.0)
        {
            this.speed.x += 0.0005 * timeMod;
            if(this.speed.x > 0.0)
                this.speed.x = 0.0;
        }

        this.x += this.speed.x * timeMod;
        this.y += this.speed.y * timeMod;

        if(this.y < Camera.y-1.8)
        {
            this.exist = false;
        }
    }

    /*! Draw particle
     * @param g Graphics objcet
     */
    Draw(g)
    {
        if(this.exist == false) return;

        g.FillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);
    }
}