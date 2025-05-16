export default class abertura extends Phaser.Scene {

  constructor () {
    super('patio')
    this.threshold = 0.1
    this.speed = 110
    this.frameRate = 25
    this.direcaoAtual = 'frente'
  }
  //Corrida 110 25
  //Caminhada 75 18

  init () { }

  preload () {

    this.load.image('lanterna', 'assets/luz.png')
    this.load.image('particula-chuva', 'assets/mapa/texturas/chuva.png')

    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('Dan', 'assets/Dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa-patio.json')
    this.load.image('grama', 'assets/mapa/texturas/chao/grama.png')
    this.load.image('pedras', 'assets/mapa/texturas/chao/pedras.png')
    this.load.image('arvores-verdes', 'assets/mapa/texturas/objetos/arvores-verdes.png')
    this.load.image('tendas', 'assets/mapa/texturas/objetos/tendaLLD.png')

    this.load.plugin('rexvirtualjoystickplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js', true)

    this.load.audio("trilha-sonora", 'assets/audio/trilha-sonora.mp3')
    this.load.audio('chuva', 'assets/audio/chuva.wav')
    this.load.audio('passos', 'assets/audio/passos.mp3')
    this.input.addPointer()
  }

  create () {
    this.trilha = this.sound.add("trilha-sonora", {
      loop: true,
      volume: 0.4,
    }).play()
    this.chuva = this.sound.add("chuva", {
      loop: true,
      volume: 0.5
    }).play()

    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // Da um nome prar cada Tileset
    this.tilesetGrama = this.tilemapMapa.addTilesetImage('grama')
    this.tilesetArvores = this.tilemapMapa.addTilesetImage('arvores-verdes')
    this.tilesetPedras = this.tilemapMapa.addTilesetImage('pedras')
    //

    //Diz qual imagem esta em qual camada
    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetGrama, this.tilesetPedras])

    this.lanterna = this.add.image(0, 0, 'lanterna')
    this.lanterna.setAlpha(0.5)
    this.lanterna.setBlendMode(Phaser.BlendModes.ADD)

    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers)
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel('dadosJogo',
        { negotiated: true, id: 0 }
      )

      this.personagemLocal = this.physics.add.sprite(300, 400, 'ernesto')
      this.personagemRemoto = this.physics.add.sprite(350, 450, 'Dan')
    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers)
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel('dadosJogo',
        { negotiated: true, id: 0 }
      )
      
      this.personagemLocal = this.physics.add.sprite(350, 450, 'Dan')
      this.personagemRemoto = this.physics.add.sprite(300, 400, 'ernesto')
    } else {
      window.alert("Jogador não encontrado")
      this.game.stop()
      this.game.start("abertura")
    }


    this.layerObjetos = this.tilemapMapa.createLayer('objetos', [this.tilesetArvores])
    //

    this.anims.create({
      key: 'botao',
      frames: this.anims.generateFrameNumbers('botao', { start: 0, end: 0 }),
      frameRate: 30
    })


    //Fisica do player
    this.personagemLocal.setSize(5, 5)
    this.layerObjetos.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, this.layerObjetos)
    this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
    //

    //Animacoes do personagem andando

    this.anims.create({
      key: 'personagem-andando-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 12 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 13, end: 25 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 26, end: 38 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 39, end: 51 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 52, end: 64 }),
      frameRate: this.frameRate,
      repeat: -1,
    })
    this.anims.create({
      key: 'personagem-andando-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 65, end: 77 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 78, end: 90 }),
      frameRate: this.frameRate,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-andando-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 91, end: 103 }),
      frameRate: this.frameRate,
      repeat: -1
    })


    // Animações do personagem parado
    this.anims.create({
      key: 'personagem-parado-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 0, end: 0 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 14, end: 14 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 27, end: 27 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 40, end: 40 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 53, end: 53 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 66, end: 66 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 79, end: 79 }),
      frameRate: 12,
      repeat: -1
    })
    this.anims.create({
      key: 'personagem-parado-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 92, end: 92 }),
      frameRate: 12,
      repeat: -1
    })

    //Camada para escurecer o fundo
    this.noite = this.add.rectangle(0, 0, 1600, 1200, 0x472a66, 0.75)
    this.noite.setBlendMode(Phaser.BlendModes.MULTIPLY)

    //chuva
    this.particulaChuva = this.add.particles(0, -512, 'particula-chuva', {
      x: { min: 0, max: 1024 },
      quantity: 50,
      lifespan: 4000,
      speedY: { min: 400, max: 1800 },
      gravityX: 20,
      scale: 0.6,
      setGamma: { min: 0.5, max: 1 },
    })
      .setScrollFactor(0);

    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.circle(120, 360, 50, 0x4a3513),
      thumb: this.add.circle(120, 360, 25, 0xcccccc)
    })

    //tenta Fullscreen
    /*
     this.fullscreen = this.add.rectangle(0, 0, 5000, 3000, 0x000000, 0)
    this.fullscreen.setInteractive()
      .on('pointerdown', () => {
        this.scale.startFullscreen()
        this.fullscreen.destroy()
      })
    */

    //Modulação dos passos
    this.passos = this.sound.add('passos', {
      volume: 0.5,
    })

    //Botão de corrida
    this.add.circle(700, 400, 30, 0xcccccc)
      .setInteractive()
      .setScrollFactor(0)
      .on('pointerdown', () => {
        this.speed = 110
        this.frameRate = 25
      })
      .on('pointerup', () => {
        this.speed = 75
        this.frameRate = 18
      })
  }

  update () {

    console.log(this.speed, this.frameRate)

    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (force > this.threshold) {


      const velocityX = Math.round(Math.cos(angle) * this.speed)
      const velocityY = Math.round(Math.sin(angle) * this.speed)

      this.personagemLocal.setVelocity(velocityX, velocityY)
      this.lanterna.setPosition(this.personagemLocal.x, this.personagemLocal.y + 15)
      this.lanterna.setRotation(angle)
      this.cameras.main.followOffset.setTo(- velocityX, - velocityY)
      this.noite.setPosition(this.personagemLocal.x, this.personagemLocal.y)

      // Acha o aungulo mais próximo da direção do joystick
      let o = undefined
      if (this.joystick.angle < 0) {
        o = (this.joystick.angle % 360 + 360) % 360;
      } else {
        o = this.joystick.angle
      }
      const closest = (arr, n) => arr.sort((a, b) => Math.abs(a - n) - Math.abs(b - n))[0];
      this.direcao = closest([0, 45, 90, 135, 180, 225, 270, 315, 360], o)

      // Animação do personagem conforme a direção do movimento
      switch (this.direcao) {
        case 0:
          this.personagemLocal.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
          break
        case 45:
          this.personagemLocal.anims.play('personagem-andando-baixo-direita', true)
          this.direcaoAtual = 'baixo-direita'
          break
        case 90:
          this.personagemLocal.anims.play('personagem-andando-baixo', true)
          this.direcaoAtual = 'baixo'
          break
        case 135:
          this.personagemLocal.anims.play('personagem-andando-baixo-esquerda', true)
          this.direcaoAtual = 'baixo-esquerda'
          break
        case 180:
          this.personagemLocal.anims.play('personagem-andando-esquerda', true)
          this.direcaoAtual = 'esquerda'
          break
        case 225:
          this.personagemLocal.anims.play('personagem-andando-cima-esquerda', true)
          this.direcaoAtual = 'cima-esquerda'
          break
        case 270:
          this.personagemLocal.anims.play('personagem-andando-cima', true)
          this.direcaoAtual = 'cima'
          break
        case 315:
          this.personagemLocal.anims.play('personagem-andando-cima-direita', true)
          this.direcaoAtual = 'cima-direita'
          break
        case 360:
          this.personagemLocal.anims.play('personagem-andando-direita', true)
          this.direcaoAtual = 'direita'
          break
      }

      //Altera pitch dos passos
      let Modulado = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;
      this.passos.setDetune(Modulado)

      //Retorna o frame atual na animação
      this.frameAtual = this.personagemLocal.anims.currentFrame.index;

      //Frames do ernesto com o pé no chao
      const pesNoChao = [4, 10]

      //Toca som de passos quando o pé toca o chão
      if (pesNoChao.includes(this.frameAtual)) {
        this.passos.play()
      }

    } else {
      // Se a força do joystick for baixa, o personagem para
      this.personagemLocal.setVelocity(0)
      switch (this.direcaoAtual) {
        case 'baixo':
          this.personagemLocal.anims.play('personagem-parado-baixo', true)
          break
        case 'direita':
          this.personagemLocal.anims.play('personagem-parado-direita', true)
          break
        case 'esquerda':
          this.personagemLocal.anims.play('personagem-parado-esquerda', true)
          break
        case 'cima':
          this.personagemLocal.anims.play('personagem-parado-cima', true)
          break
        case 'cima-esquerda':
          this.personagemLocal.anims.play('personagem-parado-cima-esquerda', true)
          break
        case 'cima-direita':
          this.personagemLocal.anims.play('personagem-parado-cima-direita', true)
          break
        case 'baixo-esquerda':
          this.personagemLocal.anims.play('personagem-parado-baixo-esquerda', true)
          break
        case 'baixo-direita':
          this.personagemLocal.anims.play('personagem-parado-baixo-direita', true)
          break
      }
    }
  }
}