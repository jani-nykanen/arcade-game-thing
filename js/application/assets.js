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
            cursor : Loader.LoadBitmap("assets/bitmaps/cursor.png"),
            space : Loader.LoadBitmap("assets/bitmaps/space.png"),
            sun : Loader.LoadBitmap("assets/bitmaps/sun.png"),
            sunShine : Loader.LoadBitmap("assets/bitmaps/sun_shine.png"),
            earth : Loader.LoadBitmap("assets/bitmaps/earth.png"),
            bee : Loader.LoadBitmap("assets/bitmaps/bee_anim.png"),
            gas : Loader.LoadBitmap("assets/bitmaps/gas.png"),
            platform : Loader.LoadBitmap("assets/bitmaps/platform.png"),
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