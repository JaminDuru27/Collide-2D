export function getExportGravity(){
    return`
function Gravity(rect){
    const res = {
        friction: .95,
        load(){
        },
        setFriction(val){
            this.friction = val
            return this
        },
        update({ctx}){            
            rect.vy += rect.weight
            rect.vy *= this.friction
        }
    }

    res.load()
    return res
}
`
}