/*! Game objects
 * @author Jani Nykänen
 */

/*! Game objects class */
class GameObjects
{
    /*! Initialize */
    static Init(gl)
    {
        this.player = new Player(0,1.5);
        this.boss = new Boss();
        this.bullets = new Array(128);
        for(var i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i] = new Bullet();
        }

        this.messages = new Array(8);
        for(var i = 0; i < this.messages.length; i++)
        {
            this.messages[i] = new Message(gl);
        }
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.player.Update(timeMod);
        this.boss.Update(timeMod);
        this.boss.OnPlayerCollision(this.player);

        for(var i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i].Update(timeMod); // No existence check here, bullet might be "dying"
            if(this.bullets[i].exist)
            {
                this.boss.OnBulletCollision(this.bullets[i]);
            }
        }

        for(var i = 0; i < this.messages.length; i++)
        {
            this.messages[i].Update(timeMod);
        }
    }

    /*! Set viewport for game objects
     * @param g 
     */
    static SetGObjectViewport(g)
    {
        g.transf.Identity();
        g.transf.Ortho2D(2.0 * (4.0/3.0),2.0);
        g.transf.Translate( (1.0 - Camera.x - Camera.shake.x) * (4/3),1.0 - Camera.y - Camera.shake.y,0.0);
        g.transf.Use();
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.SetDepthTesting(false);

        g.ChangeShader(ShaderType.Default);

        this.SetGObjectViewport(g);

        Stage.DrawFloor(g);
        this.boss.Draw(g);

        if(Stage.phaseChangeTimer > 0)
        {
            Stage.DrawWhiteness(g);
            this.SetGObjectViewport(g);
        }

        this.player.Draw(g);

        for(var i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i].Draw(g);
        }

        g.SetDepthTesting(true);
    }

    /*! Draw using canvas sized viewport
     * @param g Graphics object
     */
    static DrawInCanvasSize(g)
    {
        for(var i = 0; i < this.messages.length; i++)
        {
            this.messages[i].Draw(g);
        }
    }

    /*! A macro for creating a bullet
     * @param x X coordinate
     * @param y Y coordinate
     * @param sx Speed x
     * @param sy Speed y
     * @param type Bullet type
     */
    static CreateBullet(x,y,sx,sy,power,type,sizeMod)
    {
        for(var i = 0; i < this.bullets.length; i++)
        {
            if(this.bullets[i].exist == false && this.bullets[i].deathTimer <= 0.0)
            {
                this.bullets[i].Create(x,y,sx,sy,power,type,sizeMod);
                break;
            }
        }
    }

    /*! Create message
     * @param msg Message
     * @param x X coordinate
     * @param y Y coordinate
     * @param speed Speed
     */
    static CreateMessage(msg,x,y,speed)
    {
        for(var i = 0; i < this.messages.length; i++)
        {
            if(this.messages[i].exist == false)
            {
                this.messages[i].Create(msg,x,y,speed);
                break;
            }
        }
    }
}