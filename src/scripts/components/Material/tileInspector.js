import { EventHandler } from "../../functions.js/DRAW/events"
import { domextract } from "../DRAW/domextract"
let e
export function TileIInspectorUI(Material){
    const res = {
        style(){return `position: absolute;top: 0;right: -5rem;width: 5rem;height: 100%;padding: 3rem 0.2rem;background: #0d012d52; backdrop-filter: blur(3px);border: 1px solid #ffeded12;border-radius: .5rem; `},
        contentstyle(){return `gap: .3rem;overflow: hidden scroll;height: 100%;margin: .5rem 0;padding: .5rem 0;border-top: 1px solid #ffffff52;display: flex;flex-wrap: wrap;`},
        namestyle(){return `color: #fff;`},
        tilestyle(){return `height: 4rem;width: 4rem; flex-shrink: 1;border: 1px solid #ffffff52;border-radius: .5rem;background: #ffffff1c;`},
        imgstyle(){return ``},
        array: [],
        ui(){
            if(e)e.remove()
            e = this
            this.element = document.createElement(`div`)
            this.element.classList.add(`eileinst`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='name' style='${this.namestyle()}'>Inspector</div>
            <div class='content yscroll' style='${this.contentstyle()}'></div>
            `
            Material.ui.dom.sideleft.append(this.element)
            domextract(this.element, `classname`, this)
            EventHandler(window, '', 'dblclick', ()=>{this.remove()})

        },
        remove(){this.element.remove()},
        add(tile, callback){
            this.array.push({tile, callback,})
            this.updateList()
        },
        updateList(){
            this.dom.content.innerHTML = ``
            this.array.forEach(({tile, callback}, x)=>{
                const canvas = document.createElement(`canvas`)
                
                canvas.setAttribute(`style`, this.tilestyle())
                canvas.onclick = ()=>{
                    callback()
                    //update nodes and props
                    tile.updateNodesAndModsDom()
                    tile.updateTilePropsDom()
                }
                canvas.onmouseenter = ()=>{
                    tile.showInspect = true
                }
                canvas.addEventListener(`mouseleave`, ()=>{
                    tile.showInspect = false
                })
                this.dom.content.append(canvas)

                canvas.width = canvas.clientWidth
                canvas.height = canvas.clientHeight
                const ctx = canvas.getContext(`2d`)


                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.imageSmoothingEnabled = false

                if(tile.sprite){
                    ctx.drawImage(tile.sprite.image, tile.sprite.sx, tile.sprite.sy, tile.sprite.sw, tile.sprite.sh, 0, 0, canvas.width, canvas.height)
                }else if(tile.canvas){
                    ctx.fillStyle = tile.collision.color
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                }else{
                    ctx.strokeStyle = `${tile.bordercolor}`
                    ctx.fillStyle = `${tile.color}`
                    ctx.fillRect(0, 0, canvas.width, canvas.height)
                    ctx.strokeRect(0, 0, canvas.width, canvas.height)
                }
            })
        },
        load(){
            this.ui()
        }
    }
    res.load()
    return res
}