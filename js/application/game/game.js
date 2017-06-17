/*! Game scene
 * @author Jani Nykänen
 */

/*! Game class */
class Game extends Scene
{
    /*! Init, see scene.js */
    Init(g,Super)
    {
        this.Super = Super;
        Stage.Init(Super);

        Camera.Init();
        GameObjects.Init();
        HUD.Init(Super.graphics.gl);
        Status.Init();
    }

    /*! Draw, see scene.js*/
    Draw(g)
    {
        g.ChangeShader(ShaderType.Default);

        g.SetDepthTesting(false);

        g.ClearScreen(0.75,0.75,0.75);

        Stage.Draw(g);
        GameObjects.Draw(g);

        g.transf.Ortho2D(this.Super.canvas.width,this.Super.canvas.height);
        g.transf.Identity();
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        HUD.Draw(g);

        g.DrawBitmapRegion(Assets.textures.cursor,0,0,20,20,Controls.mouse.vpos.x-10,Controls.mouse.vpos.y-10,20,20);
        
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        GameObjects.Update(timeMod);
        Stage.Update(timeMod);

        Camera.Limit();

        HUD.Update(timeMod);

        Status.Update(timeMod);
    }
}