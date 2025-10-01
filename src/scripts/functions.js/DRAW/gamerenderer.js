import { domextract } from "../../components/DRAW/domextract.js"
import { GameUI } from "../../components/DRAW/gamerendererui.js"
import { Panner } from "../../components/DRAW/panner.js"
import { ImageLayers } from "./backgroundLayers.js"
import { Enemy } from "./enemy.js"
import { EventHandler, events } from "./events.js"
import { getCanvas } from "./getCanvas.js"
import { draw } from "./instances.js"
import { KeyBinder } from "./keybinder.js"
import { Player } from "./player.js"
import { World } from "./world.js"

export function GameRenderer(){
    const res = {
        ui: UI(),
        sx: 1, sy: 1,
        tx: 0, ty: 0,
        cw: 50, ch: 50,
        nx: 70, ny: 70,
        w: 1000, h: 1000,
        collisionbodies: [],
        load(){
            this.keybinder = KeyBinder()
            this.world = World(this)
            this.bg = ImageLayers(this)
            this.player = Player(this)
            this.getCanvas = getCanvas(this.ui.dom.canvas, this)
            this.panner = Panner(this)
            this.GameOptions = GameUI(this, this.ui.element)
            for(let x = 0; x<= 5; x++){
                this[`Enemy${x}`] = Enemy(this)
            }
        },
        updateSize(){
            this.w = this.nx * this.cw
            this.h = this.ny * this.ch
        },
        clipT(){
            if(this.tx > 0)this.tx = 0
            if(this.ty > 0)this.ty = 0
            if(this.tx < -this.w +window.innerWidth)this.tx = -this.w + window.innerWidth
            if(this.ty < -this.h + window.innerHeight)this.ty = -this.h + window.innerHeight
        },
        render(){
            this.getCanvas.clear()
            this.ctx.save()
            this.clipT()
            this.ctx.translate(this.tx, this.ty)
            this.ctx.scale(this.sx, this.sy)
            for(let x in this){
                if(this[x].update)this[x].update({ctx: this.ctx, renderer: this})
            }
            this.clipT()
            this.updateSize()
            this.ctx.restore()
        }
    }
    res.load()
    return res
}

export function UI(){
    const res = {
        style(){return `z-index: 20;position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; background: #500a34; border-radius: 15px; border: 2px solid #e91e63;`},
        canvasstyle(){return `width: 100%; height: 100%; background: black; `},
        exitstyle() { return `position: absolute; top: .5rem; left: .5rem;width: 1.4vw;height: 1.4vw;opacity: .5;` },
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.classList.add(`gamepreview`)
            this.element.innerHTML += `
            <div class = 'exit' style='${this.exitstyle()}'></div>
            <canvas class = 'canvas' style='${this.canvasstyle()}'></canvas>
            `
            document.body.append(this.element)
            domextract(this.element, 'classname', this)
        },
        load(){
            this.ui()
            this.events()
        },
        remove(){
            this.element.remove()
            if(draw.instance.gameRenderer){
                draw.instance.gameRenderer = {render(){}}
            }
        },
        events(){
            EventHandler(this.dom.exit, 'exit', 'click', ()=>{
                this.remove()
            })
        },
        update(){
            
        }
    }
    res.load()
    return res
}



