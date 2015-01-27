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

					var heigh = ymid + ampl * Math.cos( Math.PI / vertexPoint[1] * dist );

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

ground = BABYLON.Mesh.CreateGround("ground", mapSize[0], mapSize[1], mapSize[2], scene);
// ground.material = wireMaterial;
ground.material = colorMaterial;
    
var positions = ground.getVerticesData("position");    
positions = createMountain(positions, mountain1, mapSize[2]);



positions = createMountain(positions, mountain2, mapSize[2]);
ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);

ground.convertToFlatShadedMesh();


var water = BABYLON.Mesh.CreateGround("water", mapSize[0], mapSize[1], mapSize[2], scene);
water.material = waterColor;

water.position.y = 5;
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

