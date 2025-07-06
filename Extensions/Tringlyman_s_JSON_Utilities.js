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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iI2Y0ZmYwMCIgc3Ryb2tlPSIjYWFiMzAwIiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDEuNzEyODYsMTk5LjA2OTkzKSBzY2FsZSgwLjcyNjc3LDAuNzI2NzcpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj5KUzwvdHNwYW4+PC90ZXh0PjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM0LjgyNTMyODI4MjgyODI4OjM0LjgyNTMyODI4MjgyODM2Ni0tPg==",
                "id": "TringlymansJSONUtilities",
                "name": "Tringlyman's JSON Utilities",
                "docsURI": "https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/Tringlyman_s_JSON_Utilities.js.md/",
                "color1": "#9da800",
                "color2": "#b0bd00",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    localStorage.setItem("text1", "")

    blocks.push({
        opcode: `JStype1`,
        blockType: Scratch.BlockType.COMMAND,
        text: `[js function][text1]`,
        arguments: {
            "js function": {
                type: Scratch.ArgumentType.STRING,
                menu: 'js function menu'
            },
            "text1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi!",
            },
        }
    });
    Extension.prototype[`JStype1`] = async (args, util) => {
        if (Boolean((args["js function"] == "alert"))) {
            alert(args["text1"])

        } else {
            if (Boolean((args["js function"] == "prompt"))) {
                variables["answer1"] = prompt(args["text1"])
                Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_JStype2`)

            } else {
                if (Boolean((args["js function"] == "log"))) {
                    console.log(args["text1"]);

                } else {
                    if (Boolean((args["js function"] == "warn"))) {
                        console.warn(args["text1"]);

                    } else {
                        if (Boolean((args["js function"] == "error"))) {
                            console.error(args["text1"]);
                        };

                    };

                };

            };

        };
    };

    menus["js function menu"] = {
        acceptReporters: false,
        items: [...[...[...[...[...[], "alert"], "prompt"], "log"], "warn"], "error"]
    }

    blocks.push({
        opcode: 'JStype2',
        blockType: Scratch.BlockType.HAT,
        text: 'when a question is answered then',
        arguments: {},
        isEdgeActivated: false,
    });
    Extension.prototype[`JStype2`] = async (args, util) => {
        ;
        return true
    };

    blocks.push({
        opcode: `JStype3`,
        blockType: Scratch.BlockType.REPORTER,
        text: `answer`,
        arguments: {}
    });
    Extension.prototype[`JStype3`] = async (args, util) => {
        return variables["answer1"]
    };

    blocks.push({
        opcode: `JStype4`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is answer [answer2]?`,
        arguments: {
            "answer2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "12345",
            },
        }
    });
    Extension.prototype[`JStype4`] = async (args, util) => {
        if (Boolean((variables["answer1"] == args["answer2"]))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `JStype5`,
        blockType: Scratch.BlockType.COMMAND,
        text: `reset answer | custom reset:[t/f]|set custom reset to[custom answer reset]`,
        arguments: {
            "t/f": {
                type: Scratch.ArgumentType.STRING,
                menu: 't/f'
            },
            "custom answer reset": {
                type: Scratch.ArgumentType.STRING,
            },
        }
    });
    Extension.prototype[`JStype5`] = async (args, util) => {
        if (Boolean((args["t/f"] == "true"))) {
            variables["answer1"] = args["custom answer reset"]

        } else {
            variables["answer1"] = ""

        };
    };

    menus["t/f"] = {
        acceptReporters: false,
        items: [...[...[], "true"], "false"]
    }

    Scratch.extensions.register(new Extension());
})(Scratch);