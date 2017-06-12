/*! Application core
 *
 * Includes application core class. The application
 * class extends this class and inherits basic
 * event functions
 *
 * @author Jani Nykänen
 * @version 1.0
 *
 */
 
var classRef = null; //! Required for callback functions

/*! Application core class
 *
 * Application core class. Includes base behaviour like
 * rendering and update loops
 */
class ApplicationCore
{
	/*! Constructor */
	constructor()
	{
		this.oldTime = 0.0;
	}

	/*! Set frame update callback
	 *
	 * Set the callback function that is called
	 * when the frame is updated
	 * @param callback Callback function
	 */
	_SetAnimFrame(callback)
	{
		window.requestAnimationFrame = window.requestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.msRequestAnimationFrame
			|| function(f){return setTimeout(f, 1000.0/60.0)}

		requestAnimationFrame(callback);
	}

	/*! Update frame callback function
	 * @param timestamp Timestamp
	 */
	_UpdateFrame(timestamp)
	{
		classRef.Update(timestamp-classRef.oldTime);
		classRef.oldTime = timestamp;
		requestAnimationFrame(classRef._UpdateFrame);
	}

	/*! Triggered when the document view is resized*/
	static _OnResize()
	{
		if(typeof InstallTrigger !== 'undefined')
		{
			classRef.graphics.canvas.width = window.innerWidth;
			classRef.graphics.canvas.height = window.innerHeight;
			classRef.OnResize(window.innerWidth,window.innerHeight);
		}
		else
		{
			classRef.graphics.canvas.width  = document.documentElement.clientWidth;
			classRef.graphics.canvas.height = document.documentElement.clientHeight;

			classRef.OnResize( document.documentElement.clientWidth,document.documentElement.clientHeight);

		}
	}

	/*! Event callback, on key press */
	static _OnKeyDown(event)
	{	
		Controls.OnKeyDown(event.keyCode);

		if (event.keyCode == 115) 
		{
			Utility.ToggleFullscreen();
		}
	}

	/*! Event callback, on key release */
	static _OnKeyUp(event)
	{	
		Controls.OnKeyUp(event.keyCode);
	}

	/*! Event callback, on mouse move */
	static _OnMouseMove(event)
	{
		Controls.OnMouseMove(event.clientX,event.clientY);
	}

	/*! Event callback, on mouse button down */
	static _OnMouseDown(event)
	{
		Controls.OnMouseDown(event.button);
	}

	/*! Event callback, on mouse button released */
	static _OnMouseUp(event)
	{
		Controls.OnMouseUp(event.button);
	}

	/*! Initialize application
	 *
	 * Initializes application, creates context etc.
	 * 
	 */
	Init()
	{
		this.OnStart();
		
		classRef = this;

		this.graphics = new Graphics();
		Mesh.Init(this.graphics.gl);
		TexLoader.Init(this.graphics.gl);

		this.OnInit();

		this._SetAnimFrame(function(timestamp){classRef._UpdateFrame(timestamp);});
		
		Utility.Init(this.graphics.canvas);

		window.addEventListener('resize',ApplicationCore._OnResize);

		if(typeof InstallTrigger !== 'undefined')
		{
			this.graphics.canvas.width = window.innerWidth;
			this.graphics.canvas.height = window.innerHeight;
			this.OnResize(window.innerWidth,window.innerHeight);
		}
		else
		{

			this.graphics.canvas.width = document.documentElement.clientWidth;
			this.graphics.canvas.height = document.documentElement.clientHeight;
			this.OnResize(document.documentElement.clientWidth,document.documentElement.clientHeight);

		}

		Controls.Init();
		window.addEventListener("keydown",ApplicationCore._OnKeyDown);
		window.addEventListener("keyup",ApplicationCore._OnKeyUp);
		window.addEventListener("mousemove",ApplicationCore._OnMouseMove);
		window.addEventListener("mousedown",ApplicationCore._OnMouseDown);
		window.addEventListener("mouseup",ApplicationCore._OnMouseUp);

		// Prevent right-click menu
		this.graphics.canvas.addEventListener('contextmenu', function(e) 
		{
			if (e.button === 2) 
			{
				e.preventDefault();
				return false;
			}
		}, false);
		
	}

	/*! Update loop
	 * Update loop, updates 60 times a second
	 * @param deltaTime Timeframe between this and the previous frame
	 */
	Update(deltaTime)
	{
		
		this.OnUpdate(deltaTime);	
		this.Draw(this.graphics);	
		Controls.Update();
	}

	/*! Render frame
	 * Renders the current frame
	 * @param g Graphics objects
	 */
	Draw(g)
	{
		g.SetViewport(g.canvas.width,g.canvas.height);
		this.OnDraw(g);
	}

	/*! Run application
	 *
	 * Runs the application
	 */
	Run()
	{
		try
		{
			this.Init();
		}
		catch(e)
		{
			window.alert("A fatal error occurred: " + e.message);
			console.log("A fatal error occurred: " + e.message);
		}
		finally
		{
			// Deposit elements that may need to be deposited
			// (Not likely, this is not C, my friend!)
		}
	}

	/*! Event triggered on launch, before initializing */
	OnStart(){};
	/*! Event triggered after initializing */
	OnInit(){};
	/*! Event triggered when the game logic is updated */
	OnUpdate(delta){};
	/*! Event triggered when the game screen is drawn */
	OnDraw(g){};
	/*! Called when the canvas is resized */
	OnResize(width,height){};
}
