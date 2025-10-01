import { EventHandler } from "../../functions.js/DRAW/events.js"
import { domextract } from "./domextract.js"

export function SettingsUI(){
    const res = {
        exitstyle(){return `position: absolute; top: .5rem; left: .5rem;width: 2vw;height: 2vw;opacity: .5;`},
        style(){return `color: white;background: #3a0726;width: 100vw; height: 100vh;position: absolute; top: 0; left: 0; z-index: 10;`},
        titleStyle(){return `width: 100%;height: 20%;font-size: 3rem; display: flex;justify-content: flex-start;padding: 0 0.5rem;align-items: center;`},
        contentStyle(){return `width: 100%;height: 80%;padding: 2rem;`},
        load(){
            this.ui()
            this.event()
        },
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.classList.add(`settingui`)
            this.element.innerHTML += `
            <div class='exit' style='${this.exitstyle()}'></div>
            <div class='title' style='${this.titleStyle()}'>Settings</div>
            <div class='content' style='${this.contentStyle()}'></div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        remove(){this.element.remove()},
        event(){
            EventHandler(this.dom.exit, `exitstuff`, `click`, ()=>{
                this.remove()
            })
        }
        
    }
    res.load()
    return res
}