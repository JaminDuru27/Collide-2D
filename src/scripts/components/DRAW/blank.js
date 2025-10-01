import { EventHandler } from "../../functions.js/DRAW/events.js"
let last
export function blank(element, callback){
    const res = {
        style(){return `z-index: 9;background: #00000003;position: absolute;top: 0;left: 0;width: 100vw;height: 100vh;`},
        ui(){
            if(last)last.remove()
            last = this
            element.style.zIndex = `10`
            this.element = document.createElement(`div`)
            this.element.classList.add(`blank`)
            this.element.setAttribute(`style`, this.style())
            document.body.append(this.element)
        },
       
        events(){
            const ev = EventHandler(this.element, 'blank', 'click', ()=>{
                callback()
                this.element.remove()
            })
            
        },
        remove(){
            this.element.remove()
        },
        load(){
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}