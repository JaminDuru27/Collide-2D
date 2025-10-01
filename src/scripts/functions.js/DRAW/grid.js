import { GUI } from "./gui.js"
import {EventHandler} from './events.js';

export function Grid(Instance){
    const res = {
        opacity:1,
        x: 0, y: 0,
        lineWidth: 1,
        nx: 40, ny: 20,
        cw: 20, ch: 20,
        translatedisplacement: 2,
        allowtranslate: true,
        init: {
            cw: 20,x: 0, ny: 40,
            ch: 20,y: 0, nx : 20
        },
        alwayscenter: true,
        zoom: 1,
        color: '#000', showgrid: false,
        bgColor: '#a50c6845', showbg: false,
        load(){
            this.populate()
        },
        ui(){
            this.center()
        },
        events(){
          EventHandler(window, '', 'resize', ()=>{
            if(this.alwayscenter)
            this.center()
          })
          let inc = 5
          let vel = 0
          let axis = `y` 
          EventHandler(Instance.ui.ctx.canvas, 'wheel translate', 'wheel', (e)=>{
              if(e.deltaY > 0) vel = -this.translatedisplacement * 2
              if(e.deltaY < 0) vel = this.translatedisplacement * 2
              this[axis] += vel
              this.populate()
          })
          EventHandler(window, `setAxisForWhellTranlate`, `keydown`,(e)=>{if(e.key === `x`) axis = `x`})
          EventHandler(window, `setAxisForWhellTranlate`, `keyup`,(e)=>{axis = `y`})
            let dx, dy
            EventHandler(Instance.ui.ctx.canvas, `clickecit`, `mouseleave`, (e)=>{
                dx = null
                dy = null
            })
            EventHandler(Instance.ui.ctx.canvas, 'clicktranslate', 'mousedown', (e) => {
                if(e.button !== 2)return
                dx = e.clientX - this.x
                dy = e.clientY - this.y
            })
            EventHandler(Instance.ui.ctx.canvas, 'drawtranslate', 'mousemove', (e) => {
                if(!this.allowtranslate)return
                if(!dx && !dy)return
                const x  = e.clientX
                const y  = e.clientY
                this.x = x - dx
                this.y = y - dy
                this.populate()
            })
            EventHandler(Instance.ui.ctx.canvas, 'trabslatestop', 'mouseup', (e) => {
                dx = null
                dy = null
            })
        },
        shortcuts(){
            const next=()=>{
                this.alwayscenter = false
                document.querySelector(`.alwayscenter20`).checked = this.alwayscenter
                this.populate()
            }
            Instance.shortcuts.add('incnumber', ['x', '-', Instance.ui.ctx.canvas], ()=>{
                this.nx -= 1    
                this.init.nx = this.nx
                this.populate()
            }, true)
            Instance.shortcuts.add('incnumber', ['y', '-', Instance.ui.ctx.canvas], ()=>{
                this.ny -= 1    
                this.init.ny = this.ny
                this.populate()
            }, true)
            Instance.shortcuts.add('incnumber', ['x', '=', Instance.ui.ctx.canvas], ()=>{
                this.nx += 1   
                this.init.nx = this.nx
                this.populate()
            }, true)
            Instance.shortcuts.add('incnumber', ['y', '=', Instance.ui.ctx.canvas], ()=>{
                this.ny += 1   
                this.init.ny = this.ny 
                this.populate()
            }, true)
            Instance.shortcuts.add('translate', ['z','o', Instance.ui.ctx.canvas], ()=>{
                this.zoom += .05    
                this.updatezoom()
                document.querySelector(`.zoomGrid22`).value = this.zoom
            }, true)
            Instance.shortcuts.add('translate', ['z','i', Instance.ui.ctx.canvas], ()=>{
                this.zoom -= .05
                this.updatezoom()
                document.querySelector(`.zoomGrid22`).value = this.zoom
            }, true)
            Instance.shortcuts.add('translate', ['ArrowUp', Instance.ui.ctx.canvas], ()=>{
                this.y -= this.translatedisplacement
                if(Instance.select.sy)Instance.select.sy -= this.translatedisplacement
                next()
            }, true)
            Instance.shortcuts.add('translate', ['ArrowDown', Instance.ui.ctx.canvas], ()=>{
                this.y += this.translatedisplacement
                if(Instance.select.sy)Instance.select.sy += this.translatedisplacement
                next()
            }, true)
            Instance.shortcuts.add('translate', ['ArrowLeft', Instance.ui.ctx.canvas], ()=>{
                this.x -= this.init.x + this.translatedisplacement
                if(Instance.select.sx)Instance.select.sx -= this.translatedisplacement
                next()
            }, true)
            Instance.shortcuts.add('translate', ['ArrowRight', Instance.ui.ctx.canvas], ()=>{
                this.x += this.translatedisplacement
                if(Instance.select.sx)Instance.select.sx += this.translatedisplacement
                next()
            }, true)
        },
        gui(){
            this.guifolder = GUI('Grid', Instance.ui.dom.leftside)
            this.guifolder.add(this, 'nx', 'nx', [2, 100]).after = ()=>{
                this.populate()
                this.center()
                this.updateinit()
            }
            this.guifolder.add(this, 'ny', 'ny', [2, 100]).after = ()=>{
                this.populate()
                this.center()
                this.updateinit()
            }
            const zoom =  this.guifolder.add(this, 'zoom', 'zoom', [1, 10, 0.01])
            zoom.className = 'zoomGrid22'
            zoom.after = (e)=>{
                this.updatezoom()
            }
            const ac = this.alwayscentergui = this.guifolder.add(this, 'alwayscenter', 'always center')
            ac.className = 'alwayscenter20'
            ac.after = (e)=>{
                this.alwayscenter = e.value
                this.center()
            }
            this.guifolder.add(this, 'center', 'center').before = ()=>{
                this.alwayscenter = true
                this.center()
                this.alwayscenter = false
            }
            this.guifolder.add(this, 'opacity', 'opacity', [0, 1, 0.01])
            this.guifolder.add(this, 'color', 'color').after = (e)=>{
                this.color = e.value
            }
            const orprops = this.guifolder.addFolder('Orientation Props')
            
            orprops.add(this, 'ch', 'cw', [1, 10, 0.01])
            orprops.add(this, 'ch', 'ch', [1, 10, 0.01])
            orprops.add(this, 'showgrid', 'show grid', [1, 10, 0.01])
            orprops.add(this, 'showbg', 'show bg', [1, 10, 0.01])
        },
        updateinit(){
            this.init = {
                cw: this.cw,x: this.x, ny: this.ny,
                ch: this.ch,y: this.y, nx : this.nx
            }
        },
        populate(){
            this.boxes = []
            this.w = this.cw * this.nx
            this.h = this.ch * this.ny
            for(let y = 0; y< this.ny; y++){
                let array = []
                for(let x = 0; x< this.nx; x++){
                    const bx = {
                        x: this.x + this.cw * x, 
                        y: this.y + this.ch * y,
                        w: this.cw, h: this.ch,
                        indx : x, indy: y
                    }
                    array.push(bx)
                }
                if(array.length > 0){
                    this.boxes.push(array)
                    array = []
                }
            }
            this.boxesFlat = this.boxes.flat()
        },
        updatezoom(){
            this.cw = this.init.cw * this.zoom
            this.ch = this.init.ch * this.zoom
            this.populate()
            this.center()
        },
        center(){
            if(!this.alwayscenter)return
            const w = this.cw * this.nx
            const h = this.ch * this.ny
            const canvas = Instance.ui.dom.canvas
            this.x = canvas.width / 2 - (w /2)
            this.y = canvas.height / 2 - (h /2)
            this.populate()
        },
        draw(ctx){
            //SHOWING BOUND
            if(!this.showbg && !this.showgrid){
                ctx.save()
                ctx.strokeStyle = '#ffffff1f'
                ctx.lineWidth = 2
                ctx.setLineDash([0, 0])
                ctx.strokeRect(this.x,this.y, this.w, this.h)
                ctx.restore()
            }

            //SHOWING BG
            if(this.showbg){
                ctx.fillStyle = this.bgColor
                ctx.fillRect(this.x,this.y, this.w, this.h)
                ctx.globalAlpha = 1
            }
            //SHOWING GRID
            if(this.showgrid){
                this.boxesFlat.forEach(col=>{
                    ctx.beginPath()
                    ctx.lineWidth = this.lineWidth
                    ctx.setLineDash([3,4])
                    ctx.strokeStyle = this.color
                    ctx.globalAlpha = this.opacity
                    ctx.strokeRect(col.x, col.y, col.w, col.h)
                    ctx.closePath()
                    ctx.globalAlpha = 1
                })
            }
        },
        update({ctx}){
            this.draw(ctx)
        }
    }
    res.load()
    return res
}