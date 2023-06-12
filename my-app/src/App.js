import React, { Component } from "react";
import "./App.css";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';

let scene, camera, renderer, cube, controls;

class App extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.animate = this.animate.bind(this);
  }

  init() {
    // Creating scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    // Add camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);

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

    // Add geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 20;
    camera.position.y = 5;

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