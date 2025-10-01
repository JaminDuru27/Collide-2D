import { Rect } from "./rect.js"
import { Sprite } from "./sprite.js"

export function Player(game){
    const res = {
        x: 20, y: 20, 
        w: 140, h: 140,
        load(){
            this.clips   = {
                'Idle': {sx: 0, sy: 3},
                'Run':{sx: 17,sy: 31},
                'Jump':{sx: 17,sy: 18},
                'Roll':{sx: 39,sy: 47},
                'Hit':{sx: 47,sy: 51},
                'Death':{sx: 54,sy: 59,}
            }
            this.sprite = Sprite(this,game, document.querySelector(`.player`), 8, 8)
            this.sprite.playclip(`Idle`)
            this.rect = Rect(this)
            game.controls.addEvent(`runleft`,()=>{
                if(game.ranDistance <= 0){
                    this.sprite.playclip('Idle')
                    this.rect.vx = 0
                    game.bgs.stop()
                    return
                }
                res.rect.vx = -5
                this.sprite.delay.set(2)
                this.sprite.playclip('Run')
                game.ranDistance -= 5
                game.updateDistance()
                game.bgs.scrollLeft()
                if(game.ranDistance % 1000 === 0 ){
                    game.textHandler.add(Math.floor(game.ranDistance/1000), 1500)
                }
            })
            game.controls.addEvent(`runright`,()=>{
                if(game.ranDistance >= game.textHandler.temps.length * game.runDistInterval){
                    this.sprite.playclip('Idle')
                    this.rect.vx = 0
                    game.bgs.stop()
                    return
                }
                this.rect.vx = 5
                this.sprite.delay.set(2)
                this.sprite.playclip('Run')
                game.ranDistance += 5
                game.updateDistance()
                game.bgs.scrollRight()
                if(game.ranDistance % 1000 === 0 ){
                    game.textHandler.add(Math.floor(game.ranDistance/1000), 1500)
                }
            })
            let count = 0
            game.controls.addEvent(`attack`, ()=>{
                count ++
                if(count <= 20){
                    this.sprite.delay.set(1)
                    this.sprite.playclip('Roll')
                    this.rect.vx = 15
                    game.bgs.speed = 1.5
                    game.bgs.scrollRight()
                    game.ranDistance += 10
                    game.updateDistance()
                }
                if(count > 10) {
                    this.rect.vx = 0
                    this.sprite.playclip('Run')
                    game.bgs.speed = 1
                }
            })
            game.controls.addEvent(`keyup`, ()=>{
                this.rect.vx = 0
                this.sprite.delay.set(10)
                this.sprite.playclip('Idle')
                this.rect.vx = 0
                count = 0
                game.bgs.stop()
            })

            game.controls.addEvent(`jump`,()=>{
                if(this.rect.vy !== 0) return
                this.rect.vy = -15
                this.sprite.delay.set(10)
                this.sprite.playclip('Jump')
            })
        },
        update(){
            this.sprite.update()
            this.rect.update()
        }
    }
    res.load()
    return res
}