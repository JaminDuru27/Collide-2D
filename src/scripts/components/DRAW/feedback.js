import { EventHandler } from "../../functions.js/DRAW/events.js"
import { blank } from "./blank.js"
import { domextract } from "./domextract.js"

export function feedback({message, placeholder, messageType = 'normal',inputtype = `input`, callback }){
    const res = {
        style(){return `backdrop-filter: blur(8px);background: #00000038;top: 0;left: 50%;position: absolute;width: 24vw;height: fit-content;transform: translateX(-50%);display: flex;-content: flex-start;align-items: center;color: white;flex-direction: column;border-radius: 5px;opacity: 0;padding: 5px 0`},
        textstyle(){return `margin-top: .3rem;width: 100%; text-align:center; padding: .3rem;color: #cec8c8;`},
        inputstyle(){return `height: 2rem;border-radius: 2rem;border: 2px solid #ffffff66;padding: 5px;margin: .5rem;background: #ffffff52; width: 80%;`},
        exitStyle(){return`cursor: pointer;clip-path:polygon(20% 0%, 0% 20%, 40% 50%, 0% 80%, 20% 100%, 50% 60%, 80% 100%, 100% 80%, 60% 50%, 100% 20%, 80% 0%, 50% 40%);width: 1vw;height: 1vw; background: black;position: absolute;top: 5px;right: 5px;`},
        bgimgstyle(){return `background-size: contain; background-repeat: no-repeat; background-position: top left;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.setAttribute(`open`, `true`)
            this.blank = blank(this.element, this.blankEvents)
            this.element.classList.add(`feedback`)
            document.body.append(this.element)
            this.element.innerHTML += `
            <div class='exit' style='${this.exitStyle()}'></div>
            <img src = './assets/icons/${messageType}.png' style='width: 2rem; height: 2rem'/>
            <div style='${this.textstyle()} '>${message}</div>
            <input class='input' style='${this.inputstyle()}'
            type = '${inputtype}'
            ${(inputtype === `button`)?`value = ${placeholder}`:''}
            placeholder = '${placeholder}'
            ${(!callback)?'hidden':''}
            >
            `
            domextract(this.element, `classname`, this)
        },
        remove(){
            this.element.setAttribute(`open`, `false`)
            this.blank.remove()
            setTimeout(()=>{
                this.element.remove()
            }, 1000)
        },
        blankEvents(){
            const input = res.dom.input
            if(input.value.trim(' ') !== '') //if not empty
            if(callback)
            callback({...input, target:input, value: input.value})
            res.remove()    
            
        },
        events(){
            const dom = domextract(this.element)
            if(!inputtype){
                setTimeout(()=>{
                    this.remove()
                }, 4000)
            }
            dom.object.input.focus()
            const ev = EventHandler(dom.object.exit, 'exitcreateinst', 'click', ()=>{
                this.remove()
            })
            if(inputtype === `button`){
                this.dom.input.onclick = (e)=>{
                    if(callback)
                    callback({...e.target, target:e.target, value: e.target.value})
                    this.remove()
                }
            }
        },
        load(){
            this.ui()
            domextract(this.element, `classname`, this)
            this.events()
            if(!inputtype)this.dom.input.remove()
            if(!callback)this.remove()
        }
    }
    res.load()
    return res
}