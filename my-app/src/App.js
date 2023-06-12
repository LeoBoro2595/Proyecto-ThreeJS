import React, { Component } from "react";
import "./App.css";
import * as THREE from "three";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { FirstPersonControls } from "./FirstPersonControls.js";
// import { OrbitControls} from "./Movement/orbitcontrols.js";



let scene, camera, renderer, cube;

class App extends Component {
  constructor(props) {
    super(props);
    this.animate = this.animate.bind(this);
  }

  init() {
    //Creating scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);

    //Add camera
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight);

    //Screen renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    
    
    // controls = new THREE.TrackballControls( camera );
    // controls.target.set( 0, 0, 0 );



    //Add Grid
    var grid = new THREE.GridHelper(100, 50);
    scene.add(grid);

    //Add geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
    });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 20;
    camera.position.y = 5;

    return renderer.domElement;



    // MOVIMIENTOS DE LA CÁMARA

    // const controls = new OrbitsControls(camera, renderer.domElement);

  }





  //Renderizado de pantalla
  animate() {
    requestAnimationFrame(this.animate);
    renderer.render(scene, camera);
  }

  componentDidMount() {
    document.getElementById("Render").appendChild(this.init());
    this.animate();
  }

  render() {
    return <div id="Render" className="App"></div>;
  }
}

export default App;