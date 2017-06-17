/*! Camera
 * @author Jani Nykänen
 */

/*! Global camera class */
class Camera
{
    /*! Initialize */
    static Init()
    {
        this.x = 0;
        this.y = 0;

        this.shake = {x:0,y:0};
        this.shakeTimer = 0;
        this.shakeValue = 1;
    }

    /*! Limit camera to the game area */
    static Limit()
    {
        if(this.x < -1.25) 
            this.x = -1.25;
        else if(this.x > 1.25) 
            this.x = 1.25;

        if(this.y < -1.75) 
            this.y = -1.75;
        else if(this.y > 1.75) 
            this.y = 1.75;
    }

    /*! Update camera (mostly shaking)
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.shakeTimer > 0)
        {
            this.shakeTimer -= 1.0 * timeMod;
            Camera.shake.x = (Math.random() * 0.03 - 0.015)*this.shakeValue;
            Camera.shake.y = (Math.random() * 0.03 - 0.015)*this.shakeValue;
        }
        else
        {
            this.shakeTimer = 0.0;
            Camera.shake.x = 0;
            Camera.shake.y = 0;
            this.shakeValue = 1.0;
        }
    }

    /*! Shake
     * @param timer Shake timer
     * @param value Shake value
     */
    static Shake(timer,value)
    {
        this.shakeTimer += timer;
        this.shakeValue = value;
    }
}