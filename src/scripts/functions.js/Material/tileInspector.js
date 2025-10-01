import { TileIInspectorUI } from "../../components/Material/tileInspector"
import { TilePreview } from "../../components/Material/tilePreview"

export function TileInspector(Material){
    const res = {
        load(){
        },
        showTiles(array = []){
            this.array = array
            this.updateTilesDom()
        },
        updateTilesDom(){
            this.dom  = TileIInspectorUI(Material, this)
            this.array.forEach(tile=>{
                const tiledom = this.dom.add(tile, ()=>{
                    const preview = TilePreview(Material, tile, (plugindom, name)=>{
                        tile.addtonodes(plugindom, name)
                        
                    })
                    tile.upd
                })
            })
        },
        update(){}
    }
    res.load()
    return res
}