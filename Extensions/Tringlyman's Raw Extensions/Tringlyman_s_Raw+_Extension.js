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
                "id": "RawPlusExtension",
                "name": "Tringlyman's Raw+ Extension",
                "color1": "#3c3c3c",
                "color2": "#282828",
                blockIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iIzQwNDA0MCIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMTkuODc1NTQsMjAzLjI0NDg3KSBzY2FsZSgwLjcwNzk0LDAuOTI1MjcpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMjYyNjI2IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4mbHQ7KyZndDs8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNC44MjUzMzAwMDAwMDAwMTozNC44MjUzMzAwMDAwMDAwMS0tPg==",
                "docsURI": "https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/Tringlyman's%20Raw%20Extensions/Tringlyman_s_Raw%2B_Extension.js.md",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `rawPlusLabelType1`,
        blockType: Scratch.BlockType.LABEL,
        text: `JSON`,
    });

    blocks.push({
        opcode: `rawPlusJSONType1`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.PLUS,
        text: `const [name] = {[value]}`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "object",
            },
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"name\":\"Jack\"",
            },
        }
    });
    Extension.prototype[`rawPlusJSONType1`] = async (args, util) => {
        return "const " + args["name"] + " = " + "{" + `\n` + args["value"] + `\n` + "}"
    };

    blocks.push({
        opcode: `rawPlusJSONType2`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.PLUS,
        text: `[name]: {[value]}`,
        arguments:{
            "name":{
                type: Scratch.ArgumentType.STRING,
                defaultValue: "object"
            },
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"name\":\"Jack\"",
            },
        }
        }
    );
    Extension.prototype[`rawPlusJSONType2`] = async (args, util) => {
        return args["name"] + ": {" + `\n` + args["value"] + `\n` + "}"
    }

    blocks.push({
        opcode: `rawPlusJSONType3`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.PLUS,
        text: `{[value]}`,
        arguments: {
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"name\":\"Jack\"",
            },
        }
    });
    Extension.prototype[`rawPlusJSONType3`] = async (args, util) => {
        return "{" + `\n` + args["value"] + `\n` + "}"
    };

    blocks.push({
        opcode: `rawPlusLabelType2`,
        blockType: Scratch.BlockType.LABEL,
        text: `ARRAYS`,
    });

    blocks.push({
        opcode: `rawPlusArrayType1`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SQUARE,
        text: `const [name] = ［[value]］`,
        arguments: {
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "array",
            },
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"apple\"",
            },
        }
    });
    Extension.prototype[`rawPlusArrayType1`] = async (args, util) => {
        return "const " + args["name"] + " = " + "[" + args["value"] + "]"
    };

    blocks.push({
        opcode: `rawPlusArrayType2`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SQUARE,
        text: `[name]:［[value]］`,
        arguments:{
            "name": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "array",
            },
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"apple \"",
            },
        }
    });
    Extension.prototype[`rawPlusArrayType2`] = async (args, util) => {
        return args["name"] + ": [" + args["value"] + "]"
    };

    blocks.push({
        opcode: `rawPlusArrayType3`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SQUARE,
        text: `［[value]］`,
        arguments: {
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"apple\"",
            },
        }
    });
    Extension.prototype[`rawPlusArrayType3`] = async (args, util) => {
        return "[" + args["value"] + "]"
    };

    blocks.push({
        opcode: `rawPlusLabelType3`,
        blockType: Scratch.BlockType.LABEL,
        text: "OTHER",
    });

    blocks.push({
        opcode: `rawPlusOtherType1`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.LEAF,
        text: `[value1],[value2]`,
        arguments: {
            "value1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"apple \"",
            },
            "value2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"banana\"",
            },
        }
    });
    Extension.prototype[`rawPlusOtherType1`] = async (args, util) => {
        return args["value1"] + ", " + args["value2"]
    };

    blocks.push({
        opcode: `rawPlusType2`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.LEAF,
        text: `cover[text] in [string style]`,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello World!",
            },
            "string style": {
                type: Scratch.ArgumentType.STRING,
                menu: 'string style'
            },
        }
    });
    Extension.prototype[`rawPlusType2`] = async (args, util) => {  
        switch (args["string style"]) {
            case "1" :
                return "\"" + args["text"] + "\""
                break;
            case "2" :
                return "\'" + args["text"] + "\'"
                break;
            case "3" :
                return "\`" + args["text"] + "\`"
                break;
        };
    };

    menus["string style"] = {
        acceptReporters: false,
        items: [{
            text: "string(\")",
            value: "1",
        }, {
            text: "string(\')",
            value: "2",
        }, {
            text: "template literal (\`)",
            value: "3",
        }]
    };

        blocks.push({
        opcode: `rawPlusType3`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.LEAF,
        text: `raw join [value1]+[value2]`,
        arguments: {
            "value1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple ",
            },
            "value2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "banana",
            },
        }
    });
    Extension.prototype[`rawPlusType3`] = async (args, util) => {
        return args["value1"] + " + " + args["value2"]
    };

    blocks.push({
        opcode: `rawPlusType4`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.LEAF,
        text: `raw [value1][and/or][value2]`,
        arguments: {
            "value1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 === 1",
            },
            "and/or": {
                type: Scratch.ArgumentType.STRING,
                menu: 'and/or'
            },
            "value2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"1\" === 1",
            },
        }
    });
    Extension.prototype[`rawPlusType4`] = async (args, util) => {
        if (args["and/or"] == "1") {
            return args["value1"] + " && " + args["value2"]

        } else {
            return args["value1"] + " || " + args["value2"]

        };
    };

    menus["and/or"] = {
        acceptReporters: false,
        items: [{
                text: "and",
                value: "1",
            },  {
                text: "or",
                value: "2",
            }]
    }

    blocks.push({
        opcode: `rawPlusType5`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.LEAF,
        text: `raw not [value]`,
        arguments: {
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 == 1",
            },
        }
    });
    Extension.prototype[`rawPlusType5`] = async (args, util) => {
        return "!(" + args["value"] + ")"
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
