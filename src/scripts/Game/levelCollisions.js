export function getLevelCollision(data){
    const res= {
        text:'',
        addData(name, txt){
            this.text += `const ${name} =  ${txt}`
            return this
        },
        generate(){
            return this.text
        }
    }
    return res
}