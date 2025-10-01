import { CollisionLab } from "../../components/DRAW/collisionlab.js"
import { feedback } from "../../components/DRAW/feedback.js"
import { Options } from "../../components/DRAW/options.js"
import { Consolidate } from "./consolidate.js"
import { EventHandler } from "./events.js"
import { Sprite } from "./sprite.js"

export function Select(Instance){
    let options 
    const res={
        boxes: [],
        boxesFlat: [],
        translatedisplacement: 3,
        showOptions: true,
        copyArray: [],
        load(){
          this.options = `notshown`
        },
        optionsUpdate(){
          if(!this.showOptions)return
          if(this.boxesFlat.length > 0 && this.options === `notshown`){
            //show options once 
            options = Options({to: document.body, name : `selectoptions`})
            this.setOptions(options)
            this.options = `isshown`
          }else if(this.boxesFlat.length <= 0 && this.options === `isshown`){
          //remove options once
            if(options){
              options?.remove()
            }
            this.options = `notshown`
          }
        },
        optionDelete(){
            let id = Instance.layers?.layer?.id
            if(!id) id = Instance?.layers[0]?.id
            if(!id)return
            const array = Instance.library.find(`spriteLayer`).object.meta.array
            const layer = array.filter(e=>e.name === name)[0]?.array
            if(!layer)return
            this.boxesFlat.forEach(bx =>{
              const filter = layer.forEach((sprite,x)=>{
                if(sprite.indx === bx.indx && sprite.indy === bx.indy)layer.splice(x, 1)
              })  
            })
        },
        optionSpread(){
          const domobj = Instance.assets.domObj
          if(!domobj)return
          if(this.boxes.length <= 0)return
          if(!domobj?.select)return
          if(domobj?.select?.boxesFlat?.length <= 0)return
          const box = domobj.select.boxesFlat[0]
          const indx = (box.indx <= 0) ? box.indx = 1 : box.indx  
          const indy = (box.indy <= 0) ? box.indy = 1 : box.indy
          const data = domobj.getData()  
          const sx = data.selectBox.indx  * data.general.imgcw 
          const sy = data.selectBox.indy  * data.general.imgch 
          Instance.highlight.target = this.boxesFlat[0]
          const sprite = Sprite({sx, sy, widthMult:this.boxes[0].length, heightMult: this.boxes.length})

          },
        getCopyArray(){
          if(this.boxesFlat.length <= 0)return
          const copyarray = []
          let id = Instance.layers?.layer?.id
          if(!id) id = Instance?.layers[0]?.id
          if(!id)return []
          const array = Instance.library.find(`spriteLayer`).object.meta.array
          const layer = array.filter(e=>e.id === id)[0]?.array
          this.boxesFlat.forEach(box=>{
            if(!layer)return []

            const filter = [] 
            layer.forEach(e=>{
              if(e.indx === box.indx && e.indy === box.indy)
                filter.push(e)
            })
            if(filter.length > 0)
            copyarray.push(filter[0])
          })
          return copyarray
        },        
        optionCut(del){
          const copyArray = this.getCopyArray()
          if(this.copyArray){
            this.copyArray = copyArray
            this.optionDelete()
          }
        },
        selectHighlightGridBox(){
          this.boxes = [[Instance.highlight.target]]
          this.boxesFlat = this.boxes.flat()
        },
        optionCopyToRight(){
          if(this.boxesFlat.length <= 0)return
          if(!this.boxes[0])return
          const indx = this.boxesFlat[0].indx
          const indy = this.boxesFlat[0].indy
          const nx = Instance.grid.nx
          const maxBoxX = this.boxes[0][this.boxes[0].length-1]
          if((maxBoxX.indx + 1) + this.boxes[0].length > nx) {
            Instance.grid.nx += this.boxes[0].length + 1
            Instance.grid.populate()
          }
          this.optionCopy()
          Instance.highlight.target = {...maxBoxX, indx:maxBoxX.indx + 1}
          this.boxes.forEach(col=>{
            col.forEach((row, x)=>{
              row.indx += this.boxes[0].length
            })
          })
          this.boxesFlat = this.boxes.flat()
          this.optionPaste()


        },
        optionCopyToBottom(){
          if(this.boxesFlat.length <= 0)return
          const indx = this.boxesFlat[0].indx
          const indy = this.boxesFlat[0].indy
          const ny = Instance.grid.ny
          const maxBoxY = this.boxes[this.boxes.length-1][this.boxes[this.boxes.length-1].length-1]
          if((maxBoxY.indy + 1) + this.boxes.length > ny) {
            Instance.grid.ny += this.boxes.length 
            Instance.grid.populate()
          }
          this.optionCopy()
          Instance.highlight.target = {...maxBoxY, indx: this.boxes[0][0].indx, indy:maxBoxY.indy + 1}
          this.boxes.forEach(col=>{
            col.forEach(row=>{
              row.indy += this.boxes.length
            })
          })
          this.boxesFlat = this.boxes.flat()
          this.optionPaste()

        },
        optionCopy(){
          const copyArray = this.getCopyArray()
          if(copyArray){
            this.copyArray = copyArray
          }
          },
        optionPaste(){
          if(this.boxesFlat.length <= 0)
          this.selectHighlightGridBox()
          let id = Instance.layers?.layer?.id
          if(!id) id = Instance?.layers[0]?.id
          if(!id)return
          const array = Instance.library.find(`spriteLayer`).object.meta.array
          const layer = array.filter(e=>e.id === id)[0]?.array
          if(this.boxesFlat.length > 0)
          this.copyArray.forEach(obj=>{
            if(!obj)return
            const sprite = {
              ...obj,
              indx: this.boxesFlat[0].indx + (obj.indx - this.copyArray[0].indx),
              indy: this.boxesFlat[0].indy + (obj.indy - this.copyArray[0].indy),
            }
            layer.push(sprite)
          })
        },
        selectAll(){
          this.boxes = []
            this.boxesFlat= []
            const grid = Instance.grid
            grid.boxes.forEach(col=>{
              const arr = []
              col.forEach(box=>{
                const b = {
                  x: box.x, y: box.y, w: box.w,
                  h: box.h, indx: box.indx, indy: box.indy
                }
                arr.push(b)
              })
              if(arr.length > 0){
                this.boxes.push(arr)
              }
            })
            this.boxesFlat = this.boxes.flat()
        },
        setOptions(options){
          const craft = options.add('craft', ()=>{
            const lab = CollisionLab({Instance, to: document.body, allowgui: true })
            lab.type.widthMult = this.boxes[0].length
            lab.type.heightMult = this.boxes.length
          })
          const con = options.add('consolidate', ()=>{
              Consolidate().options()
            },'../assets/icons/consolidate.png')
            con.popupdescription = `Consolidate Selected  <br> Shortcut (Alt + 1)`
          const copyr = options.add('copyRight', ()=>{
              this.optionCopyToRight()
            },'../assets/icons/imageright.png')
            copyr.popupdescription = `Copy Selected Tiles to Right  Shortcut(D + ArrowRight)`
          const copyb = options.add('copyBottom', ()=>{
              this.optionCopyToBottom()
            },'../assets/icons/downimage.png')
            copyb.popupdescription = `Copy Selected Tiles to Bottom Shortcut(D + ArrowDown)`
          const del = options.add('delete', ()=>{
              this.optionDelete()
            },'../assets/icons/bin.png')
          del.popupdescription = `Delete Selected  <br> Shortcut (Del)`

          const spread = options.add('spread', ()=>{
            this.optionSpread()
          },'../assets/icons/reduce.png')
          spread.popupdescription = `Spread Image To Selected Side  <br> Shortcut (R)`

          const cut = options.add('cut', ()=>{
            this.optionCut(del)
          },'../assets/icons/cut.png')
          cut.popupdescription = `Cut Selected <br> Shortcut (X)`

          const copy = options.add('copy', ()=>{
            this.optionCopy()
          },'../assets/icons/copy.png')
          copy.popupdescription = `Copy Selected  <br> Shortcut (C)`

          const paste = options.add('paste', ()=>{
            this.optionPaste()
          },'../assets/icons/paste.png')
          paste.popupdescription = `Paste Selected  <br> Shortcut (V)`
        },
        shortcuts(){
          Instance.shortcuts.add(`copyr`, [`d`, `ArrowRight`, Instance.ui.ctx.canvas], ()=>{
            this.optionCopyToRight()
          })
          Instance.shortcuts.add(`copyb`, [`d`, `ArrowDown`, Instance.ui.ctx.canvas], ()=>{
            this.optionCopyToBottom()
          })

          Instance.shortcuts.add(`selectall`, [`a`], ()=>{
            this.selectAll()
          })
          Instance.shortcuts.add('consolidate', [`Alt`, `1`, Instance.ui.ctx.canvas], ()=>{
              if(Instance.select.boxesFlat.length <= 0){
                this.selectAll()
                Consolidate().options()
              }else{
                Consolidate().options()
              }
          })
          Instance.shortcuts.add('delete', [`Delete`, Instance.ui.ctx.canvas], ()=>{
              this.optionDelete()
          })
          Instance.shortcuts.add('spread', [`r`, Instance.ui.ctx.canvas], ()=>{
              this.optionSpread()
          })
          Instance.shortcuts.add('copy', [`c`, Instance.ui.ctx.canvas], ()=>{
              this.optionCopy()
              feedback({message: `copied`})
          })
          Instance.shortcuts.add('cut', [`x`, Instance.ui.ctx.canvas], ()=>{
            this.optionCut()
            feedback({message: `cut`})
          })
          Instance.shortcuts.add('paste', [`v`, Instance.ui.ctx.canvas], ()=>{
            this.optionPaste()
          })
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
              ctx.strokeStyle = `green`
              ctx.strokeRect(box.x, box.y, box.w * this.sindw, box.h * this.sindh )
              if(this.x && this.y && this.w && this.h){
                  ctx.strokeStyle = `green`
                  ctx.strokeRect(this.x, this.y, this.w, this.h)
              }
            }
            this.boxesFlat.forEach(bx=>{
                if(!bx)return
                if(grid.boxes.length-1 < bx.indy) return
                if(grid.boxes[bx.indy]?.length-1 < bx?.indx) return
                ctx.beginPath()
                ctx.strokeStyle = `green`
                ctx.fillStyle = `#00800063`
                bx.y = grid.boxes[bx.indy][bx.indx]?.y
                bx.x = grid.boxes[bx.indy][bx.indx]?.x
                bx.w = grid.boxes[bx.indy][bx.indx]?.w
                bx.h = grid.boxes[bx.indy][bx.indx]?.h
                ctx.fillRect(bx.x, bx.y, bx.w, bx.h)
                ctx.globalAlpha = 1
                ctx.setLineDash([])
                ctx.moveTo(bx.x, bx.y)
                ctx.lineTo(bx.x + bx.w, bx.y + bx.h)
                ctx.stroke()
                ctx.closePath()
            })
            
        },
        scroll(){
            
        },
        update({ctx}){
            this.draw(ctx)
            this.scroll()
            this.updateSelectBoxesIndex()
            this.optionsUpdate()
        },
    }
    res.load()
    return res
}