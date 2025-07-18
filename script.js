function CopyClipboard(text) {
    navigator.clipboard.writeText(`https://raw.githubusercontent.com/Tringlyman/Scratch-Extensions/refs/heads/main/Extensions/${text}`)
}

function Docs(text) {
     const Window = window.open(`https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/${text}.md/`)
}
