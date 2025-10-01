import { Dropdown } from "../DRAW/dropdown"

export function NodeDom(to, node, tile,  array = 'nodes'){
    const res = {
        index: tile[array].indexOf(node) ,
        style(){return ` width: 100%;position: relative;padding: .2rem;border: none;height: 5vh;`},
        titlestyle(){return ` position: absolute;top: 0;left: 0;width: calc(100% - .4rem);height: 17vh;border-radius: .5rem;display: flex;backdrop-filter: blur(5px);background: #0000004a;border: 2px solid #ffffff52;justify-content: center;align-items: flex-start;color: #ffffffa8;margin: .2rem;overflow: hidden;font-size: 1.3rem;`},
        imgstyle(){return ` width: 100%;height: 12vw;border: 1px solid #fff;border-radius: .5rem;`},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`node`)
            this.element.setAttribute(`style`, this.style())
            this.element.innerHTML += `
            <img class='image' style = '${this.imgstyle()}' src='${node.ui.getThumbnailImage().src}'>
            <div class='title' style = '${this.titlestyle()}'>${node.ui.name}</div>
            `
            to.append(this.element)
        },
        events(){
            this.element.draggable = true
            this.element.onclick = ()=>{
                node.open()
            }
            this.element.ondrag = (e)=>{
                e.dataTransfer.setData('text/nodeindex', `${this.index}`)
            }
            this.element.ondragover = (e)=>{
                e.preventDefault()
            }
            this.element.ondrop = (e)=>{
                const index = e.dataTransfer.getData('text/nodeindex')
                const index2 = this.index
                const temp = tile[array][0]
                tile[array][index2] = tile[array][+(index)]
                tile[array][+(index)] = tile[array][index2]
                tile.updateNodesAndModsDom()
            }
            this.drop = Dropdown({target:this.element})
            this.drop.add('open',()=>{
                node.open()
            })
            this.drop.add('delete',()=>{
                tile[array][this.index].remove()
                tile.updateNodesAndModsDom()
            })
            this.drop.add('moveup',()=>{
                const temp = tile[array][this.index - 1]
                if(!temp)return
                tile[array][this.index - 1]= tile[array][this.index]
                tile[array][this.index] = temp
                tile.updateNodesAndModsDom()
            })
            this.drop.add('movedown',()=>{
                const temp = tile[array][this.index + 1]
                if(!temp)return
                tile[array][this.index + 1]= tile[array][this.index]
                tile[array][this.index] = temp
                tile.updateNodesAndModsDom()
            })

        },
        load(){
            this.ui()
            this.events()
        },
        
        update(){}
    }
    res.load()
    return res
}