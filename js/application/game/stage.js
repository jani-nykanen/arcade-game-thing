/*! Game stage
 * @author Jani Nykänen
 */

/*! Stage class */
class Stage
{
    /*! Initialize
     * @param Super Application class object
     */
    static Init(Super)
    {
        this.spacePos = 0.0;
        this.sunAngle = 0.0;    
        this.shineValue = 0.0;

        this.spaceFrame = new Framebuffer(Super.graphics.gl,320,240);
        this.canvasFrame = Super.canvas;
    }

    /*! Draw space
     * @param g Graphics object
     */
    static DrawSpace(g)
    {
        g.SetFiltering(TextureFilter.Linear);
        g.SetDepthTesting(true);
        
        g.ChangeShader(ShaderType.Fog);
        g.ClearScreen(0,0,0);

        g.transf.Identity();
        g.transf.Perspective(75.0,320.0/240.0,0.1,100.0);
        g.transf.View(vec3.fromValues(0,0,-1 + Stage.spacePos),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        g.transf.Scale(0.5,0.5,2.0);
        g.transf.Use();

        g.eff.SetFog(0,0,0,3.5,8);
        g.eff.Use();
        
        g.DrawMesh(Shapes.cylinder,Assets.textures.space.tex);
    }

    /*! Draw sun
     * @param g Graphics object
     */
    static DrawSun(g)
    {
        g.SetDepthTesting(false);
        g.ChangeShader(ShaderType.Default);

        // Draw "shine"
        g.transf.Identity();
        g.transf.Ortho2D(320,240);
        g.transf.Use();

        g.eff.Reset();
        var shineMod = 0.8 + 0.1 * (Math.sin(this.shineValue) +1);
        g.eff.SetColor(shineMod,shineMod,shineMod,shineMod);
        g.eff.Use();

        shineMod = 0.9 + 0.05 * (Math.sin(this.shineValue) +1);
        g.DrawScaledBitmap(Assets.textures.sunShine,160-160*shineMod,120-120*shineMod,320*shineMod,240*shineMod);

        g.ChangeShader(ShaderType.Fog);
        
        // Draw the actual sun
        g.SetDepthTesting(true);

        g.transf.Identity();
        g.transf.Perspective(75.0,320.0/240.0,0.1,100.0);
        g.transf.View(vec3.fromValues(0,0,0),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        
        g.transf.Translate(0.0,0.0,5.0);
        g.transf.RotateQuaternion(Stage.sunAngle,Stage.sunAngle*2,Stage.sunAngle / 2);
        g.transf.Scale(0.25,0.25,0.25);
        g.transf.Use();

        g.eff.Reset();
        g.eff.SetFog(1,1,0.6,4.7,4.85);
        g.eff.Use();

        g.DrawMesh(Shapes.sphere,Assets.textures.sun.tex);

        g.ChangeShader(ShaderType.Default);

        g.SetFiltering(TextureFilter.Nearest);
    }

    /*! Update
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        this.spacePos += 0.025 * timeMod;
        if(this.spacePos >= 1.0)
            this.spacePos -= 1.0;

        this.sunAngle  += 0.005 * timeMod;

        this.shineValue += 0.025 * timeMod;
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        this.spaceFrame.DrawTo(g,this.DrawSpace,this.canvasFrame);

        this.DrawSpace(g);
        this.DrawSun(g);
        
    }
}