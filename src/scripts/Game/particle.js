export function getExportParticle(){
    return `
function Particles(target){
    const res= {
        surfaceWidth: (!target)? 0: target.w,
        surfaceHeight: (!target)? 0: target.h,
        array: [], speedMax: 1, speedMin: 0.5,
        color: '#fff',
        shrinkSpeed: .2, boundOffsetX: 10, boundOffsetY:10,
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
        },
        getOffsetPositionAndVelocity(dir){
            if(typeof dir === 'object')return dir
            if(typeof dir === 'string'){
                if(dir === 'top') return {y: 0, x: 0, vx: 0, vy: -1}
                if(dir === 'left') return {x: 0, y: 0, vx: -1, vy: 0}
                if(dir === 'bottom') return {x: 0, y: this.surfaceHeight, vx: 0, vy: 1}
                if(dir === 'right') return {x: this.surfaceWidth, y:0, vx: 1, vy: 0}
                if(dir === 'bottomleft') return {x: 0, y: this.surfaceHeight, vx: 1, vy: 0}
                if(dir === 'bottomright') return {x: this.surfaceWidth, y: this.surfaceHeight, vx: 1, vy: 0}
            }
        },
        generate({dir = {} || '', number = 1, }){
            const pos = this.getOffsetPositionAndVelocity(dir)
            for(let x=0; x< number; x++){
                const particle= Particle({
                    target,
                    color: this.color,
                })

                //must have
                particle.offsetx = pos.x
                particle.offsety = pos.y
                particle.vxDir = pos.vx
                particle.vyDir = pos.vy
                particle.load()
                this.array.push(particle)
            }
            return this
        },
        update(props){
            this.array.map(
                (arr, x)=>(arr.delete)?this.array.splice(x, 1): arr.update(props)
            )
        }
    }
    res.load()
    return res
}

function Particle({target, color = '#fff'}){
    const res = {
        initx: target.x, inity: target.y,
        x: target.x, y: target.y,
        offsetx: 100, offsety: 100, 
        weightRange: {min: -.01, max: .05},
        weight: 0,
        surfh: 0, surfw: target.w,
        vxRange: {max: 2, min:.5},
        vyRange: {max: 0, min: -2},
        vx: 0, 
        vy: 0,
        vxDir: 0, vyDir: 0,
        shrinkSpeed: .4, 
        shrinkLimit: 3, 
        color: color,
        alphaRange: {min: 0.05, max:.2}, 
        alpha: 0,
        cwRange: {min: .2, max: 10},
        cw: 0,
        osxRange: {max:0.1, min:.05},// osx
        osx: .1,
        osxlengthRange: {max:0, min:1},
        osxlength: 1,
        osyRange: {max:0.1, min:.05}, //osy
        osy: .1,
        osylengthRange: {max:0, min:1},
        osylength: 1,
        shape: 'circle',
        anglex: 0,
        angley: 0,
        boundOffsetX: 10, boundOffsetY: 10,
        burnout(){
            this.cw -= this.shrinkSpeed
            if(this.cw <= this.shrinkLimit)this.delete = true
            if(this.cw <= 0)this.delete = true
        },
        load(){
            this.randomizePos()
            this.vx = this.rand(this.vxRange, false)
            this.vy = this.rand(this.vyRange, false)
            this.updateVelocity()
            this.weight = this.rand(this.weightRange, false)
            this.alpha = this.rand(this.alphaRange, false)
            this.cw = this.rand(this.cwRange, false)
            this.osx = this.rand(this.osxRange, false)
            this.osy = this.rand(this.osyRange, false)
            this.osxlength = this.rand(this.osxlengthRange, false)
            this.osylength = this.rand(this.osylengthRange, false)
        },
        updateVelocity(){
            this.vx *= this.vxDir
            this.vy *= this.vyDir
        },
        rand(val, floor = true){
            return (floor)? Math.floor(Math.random() * (val.max - val.min) + val.min)
            : Math.random() * (val.max - val.min) + val.min
        },
        randomizePos(){
            if(this.vxDir > 0 || this.vxDir < 0){//right && left
                const y = Math.floor(Math.random() * (this.surfh-0)+0)
                this.y += y 
            }
            if(this.vyDir > 0 || this.vyDir < 0){//right && left
                const x = Math.floor(Math.random() * (this.surfw-0)+0)
                this.x += x
            }
        },
        accel(){
            this.x += this.vx
        },
        gravity(){
            this.y += this.vy
            this.vy += this.weight
            this.x +=Math.cos(this.anglex) * this.osxlength
            this.anglex += this.osx //velocity
            this.y +=Math.cos(this.angley) * this.osylength
            this.angley += this.osy //velocity

        },
        draw({ctx}){
            ctx.globalAlpha = this.alpha
            ctx.fillStyle = this.color
            ctx.beginPath()
            if(this.shape === 'rect')
            ctx.fillRect(this.x + this.offsetx, this.y + this.offsety, this.cw, this.cw)
            else if(this.shape === 'circle')
            ctx.arc(this.x + this.offsetx, this.y + this.offsety, this.cw, 0, Math.PI * 2)
            ctx.fill()
            ctx.closePath()
            ctx.globalAlpha = 1
        },
        update(props){
            this.draw(props)
            this.gravity()
            this.accel()
            this.burnout()
        }
    }
    return res
}
    `
}