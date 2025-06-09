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

    this.botao = this.add.sprite(400, 400, 'botao')

    this.anims.create({
      key: 'botao',
      frames: this.anims.generateFrameNumbers('botao', { start: 0, end: 7 }),
      frameRate: 10
    })

    this.botao.setInteractive().on('pointerdown', () => {
      this.botao.play('botao')
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          this.game.midias = stream
        })
        .catch((error) => console.error(error))
        })

      if ('vibrate' in navigator) {
        navigator.vibrate(100)
      }

    this.botao.on('animationcomplete', () => {
      this.scene.stop()
      this.scene.start('preload')
    })
  }

  update() { }
}
