import { domextract } from "../DRAW/domextract"
import { Dropdown } from "../DRAW/dropdown"
import { feedback } from "../DRAW/feedback"

import * as PLUGINOBJS from '../../functions.js/Material/plugins/exports'
import { MaterialOptions } from "./options"
let e
export function pluginLoaderUI(Material, Layout, Tile,pluginObj, pluginUI, pluginloader){
    const res = {
        style(){return `z-index: 9;width: 50vw;height: 50vh;background: #ffffff12;position: absolute;top: 50%;left: 50%; transform: translate(-50%, -50% );border-radius: .5rem;border: 1px solid #e2e2e733;overflow: hidden;backdrop-filter: blur(7px);padding: .3rem`},
        headstyle(){return `height: 5%;font-size: .7rem;display: flex;justify-content: space-evenly;align-items: center;color: #fff;`},
        mainstyle(){return `overflow:hidden;height: 92%;border-radius: .5rem;border: 1px solid #ffffff4d;margin-top: 2%;position: relative;oveflow: hidden `},
        titlestyle(){return ``},
        imgstyle(){return `position: absolute;top: .3rem;left: .3rem;width: 5%;height: 7%;opacity: .5;border-radius: .15rem;`},
        presetsstyle(){return `position: relative;background: #ffffff12;border-radius: .2rem;outline: 1px solid #ffffff4a;padding: .1rem .3rem;`},
        settingsstyle() { return `background: #fff;z-index: 10;position: absolute;top: .5rem;right: .5rem;width: .7rem;height: .7rem;opacity: .5;`},
        presetmainstyle(){return `padding: .1rem;position: absolute;left: 0;z-index: 1;overflow: hidden scroll;bottom: -6rem;width: 200%;height: 5rem;border-radius: .5rem;background: #ffffff08;backdrop-filter: blur(8px);border: 1px solid #ffffff1a;box-shadow: 2px 3px 15px 2px #201f1f42;`},
        presetstyle(){return`width: 100%;height: 1rem;background: #ffffff1a;border-radius: .2rem;border: 1px solid #ffffff0d;margin: .4rem 0;padding: 0 .2rem;overflow: hidden;`},
        settingsmainstyle(){return `padding: 0.1rem;position: absolute;left: -4rem;z-index: 6;overflow: hidden scroll;backdrop-filter: blur(7px);bottom: -6rem;width: 5rem;height: 5rem;border-radius: 0.5rem;background: rgba(255, 255, 255, 0.03);border: 1px solid rgba(255, 255, 255, 0.1);box-shadow: rgba(32, 31, 31, 0.26) 2px 3px 15px 2px;display: block;`},
        ui(){
            if(e)e.remove()
            this.element= document.createElement(`div`)
            e = this
            this.element.classList.add(`pluginloader`)
            this.element.setAttribute('style', this.style())
            this.element.innerHTML += `
            <div class = 'head' style='${this.headstyle()}'>
                <img style='${this.imgstyle()}' src='${pluginUI.getThumbnailImage().src}' />
                <div style='${this.titlestyle()}'>${pluginUI.name}</div>
                <div class='presets' style='${this.presetsstyle()}'>Presets</div>
                <div class='settings' style='${this.settingsstyle()}'></div>
            </div>
            <div class = 'main' style='${this.mainstyle()}'></div>
            `
            document.body.append(this.element)
            domextract(this.element, `classname`, this)
        },
        events(){
            this.dom.settings.onclick = ()=>{
                this.remove()
            }
            this.dom.presets.onmousedown = (e)=>{
                if(e.button === 0){
                    const options = MaterialOptions()
                    .set(e, document.body)
                    const presets = pluginloader?.find(pluginObj.id)
                    console.log(presets)
                    presets.forEach(preset=>{
                        options.add(preset.name, ()=>{
                            preset.call()
                        })
                    })
                }
                if(e.button === 2){
                    feedback({message: `Enter Preset Name`, callback: (e)=>{
                        pluginloader.addpreset({
                            name: e.target.value,
                            variablesOfInterest:[...pluginObj.variablesOfInterest.map(v=>{return {...v, newValue: v.get()}})], 
                            nodeId: pluginObj.id,
                        })
                    }})   
                }
            }
        },
        remove(){
            this.element.remove()
        },
        load(){
            this.ui()
            this.events()
        },
        update(){},
    }
    res.load()
    return res
}