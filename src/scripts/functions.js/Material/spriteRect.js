export function SpriteRect(Material,Tile, Layers, props){
    const res = {
        x: Tile.x, y: Tile.y, w:  Tile.w, h: Tile.h,
        load(){
            this.getImageFromProps()
        },
        getImageFromProps(){
            this.image = new Image()
            this.image.onload =()=>{
                this.imgw = this.image.width
                this.imgh = this.image.height
                this.sx  = props.sx
                this.sy  = props.sy
                this.sw  = props.sw
                this.sh  = props.sh
                this.widthMult = props.widthMult
                this.heightMult = props.heightMult
                this.loaded = true
            }
            this.image.src = props.src
        },
        draw({ctx, tile}){
            ctx.drawImage(this.image, this.sx, this.sy, this.sw, this.sh, tile.absx, tile.absy, tile.absw, tile.absh)
        },
        update(props){
            if(!this.loaded)return
            this.draw(props)
        },
    }
    res.load()
    return res
}
