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
        GameObjects.Init(Super.graphics.gl);
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
        g.SetDepthTesting(false);
        GameObjects.Draw(g);

        g.transf.Ortho2D(this.Super.canvas.width,this.Super.canvas.height);
        g.transf.Identity();
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        if(GameObjects.player.hurtTimer > 0)
        {
            var transValue = 1.0 - Math.abs(GameObjects.player.hurtTimer-30) / 30.0;

            g.ChangeShader(ShaderType.NoTexture);
            g.eff.SetColor(1.0,0.0,0.0,0.35*transValue);
            g.eff.Use();

            g.FillRect(0,0,320,240);

            g.eff.Reset();
            g.ChangeShader(ShaderType.Default);
        }

        g.SetDepthTesting(false);
        HUD.Draw(g);
        GameObjects.DrawInCanvasSize(g);

        g.eff.Reset();
        g.eff.Use();
        g.DrawBitmapRegion(Assets.textures.cursor,0,0,20,20,Controls.mouse.vpos.x-10,Controls.mouse.vpos.y-10,20,20);
        
    }

    /*! Update, see scene.js */
    Update(timeMod)
    {
        GameObjects.Update(timeMod);
        Stage.Update(timeMod);

        Camera.Limit();
        Camera.Update(timeMod);

        HUD.Update(timeMod);

        Status.Update(timeMod);
    }
}