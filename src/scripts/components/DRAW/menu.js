import { EventHandler, events } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { materials } from "../../functions.js/Material/materials.js"
import { load } from "../Material/load.js"
import { domextract } from "./domextract.js"
import { feedback } from "./feedback.js"
import { Load } from "./load.js"

export function Menu(){
    const res = {
        style(){return `background-image: linear-gradient(to bottom, #0000006e, #0000006e), url(./assets/images/bg.png); background-position: center; background-repeat: no-repeat; background-size: cover;width: 100vw;height: 100vh;position: absolute;top: 0;left: 0; display: flex;justify-content: space-between;align-items: flex-start;flex-direction: column;`},
        topstyle(){return `font-size: 2vw;color: transparent; -webkit-text-stroke : 1px rgb(255, 255, 255);align-items: flex-start;padding: 4rem 0 0 5rem ;justify-content: flex-start;height: 30%; width: 100%; display:flex; flex-direction: column; `},
        leftstyle(){return `height: 70%; width: 100%;`},
        btnstyle(){return ``},
        materialsstyle(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add('menu')
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='top' style='${this.topstyle()}'>
            <div class='newInstance' id='new' style='cursor:pointer'>New</div>
            <div class='loadInstance'  style='cursor:pointer'>Load</div>
            <div class = 'newMaterial'>New Material</div>

            </div>
            <div class='bottom' style='${this.leftstyle()}'></div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
            load(this.dom.bottom)
        },

        events(){
            const newinst = this.element.querySelector(`.newInstance`)
            const load = this.element.querySelector(`.loadInstance`)
            const ev = EventHandler(newinst, 'new','click', ()=>{
                const feed = feedback({message: 'project name', placeholder:'Enter a title', callback:(e)=>{
                    draw.add(e.target.value)
                    this.remove()
                }})
            } )
            const ev2 = EventHandler(load, 'load','click', ()=>{
                Load()
            })
            const ev3 = EventHandler(this.dom.newMaterial, 'load','click', ()=>{
                this.remove()
                materials.add()
            })
        },
        remove(){
            events.clear()
            this.element.remove()
        },
        load(){
            //CLEAR BODY
            document.body.innerHTML = ``
            const ui = this.ui()
            const ev = this.events()
        }
    }
    res.load()
    return res
}