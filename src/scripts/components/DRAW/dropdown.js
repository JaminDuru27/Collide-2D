import { EventHandler } from "../../functions.js/DRAW/events.js"
import { blank } from "./blank.js"
let last
export function Dropdown({target, dir, arguements = {}, obj,bgcolor = `#3b0726`, color = `#e61e62`, width = `100px`, height= `2rem`,showatonce = 2}){
    const res = {
        windw: window.innerWidth,
        windh: window.innerHeight,
        array: [], delay: 500,
        style(){return `max-height: calc((${height} + 0.5rem) * ${showatonce}); height: fit-content;overflow: hidden auto;color: ${color};position: absolute;
         width: calc(${width} + .5rem);  fit-content;border-radius: 5px;background: ${bgcolor};border: 1px solid ${color};left: 768px; z-index: 10;box-shadow: 2px 3px 14px black;`},
        btnstyle(){return ` width: 100%; height:${height}; margin: 0 0 .5rem 0;border-radius: 5px;background: transparent;border: 1px solid ${color};display:flex;justify-content:center;align-items:center;`},
        remove(){
            this.element.remove()
        },
        removeevents(){
            this.ts.removeevent()
            this.te.removeevent()
            this.re.removeevent()
            this.md.removeevent()
        },
        add(name, callback){this.array.push({name, callback})},
        load(){
            this.events(this)
        },
        
        ui(){
            if(last)last.remove()
            last = this
            this.element = document.createElement( `div`)
            this.blank = blank(this.element, ()=>{this.element.remove()})
            this.element.classList.add(`drop`)
            this.element.classList.add(`yscroll`)
            this.element.setAttribute(`style`, this.style())
            this.element.onclick = ()=>{console.log(obj)}
            document.body.append(this.element)
        },
        btnui(obj, ins){
            const div = document.createElement( `div`)
            div.classList.add(`dropbtn`)
            div.classList.add(`hover`)
            div.textContent = obj.name
            EventHandler(div,  `btndropoption`,  `click`, ()=>{
                this.remove()
                this.blank.remove()
                obj.callback(this.arguements)
            })
            div.setAttribute(`style`, this.btnstyle())
            this.element.append(div)
        },
        
        offsetback(e){
            const b = e.getBoundingClientRect()
            if(b.x < 0) e.style.left = 0 + `px`
            if(b.y < 0) e.style.top = 0 + `px`
            if(b.x+ b.width > this.windw) e.style.left = (this.windw - b.width) + `px`
            if(b.y + b.height > this.windh) e.style.top = (this.windh - b.height) + `px`
        },
        updateBtn(ins){
            this.element.innerHTML += ``
            this.array.forEach(obj=>{
                this.btnui(obj, ins)
            })
        },
        events(ins){
            this.md =EventHandler(target, '', 'mousedown', (e)=>{
                if(e.button !== 2)return
                this.ui()
                this.element.style.top = e.y + `px`
                this.element.style.left = e.x + `px`

                this.offsetback(this.element)
                this.updateBtn(ins)
            })
            this.ts = EventHandler(target, '', 'touchstart', (e) => {
              this.timeout = setTimeout(()=>{
                this.ui()
                this.element.style.top =e.target.getBoundingClientRect().y + `px`
                this.element.style.left =e.target.getBoundingClientRect().x + `px`
                this.offsetback(this.element)
                this.updateBtn(ins)
              }, this.delay)
            })
            this.te = EventHandler(target, '', 'touchend', (e) => {
             clearTimeout(this.timeout)
            })
            this.re = EventHandler(target, '', 'resize', (e) => {
              this.windw = window.innerWidth
              this.windh = window.innerHeight
            })
        },
    }
    res.load()
    return res
}