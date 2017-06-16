/*! Status
 * @author Jani Nykänen
 */ 

 /*! Status class */
 class Status
 {
    /*! Init status */
    static Init()
    {
        this.Reset();
    }

    /*! Reset status */
    static Reset()
    {
        this.health = 5;
        this.bombs = 3;
        this.lvl = 1;
        this.exp = 0;
        this.chain = 10;
        this.chainExp = 0;
        this.score = 0;

        this.bossHealth = 10000;

    }

    /*! Add points
     * @param points Amount of points
     */
    static AddPoints(points)
    {
        Status.score += points * (this.chain / 10.0);
    }
 }