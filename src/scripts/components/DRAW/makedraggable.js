import { EventHandler } from "../../functions.js/DRAW/events.js";

export function makedraggable(element, elementtodrag,stopX , stopY, button = 0){
    const res = {
        stopX, stopY,
        drag: true,
        hold: true,
        button,
        load(){
            this.mouse()
            this.events()
        },
        mouse(){
          EventHandler(document.body, ``, `mousedown`, (e)=>{
            if(e.buttons !== button)return
            this.mx = e.clientX
            this.my = e.clientY
          })
          EventHandler(document.body, ``, `mousemove`, (e)=>{
            this.mx = e.clientX
            this.my = e.clientY
          })
          EventHandler(document.body, ``, `mouseup`, (e)=>{
            if(e.buttons !== button)return
            this.mx = null
            this.my = null
          })
        },
        checkcollisionwith(e){
          const a = element.getBoundingClientRect()
          const b = e.getBoundingClientRect()
          return (
            a.x + a.width > b.x &&
            a.y + a.height > b.y &&
            a.x < b.x + b.width &&
            a.y < b.y + b.height
          )
        },
        draggingstart(dom, e){
          if(e.button !== button)return

          if(this.drag || this.hold)
          this.offset={
            x: this.mx - dom.getBoundingClientRect().x,
            y: this.my - dom.getBoundingClientRect().y
          }
        },
        draggingmove(dom, e){
          if(this.drag || this.hold){
            if(!this.offset)return
            if(!this.stopX)
            dom.style.top = e.clientY - this.offset.y + `px`
            if(!this.stopY)
            dom.style.left = e.clientX - this.offset.x + `px`
          }
          
        },
        draggingend(dom){

            this.offset = null;
        },
        call(array, e){array.forEach(func=>{func(e)})},
        calldragstart(e){
          const data = {
            ...e,
            x: element.getBoundingClientRect().x,
            y: element.getBoundingClientRect().y,
            w: element.getBoundingClientRect().width,
            h: element.getBoundingClientRect().height,
          }
          this.call(element.ondragstart, data)
        },
        calldragmove(e){
          const data = {
            ...e,
            x: element.getBoundingClientRect().x,
            y: element.getBoundingClientRect().y,
            w: element.getBoundingClientRect().width,
            h: element.getBoundingClientRect().height,
          }
          this.call(element.ondrag, data)
        },
        calldragend(e){
          this.call(element.ondragend, e)
          this.call(element.onleave, e)
        },
        events(){
            element.ondragstart = []
            element.ondrag = []
            element.onleave = []
            element.ondragend = []
            EventHandler(element, `drg`, 'mousedown', (e)=>{//ELEMENT OF INTEREST
              const dom = elementtodrag || element 
              this.calldragstart(e)
              this.draggingstart(dom,e)
            })
            EventHandler(element, `drg`, 'mousemove', (e)=>{
                const dom = elementtodrag || element 
                this.calldragmove(e)
                this.draggingmove(dom, e)
            })
            EventHandler(element, `drg`, 'mouseup', (e)=>{
              const dom = elementtodrag || element 
              this.draggingend(dom)
              this.calldragend(e)
            })
            EventHandler(element, `drg`, 'mouseleave', (e)=>{
              const dom = elementtodrag || element 
              this.draggingend(dom)
            })
            // EventHandler(element, `drg`, 'touchstart', (e)=>{
            //   this.draggingstart(elementtodrag || element, offset, e)
            // })
            // EventHandler(element, `drg`, 'touchmove', (e) => {
            // this.draggingmove(elementtodrag || element, offset, e)
            // })
            // EventHandler(element, `drg`, 'touchend', (e)=>{
            // this.draggingend(elementtodrag || element, offset)
            // })
        }
    }
    res.load()
    return res
}