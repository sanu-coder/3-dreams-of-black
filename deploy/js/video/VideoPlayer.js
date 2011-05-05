var VIDEO_OPAQUE = 1;
var VIDEO_HALFALPHA = 2;
var VIDEO_OPAQUE_DISTORT = 3;
var VIDEO_KEYED = 4;
var VIDEO_KEYED_DISTORT = 5;
var VIDEO_KEYED_INVERSE = 6;
var VIDEO_SMARTALPHA = 7;
var VIDEO_SMARTALPHA_DISTORT = 8;

var VideoPlayer = function( shared, layers, conf ) {

	var that = this;
	
	SequencerItem.call( this );

	var config = {};
	var planes = [];
	var gridLoaded = false;
	
	var scene, camera;
	var renderer = shared.renderer, renderTarget = shared.renderTarget;
	
	var mouseX = 0, mouseY = 0;
	var targetPos;
	
	this.duration = layers[0].duration;
	if(!this.duration) console.log("No duration in " + layers[0].path);
	
	this.init = function(){
		
		config.prx = conf.paralaxHorizontal || 0;
		config.pry = conf.paralaxVertical || 0;
		config.tgd = conf.targetDistance || 1500;
		
		onGrid = function(geometry){

			config.grid = geometry;
			that.onLoad();

		}
		
		gridLoader = new THREE.JSONLoader();
		gridLoader.load( { model: "files/models/VideoDistortGrid.js", callback: onGrid } );

	}
	
	this.onLoad = function() {

		gridLoaded = true;
	
	 	shared.signals.mousemoved.add(function(){

	 		mouseX = ( shared.mouse.x / shared.screenWidth ) * -2 + 1;
	 		mouseY = ( shared.mouse.y / shared.screenHeight ) * 2 - 1;

	 	});
		
		targetPos = new THREE.Vector2( 0, 0 );
		
		config.fov = 54;
		config.aspect = 2.35;
		config.adj = Math.tan( config.fov * Math.PI / 360 ) * 2;
		
		camera = new THREE.Camera( config.fov, config.aspect, 1, 100000 );
		camera.target.position = new THREE.Vector3( 0, 0, config.tgd * -1 );
		camera.updateMatrix();
		
		scene = new THREE.Scene();
		scene.addLight( new THREE.AmbientLight( 0x000000 ) );
		scene.addObject(camera);

		for(var i = 0; i < layers.length; i++) {			
			var p = new VideoPlane(shared, layers[i], config);
			planes.push(p);
		}
	}
	
	this.show = function( progress ) {
		for ( var i = 0; i < planes.length; i++ ) {
			var p = planes[i];
			if(p.locked) camera.addChild(p.mesh);
			else scene.addChild(p.mesh);
			p.start( progress );
		}
	}
	
	this.hide = function(){
		for ( var i = 0; i < planes.length; i++ ) {
			planes[i].stop();
		}
	}
	
	this.update = function( progress, delta, time ) {
		if(!gridLoaded) return;
		
		targetPos.x = mouseX * -2 * config.prx;
		targetPos.y = mouseY * 2 * config.pry;
		
		targetPos.x = Math.min(targetPos.x, config.prx);
		targetPos.x = Math.max(targetPos.x, -config.prx);
		
		targetPos.y = Math.min(targetPos.y, config.pry);
		targetPos.y = Math.max(targetPos.y, -config.pry);
		
		camera.target.position.x += (targetPos.x - camera.target.position.x) / 2;
		camera.target.position.y += (targetPos.y - camera.target.position.y) / 2;	
				
		for (var i = 0; i < planes.length; i++) {
			var p = planes[i];
			
			if(progress > p.removeAt && !p.removed) {
				if(p.locked) camera.removeChild(p.mesh);
				scene.removeChild(p.mesh);
				p.stop();
				p.removed = true;
				console.log( p.path + " removed at " + progress + " (planned at " + p.removeAt + ")" );
			} else {
				p.update( progress, mouseX, mouseY );
			}
		}
		
		renderer.render( scene, camera, renderTarget );
		//renderer.render( scene, camera );
	}
}


VideoPlayer.prototype = new SequencerItem();
VideoPlayer.prototype.constructor = VideoPlayer;
