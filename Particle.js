/**
 * Create a Particle system on canvas through javascript.
 * @author Jatin Mistry
 */
 (function() {
 
    // requestAnim shim layer
    //window.reqAnimationFrame = (function(){
    //  return  window.requestAnimationFrame       || 
    //          window.webkitRequestAnimationFrame || 
    //          window.mozRequestAnimationFrame    || 
    //          window.oRequestAnimationFrame      || 
    //          window.msRequestAnimationFrame     || 
    //          function(/* function */ callback, /* DOMElement */ element){
    //            window.setTimeout(callback, 16);
    //          };
    //})();
	
	
	// Mouse Move Event Handler
	function mouseMove(e){
		mousePointer.x = e.layerX;
		mousePointer.y = e.layerY;
	}
	
	// Mouse Down Event Handler
	function mouseDown(e){
		var len = particles.length;
		var closestIndex = 0;
		var closestDistance = 1000;
		
		for( var i = 0; i < len; i++ ){
			var thisDistance = DistanceBetween( particles[i], mousePointer );
			if( thisDistance < closestDistance ){
				closestDistance = thisDistance;
				closestIndex = i;
			}
		}
		
		if (closestDistance < particles[closestIndex].currentSize){
			particles[closestIndex].frozen = true;
		}
	}
			
	// Method to resize the canvas
    function resize(){
		canvas.width = w = this.innerWidth;
		canvas.height = h = this.innerHeight;
	}
	
	// Calculate Distance between 2 particles or elements
	function DistanceBetween(p1,p2){
		var dx = p2.x-p1.x;
		var dy = p2.y-p1.y;
		return Math.sqrt(dx*dx + dy*dy);
	}
	
	// The main animation loop
	function animate(){
		//debugger;
		animationID = requestAnimationFrame( animate );
    	draw();
    }
    
    // Initialize
    function init(){
	    d = document,
	    canvas = d.body.appendChild(d.createElement('canvas')),
	    context = canvas.getContext('2d'),
	    time = 0,
	    w = canvas.width = this.innerWidth,
	    h = canvas.height = this.innerHeight,
	    m = Math,
	    VELOCITY = 0.5,
	    PARTICLES = 200,
	    mousePointer = {x:0, y:0},
	    particles = [],
	    colors = [ "#FFFFFF","#FFFF00","#FF0000","#00D8CC","#EB3C00","#FFAD01","#4C944A","#8CC84A","#E81123","#4963B7","#FA6800" ];
	    
	    for( var i = 0; i < PARTICLES; i++ ){
	    	// create an array of particles with following properties
			particles.push( { 
				x: m.random()*window.innerWidth, 
				y: m.random()*window.innerHeight, 
				vx: ((m.random()*(VELOCITY*2))-VELOCITY),
				vy: ((m.random()*(VELOCITY*2))-VELOCITY),
				size: 1+m.random()*3,
				color: colors[ m.floor( m.random() * colors.length ) ]
			} );
		}
	    Setup();
    }
    
    // Setup the Particle system to accept mouse events and resize.
    function Setup(){
		canvas.addEventListener('mousemove', mouseMove, false);
		window.addEventListener('mousedown', mouseDown, false);
		window.addEventListener('resize', resize, false);
		resize();
	}
    
    // Draw the particle system
    function draw(){
    	
    	// Clear canvas
    	canvas.width = canvas.width; //Or context.clearRect(0, 0, w, h);
    	
    	// get the total particles to be drawn
    	var len = particles.length;
		var particle;
		
		for( var i = 0; i < len; i++ ){
			particle = particles[i];
			
			//debugger;
			if (!particle.frozen){
				particle.x += particle.vx;
				particle.y += particle.vy;
				
				// Check if particle's x-coordinate is at extreme right of the screen
				if (particle.x > window.innerWidth) {
					particle.vx = -VELOCITY - Math.random();
				}
				// Check if particle's x-coordinate is at extreme left of the screen
				else if (particle.x < 0) {
					particle.vx = VELOCITY + Math.random();
				}
				// Move the particle in x-direction by some fraction
				else {
					particle.vx *= 1 + (Math.random() * 0.0005);
				}
				
				// Check if particle's y-coordinate is at extreme bottom of the screen
				if (particle.y > window.innerHeight) {
					particle.vy = -VELOCITY - Math.random();
				}
				// Check if particle's y-coordinate is at extreme top of the screen
				else if (particle.y < 0) {
					particle.vy = VELOCITY + Math.random();
				}
				// Move the particle in y-direction by some fraction
				else {
					particle.vy *= 1 + (Math.random() * 0.0005);
				}
				
				// calculate the distance between the mouse pointer and the particle
				var distanceFactor = DistanceBetween( mousePointer, particle );
				distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
				
				// set the size of particle depending upon its position from mouse
				particle.currentSize = particle.size*distanceFactor;
			}
			
			// draw the particle
			context.fillStyle = particle.color;
			context.beginPath();
			context.arc(particle.x,particle.y,particle.currentSize,0,Math.PI*2,true);
			context.closePath();
			context.fill();
		}
    }
    
    // Declare variables
	var d, canvas, context, time, w, h, m, VELOCITY, PARTICLES, mousePointer, particles, colors, animationID;
	
	// Initialize
	init();
	
	// Perform animation
	animate();
	
 })();