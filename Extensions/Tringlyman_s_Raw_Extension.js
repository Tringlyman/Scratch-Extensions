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
                "id": "RawExtension",
                "name": "Tringlyman's Raw Extension",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/gallery/documents/tringlymans-raw-extension",
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
        blockType: Scratch.BlockType.REPORTER,
        text: `raw join[value1][value2][value3]`,
        arguments: {
            "value1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"apple\"",
            },
            "value2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"banana\"",
            },
            "value3": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"pear\"",
            },
        }
    });
    Extension.prototype[`rawType3`] = async (args, util) => {
        return args["value1"] + " + " + args["value2"] + " + " + args["value3"]
    };

    blocks.push({
        opcode: `rawType4`,
        blockType: Scratch.BlockType.REPORTER,
        text: `cover[text] in [string style]`,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello World!",
            },
            "string style": {
                type: Scratch.ArgumentType.STRING,
                menu: 'string menu'
            },
        }
    });
    Extension.prototype[`rawType4`] = async (args, util) => {
        if (Boolean((args["string style"] == "string(\")"))) {
            return ("\"" + (args["text"] + "\""))

        } else {
            return ("`" + (args["text"] + "`"))

        };
    };

    menus["string menu"] = {
        acceptReporters: false,
        items: [...[...[], "string(\")"], "template literal (`)"]
    }

    blocks.push({
        opcode: `id`,
        blockType: Scratch.BlockType.REPORTER,
        text: `return raw [text] to [convert]`,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "\"Hello World!\"",
            },
            "convert": {
                type: Scratch.ArgumentType.STRING,
                menu: 'String/Number/Boolean'
            },
        }
    });
    Extension.prototype[`id`] = async (args, util) => {
        if (Boolean((args["convert"] == "String"))) {
            return String(args["text"])

        } else {
            if (Boolean((args["convert"] == "Number"))) {
                return Number(args["text"])

            } else {
                return Boolean(args["text"])

            };

        };
    };

    menus["String/Number/Boolean"] = {
        acceptReporters: false,
        items: [...[...[...[], "String"], "Number"], "Boolean"]
    }

    Scratch.extensions.register(new Extension());
})(Scratch);