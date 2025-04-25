import config from './config.js'
import abertura from './abertura.js'
import preload from './preload.js'
import sala from './sala.js'
import fase1 from './fase1.js'
import Win from './Win.js'
import GameOver from './GameOver.js'

class Game extends Phaser.Game {
  constructor () {
    super(config)

    this.scene.add('abertura', abertura)
    this.scene.add('preload', preload)
    this.scene.add('sala', sala)
    this.scene.add('fase1', fase1)
    this.scene.add('Win', Win)
    this.scene.add('GameOver', GameOver)
    this.scene.start('fase1')
  }
}



window.onload = () => {
  window.game = new Game()
}
