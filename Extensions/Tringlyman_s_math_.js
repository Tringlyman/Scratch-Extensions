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
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS42NTA2NiIgaGVpZ2h0PSI2OS42NTA2NiIgdmlld0JveD0iMCwwLDY5LjY1MDY2LDY5LjY1MDY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA1LjE3NDY3LC0xNDUuMTc0NjcpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMDcuNjc0NjcsMTgwYzAsLTE3Ljg1Mjc5IDE0LjQ3MjU0LC0zMi4zMjUzMyAzMi4zMjUzMywtMzIuMzI1MzNjMTcuODUyNzksMCAzMi4zMjUzMywxNC40NzI1NCAzMi4zMjUzMywzMi4zMjUzM2MwLDE3Ljg1Mjc5IC0xNC40NzI1NCwzMi4zMjUzMyAtMzIuMzI1MzMsMzIuMzI1MzNjLTE3Ljg1Mjc5LDAgLTMyLjMyNTMzLC0xNC40NzI1NCAtMzIuMzI1MzMsLTMyLjMyNTMzeiIgZmlsbD0iIzAwY2MyNSIgc3Ryb2tlPSIjMDA4MDE3IiBzdHJva2Utd2lkdGg9IjUiLz48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyMjEuMzUzMywxOTEuNzE3NjcpIHNjYWxlKDEuMDE1NjIsMS4wMTU2MikiIGZvbnQtc2l6ZT0iNDAiIHhtbDpzcGFjZT0icHJlc2VydmUiIGZpbGw9IiMwMDgwMTciIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmb250LWZhbWlseT0iU2FucyBTZXJpZiIgZm9udC13ZWlnaHQ9Im5vcm1hbCIgdGV4dC1hbmNob3I9InN0YXJ0Ij48dHNwYW4geD0iMCIgZHk9IjAiPk08L3RzcGFuPjwvdGV4dD48dGV4dCB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyNDUuNDA3MTgsMTkxLjY4MDc1KSBzY2FsZSgwLjYzMTE5LDAuNjMxMTkpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjMDA4MDE3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IlNhbnMgU2VyaWYiIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4rPC90c3Bhbj48L3RleHQ+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzQuODI1MzMwMDAwMDAwMDE6MzQuODI1MzMwMDAwMDAwMDEtLT4=",
                "id": "TringlymansMathPlus",
                "name": "Tringlyman's math+",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/Home/documents/tringlymans-math-extension",
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