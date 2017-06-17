/*! Game objects
 * @author Jani Nykänen
 */

/*! Game objects class */
class GameObjects
{
    /*! Initialize */
    static Init()
    {
        this.player = new Player(0,1.5);
        this.boss = new Boss();
        this.bullets = new Array(128);
        for(var i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i] = new Bullet();
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
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.SetDepthTesting(false);

        g.ChangeShader(ShaderType.Default);

        g.transf.Identity();
        g.transf.Ortho2D(2.0 * (4.0/3.0),2.0);
        g.transf.Translate( (1.0 - Camera.x - Camera.shake.x) * (4/3),1.0 - Camera.y - Camera.shake.y,0.0);
        g.transf.Use();

        Stage.DrawFloor(g);

        this.boss.Draw(g);
        this.player.Draw(g);

        for(var i = 0; i < this.bullets.length; i++)
        {
            this.bullets[i].Draw(g);
        }

        g.SetDepthTesting(true);
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
}