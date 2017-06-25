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
        this.mousePos = -1;
        this.mouseDemandRelease = false;

        this.startMenu = 152;

        this.menuPos = 240;
        this.spacePos = 0;
    }

    /*! Get mouse pos */
    static GetMousePos()
    {
        for(var i = 0; i < 3; i++)
        {
            if(Controls.mouse.vpos.x > 80 && Controls.mouse.vpos.x < 320-80
            && Controls.mouse.vpos.y > this.startMenu-4  + i*24 && Controls.mouse.vpos.y < this.startMenu-4 +24 + i*24)
            {
                this.mousePos = i;
                return;
            }
        }
        this.mousePos = -1;
    }

    /*! GetMouseAction */
    static GetMouseAction()
    {
        this.mouseDemandRelease = true;

        switch(this.mousePos)
        {
        case 0:

            MasterAudio.Fade(0.0,-0.017);
            Fade.Set(function()
            {
                ref.currentScene = "game";
                ref.scenes.game.Reset();
                MasterAudio.PlayMusic(Assets.music.theme,0.0,true);
                MasterAudio.Fade(1.0,0.017);
                Camera.y = -0.5;
            },1.0,FadeMode.In);

            MasterAudio.PlaySound(Assets.sounds.choose,1.0);

            break;

        case 1:

            break;

        case 2:

            var musicOn = !(MasterAudio.musicVol == 0.0 && MasterAudio.soundVol == 0.0);

            if(musicOn)
            {
                MasterAudio.musicVol = 0.0;
                MasterAudio.soundVol = 0.0;

                MasterAudio.currentTrack.volume = 0.0;
            }
            else
            {
                MasterAudio.musicVol = 1.0;
                MasterAudio.soundVol = 1.0;

                MasterAudio.currentTrack.volume = 1.0;
            }

            if(!musicOn) MasterAudio.PlaySound(Assets.sounds.choose,1.0);

            break;

        default:
            break;
        }
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.menuPos > 0)
        {
            this.menuPos -= 1.0 * timeMod;
            if(this.menuPos < 0)
                this.menuPos = 0;

            if(this.spacePos < 128)
            {
                this.spacePos += 0.5 * timeMod;
                if(this.spacePos > 128)
                    this.spacePos = 128;
            }

            return;
        }

        this.shineMod += 0.035 * timeMod;

        this.GetMousePos();

        if(Fade.timer <= 0 && Controls.mousestate[0] == State.Pressed && !this.mouseDemandRelease)
        {
            this.GetMouseAction();
        }
        else if(this.mouseDemandRelease && Controls.mousestate[0] == State.Released)
        {
            this.mouseDemandRelease = false;
        }

        _spc_userGestureFullscreen = this.mousePos == 1;
    }

    /*! The title says it all!
     * @param i Index
     */
    static SetYellowness(g,i)
    {
        g.eff.Reset();
        g.eff.Use();

        if(this.mousePos == i)
        {
            g.eff.SetColor(1,1,0,1);
            g.eff.Use();
        }
    }

    /*! Draw menu elements
     * @param g Graphics object
     */
    static DrawMenu(g)
    {
        var musicOn = !(MasterAudio.musicVol == 0.0 && MasterAudio.soundVol == 0.0);

        this.SetYellowness(g,0);
        g.DrawText(HUD.font,Assets.textures.font24,"Start game",80,this.startMenu,0,-14);

        this.SetYellowness(g,1);
        g.DrawText(HUD.font,Assets.textures.font24,"Full screen",72,this.startMenu + 24,0,-14);

        this.SetYellowness(g,2);
        g.DrawText(HUD.font,Assets.textures.font24,"Audio: " + (!musicOn ? "Off" : "On"),84,this.startMenu + 48,0,-14);
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

        g.DrawBitmapRegion(Assets.textures.spaceBg,0,this.spacePos,256,240,0,0,320,240);


        g.SetFiltering(TextureFilter.Linear);

        g.transf.Translate(0,this.menuPos,0);
        g.transf.Use();

        var mod = 1.0 + 0.25 * (Math.sin(this.shineMod*1.5 + Math.PI / 2 )+1);

        g.eff.SetColor(mod,mod,mod,1);
        g.eff.Use();

        g.DrawBitmapRegion(Assets.textures.logo,0,256,256,256,32,-16,256,256);

        this.DrawMenu(g);

        g.eff.Reset();
        g.eff.Use();

        g.DrawText(HUD.font,Assets.textures.font16,"(c) 2017 Jani Nyk~nen",32,240-16,0,-2);

        g.transf.Identity();
        g.transf.Use();
    }
}