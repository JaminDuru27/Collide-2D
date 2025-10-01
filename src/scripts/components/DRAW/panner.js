export function Panner(Game){
    const res = {
        velocity: 0,
        load(){
        },
        panupLogic(){
            Game.ty -= this.velocity
        },
        pandownLogic(){
            Game.ty += this.velocity
        },
        stop(){this.panLogic = undefined},
        panUp(){
            if(this.panLogic === this.panupLogic)return
            this.panLogic = this.panupLogic
        },
        panDown(){
            if(this.panLogic === this.pandownLogic)return
            this.panLogic = this.pandownLogic
        },
        update({ctx}){
            
            if(this?.panupLogic)this.panupLogic()
        }
    }
    res.load()
    return res
}