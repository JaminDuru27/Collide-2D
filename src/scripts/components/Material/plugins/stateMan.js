import { domextract } from "../../DRAW/domextract"
import { GenerateId } from "../../../functions.js/DRAW/generateId"
import { MaterialOptions } from "../options"
import { feedback } from "../../DRAW/feedback"

export function StateMan(){
    const res= {
        name: 'StateMan',
        style(){return`transition:.3s ease; background: #000;width: 100%;height: 100%;gap: .3rem;padding: .2rem;color: #fff;display: flex;justify-content: space-between;align-items: center;`},
        canvasstyle(){return`width: calc(100% / 3);height: 100%;border-radius: .5rem;border: 1px solid grey;`},
        titlewrapstyle(){return`display: flex; justify-content:space-between; align-items: center;`},
        titlestyle(){return`font-size: .7rem;`},
        sectionstyle(){return`width: calc(100% / 3);height: 100%; padding: .4rem;position: relative`},
        addstyle(){return`width: .4rem;height: .4rem;background: #fff;`},
        contentstyle(){return`position: relative;margin: 1rem 0;display: flex;justify-content: flex-start;align-items: center;flex-direction: column;gap: .3rem;overflow: hidden scroll;height: 65%;`},
        statestyle(){return`flex-shrink: 0;margin: .4rem 0;width: 100%;height: 3rem;position: relative;border-radius: .5rem;border: 1px solid #ffffff4a;padding: .2rem;font-size: .7rem; gap:.4rem;display: flex;justify-content: flex-start;align-items: center;`},
        statetitlestyle(){return`position: absolute;top: 0;transform: translate(50%, -50%);left: 0;background: #000000;padding: 0 .2rem;font-size: .5rem;`},
        vartitlestyle(){return`position: absolute;top: 0;left: 0;background: #000000;padding: 0 .2rem;font-size: .5rem;`},
        addvarstyle(){return`position: absolute;top: 0;right: 0;background: #fff; width: 1rem; height: 1rem;padding: 0 .2rem;font-size: .5rem;`},
        varcontentstyle(){return`position: absolute;top: 0;left: 0;background: #0a0a0aff;padding: 0 .2rem;font-size: .5rem;`},
        statevarstyle(){return `border-radius: 1rem;padding: .3rem .5rem;background: #ffffff12;border: 1px solid #ffffff33;`},
        inputstyle(){return `width: 50%;border: none;border-radius: .5rem;padding: .1rem;color: #ffffff;background: #ffffff24;`},
        variablestyle(){return `display: flex;color: #fff;padding: .3rem .5rem;margin: .4rem 0;justify-content: space-between;border-radius: .5rem;border: 1px solid #ffffff3b;font-size: .8rem;align-items: center;`},
        conditionsstyle(){return `height: 4rem;overflow: hidden scroll;`},
        conditionstitlestyle(){return `cursor: pointer;border-bottom: 2px solid #ffffff4f;width: fit-content;padding: .3rem 0; font-size: .8rem;`},
        conditionstyle(){return `font-size: .55rem;padding: .4rem .5rem;border-radius: .5rem;position: relative;color: #000;margin: .4rem 0;width: fit-content;background: #ffffff78;`},
        vstyle(){return`z-index: 10;position: absolute;top: 0;left: 0;width: 100%;border-radius: .5rem;padding: .2rem;background: #00000024;backdrop-filter: blur(5px);`},
        vopstyle(){return`font-size:.7rem;background: transparent;border: none;color: #fff;appearance: none;-webkit-appearance: none;`},
        vvaluestyle(){return`width: 2rem;background: #ffffff70;border: none;border-radius: .5rem;color: #000;padding: .2rem;`},
        vbuttonstyle(){return`border: 1px solid #ffffff8f;width: 100%;background: transparent;padding: .5rem;border-radius: .5rem;border: none;margin-top: .5rem;backdrop-filter: blur(8px);color: #fff;`},
        vtitlestyle(){return`font-size:.6rem;`},
        condexitstyle(){return `width: .5rem;position: relative;color: #000;background: transparent;position: absolute;height: .5rem;top: 0;right: 0;`},
        livestatesstyle(){return `position: relative;left: 0;width: 100%;background: #ffffff17;border-radius: .5rem;padding: .4rem;gap: .2rem;backdrop-filter: blur(5px);margin: 0 0 1rem 0;display: flex;flex-wrap: wrap;`},
        livestatestyle(){return `font-size: .6rem;padding: .4rem .4rem;background: #ffffff21;border-radius: .8rem;width: fit-content;position: relative;`},
        livestyle(){return `background: #05cc05;width: .7rem;height: .7rem;border-radius: 50%;position: absolute;right: 0;top: 0;transform: translate(10%, -10%);border: 3px solid #171717;`},
        togglestyle(){return `width: .5rem;height: .5rem;outline: 2px solid grey;background: #7e779e;position: absolute;left: 0.5rem;top: .5rem;border-radius: 50%;outline-offset: .1rem;`},
        optionsId: GenerateId() + `Options`,
        getThumbnailImage(){ //important
            const image = new Image()
            image.src = '../assets/images/stateMan.jpg'
            return image
        },
        remove(){//important
            this.element.remove()
        },
        checkTypeForInput(obj, prop){
            let type = typeof obj[prop] 
            let value = obj[prop]
            if(type === `boolean`){type = `checkbox`}
            if(type === `number`)value = +(obj[prop])
            if(type === `function`)type = +(button)
            return {type, value}
        },
        getinputdom({style, oninput, onmouserightclick, id}){
            const input = document.createElement(`input`)
            input.id = id
            input.placeholder = id
            input.setAttribute(`style`, this.inputstyle())
            input.oninput = (e)=>{
                oninput(e)
            }
            input.onmousedown = (e)=>{
                if(e.buttons === 2){
                    onmouserightclick(e)
                }
            }
            return input
        },
        addState(state, Tile){
            const div = document.createElement(`div`)
            div.classList.add(`state`)
            div.classList.add(`xscroll`)
            div.setAttribute(`style`, this.statestyle())
            div.innerHTML += `
            <div class='title' style='${this.statetitlestyle()}'>${state.name}</div>
            `
            this.dom.statecontent.append(div)
            const dom = domextract(div).object
            state.vars.forEach(v=>{
                const elem = document.createElement(`div`)
                elem.classList.add(`state`)
                elem.setAttribute(`style`, this.statevarstyle())
                elem.innerHTML += `${v.prop}`
                div.append(elem)
            })
            div.onclick = ()=>{
                this.openvars(state, Tile)
            }
            div.onmousedown = (e)=>{
                if(e.button === 2){
                    const option = MaterialOptions()
                    .set(e, document.body)
                    .add('edit', ()=>{
                        this.openvars(state, Tile)
                        this.updateVars()
                        this.updateConds()
                    })
                    .add('delete', ()=>{
                        state.delete()
                        option.remove()
                    })
                }
            }

            return this
        },
        addPopupCondDom(v, Tile,cb){
            const div = document.createElement(`div`)
            div.setAttribute(`style`, this.vstyle())
            div.innerHTML += `
                <div class='wrap' style='display: flex; justify-content:space-between; align-items: center;'>
                    <div class='title' style='${this.vtitlestyle()}'>when ${v.prop}</div>
                    <select class='operator' style='${this.vopstyle()}'>
                    <option class='greaterthan' style='color: #000' value='>'> > </option>
                    <option class='lessthan' style='color: #000' value='<'> < </option>
                    <option class='equalto' style='color: #000' value='='> = </option>
                    <option class='notequalto' style='color: #000' value='!'> ! </option>
                    </select>
                    <div class='valuecase'><input class='value' style='${this.vvaluestyle()}' type='${v.parseinput()}' /></div>
                </div>
                <button class='done' style='${this.vbuttonstyle()}'>set</button>
            `
            this.dom.vars.append(div)
            const dom  = domextract(div).object
            dom.done.onclick = ()=>{
                const checkbox = ()=> v.parseinput() === `checkbox`
                cb(dom.operator.value, 
                    (checkbox())
                    ? {get(){return dom.value.checked}}
                    : {get(){return dom.value.value}}
                )
                div.remove()
            }
            dom.valuecase.onmousedown = (e)=>{
                if(e.button !== 2)return
                Tile.showvariables(e, ({v})=>{
                    dom.valuecase.innerHTML = ``
                    const el = document.createElement(`div`)
                    el.setAttribute(`style`, `font-size: .7rem`)
                    el.textContent = v.prop
                    dom.valuecase.append(el)
                    //update the onlcick event
                    dom.done.onclick = ()=>{
                        cb(dom.operator.value, v)
                        div.remove()
                    }
                }, [`events`])
            }

            //CONDITION


            return {...dom,div}
        },

        updateVars(state, Tile){
            this.dom.varhead.textContent = `Variables - ${state.name}`
            this.dom.varhead.onclick = (e)=>{
                const option =MaterialOptions()
                .set(e, document.body)
                Tile.showvariables(e, ({v, options, subs})=>{
                    const V = state.add(v)
                    this.updateVars(state, Tile)
                    option.remove()
                }, [`functions`])

                this.openvars(state, Tile)
            }
            this.dom.varcontent.innerHTML = ``
            state.vars.forEach(v=>{
                const div = document.createElement(`div`)
                div.classList.add(`variable`)
                div.setAttribute(`style`, this.variablestyle())
                div.innerHTML += `
                <div class='title'>${v.prop}</div>
                <div class='exit' style='${this.condexitstyle()}'></div>
                <input class='input' style='${this.inputstyle()}' value='${v.newValue}' checked='${v.newValue}'  type='${v.parseinput()}' />
                <div class = '' style='position: absolute;top: .5rem;right: .5rem;font-size: .5rem;text-transform: capitalize;letter-spacing: .03rem;padding: .1rem .2rem;color: #ffffff7d;background: #000;border-radius: .3rem;'>
                ${v.call}
                </div>
                `
                this.dom.varcontent.append(div)
                const dom = domextract(div).object
                dom.input.onmousedown = (e)=>{
                    if(e.button === 2){
                        const option = MaterialOptions()
                        .set(e, document.body)
                        .add('set call times', ()=>{
                            feedback({message: `enter times ${v.prop} should reassign`, type: 'number',callback:(e)=>{
                                v.call = +(e.target.value)
                                this.updateVars(state, Tile)
                                option.remove()
                            }})
                        })
                        .add('call infinitely', ()=>{
                            v.call = Infinity
                            option.remove()
                            this.updateVars(state, Tile)
                        })
                    }
                }
                dom.input.oninput = (e)=>{
                    v.newValue = v.parseoutput(e.target.value)
                }
                dom.input.onchange = (e)=>{
                    if(v.parseinput() === `checkbox`)
                    v.newValue = v.parseoutput(e.target.checked)
                }
                dom.exit.onclick = (e)=>{
                    v.remove()
                    this.updateVars(state, Tile)
                }
            })   
            
        },
        updatelivestates(truestates){
            this.dom.livestates.innerHTML = ``
            truestates.forEach(state=>{
                const div = this.livestatediv(state)
            })
        },
        livestatediv(state){
            const div = document.createElement(`div`)
            div.classList.add(`livestate`)
            div.setAttribute(`style`, this.livestatestyle())
            div.innerHTML+=`
            ${state.name}
            <div style='${this.livestyle()}' ></div>
            `
            this.dom.livestates.append(div)
            return div
        },
        updateConds(state, Tile){
            this.dom.condhead.onclick = (e)=>{
                const option = MaterialOptions()
                .set(e, document.body)
                //vars
                const events = Tile.getEvents() 
                const variables = Tile.getVariables() 
                
                Tile.showvariables(e, ({v})=>{
                    this.parsev(v, Tile, state)
                })
                //events
                events.forEach(event=>{
                    console.log(`ev`, event)
                    // option.add(`on ${event.name}`, ()=>{
                    //     const cond = ()=> event.get()
                    //     state.addcondition(`when on ${event.name}`, cond)
                    //     this.updateConds(state, Tile)  
                    //     option.remove()

                    // })
                })
            }
            this.dom.conds.innerHTML = ``
            state.conds.forEach(cond=>{
                const div = document.createElement(`div`)
                div.setAttribute(`style`, this.conditionstyle())
                div.textContent = cond.text
                const remove = document.createElement(`div`)
                remove.classList.add(`exit`)
                remove.setAttribute(`style`, this.condexitstyle())
                remove.onclick = ()=>{
                    cond.remove()
                    this.updateConds(state, Tile)  

                }
                div.append(remove)
                this.dom.conds.append(div)
            })  
               
        },
        parsev(v, Tile, state){
            const events = Tile.getEvents() 
            const variables = Tile.getVariables() 
                
            const notcheck =()=>v.parseinput() !== `checkbox`
            const notfunc =()=>v.parseinput() !== `button`
            const check =()=>v.parseinput() === `checkbox`
            const func =()=>v.parseinput() === `button`
            if(func()){ // function doesnt call
                feedback({message: `variable is has no value`})
                option.remove()
                return
            }
            const dom = this.addPopupCondDom(v, Tile,(operator, value)=>{
                let op = operator
                const equal =()=>operator === `=`
                const notequal =()=>operator === `!`
                const lessthan =()=>operator === `<`
                const greaterthan =()=>operator === `>`
                
                
                if(check()){
                    dom.lessthan.setAttribute(`disabled`, `true`)
                    dom.greaterthan.setAttribute(`disabled`, `true`)
                }
                //check if value is an operatot
                let cond = 
                (equal() && notfunc())?()=>v.get() === value.get()
                :(notequal() && notfunc())?()=>v.get() !== value.get()
                :(lessthan() && notfunc())?()=>v.get() < value.get()
                :(greaterthan() && notfunc())?()=>v.get() > value.get()
                :()=>true
                state.addcondition(`when ${v.prop} ${op} ${value.prop}`, cond)
                this.updateConds(state, Tile)  
                return
            })
            dom.lessthan.setAttribute(`enabled`, `true`)
            dom.greaterthan.setAttribute(`enabled`, `true`)
            dom.equalto.setAttribute(`enabled`, `true`)
            dom.notequalto.setAttribute(`enabled`, `true`)
            if(check()){
                dom.lessthan.setAttribute(`disbled`, `true`)
                dom.greaterthan.setAttribute(`disabled`, `true`)
            }
        },
        openvars(state, Tile){
            this.updateVars(state, Tile)
            
            this.updateConds(state, Tile)
        },
        events(StateManObject){
            this.dom.addstate.onclick = ()=>{
                StateManObject.add()
            }
        },
        disableooptions(){},
        enableoptions(){

        },
        ui(to, StateManObject, Material, Layout, Layers, Layer, Tile){
            this.element = document.createElement(`div`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <canvas class='canvas' style='${this.canvasstyle()}'></canvas>
            <div class='states' style='${this.sectionstyle()}'>
                <div class='livestates' style='${this.livestatesstyle()}'></div>

                <div class='' style='${this.titlewrapstyle()}'>
                    <div class='' style='${this.titlestyle()}'>States</div>
                    <div class='addstate' style='${this.addstyle()}'></div>
                </div>
                <div class='statecontent yscroll' style='${this.contentstyle()}'></div>

            </div>
            <div class='vars' style='${this.sectionstyle()}'>
                <div style='${this.conditionstitlestyle()} ' class='condhead'>Conditions</div>
                <div style='${this.conditionsstyle()} yscroll' class='conds yscroll' >
                </div>
                <div style='${this.conditionstitlestyle()}' class='varhead'>Variables</div>
                <div class='varcontent yscroll' style='${this.contentstyle()} height:50%;'>
                </div>
            </div>
            `
            to.append(this.element)
            domextract(this.element, 'classname',this)
            this.events(StateManObject)
            this.setTogglebtn(StateManObject)
            this.updateToggle(StateManObject)
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