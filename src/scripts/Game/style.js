export function getExportStyle(){
    const res = {
        array: [],
        defStyle(){
            return `
*{
    box-sizing: border-box;
    margin: 0; padding: 0;
}
canvas{
    position: absolute;
    width: 100vw;
    height: 100vh;
    top: 0; left:0;
    background: black
}
        `
        },
        addStyle(text){
            this.array.push(text)
        },
        generate(){
            let style = ``
            style += this.defStyle()
            this.array.forEach(styling=>{
                style += styling
            })
            return style

        }
    }
    return res
}