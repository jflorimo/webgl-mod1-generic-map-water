var container;

var camera, controls, scene, renderer, axes;

var cross;

init();
animate();

function init() 
{

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
	camera.position.x = 0;
	camera.position.y = -100;
	camera.position.z = 20;

	camera.lookAt(new THREE.Vector3( 1, 0, 0 ));

	controls = new THREE.TrackballControls( camera );

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.3;

	controls.keys = [ 65, 83, 68 ];

	controls.addEventListener( 'change', render );

	// world

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.002 );

	axes = buildAxes( 10 );
	scene.add( axes );

	//x,y,z    x largeur y longeur, zhauteur
	var mountain1 = [10, 10, 20];
	var mountain2 = [20, 0, 20];
		
	var geometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );

	geometry.vertices = generateMountain(geometry.vertices, mountain1, 100);

	var material = new THREE.MeshBasicMaterial({color: 0xcccccc, wireframe: true});
	var plane = new THREE.Mesh( geometry, material );
	scene.add( plane );


	// lights

	light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	light = new THREE.DirectionalLight( 0x002288 );
	light.position.set( -1, -1, -1 );
	scene.add( light );

	light = new THREE.AmbientLight( 0x222222 );
	scene.add( light );


	// renderer

	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setClearColor( scene.fog.color );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );

	container = document.body;
	container.appendChild( renderer.domElement );


	window.addEventListener( 'resize', onWindowResize, false );

	render();
}

function onWindowResize() 
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	controls.handleResize();

	render();
}

function animate() 
{
	requestAnimationFrame( animate );
	controls.update();
}

function render() 
{
	renderer.render( scene, camera );
}

function buildAxes( length ) 
{
        var axes = new THREE.Object3D();

        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
        axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z

        return axes;

}

function buildAxis( src, dst, colorHex, dashed ) {
	var geom = new THREE.Geometry(),
		mat; 

	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
	} else {
		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}

	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );
	geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

	var axis = new THREE.Line( geom, mat, THREE.LinePieces );

	return axis;

}

function generateMountain(vertices, mountain, div)
{
	var coefWidth = 1;
	var coefHeight = 0;
	for(var i = 0; i < vertices.length; i++)
	{
		if(vertices[i].x == mountain[0] && vertices[i].y == mountain[1])
		{
			console.log("trouver");
			vertices[i].z = 10;
			for ( var deg = 0; deg < 360; deg+= 0.1 )
			{
				for (var dist = 0; dist < mountain[2]; dist+= 0.1)
				{
					var x = Math.round(dist * Math.cos(Math.PI * deg / 180));
					var y = Math.round(dist * Math.sin(Math.PI * deg / 180));
					
					var tabIndex = i + x *(div+1) + y ;

					var ymid = mountain[2]/2;
					var ampl = mountain[2]/2;

					var heigh = ymid+coefHeight + ampl*coefWidth * Math.cos( Math.PI / mountain[2] * dist );

					if (vertices[tabIndex].z < heigh) 
						vertices[tabIndex].z =  heigh;
				}
			}
		}
	}
	return vertices;
}
