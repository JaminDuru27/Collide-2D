export function load(to){
    const res = {
        style(){return ``},
        ui(){
            this.element = document.createElement(`div`)
            this.element.classList.add(`loadmaterial`)
            to.append(this.element)
        },
        load(){
            this.ui()
        }
    }
    res.load()
    return res
}