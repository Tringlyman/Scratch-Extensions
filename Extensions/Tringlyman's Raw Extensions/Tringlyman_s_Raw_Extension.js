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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iIzQwNDA0MCIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjcuNDk1MDgsMjAyLjU1MjE4KSBzY2FsZSgwLjcwNzk0LDAuOTI1MjcpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMjYyNjI2IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4mbHQ7ICZndDs8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNC44MjUzMzAwMDAwMDAwMTozNC44MjUzMzAwMDAwMDAwMS0tPg==",
                "id": "RawExtension",
                "name": "Tringlyman's Raw Extension",
                "docsURI": "https://github.com/Tringlyman/docs.Scratch-Extensions/blob/main/Docs/Tringlyman's%20Raw%20Extensions/TringlymTringlyan_s_Raw_Extension.js.md",
                "color1": "#3c3c3c",
                "color2": "#282828",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `rawType1`,
        blockType: Scratch.BlockType.COMMAND,
        text: `raw[code]`,
        arguments: {
            "code": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "alert(\"Hello World!\")",
            },
        }
    });
    Extension.prototype[`rawType1`] = async (args, util) => {
        eval(args["code"]);
    };

    blocks.push({
        opcode: `rawType2`,
        blockType: Scratch.BlockType.REPORTER,
        text: `raw [code]`,
        arguments: {
            "code": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"Hello World!\"",
            },
        }
    });
    Extension.prototype[`rawType2`] = async (args, util) => {
        return eval(args["code"])
    };

    blocks.push({
        opcode: `rawType3`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is[code]?`,
        arguments: {
            "code": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "1 == 1",
            },
        }
    });
    Extension.prototype[`rawType3`] = async (args, util) => {
        if (Boolean((eval(args["code"]) == true))) {
            return true

        } else {
            if (Boolean((eval(args["code"]) == false))) {
                return false

            } else {
                throw "This isn't a boolean";

            };

        };
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
