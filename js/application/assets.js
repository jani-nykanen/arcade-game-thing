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