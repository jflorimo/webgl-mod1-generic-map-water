var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene;
var camera;
var light;
var ground;

var particlesSize = 3.5;
var radius = particlesSize/2;
var altitude = [];
var mapDiv;
var tree;

var initScene = function ()
{
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 0, 0.2);
	return scene;
};

var initCamera = function ()
{
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-80, 50, -80), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
	return camera;
};

var initLight = function ()
{
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .7;
	var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
	d1.position = new BABYLON.Vector3(-300,300,600);
	return light;
};


var createMountain = function ( positions, vertexPoint, mapDiv )
{
	var coefWidth = 1;
	var coefHeight = 0;
	for (var i = 0; i < positions.length; i+=3)
	{
	    if ( positions[i] == vertexPoint[0] && positions[i+2] == vertexPoint[2] )
	    {
			
			for ( var deg = 0; deg < 360; deg+= 0.1 )
			{
				for (var dist = 0; dist < vertexPoint[1]; dist+= 0.1)
				{			
					var x = Math.round(dist * Math.cos(Math.PI * deg / 180));
					var z = Math.round(dist * Math.sin(Math.PI * deg / 180));
					
					var tabIndex = i + x *(mapDiv+1)*3 + z*3 + 1;

					var ymid = vertexPoint[1]/2;
					var ampl = vertexPoint[1]/2;

					var heigh = ymid+coefHeight + ampl*coefWidth * Math.cos( Math.PI / vertexPoint[1] * dist );

					if (positions[tabIndex] < heigh) 
						positions[tabIndex] =  heigh;
				}
			}
	    }
	}
	return positions;
};

