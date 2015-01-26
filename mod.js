var canvas = document.getElementById("renderCanvas");
var engine = new BABYLON.Engine(canvas, true);

function mcreateGround (name, width, height, w_subdivisions, h_subdivisions, scene, updatable) {
    var ground = new BABYLON.Mesh(name, scene);
 
    var indices = [];
    var positions = [];
    var normals = [];
    var uvs = [];
    var row, col;
 
    for (row = 0; row <= h_subdivisions; row++) {
        for (col = 0; col <= w_subdivisions; col++) {
            var position = new BABYLON.Vector3((col * width) / w_subdivisions - (width / 2.0), 0, ((h_subdivisions - row) * height) / h_subdivisions - (height / 2.0));
            var normal = new BABYLON.Vector3(0, 1.0, 0);
 
            positions.push(position.x, position.y, position.z);
            normals.push(normal.x, normal.y, normal.z);
            uvs.push(col / w_subdivisions, 1.0 - row / h_subdivisions);
        }
    }
 
    for (row = 0; row < h_subdivisions; row++) {
        for (col = 0; col < w_subdivisions; col++) {
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + row * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
 
            indices.push(col + (row + 1) * (w_subdivisions + 1));
            indices.push(col + 1 + (row + 1) * (w_subdivisions + 1));
            indices.push(col + row * (w_subdivisions + 1));
        }
    }
 
    ground.setVerticesData(positions, BABYLON.VertexBuffer.PositionKind, updatable);
    ground.setVerticesData(normals, BABYLON.VertexBuffer.NormalKind, updatable);
    ground.setVerticesData(uvs, BABYLON.VertexBuffer.UVKind, updatable);
    ground.setIndices(indices);
 
    return ground;
};

var createScene = function () {

// Now create a basic Babylon Scene object 
var scene = new BABYLON.Scene(engine);
// Change the scene background color to green.
scene.clearColor = new BABYLON.Color3(0, 0, 0.2);

// This creates and positions a free camera
var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(5, 30, -80), scene);
// This targets the camera to scene origin
camera.setTarget(BABYLON.Vector3.Zero());

// This attaches the camera to the canvas
camera.attachControl(canvas, false);

// This creates a light, aiming 0,1,0 - to the sky.
var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

// Dim the light a small amount
light.intensity = .5;
/***********************************************************/
var ground = BABYLON.Mesh.CreateGround("ground1", 100, 100, 50, scene);
var sphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 10.0, 6.0, scene);


var materialSphere1 = new BABYLON.StandardMaterial("texture1", scene);
materialSphere1.wireframe = true;
sphere1.material = materialSphere1;
ground.material = materialSphere1;


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