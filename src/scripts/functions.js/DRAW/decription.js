import { domextract } from "../../components/DRAW/domextract.js"
import { EventHandler } from "./events.js"

export function Description(Instance){
    const res = {
        style(){return`width: 22vw;max-height: 5vw;overflow:hidden auto; backdrop-filter: blur(3px);border-radius: .5rem;z-index: 1;padding: .5rem;background: #0000002e;position: absolute;top: 2rem;right: 0;display: flex;justify-content: space-between;align-items: center;`},
        bgimgstyle(){return `background-size: contain; background-repeat: no-repeat; background-position: center;`},
        imgStyle(){return`background-image: url(./assets/icons/description.png); width: 3vw; height: 3vw; float: left;`},
        contentStyle(){return`width: 82%; height: 100%; padding: .2rem;`},
        textStyle(){return`font-size: .7rem; color: grey;`},
        load(){
            this.ui()
            this.events()
        },
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`descr`)
            this.element.classList.add(`yscroll`)
            this.element.setAttribute(`style`,this.style())
            this.element.innerHTML = `
            <div class='img' style='${this.imgStyle()} ${this.bgimgstyle()}'></div>
            <div class='content yscroll' style='${this.contentStyle()}'></div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        events(){
            EventHandler(window, 'scount for decription', 'mouseover', (e)=>{
                this.target = e.target
                const description = (this.target.getAttribute(`description`))?this.target.getAttribute(`description`):this.target.description
                if(description){
                    this.setDescription(description)
                }
            })
        },
        setDescription(text){
            this.dom.content.innerHTML = `
            <div class='text' style='${this.textStyle()}'>${text}</div>
            `
        },
    }
    return res
}