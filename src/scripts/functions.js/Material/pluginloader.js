import { makedraggable } from "../../components/DRAW/makedraggable"
import { pluginLoaderUI } from "../../components/Material/pluginloader"
import * as  MODUIS from '../../components/Material/mods/exports'
import * as PLUGINUIS from '../../components/Material/plugins/export'
import * as MODOBJS from '../../functions.js/Material/mods/exports'
import * as PLUGINOBJS from '../../functions.js/Material/plugins/exports'
import { EventHandler } from "../DRAW/events"
let OBJ;
export function PluginLoader(Material, Layout, Tile, pluginObj, pluginUiName, isMod){
    const res = {
        presets: [],
        load(){
            OBJ = (isMod)? MODUIS:PLUGINUIS
            this.ui = pluginLoaderUI(Material, Layout, Tile,pluginObj, OBJ[pluginUiName](), this)

            EventHandler(this.ui.dom.head, '', 'mousedown', (e)=>{
                if(e.button !== 2)return
                const option = Material.optionsHandler.find('globalpresetoption')
                const array = Material.groups.getAllGroups(Tile)
                console.log(array,`array`) 
                array.forEach(grup=>{
                    option.remove(`Send To ${grup.name} Group`)
                    option.add({nameId: `Send To ${grup.name} Group`, src:'', callback:()=>{
                        grup.tiles.forEach(tile=>{
                            const add = (array,OBJS)=>{
                                const find = tile[array].find(e=>e.name === pluginObj.name)
                                if(find)return
                                const obj = OBJS[`${pluginObj.name}Object`](Material, Layout, tile)
                                tile[array].push(obj)

                                //updating according to vars od interest
                                pluginObj.variablesOfInterest.forEach(variable=>{
                                    console.log(variable)
                                    // obj[variable] = tile[variable]
                                })
                                tile.updateNodesAndModsDom()
                                tile.updateTilePropsDom()
                            }
                            add(`nodes`, PLUGINOBJS)
                            
                        })
                    }})
                })
                option.show()
            })
            // makedraggable(this.ui.element, this.ui.element)
        },
        remove(){
            this.ui.remove()
        },
        find(id){
            const list = []
            this.presets.forEach(p=>{
                if(p.nodeId === id)list.push(p)
            })
            return list
        },
        addpreset({name, variablesOfInterest, nodeId}){
            const obj = {
                name,
                variablesOfInterest,
                nodeId,
                call: ()=>{
                    variablesOfInterest.forEach(v=>{
                        v.set(v.newValue)
                        console.log(v.prop,v.newValue)
                    })
                    pluginObj.open()
                },
            }
            this.presets.push(obj)
            return obj
        },
    }
    res.load()
    return res

}