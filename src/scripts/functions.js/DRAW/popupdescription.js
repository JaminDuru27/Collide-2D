import { domextract } from "../../components/DRAW/domextract.js"
import { EventHandler } from "./events.js"

export function PopupDescription(){
    const res = {
        style(){return`border: 1px solid grey; color: grey; font-size: .7rem;width: fit-content; max-width: 22vw;max-height: 5vw;overflow:hidden auto; backdrop-filter: blur(3px);border-radius: .5rem;z-index: 9;padding: .5rem;background: #0000002e;position: absolute;`},
        load(){
            this.ui()
            this.events()
        },
        ui(){
        },
        events(){
            EventHandler(window, 'scount for decription', 'mouseover', (e)=>{
                this.target = e.target
                const description = (this.target.getAttribute(`popupdescription`))?this.target.getAttribute(`popupdescription`):this.target.popupdescription
                if(description){
                    this.setDescription(description, this.target.getBoundingClientRect())
                }
                this.target.onmouseleave=()=>{
                    if(this.element)this.element.remove()
                }
            })
            EventHandler(window, 'scount for decription', 'click', (e)=>{
                if(this.element)this.element.remove()
            })
        },
        setleft(e, t){
            const B = t.getBoundingClientRect()
            const b = e.getBoundingClientRect()
            e.style.top = B.y -5 +`px`
            e.style.left = B.x - b.width + `px`
        },
        setright(e, t){
            const B = t.getBoundingClientRect()
            const b = e.getBoundingClientRect()
            e.style.top = B.y + 5+ `px`
            e.style.left = B.x + B.width + `px`
        },
        settop(e, t){
            const B = t.getBoundingClientRect()
            const b = e.getBoundingClientRect()
            e.style.top = B.y - b.height -5+ `px`
            e.style.left = B.x - ((b.width/2) - B.width/2) + `px`
        },
        setbottom(e, t){
            const B = t.getBoundingClientRect()
            const b = e.getBoundingClientRect()
            e.style.top = B.y + B.height + 5 +`px`
            e.style.left = B.x - ((b.width/2) - B.width/2) + `px`

        },
        setDescription(text, b){
            if(this.element)this.element.remove()
            this.element = document.createElement(`div`)
            this.element.innerHTML = text
            const dir = this.target.getAttribute(`popupdirection`) || this.target.popupdirection || `bottom`
            this.element.setAttribute(`style`, this.style())
            document.body.append(this.element)
            const f = `set${dir}`
            this[f](this.element, this.target)
        },
    }
    res.load()
    return res
}