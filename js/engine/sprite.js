/*! Sprite
 * @author Jani Nykänen
 */

/*! Sprite class */
class Sprite
{
    /*! Constructor
     * @param w Sprite width in pixels
     * @param h Sprite height in pixels
     */
    constructor(w,h)
    {
        this.width = w;
        this.height = h;

        this.currentFrame = 0;
        this.currentRow = 0;
        this.changeFrameCount = 0;
    }

    /*! Animate sprite
     * @param row Target row
     * @param start Starting frame
     * @param end Ending frame
     * @param speed Animation speed
     * @param timeMod Time modifier
     */
    Animate(row,start,end,speed,timeMod)
    {
        if(start == end)
        {
            this.changeFrameCount = 0;
            this.currentFrame = start;
            this.currentRow = row;
            return;
        }

        if(this.currentRow != row)
        {
            this.changeFrameCount = 0;
            this.currentFrame = start;
            this.currentRow = row;
        }

        if(this.currentFrame < start)
        {
            this.currentFrame = start;
        }

        this.changeFrameCount += 1.0 *timeMod;
        if(this.changeFrameCount > speed)
        {
            this.currentFrame = this.currentFrame + 1;

            if(this.currentFrame > end)
            {
                this.currentFrame = start;
            }
            this.changeFrameCount -= speed;
        }
    } 
}