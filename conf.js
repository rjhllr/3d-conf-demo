var elem = document.querySelector('#viewport')
var scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );
var camera = new THREE.PerspectiveCamera( 75, elem.width/elem.height, 0.1, 1000 );
var loader = new THREE.FontLoader();
//import { TTFLoader } from './TTFLoader.js';
var renderer = new THREE.WebGLRenderer({
	canvas: viewport,
	antialias: true
});
renderer.setSize( elem.width, elem.height );
renderer.shadowMapEnabled = true;	
var materialLoader = new THREE.MTLLoader();
var modelLoader = new THREE.OBJLoader();
materialLoader.load('obj.mtl', function(materialsFromServer) {
	materialsFromServer.preload();
	modelLoader.setPath( '/' );
	modelLoader.setMaterials(materialsFromServer).load('tinker.obj', function(objectFromServer) {
		loader.load( 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json', function ( font ) {

			var globalText = null;

			var loader = new THREE.FontLoader();

			function generateGeometry(textParam) {
				return new THREE.TextGeometry( textParam, {
					font: font,
					size: 6,
					height: .1	,
					curveSegments: 12,
					bevelEnabled: true,
					bevelThickness: 1,
					bevelSize: .1	,
					bevelOffset: 0,
					bevelSegments: 5
				} );
			}

			function generateText(textParam) {
				var textGeometry = generateGeometry(textParam);
				var mesh = new THREE.Mesh( textGeometry, black );
				mesh.name = 'customText';
				mesh.castShadow = true;
				mesh.receiveShadow = true;
				return mesh;
			}

			var black = new THREE.MeshBasicMaterial( { color: 0x00000 } );
			var red = new THREE.MeshBasicMaterial( {color: 0xff0000} );

			objectFromServer.castShadow = true;
			objectFromServer.receiveShadow = true;
			scene.add(objectFromServer);	

			placeholderMesh = objectFromServer.children.find(e => e.name === 'textPlaceholder');
			var absoluteObjectPositionForText = new THREE.Vector3();

			var ambientLight = new THREE.AmbientLight( 0xffffff );
			scene.add(ambientLight);

			rerender = function() {
				var customText = document.getElementById("custom-text").value

				var oldText = scene.getObjectByName('customText');
				var text = oldText;
				if (globalText != customText) {
					if (oldText) {
						console.log('generating new text element');
						oldText.geometry.dispose();
						oldText.material.dispose
						scene.remove(oldText);
					}
					globalText = customText;
					var newText = generateText(customText);
					scene.add(newText)
					text = newText;
				}

				text.rotation.x = document.getElementById("text-rot-x").value
				text.rotation.y = document.getElementById("text-rot-y").value
				text.rotation.z = document.getElementById("text-rot-z").value
				text.position.x = document.getElementById("text-pos-x").value
				text.position.y = document.getElementById("text-pos-y").value
				text.position.z = document.getElementById("text-pos-z").value
				text.updateMatrixWorld();

				camera.position.x = document.getElementById("cam-x").value;
				camera.position.y = document.getElementById("cam-y").value;
				camera.position.z = document.getElementById("cam-z").value;
				camera.rotation.x = document.getElementById("cam-rot-x").value;
				camera.rotation.y = document.getElementById("cam-rot-y").value;
				camera.rotation.z = document.getElementById("cam-rot-z").value;
				camera.updateMatrixWorld();

				objectFromServer.position.x = document.getElementById("obj-x").value;
				objectFromServer.position.y = document.getElementById("obj-y").value;
				objectFromServer.position.z = document.getElementById("obj-z").value;
				objectFromServer.rotation.x = document.getElementById("obj-rot-x").value;
				objectFromServer.rotation.y = document.getElementById("obj-rot-y").value;
				objectFromServer.rotation.z = document.getElementById("obj-rot-z").value;
				objectFromServer.updateMatrixWorld();
				scene.updateMatrixWorld();


				console.log('rendered');
				renderer.render(scene, camera);
			}

			rerender()


			document.addEventListener('change', function (event) {
				if (!event.target.matches('.impactsViewport')) return;
				rerender();
			}, false);

			document.addEventListener('click', function (event) {
				if (!event.target.matches('#rerender')) return;
				rerender();
			}, false);
		} );
	})
})