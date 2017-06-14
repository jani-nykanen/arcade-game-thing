/*! Application
 *
 * This file includes Main application class
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
var ref = null; // Reference object, ref = this, needed in callback functions

/*! Application class
 *
 * Main application class. Extends ApplicationCore
 */
class Application extends ApplicationCore
{
    /*! Constructor */
    constructor()
    {
        super();
    }

    /*! OnStart, see core.js */
	OnStart()
    {
        console.log("Application starting...");

        // Variable definitions
        this.timeMod = 0.0; //! Time modificator
        this.loaded = false;
    }

    /*! OnInit, see core.js */
	OnInit()
    {
        var gl = this.graphics.gl;

        this.font = new BitmapFont(gl,16,16);

        Assets.Load();

        this.angle = 0.0;   

        this.canvas = new Framebuffer(gl,320,240);

        this.canvasPos = {x:0,y:0};
        this.canvasSize = {w:0,y:0};

        ref = this; // Needed in callback functions

        Shapes.Init();

        this.scenes = {};
        this.scenes.game = new Game();

        for(var key in this.scenes)
        {
            var s = this.scenes[key];
            s.Init(this.graphics,this);
        }
            
        this.currentScene = "game";

        VPad.Init();
        VPad.PushButton("warp",32);

    }

    /*! Triggers when assets are loaded */
    OnLoaded()
    {
        this.loaded = true;
    }

    /*! OnResize, see core.js */
    OnResize(width,height)
    {
        var canvasScale = {x:0,y:0};

        if( width/height >= this.canvas.width/this.canvas.height )
        {
            this.canvasPos.y = 0.0;
            this.canvasPos.x = width/2.0 - (height/this.canvas.height)*this.canvas.width / 2.0;
            canvasScale.y = height/this.canvas.height;
            canvasScale.x = canvasScale.y;
        }
        else
        {
            this.canvasPos.x = 0.0;
            this.canvasPos.y = height/2.0 - ( width/ this.canvas.width)*this.canvas.height / 2.0;
            canvasScale.x = width/this.canvas.width;
            canvasScale.y = canvasScale.x;
        }
        
        this.canvasSize.w = this.canvas.width * canvasScale.x;
        this.canvasSize.h = this.canvas.height * canvasScale.y;
    }

    /*! OnUpdate, see core.js */
	OnUpdate(deltaTime)
    {
        VPad.Update();

        this.timeMod = (deltaTime / 1000.0) / (1.0/60.0);

        if(Assets.HasLoaded() == false)
            return;

        else if(!this.loaded)
            this.OnLoaded();

        if(this.timeMod > 5)
            this.timeMod = 5;

        Controls.SetMouseVpos(this.graphics,this.canvas.width,this.canvas.height,this.canvasPos);

        this.scenes[this.currentScene].Update(this.timeMod);
    }

    /*! Draw to the framebuffer
     * @param g Graphics object
     */
    static DrawToCanvas(g)
    {
        g.SetDepthTesting(true);
        g.ClearScreen(1.0,0.0,0.0);

        ref.DrawContent(g);
    }

    /*! Draw loading screen
     * Draws a loading screen if there is
     * data to be loaded
     * @param g Graphics objects
     */
    DrawLoadingScreen(g)
    {
        g.ClearScreen(0.0,0.0,0.0);
    }

    /*! Draw canvas to the screen
     * @param g Graphics object
     */
    DrawCanvas(g)
    {
        g.ClearScreen(0.0,0.0,0.0);

        g.transf.Identity();
        g.transf.Ortho2D(g.canvas.width,g.canvas.height);
        g.transf.Translate(this.canvasPos.x,this.canvasPos.y+this.canvasSize.h,0);
        g.transf.Scale(this.canvasSize.w,-this.canvasSize.h,1);
        g.transf.Use();

        g.eff.Reset();
        g.eff.Use();

        g.DrawMesh(Shapes.plane,this.canvas.texture);
    }

    /*! Draw the application content
     * @param g Graphics object
     */
    DrawContent(g)
    {
        this.scenes[this.currentScene].Draw(g);
    }

    /*! OnDraw, see core.js */
	OnDraw(g)
    {

        if(Assets.HasLoaded() == false)
        {
            this.DrawLoadingScreen(g);
            return;
        }

        this.canvas.DrawTo(g,Application.DrawToCanvas);

        g.ChangeShader(ShaderType.LimitPalette);

        this.DrawCanvas(g);

        g.transf.ResetStackPointer();
    }
}