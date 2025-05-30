/*global Phaser*/
/*eslint no-undef: "error"*/
export default class abertura extends Phaser.Scene {

  constructor() {
    super('desafioEsquerda')
    this.threshold = 1
    this.direcaoAtual = 'cima'
    this.personagemLocalAcao = false
  }

  init() { }

  preload() {

    this.textures.generate('bullet', { data: ['1'], pixelWidth: 1, pixelHeight: 1 });

    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('Dan', 'assets/dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('tela-cheia', 'assets/tela-cheia.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('tiro', 'assets/UI/shootUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('corrida', 'assets/UI/runUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('joystick', 'assets/UI/joystick.png', {
      frameWidth: 96,
      frameHeight: 96
    })

    this.load.plugin('rexvirtualjoystickplugin', './js/rexvirtualjoystickplugin.min.js', true)

    this.load.audio('tiro', 'assets/audio/tiro.mp3')

    this.input.addPointer()
  }

  create() {

    //Sons
    this.tiroSom = this.sound.add('tiro')

    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.game.remoteConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.remoteConnection.createDataChannel(
        "dadosJogo",
        { negotiated: true, id: 0 },
      );

      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
          this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.remoteConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.socket.on("offer", (description) => {
        this.game.remoteConnection
          .setRemoteDescription(description)
          .then(() => this.game.remoteConnection.createAnswer())
          .then((answer) =>
            this.game.remoteConnection.setLocalDescription(answer),
          )
          .then(() =>
            this.game.socket.emit(
              "answer",
              this.game.sala,
              this.game.remoteConnection.localDescription,
            ),
          );
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.remoteConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(936, 1248, 'ernesto')
      this.personagemRemoto = this.add.sprite(1000, 1248, 'Dan')
      this.speed = 75
      this.frameRate = 18
      this.personagemLocal.stamina = 650
      this.personagemLocal.cansado = false

      this.barraStaminaMeio = this.add.circle(0, 0, 150 / 50, 0x000000)
      this.barraStaminaMeio.depth = 102

      this.barraStamina = this.add.circle(0, 0, this.personagemLocal.stamina / 50, 0x1a620e)
      this.barraStamina.depth = 101

      this.barraStaminaFundo = this.add.circle(0, 0, 700 / 50, 0x000000)
      this.barraStaminaFundo.depth = 100

      //Botão de corrida
      this.botaoCorrida = this.add.sprite(700, 400, 'corrida', 0)
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', () => {
          this.speed = 150
          this.frameRate = 25
          this.personagemLocal.movimento = 'correndo'
        })
        .on('pointerup', () => {
          this.speed = 90
          this.frameRate = 18
          this.personagemLocal.movimento = 'andando'
        })
        .depth = 100
      this.fazAcao = function () {
        true
      }

    } else if (this.game.jogadores.segundo === this.game.socket.id) {
      this.game.localConnection = new RTCPeerConnection(this.game.iceServers);
      this.game.dadosJogo = this.game.localConnection.createDataChannel(
        "dadosJogo",
        {
          negotiated: true,
          id: 0,
        },
      );

      this.game.localConnection.onicecandidate = ({ candidate }) => {
        this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      this.game.localConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      if (this.game.midias) {
        this.game.midias
          .getTracks()
          .forEach((track) =>
            this.game.localConnection.addTrack(track, this.game.midias),
          );
      }

      this.game.localConnection
        .createOffer()
        .then((offer) => this.game.localConnection.setLocalDescription(offer))
        .then(() =>
          this.game.socket.emit(
            "offer",
            this.game.sala,
            this.game.localConnection.localDescription,
          ),
        );

      this.game.socket.on("answer", (description) => {
        this.game.localConnection.setRemoteDescription(description);
      });

      this.game.socket.on("candidate", (candidate) => {
        this.game.localConnection.addIceCandidate(candidate);
      });

      this.personagemLocal = this.physics.add.sprite(1000, 1248, 'Dan')
      this.personagemRemoto = this.add.sprite(936, 1248, 'ernesto')
      this.speed = 90
      this.frameRate = 18
      this.personagemLocal.stamina = 650
      this.personagemLocal.cansado = false

      this.barraStaminaMeio = this.add.circle(0, 0, 150 / 50, 0x000000)
      this.barraStaminaMeio.depth = 102

      this.barraStamina = this.add.circle(0, 0, this.personagemLocal.stamina / 50, 0x1a620e)
      this.barraStamina.depth = 101

      this.barraStaminaFundo = this.add.circle(0, 0, 700 / 50, 0x000000)
      this.barraStaminaFundo.depth = 100

      //Botão de corrida
      this.botaoCorrida = this.add.sprite(700, 400, 'corrida', 0)
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', () => {
          this.speed = 150
          this.frameRate = 25
          this.personagemLocal.movimento = 'correndo'
        })
        .on('pointerup', () => {
          this.speed = 90
          this.frameRate = 18
          this.personagemLocal.movimento = 'andando'
        })
        .depth = 100

      //Botão de Ação
      this.botaoAcao = this.add.sprite(750, 350, 'tiro', 0)
        .setInteractive()
        .setScrollFactor(0)

      this.botaoAcao
        .on('pointerdown', () => {
          this.personagemLocalAcao = true
          this.botaoAcao.setFrame(1)
        })
      this.botaoAcao.depth = 100

      //Animação de tiro
      this.botaoAcao.on('pointerdown', () => {

        this.botaoAcao.setFrame(1)
        this.personagemLocalAcao = true
        this.personagemLocal.setVelocity(0)

        this.personagemLocal.anims.play(`personagem-acao-${this.direcaoAtual}`, true)
        if (!this.tiroSom.isPlaying) {
          this.tiroSom.play()
        }

        this.personagemLocal.on('animationcomplete', () => {
          this.personagemLocalAcao = false
          this.botaoAcao.setFrame(0)
          this.tiroSom.stop()
        })

        this.time.delayedCall(700, () => {
          this.bullet = this.physics.add.image(this.personagemLocal.x, this.personagemLocal.y, 'bullet')
            .setDisplaySize(4, 4)
            .setTint(0xffe600)
            .setBlendMode(Phaser.BlendModes.ADD)
            .setVelocity(Math.round(Math.cos(this.ultimoAngulo)) * 1000, Math.round(Math.sin(this.ultimoAngulo) * 1000))
            .setSize(10, 10)

          this.time.delayedCall(600, () => {
            this.bullet.destroy()
          })
        })
      })
    } else {
      window.alert("Sala cheia!")
      this.scene.stop()
      this.scene.start("sala")
    }

    this.game.dadosJogo.onopen = () => {
      console.log("Conexão de dados aberta!");
    }

    // Processa as mensagens recebidas via DataChannel
    this.game.dadosJogo.onmessage = (event) => {
      const dados = JSON.parse(event.data);

      if (dados.personagem) {
        this.personagemRemoto.x = dados.personagem.x;
        this.personagemRemoto.y = dados.personagem.y;
        this.personagemRemoto.setFrame(dados.personagem.frame);
        this.angleRemoto = dados.personagem.lanterna
      }
    }

    //Fisica do player
    this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
    //   .setBounds(
    //     0,
    //     0,
    //     this.layerChao.width,
    //     this.layerChao.height)

    // this.physics.world.setBounds(
    //   0,
    //   0,
    //   this.layerChao.width,
    //   this.layerChao.height)

    this.personagemLocal.setSize(32, 48)
    this.personagemLocal.setOffset(16, 16)
    this.personagemLocal.setCollideWorldBounds(true)

    // this.layerObjetos.setCollisionByProperty({ collides: true })
    // this.physics.add.collider(this.personagemLocal, this.layerObjetos)

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

    //Acao do personagem
    this.anims.create({
      key: 'personagem-acao-baixo',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 104, end: 116 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 117, end: 129 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 130, end: 142 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 143, end: 155 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 156, end: 168 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-cima-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 169, end: 181 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-baixo-esquerda',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 182, end: 194 }),
      frameRate: 12,
    })
    this.anims.create({
      key: 'personagem-acao-baixo-direita',
      frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 195, end: 207 }),
      frameRate: 12,
    })

    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.sprite(120, 360, 'joystick', 0),
      thumb: this.add.sprite(120, 360, 'joystick', 1)
    })

    this.telaCheia = this.add.sprite(778, 20, "tela-cheia", 0).setInteractive().on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        this.telaCheia.setFrame(0);
      } else {
        this.scale.startFullscreen();
        this.telaCheia.setFrame(1);
      }
    }).setScrollFactor(0);
  }


  update() {

    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    if (angle != 0) {
      this.ultimoAngulo = angle
    }

    if (this.personagemLocal.movimento == 'andando' && this.personagemLocal.stamina != 650) {
      this.personagemLocal.stamina += 1
      this.barraStamina.radius = this.personagemLocal.stamina / 50

    } else if (this.personagemLocal.stamina == 650) {
      this.personagemLocal.cansado = false
      this.barraStamina.setFillStyle(0x309a06)
      this.barraStamina.setAlpha(0)
      // this.barraStaminaFundo.setAlpha(0)
      this.barraStaminaMeio.setAlpha(1)
      this.barraStaminaMeio.setFillStyle(0x309a06)

      if (this.barraStaminaFundo.radius >= this.barraStaminaMeio.radius + 1) {
        this.barraStaminaFundo.radius -= 0.4
      }
    }

    if (((this.threshold < force) && (force <= 1000)) && (this.personagemLocalAcao != true)) {

      const velocityX = Math.round(Math.cos(angle) * this.speed)
      const velocityY = Math.round(Math.sin(angle) * this.speed)

      if (this.personagemLocal.cansado == false) {
        if (this.personagemLocal.movimento == 'correndo' && this.personagemLocal.stamina > 150) {
          this.personagemLocal.stamina -= 1
          this.barraStamina.setAlpha(1)
          this.barraStaminaFundo.setAlpha(1)
          this.barraStaminaMeio.setAlpha(1)
          this.barraStaminaMeio.setFillStyle(0x000000)
          this.barraStamina.radius = this.personagemLocal.stamina / 50
          this.barraStaminaFundo.radius = this.personagemLocal.stamina / 50 + 2
        }
        else if (this.personagemLocal.stamina == 150) {
          this.personagemLocal.movimento = 'andando'
          this.personagemLocal.cansado = true
          this.barraStamina.setAlpha(1)
          this.barraStaminaFundo.setAlpha(1)
          this.barraStaminaMeio.setAlpha(1)
          this.barraStamina.setFillStyle(0x9a3706)
          this.speed = 75
        }
      }

      this.personagemLocal.setVelocity(velocityX, velocityY)
      this.barraStamina.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaFundo.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaMeio.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)

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

    //   //Altera pitch dos passos
    //   let Modulado = Math.floor(Math.random() * (1200 - 300 + 1)) + 300;
    //   this.passos.setDetune(Modulado)

    //   //Retorna o frame atual na animação
    //   this.frameAtual = this.personagemLocal.anims.currentFrame.index;

    //   //Frames do ernesto com o pé no chao
    //   const pesNoChao = [4, 10]

    //   //Toca som de passos quando o pé toca o chão
    //   if (pesNoChao.includes(this.frameAtual) && this.personagemLocalAcao == false) {
    //     this.passos.play()
    //   }

    } else {
      // Se a força do joystick for baixa, o personagem para
      if (this.personagemLocalAcao != true) {
        this.personagemLocal.setVelocity(0)
        this.personagemLocal.anims.play(`personagem-parado-${this.direcaoAtual}`, true)
      }
    }

    try {
      if (this.game.dadosJogo.readyState === "open") {
        if (this.personagemLocal && this.gatos) {
          this.game.dadosJogo.send(
            JSON.stringify({
              personagem: {
                x: this.personagemLocal.x,
                y: this.personagemLocal.y,
                frame: this.personagemLocal.frame.name,
                lanterna: this.ultimoAngulo
              },
            })
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
}