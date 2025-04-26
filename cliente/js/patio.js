export default class abertura extends Phaser.Scene {

  constructor () {
    super('patio')

    this.threshold = 0.1
    this.speed = 75
    this.direcaoAtual = 'frente'
  }

  init() { }

  preload() {

    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa-patio.json')
    this.load.image('grama', 'assets/mapa/texturas/chao/grama.png')
    this.load.image('pedras', 'assets/mapa/texturas/chao/pedras.png')
    this.load.image('arvores-verdes', 'assets/mapa/texturas/objetos/arvores-verdes.png')

    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)
  }

  create() {
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // Da um nome prar cada Tileset
    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetArvores = this.tilemapMapa.addTilesetImage('arvores-verdes')
    this.tilesetPedras = this.tilemapMapa.addTilesetImage('pedras')
    //

    //Diz qual imagem esta em qual camada
    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetGrama, this.tilesetPedras])
    this.layerObjetos = this.tilemapMapa.createLayer('objetos', [this.tilesetArvores])
    //

    this.anims.create({
      key: 'botao',
      frames: this.anims.generateFrameNumbers('botao', { start: 0, end: 0 }),
      frameRate: 30
    })

    //Fisica do player
    this.personagemLocal = this.physics.add.sprite(0, 400, 'ernesto')
    this.layerObjetos.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerObjetos)
    this.cameras.main.startFollow(this.personagemLocal)
    //

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