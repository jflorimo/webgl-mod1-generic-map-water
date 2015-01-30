var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene;
var camera;
var light;
var ground;

var initScene = function ()
{
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 0, 0.2);
	return scene;
};

var initCamera = function ()
{
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-50, 50, -80), scene);
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

var animate = setInterval(function () 
{
	water.position.y += 0.02;
	if (water.position.y > 3)
		clearInterval(animate);

}, 1000/10);*/

var fountain = BABYLON.Mesh.CreateBox("foutain", 1.0, scene);
fountain.position.x = -45;
fountain.position.y = 8;

var particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
particleSystem.particleTexture = new BABYLON.Texture("textures/flares.png", scene);
particleSystem.emitter = fountain; 
particleSystem.emitRate = 1000;

particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);

particleSystem.start();

particleSystem.updateFunction = function ( particles )
{
		for ( var i = 0; i < particles.length; i++ )
		{
			// Update pos
			var particle = particles[i];
			particle.direction.y += 0.005; // gravity
			particle.position = particle.position.add( particle.direction );
		}
};

/***********************************************************/
return scene;
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

