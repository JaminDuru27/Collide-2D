import { LayoutCard } from "../../components/Material/DrawLayout"
import { LayoutGhost } from "../../components/Material/LayoutGhost"
import { Layout } from "./LayoutObject"

export function Layouts(Material){
    const res = {
        array: [],
        currentArray: [[]],
        load(){
        },
        updateDom(){
            this.element.innerHTML= ``
            this.array.forEach((layout, x)=>{
                const card = LayoutCard(this.element,layout.name, layout.data)
                card.element.ondragstart = (e)=>{
                    layout.determiningPosition = true
                }   
                card.element.ondragend = (e)=>{
                    layout.determiningPosition = false
                    this.ghost.remove()
                }
                const func = ()=>{
                    layout.determiningPosition = false
                    layout.inuse = true
                    const {indx, indy, target} = this.ghost.getPosition(layout)
                    if(indx >= 0 && indy >= 0){
                        layout.setPosition({indx, indy})//set grid pos
                        //update position in current array that's in update loop
                        if(!this.currentArray[indy])
                        this.currentArray[indy] = []
                        this.currentArray[indy][indx] = layout

                        this.array.splice(x, 1)
                        this.updateDom()
                        this.ghost.remove()
                    }
                }
                Material.ui.setupDragDrop({
                    drag: card.element, drop: Material.ui.dom.canvas, data: layout.data, 
                    callback:(data)=>{
                        if(!this.array.find(lay=>lay.data.id === data.id))
                        this.addLayout(data)
                        func()
                    }
                })
            })
        },
        checklayoutoverlap(layouta){
        },
        getselectedtiles(){
            const array = []
            this.currentArray.flat().forEach(layout=>{
                array.push(layout.layers.layer.getSelected())
            })
            return array.flat()
        },
        updatespace(){
            if(this.currentArray[0]?.length <=0)return
            //auto update grid to wrap map
            let lastnx = 0
            let lastny = 0
            const maxIndx = Math.max(...this.currentArray.flat().map(e=>{
                lastnx = Math.max(e.nx, lastnx)
                return e.indx
            }))
            const maxIndy = Math.max(...this.currentArray.flat().map(e=>{
                lastny = Math.max(e.ny, lastny)
                return e.indy
            }))
            Material.grid.nx = lastnx + maxIndx 
            Material.grid.ny = lastny + maxIndy
            Material.grid.populate()
        },
        determiningPosition(){
            this.array.forEach(layout=>{
                if(layout.determiningPosition){
                    const filterinuse = this.array.filter(e=>e.inuse)
                    const x = Material.mouse.x
                    const y = Material.mouse.y               
                    if(filterinuse.length <= 0){
                        this.ghost.mark(layout)
                        // layout.remove()
                    }else{
                        this.ghost.mark(layout)
                    }
                }
            })
        },
        addLayout(data){
            if(!this.array.find(e=>e.id === data.id)){
                this.array.push(Layout(Material, this, data))
                this.updateDom()
            }
        },
        ui(){
            
            this.SelectedTilesDOM = Material.ui.addSection('rightside', 'Selected Tiles')
            this.TilePluginsDOM = Material.ui.addSection('rightside', 'Tile Plugins')
            this.TileModifiersDOM = Material.ui.addSection('rightside', 'Tile Modifiers')
            this.TileDOM = Material.ui.addSection('rightside', 'Tile')
            this.LayersDOM = Material.ui.addSection('rightside', 'Layers')
            this.TileDOM = Material.ui.addSection('rightside', 'Tile Properties')
            this.TilePreviewDOM = Material.ui.addSection('rightside', 'Tile preview')
            this.element = Material.ui.addSection('rightside', 'Layouts').content
            this.ghost = LayoutGhost(Material, this)
            this.updateDom()
            this.array.forEach(layout=>layout.ui())
        },

        update(props){
            this.currentArray.forEach(col=>col.forEach(row=>row?.update(props)))
            this.determiningPosition()
            this.updatespace()
        }
    }
    res.load()
    return res
}

