import { EventHandler } from "../../functions.js/DRAW/events.js"
import { getCanvas } from "../../functions.js/DRAW/getCanvas.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { domextract } from "./domextract.js"
import { makedraggable } from "./makedraggable.js"

export function Preview({to, canvas, appendList = [], Instance}){
    const res ={
        sizeScale : .3,
        tx: 0, ty: 0, scale: 1,
        inc: .4,
        style(){return `border: 2px solid #e91e63;border-radius: .5rem;width: 200px;height: 200px;z-index: 4;background: #500a34;position: absolute;top: 0;left: 0;`},
        titleStyle(){return `max-height: 3rem;background: #00000026;color: white;height: 30px;display: flex;justify-content: flex-start;align-items: center; padding: 0 .2rem;`},
        canvasStyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`preview`)
            this.element.setAttribute('style', this.style())
            this.element.innerHTML += `
            <div class='title' style='${this.titleStyle()}'>Preview</div>
            <canvas class='canvas' style = '${this.canvasStyle()}'></canvas>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
            this.sizeUpdate()
            this.getcanvas = getCanvas(this.dom.canvas, this)
            this.drag = makedraggable(this.element)
            this.appendListEvents()
        },
        appendListEvents(){
            this.element.ondrag = []
            this.element.ondragend = []
            this.element.ondrag.push(()=>{
                appendList.forEach(elem=>{
                    let ghost
                    const element = document.querySelector(`.${elem.classList[0]}`)
                    if(this.drag.checkcollisionwith(element)){
                        this.ghost = this.appendGhosts(element)
                    }else{
                        if(this.ghost)this.ghost.remove()
                    }
                })
            })
            this.element.ondragend.push(()=>{
                if(this.ghost){
                    if(this.ghost.parentElement){
                        this.ghost.parentElement.append(this.element)
                        this.element.lastElement = this.ghost.parentElement
                        this.element.stopscaling = true
                    }
                    this.element.setAttribute(`style`, this.style()+ `z-index:5;position: relative; left: 50%; transform: translateX(-50%);margin-top: 1rem`)
                    this.sizeUpdate()
                    this.drag.stopX = true
                    this.drag.stopY = true
                }
                if(this.ghost)this.ghost.remove()
            })
            EventHandler(this.dom.title, ``,  `click`, ()=>{
                if(this.element?.lastElement)
                if(this.element?.lastElement?.querySelector(`.preview`))
                document.body.append(this.element)
                this.element.setAttribute('style', this.style())
                this.sizeUpdate()
                this.drag.stopX =false
                this.drag.stopY = false
                this.element.stopscaling = false

            })
        },
        appendGhosts(element){
            if(this.ghost)this.ghost.remove()
            const div = document.createElement(`div`)
            this.ghost = div
            div.setAttribute(`style`, this.style()+ `opacity: .5; position: relative; left: 50%; transform: translateX(-50%);`)
            div.classList.add(`ghost`)
            div.style.width = element.getBoundingClientRect().width
            div.style.height = element.getBoundingClientRect().height
            element.append(div)
            function remove(){div.remove()}
            return div
        },
        sizeUpdate(){
            const cw = canvas.width * this.sizeScale
            const ch = canvas.height * this.sizeScale
            let th = ch * .36
            //clip to a max of 48px
            th = Math.max(0, Math.min(th, 48))

            //update title height dynamically
            this.dom.title.style.height = th + `px`
            //update preview size dynamically
            this.element.style.width = cw + `px`
            this.element.style.height = ch +th + `px`
            //update canvas size dynamically
            this.dom.canvas.width = cw
            if(!this.dom.canvas.initwidth)this.dom.canvas.width = cw
            if(!this.dom.canvas.initheight)this.dom.canvas.height = cw
            this.dom.canvas.height = ch
        },
        update(){
            canvas = draw.instance.ui.ctx.canvas
            this.getcanvas.clear()
            this.ctx.save()
            this.ctx.translate(this.tx, this.ty)
            this.ctx.lineWidth = 5
            this.ctx.restore()
            this.ctx.drawImage(canvas, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.scale(this.scale, this.scale)
        },
        shortcuts(){
        },
        events(){
            let key = null
            let lastScroll = window.scrollY
            const grid = Instance.grid 
            EventHandler(window, '', 'keydown', (e)=>{
                key = e.key

            })
             EventHandler(window, '', 'keyup', (e)=>{
                key = null
            })
            EventHandler(this.element, '', 'wheel', (e)=>{
                if(key === `z` && !this.element.stopscaling){
                    const direction = e.deltaY > 0 ? 'down': e.deltaY < 0 ? `up` : 'none'
                    this.sizeScale = (direction === `up`) ? this.sizeScale + .05 : this.sizeScale - .05
                    this.sizeScale = Math.max(0, Math.min(this.sizeScale, 1))
                    this.sizeUpdate()
                }else{
                    const direction = e.deltaY > 0 ? 'down': e.deltaY < 0 ? `up` : 'none'
                    grid.zoom = (direction === `up`) ? grid.zoom + this.inc : grid.zoom - this.inc
                    grid.updatezoom()
                }
                
            })
        },
        load(){ 
            
        }
    }
    res.load()
    return res
}