import { domextract } from "../DRAW/domextract"
import { TilePreview } from "./tilePreview"
import * as PLUGINOBJS from '../../functions.js/Material/plugins/exports'
import { Dropdown } from "../DRAW/dropdown"
export function GroupsUI(Material){
    const res = {
        style(){return ``},
        groupstyle(){return `display: flex; align-items: center; gap.3rem;border: 1px solid #ffffff54;padding: .2rem;border-radius: .5rem;height: 3rem;position: relative;margin-bottom: .6rem`},
        gtitlestyle(){return `position: absolute;top: -7px;left: 3px;background: #0c0125;font-size: .7rem;padding: 0 .2rem;`},
        addstyle(){return `width: 2rem;height: 2rem;background: #ffffff36;position: relative;top: .5rem;left: 50%;transform: translateX(-50%);clip-path: polygon(10% 25%, 35% 25%, 35% 0%, 65% 0%, 65% 25%, 90% 25%, 90% 50%, 65% 50%, 64% 81%, 36% 81%, 35% 50%, 10% 50%);`},
        imgstyle(){return `width: 1.3rem; height: 1.3rem; border: 1px solid #ffffff3d; padding: .1rem; border-radius: .3rem;`},
        imgcontentstyle(){return `width: 100%;height: 100%;display: flex;justify-content: space-between;align-items: center;overflow: scroll hidden;gap: .3rem;`},
        onadd : ()=>{},
        ui(){
            const e = Material.ui.addSection('rightside', 'Groups')
            const dom = domextract(e.Groups).object
            const par = dom.content
            
            this.element = document.createElement(`div`)
            this.element.classList.add(`groups`)
            par.append(this.element)
            domextract(this.element, `classname`, this)

            const add = document.createElement(`div`)
            add.classList.add(`add`)
            add.setAttribute(`style`, this.addstyle())
            par.append(add)
            this.event(add)
        },
        event(e){
            e.onclick =  ()=>{
                this.onadd(this)
            }
        },
        load(){
            this.ui()
        },
        showsources(){},
        addGroup(name, tiles, callback){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.groupstyle())
            div.onclick= ()=>{callback()}
            div.innerHTML  += `
            <div style='${this.gtitlestyle()}'>${name}</div>
            <div class='content xscroll' style='${this.imgcontentstyle()}'></div>
            `
            this.element.append(div)
            this.addTilesDivs(tiles, domextract(div).object.content)

            const drop = Dropdown({target: div})
            drop.add('delete', ()=>{
                console.log(`delete`)
            })
            drop.add('rename', ()=>{
                console.log(`rename`)
            })
            drop.add('inspectTiles', ()=>{
                console.log(`inspect elements`)
                Material.tileInspector.showTiles(tiles)
            })
        },
        addTilesDivs(tiles, div){
            tiles.forEach(tile=>{
                const canvas = document.createElement(`canvas`)
                const img = document.createElement(`img`)
                img.src = tile.sprite.image.src
                canvas.setAttribute(`style`, this.imgstyle())
                div.append(canvas)

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
                

                img.onclick = ()=>{
                    TilePreview(Material, tile, (plugindom, name)=>{
                        const objectName = name + `Object`
                        const pluginobj = PLUGINOBJS[objectName](Material, Layout, this)
                        if(pluginobj){
                            tile.nodes.push(pluginobj)
                            tile.updateNodesAndModsDom()
                            tile.updateTilePropsDom()
                        }
                        
                        else feedback({message: 'requirement not met'})
                    })
                }
            })
        },
        update(props){
            this.updateDim()
            this.draw(props)
        },
    }
    res.load()
    return res
}