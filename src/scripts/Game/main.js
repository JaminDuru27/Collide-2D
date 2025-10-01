export function getExportMain(name, w, h, cw, ch){
    return `

function Game(){
    const res = {
        name: '${name}',
        tx: 0, ty: 0,
        w: ${w},
        h: ${h},
        cw: ${cw},
        ch: ${ch},
        collisionbodies: [],
        load(){
            this.getCanvas()
            this.levels = [Level(this)]
            this.level = this.levels[0].load()
        },
        getCanvas(){
            this.canvas = document.querySelector('canvas')
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
            this.ctx = this.canvas.getContext('2d')
        },
        render(){
            if(this?.ctx){
                this.ctx.clearRect(0,0, this.ctx.canvas.width, this.ctx.canvas.height)

                this.ctx.save()
                this.ctx.scale(1, 1)
                this.ctx.translate(this.tx, this.ty)
                if(this?.level)
                this.level.update({ctx:this.ctx})
                this.ctx.restore()
            }
            
        }
    }
    res.load()
    return res
}
const game = new Game()
function animate(){
    requestAnimationFrame(animate)
    game.render()
} 
animate()
    
    `
}