console.log("THREE JS RUNNING")
import * as THREE from "./build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"
import { FontLoader } from "./jsm/loaders/FontLoader.js"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const letters2 = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
    "N","~", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
];

const letters = [
    "G", "F", "E", "D", "C", "B", "A", "Z", "Y", "X", "V", "U", "T", "S", "R", "Q", "P", "O","~", "N",
    "M", "L", "J", "I", "H"
];



const canvas = document.querySelector("#canvas");
let cameraMoving = true;
let camera, scene, renderer, controls;
let model1, model2, model3;
var synth = window.speechSynthesis;
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const question = document.querySelector("#question");

const speechText = (text)=>{
    let utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
};


const scaleValue = (value, minInput, maxInput, minOutput, maxOutput) => {
    return minOutput + (maxOutput - minOutput) * ((value - minInput) / (maxInput - minInput));
}

const onWindowResize = () => {

    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

};



const  onMouseClick = (event)=> {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);
   
    if (intersects.length > 0) {
        const selectedObject = intersects[0].object;

        if(selectedObject.name === "A") {
            selectedObject.material.color.set(0xff0000);
        }

        
        console.log(selectedObject);
    }
}

const loadModelGLTF = (modelURL) => {
    const loader = new GLTFLoader();
    let objectGroup = new THREE.Group();

    return new Promise((resolve, reject) => {
        loader.load(
            `../assets/models/${modelURL}/scene.gltf`,
            function (gltf) {
                const container = new THREE.Group();
                container.add(gltf.scene);
                objectGroup = container;
                resolve(objectGroup);
            },
            function (xhr) {
                // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened', error);
            }
        );
    })
};

const init = async () => {
    window.addEventListener("resize", onWindowResize);
    window.addEventListener('click', onMouseClick);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 24);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 2000, 1000);
    directionalLight.lookAt(0, 0, 0);
    directionalLight.intensity = 12;
    scene.add(directionalLight);

    const ambientlight = new THREE.AmbientLight(0xffffff, 1);
    ambientlight.position.set(0, 0, 0);
    ambientlight.intensity = 1;
    scene.add(ambientlight);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvas.appendChild(renderer.domElement);



    await loadModelGLTF("A").then((resolve) => {
        console.log(resolve);
        model1 = resolve;
        return loadModelGLTF("wall");
    }).then((resolve) => {
        model2 = resolve;
    });


    scene.add(model2);
    model2.scale.set(1.25,1.25,1.25);
    model2.rotation.set(0,90* Math.PI / 180,15 * Math.PI / 180)






    

    const fontLoader = new FontLoader();
    const radio = 10; // Radio de la circunferencia
    const subdivisiones = 25; // Número de subdivisiones




    

for (let i = 0; i < subdivisiones; i++) {
    const angulo = (360 / subdivisiones) * i; // Calcular el ángulo en grados
    const radianes = angulo * Math.PI / 180; // Convertir el ángulo a radianes

    const x = radio * Math.cos(radianes); // Calcular la coordenada x
    const y = radio * Math.sin(radianes); // Calcular la coordenada y

    await loadModelGLTF("sphere").then((resolve) => {
        console.log(resolve);
        model1 = resolve;
    })
    model1.rotation.set(0, -1.5 , 0);
    model1.position.set(x + 0.5, y +0.5, 0);
    model1.scale.set(1.2,1.2,1.2);
    scene.add(model1);
    console.log(`Punto ${i}: (${x}, ${y})`);

    fontLoader.load( '../assets/font/helvetiker_regular.typeface.json', function ( font ) {

        const geometry = new TextGeometry( letters[i], {
            font: font,
            size: 50,
            depth: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 5
        } );
    
    
    
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Color del texto
        const textoMesh = new THREE.Mesh(geometry, material);
        textoMesh.scale.set(0.02, 0.02,0.02)
        textoMesh.position.set(x,y,1.2);
        scene.add(textoMesh);
    
    } );
}

showQuestion();

};


const showQuestion = (text)=>{
    const fontLoader = new FontLoader();
    fontLoader.load( '../assets/font/helvetiker_regular.typeface.json', function ( font ) {

        const geometry = new TextGeometry( " ", {
            font: font,
            size: 20,
            depth: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 1,
            bevelSize: 0,
            bevelOffset: 0,
            bevelSegments: 5
        } );
    
    
    
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff }); // Color del texto
        const textoMesh = new THREE.Mesh(geometry, material);
        textoMesh.scale.set(0.02, 0.02,0.02)
        textoMesh.position.set(0,0,1.2);
        scene.add(textoMesh);
    
    } );
}

const render = () => {
    renderer.render(scene, camera);
};

const animate = () => {
    requestAnimationFrame(animate);

    if(model1) {
        //model1.rotation.y += 0.01;
    }

   

    if(cameraMoving) {
        camera.rotation.y += 0.0001;
    }else {
        camera.rotation.y -= 0.0001;
    }

    if(camera.rotation.y >= 0.02) {
        
        cameraMoving = false;
    }

    if(camera.rotation.y <= -0.02) {
        cameraMoving = true;
    }

    
    render();
};

init();
animate();
