export default class abertura extends Phaser.Scene {

  constructor () {
    super('fase1')

    this.threshold = 0.1
    this.speed = 75
    this.direcaoAtual = 'frente'
  }

  init() { }

  preload() {
    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json')
    this.load.image('grama', 'assets/mapa/grama.png')
    this.load.image('plantas', 'assets/mapa/plantas.png')
    this.load.image('sombras-plantas', 'assets/mapa/sombras-plantas.png')
    this.load.image('tenda', 'assets/mapa/tenda.png')

    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('botao', 'assets/botao.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create() {
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
      frames: this.anims.generateFrameNumbers('botao', { start: 0, end: 0 }),
      frameRate: 30
    })

    this.personagemLocal = this.physics.add.sprite(200, 100, 'ernesto')

    //this.layerPlantas.setCollisionByProperty({ collides: true })
    //this.layerTenda.setCollisionByProperty({ collides: true })
    //this.physics.add.collider(this.personagemLocal, this.layerPlantas)

    this.botao = this.physics.add.sprite(400, 400, 'botao')
    this.botao
      .setInteractive()
      .on('pointerdown', () => {
        this.botao.play('botao')
      })
      .on('pointerup', () => {
        this.botao.setFrame(0)
      })
    //Animacoes do personagem andando
    this.anims.create({
      key: 'personagem-andando-frente',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 0, end: 12 }),
      frameRate: 18,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-tras',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 13, end: 25 }),
      frameRate: 18,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 26, end: 38 }),
      frameRate: 18,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 39, end: 51 }),
      frameRate: 18,
      repeat: -1
    })
    // Animações do personagem parado
    this.anims.create({
      key: 'personagem-parado-frente',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 0, end: 0 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-tras',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 14, end: 14 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 27, end: 27 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers('ernesto', { start: 40, end: 40 }),
      frameRate: 12,
      repeat: -1
    })

    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 200,
      y: 310,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x888888),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })
  }

  update() {

    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {
      const velocityX = Math.cos(angle) * this.speed
      const velocityY = Math.sin(angle) * this.speed

      this.personagemLocal.setVelocity(velocityX, velocityY)

      // Animação do personagem conforme a direção do movimento
      if (Math.abs(velocityX) > Math.abs(velocityY)) {
        if (velocityX > 0) {
          this.personagemLocal.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
        } else {
          this.personagemLocal.anims.play('personagem-andando-esquerda', true)
          this.direcaoAtual = 'esquerda'
        }
      } else {
        if (velocityY > 0) {
          this.personagemLocal.anims.play('personagem-andando-frente', true)
          this.direcaoAtual = 'frente'
        } else {
          this.personagemLocal.anims.play('personagem-andando-tras', true)
          this.direcaoAtual = 'tras'
        }
      }
    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'frente':
          this.personagemLocal.anims.play('personagem-parado-frente', true)
          break
        case 'direita':
          this.personagemLocal.anims.play('personagem-parado-direita', true)

          break
        case 'esquerda':
          this.personagemLocal.anims.play('personagem-parado-esquerda', true)
          break
        case 'tras':
          this.personagemLocal.anims.play('personagem-parado-tras', true)
          break
      }
    }
  }
}