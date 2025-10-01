import { domextract } from "../../components/DRAW/domextract"

export function TileSelector(Material, callback = ()=>{}){
    const res = {
        style(){return `position: absolute;top: 0;left: 0;width: 100%;height: 100vh;background: #444513;z-index: 100;border-radius: 1.5rem;border: 2px solid #e1f300b3;`},
        tilesstyle(){return `gap: .3rem;flex-direction:column;position: absolute;width: 5rem;height: fit-content;padding: .4rem 0;min-height: 15rem;max-height: 100%;background: #ffffff26;border: 1px solid #ededd642;border-radius: .5rem;top: 50%;display: flex;overflow: hidden scroll;left: 2rem;justify-content: space-between;align-items: center;transform: translateY(-50%);z-index: 10;backdrop-filter: blur(10px);`},optionswrapstyle(){return `z-index: 10;position: absolute;top: 3rem;right: 3rem;display: flex;flex-direction: column;gap: .4rem;background: #ffffff1f;padding: .2em;border-radius: .5rem;`},
        optionstyle(){return `width: 2rem;height: 2rem;border-radius: .5rem;background: #ffffff2e;box-shadow: 0px 4px 17px -6px #000;cursor:pointer;background-size: 70%;background-repeat: no-repeat;background-position: center;`},
        canvaswrapstyle(){return `flex-shrink: 0;width: 4rem;height: 4rem;position: relative;overflow: hidden;border: 1px solid #ffffff61;border-radius: .5rem;`},
        exittilestyle(){return `position: absolute;top: .5rem;right: .5rem;width: .5rem;height: .5rem;`},
        namestyle(){return `position: absolute;font-size: .7rem;top: .2rem;left: .2rem;`},
        canvasstyle(){return `width: 100%;height: 100%;`},
        tiles : [],
        ui(){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='position:absolute; top: 5rem; left: 50%; transform: translateX(-50%);color #000; font-size: 3rem; text-transform: capitalize;'>Select Tiles Here</div>
            <div class='tiles yscroll' style='${this.tilesstyle()}'></div>
            <div class='optionswrap'style='${this.optionswrapstyle()}'>
                <div class='add'  style='${this.optionstyle()} background-image: url(../assets/icons/add.png);' ></div>
                <div class='exitselector' style='${this.optionstyle()} background-image: url(../assets/icons/exit2.png);' ></div>
            </div>

            `

            this.element.append(Material.ui.dom.canvas)
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        events(){
            console.log(this.dom.add)
            this.dom.add.onclick = ()=>{
                this.addselectedtolist()
                this.updatelistdom()
            }
            this.dom.exitselector.onclick = ()=>{
                callback(this.tiles.flat())
                this.remove()
            }
        },
        remove(){
            this.element.remove()
            Material.ui.element.append(Material.ui.dom.canvas)
            Material.ui.setnormalscreen()
        },
        addselectedtolist(){
            const selected = Material.layouts.getselectedtiles()
            selected.forEach(tile=>{
                this.tiles.push(tile)
                tile.selected = false
            })
        },
        updatelistdom(){
            this.dom.tiles.innerHTML = ``
            this.tiles.forEach(tile=>{
                console.log(tile)
                const element = this.getcanvasdom(tile)
            })
        },
        getcanvasdom(tile){

            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.canvaswrapstyle())
            div.innerHTML = `
            <div style='${this.namestyle()}'>Tile</div>
            <div class='exit' style='${this.exittilestyle()}'></div>
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            `
            this.dom.tiles.append(div)

            const dom = domextract(div).object

            dom.canvas.width = dom.canvas.clientWidth 
            dom.canvas.height = dom.canvas.clientHeight 
            const ctx = dom.canvas.getContext(`2d`)
            const s = tile.sprite
            ctx.clearRect(0, 0, dom.canvas.width, dom.canvas.height)
            ctx.drawImage(s.image, s.sx, s.sy, s.sw, s.sh, 0, 0, dom.canvas.width, dom.canvas.height)

            dom.exit.onclick = ()=>{
                this.tiles.splice(this.tiles.indexOf(tile), 1)
                this.updatelistdom()
            }
            return div
        },
        load(){
            Material.ui.setfullscreen()
            this.ui()
            this.events()
        }
    }
    res.load()
    return res
}