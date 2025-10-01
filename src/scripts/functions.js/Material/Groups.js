import { feedback } from "../../components/DRAW/feedback"
import { GroupsUI } from "../../components/Material/Groups"
import { GenerateId } from "../DRAW/generateId"

export function Groups(Material){
    const res = {
        array: [],
        load(){
        },
        ui(){
            this.dom = GroupsUI(Material)
            this.dom.onadd = ()=>{
                feedback({message: 'create a group', placeholder:'enter a name', callback:(e)=>{
                    this.add({name: e.value})
                }})
            }
        },
        add({name, callback= ()=>{}}){
            if(name.trim() !== ''){
                const group = this.createGroup({name, callback})
                this.array.push(group)
                this.updateDom()
                return group
            }
            return this
        },
        updateDom(){
            this.dom.element.innerHTML = ``
            this.array.forEach(e=>{
                this.dom.addGroup(e.name, e.tiles, e.callback,)
            })
        },
        getAllGroups(Tile){
            const array = []
            this.array.forEach(group=>{
                const find = group.tiles.find(e=>e.id === Tile.id)

                if(find)
                array.push(group)

            })
            return array
        },
        createGroup({name, callback}){
            const data = {
                tiles: [],
                name, callback,
                add(tile){
                    if(!this.tiles.find(e=>e === tile))
                    this.tiles.push(tile)
                    Material.optionsHandler.find(tile.id).add({nameId: `remove from ` + name, src: '../assets/icons/pencil.png', callback:()=>{
                        this.tiles.splice(this.tiles.indexOf(tile), 1)
                        Material.optionsHandler.find(tile.id).remove(`remove from ` + name)
                        res.updateDom()
                    }}).show()

                    
                    
                }
            }
            return data
        }

    }
    res.load()
    return res
}