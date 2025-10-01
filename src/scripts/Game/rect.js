export function getExportRect(){
    return `


function Rect(Game, Player, join){
    //need In Game, cw, ch, tx, ty, w, h, collisionbodies, canvas
    const res = {
        name: 'box',player: Player, friction: 0,
        x: 0, y: 0, w: Game.cw, h: Game.ch,
        vx: 0, vy: 0, weight: .3,color: 'transparent',   
        offsetx: 0, offsety: 0, offsetw:0, offseth:0,
        passthrough: false, shouldCheckForCollision: true,
        // EscapeWindow: false, 
        enableOverflow: true,
        enablePanningOnOverflow: true,
        enablePanningXOnOverflow: true,
        enablePanningYOnOverflow: true,
        joined: [], parent: null,
        oncollisionarray: [],
        exceptionarray: [], onexceptioncollisionarray:[],
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
        exception(array = []){
           array.forEach(e=>this.exceptionarray.push(e))
           return this  
        },
        setevents(array, eventsarraywrite){
            array.forEach(func=>{
                this[${'`${func.name}Events`'}] = []
                this[${'`on${func.name}`'}] = function(callback){
                    this[${'`${func.name}Events`'}].push({funcname: func.name, callback})
                    return this
                }
                eventsarraywrite.push(this[${'`${func.name}Events`'}])
            })
        },
        onExceptionCollision(callback){
            this.onexceptioncollisionarray.push(callback)
            return this
        },
        onCollision(callback){
            this.oncollisionarray.push(callback)
            return this
        },
        events(){
            const windowDet = [this.WindowBottom, this.WindowLeft, this.WindowRight, this.WindowTop, this.OutsideVeiwport, this.InsideVeiwport]
            this.Events = []
            this.setevents(windowDet, this.Events)
            //init events
            
        },
        callEvents(){
            this.Events.forEach(col=>{
                col.forEach(obj=>{
                    if(!obj.callback)return
                    if(this[obj.funcname]()){
                        obj?.callback()
                    }
                })
            })
        },
        load(){     
            Game.collisionbodies.push(this)
            this.automateVariables()
            this.events()
        },
        join(props){
            const rect = Rect(Game, Player,this)
            rect.shouldCheckForCollision = true
            this.joined.push(rect)
            rect.parent = this
            for(let x in props)rect[x] = props[x]
            rect.calculateParentOffSet(this)

            return rect
        },
        calculateParentOffSet(parent){
            if(this.parent){
                const x = (parent.x + parent.offsetx)- this.offsetx  
                const y = (parent.y + parent.offsety) - this.offsety 
                this.parentOffsetX = x
                this.parentOffsetY = y
                return {x, y}
            }
        },
        handleOffset(){
            if(join){
                this.x = join.x + this.offsetx
                this.y = join.y + this.offsety
                this.w = join.w + this.offsetw
                this.h = join.h + this.offseth
                this.vx = join.vx
                this.vy = join.vy
            }
        },
        Collision(){
            if(!this.shouldCheckForCollision)return
            const array = Game.collisionbodies
            array.forEach(arr=>{
                if(arr === this)return // cancel out self checking
                if(this.joined.filter(rect=>rect === arr).length > 0)return //filter if a joined rect is present
                if(this.exceptionarray.filter(name=>name === arr.name).length > 0){ //filter if an exception rect is present
                    if(this.AABBCollision(arr)){
                        this.onexceptioncollisionarray.forEach(func=>func(arr, arr.player))
                    }
                    return
                }
                if(this.AABBCollision(arr)){
                    this.oncollisionarray.forEach(col=>col(arr, arr.player))
                    if(!this.passthrough)this.resolveAABB(arr)
                }
            })
        },
        left(){return this.x},
        right(){return this.x + this.w},
        top(){return this.y},
        bottom(){return this.y + this.h},
        WindowTop(){return this.y + Game.ty < 0},
        WindowBottom(){
            return this.y + Game.ty> window.innerHeight - this.h
        },
        WindowLeft(){return this.x + Game?.tx < 0},
        WindowRight(){
            return this.x + Game.tx> window.innerWidth - this.w
        },
        resolveWorldTranslateRight(){
            if(Game.tx <= -(Game.w - window.innerWidth)){//dont move past right drawn world
                Game.tx  = -(Game.w - window.innerWidth)
                return
            }
            Game.tx = ((Game.w - this.x) - Game.w) + (window.innerWidth - this.w)

        },
        resolveWorldTranslateBottom(){
            if(Game.ty <= -(Game.h - window.innerHeight)){ //dont move past bottom drawn world
                Game.ty = -(Game.h - window.innerHeight)
                return
            }
            Game.ty = ((Game.h - this.y) - Game.h) + (window.innerHeight - this.h)
        },
        resolveWorldTranslateTop(){
            if(Game.ty >= 0){//dont move past top drawn world
                Game.ty = 0
                return
            }    
            Game.ty = ((Game.h - this.y) - Game.h)
        },
        resolveWorldTranslateLeft(){
            if(Game.tx >= 0){ //dont move past left drawn world
                Game.tx = 0
                return
            }
            Game.tx = ((Game.w - this.x) - Game.w)
        },
        InsideVeiwport(){
            const val = this.OutsideVeiwport()
            return (val)?false: true
        },
        OutsideVeiwport(){
            const {tx, ty, ui} = Game
            const canvas = Game.ctx.canvas
            const viewLeft   = tx;
            const viewRight  = tx + canvas.width;
            const viewTop    = ty;
            const viewBottom = ty + canvas.height;
            const px = this.x;
            const py = this.y;
            const pw = this.w;
            const ph = this.h;
            return (
                (this.x + this.w)- Game.tx >= window.innerWidth ||
                (this.y + this.h) -Game.ty>= window.innerHeight ||
                this.x - Game.tx <= 0 ||
                this.y - Game.ty <= 0

                // px + pw < viewLeft ||       // left of view
                // px > viewRight ||           // right of view
                // py + ph < viewTop ||        // above view
                // py > viewBottom             // below view
            );

        },
        AABBCollision(body){
            if(!body)return false
            const a = this
            const b = body
            return (
                a.left()   <  b.right() &&
                a.right()  >  b.left() &&
                a.top()    <  b.bottom() &&
                a.bottom() >  b.top()
            )
        },
        resolveAABB(arr){
            const mover = this
            const blocker = arr
            const overlapX1 = blocker.right() - mover.left() // from left
            const overlapX2 = mover.right() - blocker.left() // from right
            const overlapY1 = blocker.bottom() - mover.top() // from top
            const overlapY2 = mover.bottom() - blocker.top() // from bottom

            const minX = overlapX1 < overlapX2 ? overlapX1 : -overlapX2
            const minY = overlapY1 < overlapY2 ? overlapY1 : -overlapY2
            this.vy = 0
            if(Math.abs(minX) < Math.abs(minY)){
                //resolve horizontally
                mover.x += minX 
            } else{
                mover.y += minY 
            }
        },
        draw(ctx){
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.w, this.h)
        },
        updatejoin(ctx){
            this.joined.forEach(join=>join.update({ctx}))
        },
        handlePanning(){
            if(!this.enablePanningOnOverflow)return
            if(!this.enableOverflow)return
            if(this.WindowRight(Game) && this.vx > 0 && this.enablePanningXOnOverflow){
                this.resolveWorldTranslateRight()
            }
            if(this.WindowBottom(Game) && this.vy > 0 && this.enablePanningYOnOverflow){
                this.resolveWorldTranslateBottom()
            }
            if(this.WindowTop(Game) && this.vy < 0 && this.enablePanningYOnOverflow){
                this.resolveWorldTranslateTop()
            }
            if(this.WindowLeft(Game) && this.vx < 0 && this.enablePanningXOnOverflow){
                this.resolveWorldTranslateLeft()
            }
        },
        updateVelocity(){
            if(!join){
                this.y += this.vy
                this.x += this.vx
            }
        },
        updateParentPositionByOffset(){
            if(this.parent){
                this.parent.offsetx = this.x + this.offsetx + this.parentOffsetX
                this.parent.offsety = this.y + this.offsety + this.parentOffsetY
                // this.parent.vy = 0
                // this.parent.vx = 0
            }
        },
        handleWindowCollision(){
            // Game.tx = 0
            // Game.ty = 0
            if(this.OutsideVeiwport() &&  !this.enableOverflow){
                if( this.y + this.h > window.innerHeight){
                    this.vy = 0
                    this.y = window.innerHeight - this.h -1
                    // this.updateParentPositionByOffset()
                }
                if(this.x + this.w > window.innerWidth){
                    this.vx = 0
                    this.x = window.innerWidth - this.w -1
                    // this.updateParentPositionByOffset()
                }
                if(this.y < 0){
                    this.vy = 0
                    this.y = 0 + 1
                    // this.updateParentPositionByOffset()
                }
                if(this.x < 0){
                    this.vx = 0
                    this.x = 0 + 1
                    // this.updateParentPositionByOffset()
                }

            }
        },
        setVx(val){
            if(this.vx === 0)
            this.vx = val
            return this
        },
        setVy(val){
                this.vy = val
        },
        handleFriction(){
            if(Math.sign(this.vx) > 0){
                this.vx -=  this.friction
                if(this.vx <= 0)this.vx = 0
                return
            }
            if(Math.sign(this.vx < 0)){
                this.vx +=  this.friction
                if(this.vx >= 0)this.vx = 0
            }
            
        },
        update({ctx, renderer}){
            // if(!renderer)return
            ctx.save()
            this.draw(ctx)
            if(this.shouldCheckForCollision){
                this.updateVelocity()
                this.Collision()
                this.handleOffset()
                this.updatejoin(ctx)
                this.handlePanning()
                this.handleWindowCollision()
                this.callEvents()
                this.handleFriction()    
            }
            ctx.restore()
        }
    }

    res.load()
    return res
}
`
}