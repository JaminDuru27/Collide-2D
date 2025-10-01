import { feedback } from "../../components/DRAW/feedback.js"
import { SettingsUI } from "../../components/DRAW/settings.js"
import { EventHandler } from "./events.js"
import { ExportOptions } from "./exportOptions.js"
import { GUI } from "./gui.js"

export function Settings(Instance){
    const res = {
        load(){
            let col = Instance.library.find(`collision`).object
            Instance.library.writeFolder('collision', `type`, `AABB`)
        },
        setvars(){
            
        },
        setui(){
            this.domfactory = SettingsUI()
            const gui = GUI('Collision', this.domfactory.dom.content)
            const collisionFolder = Instance.library.find(`collision`).object
            gui.add(collisionFolder.meta,'type', 'collisionType', [
                {name: `AABB`, callback:()=>{}},
                {name: `SAT`, callback:()=>{}},
            ]).after = (e)=>{
                feedback({message: `Are you sure? Doing this will erase your previous collisions`,messageType:'warning', placeholder:'proceed', inputtype:'button', 
                    callback:()=>{
                        Instance.library.writeFolder('collision', `type`, e.target.value)
                        Instance.library.writeFolder('collision', `collisions`, [])
                        //empty collision shapes created
                        const shapes = Instance.library.find('shapes', (object, key)=>{
                            Instance.library.delete(`shapes`)
                            Instance.library.addFolder(`shapes`,object.meta.Parent.meta.name)
                        })
                        
                        Instance.library.updateDom()
                    }
                })
            }
            gui.add(this, 'export', 'export options')
        },
        [`export`](){
            this.domfactory.element.remove()
            ExportOptions()
        },
        shortcuts(){
            const shortcuts = Instance.shortcuts
            shortcuts.add('show exports', [`0`, Instance.ui.ctx.canvas], ()=>{
            ExportOptions()
          } )
        },
        events(){
            EventHandler(Instance.ui.dom.settings, 'settings', 'click', ()=>{
                this.setvars()
                this.setui()
            })
        }
    }
    res.load()
    return res
}