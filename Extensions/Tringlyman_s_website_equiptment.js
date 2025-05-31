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
                "id": "TringlymansWebsiteEquiptment",
                "name": "Tringlyman's website equiptment",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/gallery/documents/tringlymans-website-equiptment-extension",
                "color1": "#0196c8",
                "color2": "#0079ad",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
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