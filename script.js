function CopyClipboard(text) {
    const rawuser = `https://raw.githubusercontent.com/Tringlyman/Scratch-Extensions/refs/heads/main/Extensions$/${text}`
    navigator.clipboard.writeText(rawuser)
}

function Docs(text) {
    const doc = `https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/${text}.md/`
    window.open(doc)
}
