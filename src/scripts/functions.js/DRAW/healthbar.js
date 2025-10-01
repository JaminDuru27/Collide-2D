export function HealthBar(rect){
    const res = {
        offsetx: 0, offsety: 0,
        h: 5,
        increment: 5,
        decrement: 5,
        bars: [],
        bordercolor: '#000',
        onfullarray:[], onemptyarray: [], ondeadbararray: [],
        automateVariables(){
            for(let v in this){
                if(typeof this[v] === 'string'  || 
                   typeof this[v] === 'number'  ||
                   typeof this[v] === 'boolean'){
                   this[`$${v}`] = function(value){
                        this[v] = value
                        return this
                    }
                }
            }
        },
        addbar(color= 'green', healthPerc = 100){
            const bar = {
                w: (rect.w * (healthPerc/100)), color}
            this.bars.push(bar)
            bar.index = this.bars.indexOf(bar)
            return this
        },
        onFull(callback){
            this.onfullarray.push(callback)
            return this
        },
        onEmptyBar(callback){
            this.ondeadbararray.push(callback)
            return this
        },
        onEmpty(callback){
            this.onemptyarray.push(callback)
            return this
        },
        load(){
            this.automateVariables()
        },
        decrease(){
            if(this.bars.length <= 0){
                this.onemptyarray.forEach(e=>e())
                return
            }
            const lastbar = this.bars[this.bars.length-1]
            lastbar.w -= rect.w * (this.increment /100)
            return this
        },
        increase(){
            if(this.bars.length <= 0){
                return
            }
            const lastbar = this.bars[this.bars.length-1]
            if(lastbar.w < rect.w)
            lastbar.w += rect.w * (this.increment /100)
            if(lastbar.w >= rect.w)
            this.onfullarray.forEach(c=>c())
            else lastbar.w = rect.w
            return this
        },
        draw(ctx){
            ctx.save()
            this.bars.forEach(bar=>{
                ctx.beginPath()
                ctx.lineWidth = 2
                ctx.fillStyle = bar.color
                ctx.strokeStyle = this.bordercolor
                ctx.rect(rect.x + this.offsetx, rect.y+ this.offsety, bar.w, this.h)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()                
            })
            ctx.restore()

        },
        updateBars(){
            if(this.bars.length <= 0)return
            const deadBar = this.bars.find(e=>e.w <= 0)
            if(deadBar){
                this.ondeadbararray.forEach(c=>c())
                this.bars.splice(deadBar.index, 1)
            }
        },
        update({ctx}){
            this.draw(ctx)
            this.updateBars()
        }
    }
    res.load()
    return res
}
    
    