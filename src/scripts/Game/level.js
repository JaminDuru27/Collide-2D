export function getExportLevel(){
    return `
function Level(Game){
    const res = {
        load(){
            this.imageLayers = ImageLayers(Game)
            this.world = World(Game)
            this.world.loadLevel(level1data)
            this.player = Player(Game)
            for(let x = 0 ; x<= 20; x++){
                this[${'`enemy${x}`'}] = Enemy(Game)
            }
            // this.enemies = Array.from({length:10}, (_, i)=>(Enemy()))
            return this
        },
        update(props){
            for(let x in this){
                if(this[x]?.update)this[x].update(props)
            }
        }
    }
    return res
}
    `
}