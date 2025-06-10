export default class GameOver extends Phaser.Scene {

  constructor () {
    super('GameOver')
  }

  init () { }

  preload () {
    this.load.image('game-over', 'assets/GameOver.png')
  }

  create () {
    this.imagemFinal = this.add.image(0, 0, 'game-over').setInteractive()
    .on('pointerdown', () => {
      window.location.reload();
    })
    this.cameras.main.startFollow(this.imagemFinal)

   }

  update () { }
}