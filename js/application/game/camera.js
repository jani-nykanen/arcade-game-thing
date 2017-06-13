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
    }

    /*! Limit camera to the game area */
    static Limit()
    {
        if(this.x < -1.75) 
            this.x = -1.75;
        else if(this.x > 1.75) 
            this.x = 1.75;

        if(this.y < -1.75) 
            this.y = -1.75;
        else if(this.y > 1.75) 
            this.y = 1.75;
    }
}