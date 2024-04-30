console.log("THREE JS RUNNING")
import * as THREE from "./build/three.module.js";
import { GLTFLoader } from "./jsm/loaders/GLTFLoader.js"
import { FontLoader } from "./jsm/loaders/FontLoader.js"
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

const pasapalabra = [
    { letra: "A", definicion: "Animal mamífero que vuela", respuesta: "Ave" },
    { letra: "B", definicion: "Instrumento de percusión", respuesta: "Batería" },
    { letra: "C", definicion: "Fruta amarilla y alargada", respuesta: "Plátano" },
    { letra: "D", definicion: "Instrumento de cuerda pulsada", respuesta: "Dulzaina" },
    { letra: "E", definicion: "Animal mamífero que vive en el agua", respuesta: "Elefante" },
    { letra: "F", definicion: "Alimento básico en muchas culturas", respuesta: "Fideo" },
    { letra: "G", definicion: "País en Europa", respuesta: "Grecia" },
    { letra: "H", definicion: "Elemento químico con número atómico 1", respuesta: "Hidrógeno" },
    { letra: "I", definicion: "Idioma oficial en la India", respuesta: "Indio" },
    { letra: "J", definicion: "Instrumento musical de viento", respuesta: "Jirafa" },
    { letra: "L", definicion: "Parte del cuerpo humano", respuesta: "Labio" },
    { letra: "M", definicion: "País de América del Sur", respuesta: "México" },
    { letra: "N", definicion: "Nombre de una flor", respuesta: "Narciso" },
    { letra: "Ñ", definicion: "Símbolo de la enye", respuesta: "Eñe" },
    { letra: "O", definicion: "Color de la piel humana", respuesta: "Ocre" },
    { letra: "P", definicion: "Animal doméstico común", respuesta: "Perro" },
    { letra: "Q", definicion: "Elemento químico con número atómico 16", respuesta: "Química" },
    { letra: "R", definicion: "Instrumento de percusión", respuesta: "Redoble" },
    { letra: "S", definicion: "Instrumento musical de viento", respuesta: "Saxofón" },
    { letra: "T", definicion: "Planeta del sistema solar", respuesta: "Tierra" },
    { letra: "U", definicion: "Parte del cuerpo humano", respuesta: "Uña" },
    { letra: "V", definicion: "Fruto comestible de color morado", respuesta: "Violeta" },
    { letra: "X", definicion: "Animal mamífero marino", respuesta: "Xenurine" },
    { letra: "Y", definicion: "Fruta tropical de sabor ácido", respuesta: "Yaca" },
    { letra: "Z", definicion: "Instrumento musical de cuerda", respuesta: "Zampoña" }
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
const letra = document.querySelector("#letra");

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
            `./assets/models/${modelURL}/scene.gltf`,
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
    model1.rotation.set(0, 0 , 0);
    model1.position.set(x, y, 0);
    model1.scale.set(1.2,1.2,1.2);
    scene.add(model1);
    //console.log(`Punto ${i}: (${x}, ${y})`);

    fontLoader.load( './assets/font/helvetiker_regular.typeface.json', function ( font ) {

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
        textoMesh.position.set(x  - 0.5,y -0.5,1.2);
        scene.add(textoMesh);
    
    } );
}



showQuestion(0);
    
};


const showQuestion = (index)=>{
    question.innerHTML = pasapalabra[index].definicion;
    letra.innerHTML = pasapalabra[index].letra;      
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
        //camera.rotation.y += 0.0001;
    }else {
        //camera.rotation.y -= 0.0001;
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