var createScene = function () 
{

scene = initScene();
camera  = initCamera();
light = initLight();

BABYLON.Engine.ShadersRepository = "shaders/";

var skybox = BABYLON.Mesh.CreateSphere("skyBox", 10, 500, scene);

var shader = new BABYLON.ShaderMaterial("gradient", scene, "gradient", {});
shader.setFloat("offset", 0);
shader.setFloat("exponent", 0.6);
shader.setColor3("topColor", BABYLON.Color3.FromInts(0,119,255));
shader.setColor3("bottomColor", BABYLON.Color3.FromInts(240,240, 255));
shader.backFaceCulling = false;
skybox.material = shader;

skybox.position.y = -80;

var colorMaterial = new BABYLON.StandardMaterial("ground", scene);
colorMaterial.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
colorMaterial.specularColor = BABYLON.Color3.Black();

var waterColor = new BABYLON.StandardMaterial("ground", scene);
waterColor.diffuseColor = BABYLON.Color3.FromInts(70, 130, 180);
waterColor.specularColor = BABYLON.Color3.Black();

var wireMaterial = new BABYLON.StandardMaterial("texture1", scene);
wireMaterial.wireframe = true;
//    box.scaling.y = 0.1;
// 
// // Ground
// var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene);
// ground.material = new BABYLON.StandardMaterial("ground", scene);
// ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
// ground.material.specularColor = BABYLON.Color3.Black();


var mapSize = [100, 100, 100];
var mountain1 = [10, 20, -10];
var mountain2 = [20, 20, 0];
var mountain3 = [20, 40, 0];
mapDiv = mapSize[2];
// var sphere1 = BABYLON.Mesh.CreateSphere("sphere", 4.0, 2.0, scene);
// sphere1.position = new BABYLON.Vector3(10,20,-10);
// var sphere2 = BABYLON.Mesh.CreateSphere("sphere", 4.0, 2.0, scene);
// sphere2.position = new BABYLON.Vector3(20,20,0);

ground = BABYLON.Mesh.CreateGround("ground", mapSize[0], mapSize[1], mapSize[2], scene);
// ground.material = wireMaterial;
ground.material = colorMaterial;
    
var positions = ground.getVerticesData("position");  

for(var i= 0; i < param_map.length; i++)
{
	positions = createMountain(positions, param_map[i], mapSize[2]);
}
// positions = createMountain(positions, mountain1, mapSize[2]);

// positions = createMountain(positions, mountain2, mapSize[2]);

ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

ground.convertToFlatShadedMesh();

CreateArrayOfAltitude(positions);


var numParticles = 3500;
var particleSystem = new BABYLON.ParticleSystem("particles", numParticles, scene);
console.log(param_mod);
if (param_mod == "water")
{
	spreadWater(particleSystem, -25, 3, 0, 1000, particlesSize + 3.8, scene);
	particleSystem.minEmitBox = new BABYLON.Vector3(-20, 0, -50);
	particleSystem.maxEmitBox = new BABYLON.Vector3(70, 0, 50);
	particleSystem.gravity = new BABYLON.Vector3(0, -0.02, 0);	
}
else if (param_mod == "wave")
{
	spreadWater(particleSystem, -50, 0, 0, 2000, particlesSize + 0.5, scene);
}
else
{
	spreadWater(particleSystem, 0, 100, 80, 200, particlesSize + 0.2, scene);
}

//limits = [right, left, up, down]
// var limits = [-30, -50, 10, -10];
var limits = [50, -50, 50, -50];
var gravity = 0.38;

tree = new OCTREE.tree(5,10,20);

particleSystem.updateFunction = function ( particles )
{
		for ( var i = 0; i < particles.length; i++ )
		{
			var particle1 = particles[i];

			if ( particle1.position.y + radius >= ground.position.y )
			{
				particle1.direction.y -= gravity/2; // gravity
				particle1.position = particle1.position.add( particle1.direction );
				particle1.direction.y = -gravity/2; // gravity
				// particle1.direction.scaleToRef(this._scaledUpdateSpeed, this._scaledDirection);
				// particle1.position.addInPlace(this._scaledDirection);

				// this.gravity.scaleToRef(this._scaledUpdateSpeed, this._scaledGravity);
				// particle1.direction.addInPlace(this._scaledGravity);
			}
			for (var j = i + 1; j < particles.length; j++)
			{
				var particle2 = particles[j];
				if (detectSphereCollision(particle1, particle2))
				{
					var delta = particle1.position.subtract(particle2.position);
					var d = delta.length();

					var tmp = ( (particlesSize) -d ) / d;
					var mtd = delta.multiplyByFloats( tmp, tmp, tmp );

					var im1 = 1 / 5; 
					var im2 = 1 / 5;
			
					var tmp1 = im1 / ( im1 + im2 );
					particle1.position.addInPlace( mtd.multiplyByFloats( tmp1, tmp1, tmp1 ) );
					var tmp2 = im2 / ( im1 + im2 );
					particle2.position.subtractInPlace( mtd.multiplyByFloats( tmp2, tmp2, tmp2 ) );
				
					var v = particle1.direction.subtract( particle2.direction );
					var vn = BABYLON.Vector3.Dot( v, mtd.normalize() );
					
					if (vn < 0.0)
					{
						var reduction = 0.5;
						var i_ = ( -( 1.0 + reduction ) * vn ) / ( im1 + im2 );
						var impulse = mtd.normalize().multiplyByFloats( i_, i_, i_ );

						particle1.direction.addInPlace( impulse.multiplyByFloats( im1, im1, im1 ) );
						particle2.direction.subtractInPlace( impulse.multiplyByFloats( im2, im2, im2 ) );
					}
					// particle1.direction.multiplyByFloats(0.001, 0.001, 0.001);
					// particle2.direction.multiplyByFloats(0.001, 0.001, 0.001);
				}
			}
			var alt = getAltitude(particle1.position.x, particle1.position.z );

			if ( particle1.position.y - radius <= 0 )
			{
				particle1.position.y = 0 + radius;
			}
			var right = limits[0];
			if( particle1.position.x + radius >= right )//50
			{
				particle1.position.x = right - radius;
				particle1.direction.x *= -0.8;
			}
			var up = limits[2];
			if( particle1.position.z + radius >= up )//50
			{
				particle1.position.z = up - radius;
				particle1.direction.z *= -0.8;
			}
			var down = limits[3];
			if( particle1.position.z - radius <= down )//-50
			{
				particle1.position.z = down + radius;
				particle1.direction.z *= -0.8;
			}
			var left = limits[1];
			if( particle1.position.x - radius <= left )//-50
			{
				particle1.position.x = left + radius;
				particle1.direction.x *= -0.8;
			}
			if (particle1.position.y  - (particle1.size / 2) <= getAltitude(particle1.position.x, particle1.position.z))
			{
				// console.log("collide");
				var high = getAltitude(particle1.position.x, particle1.position.z);
				if (high > getAltitude(particle1.position.x - 1, particle1.position.z - 1))
				{
					particle1.position.x--;
					particle1.position.z--;
				}
				else if (high > getAltitude(particle1.position.x + 1, particle1.position.z + 1))
				{
					particle1.position.x++;
					particle1.position.z++;
				}
				else if (high > getAltitude(particle1.position.x - 1, particle1.position.z + 1))
				{
					particle1.position.x--;
					particle1.position.z++;
				}
				else if (high > getAltitude(particle1.position.x + 1, particle1.position.z - 1))
				{
					particle1.position.x++;
					particle1.position.z--;
				}
			}
		}
};

return scene;
};

