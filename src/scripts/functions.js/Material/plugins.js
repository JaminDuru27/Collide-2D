import * as PLUGINS from '../../components/Material/plugins/export'
import * as MODS from '../../components/Material/mods/exports'
import { PluginsUI } from '../../components/Material/ui'
export function Plugins(Material){
    const res =  {
        load(){
            // this.ui.add()
        },
        open(callback, typemods){
            if(this.ui)this.ui.remove()
            this.ui = PluginsUI(document.body)
            this.ui.dom.title.textContent = (typemods)?`MODS`: `PLUGINS`
            const OBJ = (typemods)?MODS: PLUGINS
            for(let x in OBJ){
                const plug = OBJ[x]()
                this.ui.add(plug, ()=>{
                    callback(plug, x, typemods)
                })
            }
        }
    }
    res.load()
    return res
}