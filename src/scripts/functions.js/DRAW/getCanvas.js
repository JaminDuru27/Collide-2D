import {EventHandler} from '../../functions.js/DRAW/events.js';
export function getCanvas(canvas, obj){
    const res = {
        canvas,
        ctx: null,
        load(){
            this.ctx = this.canvas.getContext(`2d`)
            this.updateBound()
            this.updateObj()
            this.events()
        },
        events(){
          EventHandler(window ,'', 'resize',()=>{
            this.updateBound()
          })
        },
        updateObj(){
            obj['canvas'] = this.canvas
            obj['ctx'] = this.ctx
        },
        updateBound(){
            for(let x in this.canvas.getBoundingClientRect())
            this.canvas[x] = this.canvas.getBoundingClientRect()[x]
        },
        clear(){
            this.updateBound()
            this.ctx.clearRect(0, 0,this.canvas.width, this.canvas.height)
        }
    }
    res.load()
    return res
}