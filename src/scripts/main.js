import { Menu } from "./components/DRAW/menu.js"
import { draw } from "./functions.js/DRAW/instances.js"
import { materials } from "./functions.js/Material/materials.js"
const menu = Menu()
requestAnimationFrame(render)
let lasttime =  0
function render(time){
    let deltaTime  = (time - lasttime).toFixed(2)
    lasttime = time
    draw.update(deltaTime)
    materials.update(deltaTime)
    requestAnimationFrame(render)
}

window.addEventListener(`contextmenu`, (e)=>e.preventDefault())
