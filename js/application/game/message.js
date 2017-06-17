/*! Message
 * @author Jani Nykänen
 */

/*! Message class */
class Message
{
    /*! Constructor */
    constructor(gl)
    {
        this.msg = "";
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.exist = false;

        Message.font = new BitmapFont(gl,16,16);
    }

    /*! Create message
     * @param msg Message
     * @param x X coordinate
     * @param y Y coordinate
     * @param speed Speed
     */
    Create(msg,x,y,speed)
    {
        this.msg = msg;
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.exist = true;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    Update(timeMod)
    {
        if(this.exist == false) return;

        this.y += this.speed;
        this.speed += 0.075 * timeMod;

        if(this.speed > 2.0)
            this.exist = false;
    }

    /*! Draw message
     * @param g Graphics
     */
    Draw(g)
    {
        if(this.exist == false) return;

        if(this.speed > 0)
        {
            var alpha = 1.0 - 1.0/2.0 * this.speed;
            g.eff.SetColor(alpha,alpha,alpha,alpha);
            g.eff.Use();
        }

        g.DrawText(Message.font,Assets.textures.font24,this.msg,this.x,this.y,0,-10);
    }
}