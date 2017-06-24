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
        this.oldHbar = 10000.0;
        this.oldExp = 0.0;
        this.lastBomb = 3;
        this.lastBombTimer = 0;
    }

    /*! Reset */
    static Reset()
    {
        this.timeMod = 0;
        this.oldHbar = 10000.0;
        this.oldExp = 0.0;
        this.lastBomb = 3;
        this.lastBombTimer = 0;
    }

    /*! Update HUD
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.timeMod = timeMod;

        if(Status.bossHealth < this.oldHbar)
        {
            this.oldHbar -= 20 * timeMod;
            if(this.oldHbar < Status.bossHealth)
            {
                this.oldHbar = Status.bossHealth;
            }
            
        }
        else if(Status.bossHealth > this.oldHbar)
        {
            this.oldHbar += 50 * timeMod;
            if(this.oldHbar > Status.bossHealth)
            {
                this.oldHbar = Status.bossHealth;
            }
            
        }
        else
        {
             this.oldHbar = Status.bossHealth;
        }

        if(Status.exp > this.oldExp)
        {
            this.oldExp += 0.02 * timeMod;
            if(this.oldExp > Status.exp)
                this.oldExp = Status.exp;
        }
        else if(Status.exp < this.oldExp)
        {
            this.oldExp -= 0.02 * timeMod;
            if(this.oldExp < Status.exp)
                this.oldExp = Status.exp;
        }

        if(Status.bombs != this.lastBomb)
        {
            this.lastBomb = Status.bombs;
            this.lastBombTimer = 30;
        }
        else if(this.lastBombTimer > 0)
            this.lastBombTimer -= 1.0 * timeMod;
    }

    /*! Draw health bar
     * @param g Graphics
     */
    static DrawHealthBar(g)
    {
        var length = (this.oldHbar / 10000) * (320-32) ;

        g.ChangeShader(ShaderType.NoTexture);

        // White
        g.eff.Reset();
        g.eff.Use();
        g.FillRect(16-2,240-24-2,320-32+4,16+4);

        // Black
        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(16-1,240-24-1,320-32+2,16+2);

        // Gray
        g.eff.SetColor(0.5,0.5,0.5,1.0);
        g.eff.Use();
        g.FillRect(16 + length ,240-24,320-32 - length,16);

        // Black end
        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(16+length,240-24-1,1,16+2);

        var modif = 1.0;
        for(var i = 0; i < 4; i++)
        {
            modif = 0.25 + i*0.25;
            g.eff.SetColor(1.0*modif,0.25*modif,0.25*modif,1.0);
            g.eff.Use();
            g.FillRect(16,240-24+i*2,length,16-i*4);
        }

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        if(Stage.phase == 1)
            g.DrawText(this.font,Assets.textures.font16,"Undefined One" ,160 - 10.5*8,240-22,0);
        else
            g.DrawText(this.font,Assets.textures.font16,"Heart of the Plant" ,160 - 13.5*8,240-22,0);

    }

    /*! Draw score multiplier
     * @param g Graphics
     */
    static DrawMultiplier(g)
    {
        var mulStr = "x " + String( Math.floor(Status.chain/10)) + "." + String(Status.chain % 10);

        g.DrawText(this.font,Assets.textures.font24,mulStr, 320-72,4,0,-20);

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

        var size = (48-4) * Status.chainExp;
        g.eff.SetColor(1.0,1.0,1.0,1.0);
        g.eff.Use();
        g.FillRect(320-60+2,22+2,size,10-4);

        if(size > 0)
        {
            g.eff.SetColor(0.0,0.0,0.0,1.0);
            g.eff.Use();
            g.FillRect(320-60+2+size,22+2,1,10-4);
        }

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);
    }

    /*! Draw score
     * @param g Graphics object
     */
    static DrawScore(g)
    {
        g.DrawText(this.font,Assets.textures.font16,"SCORE:" ,176 - 4*8,0,-2);
        g.DrawText(this.font,Assets.textures.font24,Utility.IntToStringWithZeros(Status.score) ,176 - 8*8,11,0,-12);
    }

    /*! Draw hearts
     * @param g Graphics
     */
    static DrawHearts(g)
    {   
        for(var i = 0; i < 5; i++)
        {
            if(i > Status.health-1)
                g.DrawBitmapRegion(Assets.textures.hud,18,0,18,18,2+i*20,4,18,18);
            else
                g.DrawBitmapRegion(Assets.textures.hud,0,0,18,18,2+i*20,4,18,18);
        }    

        if(Status.health < 5)
        {
            var width = Math.floor(Status.healthRestore * 18);
            g.DrawBitmapRegion(Assets.textures.hud,0,0,width,18,2+(Status.health*20),4,width,18);
        }
    }

    /*! Draw weapon related HUD elements
     * @param g Graphics object
     */
    static DrawWeaponElements(g)
    {
        g.eff.SetColor(1.0,1.0,1.0,1.0);
        g.eff.Use();

        g.DrawText(this.font,Assets.textures.font16,"WEAPON:" ,36 - 4*8,22,-3);
    
        g.ChangeShader(ShaderType.NoTexture);

       
        g.FillRect(6,35,80,15);

        g.eff.SetColor(0.0,0.0,0.0,1.0);
        g.eff.Use();
        g.FillRect(6+1,35+1,80-2,15-2);

        g.eff.SetColor(0.5,0.5,0.5,1.0);
        g.eff.Use();
        g.FillRect(6+2,35+2,80-4,15-4);

        var modif = 1.0;
        var length = (80-4) * this.oldExp;
        for(var i = 0; i < 4; i++)
        {
            modif = 0.25 + i*0.25;
            g.eff.SetColor(1.0*modif,0.625*modif,0.25*modif,1.0);
            g.eff.Use();
            g.FillRect(6+2,35+2+i,length,15-4-i*2);
        }

        if(Status.exp > 0)
        {
            g.eff.SetColor(0,0,0,1.0);
            g.eff.Use();
            g.FillRect(6+2+length,35+2,1,15-4);
        }

        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        g.DrawText(this.font,Assets.textures.font16,"Lvl " + String(Status.level) ,40 - 26,36,-4);
    }

    /*! Draw bombs
     * @param g Graphics object
     */
    static DrawBombs(g)
    {
        g.eff.Reset();
        g.ChangeShader(ShaderType.Default);

        for(var i = 0; i < Status.bombs; i++)
        {
            g.DrawBitmapRegion(Assets.textures.hud,0,18,18,18,4,56 + i*20,18,18);
        }    

        if(this.lastBombTimer > 0)
        {
            var alpha = 1.0/30.0 * this.lastBombTimer;

            g.eff.SetColor(alpha,alpha,alpha,alpha);
            g.eff.Use();

            g.DrawBitmapRegion(Assets.textures.hud,0,18,18,18,4,56 + (Status.bombs)*20,18,18);
        }
    }

    /*! Draw HUD
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.eff.Reset();
        g.eff.Use();
        
        this.DrawHearts(g);
        this.DrawBombs(g);
        this.DrawWeaponElements(g);
        this.DrawScore(g);
        this.DrawMultiplier(g);
        this.DrawHealthBar(g);

       // g.DrawText(this.font,Assets.textures.font16,"FPS: " + (Math.round(60.0/this.timeMod)).toString() ,2,240-16,0);
    }
}