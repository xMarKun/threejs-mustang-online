// 参考: https://www.youtube.com/watch?v=rxTb9ys834w
// GitHub: https://github.com/andrewwoan/abigail-bloom-portolio-bokoko33

import * as THREE from 'three';

import Config from './Utils/Config';
import Debug from './Utils/Debug';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Resources from './Utils/Resources';
import assets from './Utils/assets';
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';

export default class Experience {
  static instance;
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.config = new Config();
    this.time = new Time();
    this.sizes = new Sizes();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.resources = new Resources(assets);
    this.world = new World();
    if (window.location.hash === '#debug') {
      this.debug = new Debug();
    }

    this.sizes.on('resize', () => {
      this.resize();
    });
    this.time.on('update', () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.world.resize();
    this.renderer.resize();
  }

  update() {
    this.debug?.stats && this.debug.stats.begin();
    this.camera.update();
    this.world.update();
    this.renderer.update();
    this.debug?.stats && this.debug.stats.end();
  }
}
