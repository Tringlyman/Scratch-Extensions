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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iIzAwY2MyNSIgc3Ryb2tlPSIjMDA4MDE3IiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjEuMzUzMywxOTEuNzE3NjcpIHNjYWxlKDEuMDE1NjIsMS4wMTU2MikiIGZvbnQtc2l6ZT0iNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiMwMDgwMTciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmb250LWZhbWlseT0iU2FucyBTZXJpZiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgdGV4dC1hbmNob3I9InN0YXJ0Ij48dHNwYW4geD0iMCIgZHk9IjAiPk08L3RzcGFuPjwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDUuNDA3MTgsMTkxLjY4MDc1KSBzY2FsZSgwLjYzMTE5LDAuNjMxMTkpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDA4MDE3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4rPC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzQuODI1MzMwMDAwMDAwMDE6MzQuODI1MzMwMDAwMDAwMDEtLT4=",
                "id": "TringlymansMathPlus",
                "name": "Tringlyman's math+",
                "docsURI": "https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/Tringlyman_s_math_.js.md",
                "color1": "#008f0a",
                "color2": "#007a14",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `mathChangelog`,
        blockType: Scratch.BlockType.BUTTON,
        text: `changelog`,
        disableMonitor: true
    });
    Extension.prototype[`mathChangelog`] = async (args, util) => {
        window.open("https://github.com/Tringlyman/docs.Scratch-Extensions/tree/main/changelog/Math/math.0.md");
    };

    menus["t/f"] = {
        acceptReporters: true,
        items: [...[...[], "true"], "false"]
    }

    blocks.push({
        opcode: `mathtype1`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[number1][math1][number2]`,
        arguments: {
            "number1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
            "math1": {
                type: Scratch.ArgumentType.STRING,
                menu: 'math values'
            },
            "number2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
        }
    });
    Extension.prototype[`mathtype1`] = async (args, util) => {
        if (Boolean((args["math1"] == "+"))) {
            return (args["number1"] + args["number2"])

        } else {
            if (Boolean((args["math1"] == "-"))) {
                return (args["number1"] - args["number2"])

            } else {
                if (Boolean((args["math1"] == "*"))) {
                    return (args["number1"] * args["number2"])

                } else {
                    if (Boolean((args["math1"] == "/"))) {
                        return (args["number1"] / args["number2"])

                    } else {
                        return (args["number1"] ** args["number2"])

                    };

                };

            };

        };
    };

    menus["math values"] = {
        acceptReporters: true,
        items: [...[...[...[...[...[], "+"], "-"], "*"], "/"], "^"]
    }

    blocks.push({
        opcode: `mathtype2`,
        blockType: Scratch.BlockType.REPORTER,
        text: `√[number2] | custom root:[t/f]|Root type:[number1])`,
        arguments: {
            "t/f": {
                type: Scratch.ArgumentType.STRING,
                menu: 't/f'
            },
            "number1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2,
            },
            "number2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 4,
            },
        }
    });
    Extension.prototype[`mathtype2`] = async (args, util) => {
        if (Boolean((args["t/f"] == "true"))) {
            return (args["number2"] ** (1 / args["number1"]))

        } else {
            return (args["number2"] ** (1 / 2))

        };
    };

    blocks.push({
        opcode: `mathtype3`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[number1][math2][number2]`,
        arguments: {
            "number1": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
            "math2": {
                type: Scratch.ArgumentType.STRING,
                menu: 'math2 values'
            },
            "number2": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3,
            },
        }
    });
    Extension.prototype[`mathtype3`] = async (args, util) => {
        if (Boolean((args["math2"] == "<"))) {
            if (Boolean((args["number1"] < args["number2"]))) {
                return true

            } else {
                return false

            };

        } else {
            if (Boolean((args["math2"] == "="))) {
                if (Boolean((args["number1"] == args["number2"]))) {
                    return true

                } else {
                    return false

                };

            } else {
                if (Boolean((args["math2"] == "==="))) {
                    if (Boolean((args["number2"] === args["number1"]))) {
                        return true

                    } else {
                        return false

                    };

                } else {
                    if (Boolean((args["number2"] > args["number1"]))) {
                        return true

                    } else {
                        return false

                    };

                };

            };

        };
    };

    menus["math2 values"] = {
        acceptReporters: true,
        items: [...[...[...[...[], "<"], "="], "==="], ">"]
    }

    Scratch.extensions.register(new Extension());
})(Scratch);