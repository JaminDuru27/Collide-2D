import { domextract } from "../../DRAW/domextract"
import { MaterialOptions } from "../options"

export function Sine(){
    const res = {
        name: `Sine`,
        style(){return `color: #fff; position: relative;width: 100%;height: 100%;background: linear-gradient(180deg, #484852ff 10%, #0f012d 80%);`},
        canvasstyle(){return`width: 50%;height: 100%;background: #05011b;border-radius: .5rem;border: 1px solid #ffffff3d;`},
        oscwrapstyle(){return`width: 50%;height: 100%;display: flex;justify-content: space-between;align-items: space-evenly;padding: .5rem;flex-direction: column;gap: .5rem;`},
        flexwrapstyle(){return`width: 100%;height: 80%;display: flex;justify-content: space-between;align-items: center;`},
        oscstyle(){return `width: 100%; gap: .5rem; padding: 2rem .5rem .5rem .5rem;overflow:scroll hidden ;height: fit-content;border: 1px solid grey;border-radius: .5rem;background: #05011b; display: flex;justify-content: space-evenly;position: relative;align-items: center;font-size: .5rem;`},
        oscnamestyle(){return `font-size: .9rem; text-transform: uppercase;position: absolute;padding: .1rem .2rem;top: .2rem;left: .2rem;color: #928c8c;`},
        oscinputwrapstyle(){return `flex-shrink: 0;width: 3rem;display: flex;justify-content: space-between;align-items: center;flex-direction: column;gap: .5rem;text-transform: capitalize;height: 4rem;`},
        oscinputstyle(){return `width: 100%;height: 100%;background: #ffffff33;border: none;color: #fff5f5;border-radius: .4rem;text-align: center;`},
        varwrapstyle(){return `width: 100%;gap: .5rem;padding: 0 .5rem;overflow: scroll hidden;height: 20%;border: 1px solid grey;border-radius: .5rem;background: #05011b;display: flex;justify-content: flex-start;position: relative;align-items: center;font-size: .5rem;`},
        varstyle(){return`width: fit-content;padding: .3rem;border: 2px solid grey;background: #05011b;display: flex;justify-content: center;position: relative;font-size: .5rem;border-radius: .5rem;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/sineman.png'
            return image
        },
        ui(to, SineObject, Material, Layout, Layers, Layer, Tile){
            this.element = document.createElement(`div`)
            this.element.classList.add(`SINE`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.flexwrapstyle()}'>
                <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
                <div class='oscwrap' style='${this.oscwrapstyle()}'></div>
                </div>
            </div>
            <div class='varwrap xscroll' style='${this.varwrapstyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            // this.updateVars({to: this.dom.inputs, SineObject, Material,inputstyle: this.inputstyle()})
            this.canvas = this.dom.canvas
            this.canvas.width = this.canvas.clientWidth
            this.canvas.height = this.canvas.clientHeight
            this.ctx = this.canvas.getContext(`2d`)
            // this.events(SineObject)    
            this.object = SineObject

            this.addosc({
                name: `osc1`,
            })
            this.events(Tile, SineObject)
            this.setTogglebtn(SineObject)
            this.updateToggle(SineObject)
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
        events(Tile, SineObject){
            this.dom.varwrap.onmousedown = (e)=>{
                if(e.button === 2){
                    Tile.showvariables(e, ({v})=>{
                        SineObject.addvar(v)
                    })
                }
            }
        },
        updatevars(SineObject){
            this.dom.varwrap.innerHTML = ``

            SineObject.variables.forEach(v=>{
                const div = document.createElement(`div`)
                div.setAttribute(`style`, this.varstyle())
                div.textContent  = v.prop
                const exit = document.createElement(`div`)
                exit.setAttribute(`style`, this.exitstyle)
                exit.onclick = ()=>{
                    v.remove()
                    this.updatevars(SineObject)
                }
                div.onclick = (e)=>{
                    MaterialOptions()
                    .set(e, document.body)
                    .add(`delete`, ()=>{
                        v.remove()
                        this.updatevars(SineObject)
                    })
                }
                this.dom.varwrap.append(div)
            })
        },
        addosc(osc){
            const div = document.createElement(`div`)
            div.innerHTML =
            `<div style='${this.oscnamestyle()}'>${osc.name}</div>`
            div.classList.add(`xscroll`)
            div.classList.add(osc.name)
            div.setAttribute(`style`, this.oscstyle())
            this.dom.oscwrap.append(div)

            for(let x in osc){
                if(x === `load` || x===`update` || x === `name` || x ==='$ref' || x === 'ref')continue
                const el = document.createElement(`div`)
                el.textContent= x
                const input = document.createElement(`input`)
                input.type = `number`
                el.setAttribute(`style`, this.oscinputwrapstyle())
                input.setAttribute(`style`, this.oscinputstyle())
                el.append(input)
                div.append(el)
                input.value = osc[x]
                input.oninput = (e)=>{
                    osc[x] = +(e.target.value)
                }
            }
        },
        updateosc(SineObject){
            this.dom.oscwrap.innerHTML = ``
            SineObject.oscillations.forEach(osc=>{
                this.addosc(osc)
            })
        },
        load(){
        },
        update(SineObject){
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
            this.ctx.fillStyle = `red`
            this.ctx.fillRect(SineObject.mainsinx, 0, 50, 50)

        }
    }
    res.load()
    return res
}