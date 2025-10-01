import { EventHandler, events } from "../../../functions.js/DRAW/events"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { domextract } from "../../DRAW/domextract"
export function UIMaker(){
    const res = {
        name: `UIMaker`,
        style(){return `position: absolute;color: #fff;top: 50%;left: 50%;transform: translate(-50%, -50%);width: 100%;height: 100% ;background: #00000038;z-index: 100;border-radius: .5rem;backdrop-filter: blur(25px);border: 1px solid #ffffff33;display: grid;grid-template-columns: 1fr 1fr 1fr 1fr;grid-template-rows: 1fr 1fr 1fr;`},
        propsstyle(){return ` padding: .5rem; padding-top: 1.2rem;position: relative; border-radius: .5rem;border: 1px solid #ffffff24;grid-column: 1 / 2;grid-row: 1 / 4;`},
        drawstyle(){return `backdrop-filter: blur(15px);overflow: scroll;position: relative;grid-column: 2 / 5;grid-row: 1 / 3;border-radius: .5rem;border: 1px solid #ffffff24;`},
        animationsstyle(){return `padding: .5rem; position: relative; border-radius: .5rem;border: 1px solid #ffffff24;grid-column: 2 / 5;grid-row: 3 / 4;`},
        templatestyle(){return `display: none;position: absolute;right: 0;border-left: 1px solid #ffffff2e;top: 0;width: 35%;height: 100%;background: #00000024;backdrop-filter: blur(20px);`},
        animcontentstyle(){return `padding: .5rem; display: flex;justify-content: space-evenly;padding: .5rem .2rem;`},
        headstyle(){return ``},
        headswraptyle(){return `cursor: pointer;display: flex;justify-content: space-evenly;padding: .5rem .2rem;color: #ffffff;font-size: 0.7rem;text-transform: uppercase;opacity: .5;`},
        addstyle(){return `  width: 10%;height: 10%;background: #ffffff08;position: absolute;display: flex;border: 1px solid #ffffff1f;justify-content: center;align-items: center;bottom: 5px; right: 5px;border-radius: .5rem;`},
        propsstylingstyle(){return `margin: .5rem 0;`},
        inputstyle(){return `margin-top: .5rem;background: #ffffff0f;padding: .2rem;height: 1.5rem;border-radius: .5rem;border: 1px solid #ffffff30;color: #ffffff6b;`},
        exitstyle() { return `position: absolute; top: .5rem; left: .5rem;width: .5rem;height: .5rem;opacity: .5;` },
        toolsstyle(){return `z-index: 10;position: absolute;top: 3%;right: 2%;border: 1px solid #ffffff33;border-radius: 3rem;background: #ffffff24;padding: .3%;display: flex;gap: .5rem;`},
        toolstyle(){return ` cursor: pointer;width: 2rem;height: 2rem;display: flex;justify-content: center;align-items: center;background-position: center;background-size: 80%;background-repeat: no-repeat;background-color: #ffffff3b;border-radius: 50%;`},
        pipstyle(){return` font-size:.7rem;position: absolute;bottom: -160%;left: 50%;transform: translate(-50%, -50%);width: 2rem;height: 2rem;display: flex;justify-content: center;align-items: center;  background: #8080804f;border-radius: 50%;outline: 1px solid #80808069;color: grey;outline-offset: 2px;`},
        optionstyle(){return`gap: .3rem;position: absolute;background: #ffffff33;padding: .3rem;border-radius: 1.3rem;display: flex;width: fit-content;height: fit-content;`},
        optionsstyle(){return`width: 2rem;height: 2rem;display: flex;justify-content: center;align-items: center;background: #ffffff29;border-radius: .5rem;`},
        ghoststyle(){return `display: none;position: absolute;width: 0px;height: 0px;border-radius: .3rem;border: 2px dashed #ffffff47;background: #ffffff1c;`},
        estyle(){return `position: absolute;width: 0px;height: 0px;border-radius: .2rem;background: #ffffffa2;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        optionsId: GenerateId() + `Options`,
        rowcol: 1,
        step: 1,
        size: 100,
        elements: [],
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/uiMaker.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        ui(to, UIMakerObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.classList.add(`uimaker`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML = `
            <div class='propssection' style='${this.propsstyle()}'>
            <input placeholder='Search' class='searchprop' type ='input' style='${this.inputstyle()}'>
            <div class='props yscroll'></div>
            </div>
            <div class='draw xscroll yscroll' style='${this.drawstyle()}'>
            <div class='tools' style='${this.toolsstyle()}'>
            <div class='grid' style='${this.toolstyle()}'>G</div>
            <div class='mirror' style='${this.toolstyle()}'>M</div>
            <div class='fullscreen' style='${this.toolstyle()}'>FS</div>
            </div>
            <div class='add' style='${this.addstyle()}'>add</div>
            </div>
            <div class='animations' style='${this.animationsstyle()}'>
            <div style='${this.headswraptyle()}' class='animhead'>
            <div class='introhead' style='${this.headstyle()}'>intro</div>
            <div class='endinghead' style='${this.headstyle()}'>ending</div>
            <div class='hoverhead' style='${this.headstyle()}'>hover</div>
            <div class='clickhead' style='${this.headstyle()}'>click</div>
            </div>
            <div style='${this.animcontentstyle()}' class='animcontent'></div>
            </div>
            <div class='templates' style='${this.templatestyle()}'>
            <div class='exittemp exit' style='${this.exitstyle()}'></div>
            </div>
            <div class='exit' style='${this.exitstyle()}'></div>
            `
            to.append(this.element)
            domextract(this.element, `classname`, this)


            this.events()
            this.ghost = this.Ghost()
            this.drawGrid()
            this.select = Select(this)
        },
        createDiv(){

        },
        removeGrid(){
            if(this.gridPar)this.gridPar.remove()
        },
        drawGrid(){
            this.removeGrid()
            this.gridPar = document.createElement(`div`)
            this.gridPar.classList.add(`this.gridPar`)
            this.gridPar.setAttribute(`style`, `width: 100%; height: 100%; width: 100%; height: 100%;position: absolute; top: 0; left: 0;`)
            const cell = (100 / this.rowcol)
            this.size = cell
            Array.from({length: this.rowcol}).forEach((col,y)=>{
                Array.from({length: this.rowcol}).forEach((row, x)=>{
                    const div = document.createElement(`div`)
                    div.setAttribute(`style`, `
                        width: ${cell}%; height: ${cell}%;
                        border: 1px dashed #72005bff; 
                        position: absolute; top: ${y * cell}%;
                        left: ${x * cell}% ;
                        `)
                    this.gridPar.append(div)
                })
            })    
            this.dom.draw.append(this.gridPar)
        },
        events(){
            let targetTemp
            this.dom.draw.onmouseover = (e)=>{
                if(e.target.classList.contains(`div`))
                targetTemp = e.target
            }
            this.dom.draw.onclick = ()=>{
                this.target = targetTemp
                if(!this.target)return
                this.element.querySelectorAll(`.div`).forEach(e=>e.classList.remove('selected'))
                this.target.classList.add(`selected`)

            }
            this.dom.grid.onwheel = (e)=>{
                if(e.deltaY < 0)
                this.rowcol += this.step
                if(e.deltaY > 0)
                this.rowcol -= this.step
                this.addpip(this.dom.grid, this.rowcol.toFixed(0))
                this.drawGrid()
            }
            let fs = -1
            this.dom.fullscreen.onclick = ()=>{
                if(fs < 0){
                    this.dom.draw.style.position = `absolute`
                    this.dom.draw.style.top = `0`
                    this.dom.draw.style.left = `0`
                    this.dom.draw.style.width = `100vw`
                    this.dom.draw.style.zIndex = `100`
                    this.dom.draw.style.height = `100vh`
                    document.body.append(this.dom.draw)
                    this.dom.fullscreen.textContent = `SM`
                    this.element.style.display = `none`
                    fs *= -1
                }else if (fs > 0){
                    this.dom.draw.style.position = `relative`
                    this.dom.draw.style.top = `0`
                    this.dom.draw.style.left = `0`
                    this.dom.draw.style.width = `100%`
                    this.dom.draw.style.zIndex = `1`
                    this.dom.draw.style.height = `100%`
                    this.element.append(this.dom.draw)
                    this.dom.fullscreen.textContent = `FS`
                    this.element.style.display = `grid`
                    fs *= -1
                }
            }
            this.dom.exittemp.onclick = ()=>{
                this.dom.templates.style.display = `none`
            }
            this.dom.exit.onclick = ()=>{
                this.element.remove()
            }
            this.dom.mirror.onclick = ()=>{
                this.mirror()
            }
            this.dom.searchprop.onchange = (e)=>{
                if(!this.target)return
                let camelCase = ``
                e.target.value.split(' ').map((e, x)=>{
                    if(x > 0){
                        let word = e.split('')
                        word[0] = word[0].toLocaleUpperCase()
                        word.map(l=>camelCase += l)
                   }else    
                    camelCase += e
                })
                this.dom.props.innerHTML  = ``
                for(let x in this.target.style){
                    if(x === camelCase){
                        this.addstylediv({name: x, value: this.target.style.x, callback:(e)=>{
                            this.target.style[x] = e.target.value
                        }})
                    }
                }
            }
            this.dom.draw.onmousemove=(e)=>{
                this.mx = e.clientX - this.dom.draw.getBoundingClientRect().x
                this.my = e.clientY - this.dom.draw.getBoundingClientRect().y
                if(this.element.querySelector(`.pip`))
                this.element.querySelector(`.pip`).remove()
            }
        },
        addpip(to, val){   
            if(this.pipdiv)this.pipdiv.remove()
            this.pipdiv = document.createElement(`this.pipdiv`)
            this.pipdiv.setAttribute(`style`, this.pipstyle())
            this.pipdiv.setAttribute(`class`, `pip`)
            this.pipdiv.textContent = `${val}`
            to.append(this.pipdiv)
        },
        colorCond(name){
            return (
                name === `color` ||
                name === `backgroundColor`
            )
        },
        addstylediv({name = 'text-shadow', value, callback}, ){
            const div = document.createElement(`div`)
            div.textContent =name
            const input = document.createElement(`input`)
            input.oninput = (e)=>{callback(e)}
            if(this.colorCond(name))input.type= `color`
            div.setAttribute(`style`, this.propsstylingstyle())
            input.setAttribute(`style`, this.inputstyle())
            if(value) input.value = value
            div.append(input)
            this.dom.props.append(div)
            return {div, input}
        },
        options(){
            if(this.dom.draw.querySelector(`.options`))
            this.dom.draw.querySelector(`.options`).remove()
            const div = document.createElement(`div`)
            div.classList.add(`options`)
            div.setAttribute(`style`, this.optionstyle())
            this.dom.draw.append(div)
            div.style.top = this.my + `px`
            div.style.left = this.mx + `px`
            return {
                add(src, txt, callback = ()=>{}){
                    const option = document.createElement(`div`)
                    option.classList.add(`option`)
                    option.textContent = txt
                    option.onclick = (e)=>{callback(e)}
                    option.setAttribute(`style`, res.optionsstyle())
                    div.append(option)
                    return this
                }
            }
        },
        duplicate(){
            const clone = this.target.cloneNode(true)
            this.dom.draw.append(clone)
            clone.style.left = this.target.getBoundingClientRect().x + this.target.clientWidth + `px`
            clone.id  = `clone-` + this.target.id
        },
        mirror(){
            const firstHalf = this.dom.draw.clientWidth / 2
            const elemobj= domextract(this.dom.draw).object
            const filterHalf = Object.values(elemobj).filter(e=>{
                if(!e.classList.contains(`div`))return
                const x = e.getBoundingClientRect().x  - this.dom.draw.getBoundingClientRect().x
                // const y = e.getBoundingClientRect().y
                return x < firstHalf

            })
            .sort((a, b)=>a.x - b.x)
            filterHalf.forEach(e=>{
                const cloneE = e.cloneNode(true)
                this.dom.draw.append(cloneE)
                // cloneE.style.top = this.dom.draw.clientHeight -
                // (e.getBoundingClientRect().y  - this.dom.draw.getBoundingClientRect().y) - e.clientHeight + `px` 
                cloneE.style.left = this.dom.draw.clientWidth - 
                (e.getBoundingClientRect().x  - this.dom.draw.getBoundingClientRect().x) - e.clientWidth + `px` 
            })
        },
        spawnelement({type, x,y, w, h}){
            const e = document.createElement(type)
            e.classList.add(`div`)
            e.setAttribute(`style`, this.estyle())
            e.style.top = y + `px`
            e.style.left = x + `px`
            e.style.width = w + `px`
            e.style.height = h + `px`
            e.dim = {x, y, w, h}
            e.setSize= (w, h)=>{
                e.dim.w = w
                e.dim.h = h
                e.style.top = w + `px`
                e.style.left = h + `px`
            }
            e.setPos= (px, py)=>{
                let x = Math.floor(px / (this.dom.draw.clientWidth/ this.rowcol)) * (this.dom.draw.clientWidth / this.rowcol)
                let y = Math.floor(py / (this.dom.draw.clientHeight / this.rowcol)) * (this.dom.draw.clientHeight / this.rowcol)
                console.log((this.dom.draw.clientWidth/ this.rowcol))
                e.dim.x = x
                e.dim.y = y
                e.style.top = y + `px`
                e.style.left = x + `px`
            }
            this.dom.draw.append(e)
        },
        Ghost(){
            const div = document.createElement(`div`)
            div.classList.add(`ghost`)
            div.setAttribute(`style`, this.ghoststyle())
            div.init = ()=>div.style.display = `block`
            div.end = ()=>div.style.display = `none `
            div.setPos = (x, y)=>{
                div.posy = y    
                div.posx = x
                div.style.top  = `${y}px`
                div.style.left  = `${x}px`
            }
            div.setSize = (w, h)=>{
                div.w = w    
                div.h = h
                div.style.width  = `${w}px`
                div.style.height  = `${h}px`
            }
            div.getDim = (x, y)=>{
                return {x: div.posx, y: div.posy, w: div.w, h: div.h}
            }
            this.dom.draw.append(div)
            return div
        },
        load(){
        },

    }
    res.load()
    return res
}






function Select(Maker){
    const res={
        style(){return `display: none;position: absolute;border: 2px dashed #4f4fde;border-radius: .3rem;`},
        load(){
            this.ui()
            this.events()
        },
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`select`)
            this.element.setAttribute(`style`, this.style())
            Maker.dom.draw.append(this.element)
        },
        events(){
            EventHandler(Maker.dom.draw, '', 'mousedown', ()=>{
                this.mx = this.snapX(Maker.mx)
                this.my = this.snapY(Maker.my)
                this.element.style.display = `block`
                this.element.style.top = this.my + `%`
                this.element.style.left = this.mx + `%`
                this.toggle = true
            })
            EventHandler(Maker.dom.draw, '', 'mousemove', ()=>{
                if(!this.toggle)return
                this.mw = this.snapX(Maker.mx - this.mx)    
                this.mh = this.snapY(Maker.my - this.my)
                this.element.style.width = `${this.mw}%`
                this.element.style.height = `${this.mh}%`
            })
            EventHandler(Maker.dom.draw, '', 'mouseup', ()=>{
                
                if(this.cond())
                this.dropanelement()
                this.mx = 0
                this.my = 0
                this.mh = 0
                this.mw = 0
                this.element.style.display = `none`
                this.toggle = false

            })

        },
        cond(){
            const size = 100 / Maker.rowcol
            return (
                this.mw !== 0 && this.mh !== 0 
            )
        },
        dropanelement(){
            const element = DIV(Maker)
            Maker.elements.push(element)
            element.element.style.top = `${this.my}%`
            element.element.style.left = `${this.mx}%`
            element.element.style.width = `${this.mw}%`
            element.element.style.height = `${this.mh}%`
        },
        snapX(value){
            const sizeX = 100 / Maker.rowcol
            const sizeXpx = Maker.dom.draw.clientWidth * (sizeX/100)
            const nx = Math.floor(value / sizeXpx) 
            const newvalue = nx * sizeXpx
            const perc  = (newvalue / Maker.dom.draw.clientWidth) * 100 
            return perc
        },
        snapY(value){
            const sizey = 100 / Maker.rowcol
            const sizeypy = Maker.dom.draw.clientHeight * (sizey/100)
            const ny = Math.floor(value / sizeypy) 
            const newvalue = ny * sizeypy
            const perc  = (newvalue / Maker.dom.draw.clientHeight) * 100 
            return perc
        }
    }
    res.load()
    return res
}










