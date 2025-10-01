import { EventHandler } from "../../functions.js/DRAW/events.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { domextract } from "./domextract.js"
import { Dropdown } from "./dropdown.js"
import { feedback } from "./feedback.js"

export function CollisionGroupDom(Groups, to, title,callback, eyecallback){
    let toggle = -1
    const res = {
        title,
        style(){return `width: 100%; color: white;background: #48092f;padding: 1rem;border-radius: 5px; margin-top:.5rem;`},
        layerstyle(){return `opacity: 0.5;margin-bottom: .5rem;width: 100%;height: 2rem;border-radius: .3rem;border: 2px solid #e91e63;display: flex;justify-content: space-between;align-items: center;padding: .5rem;color: pink;`},
        eyestyle(){return ` background: #ec1860;width: .7rem;height: .7rem;border-radius: 50%;border: 2px solid #ec1860;; transition: .3s ease`},
        titlestyle(){return `color: white`},
        inputStyle(){return`background: transparent;color: white;border: none;max-width: 50%;padding: .1rem .2rem;border-bottom: 1px solid;border-radius: 2rem;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.layerstyle())
            this.element.classList.add(`collisionlayer`)
            this.element.innerHTML += `
            <div class='title' style='${this.titlestyle()}'>${title}</div>
            <div class='hide' style='${this.eyestyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)
        },
        
        events(){
            EventHandler(this.element, ``, `click`, ()=>{
                Groups.array.forEach(grup=>{
                    if(grup.name === this.title)
                    Groups.group = grup
                })
            })
            EventHandler(this.dom.title, ``, `click`, ()=>{
                this.dom.title.remove()
                const input = document.createElement(`input`)
                input.setAttribute(`style`, this.inputStyle())
                input.placeholder = `enter title`
                input.value = this.dom.title.textContent
                this.element.prepend(input)
                input.focus()
                input.onchange = (e)=>{
                    Groups.array.forEach(grup=>{
                        if(grup.name === this.title)
                        grup.name = e.target.value
                    })
                    draw.instance.library.rename(title, e.target.value)
                    this.title = e.target.value
                    draw.instance.collisiongroups.updateDom()
                    input.remove()
                    this.element.prepend(this.dom.title) 

                }
            })
            this.toggle = -1
            EventHandler(this.dom.hide, ``, `click`, ()=>{
                this.toggle *= -1
                if(this.toggle < 0){
                    Groups.array.forEach(grup=>{
                        if(grup.name === this.title)
                        grup.hide = true
                    })
                    this.dom.hide.style.background = `transparent`
                }else if(this.toggle > 0){
                    Groups.array.forEach(grup=>{
                        if(grup.name === this.title)
                        grup.hide = false
                    })
                    this.dom.hide.style.background = `#ec1860`
                }
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