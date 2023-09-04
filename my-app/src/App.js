import React, { Component } from "react";
import "./App.css";
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';


// import axios from 'axios'

let scene, camera, renderer, cube, wall, popup, loader;
const target = new THREE.Vector2();

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.popupRef = React.createRef();
    this.menuRef = React.createRef();
    this.animate = this.animate.bind(this);
    this.onCanvasClick = this.onCanvasClick.bind(this); //Referenciar al clickear en la posición determinada en el canvas
    this.closePopup = this.closePopup.bind(this);
    this.closeMenu = this.closeMenu.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);

    // Límites de rotación de la cámara
    this.minRotationX = -Math.PI / 4;
    this.maxRotationX = Math.PI / 4;

    this.minRotationY = -Math.PI / 4;
    this.maxRotationY = Math.PI / 4;

    // Zoom
    this.zoomSpeed = 0.1;
    this.targetZoom = 1;
    this.currentZoom = 1;

    this.state = {
      zoom: 1,
    };
  }

  closePopup() {
    this.popupRef.current.style.display = "none"; //Ocultar elemento "popup" del HTML modificando su display con el fin de no tener una posición exacta en la pantalla.
    this.moveToCenter();
  }

  closeMenu() {
    this.menuRef.current.style.display = "none";
  }

  componentDidMount() {
    this.init();
    this.animate();
    this.canvasRef.current.addEventListener("click", this.onCanvasClick);
    this.canvasRef.current.addEventListener("mousemove", (event) => this.onMouseMove(event));

    this.canvasRef.current.addEventListener("wheel", this.onMouseWheel); // Zoom en la cámara
  }

  onMouseWheel(event) {
    event.preventDefault();
    // Límite del zoom (Cuanto zoom se puede hacer en la escena)
    const minZoom = 0.75;
    const maxZoom = 20;
  
    const delta = event.deltaY * 0.001;
  
    const newZoom = THREE.MathUtils.clamp(
      this.state.zoom - delta,
      minZoom,
      maxZoom
    );
  
    this.setState({ zoom: newZoom });
  
    camera.fov = 50 / newZoom;
    camera.updateProjectionMatrix();
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
  
    //Si está el popup abierto, la escena se bloquea
    if (!this.popupRef.current.style.display || this.popupRef.current.style.display === 'none') {
    // Calcular el movimiento del mouse y ajustar la rotación de la cámara
      target.x = mouse.x * -1.5;
      target.y = mouse.y * 0.5;
    }
  }
  
  // Mover la vista de la cámra hacia el centro al cerrar el popup
  moveToCenter() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    target.x = ((centerX / window.innerWidth) * 2 - 1) * -1.5;
    target.y = ((centerY / window.innerHeight) * 2 - 1) * 0.5;
  }
  
  

  init() {
    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x000000, 0, 100) // Niebla

    // Añadir cámara
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;
    camera.position.y = 5;

    // Screen renderer    
    renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });
    // renderer.setSize(854, 480);
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener("resize", function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(window.devicePixelRatio)
    });

    // Añadir Grid
    var grid = new THREE.GridHelper(100, 50);
    scene.add(grid);

    // Añadir punto de luz
    var light = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(light);
    light.position.set(1, 5, 8);


    // Añadir cubo
    // var geometry = new THREE.BoxGeometry(1, 1, 1); CUBO
    var geometry = new THREE.TorusGeometry(0.5, 0.1, 2, 64);
    var material = new THREE.MeshStandardMaterial({ color: 0xfffff, wireframe: false, emissive: 0xffffff, shininess: 100 });
    cube = new THREE.Mesh(geometry, material);
    cube.rotation.x = Math.PI / 2;
    scene.add(cube);
    cube.position.y = 0.5;
    cube.position.z = 1;
    cube.name = "positionTP";

    
    

    // Mover la cámara hacia el objeto presionado
    var locationTP = new THREE.Vector3();
    cube.getWorldPosition ( locationTP );


    loader = new GLTFLoader();

    loader.load('models/hamburguesa.gltf', (gltf) => {
      const modelo3D = gltf.scene;
  
      modelo3D.position.set(0, 0, 0)
      modelo3D.scale.set(1, 1, 1);
  
      scene.add(modelo3D);
    });
    

    // Añadir pared (test)
    var wallgeometry = new THREE.BoxGeometry(10, 5, 0.1);
    var wallmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false });
    wall = new THREE.Mesh(wallgeometry, wallmaterial);
    scene.add(wall);
    wall.position.z = -5;
    wall.position.y = 2.5;

    

    // Añadir la geometría del popup
    var geometrypopup = new THREE.BoxGeometry(1, 1, 1);
    var materialpopup = new THREE.MeshPhongMaterial({ color: 0xa0ff4244, wireframe: true, emissive: 0xa0ff4244, shininess: 100 });
    popup = new THREE.Mesh(geometrypopup, materialpopup);
    popup.castShadow = false;
    scene.add(popup);
    popup.position.y = 3;
    popup.position.x = 0;
    popup.position.z = -4;


    const video = document.getElementById( 'video' );
    const texturevideo = new THREE.VideoTexture( video );
  }
