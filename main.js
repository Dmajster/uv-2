import Converter from "./converter.js";

let manager = new THREE.LoadingManager();
manager.onLoad = function () {
	init();
	render();
}

let font = null;
let loader = new THREE.FontLoader(manager);
loader.load('helvetiker_regular.typeface.json', function (response) {
	font = response;
});

let renderer;
let controls;
let scene;
let camera;
let init = () => {
	createRenderer();
	createScene();

	drawGrid();
	drawFog();
	drawCube();

	//Draw unit lines

	var material = new THREE.MeshPhongMaterial({
		color: 0xdddddd
	});

	var lineWidth = 0.005
	for (var i = 0; i < 1; i += 0.1) {
		var geometry = new THREE.Geometry();
		geometry.vertices.push(new THREE.Vector3(-lineWidth, 0, i));
		geometry.vertices.push(new THREE.Vector3(lineWidth, 0, i));
		var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
			color: 0x0000ff,
			depthWrite: false,
			depthTest: false
		}));
		scene.add(line);

		
		if (i == 0 || i.toFixed(1) == 1) {
			continue
		}

		var textGeometry = new THREE.TextGeometry((i * 10).toFixed(0) + "dm", {
			font: font,
			size: 0.01,
			height: 0,
		});

		var textMesh = new THREE.Mesh(textGeometry, material);
		var boundingBox = new THREE.Box3().setFromObject(textMesh);

		var textSize = new THREE.Vector3();
		boundingBox.getSize(textSize);
		textMesh.position.set(-0.02, 0, i - (textSize.x/2));
		textMesh.rotation.x = THREE.Math.degToRad(270);
		textMesh.rotation.z = THREE.Math.degToRad(270);
		scene.add(textMesh);
	}
}

let render = () => {
	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
};


function createRenderer() {
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor(0xffffff, 1);
}

function createScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
	controls = new THREE.OrbitControls(camera);
	camera.position.set(-0.5, 1, 1.5);
	controls.target.set(0.5, 0, 0.5);
	controls.update();
}

//Draw grid
function drawGrid() {
	let size = 1000;
	let divisions = 1000;
	let gridHelper = new THREE.GridHelper(size, divisions, 0xFF0000, 0xCACACA);
	scene.add(gridHelper);
}

//Draw fog
function drawFog() {
	let color = 0xFFFFFF;
	let near = 0;
	let far = 50;
	scene.fog = new THREE.Fog(color, near, far);
}

//Draw Cube
function drawCube() {
	let geometry = new THREE.BoxBufferGeometry(1, 0.0000001, 1);
	let edges = new THREE.EdgesGeometry(geometry);
	let line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
		color: 0x00ff00,
		depthWrite: false,
		depthTest: false
	}));
	line.position.set(0.5, 0, 0.5);
	scene.add(line);
}


let unit1 = "League"
let amount1 = 10

let unit2 = "Yard"

console.log(unit1, unit2, Converter.convert(unit1, amount1, unit2))

/*
let unit2 = units["length"]["SI"]["Meter"];
let unit1 = units["length"]["SI"]["Centimeter"];

let conversionAmount = unit1["quantity"]/unit2["quantity"];
let output = `${unit1["unit"]} to ${unit2["unit"]} = ${conversionAmount}${unit2["unit"]}`;
console.log(output)

var font = null;
var loader = new THREE.FontLoader();
loader.load('', function(response) {
  font = response;
});
console.log(font);

var material = new THREE.MeshPhongMaterial({
	color: 0xdddddd
});

var textGeom = new THREE.TextGeometry('1dm', {
	font: font,
	size: 0.025,
	height: 0,
});

var textMesh = new THREE.Mesh(textGeom, material);
textMesh.rotation.x = THREE.Math.degToRad(270);
textMesh.rotation.z = THREE.Math.degToRad(270);
scene.add(textMesh);
*/