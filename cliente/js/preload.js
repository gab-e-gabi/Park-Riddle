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
    this.load.spritesheet('Dan', 'assets/dan.png', {
      frameWidth: 64,
      frameHeight: 64
    }),
    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    }),
    this.load.spritesheet('gato', 'assets/gato-teste.png', {
      frameWidth: 32,
      frameHeight: 33
    })
    this.load.spritesheet('tiro', 'assets/UI/shootUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('corrida', 'assets/UI/runUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
        this.load.spritesheet('tela-cheia', 'assets/tela-cheia.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    
    this.load.image('fundo', 'assets/abertura-fundo.png')
    this.load.image('chao', 'assets/mapa/texturas/chao/chao.png')
    this.load.image('arvores-verdes', 'assets/mapa/texturas/objetos/arvores-verdes.png')
    this.load.image('tendaLLD', 'assets/mapa/texturas/objetos/tendaLLD.png')
    this.load.image('tenda', 'assets/mapa/texturas/objetos/tenda.png')

    this.load.image('lanterna', 'assets/luz.png')
    this.load.image('particula-chuva', 'assets/mapa/texturas/chuva.png')

    this.load.audio('chuva', 'assets/audio/chuva.wav')
    this.load.audio('trilha-sonora', 'assets/audio/trilha-sonora.mp3')
    this.load.audio('passos', 'assets/audio/passos.mp3')
    this.load.audio('tiro', 'assets/audio/tiro.mp3')
  }

  create() {
    this.scene.start('sala')
  }

  update() { }
}