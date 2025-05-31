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
                "id": "TringlymansMathPlus",
                "name": "Tringlyman's math+",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/gallery/documents/tringlymans-math-extension",
                "color1": "#008f0a",
                "color2": "#007a14",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
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