export default class abertura extends Phaser.Scene {

  constructor () {
    super('preload')
  }

  init() {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff)
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff)
    this.load.on('progress', (progress) => {
      progresso.width = 4 + (460 * progress)
    })
  }

  preload() {
    this.load.spritesheet('botao', 'assets/botao.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.image('fundo', 'assets/abertura-fundo.png')
    this.load.spritesheet('Dan', 'assets/Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    }),
      this.load.spritesheet('ernesto', 'assets/ernesto.png', {
        frameWidth: 64,
        frameHeight: 64
      })
    this.load.image('grama', 'assets/mapa/texturas/chao/grama.png')
    this.load.image('pedras', 'assets/mapa/texturas/chao/pedras.png')
    this.load.image('arvores-verdes', 'assets/mapa/texturas/objetos/arvores-verdes.png')
    this.load.image('tendas', 'assets/mapa/texturas/tendaLLD.png')

    this.load.image('lanterna', 'assets/luz.png')
    this.load.image('particula-chuva', 'assets/mapa/texturas/chuva.png')

    this.load.audio('chuva', 'assets/audio/chuva.wav')
    this.load.audio('trilha-sonora', 'assets/audio/trilha-sonora.mp3')
    this.load.audio('passos', 'assets/audio/passos')
  }

  create() {
    this.scene.start('sala')
  }

  update() { }
}