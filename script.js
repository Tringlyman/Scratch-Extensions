function CopyClipboard(text) {
    navigator.clipboard.writeText(`https://raw.githubusercontent.com/Tringlyman/Scratch-Extensions/refs/heads/codespace-orange-orbit-7vrgj5vr5p7jhxj9/Extensions/${text}`)
}

function Docs(text) {
     if (`${text}` != null || `${text}` != undefined || ``${text} != ``){
         const Window = window.open(`https://github.com/Tringlyman/Scratch-Extensions/blob/main/Docs/${text}.md`, "_blank")
     }
     else{
        alert("This Extension doesn't have a Document yet!")
    }
}
