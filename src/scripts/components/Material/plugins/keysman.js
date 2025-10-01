import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { EventHandler } from "../../../functions.js/DRAW/events"
import { MaterialOptions } from "../options"

export function KeysMan(){
    const res= {
        name: 'KeysMan',
        bottomstyle(){return`width: 100%;gap: .4rem;height: 100%;padding: .4rem;color: #fff;background: #00000063;display: flex;justify-content: space-between;align-items: flex-start;flex-direction: column;`},
        style(){return`display: flex;flex-direction: column;width: 100%;height: 100%;position: relative;`},
        contentstyle(){return`overflow: hidden scroll;width: 100%;height: 100%;background: #00000042;border-radius: .5rem;display: flex;flex-direction: column;gap: 0.4rem;padding: .3rem;`},
        titlewrapstyle(){return `width: 100%;gap: .4rem;height: 10%;padding: .4rem;color: #fff;background: #00000063;display: flex;justify-content: flex-start;align-items: flex-start;`},
        imgiconstyle(){return `width: .5rem;height: .5rem`},
        fieldstyle(){return `position: relative;display: flex;align-items: center; font-size: .5rem;justify-content: space-around;height: 5.5rem;margin: .4rem 0;border: 3px solid #040410;border-left: 3px solid #ffffff24;border-top: 3px solid #5b565621;padding: 0 .3rem;border-radius: .5rem;gap: .3rem;`},
        recstyle(){return `opacity: .5;margin: 0 .3rem;width: .9rem;height: .9rem;background: red;border-radius: 50%;outline: 2px solid red;outline-offset: .5rem;`},
        keystyle(){return `text-align: center; text-transform: uppercase;background: #ffffff1a;padding: .1rem;border-radius: .2rem;border: 1px solid #ffffff1c;`},
        selectstyle(){return `width: 4rem; height: 1.2rem;border-left: 3px solid #ffffff24;border-radius: .5rem;position: relative;background: transparent;color: #fff;padding: 0 .3rem;font-size: 0.6rem;border-radius: .3rem;`},
        titlestyle(){return`position: absolute;top: 0;left: 13px;transform: translateY(-50%);background: #0d081b;padding: .1rem .3rem;border-radius: .5rem;`},
        inputstyle(){return`background: transparent;border: 1px solid #ffffff54;border-radius: .3rem;height: 1.3rem;width: 4rem;color: #fff;`},
        deletefieldstyle(){return`position: absolute;bottom: 0;right: 0;width: .8rem;transform: translateY(-50%);background: #0d081b;border-radius: .5rem;height: .8rem;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},

        optionsId: GenerateId() + `Options`,
        fields:[],
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/keysman.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        setOptions(Mat){
            Mat.optionsHandler.find('globalvariablesoption').
            add({nameId: 'link to keysMan', callback:()=>{
                console.log(`open keyman and add subject`)
            }})

        },
        assignValues(Mat, obj){
           // this.dom.index.getValue = ()=> Tile.collision.weight
           // this.dom.index.getName = ()=> RocketManObject.name
           // this.dom.index.getTile = ()=> Tile
        },
        assignOptions(Mat){
            // Mat.optionsHandler.assignOptionToElement(this.optionsId, this.dom.index)
        },
        events(obj){
            this.dom.add.onclick = ()=>{
                this.add({KeysMan, KeysManObject: obj})
            }
            EventHandler(window, '', 'keydown',(e)=>{
                this.key = e.key
                if(this.keycallback)
                this.keycallback(e.key)
            })
        },
        add({name= `New Listener`, Tile, KeysManObject}){
            const field = Field({name, Tile, KeysMan: this, KeysManObject})
            this.fields.push(field)
            return field
        },
        ui(to, KeysManObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div class='bottom' style='${this.bottomstyle()}'>
            <div style='${this.titlewrapstyle()}'>
            <div style='font-size: .5rem;'>Bindings</div>
            <img class='add' style = '${this.imgiconstyle() }' src='../assets/icons/plus.png' />
            <img class='del' style = '${this.imgiconstyle() }' src='../assets/icons/delete.png' />
            </div>
            <div style='${this.contentstyle()}' class='content yscroll'></div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.setOptions(Material)//recommended
            this.events(KeysManObject)

            this.setTogglebtn(KeysManObject)
            this.updateToggle(KeysManObject)
            return this
        },
        setTogglebtn(obj){
            if(this.togglebtn)this.togglebtn.remove()
            this.togglebtn = document.createElement(`div`)
            this.togglebtn.setAttribute(`style`, this.togglestyle())
            const setbtncolor = ()=>this.togglebtn.style.background = (obj.toggle)?'#432aaa':'#2c2938'
            setbtncolor()
            this.togglebtn.onclick = ()=>{
                obj.toggle = (obj.toggle)?false:true
                this.updateToggle(obj)
                setbtncolor()
            }
            this.element.append(this.togglebtn)
        },
        updateToggle(obj){
            if(!obj.toggle){
                if(this.togglediv)this.togglediv.remove()
                this.togglediv = document.createElement(`div`)
                this.togglediv.setAttribute(`style`, `z-index: 20; opacity: 0.4;width: 100%; height: 100%; position: absolute; top: 0; left: 0; background: #000`)
                this.togglediv.ondblclick = ()=>{
                    obj.toggle = true
                    this.setTogglebtn(obj)
                    this.updateToggle(obj)
                }
                this.element.append(this.togglediv)
            }else{
                this?.togglediv?.remove()
            }
        },
    }

    return res
}

