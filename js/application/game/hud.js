/*! HUD
 * @author Jani Nykänen
 */

/*! HUD class */
class HUD
{
    /*! Initialize */
    static Init(gl)
    {
        this.font = new BitmapFont(gl,16,16);
        this.timeMod = 0;
    }

    /*! Update HUD
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.timeMod = timeMod;
    }

    /*! Draw health bar
     * @param g Graphics
     */
    static DrawHealthBar(g)
    {
        g.ChangeShader(ShaderType.NoTexture);

        g.eff.Reset();
        g.eff.Use();
        g.FillRect(16-2,240-24-2,320-32+4,16+4);

        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(16-1,240-24-1,320-32+2,16+2);

        var modif = 1.0;
        for(var i = 0; i < 4; i++)
        {
            modif = 0.25 + i*0.25;
            g.eff.SetColor(1.0*modif,0.25*modif,0.25*modif,1.0);
            g.eff.Use();
            g.FillRect(16,240-24+i*2,320-32,16-i*4);
        }

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        g.DrawText(this.font,Assets.textures.font16,"Undefined One" ,160 - 10.5*8,240-22,0);

    }

    /*! Draw score multiplier
     * @param g Graphics
     */
    static DrawMultiplier(g)
    {
        g.DrawText(this.font,Assets.textures.font24,"x 1.0", 320-72,4,0,-20);

        g.ChangeShader(ShaderType.NoTexture);

        g.eff.SetColor(1.0,1.0,1.0,1.0);
        g.eff.Use();
        g.FillRect(320-60,22,48,10);

        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(320-60+1,22+1,48-2,10-2);

        g.eff.SetColor(0.5,0.5,0.5,1.0);
        g.eff.Use();
        g.FillRect(320-60+2,22+2,48-4,10-4);

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);
    }

    /*! Draw score
     * @param g Graphics object
     */
    static DrawScore(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"SCORE:" ,176 - 4*8,0,-2);
        g.DrawText(this.font,Assets.textures.font24,"00000000" ,176 - 8*8,11,0,-12);
    }

    /*! Draw hearts
     * @param g Graphics
     */
    static DrawHearts(g)
    {   
        for(var i = 0; i < 5; i++)
        {
            g.DrawBitmapRegion(Assets.textures.hud,0,0,18,18,2+i*20,4,18,18);
        }    
    }

    /*! Draw weapon related HUD elements
     * @param g Graphics object
     */
    static DrawWeaponElements(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"WEAPON:" ,36 - 4*8,22,-3);
    
        g.ChangeShader(ShaderType.NoTexture);

        g.eff.SetColor(1.0,1.0,1.0,1.0);
        g.eff.Use();
        g.FillRect(6,35,80,15);

        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(6+1,35+1,80-2,15-2);

        var modif = 1.0;
        for(var i = 0; i < 4; i++)
        {
            modif = 0.25 + i*0.25;
            g.eff.SetColor(1.0*modif,0.625*modif,0.25*modif,1.0);
            g.eff.Use();
            g.FillRect(6+2,35+2+i,80-4,15-4-i*2);
        }

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        g.DrawText(this.font,Assets.textures.font16,"Lvl 1" ,40 - 26,36,-4);
    }

    /*! Draw bombs
     * @param g Graphics object
     */
    static DrawBombs(g)
    {
        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        for(var i = 0; i < 3; i++)
        {
            g.DrawBitmapRegion(Assets.textures.hud,0,18,18,18,4,56 + i*20,18,18);
        }    
    }

    /*! Draw HUD
     * @param g Graphics object
     */
    static Draw(g)
    {
        
        this.DrawHearts(g);
        this.DrawBombs(g);
        this.DrawWeaponElements(g);
        this.DrawScore(g);
        this.DrawMultiplier(g);
        this.DrawHealthBar(g);

       // g.DrawText(this.font,Assets.textures.font16,"FPS: " + (Math.round(60.0/this.timeMod)).toString() ,2,240-16,0);
    }
}