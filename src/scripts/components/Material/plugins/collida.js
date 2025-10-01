import { drop, update } from "lodash"
import { domextract } from "../../DRAW/domextract"
import { CollidaObject } from "../../../functions.js/Material/plugins/collida"
import { makedraggable } from "../../DRAW/makedraggable"

export function Collida(){
    const res= {
        name: 'Collida',
        style(){return`width: 100%;height: 100%;background: #0a011b;color: #fff;display: flex;justify-content: space-between;align-items: center;overflow: hidden;`},
        btnstyle(){return `cursor:pointer;s padding: .5rem .2rem;border: 1px solid #ffffff54;border-radius: .5rem;font-size: .7rem;display: flex;justify-content: center;align-items: center;color: #ffffff94;`},
        leftstyle(){return `overflow: hidden scroll; gap: .5rem;display: flex;justify-content: space-between;align-items: center;flex-direction: column;padding: .5rem;background: #ffffff0f;width: 30%;height: 100%;`},
        canvasstyle(){return `width: 100%; height: 100%;`},
        rightstyle(){return ` width: 70%;height: 100%;position: relative;`},
        rectdiv(){return`width: 100%; display: flex;justify-content: space-between;align-items: flex-start;flex-direction: column;background: #0c011b;padding: .5rem .2rem;gap: .5rem;border-radius: .5rem;border: 1px solid #190536;`},inputstyle(){return `cursor:pointer; padding: .5rem 0 ;border: 1px solid #ffffff54;border-radius: .5rem;font-size: .7rem;display: flex;justify-content: center;align-items: center;color: #ffffff94;`},
        labelstyle(){return`width: 100%;display: flex; justify-content: space-between; align-items: center'`},
        inputstyle(){return `padding: 0.2rem; background:transparent; cursor: pointer;padding: .5rem 0;border: 1px solid #ffffff54;border-radius: .5rem;font-size: .7rem;display: flex;justify-content: center;align-items: center;width: 100%;color: #ffffff94;`},
        ghostdivstyle(){return `position: absolute;left: 0px;top: 0px;padding: .5rem;border: 2px solid yellow;border-radius: .3rem;`},
        ghosthdivstyle(){return `left: 50%;position: absolute;width: .5rem;height: .5rem;background: yellow;top: -.7rem;transform: translateX(-50%);border-radius: 50%;`},
        ghostwdivstyle(){return `top: 50%;position: absolute;width: .5rem;height: .5rem;background: yellow;right: -.7rem;transform: translateY(-50%);border-radius: 50%;`},
        namestyle(){return `font-size:.7rem`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},

        x: 0, y: 0, w: 50, h: 50,
        tilex: 0, tiley: 0,
        mainx: 0, mainy: 0, mainw: 50, mainh: 50,
        tx: 0, ty: 0,
        rects: [],

        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/collida.png'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        ui(to, CollidaObject, Material, Layout, Layers, Layer, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='left yscroll' style='${this.leftstyle()}'>
            <div class='main' style='${this.rectdiv()}'>
                <div style='${this.namestyle()}'>${CollidaObject.name || 'main'}</div>
                <label for='mainx' style='${this.labelstyle()}'>Offx
                <input style='${this.inputstyle()}' class='mainx' id='mainx' step='10' value='${CollidaObject.offsetx}' type='number'>
                </label>
                <label for='mainy' style='${this.labelstyle()}'>Offy
                <input style='${this.inputstyle()}' class='mainy' id='mainy' step='10' value='${CollidaObject.offsetys}' type='number'>
                </label>
                <label for='mainw' style='${this.labelstyle()}'>W
                <input style='${this.inputstyle()}' class='mainw' id='mainw' step='10' value='${CollidaObject.w}' type='number'>
                </label>
                <label for='mainh' style='${this.labelstyle()}'>H
                <input style='${this.inputstyle()}' class='mainh' id='mainh' step='10' value='${CollidaObject.h}' type='number'>
                </label>
                <label for='mainbuo' style='${this.labelstyle()}'>Buo
                <input style='${this.inputstyle()}' class='mainbuo' id='mainbuo' step='0' value='${CollidaObject.buoyancy}' type='number'>
                </label>
                <label for='mainres' style='${this.labelstyle()}'>Rest
                <input style='${this.inputstyle()}' class='mainres' id='mainres' step='0' value='${CollidaObject.restitution}' type='number'>
                </label>
                <label for='mainfric' style='${this.labelstyle()}'>Fric
                <input style='${this.inputstyle()}' class='mainfric' id='mainfric' step='0' value='${CollidaObject.friction}' type='number'>
                </label>
                <label for='oneway' style='${this.labelstyle()}'>OneWay
                <input style='${this.inputstyle()}' class='oneway' id='oneway' checked='${CollidaObject.oneway}' type='checkbox'>
                </label>
                <label for='resolve' style='${this.labelstyle()}'>Resolve
                <input style='${this.inputstyle()}' class='resolve' id='resolve' checked='${CollidaObject.shouldresolve}' type='checkbox'>
                </label>
                <label for='show' style='${this.labelstyle()}'>Show
                <input style='${this.inputstyle()}' class='show' id='show'  checked ='${CollidaObject.showindicator}' type='checkbox'>
                </label>
            </div>
            <div class='join' style='${this.btnstyle()}'>Join New Collision</div>
            </div>
            <div class='right' style='${this.rightstyle()}'>
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.tilex = this.dom.canvas.clientWidth /2  - (this.w /2)
            this.tiley = this.dom.canvas.clientHeight /2  - (this.h /2)
            this.getCanvas()
            this.events(CollidaObject)
            this.mainevents(CollidaObject, Tile, Material)
            this.setTogglebtn(CollidaObject)
            this.updateToggle(CollidaObject)
            return this
        },
        setTogglebtn(obj){
            if(this.togglebtn)this.togglebtn.remove()
            this.togglebtn = document.createElement(`div`)
            this.togglebtn.setAttribute(`style`, this.togglestyle())
            const setbtncolor = ()=>this.togglebtn.style.background = (obj.toggle)?'#432aaa':'#2c2938'
            setbtncolor()
            this.togglebtn.onclick = ()=>{
                obj.toggle = (obj.toggle)?false:true
                this.updateToggle(obj)
                setbtncolor()
            }
            this.element.append(this.togglebtn)
        },
        updateToggle(obj){
            if(!obj.toggle){
                if(this.togglediv)this.togglediv.remove()
                this.togglediv = document.createElement(`div`)
                this.togglediv.setAttribute(`style`, `z-index: 20; opacity: 0.4;width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: #000`)
                this.togglediv.ondblclick = ()=>{
                    obj.toggle = true
                    this.setTogglebtn(obj)
                    this.updateToggle(obj)
                }
                this.element.append(this.togglediv)
            }else{
                this?.togglediv?.remove()
            }
        },
        addRects(obj){
            this.rects.push(rect(this, obj))
        },
        mainevents(obj, tile, mat){
            this.parseMainRatio(obj, tile)
            this.dom.mainx.oninput = (e)=>{
                obj.offsetx = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainy.oninput = (e)=>{
                obj.offsety = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainw.oninput = (e)=>{
                obj.w = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainh.oninput = (e)=>{
                obj.h = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainbuo.oninput = (e)=>{
                obj.buoyancy = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainres.oninput = (e)=>{
                obj.restitution = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.mainfric.oninput = (e)=>{
                obj.friction = +(e.target.value)
                this.parseMainRatio(obj, tile)
            }
            this.dom.oneway.onchange = (e)=>{
                obj.oneway = e.target.checked
            }
            this.dom.resolve.onchange = (e)=>{
                obj.shouldresolve = e.target.checked
            }
            this.dom.show.onchange = (e)=>{
                obj.showindicator = e.target.checked
            }
        },
        events(CollidaObject){
            this.toggle = false
            this.canvas.onmousedown = (e)=>{
                this.x = e.clientX - this.canvas.getBoundingClientRect().x - this.tx
                this.y = e.clientY - this.canvas.getBoundingClientRect().y - this.ty
                if(e.button === 2){
                    this.toggle = true
                }
            }
            this.canvas.onmousemove = (e)=>{
                if(!this.toggle)return
                this.x = e.clientX - this.canvas.getBoundingClientRect().x - this.tx
                this.y = e.clientY - this.canvas.getBoundingClientRect().y - this.ty
            }
            this.canvas.onmouseup = (e)=>{
                this.toggle = false
            }
            this.dom.join.onclick = ()=>{
                const obj = CollidaObject.join()
                this.addRects(obj)
            }
        },
        getCanvas(){
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            this.ctx.translate(this.tx, this.ty)
        },
        clearCtx(){
           this.ctx.clearRect(-this.tx, -this.ty, this.canvas.width, this.canvas.height)
        },
        draw({tile}){
            
            

            const t = {...tile, x: this.tilex, y: this.tiley,w: this.w, h: this.h}
            if(t.sprite){
                t.sprite.draw({ctx: this.ctx, tile: t})
            }else{
                this.ctx.strokeStyle = ` #0e28f062`
                this.ctx.fillStyle = ` #66110062`
                this.ctx.fillRect(this.tilex, this.tiley, this.w, this.h)
                this.ctx.strokeRect(this.tilex, this.tiley, this.w, this.h)    
            }
            this.ctx.fillStyle = ` #000c6662`
            this.ctx.fillRect(this.mainx, this.mainy, this.mainw, this.mainh)

            this.rects.forEach(rect=>{
                rect?.update({ctx: this.ctx})
            })
        },
        getMainRatio(obj, tile){
            return {
                x:  tile.w / (obj.offsetx),
                y:  tile.h / (obj.offsety),
                w:  tile.w / obj.w,
                h:  tile.h / obj.h,
            }
        },
        parseMainRatio(obj, tile){
            const ratio = this.getMainRatio(obj, tile)
            if(ratio.x === Infinity)ratio.x = 0
            if(ratio.y === Infinity)ratio.y = 0
            if(ratio.w === Infinity)ratio.h = 0
            if(ratio.h === Infinity)ratio.w = 0

            this.mainx = this.w / ratio.x  + this.tilex
            this.mainy = this.h / ratio.y  + this.tiley
            this.mainw = this.w / ratio.w
            this.mainh = this.h / ratio.h
            
            if(this.mainx === Infinity)this.mainx = 0 + this.tilex
            if(this.mainy === Infinity)this.mainy = 0 + this.tiley
            if(this.mainw === Infinity)this.mainw = 0
            if(this.mainh === Infinity)this.mainh = 0
        },
        update(props){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.draw(props)
            this?.ghost?.update()

        }
    }

    return res
}

function randcolor(alpha){
const rand = ()=>Math.floor(Math.random() * (225 - 0))
return `rgba(${rand()}, ${rand()}, ${rand()}, ${alpha})`
}

function rect(UI,join){
    const res = {
        x: 0, y: 0,
        obj: join,
        w: UI.w, h: UI.h,
        color: `red`,
        shouldmove: true,
        load(){
            this.color  = randcolor(.3)
            this.ui = this.dom(`join`)
            this.updateposdom(this.ui)
            this.events()
        },
        dom(name){
            const div = document.createElement(`div`)
            div.classList.add(`rect`)
            div.setAttribute(`style`, UI.rectdiv())
            div.innerHTML += `
            <div style='${UI.namestyle()}'>${name}</div>
            <div class='x' style='${UI.inputstyle()}'>${this.obj.x}</div>
            <div class='y' style='${UI.inputstyle()}'>${this.obj.y}</div>
            <label for='w' style='${UI.labelstyle()}'>w
            <input style='${UI.inputstyle()}' class='w' id='w' step='10' value='${this.obj.w}' type='number'>
            </label>
            <label for='h' style='${UI.labelstyle()}'>h
            <input style='${UI.inputstyle()}' class='h' id='h' step='10' value='${this.obj.h}' type='number'>
            </label>
            `
            UI.dom.left.prepend(div)
            const dom = {...domextract(div).object, div}
            this.optionsevents(dom)
            return dom
        },
        updateposdom(){
            this.ui.x.textContent = `${this.x}px ratio`
            this.ui.y.textContent = `${this.y}px ratio`
        },
        optionsevents(dom){
            dom.w.oninput = (e)=>{
                join.w = +(e.target.value)
            }
            dom.h.oninput = (e)=>{
                join.h = +(e.target.value)
            }
        },
        events(){
            UI.dom.canvas.addEventListener('mousedown', (e)=>{
                this.dx = e.clientX - UI.canvas.getBoundingClientRect().x - UI.tx - this.x
                this.dy = e.clientY - UI.canvas.getBoundingClientRect().y - UI.ty - this.y
            })
            UI.dom.canvas.addEventListener('mousemove', (e)=>{
                // console.log(UI.toggle, this.hoveredon())
                if(this.hoveredon() && this.shouldmove){
                    UI.rects.filter(e=>e !== this).map(e=>e.shouldmove === false)
                    this.x = UI.x - this.dx
                    this.y = UI.y - this.dy
                    this.parseRatio()
                    this.optionsevents(this.ui)
                    this.updateposdom()

                }
            })
 
            UI.dom.canvas.addEventListener('mouseup', ()=>{
                UI.rects.filter(e=>e !== this).map(e=>e.shouldmove === true)
            })

        },
        getRatio(){
            return {
                x:  UI.w / (this.x - UI.tilex),
                y:  UI.h / (this.y - UI.tiley),
                w:  UI.w / this.w,
                h:  UI.h / this.h,
            }
        },
        parseRatio(){
            const ratio = this.getRatio() 
            join.offsetx = join.parent.w / ratio.x 
            join.offsety = join.parent.h / ratio.y 
        },  
        hoveredon(){
            const {x, y}  = UI
            return (
                x > this.x &&
                x < this.x + this.w &&
                y > this.y &&
                y < this.y + this.h
            )
        },
        draw({ctx}){
            ctx.fillStyle= this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
        },
        update(props){
            this.draw(props)
        }
    }
    res.load()
    return res
}