animate() {
    // Suavizar el movimiento de la cámara
    const lerpAmount = 0.05; // Suavidad del movimiento
    const targetRotationX = THREE.MathUtils.clamp(target.y, this.minRotationX, this.maxRotationX);
    const targetRotationY = THREE.MathUtils.clamp(target.x, this.minRotationY, this.maxRotationY);

    camera.rotation.x = THREE.MathUtils.lerp(camera.rotation.x, targetRotationX, lerpAmount);
    camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, targetRotationY, lerpAmount);

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
  
    const intersects = raycaster.intersectObject(popup);
  
    if (intersects.length > 0) {
      this.showPopup();
    } else {
      const cubeIntersects = raycaster.intersectObject(cube);
      if (cubeIntersects.length > 0) {
        const position = cubeIntersects[0].point;
        const cameraY = camera.position.y; // Guarda la altura actual de la cámara
        camera.position.copy(position);
        camera.position.y = cameraY; // Restaura la altura de la cámara
        camera.lookAt(position);
        // id = this.getObjectById();
        // axios.post("direccion", {
        //   id: id
        // })
      }
    }
  }
  
  
  moveCameraToPosition(position) {
    const cameraY = camera.position.y; // Guardar posición Z
    camera.position.copy(position);
    camera.position.z = cameraY; // Igualar altura de la cámara a la posición de la cámara
    camera.lookAt(position);
  }
  
  

  showPopup() {
    const popup = this.popupRef.current; //Añadir popup a la escena 3D (DOM)
    popup.style.display = "block"; //Cambia la propiedad "display" de "popup" con el fin de mostrarlo en la escena
  }

  
  

  render() {
    return (
      <div>
        <canvas ref={this.canvasRef} className="App" />
        <div className="AppMenu" ref={this.menuRef}>
        <i className="fa-regular fa-eye-slash" id="eyeClose" onClick={this.closeMenu}></i>
        <h1>SOY GOD</h1>
        <ul>
          <li><a href="#">SI</a></li>
          <li><a href="#">SI</a></li>
          <li><a href="https://iara.ar" target="_blank"> Ohh si </a></li>

        </ul>
        </div>

        <div id="popup" className="popup" ref={this.popupRef} style={{ display: "none", position: "absolute", top: 0, left: 0 }}>  {/* Hace referencia al elemento "popup" para mostrarlo en el HTML */}
        <i className="fa-regular fa-eye-slash" id="eyeClose" onClick={this.closePopup}></i> {/* Cerrar video mediante la referencia "this.closePopup" */}


        {/* <div id="containerUI"> */}
          <h1 id="UItitle">Title</h1>
        {/* <video controls src="Humpty Dumpty _ Kids Songs _ Super Simple Songs.mp4" id="videoDiv"></video> */}
        <video controls src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" id="videoDiv"></video>
        
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