export function DIV(Maker){
    const res={
        styles: 'position:absolute; border-radius: .3rem; background: #ffffff6a;',
        offx: 0, offy: 0,
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`div`)
            this.element.setAttribute(`style`, this.styles)
            Maker.dom.draw.append(this.element)
        },
        load(){
            this.ui()
            this.events()
        },
        snapX(value){
            const sizeX = 100 / Maker.rowcol
            const sizeXpx = Maker.dom.draw.clientWidth * (sizeX/100)
            const nx = Math.floor(value / sizeXpx) 
            const newvalue = nx * sizeXpx
            const perc  = (newvalue / Maker.dom.draw.clientWidth) * 100 + this.offy
            return perc
        },
        snapY(value){
            const sizey = 100 / Maker.rowcol
            const sizeypy = Maker.dom.draw.clientHeight * (sizey/100)
            const ny = Math.floor(value / sizeypy) 
            const newvalue = ny * sizeypy
            const perc  = (newvalue / Maker.dom.draw.clientHeight) * 100 + this.offy
            return perc
        },
        events(){
            this.element.onmousedown = (e)=>{
                if(e.button !== 2)return
                this.drag = true
                this.dx = e.clientX
                this.dy = e.clientY
            }
            this.element.onmousemove= (e)=>{
                if(!this.drag)return
                this.element.style.left  = this.snapX(Maker.mx) + `%`
                this.element.style.top  = this.snapY(Maker.my) + `%`
                this.element.style.outline = `2px solid yellow`
            }   
            this.element.onmouseup = (e)=>{
                this.drag = false
                this.element.style.outlineColor = ` #ffffff39`
                this.element.style.outline = `none`
            }
            this.element.ondra
            this.element.ondrop = (e)=>{
                console.log(e)
            }
        },
    }
    res.load()
    return  res
}