import { domextract } from "../../../components/DRAW/domextract"
import { feedback } from "../../../components/DRAW/feedback"
import { Granular } from "../../../components/Material/plugins/granular"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"
import { rects } from "./collida"


export function GranularObject(Material, Layout, Layers, Layer, Tile){
    const res = {
        id: GenerateId(),//important
        name: `Granular`,//important
        settingsoptions: [],//important
        requirement(){return Tile !== Material},//important
        requirementMessage: 'Tile Plugin',//important
        toggle: true, // important
        variablesOfInterest: [''], //must, string, number, non-return function, boolean
        eventsOfInterest: [''],//must , function, only returns boolean
        groups: [],
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Granular().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            //set the vars
            return true
        },
        getpreset(){ // must
            const data = {
                pluginName: this.name,
                name: 'ddd',
                object: {}
            }
            this.variablesOfInterest.forEach(x=>data.object[x] = this[x])
            return data
        },
        remove(){//must
            this.loader.remove()
            Tile.nodes = Tile.nodes.filter(e=> e !== this) //delete this
        },
        load(){       
            this.updateTileVars()
            this.open()
        },
        addGroup(name){
            const obj = {
                name,
                x: 200, y: 200, w: 50, h: 50,
                offx: 0, offy: 0, offw: 0, offh: 0,
                ratio: {x: 0, y: 0, w:0, h: 0},
                color: `yellow`,
                vars: {
                    x: 0, y: 0, w: 50, h: 50,
                    number: 1,
                    vx: 1, vy: -.5,
                    minradius: 1,
                    maxradius: 10,
                    color1: `#fff`,
                    amplitude: 20,
                    frequency: .1,
                    decrement:0.2,
                    weight: 0.01,
                    color2: `transparent`,
                    setindicate: true,
                },
                particles: [],
                populate(){
                    this.particles = []
                    for(let x =0; x < this.vars.number; x++){
                        this.particles.push(Particle(this))
                    }
                },
                generate(){
                    this.particles.forEach(p=>p.play())
                },
                checkandreset(){
                    if(this.particles.every(p=>p.delete)){
                        this.populate()
                    }
                },
                calcRatio(){

                },
                draw({ctx}){
                    if(!ctx)return
                    this.calcRatio()
                    ctx.globalAlpha= 0.4
                    ctx.fillStyle= this.color
                    ctx.fillRect(this.x, this.y, this.w, this.h)
                    ctx.globalAlpha= 1
                    
                },
                parseRatio(){
                    console.log(this.ratio)
                    // for(let x in this.ratio)if(this.ratio[x] === Infinity)return
                    this.offw = Tile.absw / this.ratio.w
                    this.offh = Tile.absh  / this.ratio.h 
                },
                updatePos(){
                    this.x = Tile.absx + this.offx
                    this.y = Tile.absy + this.offy
                    this.w = Tile.absw + this.offw
                    this.h = Tile.absh + this.offh
                },
                update(props){
                    this.draw(props)
                    this.particles.forEach(p=>p.update(props))
                    this.particles.forEach(p=>(this.vars.setindicate)?p.draw(props): null)
                    this.checkandreset()
                    this.updatePos()
                    this.parseRatio()
                },
            }
            obj.remove = ()=>{
                this.groups.splice(this.groups.indexOf(obj), 1)
            }
            obj.populate() //pppulate
            this.groups.push(obj)
            this.ui.updateGroups(this)
            this.currentgroup = obj
            return obj
        },
        updateTileVars(){
            Tile.setVariable({prop: this.name, nodeId: Tile.id})
            Tile.setFunction({prop: this.name, nodeId: Tile.id})
            Tile.setEvent({prop: this.name, nodeId: Tile.id})
            const v = Tile.setVariable({par: this.name,prop:`Toggle ${this.name}: ${this.toggle}`, set:(val)=>{
                this.toggle = val
                v.prop = `Toggle ${this.name}: ${this.toggle}`
            }, get: ()=>this.toggle})
            const newvars = []
            this.variablesOfInterest.map(key=>{
                const data = {
                    prop: key,
                    nodeId: Tile.id
                }
                data.get = ()=>{
                    return this[data.prop]
                }
                data.set = (value)=>{
                    return this[data.prop] = value
                }
                const variable = Tile.setVariable({...data, par: this.name})  
                newvars.push(variable)
            })
            this.variablesOfInterest = newvars
        },
        update(props){
            this.groups.forEach(g=>g.update(props))
            // this?.currentgroup?.update(props)
            this?.ui?.update({...this, ...props})
        },
    }
    if(!res.requirement()){
        feedback({message: res.requirementMessage || `requirements not met`})
        return undefined
    }else {
        res.load()
        return res
    }
}


function Particle(Group){
    const res = {
        shouldplay : false,
        vx:Math.random() * (Group.vars.vx - (-Group.vars.vx)) + (-Group.vars.vx), 
        vy:Math.random() * (Group.vars.vy - (-Group.vars.vy)) + (-Group.vars.vy), 
        r: Math.random() * (Group.vars.maxradius - Group.vars.minradius) + Group.vars.minradius,
        x: Math.random() * (Group.w - 0),
        y: Math.random() * (Group.h - 0),
        weight: Math.random() * (Group.vars.weight - (-Group.vars.weight)) + (-Group.vars.weight),
        amp: Math.random() * (Group.vars.amplitude - (-Group.vars.amplitude)) + (-Group.vars.amplitude),
        freq: Math.random() * (Group.vars.frequency - (-Group.vars.frequency)) + (-Group.vars.frequency),
        dec: Group.vars.decrement,
        t: 0,
        offx: 0,
        play(){
            this.shouldplay = true
        },
        calcRatio(){
            this.ratio = {
                x: Group.w / this.x, 
                y: Group.h / this.y, 
                w: Group.w / this.w, 
                h: Group.w / this.h, 
            }
        },
        load(){
            this.calcRatio()

        },
        draw({ctx}){
            ctx.globalAlpha = 0.3
            ctx.fillStyle = `red`
            ctx.fillRect((Group.x + this.x) + this.offx, Group.y +  this.y,  this.r, this.r)
            ctx.globalAlpha = 1
            // ctx.beginPath()
            // ctx.arc(Group.x + this.x, Group.y +  this.y,  this.r, 0 , Math.PI * 2)
            // ctx.closePath()
        },
        lerp(a, b, index){return a + (b-a) * index},
        applyGravity(){
            this.x += this.vx
            this.t += (performance.now() / 1000)
            this.offx = this.lerp(this.amp + Math.sin(this.freq * this.t), this.offx, 0.2)

            // console.log(this.oncollision())
            // if(!this.oncollision()){
            this.targetv =  this.vy  + this.weight
            this.y += this.lerp(this.vy, this.targetv, 0.2)
            this.vy += this.weight
            // }
            this.r -= this.dec
            
        },
        oncollision(){
            return rects.every(rect=>{
                return (
                    this.x + this.r > rect.absx &&
                    this.y + this.r > rect.absy &&
                    this.x < rect.absx + rect.absw &&
                    this.y < rect.absy + rect.absh 
                )
            })
        },
        handledelete(){
            if(this.r < Group.vars.minradius){
                this.delete = true
                Group.particles.splice(Group.particles.indexOf(this), 1)
            }
        },
        update(props){
            if(!this.shouldplay)return
            this.applyGravity()
            this.handledelete()
        },
    }
    res.load()
    return res
}