function Field({name = 'event 1', Tile,key,KeysMan, KeysManObject}){
    const res = {
        key,
        name,
        tile: Tile,
        currentVarname: `select variable`,
        currentkeytype: 'keydown',
        currenttype: 'string',
        currentkey: 'SHIFT',
        currentevent:()=>{},
        deleteCallback:()=>{},
        currentcall: `continous`,
        currentvalue: 0,
        ui(keysMan){
            this.element = document.createElement('div')
            this.element.setAttribute(`style`, keysMan.fieldstyle())
            this.element.innerHTML += `
            <div style="height: 100%;padding: 1.3rem 0 .3rem 0;display: flex;flex-direction: column;gap: 1rem;">
            <div class='rec' style='${keysMan.recstyle()}'></div>
            <div class='key' style='${keysMan.keystyle()}'>${this.currentkey}</div>
            </div>
            <div style='display: flex;padding: .3rem;flex-direction: column;height: 100%;gap: .3rem;'>
                <div class='varname' style='${keysMan.titlestyle()}'>${this.currentVarname}</div>
                <input class='value' style='${keysMan.inputstyle()}' value = '${this.currentvalue}' type='${this.currenttype}'/>
            </div>

            <div style='display: flex;padding: .3rem;flex-direction: column;height: 100%;gap: .3rem;'>
                keypresss
                <select id='keydown' name='keydown' class='keydown'  style='${keysMan.selectstyle()}'> 
                <option value = 'keydown' style='color: #000;'>keydown</option>
                <option value = 'keyup' style='color: #000;'>keyup</option>
                </select>
                call
                <select id='call' class='call' style='${keysMan.selectstyle()}'> 
                <option value = 'continous' style='color: #000;'>continuos</option>
                <option value = 'once' style='color: #000;'>once</option>
                <option value = 'twice' style='color: #000;'>twice</option>
                </select>
            </div>
            <img src='../assets/icons/delete.png' class='delete' style='${keysMan.deletefieldstyle()}'/>
            `
            keysMan.dom.content.append(this.element)
            domextract(this.element, 'classname', this)
            this.dom.keydown.value = this.currentkeytype
            this.dom.call.value = this.currentcall
            this.dom.value.value = this.currentvalue
            this.dom.delete.onclick = ()=>this.deleteCallback()
            this.updateVariablesOptions()
            
        },
        updateVariablesOptions(){
            // Tile.gat
            const element = this.dom.varname
            const parent = this.dom.varname
            EventHandler(element, '', 'click', (e)=>{
                const dom = MaterialOptions()
                .set({clientX: element.clientLeft, clientY: element.clientTop}, document.body)
                Tile.showvariables(e, ({v})=>{
                    const type = this.getType(v.get())
                        this.currenttype = (type === `function`)?`button`:(type === 'boolean')?'checkbox':type
                        this.currentvariable = v  
                        this.currentVarname = v.prop
                        this.dom.value.value =  this.currentvariable.get()
                        this.dom.value.type =  this.currenttype
                        this.dom.varname.textContent = this.currentVarname

                })
            })
        },
        events(keysMan){
           this.toggle = -1
           this.dom.rec.onclick  =()=>{
                this.toggle *= -1
                if(this.toggle > 0){
                    keysMan.fields.forEach(field=>{
                        field.toggle = -1
                        field.dom.rec.style.opacity  = `.5`
                        keysMan.keycallback = ()=>{}
                    })

                    this.dom.rec.style.opacity = `1`
                    keysMan.keycallback = (key)=>{
                        this.currentkey = key
                        this.updateKeyDom(key)
                        this.dom.rec.style.opacity = `0.5`
                        this.toggle = -1
                        keysMan.keycallback = ()=>{}
                    }
                }else if(this.toggle < 0){
                    this.dom.rec.style.opacity = `0.5`
                    keysMan.keycallback = ()=>{}

                }
            }
            this.dom.value.oninput = (i)=>{
                this.currentvalue  = (this.currenttype === 'number')?+(i.target.value):(this.currenttype === `boolean`)?+(i.target.value):(this.currenttype === `function`)?i.target.value():i.target.value
                if(this.currentvalue === `true`)this.currentvalue = true
                if(this.currentvalue === `false`)this.currentvalue = false
                this.updatewindowevent(KeysMan)
            }
            this.dom.value.onchange = (e)=>{
                console.log(e.target.checked && this.currentkeytype === `checkbox`)
                if(e.target.checked && this.currentkeytype === `checkbox`)
                this.currentkeytype = (e.checked === 'true')?true:(e.checked === 'false')?false:e.checked
                this.updatewindowevent(KeysMan)

            }
            this.dom.keydown.onchange = (e)=>{
                window.removeEventListener(this.currentkeytype, this.currentevent)
                this.currentkeytype = e.target.value
                this.updatewindowevent(KeysMan)
            }
            
            this.dom.call.onchange = (e)=>{
                this.currentcall = e.target.value
                this.updatewindowevent(KeysMan)

            }
            
        },
        updatewindowevent(KeysMan){
            window.removeEventListener(this.currentkeytype, this.currentevent)
            
            this.currentevent = (e)=>{
                console.log(KeysManObject)
                if(!KeysManObject.toggle)return
                if(e.key !== this.currentkey)return
                if(this?.currentvariable)
                this?.currentvariable?.set(this.currentvalue)
                console.log(this.currentvariable?.get())
            }
            window.addEventListener(this.currentkeytype, this.currentevent)

        },
        remove(){
            window.removeEventListener(this.currentkeytype, this.currentevent)
            this.element.remove()
        },
        getType(val){
            const type = typeof val
            return type
        },
        updateKeyDom(key){
            if(key === ' ')key === `Space`
            this.key = key
            this.dom.key.textContent = key
        },
        updateNameDom(name){
            this.name = name
            this.dom.name.textContent = name
        },
        load(keysMan){
            this.ui(keysMan)
            this.events(keysMan)
            this.updatewindowevent(keysMan)
            
        }
    }
    res.load(KeysMan)
    return res
}