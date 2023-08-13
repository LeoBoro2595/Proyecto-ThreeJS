import React, { Component } from "react";
import "./App.css";
import * as THREE from "three";
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import axios from 'axios'

let scene, camera, renderer, cube, wall, popup;
const target = new THREE.Vector2(); // Agregar esta línea

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.popupRef = React.createRef();
    this.animate = this.animate.bind(this);
    this.onCanvasClick = this.onCanvasClick.bind(this); //Referenciar al clickear en la posición determinada en el canvas
    this.closePopup = this.closePopup.bind(this);
  }

  closePopup() {
    this.popupRef.current.style.display = "none"; //Ocultar elemento "popup" del HTML modificando su display con el fin de no tener una posición exacta en la pantalla.
  }

  componentDidMount() {
    this.init();
    this.animate();
    this.canvasRef.current.addEventListener("click", this.onCanvasClick);
    this.canvasRef.current.addEventListener("mousemove", (event) => this.onMouseMove(event));

  }


  componentWillUnmount() {
    this.canvasRef.current.removeEventListener("click", this.onCanvasClick);
  }

  onMouseMove(event) {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) / rect.width) * 3 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 3 + 1,
    };
  
    // Calcula el movimiento del mouse y ajusta la rotación de la cámara
    target.x = mouse.x * -1.5;
    target.y = mouse.y * 0.5;
  }
  


  init() {
    // Creating scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 100) // Niebla

    // Add camera
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    camera.position.y = 5;

    // Screen renderer
    
    
    renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio)
    });

    // Add Grid
    var grid = new THREE.GridHelper(100, 50);
    scene.add(grid);

    // Add Point Light
    var light = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light);
    light.position.set(1, 5, 8);


    // Add geometry
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({
      color: 0xff0000,
      wireframe: false,
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.y = 0.5;
    cube.name = "positionTP";

    
    

    //Translate camera to locationb
    var locationTP = new THREE.Vector3();
    cube.getWorldPosition ( locationTP );











    // const loader = new GLTFLoader()
    // loader.load(
    //     './models/picture.gltf',
    //     function (gltf) {


    //         scene.add(gltf.scene);
    //     },
    // )
    

    // Add wall
    var wallgeometry = new THREE.BoxGeometry(10, 5, 0.1);
    var wallmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    wall = new THREE.Mesh(wallgeometry, wallmaterial);
    scene.add(wall);
    wall.position.z = -5;
    wall.position.y = 2.5;

    

    // Add popup geometry
    var geometrypopup = new THREE.BoxGeometry(1, 1, 1);
    var materialpopup = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: true, emissive: 0xffffff, shininess: 100 });
    popup = new THREE.Mesh(geometrypopup, materialpopup);
    popup.castShadow = false;
    scene.add(popup);
    popup.position.y = 0.5;
    popup.position.x = 5;
  }

  animate() {
    camera.rotation.x += 0.25 * (target.y - camera.rotation.x);
    camera.rotation.y += 0.05 * (target.x - camera.rotation.y);
  
    requestAnimationFrame(this.animate);
    renderer.render(scene, camera);
  }

  
  onCanvasClick(event) {
    const rect = this.canvasRef.current.getBoundingClientRect();
    const mouse = {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObject(popup); // Cambiar "cube" por "popup" para verificar la intersección con el popup
  
    if (intersects.length > 0) {
      this.showPopup();
    } else {
      const cubeIntersects = raycaster.intersectObject(cube); // Verificar intersección con el cubo
      if (cubeIntersects.length > 0) {
        const position = cubeIntersects[0].point;
        this.moveCameraToPosition(position);
      }
    }
  }
  
  moveCameraToPosition(position) {
    camera.position.copy(position);
    camera.lookAt(position);
  }
  
  
  // id = this.getObjectById();
  // axios.post("direccion", {
  //   id: id
  // })
  showPopup() {
    const popup = this.popupRef.current; //Añadir popup a la escena 3D (DOM)
    popup.style.display = "block"; //Cambia la propiedad "display" de "popup" con el fin de mostrarlo en la escena
  }

  

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} className="App" />
        <div id="popup" className="popup" ref={this.popupRef} style={{ display: "none", position: "absolute", top: 0, left: 0 }}>  {/* Hace referencia al elemento "popup" para mostrarlo en el HTML */}
        <i className="fa-regular fa-eye-slash" id="eyeClose" onClick={this.closePopup}></i> {/* Cerrar video mediante la referencia "this.closePopup" */}

        {/* <video controls src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" id="videoDiv"></video> */}

        {/* <div id="containerUI"> */}
          <h1 id="UItitle">Title</h1>
          <p id="UItext">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus voluptas,
          quisquam nam deleniti voluptatem explicabo exercitationem quas laudantium fuga accusamus officia architecto eligendi optio repellat labore hic inventore.
          Distinctio, labore.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus voluptas,
          quisquam nam deleniti voluptatem explicabo exercitationem quas laudantium fuga accusamus officia architecto eligendi optio repellat labore hic inventore.
          Distinctio, labore.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus voluptas,
          quisquam nam deleniti voluptatem explicabo exercitationem quas laudantium fuga accusamus officia architecto eligendi optio repellat labore hic inventore.
          Distinctio, labore.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus voluptas,
          quisquam nam deleniti voluptatem explicabo exercitationem quas laudantium fuga accusamus officia architecto eligendi optio repellat labore hic inventore.
          Distinctio, labore.
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Natus voluptas,
          quisquam nam deleniti voluptatem explicabo exercitationem quas laudantium fuga accusamus officia architecto eligendi optio repellat labore hic inventore.
          Distinctio, labore.
          </p>
        {/* </div> */}
          
          {/* <audio controls src="#"></audio> */}

          {/* <p className="creditosProyecto">Text</p> */}

        </div>
      </div>
    );
  }
}

export default App;