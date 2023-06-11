import Experience from '../Experience';

export default class Game {
  constructor() {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.mustang = this.experience.world.mustang;

    this.setGame();
    this.setStatus();
    this.setWebSocket();
  }

  setGame() {
    this.game = {};
  }

  setStatus() {
    this.status = {};
    this.status.items = {
      offline: { value: 'offline', label: 'オフライン', color: '#ff0000' },
      online: { value: 'online', label: 'オンライン', color: '#00ff00' },
      connecting: { value: 'connecting', label: '接続中...', color: '#dddddd' },
    };
    this.status.current = this.status.items.connecting.value;
    this.status.iconElm = document.getElementById('status-icon');
    this.status.labelElm = document.getElementById('status-label');

    this.status.setOffline = () => {
      this.status.current = this.status.items.offline.value;
      this.status.labelElm.textContent = this.status.items.offline.label;
      this.status.iconElm.style.background = this.status.items.offline.color;
    };
    this.status.setOnline = () => {
      this.status.current = this.status.items.online.value;
      this.status.labelElm.textContent = this.status.items.online.label;
      this.status.iconElm.style.background = this.status.items.online.color;
    };
    this.status.setConnecting = () => {
      this.status.current = this.status.items.connecting.value;
      this.status.labelElm.textContent = this.status.items.connecting.label;
      this.status.iconElm.style.background = this.status.items.connecting.color;
    };
  }

  setWebSocket() {
    this.webSocket = {};

    // options
    this.webSocket.options = {};
    this.webSocket.options.host = 'localhost';
    this.webSocket.options.port = '8000';

    // connection
    this.webSocket.sock = new WebSocket(`ws://${this.webSocket.options.host}:${this.webSocket.options.port}`);

    // 接続が完了した時
    this.webSocket.sock.addEventListener('open', () => {
      this.status.setOnline();
    });

    // メッセージを受信した時
    this.webSocket.sock.addEventListener('message', (e) => {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case 'notifyId':
          this.config.id.set(data.id);
          break;

        case 'create':
          this.mustang.object.create(data.userId);
          break;

        case 'remove':
          this.mustang.object.remove(data.userId);
          break;

        case 'move':
          this.mustang.object.move(data.userId, data.data);
          break;

        default:
          break;
      }
    });

    // 接続がを閉じた時
    this.webSocket.sock.addEventListener('close', () => {
      this.status.setOffline();
    });

    // エラーが発生した時
    this.webSocket.sock.addEventListener('error', (e) => {
      this.status.setOffline();
      console.log(e);
    });
  }

  update() {
    if (this.status.current === 'online' && this.mustang.myVehicle) {
      const data = {};
      data.type = 'move';
      data.userId = this.config.id.value;
      data.data = this.mustang.myVehicle;
      this.webSocket.sock.send(JSON.stringify(data));
    }
  }
}
