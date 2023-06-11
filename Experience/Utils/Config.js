export default class Config {
  constructor() {
    this.setId();
  }

  setId() {
    this.id = {};
    this.id.value = null;

    this.id.set = (id) => {
      this.id.value = id;
    };
  }
}
