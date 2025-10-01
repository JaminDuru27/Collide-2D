export function getExportControls(){
    return `
function KeyBinder(){
    const res = {
        array: [],
        load(){
            this.ev()
        },
        ev(){
            window.addEventListener('keydown', (e)=>{
                this.array.forEach(obj=>{
                    if(!obj.key && obj.type ==='keydown')obj.callback(obj.arguements)
                    if(obj.key === e.key && obj.type === 'keydown'){
                        obj.callback(obj.arguements)
                    }
                })
            })
            window.addEventListener('keyup', (e)=>{
                this.array.forEach(obj=>{
                    if(!obj.key && obj.type ==='keyup')obj.callback(obj.arguements)
                    if(obj.key === e.key && obj.type ==='keyup'){
                        obj.callback(obj.arguements)
                    }
                })
            })
        },
        clear(){
            this.array.forEach((obj)=>{
                window.removeEventListener(obj.type, obj.callback)
            })
        },
        bind({name, key, callback,type = 'keydown', arguements = {}}){
            this.array.push({name, key, type, callback, arguements})
        }
    } 
    res.load()
    return res
}
    `
}