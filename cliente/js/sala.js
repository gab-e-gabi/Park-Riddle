export default class abertura extends Phaser.Scene {

  constructor () {
    super('sala')
  }

  init () { }

  preload () { }

  create () {
    this.scene.start('fase1')
  }

  update () { }
}