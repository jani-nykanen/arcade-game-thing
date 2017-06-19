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
        this.heart = new Heart();
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

        if(Stage.phase == 2)
        {
            this.heart.Update(timeMod);
        }
    }

    /*! Check bullet collision for each part
     * @param b Bullet
     */
    OnBulletCollision(b)
    {
        for(var i = 0; i < this.hands.length; i++)
        {
            this.hands[i].OnBulletCollision(b);
        }
        this.base.OnBulletCollision(b);

        if(Stage.phase == 2)
        {
            this.heart.OnBulletCollision(b);
        }
    }

    /*! On player collision
     * @param p Player
     */
    OnPlayerCollision(p)
    {
        for(var i = 0; i < this.hands.length; i++)
        {
            this.hands[i].OnPlayerCollision(p);
        }
        this.base.OnPlayerCollision(p);

        if(Stage.phase == 2)
        {
            this.heart.OnPlayerCollision(p);
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

        if(Stage.phase == 2)
        {
            this.heart.Draw(g);
        }
        else
        {
            this.base.Draw(g);
        }
    }
    
}