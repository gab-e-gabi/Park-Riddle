export default class abertura extends Phaser.Scene {
  constructor () {
    super('sala')
  }

  create () {
    
    this.load.spritesheet('tela-cheia', 'assets/UI/tela-cheia.png', {
      frameWidth: 32,
      frameHeight: 32
    })
        this.telaCheia = this.add.sprite(778, 20, "tela-cheia", 0).setInteractive().on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        this.telaCheia.setFrame(0);
      } else {
        this.scale.startFullscreen();
        this.telaCheia.setFrame(1);
      }
    }).setScrollFactor(0);

    this.salas = [
      { x: 200, y: 200, numero: '1' },
      { x: 300, y: 200, numero: '2' },
      { x: 400, y: 200, numero: '3' },
      { x: 500, y: 200, numero: '4' },
      { x: 600, y: 200, numero: '5' },
      { x: 200, y: 400, numero: '6' },
      { x: 300, y: 400, numero: '7' },
      { x: 400, y: 400, numero: '8' },
      { x: 500, y: 400, numero: '9' },
      { x: 600, y: 400, numero: '10' },
    ];

    this.salas.forEach(sala => {
      sala.botao = this.add
        .sprite(sala.x, sala.y, "numeros", sala.numero - 1)
        .setInteractive()
        .on("pointerdown", () => {
          this.add.text(10, 10, 'Aguardando segundo jogador...');
          this.game.sala = sala.numero;
          this.game.socket.emit("entrar-na-sala", this.game.sala);
        });
    });
    this.game.socket.on("jogadores", (jogadores) => {
      if (jogadores.segundo) {
        this.game.jogadores = jogadores;
        this.scene.stop();
        this.scene.start("patio");
      }
    })
  }
}