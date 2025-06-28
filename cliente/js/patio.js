/*global Phaser*/
/*eslint no-undef: "error"*/
export default class patio extends Phaser.Scene {

  constructor() {
    super('patio')
    this.threshold = 1
    this.direcaoAtual = 'cima'
    this.personagemLocalAcao = false
    this.flagDentro = false
  }

  init() { }

  preload() {

    this.load.image('lanterna', 'assets/luz.png')
    this.load.image('particula-chuva', 'assets/mapa/texturas/chuva.png')
    this.textures.generate('bullet', { data: ['1'], pixelWidth: 1, pixelHeight: 1 });

    this.load.spritesheet('ernesto', 'assets/ernesto.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('fumaca', 'assets/fumaca.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('lupa', 'assets/UI/lupa.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('dan', 'assets/dan.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    this.load.spritesheet('fantasma', 'assets/fantasmas.png', {
      frameWidth: 50,
      frameHeight: 64
    })

    this.load.image('mascaraPersonagem', 'assets/mascaraPlayer.png')
    this.load.image('mascaraLanterna', 'assets/mascaraLanterna.png')

    this.load.spritesheet('tela-cheia', 'assets/UI/tela-cheia.png', {
      frameWidth: 32,
      frameHeight: 32
    })

    this.load.spritesheet('tiro', 'assets/UI/shootUI.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('pista', 'assets/UI/hintUI.png', {
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
    this.load.spritesheet('vidas', 'assets/UI/vidas.png', {
      frameWidth: 45,
      frameHeight: 12
    })
    this.load.image('ponteiro', 'assets/UI/seta.png')

    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa-patio.json')
    this.load.image('chao', 'assets/mapa/texturas/chao/chao.png')
    this.load.image('arvores', 'assets/mapa/texturas/objetos/arvores.png')
    this.load.image('tendas', 'assets/mapa/texturas/objetos/tenda.png')

    this.load.plugin('rexvirtualjoystickplugin', './js/rexvirtualjoystickplugin.min.js', true)

    this.load.audio("trilha-sonora", 'assets/audio/trilha-sonora.mp3')
    this.load.audio('chuva', 'assets/audio/chuva.mp3')
    this.load.audio('chuvaInterior', 'assets/audio/chuvaInterior.mp3')
    this.load.audio('passos', 'assets/audio/passos.mp3')
    this.load.audio('passosMadeira', 'assets/audio/passosMadeira.mp3')
    this.load.audio('tiro', 'assets/audio/tiro.mp3')
    this.load.audio('som-fantasma', 'assets/audio/somFantasma.mp3')
    this.load.audio('pega-pista', 'assets/audio/pegaPista.mp3')
    this.load.audio('ernesto-machucado', 'assets/audio/ernesto-machucado.mp3')

    this.input.addPointer()
  }

  create() {
    //Sons
    this.trilha = this.sound.add("trilha-sonora", {
      loop: true,
      volume: 0.1,
    })
    this.trilha.play()

    this.chuvaSom = this.sound.add("chuva", {
      loop: true,
      volume: 0.2
    })
    this.chuvaSom.play()

    this.chuvaInteriorSom = this.sound.add("chuvaInterior", {
      loop: true,
      volume: 0.5
    })

    this.passosSom = this.sound.add('passos', {
      volume: 0.5,
    })
    this.passosMadeiraSom = this.sound.add('passosMadeira', {
      volume: 0.7,
    })
    this.fantasmaSom = this.sound.add('som-fantasma', {
      volume: 0.3
    })
    this.machucadoSom = this.sound.add('ernesto-machucado', {
      volume: 0.3
    })
    this.tiroSom = this.sound.add('tiro')
    this.pistaSom = this.sound.add('pega-pista')
    
    this.tilemapMapa = this.make.tilemap({ key: 'mapa' })
    // Da um nome prar cada Tileset
    this.tilesetChao = this.tilemapMapa.addTilesetImage('chao')
    this.tilesetArvores = this.tilemapMapa.addTilesetImage('arvores')
    this.tilesetTendas = this.tilemapMapa.addTilesetImage('tendas')
    //
    
    //Diz qual imagem esta em qual camada
    this.layerChao = this.tilemapMapa.createLayer('chao', [this.tilesetChao])
    this.layerCaminho = this.tilemapMapa.createLayer('caminho', [this.tilesetChao])
    
    this.lanternaLocal = this.add.image(0, 0, 'lanterna')
    this.lanternaLocal
      .setAlpha(0.7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xfffabe)
      .setDisplaySize(512, 128)
    
    this.lanternaRemota = this.add.image(0, 0, 'lanterna')
    this.lanternaRemota
      .setAlpha(0.7)
      .setBlendMode(Phaser.BlendModes.ADD)
      .setTint(0xfffabe)
      .setDisplaySize(512, 128)


      this.layerSombras = this.tilemapMapa.createLayer('sombras', [this.tilesetArvores,this.tilesetTendas])
      
      this.pistas = [
        { x: 160, y: 740 },
      { x: 480, y: 1000 },
      { x: 960, y: 1115 },
      { x: 1570, y: 780 },
      { x: 1470, y: 180 },
      { x:600, y: 400},
    ]
    this.areaColeta = this.physics.add.image(0, 0, null).setSize(32, 40).setVisible(false)

    // Contador de pistas
    let contador = this.add.text(38, 45, 'Pistas: 0 / 6', { fontFamily: 'Arial', fontSize: 16, color: '#ffff00' }).setScrollFactor(0)
    contador.depth = 100

    this.pistasEncontradas = 0
    this.pistas.forEach((pista) => {
      pista.objeto = this.physics.add.sprite(pista.x, pista.y, 'lupa')
      this.physics.add.overlap(this.areaColeta, pista.objeto, (personagem, pista) => {
        pista.disableBody(true, true),
        this.pistaSom.play(),
        this.pistasEncontradas += 1,
        contador.text = `Pistas: ${this.pistasEncontradas} / 6`
        if (this.pistasEncontradas == 1) {
          this.flagVenceu = true
        }
      }, null, this)
    })
    
    this.layerPlayerSobrepoe = this.tilemapMapa.createLayer('playerSobrepoe', [this.tilesetTendas, this.tilesetArvores])
    
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
      this.personagemRemoto = this.add.sprite(1000, 1248, 'dan')
      this.speed = 75
      this.frameRate = 18
      this.personagemLocal.stamina = 650
      this.personagemLocal.cansado = false

      this.tempoUltimoDano = 0
      this.invulneravel = false
      this.tempoInvulnerabilidade = 2000

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
          console.log(this.personagemLocal.x, this.personagemLocal.y)
          this.speed = 150
          this.frameRate = 25
          this.personagemLocal.movimento = 'correndo'
        })
        .on('pointerup', () => {
          this.speed = 75
          this.frameRate = 18
          this.personagemLocal.movimento = 'andando'
        })
        .depth = 100

      //Botão de Ação
      this.botaoAcao = this.add.sprite(750, 350, 'pista', 0, )
        .setInteractive()
        .setScrollFactor(0)
      this.botaoAcao.depth = 100

      //Animação do Cachimbo
      this.particulaAcaoLocal = this.physics.add.sprite(0, 0, 'fumaca', 0)
        .setVisible(false)
        .setActive(false)
      this.particulaAcaoLocal.depth = 100
      this.particulaAcaoLocal.movendo = false

      this.particulaAcaoRemota = this.add.image(this.personagemRemoto.x, this.personagemRemoto.y, 'bullet')
        .setDisplaySize(5, 5)
        .setTint(0xffff00)
        .setBlendMode(Phaser.BlendModes.ADD)
      this.particulaAcaoRemota.depth = 100

      this.botaoAcao.on('pointerdown', () => {

        //Acha a pista mais proxima
        let distancia_pista = 0
        let mais_proxima = 10000
        let sobra_pista = 0
        this.maisProximaAngulo = 0

        this.pistas.forEach((pista) => {
          if (pista.objeto.visible) {
            sobra_pista = 1
            distancia_pista = Phaser.Math.Distance.Between(this.personagemLocal.x, this.personagemLocal.y, pista.x, pista.y)

            if (distancia_pista < mais_proxima) {
              mais_proxima = distancia_pista
              this.maisProximaAngulo = Phaser.Math.Angle.Between(this.personagemLocal.x, this.personagemLocal.y, pista.x, pista.y)
            }
          }
        })

        if (!this.particulaAcaoLocal.visible) {
          this.botaoAcao.setFrame(1)
          this.personagemLocalAcao = true
          this.personagemLocal.setVelocity(0)

          this.personagemLocal.anims.play(`personagem-acao-${this.direcaoAtual}`, true)
          this.personagemLocal.anims.yoyo = true
          this.personagemLocal.on('animationcomplete', () => {
            this.personagemLocalAcao = false
            this.botaoAcao.setFrame(0)
          })

          if (this.particulaAcaoLocal.movendo == false) {
            this.particulaAcaoLocal.movendo = true

            this.time.delayedCall(1000, () => {
              this.personagemLocal.anims.pause()
              this.particulaAcaoLocal
                .setPosition(this.personagemLocal.x + Math.cos(this.ultimoAngulo) * 30, this.personagemLocal.y + Math.sin(this.ultimoAngulo) * 30)
                .setFrame(0)
                .setVisible(true)
                .setActive(true)
              this.time.delayedCall(150, () => {
                this.personagemLocal.anims.resume()
                this.particulaAcaoLocal.setVelocity(Math.cos(this.maisProximaAngulo) * 35 * sobra_pista, Math.sin(this.maisProximaAngulo) * 35 * sobra_pista)
              })
              this.time.delayedCall(1000, () => {
                this.particulaAcaoLocal.anims.play('fumaca-desfazendo')
                this.particulaAcaoLocal.on('animationcomplete', () => {
                  this.particulaAcaoLocal
                    .setVisible(false)
                    .setActive(false)
                    .setVelocity(0)
                    .movendo = false
                })
              })
            })
          }
        }
      })

      this.fantasmaRemoto = this.add.sprite(0, 0, 'fantasma')
      this.fantasmaRemoto.depth = 99


      //vida

      this.vidas = this.add.sprite(80, 30, 'vidas').setScrollFactor(0).setDisplaySize(90, 24)
      this.vidas.depth = 100

      var vidas = 0
      this.vidas.on('dano', () => {
        this.machucadoSom.play()
        if (vidas == 2) {
          console.log('morreu')
          // this.flagMorte = true
        } else {
          console.log(vidas)
          vidas += 1
          this.vidas.setFrame(vidas)
        }
      })

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

      this.personagemLocal = this.physics.add.sprite(1000, 1248, 'dan')
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
      this.botaoCorrida = this.add.sprite(700, 400, 'corrida', 0, )
        .setInteractive()
        .setScrollFactor(0)
        .on('pointerdown', () => {
          this.speed = 170
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
      this.botaoAcao = this.add.sprite(750, 350, 'tiro', 0, )
        .setInteractive()
        .setScrollFactor(0)
      this.botaoAcao.depth = 100

      //Animação de tiro
      this.particulaAcaoLocal = this.physics.add.image(0, 0, 'bullet')
        .setDisplaySize(5, 5)
        .setTint(0xffff00)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setSize(10, 10)
        .setVisible(false)
        .setActive(false)
      this.particulaAcaoLocal.depth = 100
      this.particulaAcaoLocal.movendo = false

      this.particulaAcaoRemota = this.add.sprite(0, 0, 'fumaca', 0)
      this.particulaAcaoRemota.depth = 99

      this.botaoAcao.on('pointerdown', () => {

        if (!this.particulaAcaoLocal.visible) {
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

          if (this.particulaAcaoLocal.movendo == false) {
            this.particulaAcaoLocal.movendo = true

            this.time.delayedCall(700, () => {
              this.cameras.main.shake(100, 0.02)
              this.particulaAcaoLocal
                .setPosition(this.personagemLocal.x, this.personagemLocal.y)
                .setVisible(true)
                .setActive(true)
                .setVelocity(Math.cos(this.ultimoAngulo) * 1000, Math.sin(this.ultimoAngulo) * 1000)

              this.time.delayedCall(100, () => {
                const frame_tiro = this.anims.get(`personagem-acao-${this.direcaoAtual}`).getFrameAt(8)
                this.personagemLocal.anims.setCurrentFrame(frame_tiro)
                this.personagemLocal.anims.reverse()
              })


              this.time.delayedCall(600, () => {
                this.particulaAcaoLocal
                  .setVisible(false)
                  .setActive(false)
                  .setVelocity(0)
                  .movendo = false
              })
            })
          }
        }
      })

      this.fantasma = this.physics.add.sprite(100, -100, 'fantasma').setVisible(false)
      this.fantasma.visivel = false
      this.fantasma.atacando = false

      this.time.delayedCall(1000, () => { //Primeiro fantasma >>>>> 60s
        this.fantasma.setPosition(this.personagemRemoto.x, this.personagemRemoto.y - 100)
        this.fantasmaAngulo = 0
        this.fantasmaDistancia = 150
        this.fantasma.visivel = true
        this.fantasma.atacando = true
      })

      this.physics.add.overlap(this.fantasma, this.particulaAcaoLocal, () => {

        this.fantasma.anims.play('fantasma-acertado', true).yoyo=true
        this.fantasma.on('animationcomplete', () => {
          this.fantasma.emit('invisivel')
        })
      })
      
      this.fantasma.on('invisivel', () => {
        this.fantasma.setPosition(-2000, -2000)
        this.fantasma.setFrame(0)
        this.fantasma.visivel = false
        
        this.time.delayedCall(3000, () => { //tempo de spawn dos fantasmas >>>> 30s
          this.fantasma.setPosition(this.personagemRemoto.x, this.personagemRemoto.y - 100)
          this.fantasmaAngulo = 0
          this.fantasmaDistancia = 150
          this.fantasma.visivel = true
          this.fantasma.atacando = true
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
        this.personagemRemoto.estaDentro = dados.personagem.estaDentro
        this.angleRemoto = dados.personagem.lanterna
      }

      if (dados.particula) {
        this.particulaAcaoRemota.x = dados.particula.x;
        this.particulaAcaoRemota.y = dados.particula.y;
        this.particulaAcaoRemota.visible = dados.particula.visivel
        this.particulaAcaoRemota.setFrame(dados.particula.frame);
      }

      if (dados.fantasma){
        if (!this.flagDentro) {
          this.fantasmaRemoto.x = dados.fantasma.x,
          this.fantasmaRemoto.y = dados.fantasma.y,
          this.fantasmaRemoto.visible = dados.fantasma.visivel
          this.fantasmaRemoto.setFrame(dados.fantasma.frame)
        } else {
          this.fantasmaRemoto.x = -2000,
          this.fantasmaRemoto.y = -2000,
          this.fantasmaRemoto.visible = false  
        }
      }

      if (dados.pistas) {
        this.pistas.forEach((pista, i) => {
          if (!dados.pistas[i].visible) {
            pista.objeto.disableBody(true, true)
          }
        })
      }
      if (dados.pistasEncontradas) {
        this.pistasRecebidas = dados.pistasEncontradas
        if (this.pistasRecebidas > this.pistasEncontradas) {
          this.pistasEncontradas = this.pistasRecebidas
          contador.text = `Pistas: ${this.pistasEncontradas} / 6`
        }
      }

      if (dados.flagMorte) {
        this.flagMorte = dados.flagMorte
      }
      if (dados.flagVenceu) {
        this.flagVenceu = dados.flagVenceu
      }
    };

    this.layerObjetos = this.tilemapMapa.createLayer('objetos', [this.tilesetArvores])
    this.layerTendas = this.tilemapMapa.createLayer('tendas', [this.tilesetTendas])

    // Desenha círculos ao redor dos tiles com propriedade meio == true
    this.layerTendas.forEachTile(tile => {
      if (tile.properties && tile.properties.lado === true) {
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();
        const tamanho = 80
        this.colisaoTenda = [
          this.physics.add.staticImage(worldX, worldY).setSize(tamanho*2,tamanho*2).setCircle(tamanho),
          this.physics.add.staticImage(worldX, worldY+64).setSize(tamanho,tamanho).setCircle(tamanho/2),
          this.physics.add.staticImage(worldX, worldY-48).setSize(tamanho + 16,tamanho + 16).setCircle((tamanho + 16)/2)
        ]

        this.physics.add.collider(this.personagemLocal, this.colisaoTenda)
      }
    });
    //Fisica do player
    this.cameras.main.startFollow(this.personagemLocal, true, 0.05, 0.05)
      .setBounds(
        0,
        0,
        1920, 
        1280)

    this.physics.world.setBounds(
      0,
      -16,
      1920, 
      1260)

    this.personagemLocal.setSize(40, 2)
    this.personagemLocal.setOffset(12, 6)
    this.personagemLocal.setCollideWorldBounds(true)

    this.layerObjetos.setCollisionByProperty({ collides: true })
    this.layerTendas.setCollisionByProperty({ collides: true })
    this.physics.add.collider(this.personagemLocal, [this.layerObjetos, this.layerTendas])

    this.imagemMascaraPersonagem = this.add.image(0, 0, 'mascaraPersonagem').setVisible(false)
    this.imagemMascaraLanterna = this.add.image(0, 0, 'mascaraLanterna').setVisible(false)
    this.imagemMascaraLanterna.setSize(512, 128)
    
    this.mascaraPersonagem = this.imagemMascaraPersonagem.createBitmapMask()
    this.mascaraPersonagem.invertAlpha=true
    
    this.mascaraLanterna = this.imagemMascaraLanterna.createBitmapMask()
    this.mascaraLanterna.invertAlpha=true

    this.layerSombras.setMask(this.mascaraLanterna)
    this.layerObjetos.setMask(this.mascaraPersonagem)
    this.layerTendas.setMask(this.mascaraPersonagem)

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

    //Animações dan correndo
    if (this.personagemLocal.texture.key == 'dan') {
      this.anims.create({
        key: 'dan-correndo-baixo',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 208, end: 220 }),
        frameRate: 18,
        repeat:-1
        })
      this.anims.create({
        key: 'dan-correndo-cima',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 221, end: 233 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 234, end: 246 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 247, end: 259 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-cima-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 260, end: 272 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-cima-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 273, end: 285 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-baixo-esquerda',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 286, end: 298 }),
        frameRate: 18,
        repeat: -1
      })
      this.anims.create({
        key: 'dan-correndo-baixo-direita',
        frames: this.anims.generateFrameNumbers(this.personagemLocal.texture.key, { start: 299, end: 311 }),
        frameRate: 18,
        repeat: -1
      })
    }

    this.anims.create({
      key: 'fumaca-desfazendo',
      frames: this.anims.generateFrameNumbers('fumaca', { start: 0, end: 4 }),
      frameRate: 6,
    })
    this.anims.create({
      key: 'fantasma-acertado',
      frames: this.anims.generateFrameNumbers('fantasma', {start: 0, end: 1}),
      frameRate: 12,
      repeat: 3
    })

    //Camada para escurecer o fundo
    this.noite = this.add.rectangle(960, 640, 1920, 1280, 0x472a66, 0.75)
    this.noite.setBlendMode(Phaser.BlendModes.MULTIPLY)
    this.noite.depth = 99

    //chuva
    this.particulaChuva = this.add.particles(0, -128, 'particula-chuva', {
      x: { min: this.personagemLocal.x - 1200, max: this.personagemLocal.x + 1200},
      quantity: 50, // mais gotas
      lifespan: 2000,
      speedY: { min: 900, max: 2200 }, // mais rápido
      speedX: { min: -120, max: 120 }, // vento lateral
      angle: { min: 85, max: 95 },
      scaleY: { min: 2.5, max: 5.5 }, // gotas maiores
      scaleX: { min: 0.5, max: 1 },
      alpha: { min: 0.7, max: 1 }, // mais opacas
      blendMode: 'ADD' // mais brilho
    })
      // .setScrollFactor(0)
      this.particulaChuva.depth = 99

    this.ponteiro = this.physics.add.image(this.personagemRemoto.x, this.personagemRemoto.y, 'ponteiro').setDisplaySize(80, 64)
    this.ponteiro.depth = 100

    this.joystick = this.plugins.get('rexvirtualjoystickplugin').add(this, {
      x: 100,
      y: 360,
      radius: 50, // Raio do joystick
      base: this.add.sprite(120, 360, 'joystick', 0, ),
      thumb: this.add.sprite(120, 360, 'joystick', 1, )
    })
    this.joystick.depth = 100

    this.telaCheia = this.add.sprite(778, 20, "tela-cheia", 0).setInteractive().on('pointerdown', () => {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
        this.telaCheia.setFrame(0);
      } else {
        this.scale.startFullscreen();
        this.telaCheia.setFrame(1);
      }
    })
      .setScrollFactor(0)
      .depth = 100

    // const entradaTendaE = this.physics.add.staticImage(288, 370).setSize(50, 50)
    const entradaTendaE = this.physics.add.staticImage(this.personagemRemoto.x, this.personagemLocal.y).setSize(50, 50)
    const saidaTendaE = this.physics.add.staticImage(350, 2080).setSize(50, 50)

    let flagFade = false

    this.physics.add.overlap(entradaTendaE, this.personagemLocal, () => {


      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);

          this.personagemLocal.setPosition(350, 2000)
          this.physics.world.setBounds(
            0,
            1450,
            1920,
            1280
          )
          this.cameras.main.setBounds(
            -50,
            1450,
            260,
            680
          )

          this.flagDentro = true

          if (this.personagemLocal.texture.key == 'ernesto') {
            this.lanternaLocal.setTint(0x2d2d96).setDisplaySize(320, 128)
            this.imagemMascaraLanterna.setDisplaySize(320, 128)
            this.lanternaRemota.setVisible(false)
          }

          if (this.personagemLocal.texture.key == 'dan') {
            this.lanternaLocal.setVisible(false)
            this.lanternaRemota.setTint(0x2d2d96).setDisplaySize(320, 128)
            this.imagemMascaraLanterna.setDisplaySize(0, 0)
          }

          flagFade = false

          this.ponteiro.setVisible(false)
          this.fantasmaSom.stop()
          this.trilha.stop()
          this.chuvaSom.stop()
          this.chuvaInteriorSom.play()
        })

        this.particulaChuva.quantity = 0

      }
    })

    this.physics.add.overlap(saidaTendaE, this.personagemLocal, () => {

      if (!flagFade) {
        this.cameras.main.fadeOut(1000)
        flagFade = true

        this.cameras.main.on('camerafadeoutcomplete', () => {
          this.cameras.main.fadeIn(1200);

          this.personagemLocal.setPosition(288, 400)
          this.physics.world.setBounds(
            0,
            -16,
            1920,
            1260
          )
          this.cameras.main.setBounds(
            0,
            0,
            1920,
            1280
          )

          this.flagDentro = false

          if (this.personagemLocal.texture.key == 'ernesto') {
            this.lanternaLocal.setTint(0xfffabe).setDisplaySize(512, 128)
            this.imagemMascaraLanterna.setDisplaySize(512, 128)
            this.lanternaRemota.setVisible(true)
          }

          if (this.personagemLocal.texture.key == 'dan') {
            this.lanternaLocal.setVisible(true)
            this.lanternaRemota.setTint(0xfffabe).setDisplaySize(512, 128)
            this.imagemMascaraLanterna.setDisplaySize(512, 128)
          }

          flagFade = false

          this.ponteiro.setVisible(true)
          this.trilha.play()
          this.chuvaSom.play()
          this.chuvaInteriorSom.stop()
        })

        this.particulaChuva.quantity = 50

      }
    })

  }

  update() {

    const angle = Phaser.Math.DegToRad(this.joystick.angle) // Converte o ângulo para radianos
    const force = this.joystick.force

    // Acha o aungulo mais próximo da direção do joystick
    let o = 0
    if (this.joystick.angle < 0) {
      o = (this.joystick.angle % 360 + 360) % 360;
    } else {
      o = this.joystick.angle
    }
    const closest = (arr, n) => arr.sort((a, b) => Math.abs(a - n) - Math.abs(b - n))[0];
    this.direcao = closest([0, 45, 90, 135, 180, 225, 270, 315, 360], o)

    if (angle != 0) {
      this.ultimoAngulo = angle
    }

    if ((this.personagemLocal.movimento == 'andando' && this.personagemLocal.stamina != 650)) {
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

    this.lanternaRemota.setPosition(this.personagemRemoto.x, this.personagemRemoto.y + 15)
    this.lanternaRemota.setRotation(this.angleRemoto)

    this.lanternaLocal.setPosition(this.personagemLocal.x, this.personagemLocal.y + 15)
    this.lanternaLocal.setRotation(this.ultimoAngulo)

      let pathFinder = Phaser.Math.Angle.Between(this.ponteiro.x, this.ponteiro.y, this.personagemRemoto.x, this.personagemRemoto.y)

      this.ponteiro.setRotation(pathFinder)

      const indicadorX = Math.round(Math.cos(pathFinder) * 120)
      const indicadorY = Math.round(Math.sin(pathFinder) * 120)

      const dist = Phaser.Math.Distance.Between(
        this.ponteiro.x, this.ponteiro.y,
        this.personagemRemoto.x, this.personagemRemoto.y
      )

      const modDistancia = (dist / 30)
      this.ponteiro.setDisplaySize(80 - modDistancia, 64 - modDistancia)

      if (dist < 10) {
        this.ponteiro.setVelocity(0, 0);
      } else {
        this.ponteiro.setVelocity(indicadorX, indicadorY)
      }
      
      const cam = this.cameras.main;
      const left = cam.worldView.left;
      const top = cam.worldView.top;
      const right = cam.worldView.right;
      const bottom = cam.worldView.bottom;
      
      const remotoNaTela =
      this.personagemRemoto.x >= left &&
      this.personagemRemoto.x <= right &&
      this.personagemRemoto.y >= top &&
      this.personagemRemoto.y <= bottom;
      
      if (!remotoNaTela) {
        this.ponteiro.setVisible(true)
        .setActive(true)
      } else {
        this.ponteiro.setVisible(false)
        .setActive(false)
      }
      this.ponteiro.y = Phaser.Math.Clamp(this.ponteiro.y, top + 50, bottom - 50);
      this.ponteiro.x = Phaser.Math.Clamp(this.ponteiro.x, left + 50, right - 50);

    if (this.personagemLocal.texture.key == 'dan' && this.fantasma.atacando) {
      
      Phaser.Math.RotateAroundDistance(this.fantasma, this.personagemRemoto.x, this.personagemRemoto.y, this.fantasmaAngulo, this.fantasmaDistancia);
      this.fantasmaAngulo = Phaser.Math.Angle.Wrap(this.fantasmaAngulo + 0.00003);
      this.fantasmaDistancia -= 0.1

      if (this.fantasmaDistancia < 5) {
        this.fantasma.atacando = false
        this.fantasma.emit('invisivel')
      }
    }

      if (this.personagemLocal.texture.key == 'ernesto') {

      const agora = this.time.now;
      const distancia = Phaser.Math.Distance.BetweenPoints(this.personagemLocal, this.fantasmaRemoto);

      if (this.fantasmaRemoto.visible &&
        distancia < 10 && // tolerância de colisão
        !this.invulneravel
      ) {
        this.vidas.emit('dano');
        this.invulneravel = true;
        this.tempoUltimoDano = agora;
      }

      if (this.invulneravel && agora - this.tempoUltimoDano > this.tempoInvulnerabilidade) {
        this.invulneravel = false;
}

        if (this.fantasmaRemoto.visible && !this.fantasmaSom.isPlaying && !this.flagDentro) {
          this.fantasmaSom.play()
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
      this.cameras.main.followOffset.setTo(- velocityX, - velocityY)
      this.areaColeta.setPosition(this.personagemLocal.x, this.personagemLocal.y)
      
      this.imagemMascaraPersonagem.setPosition(this.personagemLocal.x, this.personagemLocal.y)
      this.imagemMascaraLanterna.setPosition(this.personagemLocal.x, this.personagemLocal.y + 15)
      this.imagemMascaraLanterna.setRotation(this.ultimoAngulo)

      this.barraStamina.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaFundo.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)
      this.barraStaminaMeio.setPosition(this.personagemLocal.x - ((Math.cos(angle) * 30)), this.personagemLocal.y + (Math.abs(Math.cos(angle) * 30)) - 70)

      //Altera pitch dos passos
      let Modulado = Math.floor(Math.random() * (2200 - 0 + 1));
      this.passosSom.setDetune(Modulado)
      this.passosMadeiraSom.setDetune(Modulado)

      this.frameAtual = this.personagemLocal.anims.currentFrame.index;
      const pesNoChao = [4, 10]
      if (pesNoChao.includes(this.frameAtual) && this.personagemLocalAcao == false) {
        if (!this.flagDentro) {
          this.passosSom.play()
        } else {
          this.passosMadeiraSom.play()
        }
      }


      //Animações somente para o Dan
      if (this.personagemLocal.texture.key == 'dan' && this.personagemLocal.movimento == 'correndo') {

        switch (this.direcao) {
          case 0:
            this.personagemLocal.anims.play('dan-correndo-direita', true)
            this.direcaoAtual = 'direita'
            break
          case 45:
            this.personagemLocal.anims.play('dan-correndo-baixo-direita', true)
            this.direcaoAtual = 'baixo-direita'
            break
          case 90:
            this.personagemLocal.anims.play('dan-correndo-baixo', true)
            this.direcaoAtual = 'baixo'
            break
          case 135:
            this.personagemLocal.anims.play('dan-correndo-baixo-esquerda', true)
            this.direcaoAtual = 'baixo-esquerda'
            break
          case 180:
            this.personagemLocal.anims.play('dan-correndo-esquerda', true)
            this.direcaoAtual = 'esquerda'
            break
          case 225:
            this.personagemLocal.anims.play('dan-correndo-cima-esquerda', true)
            this.direcaoAtual = 'cima-esquerda'
            break
          case 270:
            this.personagemLocal.anims.play('dan-correndo-cima', true)
            this.direcaoAtual = 'cima'
            break
          case 315:
            this.personagemLocal.anims.play('dan-correndo-cima-direita', true)
            this.direcaoAtual = 'cima-direita'
            break
          case 360:
            this.personagemLocal.anims.play('dan-correndo-direita', true)
            this.direcaoAtual = 'direita'
            break
        }
      } else {
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
      }

    } else {
      // Se a força do joystick for baixa, o personagem para
      if (this.personagemLocalAcao != true) {
        this.personagemLocal.setVelocity(0)
        this.personagemLocal.anims.play(`personagem-parado-${this.direcaoAtual}`, true)
      }
    }

    try {
      if (this.game.dadosJogo.readyState === "open") {
        if (this.personagemLocal && this.pistas) {
          this.game.dadosJogo.send(
            JSON.stringify({
              personagem: {
                x: this.personagemLocal.x,
                y: this.personagemLocal.y,
                frame: this.personagemLocal.frame.name,
                lanterna: this.ultimoAngulo,
                estaDentro: this.flagDentro
              },
              particula: {
                x: this.particulaAcaoLocal.x,
                y: this.particulaAcaoLocal.y,
                frame: this.particulaAcaoLocal.frame.name,
                visivel: this.particulaAcaoLocal.visible
              },
              pistas: this.pistas.map(pista => ({ visible: pista.objeto.visible })),
              pistasEncontradas: this.pistasEncontradas
            })
          );
        }
        if (this.fantasma) {
          this.game.dadosJogo.send(
            JSON.stringify({
              fantasma:{
                x: this.fantasma.x,
                y: this.fantasma.y,
                visivel: this.fantasma.visivel,
                frame: this.fantasma.frame.name
              },
            })
          )
        }

        if (this.flagMorte) {
          this.game.dadosJogo.send(
            JSON.stringify({
              flagMorte: this.flagMorte
            })
          )
        }
        if (this.flagVenceu) {
          this.game.dadosJogo.send(
            JSON.stringify({
              flagVenceu: this.flagVenceu
            })
          )
        }
      }
    } catch (error) {
      console.error(error);
    }
    
    if (this.flagMorte == true) {
      this.sound.stopAll()
      this.scene.stop()
      this.scene.start('GameOver')
    }
    if (this.flagVenceu == true) {
      this.sound.stopAll()
      this.scene.stop()
      this.scene.start('Win')
    }
  }
}
