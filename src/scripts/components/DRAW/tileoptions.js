import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { domextract } from "./domextract.js"
let laste
export function TileOption(e, sprite){
    const res = {
        array: [],
        style(){return `overflow:visible;position: absolute;width: fit-content;height: 2rem;border-radius: 0.3rem;border: 1px solid #e91e63;background-color: #3a0726;display: flex;z-index: 10;`},
        btnstyle(x){return`transition-delay: .${x}s;transition: .3s ease; opacity:0; cursor:pointer;width: 2rem;background-size: 59%;background-position: center center;border-bottom: 1px solid rgb(153, 20, 73);transform:width: 2rem;background-color: #3a0726;background-repeat: no-repeat;height: 100%;border-radius: 5px;flex-shrink: 1;background-image: url(./assets/icons/delete.png);box-shadow: 0px 6px 9px 2px #2d011b;`},
        ui(){
            laste?.remove()
            this.element = document.createElement(`div`)
            laste = this 
            this.element.setAttribute(`style`, this.style())
            this.element.classList.add(`tileoption`)
            domextract(this.element, `classname`, this)
        },
        remove(){
            this.element.remove()
        },
        events(){
            EventHandler(document.body, '', 'mousedown', (e)=>{
                if(e.button === 0){
                    // this.remove()
                    // draw.instance.layers.clearHoveredSpriteIndication()
                }
            })
        },
        appendOptions(){
            document.body.append(this.element)   
            const box = draw.instance.grid.boxes[sprite.indy][sprite.indx]         
            this.element.style.left = e.clientX + box.w+ `px`
            this.element.style.top = e.clientY + `px`
        },
        updateButtonsDom(){
            this.element.innerHTML = ``
            this.array.forEach((data, x)=>{
                const div = document.createElement(`div`)
                div.setAttribute(`popupdescription`, data.name)
                div.setAttribute(`style`, this.btnstyle(x))
                div.onclick = (e)=>{data.callback(e)}
                div.style.backgroundImage = `url(${data.src})`
                this.element.append(div)
                setTimeout(()=>{
                    div.style.transform = `translateY(-40%)`
                    div.style.opacity =`1`
                },10)
            })
        },
        add(name, callback, src){
            if(!sprite)return
            const data = {name, callback, src}
            this.array.push(data)
            this.updateButtonsDom()
            return data
        },
        load(){
            if(!sprite)return
            this.ui()
            this.appendOptions()
            this.events()
        }
    }
    res.load()
    return res
}