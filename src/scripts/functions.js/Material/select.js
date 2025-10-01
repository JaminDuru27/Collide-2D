
import { feedback } from "../../components/DRAW/feedback"
import { Options } from "../../components/DRAW/options"
import { EventHandler } from "../DRAW/events"

export function Select(Instance){
    let options 
    const res={
        boxes: [],
        boxesFlat: [],
        translatedisplacement: 3,
        showOptions: true,
        copyArray: [],
        start: false,
        load(){
        },
        selectHighlightGridBox(){
          this.boxes = [[Instance.highlight.target]]
          this.boxesFlat = this.boxes.flat()
        },
        
        selectdown(){
          if(!Instance.highlight.target)return
          this.sindx = Instance.highlight.target.indx
          this.sindy = Instance.highlight.target.indy
        },
        selectmove(){
          if(!Instance.highlight.target)return
          this.signx = Math.sign(Instance.highlight.target.indx - this.sindx)
          this.signy = Math.sign(Instance.highlight.target.indy - this.sindy)
          this.sindw = (Instance.highlight.target.indx - this.sindx) * this.signx  
          this.sindh = (Instance.highlight.target.indy - this.sindy) * this.signy
          this.sindw *= this.signx
          this.sindh *= this.signy 
          
          //handle constraints
          if(this.signx > 0 && this.signy > 0){
            this.sindw ++
            this.sindh ++
          }else if(this.signx < 0 && this.signy > 0)this.sindh ++
          else if(this.signx > 0 && this.signy < 0){
            this.sindw ++
          }else if(this.signx > 0 && this.signy === 0)
          this.sindw ++
          
          //other contraints
          if(this.sindw === 0)this.sindw = 1
          if(this.sindh === 0)this.sindh = 1
        },
        selectup(){
          this.normalize()
          this.populate()
          this.sindx = undefined
          this.sindw = undefined
          this.sindy = undefined
          this.sindh = undefined
        },
        events(){
          EventHandler(window, '', 'keydown', (e)=>{
            if(e.key === `Control`){
              this.cancelCheck = false
              this.startChecking = true
            }
          })
          EventHandler(window, '', 'keyup', (e)=>{
              this.startChecking = false
          })
          EventHandler(Instance.ui.ctx.canvas, '', 'dblclick',  (e)=>{
              this.cancelCheck = true
          })
          if('ontouchstart' in window){
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'touchstart', (e) => {
              this.selectdown(e)
            })
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'touchmove', (e) => {
              this.selectmove(e)
            
            })
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'touchend', () => {
              this.selectup()
            })
          }else{
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'mousedown', (e) => {
              if(e.button !== 0)return
              this.selectdown(e)
            })
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'mousemove', (e) => {
              if(e.button !== 0)return
              this.selectmove(e)
            })
            EventHandler(Instance.ui.ctx.canvas, 'selectdown', 'mouseup', (e) => {
              if(e.button !== 0)return
              this.selectup(e)
            })
            
          }
          EventHandler(Instance.ui.ctx.canvas, 'dblclickselect', 'dblclick', ()=>{
              this.boxes = []
              this.boxesFlat = []
          })
        },
        markTiles(){
        },
        normalize(){
          const target= Instance.highlight.target
          if(!target)return
          const arrx  = [this.sindx, target.indx,]
          const arry  = [this.sindy, target.indy,]
          this.sindx = Math.min(...arrx.map(e=>e))
          this.sindy = Math.min(...arry.map(e=>e))
          this.sindw = (this.sindw < 0)? this.sindw *= -1 : this.sindw
          this.sindh = (this.sindh < 0)? this.sindh *= -1 : this.sindh
        },
        populate(){
          this.boxes = []
          const grid = Instance.grid
          for(let y = 0; y< this.sindh; y++){
            const arr = []
            for(let x = 0; x< this.sindw; x++){
              const box = {
                x: grid.x + grid.cw * (x + this.sindx),
                y: grid.y + grid.ch * (y + this.sindy),
                w: grid.cw, h: grid.ch,
                indx: x + this.sindx,
                indy: y + this.sindy,
              }
              arr.push(box)
            }
            if(arr.length > 0){
              this.boxes.push(arr)
            }
           }
          this.boxesFlat = this.boxes.flat()
        },
        updateSelectBoxesIndex(){
            
        },
        gui(){
            },
        draw(ctx){
            const grid = Instance.grid
            if(this.sindx !== undefined && this.sindy !== undefined)
            if(this.sindw !== undefined && this.sindh !== undefined){
              const box =  grid.boxes[this.sindy][this.sindx]
              ctx.strokeStyle = `blue`
              ctx.strokeRect(box.x, box.y, box.w * this.sindw, box.h * this.sindh )
              if(this.x && this.y && this.w && this.h){
                  ctx.strokeStyle = `blue`
                  ctx.strokeRect(this.x, this.y, this.w, this.h)
              }
            }
            this.boxesFlat.forEach(bx=>{
                if(!bx)return
                if(grid.boxes.length-1 < bx.indy) return
                if(grid.boxes[bx.indy]?.length-1 < bx?.indx) return
                ctx.beginPath()
                ctx.fillStyle = ` #0026a13e`
                bx.y = grid.boxes[bx.indy][bx.indx]?.y
                bx.x = grid.boxes[bx.indy][bx.indx]?.x
                bx.w = grid.boxes[bx.indy][bx.indx]?.w
                bx.h = grid.boxes[bx.indy][bx.indx]?.h
                ctx.fillRect(bx.x, bx.y, bx.w, bx.h)
                ctx.globalAlpha = 1
                ctx.setLineDash([])
            })
            //highlighht all boxes
            ctx.strokeStyle = ` #0099f2d1`
            const mx = Math.min(...this.boxesFlat.map(e=>e.indx))
            const my = Math.min(...this.boxesFlat.map(e=>e.indy))
            const wx = Math.max(...this.boxesFlat.map(e=>e.indx)) - mx + 1
            const wy = Math.max(...this.boxesFlat.map(e=>e.indy)) - my + 1
            if(mx === Infinity  || my === Infinity)return
            const box = grid.boxes[my][mx]
            ctx.strokeRect(box.x, box.y, grid.cw * wx, grid.ch * wy)

            
        },
        scroll(){
            
        },
        update({ctx}){
            this.draw(ctx)
            this.scroll()
            this.updateSelectBoxesIndex()
        },
    }
    res.load()
    return res
}