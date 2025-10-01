import { EventHandler } from "../../functions.js/DRAW/events.js"
import { GenerateId } from "../../functions.js/DRAW/generateId.js"
import { getCanvas } from "../../functions.js/DRAW/getCanvas.js"
import { Grid } from "../../functions.js/DRAW/grid.js"
import { GUI } from "../../functions.js/DRAW/gui.js"
import { Highlight } from "../../functions.js/DRAW/highlight.js"
import { draw } from "../../functions.js/DRAW/instances.js"
import { Mouse } from "../../functions.js/DRAW/mouse.js"
import { Select } from "../../functions.js/DRAW/select.js"
import { Shortcuts } from "../../functions.js/DRAW/shortcuts.js"
import { domextract } from "./domextract.js"
import { feedback } from "./feedback.js"
let live
export function Imglab({to, allowgui, folder, file, src, showtitle = true, set}){
    const res ={
        ui:{},
        folder,
        shortcutsHandler: Shortcuts(),
        speed: 4, sx:0, sy: 0, w: 300, h: 300,
        style(w, h){return `z-index: 9;display: flex;justify-content: space-between; align-items:center; overflow:hidden;background: #48092f; width: ${w}px; height: ${h}px;position: absolute; top: 0; left: 0; `},
        sidestyle(){return `height: 100%; background: transparent; border-right: 1px solid white;`},
        exitstyle(){return `position: absolute; top: .5rem; left: .5rem;width: 2vw;height: 2vw;opacity: .5; ${(!allowgui)?'scale:.5;': ''}`},        
        canvasstyle(){return`width: 100%; height: 100%; background: transparent; position: relative; top: 50%; left: 50%; transform: translate(-50%, -50%);`},
        buttonstyle(){return `color: #fff;border: 2px solid #a61c79;position: absolute; bottom: 2rem; right: 2rem;width: 5rem; height: 3rem; display: flex; justify-content: center; align-items: center; border-radius: 1rem;`},
        titlestyle(){return `color: #e91e63;position: absolute; top: 2rem; left:4rem;`},
        changeName(){feedback({message: 'change name here', placeholder:'here', callback: (e)=>{this.name = e.value }})},
        load(){
            this.importImage()
            this.elementsUi()
            domextract(this.element, `classname`, this.ui)
            this.getCanvas()
            this.events()
            this.shorcuts()
            this.mouse = Mouse(this)
            this.grid = Grid(this)
            this.grid.events()
            this.grid.bgColor = `transparent`
            this.grid.showgrid = true
            this.grid.showbg = true
            this.highlight = Highlight(this)
            this.select = Select(this)
            this.select.showOptions = false
            this.post()
            this.gui()
            setTimeout(()=>{this.set()}, 10)
        },
        updateGridSize(){
            this.grid.w = this.w
            this.grid.h = this.h
            this.grid.cw = this.w / this.grid.nx
            this.grid.ch = this.h / this.grid.ny
            this.grid.populate()
            this.grid.updateinit()
        },
        shorcuts(){
            const next  = ()=>{
                this.grid.alwayscenter = false
                this.grid.populate()
                this.grid.center()
            }
            this.shortcutsHandler.add('imglabtranslate', [`z`, `o`, this.ui.dom.canvas], ()=>{
                this.w += 2
                this.h += 2
                document.querySelector(`.w`).value = this.w
                document.querySelector(`.h`).value = this.h
                this.updateGridSize()
            }, true)
            this.shortcutsHandler.add('imglabtranslate', [`z`, `i`, this.ui.dom.canvas], ()=>{
                this.w -= 2
                this.h -= 2
                document.querySelector(`.w`).value = this.w
                document.querySelector(`.h`).value = this.h
                this.updateGridSize()
            }, true)
            this.shortcutsHandler.add('imglabtranslate', [`ArrowUp`, this.ui.dom.canvas], ()=>{
                this.grid.y -= this.speed
                if(this.select.sy) this.select.sy -= this.speed
                next()
            }, true)
            this.shortcutsHandler.add('imglabtranslate', [`ArrowLeft`, this.ui.dom.canvas], ()=>{
                this.grid.x -= this.speed
                if(this.select.sx) this.select.sx -= this.speed
                next()
            }, true)
            this.shortcutsHandler.add('imglabtranslate', [`ArrowDown`, this.ui.dom.canvas], ()=>{
                this.grid.y += this.speed
                if(this.select.sy) this.select.sy += this.speed
                next()
            }, true)
            this.shortcutsHandler.add('imglabtranslate', [`ArrowRight`, this.ui.dom.canvas], ()=>{
                this.grid.x += this.speed
                if(this.select.sx) this.select.sx += this.speed
                next()
            }, true)

        },
        
        importImage(){
            this.image = new Image()
            if(!src){
                const input =  document.createElement(`input`)
                input.type= `file`
                input.onchange = (e)=>{
                    const file = e.target.files[0]
                    if(e.target.files.length <= 0){
                        this.remove()
                        return
                    }
                    this.name = file.name
                    const reader = new FileReader()
                    reader.onload = function(e){
                        const base64 = e.target.result
                        this.base64= base64
                        res.image.src = base64
                        res.src = base64
                        res.image.onload = ()=>{
                        res.imgw = res.image.width
                        res.imgh = res.image.height
                        res.sw = res.imgw
                        res.sh = res.imgh
                        
                        res.loaded = true
                        const jsonData = JSON.stringify({image: base64})
                        res.setgridcellsize(16)
                        
                    
                    }
                    res.image.src = base64
                    }
                    if(file)
                        reader.readAsDataURL(file)
                    
                    
                }
                input.click()
            }else{
                this.image.onload = ()=>{
                    this.imgw = this.image.width
                    this.imgh = this.image.height
                    this.sw = this.imgw
                    this.sh = this.imgh
                    this.loaded = true
                    draw.instance.library.find(file, (obj, key)=>{
                        this.sourcerefselected = obj[key].selectBox
                        this.sourcerefgeneral = obj[key].general
                        this.sourceref = obj[key].sourceData
                    })
                }
                this.image.src = src
                this.src = src
            }
        },
        post(){
            this.mouse.events()
            this.select.events()
        },
        set(){
            for(let x in set){
                const obj = set[x]
                if(!obj.var){
                    this[obj.name] = obj.val
                }
                if(obj.var)this[obj.name][obj.var] = obj.val
                if(obj.name === `grid`){
                    this.grid.populate()
                    this.grid.center()
                    this.grid.updateinit()
                    this.grid.updatezoom()
                }
            }
            this.updateGridSize()
        },
        elementsUi(){
            if(live)live.remove()
            live = this
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style(to.clientWidth, to.clientHeight + 1))
            this.element.classList.add(`imglab`)
            this.element.innerHTML += `
            <div class='exit' style='${this.exitstyle()}'></div>
            <div class='left' style='${this.sidestyle()} ${(allowgui)?'width:50%;':'width: 100%;'}'>
            <canvas class='canvas' style='${this.canvasstyle()} '></canvas>
            </div>
            <div class='right' style='${this.sidestyle()} ${(allowgui)?'width:50%;':'width:0; border:none;'}'></div>
            `
            if(folder){
                this.element.innerHTML += `
                <div class='submitbtn' style ='${this.buttonstyle()}'>create</div>`
            }
            if(showtitle){
                this.element.innerHTML += `
                <div class='title' style ='${this.titlestyle()}'>${this.name}</div>`
            }
            to.append(this.element)
            
        },
        setSizeNumber(e){
            feedback({message: `enter cell size (px)`, inputtype:`number`,placeholder:`here`, callback:(e)=>{
                this.setgridcellsize(+(e.target.value))
            }})
        },
        setgridcellsize(value){
            const nx = Math.floor(this.imgw / value)
            const ny = Math.floor(this.imgh / value)
            this.grid.nx = nx
            this.grid.ny = ny
            this.updateGridSize()
        },
        gui(){
            this.mouseguifolder = GUI('Mouse', this.ui.dom.right)
            const prevstyle = this.mouseguifolder.wrapstyle()
            this.mouseguifolder.wrapstyle = ()=>{return prevstyle + `border:2px solid !important;background: none`}
            this.mouseguifolder.add(this.mouse, 'rad', `radius`, [1, 12, 0.1])
            this.mouseguifolder.add(this.mouse  , 'color', `color`)
            this.gridguifolder = GUI('Grid', this.ui.dom.right)
            const prev2style = this.gridguifolder.wrapstyle()
            this.gridguifolder.wrapstyle = ()=>{return prev2style + `border:2px solid !important;background: none`}
            this.gridguifolder.add(this.grid, 'nx', `nx`, [1, 100, 1]).after = ()=>{
                this.updateGridSize()
            }
            this.gridguifolder.add(this.grid, 'ny', `ny`, [1,100, 1]).after = ()=>{
                this.updateGridSize()
            }
            const w = this.gridguifolder.add(this, 'w', `width`, [1, 2000, 1])
            w.className = `w`
            w.after = ()=>{
                this.updateGridSize()
            }
            const h = this.gridguifolder.add(this, 'h', `height`, [1, 2000, 1])
            h.className = `h`
            h.after = ()=>{
                this.updateGridSize()
            }
            this.gridguifolder.add(this.grid , 'color', `color`)
            this.gridguifolder.add(this, 'setSizeNumber', `Set Cell Size`)
        },
        remove(){
            this.element.remove()
            clearInterval(this.interval)
            live = null
        },
        events(){
            this.ui.dom.exit.onclick = ()=>{
                this.remove()
            }
            if(showtitle)
            EventHandler(this.ui.dom.title, 'dd', 'click', ()=>{
                this.changeName()
            })
            if(folder)
            EventHandler(this.ui.dom.submitbtn, 'submitlab', 'click',  ()=>{
                if(!this.src){
                    feedback({message:`You didnt pick anything!`, })
                    this.remove()
                    return
                }
                const retrievedData = this.getData()
                const data = {
                    object: retrievedData,
                    key: this.name
                }
                draw.instance.library.addFile(this.name, folder, `imagefile`)
                draw.instance.library.writeFile(this.name,data.key, data.object)
                
                this.remove()

                })
                
        },
        getData(){ 
            const data = {
                general: {
                    filename: this.name, id: GenerateId(),
                    src: this.src, url: this.src, image: this.image, img: this.image,
                    imgw: this.imgw, imgh: this.imgh, 
                    nx: this.grid.nx, ny: this.grid.ny, h: this.grid.h,
                    cw: this.grid.cw, ch: this.grid.ch, w: this.grid.w,
                },
                

            }
            if(this.select.boxesFlat.length)
            data.selectBox = {
                indx: (this.select.boxes[0][0].x - this.grid.x)/ this.grid.cw,
                indy: (this.select.boxes[0][0].y - this.grid.y)/ this.grid.ch,
                nx: this.select.boxes[0].length,
                ny: this.select.boxes.length,
            }
            else{
                data.selectBox = {
                    indx: 0,indy: 0,nx: data.general.nx,ny: data.general.ny,
                }
            }
            
            data.general[`imgcw`] = data.general.imgw / data.general.nx
            data.general[`imgch`] = data.general.imgh / data.general.ny
            data.selectBox[`imgnx`] = data.general[`imgcw`] * data.selectBox.indx
            data.selectBox[`imgny`] = data.general[`imgch`] * data.selectBox.indy


            return data
        },
        getCanvas(){
            this.canvas = this.ui.dom.canvas
            this.canvasObj = getCanvas(this.canvas, this,)
            this.ui.ctx = this.canvasObj.ctx
        },
        draw(){
            if(!this.loaded)return
            this.ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh,this.grid.x, this.grid.y, this.w, this.h)
        },

        update(){
            this.canvasObj.clear()
            this.grid.update({ctx:this.ctx})
            this.grid.bgColor = `transparent`
            this.draw()
            this.mouse.update({ctx:this.ctx})
            this.highlight.update({ctx:this.ctx})
            this.select.update({ctx:this.ctx})
            this.updateTitle()
            this.shortcutsHandler.update()

        },
        updateTitle(){
            if(this.ui.dom.title){
                this.ui.dom.title.textContent = this.name + `- W: ${this.imgw}px H: ${this.imgh}px`
            }
        },
        startInterval(){
            this.interval = setInterval(()=>{
                this.update()
            }, 60)
        }
    }
    res.load()
    res.startInterval()
    return res 
}


