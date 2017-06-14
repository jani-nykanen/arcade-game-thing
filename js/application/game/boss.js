/*! Boss
 * @author Jani Nykänen
 */

class Boss
{
    /*! Constructor */
    constructor()
    {
        this.base = new BossBase();
        this.hands = new Array(4);
        for(var i = 0; i < 4; i++)
        {
            this.hands[i] = new BossHand(Math.PI/4 + Math.PI /2 * i,i);
        }
    }

    /*! Update 
     * @param timeMod Time modifier 
     */
    Update(timeMod)
    {
        this.base.Update(timeMod);

        for(var i = 0; i < this.hands.length; i++)
        {
            this.hands[i].Update(timeMod);
        }
    }

    /*! Draw
     * @paramg g Graphics object
     */
    Draw(g)
    {   
        for(var i = 0; i < this.hands.length; i++)
        {
            this.hands[i].Draw(g);
        }

        this.base.Draw(g);

        
    }
    
}