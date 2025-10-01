import { EventHandler } from "../../functions.js/DRAW/events.js"
import { domextract } from "./domextract.js"
import { makedraggable } from "./makedraggable.js"
let lastOptions = []
export function Options({to, name, width = `10vw`, height= `2rem`, x= `30vw`, y= `3rem`, stopX = false, stopY= false,appends=[]}){
    const res = {
        name, btnstyle: '',
        buttons:{},
        style(){return `border-radius: ${height};overflow-x: auto; overflow-y: hidden;border:1px solid #7b0b4e;background: #500a34; padding: .1rem; display: flex; justify-content: space-between;align-items: center;position: absolute; top: ${y}; left: ${x}; z-index: 5;width: ${width}; height: calc(${height} + .3rem)`},
        btnstyley(){return`box-shadow: 2px 3px 12px black;background-size: calc(${height} / 2); background-position: center; background-repeat: no-repeat;width: 1.8rem; height: 1.8rem;border-radius: 50%;overflow:hidden;cursor:pointer;color:white; font-size: .9rem;display: flex; justify-content: center;align-items:center;flex-shrink: 0;margin-bottom: .5rem; background-color: #2d012d;border:1px solid #7b0b4e;`},
        btnstylex(){return`box-shadow: 2px 3px 12px black;background-size: calc(${height} / 2); background-position: center; background-repeat: no-repeat;width: 1.8rem; height: 1.8rem;border-radius: 50%;overflow:hidden;cursor:pointer;color:white; font-size: .9rem;display: flex; justify-content: center;align-items:center;flex-shrink: 0;margin-right: .5rem; background-color: #2d012d;border:1px solid #7b0b4e;`},
        blueIndicatorStyle(){return `overflow: hidden;flex-direction: column;opacity: 0.3;display: flex; justify-content: flex-start; align-items: center;border: 2px solid #69062a;;border-radius: 5px;background-color: #42092b;position: absolute; width: ${height}; height: 80%;`},
        exitsidestylex(){return `border-radius: 0 0 50% 50%; flex-shrink: 0;width: 3rem; height: ${height}; background: #1d0413;opacity:.5; margin-bottom: .5rem`},
        exitsidestyley(){return `border-radius: 0 50% 50% 0;flex-shrink: 0;width: 2rem;height: 3rem;background: #1d0413;opacity: .5;margin-right: .5rem;`},
        load(){
            if(!to)return
            //DELETE ANY NAME SHARING OBJECTS
            this.deleteDupicate()
            //PUSH THIS OBJECT
            lastOptions.push(this)
            //ADD UI
            this.ui()
            //EXTRACT DOM FROM UI AND SAVE IN DOM OBJECT
            domextract(this.element, 'classname', this)
            //SETUP ELEMENTS TO APPEND TO WHEN DRAGGED
            this.appends()
            //UPDATE BUTTON STYLE
            this.btnstyle = this.btnstylex()
        }, 
        deleteDupicate(){
            const d = lastOptions.filter(op=>(op.name === name)).forEach(op=>op.remove())
        },
        ui(){
            if(!to)return
            this.element = document.createElement(`div`)
            this.element.classList.add('options')
            this.element.classList.add('xscroll')
            this.element.setAttribute(`style`, this.style())
            to.append(this.element)
            makedraggable(this.element, this.element, stopX, stopY)
        },
        add(name, callback, src='', arguementscallback = ()=>{return {}}){
            if(!to)return //if to isnt given 
            const div = document.createElement(`div`)
            div.classList.add(name)
            div.setAttribute(`style`, this.btnstyle)
            //HANDLE EVENTS
            EventHandler(div, 'option', 'click', ()=>{callback(arguementscallback())})
            //HANGLE SRC IMAGE AND TEXTCONTENT
            div.src = src
            this.handlenaming(div, src)
            this.element.append(div)
            //UPDATE DOM OBJECT BY EXTRACTING AND REPLACING
            domextract(this.element, 'classname', this)
            //ADD TO GLOBAL OBJECT - BUTTONS
            this.buttons[name] = div
            return div
        },
        handlenaming(div, src){
            if(!src){div.textContent = name}else {
                div.style.backgroundImage = `url(${src})`
            }
        },
        appends(){
            appends.forEach(obj=>{
                const element = obj.element
                const dir = obj.direction
                // CONDITIONS FOR MANAGEMENT OF DIRECTION DATA
                const conds = {
                    right: {
                        style: `top: 50%; right: calc(-${height} - ${5}px); transform:translateY(-50%);`,
                        bibstyle: this.exitsidestylex(), btnstyle: this.btnstyley()
                    }, 
                    left: {
                        style: `top: 50%; left: calc(-${height} - ${5}px); transform:translateY(-50%);`,
                        bibstyle: this.exitsidestylex(), btnstyle: this.btnstyley()
                    },
                    up: {
                        style: `bottom: calc(-${height} - ${5}px); left: 50%; width: 50%; height:${height};flex-direction:row;  transform:translateX(-50%);`,
                        bibstyle: this.exitsidestyley(), btnstyle: this.btnstylex()
                    },  
                }
                const ondrag = (e)=>{
                    // ONDRAG SHOULD CHECK CONDITIONS BASED ON ITS DIRECTION
                    const b = element.getBoundingClientRect()
                    conds[`right`].cond = ()=>(e.x < b.x + b.width + e.h && dir === 'right')
                    conds[`left`].cond = ()=>(e.x + e.w > b.x -e.h && dir === 'left')
                    conds[`up`].cond = ()=>(e.y < b.y + b.height + e.h && dir === 'up')
                    if(conds[dir].cond()){
                        this.indicateForAppend(element, conds[dir].style)
                    }else{
                        if(element.querySelector(`.blueIndicator`))
                        element.querySelector(`.blueIndicator`).remove()
                    }
                    
                }
                const onleave = (e)=>{
                    //ON LEAVE IF BLUE INDICATED SHOULD ADD BIB AND UPDATE BTN STYLE
                    if(element.querySelector(`.blueIndicator`)){
                        element.querySelector(`.blueIndicator`).remove()
                        element.append(this.element)
                        this.element.setAttribute(`style`, this.blueIndicatorStyle() + conds[dir].style + `opacity: 1`)
                        this.addbib(conds[dir].bibstyle)
                        this.updateButtonStyle(conds[dir].btnstyle)
                    }
                    
                }
                this.element.ondrag.push(ondrag)
                this.element.onleave.push(onleave)
            })
        },
        updateButtonStyle(style){
            //UPDATE ALL BUTTON TO STYLE
            for(let x in this.buttons){
                this.buttons[x].setAttribute(`style`, style)
                this.handlenaming(this.buttons[x], this.buttons[x].src)
            }
        },
        addbib(style){
            let div
            //ALWAYS GET THE SAME DIV
            if(!this.element.querySelector('.bib'))
            div = document.createElement(`div`)
            else div = this.element.querySelector('.bib')
        
            //SET ATTRIBUTES
            div.setAttribute(`style`, style)
            div.classList.add(`bib`)

            //ADD EVENTS TO IT
            EventHandler(div, 'remove ev', 'click', ()=>{
                div.remove()
                this.element.setAttribute(`style`, this.style()+ `opacity: 1`)
                this.updateButtonStyle(this.btnstylex())
                to.append(this.element)
            })
            //APPEND FIRST IN LINE
            this.element.prepend(div)
        },
        indicateForAppend(element, style){
            //SHOW WHERE APPEND IS TAKING PLACE
            element.style.overflow = `visible`
            if(!element.querySelector(`.blueIndicator`)){
                const div = document.createElement(`div`)
                div.classList.add(`blueIndicator`)
                element.append(div)
                div.setAttribute(`style`, this.blueIndicatorStyle() + style)
            }
            

        },
        remove(){
            this.element.remove()
        },
        events(){
            EventHandler()
        },
    }
    res.load()
    
    return res
}

const s ={}