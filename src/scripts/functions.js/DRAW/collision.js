import { CollisionGroupDom } from "../../components/DRAW/collision.js"
import { domextract } from "../../components/DRAW/domextract.js"
import { Dropdown } from "../../components/DRAW/dropdown.js"
import { feedback } from "../../components/DRAW/feedback.js"
import { AABBCollision } from "./AABBCollision.js"
import { EventHandler } from "./events.js"
import { GenerateId } from "./generateId.js"
import { draw } from "./instances.js"
import { SATCollision } from "./SATCollision.js"

export function Collision(props = {}){
    const res = {
        load(){
            const type = this.gettype()
            if(type === `AABB`){
                this.type  = AABBCollision(props)
            }
            else if(type === `SAT`){
                this.type= SATCollision(props)
            }
        },
        gettype(){
            const folder = draw.instance.library.find(`collision`,(object, key)=>{},).object
            return folder.meta.type
        },
    }
    res.load()
    return res
}
export  function CollisionGroups(Instance){
    const res = {
        array: [],
        addbtnstyle(){return `width: 3rem;height: 3rem;display: flex;justify-content: center;align-items: center;margin: 0 auto;background: #3c0725;border-radius: 50%;`},
        load(){
            if(!this.array.length)this.addGroup() 
        },
        ui(){
            const dom = Instance.ui.addSection('rightside', 'Collision Groups')
            this.dom = dom
            this.element = dom[`Collision Groups`]
            this.element.innerHTML += `
            <div class='add' popupdescription='Add Group' popupdirection = 'top' style='${this.addbtnstyle()}'>+</div>
            `
            domextract(this.element, `classname`, this)
        },
        clear(){
            this.array.forEach(arr=>arr.remove())
        },
        addGroup(){
            this.group = CollisionGroup(Instance,this)
            return this.group
        },
        events(){
            EventHandler(this.dom.add, '', 'click', ()=>{
                this.group = CollisionGroup(Instance,this)
            })
        },
        updateDom(){
            if(!this.dom)return
            this.dom.content.innerHTML =``
            Instance.library.find(`collisionGroup`, (object, key)=>{
                object.meta.array.forEach(group=>{
                    const dom = CollisionGroupDom(this, this.dom.content, group.name, ()=>{},()=>{}) 
                    const drop = Dropdown({target: dom.element})
                    drop.add('delete', ()=>{
                        this.array.forEach((arr, i)=>{
                            if(arr.id === group.id)this.array.splice(i, 1)
                        })
                        Instance.library.writeFolder('collisionGroup', 'array', this.array)
                        this.updateDom()
                    })
                    drop.add('rename', ()=>{
                        // dom.dom.title.click()
                        feedback({message: 'entername', placeholder: 'enter name here', callback:(e)=>{
                            group.name = e.target.value
                            Instance.library.writeFolder('collisionGroup', 'array', this.array)
                            this.updateDom()    
                        }})
                    })
                })
            })
        },
        update(){
            this.array.forEach(arr=>{
                arr.update()
            })

        }
    }
    return res
}

export function CollisionGroup(Instance,Groups){
    const res = {
        hide: false,
        array: [],
        id: GenerateId()+'Group',
        rand(){
            return Math.floor(Math.random() * (225 - 2) + 2)
        },
        remove(){
            Groups.array.splice(x, 1)
            Groups.updateDom()
        },
        load(){
            this.color = `rgba(${this.rand()}, ${this.rand()}, ${this.rand()}, 0.5)`
            this.name = `group ` + (Groups.array.length + 1)
            Groups.array.push(this)
            Instance.library.writeFolder('collisionGroup', 'array', Groups.array)
            Groups.updateDom()
        },
        update(){
            if(this.hide)return
            // log(Instance.library.find(this.id))    
            if(!this.id){
                this.id =GenerateId() + 'Group'
            }

            this.array.forEach(col=>{
                col.update()
            })
            
        }
    }
    res.load()
    return res
}