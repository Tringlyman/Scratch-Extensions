/*
   ~This was made with ⚡ElectraMod - Electrabuilder!~
   https://electrabuilder.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }

    const supportsRenderedTargetExport = Scratch.vm.exports && Scratch.vm.exports.RenderedTarget;

    function isSpriteInternal(v) {
        if (supportsRenderedTargetExport) {
            return v instanceof Scratch.vm.exports.RenderedTarget;
        }
        return v != undefined && typeof v === "object";
    }
    class Extension {
        getInfo() {
            return {
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS44MzgyNCIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjgzODI0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDQuOTg3MDkpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iI2ZmNmEwMCIgc3Ryb2tlPSIjYjM0YTAwIiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjkuMzYzMDMsMTk3LjYwNzU0KSByb3RhdGUoLTkuMTQzNTgpIHNjYWxlKDEuMTI3MjIsMS4xMjcyMikiIGZvbnQtc2l6ZT0iNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiNmZjk5MDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmb250LWZhbWlseT0iU2FucyBTZXJpZiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgdGV4dC1hbmNob3I9InN0YXJ0Ij48dHNwYW4geD0iMCIgZHk9IjAiPlM8L3RzcGFuPjwvdGV4dD48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjozNC44MjUzMjk5OTk5OTk5ODozNS4wMTI5MTA0MjI2Njk1Ni0tPg==",
                "id": "TringlymansSave",
                "name": "Tringlyman's Save Extension",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/Home/documents/tringlymans-save-extension",
                "color1": "#ff9500",
                "color2": "#d67d00",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    await (async () => {
        try {
            variables["saves"] = ""
            variables["savesNum"] = 1
            return true;
        } catch {
            return false;
        }
    })();

    blocks.push({
        opcode: `saveType1`,
        blockType: Scratch.BlockType.COMMAND,
        text: `set save[save] to value[value]`,
        arguments: {
            "save": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
            },
            "value": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "World!",
            },
        }
    });
    Extension.prototype[`saveType1`] = async (args, util) => {
        if (Boolean(typeof variables[args["save"]] === typeof undefined)) {
            variables[args["save"]] = args["value"]
            variables["saves"] = ((variables["savesNum"] + ((" : " + ("\"" + (args["save"] + "\""))) + (" got created with value: " + ("\"" + (args["value"] + "\""))))) + (`\n` + variables["saves"]))
            variables["savesNum"] = (variables["savesNum"] + 1)

        } else {
            if (Boolean(confirm(("this save already exists" + (`\n` + "do you want to over write it?"))))) {
                variables[args["save"]] = args["value"]
                variables["saves"] = ((variables["savesNum"] + ((" : " + ("\"" + (args["save"] + "\""))) + (" has a new value: " + ("\"" + (args["value"] + "\""))))) + (`\n` + variables["saves"]))
                variables["savesNum"] = (variables["savesNum"] + 1)
            };

        };
    };

    blocks.push({
        opcode: `saveType2`,
        blockType: Scratch.BlockType.COMMAND,
        text: `delete save[save]`,
        arguments: {
            "save": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
            },
        }
    });
    Extension.prototype[`saveType2`] = async (args, util) => {
        variables[args["save"]] = undefined
        variables["saves"] = ((variables["savesNum"] + (" : " + (("\"" + (args["save"] + "\"")) + " deleted"))) + (`\n` + variables["saves"]))
        variables["savesNum"] = (variables["savesNum"] + 1)
    };

    blocks.push({
        opcode: `saveType3`,
        blockType: Scratch.BlockType.REPORTER,
        text: `load [save] value`,
        arguments: {
            "save": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
            },
        }
    });
    Extension.prototype[`saveType3`] = async (args, util) => {
        if (Boolean(typeof variables[args["save"]] === typeof undefined)) {
            throw "this save doesn't exist";

        } else {
            return variables[args["save"]]

        };
    };

    blocks.push({
        opcode: `saveType4`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `does [save] exist?`,
        arguments: {
            "save": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
            },
        }
    });
    Extension.prototype[`saveType4`] = async (args, util) => {
        if (Boolean(typeof variables[args["save"]] === typeof undefined)) {
            return false

        } else {
            return true

        };
    };

    blocks.push({
        opcode: `saveType5`,
        blockType: Scratch.BlockType.COMMAND,
        text: `saves history`,
        arguments: {}
    });
    Extension.prototype[`saveType5`] = async (args, util) => {
        alert(variables["saves"])
    };

    Scratch.extensions.register(new Extension());
})(Scratch);