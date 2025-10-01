import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { MaterialOptions } from "../options"

export function Panman(){
    const res= {
        name: 'Panman',
        style(){return`height: 100%;width: 100%;background: #010821;position: relative;color: #fff;font-size: .7rem;`},
        canvasflexstyle(){return`height: 60%;width: 100%;background: #000513;padding: .5rem;position: relative;color: #fff;font-size: .7rem;display: flex;justify-content: space-between;align-items: center;`},
        propliststyle(){return`width: 40%;height: 100%;border-radius: .5rem;background: #00040f;padding: .5rem;border: 1px solid #010c2f;display: flex;justify-content: space-between;align-items: center;flex-direction: column;overflow: hidden scroll;gap: .5rem;`},
        canvasstyle(){return`width: 58%;height: 100%;border-radius: .5rem;background: #00040f;padding: .5rem;border: 1px solid #010c2f;display: flex;justify-content: space-between;align-items: center;flex-direction: column;overflow: hidden scroll;gap: .5rem;`},
        bottomstyle(){return`height: 40%;width: 100%;background: #000513a1;position: relative; `},
        tagsstyle(){return`display: flex;justify-content: space-around;align-items: center;padding: .4rem;`},
        tagstyle(){return`cursor:pointer;opacity: .5;color: #ffffff;background: #00081f;padding: .4rem .5rem;border-radius: 1rem;border: 2px solid #ffffffa6;`},
        contentstyle(){return`width: 100%;height: 50%;padding: .5rem;border: 2px solid #ffffff2e;border-radius: .5rem;display: flex;justify-content: flex-start; gap: .5rem;align-items: center;overflow: scroll hidden;position: relative;`},
        contenttitlestyle(){return`opacity: .2;text-transform: uppercase;font-size: .5rem;position: absolute;top: .5rem;left: .5rem;`},
        inputstyle(){return`width: 50%;color: #fff;background: #ffffff21;border: 1px solid #ffffff21;border-radius: .5rem;margin-left: .5rem;padding: .1rem;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        sidebarstyle(){return `position: absolute;width: 40%;background: #0000003d;padding: .3rem;backdrop-filter: blur(7px);border-radius: .3rem;right: 0;top: 0;border-left: 1px solid #ffffff12;height: 100%;display: flex;transition: .3s ease;box-shadow: -2px 12px 12px -2px #000;justify-content: space-around;align-items: center;flex-direction: column;`},
        setsidestyle(){return `width: 100%;cursor: pointer;padding: .3rem;text-align: center;background: #0000006e;border-radius: .5rem;`},
        bundlestyle(){return `padding: .3rem .5rem;background: #00040f;border-radius: 1rem;color: #b3aeae;`},
        exitstyle(){return `width: .5rem; height: .5rem; position: absolute; top: .5rem;right: .5rem;`}, 
        addstyle(){return`cursor:pointer;width: 100%;padding: .1rem;font-size: .7rem;background: #ffffff21;border: none;color: #fff;border-radius: .5rem;`},
        varsstyle(){return `width: 100%;height: 3rem;background: #0000004f;border-radius: .4rem;border: 1px solid #000;overflow: hidden scroll;display: flex;padding: .3rem;justify-content: space-between;align-items: center;gap: .3rem;flex-direction: column;`},
        vstyle(){return `position: relative;width: 100%;height: fit-content;background: #0000004f;border-radius: .4rem;border: 1px solid #000;display: flex;padding: .3rem;justify-content: space-between;align-items: center;`},
        
        currentside: `left`,
        optionsId: GenerateId() + `Options`,
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/panman.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        updateVars({to, PanmanObject, inputstyle,Material}){
           to.innerHTML = ``
           PanmanObject.variablesOfInterest.forEach((v)=>{
                const input = this.getinputdom({v ,to,})
                input.onmousedown = (e)=>{
                    if(e.buttons === 2)
                    Material.optionsHandler.find('globalvariablesoption').show(e)
                }
                input.oninput  = (e)=>{
                    if(v.parseinput() === `number` || v.parseinput() === `string`)
                    v.set(e.target.value)
                }
                input.onchange  = (e)=>{
                    if(v.parseinput() === `checkbox`)
                    v.set(e.target.checked)
                }

          })
        },
        tagEvents(PanmanObject, Tile){
            this.element.querySelectorAll(`.tag`).forEach(tag=>{
                tag.onclick = ()=>{
                    this.currentside = tag.getAttribute(`name`)
                    this.updatetagBG()
                    this.updateBundle(PanmanObject, Tile)
                }
            })
        },
        updatetagBG(){
            this.element.querySelectorAll(`.tag`).forEach(tag=>{
                const tagname = tag.getAttribute(`name`)
                if(this.currentside === tagname)tag.style.backgroundColor = ` #f3f3f395`
                else tag.style.backgroundColor = ` #00081f`
            })
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
        getinputdom({v, to}){
            const div = document.createElement(`div`)
            div.textContent = v.prop
            div.setAttribute(`style`, `display: flex; justify-content: center; align-items: center; font-size: .6rem;`)
            const input = document.createElement(`input`)
            input.placeholder = v.prop
            input.type = v.parseinput()
            input.value = v.get()
            input.setAttribute(`style`, this.inputstyle())
            div.append(input)
            to.append(div)  

            return input
        },
        ui(to, PanmanObject, Material, Layout, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <div style='${this.canvasflexstyle()}'>
                <div style='${this.propliststyle()}' class='vars yscroll'></div>
                <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            </div>
            <div class='bottom' style='${this.bottomstyle()}'>
                <div style='${this.tagsstyle()}'>
                    <div class='tag' name='left' style='${this.tagstyle()}'>left</div>
                    <div class='tag' name='right' style='${this.tagstyle()}'>right</div>
                    <div class='tag' name='top' style='${this.tagstyle()}'>top</div>
                    <div class='tag' name='bottom' style='${this.tagstyle()}'>bottom</div>
                </div>
                <div class='content xscroll' style='${this.contentstyle()}'>
                    <div style='${this.contenttitlestyle()}'>Tiles</div>
                </div>

            </div>

            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.setTogglebtn(PanmanObject)
            this.updateToggle(PanmanObject)
            this.updateVars({to: this.dom.vars, PanmanObject, Material})
            this.events(PanmanObject, Material, Layout, Tile)
            this.updatetagBG()
            this.tagEvents(PanmanObject, Tile)
            return this
        },
        events(PanmanObject, Material ,Layout, Tile){
            this.dom.content.onmousedown = (e)=>{
                if(e.button !== 2)return
                const mainoption = MaterialOptions()
                .set(e, document.body)
                .add(`Layer`, ()=>{
                    const options = MaterialOptions()
                    .set(e, mainoption.element)
                    Layout.layers.array.forEach(layer=>{
                        options.add(layer.name, ()=>{
                            this.showsidebar(layer.name, layer.tiles, PanmanObject, Tile)
                            options.remove()
                            mainoption.remove()
                        })
                    })
                })
                .add(`Group`, ()=>{
                    const options = MaterialOptions()
                    .set(e, mainoption.element)
                    Material.groups.array.forEach(g=>{
                        options.add(g.name, ()=>{
                            this.showsidebar(g.name, g.tiles, PanmanObject, Tile)
                            options.remove()
                            mainoption.remove()
                        })
                    })
                })
                .add(`SelectTiles`, ()=>{})
            }
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
        updateBundle(PanmanObject, Tile){
            this.dom.content.innerHTML = ``
            PanmanObject[this.currentside].forEach(bundle=>{
                const div = document.createElement(`div`)
                div.setAttribute(`style`, this.bundlestyle())
                div.textContent = bundle.name
                div.onclick = ()=>{
                    this.showsidebar(bundle.name, bundle.array, PanmanObject, Tile, bundle)
                }
                this.dom.content.append(div)
            })
        },
        showsidebar(name,tilesarray, PanmanObject, Tile, bundle = PanmanObject.createBundle(name, tilesarray, this.currentside)){
            //create bundle
            if(this.sidebar)this.sidebar.remove()
            this.sidebar = document.createElement(`div`)
            this.sidebar.setAttribute(`style`, this.sidebarstyle())
            this.sidebar.innerHTML += `
            <div class= 'vars yscroll' style='${this.varsstyle()}'style='width: 100%'>
                
            </div>
            <button class='add' style='${this.addstyle()}'>add</button>
            <div class='set' style='${this.setsidestyle()}'>set</div>
            <div class='exit' style='${this.exitstyle()}'></div>
            `
            this.dom.bottom.append(this.sidebar)
            const dom = domextract(this.sidebar).object
            dom.set.onclick =  ()=>{
                this?.sidebar?.remove()
                bundle.set()
                this.updateBundle(PanmanObject, Tile)

            }
            dom.exit.onclick = ()=>{
                this.sidebar.remove()
            }
            dom.add.onclick = (e)=>{
                const ops = MaterialOptions()
                const set = ops.set(e, document.body)
                Tile.find(`Tile`, Tile.variables).subs.forEach(sub=>{
                    set.add(sub.prop, ()=>{
                        addvar(sub, true)
                        ops.remove()
                    }) 
                })

            }
            
            const addvar = (vv, shouldcreatenewvar)=>{
                const v = (shouldcreatenewvar)?bundle.addvar(vv):vv

                const div = document.createElement(`div`)
                div.classList.add(`var`)
                div.setAttribute(`style`, this.vstyle())
                div.innerHTML = `
                <div style = '${this.inputstyle()}'>${v.prop}</div>
                <input type='${v.parseinput()}' class='v' value = '${v.getinc()}' style = '${this.inputstyle()} text-align:center;' />
                <div style='${this.exitstyle()}' class='exit'></div>
                `
                const d = domextract(div).object
                d.v.oninput = (e)=>{
                    v.getinc = ()=>+(e.target.value)
                }
                d.v.onmousedown = (e)=>{
                    if(e.button !== 2)return
                }
                d.exit.onclick = ()=>{
                    v.remove()
                    div.remove()
                    updatebundlevars()
                }
                dom.vars.append(div)
            }

            const updatebundlevars = ()=>{
                dom.vars.innerHTML = ``
                bundle.vars.forEach(v=>{
                    addvar(v, false)
                })
            }
            updatebundlevars()

        },
        update(props){

        }
    }

    return res
}