import { update } from "lodash"
import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"

export function RocketMan(){
    const res= {
        name: 'RocketMan',
        label1style(){return`position: absolute;top: 17%;left: 2%;`},
        label2style(){return`left: 2%;position: absolute;top: 27%;`},
        label3style(){return`top: 38%;left: 2%;position: absolute;`},
        style(){return `color: #fff; position: relative;width: 100%;height: 100%;background: linear-gradient(180deg, #484852ff 10%, #0f012d 80%);`},
        canvasstyle(){return`width: 40%;height: 40%;background: #05011b;position: absolute;top: 10%;border-radius: .5rem;left: 57%;border: 1px solid #ffffff3d;`},
        inputstyle(){return`color: #fff;background: #ffffff21;border: 1px solid #ffffff21;width: 20%;border-radius: .5rem;margin-left: .5rem;padding: .1rem;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        x: 0, y: 0, w: 30, h: 30,
        vy: 0,
        optionsId: GenerateId() + `Options`,
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/rocketman.png'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        ui(to, RocketManObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.classList.add(`ROCKETMAN`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='inputs' style='${this.label1style()}'></div>
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>

            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.updateVars({to: this.dom.inputs, RocketManObject, Material,inputstyle: this.inputstyle()})
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            this.events(RocketManObject)    
            this.object = RocketManObject
            this.setTogglebtn(RocketManObject)
            this.updateToggle(RocketManObject)
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
        updateVars({to, RocketManObject, inputstyle,Material}){
           to.innerHTML = ``
           RocketManObject.variablesOfInterest.forEach((variable)=>{
                const type = this.checkTypeForInput(RocketManObject,variable)
                const input = this.getinputdom({inputstyle,id: variable , 
                    oninput:(e)=>{
                        if(type.type === `string`) RocketManObject[variable] = e.target.value
                        if(type.type === `number`) RocketManObject[variable] = +(e.target.value)
                        if(type.type === `boolean`) RocketManObject[variable] = +(e.checked)
                        if(type.type === `function`) RocketManObject[variable] = +(e.target.value())
                    },
                    onmouserightclick:(e)=>{
                        Material.optionsHandler.find('globalvariablesoption').show(e)
                    }
                })
                input.type = type.type
                input.value = type.value

                to.append(input)  
          })
        },
        checkTypeForInput(obj, prop){
            let type = typeof obj[prop] 
            let value = obj[prop]
            if(type === `boolean`){type = `checkbox`}
            if(type === `number`)value = +(obj[prop])
            if(type === `function`)type = +(button)
            return {type, value}
        },
        getinputdom({style, oninput, onmouserightclick, id}){
            const input = document.createElement(`input`)
            input.id = id
            input.placeholder = id
            input.setAttribute(`style`, this.inputstyle())
            input.oninput = (e)=>{
                oninput(e)
            }
            input.onmousedown = (e)=>{
                if(e.buttons === 2){
                    onmouserightclick(e)
                }
            }
            return input
        },
        updateAnim(Material){
            if(!this.object)return
            this.y += this.vy
            this.object.updateIndex(this)
        },
        events(RocketManObject){},
        clearCtx(){
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
            this.ctx.imageSmoothingEnabled = false
        },
        draw(tile){
            const t = {...tile, x: this.x, y: this.y, w: this.w, h: this.h}
            this.clearCtx()
            const s = {...tile.sprite}
            const c = {...tile.collision}
            t.draw({ctx: this.ctx})
            if(s)s.draw({ctx: this.ctx, tile: t}) 
            else if(c)c.draw({ctx: this.ctx, tile: t})
            else{
                this.ctx.fillStyle = `red`
                this.ctx.fillRect(this.x, this.y, this.w, this.h)
            }
        },
        update(Material, tile){
            this.draw(tile)
            this.updateAnim(Material)
        }
    }

    return res
}