/*! Assets
 *
 * Global class for assets
 * so every file can get access
 * to them
 * @author Jani Nykänen
 * @version 1.0
 */

/*! Assets class */
class Assets
{
    /*! Load assets */
    static Load()
    {
        this.textures = {};

        this.textures =
        {
            font16 : Loader.LoadBitmap("assets/bitmaps/font16.png"),
            font24 : Loader.LoadBitmap("assets/bitmaps/font24.png"),
            cursor : Loader.LoadBitmap("assets/bitmaps/cursor.png"),
            space : Loader.LoadBitmap("assets/bitmaps/space.png"),
            space2 : Loader.LoadBitmap("assets/bitmaps/space2.png"),
            sun : Loader.LoadBitmap("assets/bitmaps/sun.png"),
            sunShine : Loader.LoadBitmap("assets/bitmaps/sun_shine.png"),
            earth : Loader.LoadBitmap("assets/bitmaps/earth.png"),
            bee : Loader.LoadBitmap("assets/bitmaps/bee_anim.png"),
            gas : Loader.LoadBitmap("assets/bitmaps/gas.png"),
            platform : Loader.LoadBitmap("assets/bitmaps/platform.png"),
            face : Loader.LoadBitmap("assets/bitmaps/face1.png"),
            plant : Loader.LoadBitmap("assets/bitmaps/plant.png"),
            palm : Loader.LoadBitmap("assets/bitmaps/palm.png"),
            ring : Loader.LoadBitmap("assets/bitmaps/ring.png"),
            bullet : Loader.LoadBitmap("assets/bitmaps/bullet.png"),
            hud : Loader.LoadBitmap("assets/bitmaps/hud.png"),
            circle : Loader.LoadBitmap("assets/bitmaps/circle.png"),
            spiral : Loader.LoadBitmap("assets/bitmaps/spiral.png"),
            heart: Loader.LoadBitmap("assets/bitmaps/heart.png"),  
            asteroid: Loader.LoadBitmap("assets/bitmaps/asteroid.png"),  
        };

        this.music = 
        {
            theme : Loader.LoadMusic("assets/audio/theme.ogg"),
            ending : Loader.LoadMusic("assets/audio/ending.mp3"),
        }

        this.sounds = 
        {
            shoot : Loader.LoadSound("assets/audio/shoot.wav"),
            hit : Loader.LoadSound("assets/audio/hit.wav"),
            hurt : Loader.LoadSound("assets/audio/hurt.wav"),
            explosion : Loader.LoadSound("assets/audio/explosion.wav"),
            warp : Loader.LoadSound("assets/audio/warp.wav"),
            enemyShoot : Loader.LoadSound("assets/audio/enemy_shoot.wav"),
            getBack : Loader.LoadSound("assets/audio/get_back.wav"),
            specialShoot : Loader.LoadSound("assets/audio/special_shoot.wav"),
            levelUp : Loader.LoadSound("assets/audio/level_up.wav"),
            destroy : Loader.LoadSound("assets/audio/destroy.wav"),
            destroy2 : Loader.LoadSound("assets/audio/destroy2.wav"),
            heart : Loader.LoadSound("assets/audio/heart.wav"),
            bump : Loader.LoadSound("assets/audio/bump.wav"),
            weird : Loader.LoadSound("assets/audio/weird.wav"),
            finalExplosion : Loader.LoadSound("assets/audio/final_explosion.ogg"),
        }
    }

    /*! Are assets loaded
     * @return Loading state
     */
    static HasLoaded()
    {
        return Loader.HasLoaded();
    }
}