var spreadWater = function(particleSystem, x, y, z, er, size, scene)
{
	var fountain = BABYLON.Mesh.CreateBox("fountain", 1.0, scene);
	fountain.position.x = x;
	fountain.position.y = y;
	fountain.position.y = z;
 	fountain.isVisible = false;

	particleSystem.particleTexture = new BABYLON.Texture("textures/water.jpg", scene);
	particleSystem.emitter = fountain; 
	// particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
	// particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);
	particleSystem.emitRate = er;


	particleSystem.minEmitPower = 0.01;
	particleSystem.maxEmitPower = 0.01;

	particleSystem.minSize = size;
	particleSystem.maxSize = size;

	particleSystem.blendMode = BABYLON.ParticleSystem.BLEND_MODE_ONEONE;
	particleSystem.textureMask = new BABYLON.Color4.FromInts(25, 25, 112, 255);
	particleSystem.color1 = new BABYLON.Color4.FromInts(20, 20, 255, 255);
	particleSystem.color2 = new BABYLON.Color4.FromInts(20, 20, 255, 255);

	particleSystem.direction1 = new BABYLON.Vector3(0, -5, 0);
	particleSystem.direction2 = new BABYLON.Vector3(0.5, -5, 0.5);

	particleSystem.gravity = new BABYLON.Vector3(0, -1, 0);

	particleSystem.start();
};

var CreateArrayOfAltitude = function( positions)
{
	for ( var i = 0; i < mapDiv ; i++ )
	{
		altitude[mapDiv - i - 50] = [];
		for ( var j = 0; j < mapDiv; j++ )
		{
			altitude[mapDiv - i - 50][j - 50] = positions[ getCustomIndex( i, j ) ];
		};
	};
};

var getCustomIndex = function( x, y )
{
		return ( ( x * (mapDiv + 1) + y ) * 3 + 1 );
};

var getAltitude = function( x, y )
{
 if (isNaN(x) || isNaN(y))
        return 0;
    if ( (Math.round(y) >= altitude.length || Math.round(y) < -49 ) )
        return 0;
    if ( (Math.round(x) >= altitude[Math.round(y)].length || Math.round(x) < -49) )
        return 0;
    
    var alt =  altitude[Math.round( y )][Math.round( x )] + ground.position.y; 

    if (alt)
        return alt;
    else
        return 0;
};

var detectSphereCollision = function(elem1, elem2)
{
	var xd = elem1.position.x - elem2.position.x;
	var yd = elem1.position.y - elem2.position.y;
	var zd = elem1.position.z - elem2.position.z;

	var sumRadius = particlesSize;
	var sqrRadius = sumRadius * sumRadius;

	var distSqr = (xd * xd) + (yd * yd) + (zd * zd);

	if (distSqr <= sqrRadius)
	{
    	return true;
	}

	return false;
};

var sleep = function (milliseconds) 
{
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds)
		{
			break;
		}
	}
};

var scene = createScene();
engine.runRenderLoop(function () {
	scene.render();
});

// Resize
window.addEventListener("resize", function () {
	engine.resize();
});
