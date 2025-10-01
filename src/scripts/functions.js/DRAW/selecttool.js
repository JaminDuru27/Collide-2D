import { EventHandler } from "./events.js"
import { draw } from "./instances.js"
import { Shortcuts } from "./shortcuts.js"
import { Sprite } from "./sprite.js"
export function Select(Instance, Tools, name){
    const res = {
        name,
        load(){
            //SINCE IT WAS ADDED IN A UI FUNC IT WILL LOAD EACH OPEN
            this.ui()
            this.events()
            this.shortcuts()
        },
        enter(){
            document.body.style.cursor = `pointer`
        },
        shortcuts(){
            this.shortcut = Shortcuts()
            this.shortcut.add(`nn`, [`d`, `q`], ()=>{
                const boxes = []    
                Instance.select.boxes.forEach((col, y)=>{
                    boxes.push(col.filter((row)=>row.indy === Instance.select.boxesFlat[0].indy))
                    boxes.push(col.filter((row)=>row.indy === Instance.select.boxesFlat[Instance.select.boxesFlat.length -1].indy ))
                    boxes.push(col.filter((row)=>row.indx === Instance.select.boxesFlat[0].indx))
                    boxes.push(col.filter((row)=>row.indx === Instance.select.boxesFlat[Instance.select.boxesFlat.length-1].indx))
                })
                if(boxes.length <= 0)return
                boxes[0].shift()
                boxes[0].pop()
                boxes[boxes.length-1].shift()
                boxes[boxes.length-1].pop()
                Instance.select.boxes = boxes
                Instance.select.boxesFlat = boxes.flat()
            })
        },
        events(){
            const short = Shortcuts()
            short.add('paint', ['d'], ()=>{
                this.drawAllowed = true
            })
        },
        ui(){
            this.dom = Tools.options.add(this.name[0], ()=>{
                Tools.current = this
                this.enter()
            }, '../assets/icons/select.png')
            this.dom.description = `ShortCut(D) <br> Select Canvas Elements Canvas. Click button to select Tiles and Collision on to canvas`
            this.dom.popupdescription = `Select (D) <br>, Hollow Middle (D + Q)`
        },
        draw(){
            if(!this.drawAllowed)return
            const flat = draw.instance.highlight.boxesFlat
            if(!flat)return
            const select = draw.instance.select
            flat.forEach(bx=>{
                const box = {...bx}
                if(select.boxesFlat.filter((e)=>e.indx === box.indx && e.indy === box.indy).length <= 0)
                select.boxesFlat.push(box)
            })
        },
        update(){
            this.draw()
            this.drawAllowed = false

        }
    }
    res.load()
    return res
}

