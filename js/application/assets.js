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
            face1 : Loader.LoadBitmap("assets/bitmaps/face1.png"),
            face2 : Loader.LoadBitmap("assets/bitmaps/face2.png"),
            plant : Loader.LoadBitmap("assets/bitmaps/plant.png"),
            palm : Loader.LoadBitmap("assets/bitmaps/palm.png"),
            ring : Loader.LoadBitmap("assets/bitmaps/ring.png"),
            bullet : Loader.LoadBitmap("assets/bitmaps/bullet.png"),
            hud : Loader.LoadBitmap("assets/bitmaps/hud.png"),
            circle : Loader.LoadBitmap("assets/bitmaps/circle.png"),
            spiral : Loader.LoadBitmap("assets/bitmaps/spiral.png"),
            heart: Loader.LoadBitmap("assets/bitmaps/heart.png"),
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