import { domextract } from "../DRAW/domextract"

export function LayerDom({Layer, Layers,to, eyecallback, callback}){
    const res = {
        index: Layers.array.indexOf(Layer),
        style(){return `outline-offset: .2rem;position: relative;width: 100%;height: 3rem;background: #0000001f;border-radius: .5rem;margin: .5rem 0;display: flex;justify-content: space-between;align-items: center;padding: .5rem;border: 2px solid #3636bd;opacity: .5;`},
        eyeshowstyle(){return `width: .8rem;height: .8rem;background: #3636bd;border: 2px solid #ffffffab;border-radius: 50%;`},
        eyehidestyle(){return `width: .8rem;height: .8rem;border: 2px solid #3636bd;border-radius: 50%;`},
        titlestyle(){return `color: #3636bd; font-size: .7rem;`},
        layernamestyle(){return `top: .1rem; left: .2rem;position: absolute;color: #b5b5efff; font-size: .5rem;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='layername' style='${this.layernamestyle()}'>${Layer?.name}</div>
            <div class ='title' id='${Layer?.id}' style='${this.titlestyle()}'>${Layer?.name}</div>
            <div class ='eye' style=''></div>
            `
            to.append(this.element)
            domextract(this.element,`classname`,this )
            this.element.draggable = true
        },
        showoutline(){
            this.element.style.outline = `2px solid #000193`
        },
        hideoutline(){
            this.element.style.outline = `none`
        },
        events(){
            this.element.onclick = ()=>{callback(this)}
            const eye = this.dom.eye
            eye.toggle = -1
            eye.show = ()=>{
                eye.setAttribute(`style`, this.eyeshowstyle())
                eyecallback(false)
                eye.toggle = -1
            }
            eye.hide = ()=>{
                eye.setAttribute(`style`, this.eyehidestyle())
                eyecallback(true)
                eye.toggle = 1
            }
            if(!Layer.hide)eye.show()
            else eye.hide()
            eye.onclick = (e)=>{
                const toggle = e.target.toggle
                if(toggle > 0){
                    eye.show()
                }else if(toggle < 0){
                    eye.hide()
                }
            }


            this.element.ondragstart = (e)=>{
                e.dataTransfer.setData(`text`, `${this.index}`)
            }
            this.element.ondragover = (e)=>{
                e.preventDefault()
            }
            this.element.ondrop = (e)=>{
                const index = +(e.dataTransfer.getData(`text`, `${this.index}`))
                const index2 = this.index
                const temp = Layers.array[index2]
                Layers.array[index2] = Layers.array[index]
                Layers.array[index] = temp
                Layers.updateDom()
                e.preventDefault()
            }
        },
        load(){
            this.ui()
            this.events()
            return this
        },
    }
    res.load()
    return res
}