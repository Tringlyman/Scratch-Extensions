(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBmaWxsPSIjMDA2NmZmIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgc3Ryb2tlPSIjMDA0N2IzIiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTQuNjE0ODgsMTkzLjkwNTMzKSBzY2FsZSgwLjk2NTA4LDAuOTY1MDgpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDA2NmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj7wn4yQPC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzQuODI1MzI4MjgyODI4Mjg6MzQuODI1MzI4MjgyODI4MzY2LS0+",
                "id": "TringlymansWebsite",
                "name": "Tringlyman's website Extension",
                "docsURI": "https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/Tringlyman_s_website_equiptment.js.md",
                "color1": "#0196c8",
                "color2": "#0079ad",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `websiteChangelog`,
        blockType: Scratch.BlockType.BUTTON,
        text: `changelog`,
        disableMonitor: true
    });
    Extension.prototype[`websiteChangelog`] = async (args, util) => {
        window.open("https://github.com/Tringlyman/docs.Scratch-Extensions/tree/main/changelog/Website/website.0.md");
    };

    blocks.push({
        opcode: `websitetype1`,
        blockType: Scratch.BlockType.REPORTER,
        text: `current site`,
        arguments: {}
    });
    Extension.prototype[`websitetype1`] = async (args, util) => {
        return window.location.hostname
    };

    blocks.push({
        opcode: `websitetype2`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is current site[site?]`,
        arguments: {
            "site?": {
                type: Scratch.ArgumentType.STRING,
                menu: 'site options'
            },
        }
    });
    Extension.prototype[`websitetype2`] = async (args, util) => {
        if (Boolean(((window.location.hostname == (args["site?"] + ".org")) || ((window.location.hostname == (args["site?"] + ".com")) || (window.location.hostname == ("studio." + (args["site?"] + ".com"))))))) {
            return true

        } else {
            return false

        };
    };

    menus["site options"] = {
        acceptReporters: true,
        items: [...[...[], "turbowarp"], "penguinmod"]
    }

    blocks.push({
        opcode: `websitetype3`,
        blockType: Scratch.BlockType.COMMAND,
        text: `open [url+]`,
        arguments: {
            "url+": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "www.example.com",
            },
        }
    });
    Extension.prototype[`websitetype3`] = async (args, util) => {
        Scratch.openWindow('https://' + args["url+"]);
    };

    Scratch.extensions.register(new Extension());
})(Scratch);