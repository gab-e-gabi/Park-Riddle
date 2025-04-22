export default class abertura extends Phaser.Scene {

  constructor () {
    super('preload')
  }

  init () {
    this.add.rectangle(400, 300, 468, 32).setStrokeStyle(1, 0xffffff)
    const progresso = this.add.rectangle(400 - 230, 300, 4, 28, 0xffffff)
    this.load.on('progress', (progress) => {
      progresso.width = 4 + (460 * progress)
    })
  }

  preload () {
    this.load.spritesheet('botao', 'assets/botao.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.image('fundo', 'assets/abertura-fundo.png')
    this.load.spritesheet('Dan', 'assets/Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    }),
      this.load.spritesheet('Ernesto', 'assets/Ernesto.png', {
        frameWidth: 64,
        frameHeight: 64
      })
    this.load.image('grama', 'assets/mapa/grama.png')
    this.load.image('sombras', 'assets/mapa/sombras.png')
    this.load.image('itens', 'assets/mapa/itens.png')
    this.load.image('plantas', 'assets/mapa/plantas.png')
    this.load.image('sombras-plantas', 'assets/mapa/sombras-plantas.png')
    this.load.image('tenda', 'assets/mapa/tenda.png')
  }

  create () {
    this.scene.start('sala')
  }

  update () { }
}