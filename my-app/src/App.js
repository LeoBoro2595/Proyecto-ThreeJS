import React, { Component } from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


let scene, camera, renderer, cube, wall, controls;

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.animate = this.animate.bind(this);
  }

  init() {
    // Creating scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Add camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);
    camera.position.z = 20;
    camera.position.y = 5;

    // Screen renderer
    renderer = new THREE.WebGLRenderer({ canvas: this.canvasRef.current });
    renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Add Grid
    var grid = new THREE.GridHelper(100, 50);
    scene.add(grid);


    //Add Point Light    
    var light = new THREE.PointLight( 0xffffff, 0.4);
    scene.add(light);
    light.position.set(1, 5, 8);


    // Add GLTF Model
    var loader = new GLTFLoader();

    var obj;
    loader.load("../models/camionetatest.gltf", function (gltf) {
      obj = gltf.scene;
      scene.add(gltf.scene);
    })

    // Add geometry
    var geometry = new THREE.BoxGeometry(1, 1, 1);
    var material = new THREE.MeshStandardMaterial({ color: 0xff0000, wireframe: false, });
    cube = new THREE.Mesh(geometry, material);
    
    scene.add(cube);
    cube.position.y = 0.5;


    // Add wall
    var wallgeometry = new THREE.BoxGeometry(10, 5, 0.1);
    var wallmaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false, });
    wall = new THREE.Mesh(wallgeometry, wallmaterial);
    scene.add(wall);
    wall.position.z = -5;
    wall.position.y = 2.5;       


    // OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);

    // controls = new FirstPersonControls (camera, renderer.domElement);


    
    return renderer.domElement;
  }

  // Renderizado de pantalla
  animate() {
    requestAnimationFrame(this.animate);
    renderer.render(scene, camera);
    controls.update(); // Actualiza los controles de la cámara
  }

  componentDidMount() {
    const renderElement = this.init();
    this.animate();
  }

  render() {
    return <canvas ref={this.canvasRef} className="App" />;
  }
}

export default App;