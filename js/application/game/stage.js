/*! Game stage
 * @author Jani Nykänen
 */

/*! Stage class */
class Stage
{
    /*! Initialize
     */
    static Init()
    {
        this.spacePos = 0.0;
        this.sunAngle = 0.0;    
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
    }

    /*! Draw
     * @param g Graphics object
     */
    static Draw(g)
    {
        g.SetDepthTesting(true);

        g.ChangeShader(ShaderType.Fog);
        g.ClearScreen(0,0,0);

        g.transf.Identity();
        g.transf.Perspective(75.0,320.0/240.0,0.1,100.0);
        g.transf.View(vec3.fromValues(0,0,-1 + this.spacePos),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        g.transf.Scale(0.5,0.5,2.0);
        g.transf.Use();

        g.eff.SetFog(0,0,0,3.5,8);
        g.eff.Use();
        
        g.DrawMesh(Shapes.cylinder,Assets.textures.space.tex);

        g.transf.Identity();
        g.transf.View(vec3.fromValues(0,0,0),vec3.fromValues(0,0,1),vec3.fromValues(0,1,0));
        
        g.transf.Translate(0.0,0.0,5.0);
        g.transf.RotateQuaternion(this.sunAngle,this.sunAngle*2,this.sunAngle / 2);
        g.transf.Scale(0.25,0.25,0.25);
        g.transf.Use();

        g.eff.SetFog(1,1,0,4.7,5.25);
        g.eff.Use();

        g.DrawMesh(Shapes.sphere,Assets.textures.sun.tex);

        g.ChangeShader(ShaderType.Default);

        
    }
}