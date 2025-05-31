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
                "blockIconURI": "data:image/png;base64,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",
                "id": "TringlymansSave",
                "name": "Tringlyman's Save Extension",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/gallery/documents/tringlymans-save-extension",
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