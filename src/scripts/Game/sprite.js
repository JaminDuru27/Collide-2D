export function getExportSprite(){
    return `




function Sprite(rect, game, src, nx, ny){
    const res = {
        nx, ny, flipX: 'right',
        framex: 0, framey: 0, frame: 0,
        offsetx:0, offsety: 0, offsetw: 0, offseth: 0,
        loop: true,clips: [], currentclip: undefined,
        framedelay: 0,
        automateVariables(){
            for(let v in this){
                if(typeof this[v] === 'string'  || 
                   typeof this[v] === 'number'  ||
                   typeof this[v] === 'boolean'){
                   this[${'`$${v}`'}] = function(value){
                        this[v] = value
                        return this
                    }
                }
            }
        },
        load(){
            this.automateVariables()
            this.loadImages()
            this.delay = Delay(this.framedelay, ()=>{
                ///updateclip with delay
                this?.clipping()
            })
            this.clipping = this.clipFrames(0, 3)
        },
        async getBuffer(){
            const response = await fetch(this.image.url);
            const blob = await response.blob()
            this.buffer = await blob.arrayBuffer()
            return this.buffer
        },
        loadImages(){
            this.image = document.createElement('img')
            this.image.onload = ()=>{
                this.imgw = this.image.width
                this.imgh = this.image.height
                this.imgcw = this.image.width / nx
                this.imgch = this.image.height / ny
                this.loaded = true
            }
            this.image.src = src
        },
        clip(from, to){

            this.clipping = this.clipFrames(from, to)
        },
        addClip({name = GenerateId(),from = 0, to = 0, data= {}}){
            const obj = Clip({sprite: this, name, delay: 1, from, to, shouldloop: false, data, onceArray:[],})
            this.clips.push(obj)
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
            this.framey = Math.floor(this.frame / ny)
            this.framex = this.frame % nx
        },
        playclip(name){
            const obj = this.clips.filter(obj=>obj.name === name)[0]
            if(obj){
                if(obj.name === this.currentclip)return
                this.currentclip = obj.name
                this.clip(obj.from, obj.to)
                this.loop = obj.shouldloop
                return obj
            }
        },
        draw({ctx}){
            if(!this.loaded)return
            
            if(this.flipX === 'left'){
                ctx.save()
                ctx.translate((rect.x + this.offsetx)+ rect.w + rect.w *.5, (rect.y + this.offsety)); // Move to the player's position
                ctx.scale(-1, 1); // Flip horizontally
                ctx.drawImage(
                    this.image, 
                    this.framex * this.imgcw,
                    this.framey * this.imgch, 
                    this.imgcw, 
                    this.imgch,
                    0,0,
                    rect.w + this.offsetw, 
                    rect.h + this.offseth
                )
            }else{
                ctx.save()
                ctx.translate(0, 0)
                ctx.scale(1, 1); // Flip horizontally
                ctx.drawImage(
                    this.image, 
                    this.framex * this.imgcw,
                    this.framey * this.imgch, 
                    this.imgcw, 
                    this.imgch,
                    rect.x + this.offsetx, 
                    rect.y + this.offsety, 
                    rect.w + this.offsetw, 
                    rect.h + this.offseth
                )
            }
            
            ctx.restore()
        },
        update(props){
            this.draw(props)
            this.updateFrame()
            this.delay.update(this)
        },
    }
    res.load()
    return res
}







function Clip({sprite, name, from, to, shouldloop, data, onceArray= [],updateArray=[] }){
    const res= {
        name, delay: 1,
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







function Delay(delay, callback){
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
`
}