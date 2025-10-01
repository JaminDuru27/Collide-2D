import { saveAs } from "file-saver";

export async function download(zip, name){
    await zip.generateAsync({ type: "blob" })
    .then(function (content) {
        saveAs(content, name + `.zip`);
    })
}

export async function fetchImageAsBuffer(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  return arrayBuffer
}


