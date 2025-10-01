export function calcRatio({x, y, w = 0, h = 0, W, H, assignToObject = {}}){
    const res = {
        ratio: {},
        load(){
            this.calc()
        },
        calc(){
            x = x / W
            y = y / H
            w = w / W
            h = h / H
            this.ratio.x = x
            this.ratio.y = y
            this.ratio.w = w
            this.ratio.h = h
            if(assignToObject)
            for(let x in this.ratio)assignToObject['ratio'+ x] = this.ratio[x]
        
        },
        reassign({W, H}){
            
        }
    }
    res.load()
    return res
}