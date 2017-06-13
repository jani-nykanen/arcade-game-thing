/*! Game objects
 * @author Jani Nykänen
 */

/*! Game objects class */
class GameObjects
{
    /*! Initialize */
    static Init()
    {
        this.player = new Player(0,0);
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.player.Update(timeMod);
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.ChangeShader(ShaderType.Default);

        g.transf.Identity();
        g.transf.Ortho2D(2.0,2.0);
        g.transf.Translate(1.0 - Camera.x,1.0 - Camera.y,0.0);
        g.transf.Use();

        Stage.DrawFloor(g);

        this.player.Draw(g);
    }
}