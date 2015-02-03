var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene;
var camera;
var light;
var ground;

var particlesSize = 3.5;
var radius = particlesSize/2;

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
/***********************************************************/
// Fog
//    var box = new BABYLON.Mesh(name, scene);
//    var vertexData = BABYLON.VertexData.CreateBox(10);
//    vertexData.applyToMesh(box, false);
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

ground = BABYLON.Mesh.CreateGround("ground", mapSize[0], mapSize[1], mapSize[2], scene);
// ground.material = wireMaterial;
ground.material = colorMaterial;
    
var positions = ground.getVerticesData("position");  

positions = createMountain(positions, mountain1, mapSize[2]);

positions = createMountain(positions, mountain2, mapSize[2]);

ground.convertToFlatShadedMesh();


var water = BABYLON.Mesh.CreateGround("water", mapSize[0], mapSize[1], mapSize[2], scene);
water.material = waterColor;

water.position.y = -1;

// var animationBox = new BABYLON.Animation("myAnimation", "position.y", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
// var keys = [];
// //At the animation key 0, the value of scaling is "1"
// keys.push({
// 	frame: 0,
// 	value: -5
// });
// //At the animation key 20, the value of scaling is "0.2"
// keys.push({
// 	frame: 400,
// 	value: 15
// });
// animationBox.setKeys(keys);
// //Then add the animation object to box1
// water.animations.push(animationBox);
// //Finally, launch animations on box1, from key 0 to key 100 with loop activated
// scene.beginAnimation(water, 0, 2000, false);

// var animate = setInterval(function () 
// {
// 	water.position.y += 0.02;
// 	if (water.position.y > 3)
// 		clearInterval(animate);

// }, 1000/10);*/

var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
fountain.position.x = -45;
fountain.position.y = 1;

var particleSystem = new BABYLON.ParticleSystem("particles", 2500, scene);
particleSystem.particleTexture = new BABYLON.Texture("textures/flares.png", scene);
particleSystem.emitter = fountain; 
particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);
particleSystem.emitRate = 200;


particleSystem.minEmitPower = 0.1;
particleSystem.maxEmitPower = 0.1;

particleSystem.minSize = particlesSize;
particleSystem.maxSize = particlesSize;

particleSystem.color1 = new BABYLON.Color4(0, 0.5, 1, 1);
particleSystem.color2 = new BABYLON.Color4(0, 0.2, 0.5, 1);

particleSystem.direction1 = new BABYLON.Vector3(3, -3, 3);
particleSystem.direction2 = new BABYLON.Vector3(3, -1, 6);

// particleSystem.blendMode = BABYLON.ParticleSystem.BLEND_MODE_ONEONE;

particleSystem.gravity = new BABYLON.Vector3(-1, 0, 0);
particleSystem.maxAngularSpeed = 2;

particleSystem.start();

//limits = [right, left, up, down]
// var limits = [-30, -50, 10, -10];
var limits = [50, -50, 50, -50];
var gravity = 0.038;

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
			// if ( particle1.position.y + radius >= ground.position.y )
			// {
			// 	particle1.direction.y = -gravity/2; // gravity
			// 	particle1.position = particle1.position.add( particle1.direction );
			// 	particle1.direction.y -= -gravity/2; // gravity
			// }
		}
		for ( var i = 0; i < particles.length; i++ )
		{
			var particle1 = particles[i];

			if ( particle1.position.y - radius <= ground.position.y )
			{
				particle1.position.y = ground.position.y + radius;
				// particle1.direction.multiplyByFloats(0, 0, 0);
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
			// particle1.direction.multiplyByFloats(0.001, 0.001, 0.001);
		}


};

/***********************************************************/
return scene;
};

var resolveCollision = function(part1, part2)
{

};

var resolveEnvCollision = function(part1, part2)
{

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

/*

for (var i = 0; i < numberPoints; i+=3)
{
    if (positions[i] == pos[0] && positions[i+2] == pos[2] )
    {
		for ( var deg = 0; deg < 180; deg++ )
		{
			for (var dist = 0; dist < 20; dist++)
			{
				var x = dist * Math.cos(deg);
				var y = dist * Math.sin(deg);
				console.log("x:"+x);
				positions[i - x * 101 * 3 + y + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * dist );
				positions[i + x * 101 * 3 + y + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * dist );
				positions[i - dist * 3 + 1 + 101 * 3 * x + y] = 10 + 10 * Math.cos( Math.PI / pos[1] * dist );
				positions[i + dist * 3 + 1 + 101 * 3 * x + y] = 10 + 10 * Math.cos( Math.PI / pos[1] * dist );
		//	var box = BABYLON.Mesh.CreateBox("box", 1.0, scene);
		//	box.position.x = x;
		//box.position.z = y;
				console.log("-------");
			}
		}
		

			//positions[i - y * 3 + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * y );
			//positions[i + y * 3 + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * y );
		
    }
}
*/

