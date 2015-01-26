var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);
var scene;
var camera;
var light;

var initScene = function ()
{
	var scene = new BABYLON.Scene(engine);
	scene.clearColor = new BABYLON.Color3(0, 0, 0.2);
	return scene;
};

var initCamera = function ()
{
	var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(-20, 10, -30), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, false);
	return camera;
};

var initLight = function ()
{
	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = .5;
	var d1 = new BABYLON.DirectionalLight("dir", new BABYLON.Vector3(1, -1, -2), scene);
	d1.position = new BABYLON.Vector3(-300,300,600);
	return light;
};

var createLane = function (id, position)
{
	var lane = BABYLON.Mesh.CreateBox("lane"+id, 1, scene);
	lane.scaling.y = 0.2;
	lane.scaling.x = 1;
	lane.scaling.z = 20;

	lane.position.x = position;
	lane.position.y = 8;
	lane.rotation.x = Math.PI / -3;
};

Tree = function() {
    // Call the super class BABYLON.Mesh
    BABYLON.Mesh.call(this, "tree", scene);
    // ...
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
//    box.material = new BABYLON.StandardMaterial("ground", scene);
//    box.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
//    box.material.specularColor = BABYLON.Color3.Black();
//    box.scaling.y = 0.1;
//    
    var materialSphere1 = new BABYLON.StandardMaterial("texture1", scene);
    materialSphere1.wireframe = true;
//    box.material = materialSphere1;
//    
//    var positions = box.getVerticesData(BABYLON.VertexBuffer.PositionKind);
//    console.log(positions);
//    var indices = box.getIndices();
//    var numberOfPoints = positions.length/3;
//    var v3 = BABYLON.Vector3;
//    var max = [];
//    var i = 0;
//    positions[i] += 20;
//    positions[i+1] += 1;
//    positions[i+2] += 25;
//    
//    box.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
//    var normals = [];
//    BABYLON.VertexData.ComputeNormals(positions, indices, normals);
//    box.setVerticesData(BABYLON.VertexBuffer.NormalKind, normals);
//    console.log(positions);
    
        var pos = [0, 20, 0];
    
    var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 100, scene);
    ground.material = materialSphere1;
    
    var positions = ground.getVerticesData("position");
    var numberPoints = positions.length;
    
    for (var i = 0; i < numberPoints; i+=3)
    {
        if (positions[i] == pos[0] && positions[i+2] == pos[2] )
        {
			for (var y = 0; y < 20; y++)
			{
				
				
				
				
				
				positions[i - y * 3 + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * y );
				positions[i + y * 3 + 1] = 10 + 10 * Math.cos( Math.PI / pos[1] * y );
				
//				for(var j = 0; j < 20; j++)
//				{
//					var h = pos[1] - (y+j);
//					if (h > 0)
//					{
//						positions[i - y * 3 + 1 + 101 *3 * (j+1)] = 10 + 10 * Math.cos( Math.PI / 20 * y );
//						positions[i + y * 3 + 1 + 101 *3 * (j+1)] = 10 + 10 * Math.cos( Math.PI / 20 * y );
//					}
//				}
			}
        }
    }
    ground.setVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
    
// scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
// scene.fogDensity = 0.003;
// scene.fogColor = new BABYLON.Color3(0.8,0.83,0.8);

// // Ground
// var ground = BABYLON.Mesh.CreateGround("ground", 100, 100, 1, scene);
// ground.material = new BABYLON.StandardMaterial("ground", scene);
// ground.material.diffuseColor = BABYLON.Color3.FromInts(193, 181, 151);
// ground.material.specularColor = BABYLON.Color3.Black();

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