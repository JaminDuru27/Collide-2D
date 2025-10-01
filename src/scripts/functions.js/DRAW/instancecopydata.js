export function GetInstanceCopyData(Instance){
    const data = {}
    //get layers
    const array = Instance.library.find('spriteLayer')?.object?.meta?.array
    const layers = []
    array.forEach((layer)=>{
        const arr = []
        layer.array
        .map((sprite)=>{
            const box = {
                sx: sprite.sx, sw: sprite.sw,
                sy: sprite.sy, sh: sprite.sh,
                src: sprite.image.src, data: sprite.data,
                indx: sprite.indx, indy: sprite.indy,
                widthMult: sprite.widthMult, 
                heightMult: sprite.heightMult,
                id: sprite.id, layername: layer.name,
                layerId: layer.id, 
            }
            arr.push(box)
        }) 
        if(arr.length > 0){
            layers.push(arr)
        }
    })
    //get images
    const images = []
    const imgs = Instance.library.find('images').object
    for(let x in imgs){
        if(x === `meta`)continue
        images.push({name:x, object:imgs[x][x]})
    }
    //get collisions
    const collisions = []
    const groupsArray = Instance.library.find(`collisionGroup`).object.meta.array
    const shapes = Instance.library.find('shapes').object
    for(let x in shapes){
        if(x === `meta`)continue
        collisions.push({name:x, object:shapes[x].content})
    }
    let groups = []
    groupsArray.forEach(grup=>{
        const group = grup?.array
        if(!group)return
        groups.push(group.filter(e=>e)
        .map(box=>{
            return {
                x: box.x,
                y: box.y,
                w: box.w,
                h: box.h,
                data: box.data,
                indx: box.indx,
                indy: box.indy,
                color: box.color,
                bordercolor: box.bordercolor,
                id: grup.id,
            }
        }))
    })            

    //get grid
    const grid = {
        nx: Instance.grid.nx,
        ny: Instance.grid.ny,
    }
    //remove duplicate from group
   //
    data.collisions = collisions
    data.collisiongroups = groups
    data.images = images
    data.layers = layers
    data.dataurl = Instance?.savedataurl()
    data.name = Instance.name
    data.grid = grid
    data.id = Instance.id
    return data
}


export function SaveInstanceCopyData(copydata){
    const localArray  = localStorage.getItem('CollideData')
    if(!localArray) localStorage.setItem('CollideData', '[]')

    const instancesDataArray  = localStorage.getItem('CollideData')
    const parseArray = JSON.parse(instancesDataArray)
    
    if(theresDuplicateIn(parseArray, copydata)){
        const index = theresDuplicateIn(parseArray, copydata).getIndex()
        parseArray[index] = copydata
    }else{
        parseArray.push(copydata)
    }
    
    const parsedArrayToString= JSON.stringify(parseArray)
    localStorage.setItem('CollideData', parsedArrayToString)
}

function theresDuplicateIn(array, data){
    let is 
    array.forEach((instdata, x)=>{
        if(instdata.id === data.id)is = {
            getIndex(){
                return x
            }
        }
    })
    return is
}