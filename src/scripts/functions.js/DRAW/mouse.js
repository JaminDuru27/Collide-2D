import { EventHandler } from "./events.js"
import { GUI } from "./gui.js"

export function Mouse(Instance){
    const res = {
        color: `#500a4e`, rad: 20,
        x: 0, y: 0,
        updatePos(px, py, e){
            const b= e.getBoundingClientRect()
            const x = px - b.x
            const y = py - b.y
            this.x = x
            this.y = y
        },
        events(){
          if('ontouchstart' in window){
            EventHandler(Instance.ui.dom.canvas, '', 'touchmove', (e) => {
              this.updatePos(e.touches[0].clientX, e.touches[0].clientY, e.target)
            })
            EventHandler(Instance.ui.dom.canvas, '', 'touchstart', (e) => {
              this.updatePos(e.touches[0].clientX, e.touches[0].clientY, e.target)
            })
            EventHandler(Instance.ui.dom.canvas, '', 'touchend', (e) => {
            })
            return
          }
            EventHandler(Instance.ui.dom.canvas, '', 'mousemove', (e)=>{
                this.updatePos(e.clientX, e.clientY, e.target)
            })
            EventHandler(Instance.ui.dom.canvas, '', 'dragover', (e)=>{
                e.preventDefault()
                this.updatePos(e.clientX, e.clientY, e.target)
            })
            EventHandler(Instance.ui.dom.canvas, '', 'mousedown', (e)=>{
                this.updatePos(e.clientX, e.clientY, e.target)
            })
            EventHandler(Instance.ui.dom.canvas, '', 'mouseup', (e)=>{
                this.updatePos(e.clientX, e.clientY, e.target)
            })
            
        },
        gui(){
            this.guifolder = GUI('Mouse', Instance.ui.dom.leftside)
            this.guifolder.add(this, 'rad', `radius`, [1, 12, 0.1])
            this.guifolder.add(this, 'color', `color`)

            // Instance.updates.record(this,`x`)
            // Instance.updates.record(this,`y`)

        },
        load(){
        },
        update({ctx}){
            ctx.beginPath()
            ctx.strokeStyle = this.color
            ctx.setLineDash([2,2])
            ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2)
            ctx.stroke()
            ctx.closePath()
        }
    }
    res.load()
    return res
}