/*! Menu
 * @author Jani Nykänen
 */

/*! Menu class */
class Menu
{
    /*! Init */
    static Init()
    {
        this.shineMod = 0.0;
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.shineMod += 0.035 * timeMod;
    }

    /*! Draw menu elements
     * @param g Graphics object
     */
    static DrawMenu(g)
    {
        g.eff.Reset();
        g.eff.Use();

        if(Controls.mouse.vpos.x > 80 && Controls.mouse.vpos.x < 320-80
          && Controls.mouse.vpos.y > 240-104 && Controls.mouse.vpos.y < 240-104+24)
        {
            g.eff.SetColor(1,1,0,1);
            g.eff.Use();
        }
        
        g.DrawText(HUD.font,Assets.textures.font24,"Start game",80,240-96,0,-14);

        g.eff.Reset();
        g.eff.Use();

        if(Controls.mouse.vpos.x > 80 && Controls.mouse.vpos.x < 320-80
          && Controls.mouse.vpos.y > 240-104+24 && Controls.mouse.vpos.y < 240-104+48)
        {
            g.eff.SetColor(1,1,0,1);
            g.eff.Use();
        }

        g.DrawText(HUD.font,Assets.textures.font24,"Full screen",72,240-96 + 24,0,-14);
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.ChangeShader(ShaderType.Default);

        g.transf.Ortho2D(320,240);
        g.transf.Identity();
        g.transf.Use();

        g.SetFiltering(TextureFilter.Nearest);

        g.eff.Reset();
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.spaceBg,0,0,256,240,0,0,320,240);

        g.SetFiltering(TextureFilter.Linear);

        var mod = 1.0 + 0.25 * (Math.sin(this.shineMod*1.5 + Math.PI / 2 )+1);

        g.eff.SetColor(mod,mod,mod,1);
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.logo,0,0,256,256,32,-16,256,256);

        this.DrawMenu(g);
    }
}