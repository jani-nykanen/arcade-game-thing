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

        this.ringPos = new Array(8);
        for(var i = 0; i < 8; i++)
        {
            this.ringPos[i] = {x:0,y:0};
        }
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

        g.DrawCenteredBitmap(Assets.textures.palm,this.x,this.y,-this.angle - Math.PI /2,0.75,0.75);
    }
    
}