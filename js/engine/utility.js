/*! Utility functions
 *
 * Some useful utility functions, like toggle fullscreen mode etc.
 * @author Jani Nykänen
 * @version 1.0
 * 
 */

/*! Replace portion in a string
 * @param index Index
 * @param replacement Replacement
 */
String.prototype.replaceAt=function(index, replacement) 
{
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

/*! Direction */
var Direction =
{
    XY : 0,
    XZ : 1,
    YZ : 2,
};

/*! Utility class */
class Utility
{
    /*! Init utility */
    static Init(canvas)
    {
        this.canvas = canvas;
        this.isFullscreen = false;
    }

    /*! Toggle fullscreen */
    static ToggleFullscreen()
    {
        var elem = Utility.canvas;

        if(!Utility.isFullscreen)
        {
            if (elem.webkitRequestFullScreen)
            {
                elem.webkitRequestFullScreen();
                Utility.isFullscreen = true;
            }
            else if (elem.mozRequestFullScreen)
            {
                elem.mozRequestFullScreen();
                Utility.isFullscreen = true;
            }
            else if(elem.requestFullScreen)
            {
                elem.requestFullScreen();
                Utility.isFullscreen = true;
            }
        }
        else
        {
            if (document.exitFullscreen)
            {
                document.exitFullscreen();
                Utility.isFullscreen = false;
            }
            else if (document.webkitExitFullscreen)
            {
                document.webkitExitFullscreen();
                Utility.isFullscreen = false;
            }
            else if (document.mozExitFullscreen)
            {
                document.mozExitFullscreen();
                Utility.isFullscreen = false;
            }
        }
    
    }


        /*! Is point p inside triangle (A,B,C)
        * @param p Point
        * @param A A point in triangle
        * @param B B point in triangle
        * @param C C point in triangle
        * @param dir Direction
        */
        static InsideTriangle(p,A,B,C,dir)
        {
            var p1 = {x:0,y:0}, p2 = {x:0,y:0}, p3 = {x:0,y:0};
            var t = {x:0,y:0};

            switch(dir)
            {
            case Direction.XY:
                p1.x = A.x; p1.y = A.y;
                p2.x = B.x; p2.y = B.y;
                p3.x = C.x; p3.y = C.y;
                t.x = p.x; t.y = p.y;
                break;

            case Direction.XZ:
                p1.x = A.x; p1.y = A.z;
                p2.x = B.x; p2.y = B.z;
                p3.x = C.x; p3.y = C.z;
                t.x = p.x; t.y = p.z;
                break;

            case Direction.YZ:
                p1.x = A.y; p1.y = A.z;
                p2.x = B.y; p2.y = B.z;
                p3.x = C.y; p3.y = C.z;
                t.x = p.y; t.y = p.z;
                break;

            default:
                break;
            }

            var as_x = t.x-p1.x;
            var as_z = t.y-p1.y;

            var s_ab = (p2.x-p1.x)*as_z-(p2.y-p1.y)*as_x > 0;

            return ( (((p3.x-p1.x)*as_z-(p3.y-p1.y)*as_x > 0) == s_ab)
                || (((p3.x-p2.x)*(t.y-p2.y)-(p3.y-p2.y)*(t.x-p2.x) > 0) != s_ab) )
                ? false : true;
        }

    /*! Get axis from quat */
    static GetAxisFromQuat(x,y,z)
    {
        var q = quat.fromValues(x,y,z,1);
		quat.calculateW(q,q);

        var axis = vec3.create();
        var rad = quat.getAxisAngle(axis,q);
        return {rad:rad,axis: {x: axis[0],y:axis[1],z:axis[2]} };
    }
    
    /*! Integer to string with zeros (max 8)
     * @param number Number
     */
    static IntToStringWithZeros(number)
    {
        // Make the number integer, if it's not already
        number = Math.floor(number); 

        var str = "00000000";
        if(number == 0) return str;

        str = str.replaceAt(8-String(number).length,String(number));

        return str;
    }
}
