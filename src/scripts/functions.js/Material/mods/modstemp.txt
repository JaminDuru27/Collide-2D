import { PluginLoader } from "../pluginloader"

export function EventsHandlerObject(Material,Layout, Tile){
    const res = {
        name: `EventsHandler`,
        ui(to, ControllaObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.classList.add(`EventsHandler`)
            to.append(this.element)
        },
        load(){
            PluginLoader(Material, Layout, Tile, this, this.name,true)
        }
    }
    res.load()
    return res
}