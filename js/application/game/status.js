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
        this.healthRestore = 0;
        this.bombs = 3;
        this.level = 1;
        this.exp = 0;
        this.chain = 10;
        this.chainExp = 0;
        this.chainWait = 0;
        this.score = 0;

        this.bossHealth = 10000;
        this.handsDefeated = 0;

        this.phase = 1;

        this.time = 0;

    }

    /*! Add points
     * @param points Amount of points
     */
    static AddPoints(points)
    {
        this.score += points * (this.chain);
        this.chainExp += points/this.chain / 10.0;

        if(points < 1000)
        {
            this.exp += points/ (150 * this.level);
        }

        if(this.chainExp >= 1.0)
        {
            while(this.chainExp > 1.0)
            {
                this.chainExp -= 1.0;
                this.chain ++;
            }
        }

        this.chainWait = 30;
    }

    /*! Update status
     * @param timeMod Time modifier
     */
    static Update(timeMod)
    {
        if(this.bossHealth < 0)
            this.bossHealth = 0;

        this.time += 1.0 * timeMod;

        if(this.health < 5)
        {
            this.healthRestore += 0.0025 * timeMod;
            if(this.healthRestore >= 1.0)
            {
                this.health ++;
                this.healthRestore -= 1.0;
                if(this.health == 5)
                    this.healthRestore = 0;
            }
        }

        if(this.level == 9)
            this.exp = 1.0;

        if(this.chainWait <= 0)
        {
            this.chainExp -= 0.001;
        }
        else
        {
            this.chainWait -= 1.0 * timeMod;
        }
        if(this.chainExp < 0.0)
        {
            if(this.chain > 10)
            {
                this.chain --;
                this.chainExp += 1.0;
            }
            else
            {
                this.chain = 10;
                this.chainExp = 0.0;
            }
        }

        /* Debug codes
         * @todo Add own class for them
         */
        if(Controls.keystate[225] == State.Down)
        {
            if(Controls.keystate[80] == State.Pressed && this.level < 9)
            {
                this.exp = 1.0;
            }

            if(Controls.keystate[79] == State.Pressed)
            {
                Status.bossHealth = 6000;
            }

            if(Controls.keystate[73] == State.Pressed)
            {
                for(var i = 0; i < GameObjects.boss.hands.length; i++)
                {
                    GameObjects.boss.hands[i].dead = true;
                    GameObjects.boss.hands[i].deathTimer = 60;
                }
                Status.bossHealth = 4001;
                Status.handsDefeated = 4;
            }
        }

        if(this.exp >= 1.0 && this.level < 9)
        {
            GameObjects.CreateMessage("Level Up!",160 - 9*8,96,-3);

            this.exp -= 1.0;
            this.level ++;
        }
    }
 }