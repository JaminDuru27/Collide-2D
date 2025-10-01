import { ParralaxBG } from "./parallaxbg.js"
import { Player } from "./player.js"
import { TextHandler } from "./textHandler.js"

export function Game(){
    const res = {
        load(){
            this.ranDistance = 0
            this.runDistInterval = 1000
            this.updateDistance() 
            this.prepC()
            this.handleControls()
            this.textHandler = TextHandler()
            setTimeout(()=>{this.textHandler.add(0)}, 4000)
            this.player = Player(this)
            this.bgs = ParralaxBG([
                document.querySelector(`.layer1`),
                document.querySelector(`.layer2`),
                document.querySelector(`.layer3`),
                document.querySelector(`.layer4`),
                document.querySelector(`.layer5`),
                document.querySelector(`.layer6`),
            ], this, {x: 300, y: 0})
        },
        updateDistance(){
            if(this.distdiv)this.distdiv.remove()
            const div = document.createElement(`div`)
            this.distdiv = div
            div.textContent = `Distance ${this.ranDistance} (m)`
            div.classList.add(`dist`)
            document.body.querySelector(`main`).append(div)
        },
        handleControls(){
            if(`ontouchstart` in window){
                this.controls = phoneControls()
            }else this.controls = laptopControls()
        },
        prepC(){
            this.canvas = document.querySelector(`.canvas`)
            this.ctx = this.canvas.getContext(`2d`)
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
        },
        render(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.bgs.update()
            this.player.update()
        }
    }
    res.load()
    return res
}

export function phoneControls(){
    const res = {
        runright:[], runleft: [],
        jump: [], attack: [],
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`joystick`)
            document.querySelector(`main`).append(this.element)
        },
        load(){
            this.ui()
            this.events()
        },
        addEvent(ev, callback){
            if(ev === `runright`)this.runright.push(callback)
            else if(ev === `runleft`) this.runleft.push(callback)
            else if(ev === `jump`) this.jump.push(callback)
            else if(ev === `attack`) this.attack.push(callback)
        },
        events(){
            this.element.ontouchstart = ()=>{
                this.clicking = true
                // this.arraydown.forEach(c=>c(this))
            }
            this.element.ontouchend = ()=>{
                this.clicking = false
                // this.arrayup.forEach(c=>c(this))
            }
        }
    }
    res.load()
    return res
}
export function laptopControls(){
    const res = {
        runright:[], runleft: [],
        jump: [], attack: [], keyup:[],
        load(){
            this.events()
        },
        addEvent(ev, callback){
            if(ev === `runright`)this.runright.push(callback)
            else if(ev === `runleft`) this.runleft.push(callback)
            else if(ev === `jump`) this.jump.push(callback)
            else if(ev === `attack`) this.attack.push(callback)
            else if(ev === `keyup`) this.keyup.push(callback)
        },
        events(){
            window.onkeydown = (e)=>{
                this.clicking = true
                if(e.key === `ArrowLeft`)this.runleft.forEach(c=>c(this))
                if(e.key === `ArrowRight`)this.runright.forEach(c=>c(this))
                if(e.key === `ArrowUp`)this.jump.forEach(c=>c(this))
                if(e.key === `a`)this.attack.forEach(c=>c(this))
                if(e.key === `SpaceBar`)this.attack.forEach(c=>c(this))
            }
            window.onkeyup = ()=>{
                this.clicking = false
                this.keyup.forEach(c=>c(this))
            }
        }
    }
    res.load()
    return res
}