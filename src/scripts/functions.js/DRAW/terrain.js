
export function Terrain(Instance){
    const res = {
        load(){
        },
        drawParts(){
            if(!this.data)return
            const dir = Instance.highlight.dir
            // if(dir === `none`){
            //     const array = [
            //         [this.topleftbox, this.topBoxes[1],this.toprightbox,],
            //         [this.bottomleftbox, this.bottomBoxes[1],this.bottomrightbox],
            //     ]
            //     this.setArray(array)
            // }else
                const array = [
                    [this.middlebox, this.middlebox, this.middlebox],
                    [this.middlebox, this.middlebox, this.middlebox],
                    [this.middlebox, this.middlebox, this.middlebox],
                ]
            this.setArray(array)
        },
        mouseonsprite(x = 0, y = 0){
            const target = Instance.highlight.target
            if(!target)return false
            const name = Instance.layers.layer.name
            const layer = Instance.library.find(name).object?.array
            if(layer)
            if(layer.filter(s=>s.indx === target.indx + x && s.indy === target.indy + y).length > 0)return true
            else return false
            
        },
        setArray(arr2d){
            const domObj = Instance.assets.domObj
            domObj.terrain2dArray = arr2d 
        },
        analyseParts(){
            const domObj = Instance.assets.domObj
            if(!domObj.select)return
            if(domObj.select.boxesFlat.length <= 0)this.data = undefined
            if(!this.data && domObj.select.boxesFlat.length > 0){
                this.data = domObj.getData()
                this.topBoxes = this.getTopBoxes(this.data)
                this.bottomBoxes = this.getTopBoxes(this.data)
                this.leftBoxes = this.getLeftBoxes(this.data)
                this.rightBoxes = this.getRightBoxes(this.data)
                this.topleftbox = this.getTopLeftBox(this.data)
                this.toprightbox = this.getTopRightBox(this.data)
                this.bottomleftbox = this.getBottomLeftBox(this.data)
                this.bottomrightbox = this.getBottomRightBox(this.data)
                this.middlebox = this.getMiddleBox(this.data)
            }
        },
        getMiddleBox(data){
            let box = {
                sx: data.general.imgcw * (data.selectBox.indx + 1), 
                sy: data.general.imgch * (data.selectBox.indy + 1), 
            }
            return box
        },
        getTopRightBox(data){
            let box = {
                sx: data.general.imgcw * (data.selectBox.indx + (data.selectBox.nx -1)), 
                sy: data.general.imgch * data.selectBox.indy, 
            }
            return box
        },
        getBottomRightBox(data){
            let box = {
                sx: data.general.imgcw * (data.selectBox.indx + (data.selectBox.nx -1)), 
                sy: data.general.imgch * (data.selectBox.indy + (data.selectBox.ny -1)), 
            }
            return box
        },
        getTopLeftBox(data){
            let box = {
                sx: data.general.imgcw * data.selectBox.indx, 
                sy: data.general.imgch * data.selectBox.indy, 
            }
            return box
        },
        getBottomLeftBox(data){
            let box = {
                sx: data.general.imgcw * data.selectBox.indx, 
                sy: data.general.imgch * (data.selectBox.indy + (data.selectBox.ny -1)), 
            }
            return box
        },
        getLeftBoxes(data){
            const boxes = []
            for(let x= 0; x < data.selectBox.ny; x++){
                const indx = data.selectBox.indx
                const indy = data.selectBox.indy + x
                boxes.push({sx: data.general.imgcw * indx, sy: data.general.imgch * indy})
            }
            return boxes
        },
        getRightBoxes(data){
            const boxes = []
            for(let x= 0; x < data.selectBox.ny; x++){
                const indx = data.selectBox.indx + (data.selectBox.nx -1)
                const indy = data.selectBox.indy + x
                boxes.push({sx: data.general.imgcw * indx, sy: data.general.imgch * indy})
            }
            return boxes
        },
        getTopBoxes(data){
            const boxes = []
            for(let x= 0; x < data.selectBox.nx; x++){
                const indx = data.selectBox.indx + x
                const indy = data.selectBox.indy
                boxes.push({sx: data.general.imgcw * indx, sy: data.general.imgch * indy})
            }
            return boxes
        },

        getBottomBoxes(data){
            const boxes = []
            for(let x= 0; x < data.selectBox.nx; x++){
                const indx = data.selectBox.indx + x
                const indy = data.selectBox.indy + (data.selectBox.ny -1)
                boxes.push({sx: data.general.imgcw * indx, sy: data.general.imgch * indy})
            }
            return boxes
        },
        update(){
            if(!Instance.assets.domObj)return
            const domObj = Instance.assets.domObj
            const parts = this.analyseParts()
            const drawParts = this.drawParts()
            const dir = Instance.highlight.dir
        }
    }
    res.load()
    return res
}