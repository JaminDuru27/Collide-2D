import { domextract } from "../../../components/DRAW/domextract"
import { SpriteMan } from "../../../components/Material/plugins/spriteman"
import { GenerateId } from "../../DRAW/generateId"
import { PluginLoader } from "../pluginloader"

export function SpriteManObject(Material, Layout, Layers, Layer, Tile){
    const res= {
        id: GenerateId(),//important
        name: `SpriteMan`,//important
        settingsoptions: [],//important
        requirement(){return Tile.sprite && Tile !== Material},//
        requirementMessage: `needs an image`,
        flip: false,
        framex: 0, framey: 0, frame: 0,
        offsetx:0, offsety: 0, offsetw: 0, offseth: 0,
        loop: true, clips: [], currentclip: undefined,
        framedelay: 0, nx: 1, ny: 1,
        image: Tile.sprite.image, 
        imgw: Tile.sprite.imgw,
        imgh: Tile.sprite.imgh,
        sx: Tile.sprite.sx, 
        sy:Tile.sprite.sy, 
        toggle: true,
        sw: Tile.sprite.sw,
        sh: Tile.sprite.sh,
        variablesOfInterest: ['nx', 'ny', 'framedelay', 'loop', 'framex', 'framey',], //must
        open(){ //must
            this.loader = PluginLoader(Material, Layout, Tile, this, this.name)
            this.ui = SpriteMan().ui(domextract(this.loader.ui.element).object.main, this, Material, Layout, Layers, Layer, Tile)
            //set the vars
            this.events(this.ui)
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
            this?.loader?.remove()
            Tile.nodes = Tile.nodes.filter(e=> e !== this) //delete this
            Tile.sprite = undefined
        },
        load(){  //must
            this.updateTileVars()

            this.settingsoptions
            .push({name:'savetosamesrc', callback: this.savetoallsrcsettingsprop.bind(this)}) //must
            Tile.sprite = this //must
            
            this.open()//must

            this.calcimgcsize()

            this.delay = Delay(this.framedelay, ()=>{
                this?.clipping()
            })

            this.clip(0, Math.floor(this.imgw/ this.imgcw) * Math.floor(this.imgh/ this.imgch))
        },
        updateTileVars(){
            Tile.setVariable({prop: this.name, nodeId: Tile.id})
            Tile.setFunction({prop: this.name, nodeId: Tile.id})
            Tile.setEvent({prop: this.name, nodeId: Tile.id})
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
        savetoallsrcsettingsprop({}){
            Layout.layers.array.forEach(layer=>{
                layer.tiles.forEach(tile=>{
                    if(tile.sprite === this)return
                    if(
                        tile.sprite.image.src === this.image.src &&
                        tile.sprite.sx === this.sx &&
                        tile.sprite.sy === this.sy
                    ){
                        const obj = SpriteManObject(Material, Layout, tile)
                        for(let x in this)obj[x] === this[x]
                        
                    }
                })
            })
        },
        
        events(ui){},
        
        
        async getBuffer(){
            const response = await fetch(this.image.url);
            const blob = await response.blob()
            this.buffer = await blob.arrayBuffer()
            return this.buffer
        },
        calcimgcsize(){
            this.imgcw = this.imgw / this.nx
            this.imgch = this.imgh / this.ny
            this.loaded = true
        },
        clip(from, to){
            this.clipping = this.clipFrames(from, to)
        },
        addClip({name = GenerateId(),from = 0, to = 0, data= {}}){
            const obj = Clip({sprite: this, name, delay: 1, from, to, shouldloop: false, data, onceArray:[],})
            this.clips.push(obj)
            Tile.setFunction({prop: `play ${obj.name} clip`, nodeId: Tile.id, set: ()=>{obj.play()},get:()=>()=>{}, par: this.name })
            return obj
        },
        stop(){
            this.clipping = ()=>{}
        },
        clipFrames(from, to){
            const fr = Math.min(from, to)
            this.frame = fr
            return ()=>{
                const fr = Math.min(from, to)
                const t = Math.max(from, to)
                if(this.loop)
                this.frame = (this.frame < to)?this.frame + 1 :this.frame = fr
                if(!this.loop)
                this.frame = (this.frame < to)?this.frame + 1 :this.frame = to

                this.updateFrame()
            }
        },
        updateFrame(){
            if(this.frame === 0){
                this.framex = 0
                this.framey = 0
                return
            }
            this.framey = Math.floor(this.frame / this.ny)
            this.framex = this.frame % this.nx
            if(this.ny === 1){
                this.framey = 0
                this.framex = this.frame
            }
            if(this.nx === 1){
                this.framex = 1
                this.framey = this.frame
            }
        },
        playclip(name){
            const clip = this.clips.filter(clip=>clip.name === name)[0]
            if(clip){
                if(clip.name === this.currentclip)return
                this.currentclip = clip.name
                this.clip(clip.from, clip.to)
                clip.play()
                return clip
            }
        },
        updatesource(){
            this.sx = this.framex * this.imgcw
            this.sy = this.framey * this.imgch
            this.sw = this.imgcw
            this.sh = this.imgch
        },
        draw({ctx, tile}){
            if(!this.loaded)return
            ctx.save()

            if(this.flip){
                ctx.translate(tile.absx + tile.absw /2, tile.absy + tile.absh / 2)
                ctx.scale(-1, 1)
                ctx.drawImage(this.image, this.sx,this.sy, this.sw, this.sh,
                tile.absx, tile.absy, -tile.absw/2, -tile.absh/2 )
            }else
                ctx.drawImage(this.image, this.sx,this.sy, this.sw, this.sh,
                tile.absx + this.offsetx, tile.absy + this.offsety, tile.absw + this.offsetw, tile.absh + this.offseth)
            ctx.restore()
        },
        drawPreviewCanvas(){
            this.ui.clearCtx()
            this.ui.ctx.drawImage(this.image, this.sx,this.sy, this.sw, this.sh, 
                0, 0, this.ui.canvas.width, this.ui.canvas.height)
        },
        update(props){
            if(!this.toggle)return
            this.calcimgcsize()
            this.updatesource()
            this.draw(props)
            this.updateFrame()
            this.delay.update(this)
            this.drawPreviewCanvas()
            
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
function Clip({sprite, name, from, to, shouldloop, data, onceArray= [],updateArray=[] }){
    const res= {
        name,
        from, to,
        shouldloop,
        data, onceArray, updateArray,
        framedelay: 0,
        load(){},
        stop(){
            sprite.clipping = ()=>{}
        },
        delay(value){
            this.framedelay = value
            return this
        },
        play(){
            if(this.name === sprite.currentclip)return
            sprite.currentclip = this.name
            sprite.clip(this.from, this.to)
            sprite.loop = this.shouldloop
            sprite.framedelay = this.framedelay
            return this
        },
        once(callback){
            this.onceArray.push(callback)
            return this
        },
        loop(){
            this.shouldloop = true
            return this
        },
        update(callback){
            
            this.updateArray.push(callback)
            return this
        }
    }
    res.load()
    return res
}

export function Delay(delay, callback){
    const res = {
        inc: 0,
        load(){},
        set(d){
            delay= d
        },
        update(sprite){
            if(this.inc >= sprite.framedelay){
                callback()
                this.inc = 0
            }else this.inc ++
        }
    }
    res.load()
    return res
}