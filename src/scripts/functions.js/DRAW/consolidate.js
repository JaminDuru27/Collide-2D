import { blank } from "../../components/DRAW/blank.js"
import { domextract } from "../../components/DRAW/domextract.js"
import { feedback } from "../../components/DRAW/feedback.js"
import { makedraggable } from "../../components/DRAW/makedraggable.js"
import { events } from "./events.js"
import { GenerateId } from "./generateId.js"
import { draw } from "./instances.js"
let options
export function Consolidate(){
    const res = {
        style(){return `background: white; position: absolute; z-index: 10;`},
        optionsstyle(){return`backdrop-filter: blur(27px);border-radius: 5px; border: 1px solid grey;position: absolute; z-index: 5; gap: 1rem;width:30vw; height: 50vh; background: #000000a1; display: flex; flex-direction: column; align-items: center; justify-content: center;`},
        imgstyle(){return`width: 5vw; height: 5vw; border-radius: 50%; bordr: 2px solid grey`},
        btnwrapstyle(){return`display: flex; justify-content: space-between; align-items: center;`},
        textstyle(){return`text-align: center;color: grey; width: 100%; font-size: .7rem; padding: .5rem`},
        buttonstyle(){return`display: flex; justify-content: center; align-items: center;width: 47%; font-size: .7rem; height: 2.5rem;color: grey; border-radius: .5rem; border: 2px solid grey`},
        exitstyle(){return`cursor: pointer;clip-path:polygon(20% 0%, 0% 20%, 40% 50%, 0% 80%, 20% 100%, 50% 60%, 80% 100%, 100% 80%, 60% 50%, 100% 20%, 80% 0%, 50% 40%);width: 1vw;height: 1vw; background: black;position: absolute;top: 5px;right: 5px;`},
        mimeType : 'image/png',
        load(){
            const data = this.getSrcData()
            return {...this}
        },
        getSrcData(){
            this.src = this.getDataURL(this.getSprites2d()) // correct
            return this.src
        },
        options(){
            options?.remove()
            options = document.createElement(`div`)
            options.classList.add(`options`)
            options.setAttribute(`style`, this.optionsstyle())
            options.innerHTML += `
            <div class='exit' style='${this.exitstyle()}'></div>
            <img class ='img' src='./assets/icons/check (1).png' style = '${this.imgstyle()}'>
            <div class='text' style='${this.textstyle()}'>Image SuccessFully Consolidated ! </div>
            <div class='wrap' style='${this.btnwrapstyle()}'>
            <div class='close' style='${this.buttonstyle()}'>Close</div> 
            <div class='consolidate' style='${this.buttonstyle()}'>Consolidate</div> 
            </div>
            `
            document.body.append(options)
            const dom = domextract(options).object
            makedraggable(options, options, false, true)
            this.events(options,dom)
        },
        events(e, dom){
            dom.exit.onclick = ()=>{this.remove()}
            dom.close.onclick = ()=>{this.remove()}
            dom.wrap.onclick = ()=>{this.download()}
        },
        remove(){
            options?.remove()
        },
        getDataURL(data){
            if(!data)return
            const canvas = document.createElement(`canvas`)
            canvas.setAttribute(`style`, this.style())
            canvas.width = data.absw * data.cw
            canvas.height = data.absh * data.ch
            const ctx = canvas.getContext(`2d`)
            ctx.imageSmoothingEnabled = false
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            data.array.flat().forEach(sprite=>{
                ctx.drawImage(sprite.image, sprite.sx, sprite.sy, sprite.sw, sprite.sh,
                    sprite.indx * data.cw,
                    sprite.indy * data.ch,
                    data.cw * sprite.widthMult, 
                    data.ch * sprite.heightMult
                )
            })

            return canvas.toDataURL(this.mimeType)
        },
        getSprites1d(){
            const select = draw.instance.select
            const boxes = select.boxesFlat
            const name = draw.instance.layers.layer.name
            const array = draw.instance.library.find(`spriteLayer`).object.meta.array
            const layer = array.filter(e=>e.name === name)[0]?.array
            const data = draw.instance.assets.domObj?.getData()
            if(!data)return []
            if(!layer)return []
            let filtered = []
            boxes.forEach(box => {
                const filter =  layer
                .filter(spr=>(spr.indx === box.indx && spr.indy === box.indy))
                .map(spr=> (spr) ? {
                    indx: spr.indx, indy: spr.indy, sx: spr.sx, sy: spr.sy,
                    widthMult: spr.widthMult, heightMult: spr.heightMult,
                    image: spr.image, sw: data.general.imgcw, 
                    sh: data.general.imgch, 
                }:null)
                if(filter.length > 0)
                filtered.push(filter)    
            });
            filtered = filtered.flat()
            return filtered
        },
        getSprites2d(){
            const select = draw.instance.select
            const selected = select.boxes

            const array= [...this.getSprites1d()]
             const indx = array[0].indx
            const indy = array[0].indy

            const newArray = []
            let absw = 0
            let absh = 0
            array.forEach(sprite=>{
                sprite.indx = sprite.indx - indx
                sprite.indy = sprite.indy - indy
                const maxindx = sprite.indx + sprite.widthMult
                const maxindy = sprite.indy + sprite.heightMult
                if(maxindx > absw)absw = maxindx
                if(maxindy > absh)absh = maxindy
            })  
            for(let y = 0; y<= selected.length -1; y++ ){
                newArray.push(array.filter(spr=>spr.indy === y))
            }

            return {
                array: newArray,
                indw: selected[0].length, indh: selected.length,
                cw: draw.instance.grid.cw, absw,
                ch: draw.instance.grid.ch, absh
            }
        },
        getImage(w, h){
            if(!this.src)return
            const img = new Image()
            img.src = this.src
            img.width = w
            img.height = h
            return img
        },
        download(w = 500, h =  500, title = `consolidate.png`){
            if(!this.src)return
            const a = document.createElement(`a`)
            a.href = this.src
            a.download = title
            a.click()
            return {src: this.src, img:this.getImage(src,w, h) }
        }
        
    }
    return res.load()
}