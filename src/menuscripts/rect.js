
export function Rect(player){
    const res = {
        weight: .1, gravity : .7, vx: 0, vy: 0,
        load(){
            
        },
        applygravity(){
            this.vy += this.gravity
            player.y += this.vy
            player.x += this.vx
            if(player.y > window.innerHeight - 230) {
                player.y = window.innerHeight - 230
                this.vy = 0
            }
            if(player.x <= 0){
                player.x = 0
                this.vx = 0
            }
            if(player.x > window.innerWidth /2.1) {
                player.x = window.innerWidth /2.1
                this.vx = 0
            }
        },
        checkCollision(){},
        update(){
            this.applygravity()
        }
    }
    res.load()
    return res
}