export function getExportHTML(title, scripts = []){
const html = ()=>{
let text = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="./assets/icon.png">

</head>
<body>
<canvas class='canvas'></canvas>
    `
    scripts.map(e=> {
        text +=`
    <script src="./${e}"></script>`
    })
    text += `
</body>
</html>
    `   
    return text
    }
    return html()
}
