import { blank } from "../../components/DRAW/blank.js"
import { domextract } from "../../components/DRAW/domextract.js"
import { collisionData } from "./collisionData.js"
import { downloadCanvas } from "./downloadCanvas.js"
import { EventHandler } from "./events.js"
import { GameRenderer } from "./gamerenderer.js"
import { draw } from "./instances.js"
let lastd
export function ExportOptions(){
    const res = {
        style(){return `gap: 1.5rem;transition: .6s ease;display: flex;justify-content: center;align-items: center;flex-wrap: wrap;padding: 1rem;position: absolute;top: 50%;transform: translateY(-50%);right: 3.5rem;z-index: 5;width: 4rem;backdrop-filter: blur(15px);border-radius: 5%;height: fit-content;background: rgba(0, 0, 0, 0.31);`},
        btnstyle(){return `color:transparent;width: 3rem; padding: 4px;height: 3rem; flex-shrink: 0; border-radius: 2px;`},
        bgimgstyle(){return `background-size: contain; background-repeat: no-repeat; background-position: center;`},
        exitstyle() { return `opacity: .5;width: .5rem;height: .5rem; margin-bottom: 1rem` },
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`exportoptions`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='exit' popupdescription='exit' popupdirection='top' style='${this.exitstyle()}'></div>
            <div class='downloadCanvas' popupdescription='download canvas (.png)' popupdirection='left' style='${this.btnstyle()} background-image : url(./assets/icons/download.png); ${this.bgimgstyle()}'>D</div>
            <div class='downloadData' popupdescription='download collision data (.js)' popupdirection='left' style='${this.btnstyle()} background-image : url(./assets/icons/worlds.png); ${this.bgimgstyle()}'>Q</div>
            <div class='quickRender' popupdescription='render your game now' popupdirection='left' style='${this.btnstyle()} background-image : url(./assets/icons/render.png); ${this.bgimgstyle()}'>Q</div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        remove(){this.element.remove()},
        shortcuts(){
          const shortcuts = draw.instance.shortcuts
          
        },
        events(){
          EventHandler(this.dom.exit, 'exit', 'click', (e)=>{
              this.element.style.opacity  = `0`
              this.element.style.right  = `-3.4rem`
              setTimeout(()=>{this.remove(), 3000})
          })
          EventHandler(this.dom.quickRender, 'show', 'click', (e)=>{
            draw.instance.gameRenderer = GameRenderer()
          })
          EventHandler(this.dom.downloadCanvas, 'show', 'click', (e)=>{
            downloadCanvas({canvas: draw.instance.ui.ctx.canvas, to: document.body})
          })
          EventHandler(this.dom.downloadData, 'show', 'click', (e)=>{
            collisionData().download()
          })
        },
        load(){
            if(lastd)lastd.remove()
            lastd = this
            this.ui()
            this.events()
            
        }
    }
    res.load()
    return res
}