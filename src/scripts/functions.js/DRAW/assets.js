import { AssetsLib } from "../../components/DRAW/assetslab.js"
import { FileFolder } from "../../components/DRAW/folder.js"

export function Assets(Instance){
    const res ={
        load(){
            this.assetsui()
        },
        assetsui(){
            this.element = Instance.ui.addSection(`rightside`,'Assets').content
            this.assetslib = AssetsLib({to: this.element, Instance, Assets: this})
        },
        heads(){},
        add({address, domObj, arguements, name}){
            return this.assetslib.add({address, domObj, arguements, name})
        },
        events(){}
    }
    res.load()
    return res
}