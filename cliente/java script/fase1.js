export default class abertura extends Phaser.Scene {

  constructor () {
    super('fase1')
  }

  init () { }

  preload () {
    this.load.spritesheet('Dan', 'assets/Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('Ernesto', 'assets/Ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create () {
    this.Dan = this.physics.add.sprite(100, 100, 'Dan')
    this.Ernesto = this.physics.add.sprite(200, 100, 'Ernesto')

    this.anims.create({
      key: 'dan-direita',
      frames: this.anims.generateFrameNumbers('Dan', { start: 88, end: 94 }),
      frameRate: 10,
      repeat: -1
    })
    this.Dan.play('dan-direita')
    this.Dan.setVelocityX(100)

    this.anims.create({
      key: 'dan-esquerda',
      frames: this.anims.generateFrameNumbers('Dan', { start: 70, end: 77 }),
      frameRate: 10,
      repeat: -1
    })
    this.Dan.play('dan-esquerda')
    this.Dan.setVelocityX(-100)

    this.anims.create({
      key: 'ernesto-direita',
      frames: this.anims.generateFrameNumbers('Ernesto', { start: 88, end: 94 }),
      frameRate: 10,
      repeat: -1
    })
    this.Ernesto.play('ernesto-direita')
    this.Ernesto.setVelocityX(100)

    this.anims.create({
      key: 'ernesto-esquerda',
      frames: this.anims.generateFrameNumbers('Ernesto', { start: 70, end: 77 }),
      frameRate: 10,
      repeat: -1
    })
    this.Ernesto.play('ernesto-esquerda')
    this.Ernesto.setVelocityX(-100)
  }

  update () { 
    if (this.Dan.x > 800) {
      this.Dan.setVelocityX(-100)
    } else if (this.Dan.x < 0) {
      this.Dan.setVelocityX(100)
    }

    if (this.Ernesto.x > 800) {
      this.Ernesto.setVelocityX(-100)
    } else if (this.Ernesto.x < 0) {
      this.Ernesto.setVelocityX(100)
    }
  }
}