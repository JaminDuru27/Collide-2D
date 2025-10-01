import { Options } from "../../components/DRAW/options"
import { EventHandler } from "../DRAW/events"
import { GenerateId } from "../DRAW/generateId"
import { Layers, Layer } from "./layers"
import * as PLUGINOBJS from './plugins/exports.js'
export function Layout(Material, Layouts, data){
    function rand(){return Math.floor(Math.random() * (225 - 0) + 0)}

    const res = {
        data,
        inuse: false,
        name: data.name,
        determiningPosition: false,
        hoveredOn: false,
        urls: [],
        urlsId: [],
        cols: [],
        x: 0, y: 0,
        load(){
            this.layers = Layers(Material, this)
            this.parseData()
            this.event()
            this.ui()
            // this.showOptions()s
        },
        event(){
            EventHandler(Material.ui.ctx.canvas, '', 'mousemove', ()=>{
                if(this.isHoveredOn()){
                    Layouts.array.forEach(lay=>lay.hoveredOn = false)
                    if(!this.hoveredOn){
                        this.hoveredOn = true
                        this.layers.updateDom()
                    }
                }else this.hoveredOn = false
            })
        },
        remove(){
            Layouts.array.splice(Layouts.array.indexOf(this), 1)
        },
        ui(){
            this.layers.ui()
        },
        setPosition({x, y,indx, indy}){
            if(indx < 0)return
            if(indy < 0)return
            this.indx = indx
            this.indy = indy
            this.updateDom()
        },
        isHoveredOn(){
            if(this.inuse){
                return (
                    Material.mouse.x >= this.x &&
                    Material.mouse.y >= this.y &&
                    Material.mouse.x <= this.x + this.w &&
                    Material.mouse.y <= this.y + this.h
                )
            }else return false
        },
        
        parseData(){
            //name
            this.name = data.name
            //id
            this.id = data.id
            //grid
            this.nx = data.grid.nx
            this.ny = data.grid.ny
            //images La
            
            for(let x in data.images){
                const url = data.images[x].object.general.url
                this.urls.push(url)
                this.urlsId.push(GenerateId())
            }
            data.layers.forEach(col=>{
                if(!col.length)return
                const layer = this.layers.add(col[0].layername, col[0].layerId)
                col.forEach(tiledata=>{
                    // layer.add(tiledata)
                    const tile = layer.add()
                    tile.indx = tiledata.indx
                    tile.indy = tiledata.indy
                    tile.bind('Sprite', tiledata)
                    .sprite.groupId = this.urlsId[this.urls.indexOf(tiledata.src)]
                    
                    tile.widthMult = tiledata.widthMult
                    tile.heightMult = tiledata.heightMult
                })
            })
            //collisions
            data.collisions.forEach(collisiondata=>{
                this.cols.push = collisiondata
            })

            //collisionsgroups
            data.collisiongroups.flat().forEach(coldata=>{
            })

        },
        color: `rgba(${rand()},${rand()}, ${rand()},0.2)`,
        setColor(){
            this.color = `rgba(${rand()},${rand()}, ${rand()},0.2)`
        },
        updateDom(){
            if(!Material.grid.boxes[this?.indy])return
            if(!Material.grid.boxes[this?.indy][this?.indx])return

            this.x = Material.grid?.boxes[this?.indy][this?.indx]?.x
            this.y = Material.grid?.boxes[this?.indy][this?.indx]?.y
            this.w= Material.grid.cw * this.nx
            this.h= Material.grid.ch * this.ny
        },
        draw({ctx}){
            //bg
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
            //hovered inficator
            if(this.hoveredOn){
                ctx.setLineDash([2, 2])
                ctx.strokeStyle = `#fff`
                ctx.strokeRect(this.x, this.y, this.w, this.h)
                ctx.setLineDash([])
                
            }
        },
        update(props){
            this.updateDom()
            this.draw(props)
            this.layers.update(props)
        }
    }
    res.load()
    return res
}
