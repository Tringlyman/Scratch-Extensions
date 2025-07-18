function CopyClipboard(text) {
    navigator.clipboard.writeText(window.location.origin + `/Extensions/${text}`)
}

function Docs(text) {
     const Window = window.open(`https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/${text}.md/`)
}
