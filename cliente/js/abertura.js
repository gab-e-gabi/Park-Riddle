export default class Abertura extends Phaser.Scene {

  constructor () {
    super('abertura')
  }

  preload() {
    this.load.image('fundo', 'assets/abertura-fundo.png')
    this.load.spritesheet('botao', 'assets/UI/botao.png', {
      frameWidth: 153,
      frameHeight: 59
    })
  }

  create() {


    this.add.image(400, 225, 'fundo')

    this.botao = this.add.image(400, 400, 'botao')


    this.botao.setInteractive().on('pointerdown', () => {
      if (navigator.vibrate) {
        navigator.vibrate(100)
      } else {
        console.log('Vibração não suportada')
      }
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          this.game.midias = stream
        })
        .catch((error) => console.error(error))
        
      })

    this.botao.on('pointerup', () => {
      if (navigator.vibrate) {
        navigator.vibrate(100)
      } else {
        console.log('Vibração não suportada')
      }
      this.scene.stop()
      this.scene.start('preload')
    })
  }

  update() { }
}
