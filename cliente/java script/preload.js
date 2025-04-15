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
    this.load.setPath('assets/')
    this.load.image('fundo', 'abertura-fundo.png')
    this.load.spritesheet('Dan', 'Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    }),
      this.load.spritesheet('Ernesto', 'Ernesto.png', {
        frameWidth: 64,
        frameHeight: 64
      })
  }

  create () {
    this.scene.start('sala')
  }

  update () { }
}