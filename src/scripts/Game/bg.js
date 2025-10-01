export function getExportImageLayers({bgs= 0, mgs=0, fgs = 0}){
    const res = {
        text: '',
        generate(){
            this.text += 
`function ImageLayers(Game){
    const res = {
        backLayer: [],
        middleLayer: [],
        frontLayer: [],
        load(){`
            for(let x = 1; x<= bgs; x++){
                this.text +=`
            this.addLayer({src: './assets/bg${x}.png', layer: 'back', speed: 1,})`}
            for(let x = 1; x<= mgs; x++){
                this.text +=`
            this.addLayer({src: './assets/mg${x}.png', layer: 'middle', speed: 1,})`}
            for(let x = 1; x<= fgs; x++){
                this.text +=`
            this.addLayer({src: './assets/fg${x}.png', layer: 'front', speed: 1,})`}
            
    this.text += 
`
        },
    
        addLayer({src, layer = 'back', speed}){ // back || middle || front
            const obj = Layer(Game,src)
            obj.speed = speed
            obj.speed = speed
            this[layer + 'Layer'].push(obj)
        }, 
        updateLayer(arr, props){
            arr.forEach(obj=>{
                obj.update(props)
            })
        },
        update(props){
            this.updateLayer(this.backLayer, props)
            this.updateLayer(this.middleLayer, props)
            this.updateLayer(this.frontLayer, props)
        }

    }
    res.load()
    return res
}    

function Layer(Game,src){
    const res = {
        src, x: 0, y: 0, w: Game.w, h: Game.h,
        vx: 0, speed: 1,
        load(){
            this.loadImage()
        },
        loadImage(){
            this.image = new Image()
            this.image.onload = ()=>{
                this.imgw = this.image.width
                this.imgh = this.image.height
                this.loaded = true
            }
            this.image.src = src
        },
        draw({ctx}){
            if(this.loaded){
                ctx.drawImage(this.image, this.x, this.y,this.w, this.h)
            }
        },
        update(props){
            this.draw(props)
            this.x += this.vx
        }
    }
    res.load()
    return res
    }`
    return this.text
    }
    }
    return res
// `
}