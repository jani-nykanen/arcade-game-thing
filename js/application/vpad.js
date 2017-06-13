/*! Virtual game pad
 * @author Jani Nykänen
 */

/*! Vpad class */
class VPad
{
    /*! Initialize */
    static Init()
    {
        this.axis = {x:0,y:0};
        this.buttons = new Array();
    }

    /*! Push a new button to the button array
     * @param name Button name
     * @param key Key value
     */
    static PushButton(name,key)
    {
        this.buttons[name] = {state: State.Up, keycode: key};
    }

    /*! Update vpad */
    static Update()
    {
        for(var key in this.buttons)
        {
            this.buttons[key].state = Controls.keystate[this.buttons[key].keycode];
        }

        this.axis.x = 0;
        this.axis.y = 0;

        if(Controls.keystate[37] == State.Down || Controls.keystate[65] == State.Down)
            this.axis.x = -1.0;
        else if(Controls.keystate[39] == State.Down || Controls.keystate[68] == State.Down)
            this.axis.x = 1.0;

        if(Controls.keystate[38] == State.Down || Controls.keystate[87] == State.Down)
            this.axis.y = -1.0;
        else if(Controls.keystate[40] == State.Down || Controls.keystate[83] == State.Down)
            this.axis.y = 1.0;

        // Emulate analogue stick behaviour
        // If the stick points diagonal, it's value is not (1,1), but (cos45,sin45)
        if(Math.abs(this.axis.x) == Math.abs(this.axis.y))
        {
            this.axis.x *= 0.707;
            this.axis.y *= 0.707;
        }
    }
}