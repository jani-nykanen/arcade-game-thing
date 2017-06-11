/*! Controls
 *
 * Global controls class
 * 
 * @author Jani Nykänen
 * @version 1.0
 *
 */

/*! States, enumeration */
State = 
{
    Up : 0,
    Down : 1,
    Pressed : 2,
    Released : 3,
};

/*! Controls class */
class Controls
{
    /*! Init controls */
    static Init()
    {
        this.keystate = new Array(256);
        for(var i=0;i < this.keystate.length; i++)
        {
            this.keystate[i] = State.Up;
        }

        this.mousestate = new Array(16);
        for(var i=0;i < this.mousestate.length; i++)
        {
            this.mousestate[i] = State.Up;
        }

        this.mouse = {x:0,y:0,vpos:{x:0,y:0}};
    }

    /*! Key down event
     * @param key Key
     */
    static OnKeyDown(key)
    {
        if(key >= 0 && key < 256 && this.keystate[key] != State.Down)
            this.keystate[key] = State.Pressed;
    }

    /*! Key up event
     * @param key Key
     */
    static OnKeyUp(key)
    {
        if(key >= 0 && key < 256 && this.keystate[key] != State.Up)
            this.keystate[key] = State.Released;
    }

    /*! Mouse down event
     * @param button Button
     */
    static OnMouseDown(button)
    {
        if(button >= 0 && button < 16 && this.mousestate[button] != State.Down)
            this.mousestate[button] = State.Pressed;
    }

    /*! Mouse up event
     * @param button Button
     */
    static OnMouseUp(button)
    {
        if(button >= 0 && button < 16 && this.mousestate[button] != State.Up)
            this.mousestate[button] = State.Released;
    }

    /*! Update controls */
    static Update(timeMod)
    {
        for(var i = 0; i < this.keystate.length; i++)
        {
            if(this.keystate[i] == State.Pressed)
                this.keystate[i] = State.Down;

            else if(this.keystate[i] == State.Released)
                this.keystate[i] = State.Up;

            if(i < this.mousestate.length)
            {
                if(this.mousestate[i] == State.Pressed)
                    this.mousestate[i] = State.Down;

                else if(this.mousestate[i] == State.Released)
                    this.mousestate[i] = State.Up;
            }
        }
    }

    /*! Set mouse virtual position
     * @param g Graphics object
     * @param fx Frame width
     * @param fy Frame height
     * @param fpos Frame position
     */
    static SetMouseVpos(g,fx,fy,fpos)
    {
        this.mouse.vpos.x = fx / (g.canvas.width-fpos.x*2) * (this.mouse.x-fpos.x);
        this.mouse.vpos.y = fy / (g.canvas.height-fpos.y*2) * (this.mouse.y - fpos.y);
    }

    /*! Mouse move
     * @param x X coordinate
     * @param y Y coordinate
     */
    static OnMouseMove(x,y,screenx,screeny)
    {
        this.mouse.x = x;
        this.mouse.y = y;
    }
}