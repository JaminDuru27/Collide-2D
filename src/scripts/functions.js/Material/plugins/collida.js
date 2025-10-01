import { domextract } from "../../../components/DRAW/domextract"
import { Collida } from "../../../components/Material/plugins/collida"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"
export const rects = []  
export function CollidaObject(Material, Layout, Tile, shouldLoad = true){
    const res = {
        id: GenerateId() + `collida`,//important
        name: `Collida`,//important
        settingsoptions: [],//important
        requirement(){return Tile !== Material},//important
        variablesOfInterest: ['offsetx', 'offsety', 'w','h','vx', 'vy', 'weight', 'friction','oneway','shouldresolve','restitution', 'bouyancy', 'stickness', 'friction'], //must
        eventsOfInterest: ['out of bounds'],
        offsetx: 0, offsety: 0,
        w: Tile.w, h: Tile.h,
        vx: 0, vy: 0,
        weight: .1,
        oneway: false,
        restitution: 0, 
        friction: 0,
        shouldresolve: true,
        buoyancy: 0,
        joined: [], parentRect: undefined,
        exceptions: [],
        showindicator:true,
        toggle: true,
        rand(){return Math.floor( Math.random() * (225 - 0)+0)},
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = Collida().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Tile)
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
            Tile.collision = undefined
        },
        load(){
            this.color =  `rgba(${this.rand()}, ${this.rand()}, ${this.rand()}, 0.4)`
            this.setupjoin()
            if(!shouldLoad)return

            this.settingsoptions.push({name:'addtosrc', callback: this.clonetoallsrc.bind(this)})
            
            const find = Tile.nodes.find(e=>e.name === this.name)
            if(find)Tile.nodes.splice(Tile.nodes.indexOf(find), 1)

            Tile.collision = this
            this.open()
            rects.push(this)    

            this.updateTileVars()
            this.updateTileEvents()
        },
        
        updateTileEvents(){
            this.eventsOfInterest.forEach(event=>{
                Tile.setEvent({name: event, get: ()=> this[event]})
            })
        },
        updateTileVars(name){
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
        clonetoallsrc(){
            if(Tile.sprite){
                Layout.layers.array.forEach(layer=>{
                    layer.tiles.forEach(tile=>{
                        Layout.urls.forEach(url=>{
                            if(
                                url === tile.sprite.image.src){
                                if(tile.collision)return
                                const obj = CollidaObject(Material, Layout, tile)
                                obj.offsetx = this.offsetx
                                obj.offsety = this.offsety
                                obj.offsetw = this.offsetw
                                obj.offseth = this.offseth
                                obj.shouldresolve = this.shouldresolve
                                obj.color = this.color
                            }
                        })
                    })
                })
            }
        },
        setupjoin(){
            if(this.parentRect){
                this.shouldresolve = false
                this.exception.push(this.parentRect)
            }
        },
        join(){
            const col = CollidaObject(Material, Layout, Tile, false)
            col.shouldresolve = false
            col.parentRect = this //immidiate parent
            col.parent = (!this.parent)? this : this.parent //primary parent
            this.joined.push(col)

            return col
        },
        checkCollision(){
            this.iscolliding = false
            rects.forEach(rect=>{
                if(rect.id === this.id)return
                if(this.checkAABB(rect)){
                    this.iscolliding = true
                    this.resolveCollision(rect)
                }
            })
        },
        checkAABB(rect){
            return (
                this.x + this.w > rect.x && 
                this.y + this.h > rect.y && 
                this.x  < rect.x + rect.w && 
                this.y < rect.y + rect.y  
            )
        },
        onOutOfBounds(){
        },
        resolveCollision(rect){
            if(!this.shouldresolve)return
            
            //check is collision is joined
            let is
            rects.forEach(saverect=>{
                if(saverect === rect)is= true
            })
            //check is collision is exception
            this.exceptions.forEach(saverect=>{
                if(saverect === rect)is= true
            })

            if(!is)return
            const overlapX  = Math.max(0, Math.min(this.x + this.w, rect.x + rect.w) - Math.max(this.x, rect.x))
            const overlapY  = Math.max(0, Math.min(this.y + this.h, rect.y + rect.h) - Math.max(this.y, rect.y))

            if(overlapX > 0 && overlapY > 0){
                this.iscolliding = true
                 if(overlapX > overlapY){
                    if(Tile.y < rect.y){
                        if(this.vy > 0)this.vy = 0
                        Tile.y -= (this.buoyancy === 0 && rect.buoyancy === 0)?overlapY:0

                        if(this.buoyancy !== 0)this.vy *= (this.vy > 0.5)?rect.buoyancy : 0
                        else if(rect.buoyancy !== 0)rect.vy *= (rect.vy > 0.5)?this.buoyancy : 0

                    }else{
                        if(this.vy < 0)this.vy = 0
                        Tile.y += (this.buoyancy === 0 && rect.buoyancy === 0)?overlapY:0 
                        
                        if(this.buoyancy !== 0)this.vy *= (this.vy > 0.5)?rect.buoyancy : 0
                        else if(rect.buoyancy !== 0)rect.vy *= (rect.vy > 0.5)?this.buoyancy : 0
                        
                    }
                }else if(overlapX < overlapY){
                    if(this.x  < rect.x){
                        Tile.x -= overlapX
                    }else{
                        Tile.x += overlapX
                    }
                }
            }

        },
        //events
        onveiwportcollide(){
            return (
                this.onveiwportright() ||
                this.onveiwportbottom() ||
                this.onveiwporttop() ||
                this.onveiwportleft()
            )
        },

        onveiwportright(){return (Tile.absx + Tile.absw) - Material.tx > Material.w},
        onveiwportbottom(){return (Tile.absy + Tile.absh) - Material.ty > Material.h},
        onveiwporttop(){return Tile.absy  + Material.ty < 0},
        onveiwportleft(){return Tile.absx + Material.tx < 0},
        
        onlayoutright(){return Tile.absx + Tile.absw - Material.tx > Layout.x + Layout.w},
        onlayoutbottom(){return Tile.absy + Tile.h - Material.ty > Layout.y + Layout.h},
        onlayouttop(){return Tile.absy + Material.tx < Layout.y},
        onlayoutleft(){return Tile.absx + Material.tx < Layout.x},


        //Tiles - Resolve
        resolvetowindowleft(){
            if(!this.onveiwportleft())return
                Tile.absx = 0
                this.resetSize()
            },
        resolvetowindowtop(){
            if(!this.onveiwporttop())return
            Tile.absy = 0
            this.resetSize()
        },
        resolvetowindowbottom(){
            if(!this.onveiwportbottom())return
            Tile.absy = Material.h - Tile.absh
            this.resetSize()
        },
        resolvetowindowright(){
            if(!this.onveiwportright())return
            Tile.absx = Material.w - Tile.absw
            this.resetSize()
        },
        restrictToWindow(){
            if(!this.restrictToWindow)return
            this.resolvetowindowbottom()
            this.resolvetowindowtop()
            this.resolvetowindowleft()
            this.resolvetowindowright()
        },
        resolvetolayoutleft(){
            if(!this.onlayoutleft())return
            Tile.absx = Layout.x
            this.resetSize()
        },
        resolvetolayouttop(){
            if(!this.onlayouttop())return
            Tile.absy = Layout.y
            this.resetSize()
        },
        resolvetolayoutbottom(){
            if(!this.onlayoutbottom())return
            Tile.absy = Layout.y + Layout.h - Tile.absh
            this.resetSize()
        },
        resolvetolayoutright(){
            if(!this.onlayoutright())return
            Tile.absx = Layout.x + Layout.w - Tile.absw
            this.resetSize()
        },
        restrictToLayout(){
            if(!this.restrictToGameWorld)return
            this.resolvetolayoutbottom()
            this.resolvetolayouttop()
            this.resolvetolayoutleft()
            this.resolvetolayoutright()
        },


        updateVelocity({tile}){
            tile.x += this.vx
            this.vx -= this.friction
            this.vx = (this.vx > 0 && this.friction < 0)?0:(this.vx < 0 && this.friction > 0)?0:this.vx
            // if(this.friction < 0 && tile.vx < 0)tile.vx = 0
            // if(this.friction > 0 && tile.vx > 0)tile.vx = 0

            // const distance = this.targetY - this.y;
            // this.y += distance * 0.05; // easing factor
            tile.y += this.vy
        },
        draw({ctx}){
            if(!this.showindicator)return
            if(this?.parent && !this?.parent.showindicator)return
            ctx.fillStyle= this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
        },
        updatePos({tile}){
            this.x = tile.absx + this.offsetx
            this.y = tile.absy + this.offsety
        },
        //events
        ['out of bounds'](){
            return true
        },

        update(props){
            if(!this.toggle)return
            this.updatePos(props)
            this.checkCollision()
            this.updateVelocity(props)
            this?.ui?.update({...this,...props})
            this.joined.forEach(join=>{
                join.update(props)
            })
            this.draw(props)
        },
        
    }
    if(!res.requirement()){
        return undefined
        feedback({message: res.requirementMessage || `requirements not met`})
    }else {
        res.load()
        return res
    }
}
