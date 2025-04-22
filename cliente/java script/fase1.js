export default class abertura extends Phaser.Scene {

  constructor () {
    super('fase1')
  }

  init () { }

  preload () {
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
    this.load.image('grama', 'assets/mapa/grama.png')
    this.load.image('plantas', 'assets/mapa/plantas.png')
    this.load.image('sombras-plantas', 'assets/mapa/sombras-plantas.png')
    this.load.image('tenda', 'assets/mapa/tenda.png')

    this.load.spritesheet('Dan', 'assets/Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('Ernesto', 'assets/Ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('botao', 'assets/botao.png', {
      frameWidth: 64,
      frameHeight: 64
    })
  }

  create () {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })

    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetPlantas = this.tilemapMapa.addTilesetImage('plantas')
    this.tilesetSombrasPlantas = this.tilemapMapa.addTilesetImage('sombras-plantas')
    this.tilesetTenda = this.tilemapMapa.addTilesetImage('tenda')

    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetGrama, this.tilesetTenda, this.tilesetPlantas, this.tilesetSombrasPlantas])
    this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetGrama, this.tilesetTenda, this.tilesetPlantas, this.tilesetSombrasPlantas])
    this.layerTenda = this.tilemapMapa.createLayer('tenda', [this.tilesetGrama, this.tilesetTenda, this.tilesetPlantas, this.tilesetSombrasPlantas])
    this.layerPlantas = this.tilemapMapa.createLayer('plantas', [this.tilesetGrama, this.tilesetTenda, this.tilesetPlantas, this.tilesetSombrasPlantas])

    this.anims.create({
      key: 'botao',
      frames: this.anims.generateFrameNumbers('botao', { start: 0, end: 7 }),
      frameRate: 30
    })

    this.Dan = this.physics.add.sprite(100, 100, 'Dan')
    this.Ernesto = this.physics.add.sprite(200, 100, 'Ernesto')

    this.layerPlantas.setCollisionByProperty({ collides: true })
    this.layerTenda.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.Dan, this.layerPlantas)
    this.physics.add.collider(this.Ernesto, this.layerPlantas)

    this.botao = this.physics.add.sprite(400, 400, 'botao')
    this.botao
      .setInteractive()
      .on('pointerdown', () => {
        this.botao.play('botao')
      })
      .on('pointerup', () => {
        this.botao.setFrame(0)
      })

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