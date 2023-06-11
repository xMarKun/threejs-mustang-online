import Experience from '../Experience';

export default class Mustang {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.config = this.experience.config;
    this.resources = this.experience.resources;
    this.chassis = this.resources.items.mustangChassis;
    this.wheel = this.resources.items.mustangWheel;
    this.actualChassis = this.chassis.scene;
    this.actualWheel = this.wheel.scene;
    this.sounds = this.experience.world.sounds;
    this.physics = this.experience.world.physics;

    this.cars = {};

    this.setModel();
    this.setKlaxon();
  }

  setModel() {
    this.actualChassis.traverse((child) => {
      child.castShadow = true;
    });
    this.actualWheel.traverse((child) => {
      child.castShadow = true;
    });

    this.object = {};
    this.object.chassis = this.actualChassis;
    this.object.wheel = this.actualWheel;

    this.object.create = (userId) => {
      const chassis = this.object.chassis.clone();
      const wheel = this.object.wheel.clone();
      this.cars[userId] = { chassis, wheel };
      this.scene.add(chassis);
      this.scene.add(wheel);
    };

    this.object.remove = (userId) => {
      this.scene.remove(this.cars[userId].chassis);
      this.scene.remove(this.cars[userId].wheel);
      delete this.cars[userId];
    };

    this.object.move = (userId, data) => {
      this.cars[userId].chassis.position.set(...data.chassis.position);
      this.cars[userId].chassis.quaternion.set(...data.chassis.quaternion);
      this.cars[userId].wheel.children.forEach((child, i) => {
        child.position.set(...data.wheels[i].position);
        child.quaternion.set(...data.wheels[i].quaternion);
      });
    };
  }

  setKlaxon() {
    this.klaxon = {};
    this.klaxon.waitDuration = 800;
    this.klaxon.can = true;

    this.klaxon.jump = () => {
      if (this.klaxon.can) {
        this.klaxon.can = false;
        window.setTimeout(() => {
          this.klaxon.can = true;
        }, this.klaxon.waitDuration);

        this.physics.car.jump();
        this.sounds.play('klaxon');
      }
    };

    if ('ontouchstart' in window || navigator.maxTouchPoints) {
      const klaxonElm = document.getElementById('ctrl-klaxon');
      klaxonElm.addEventListener('touchstart', () => {
        this.klaxon.jump();
      });
    } else {
      window.addEventListener('keydown', (event) => {
        event.key === ' ' && this.klaxon.jump();
      });
    }
  }

  resize() {}

  update() {
    if (this.cars[this.config.id.value]) {
      // 自分の車更新用
      this.cars[this.config.id.value].chassis.position.copy(this.physics.car.chassis.body.position);
      this.cars[this.config.id.value].chassis.position.y = this.physics.car.chassis.body.position.y - this.physics.car.options.chassisHeight / 1.3;
      this.cars[this.config.id.value].chassis.quaternion.copy(this.physics.car.chassis.body.quaternion);
      this.cars[this.config.id.value].wheel.children.forEach((child, i) => {
        child.position.copy(this.physics.car.wheels.bodies[i].position);
        child.quaternion.copy(this.physics.car.wheels.bodies[i].quaternion);
      });
      // 共有用
      this.myVehicle = {};
      this.myVehicle.chassis = {};
      this.myVehicle.chassis.position = this.cars[this.config.id.value].chassis.position.toArray();
      this.myVehicle.chassis.quaternion = this.cars[this.config.id.value].chassis.quaternion.toArray();
      this.myVehicle.wheels = [];
      this.cars[this.config.id.value].wheel.children.forEach((child, i) => {
        this.myVehicle.wheels[i] = {};
        this.myVehicle.wheels[i].position = child.position.toArray();
        this.myVehicle.wheels[i].quaternion = child.quaternion.toArray();
      });
    }
  }
}
