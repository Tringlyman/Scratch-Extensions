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
                "blockIconURI": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGUAAABlCAYAAABUfC3PAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAD9lJREFUeJztnXl4VdW1wH/7koGQBEEGFWSKTH0qOEKlZQiDlEFAgRLoA2kVfBVRn6CirdD30D4K6Fet/VptRR7wMAwRBVqsYlJAXi0ICMgUZlCw6quEKSSB7PfHOgk55+xzp9x7yXB/37e/3LvPPmfvnHXPPnuvvddaSmtNVUYplQRkAB2BDkB7oA1QH7gKSLVSfeA0cM5KBdb3w0A+sA/YCxzSWhfH9r8IDVXVhKKUSgA6A32t1B1IjmAVl4BPgbVW+khrfSGC1680VUIoSql0YDgwBhFC3RhWXwhsABYDOVrrszGs28gVE4pSqg7yJIwF7gXqXZGG2DkHrAAWAh9qrS9dkVZorWOagERgHNK/6yqcDgGPAXVjfY9i9qQopVKAB4EngRahnNuqBXRoJ6lje2jfFho3gvrpklLrQUoKFBbCufNw+oykb/4P8g/A3nzYt1/S0eMhN/0YMAd4Q2tdGPLZYRAToSilRgNzgWbBlG/RHHr3hN49ILOHfI8Ux7+A3HWQu17+fn4i6FO/AKZorZdErjVmoioUpVQ74DdA/0Blr24II4bC2Cz4/l1Ra5KLXXtgYTbMXwz/+CqoU/4KTNJa745Wm6IiFGtuMQOYCiR5l4N7BsDE8dC/DyQkRLwpQXPxIry3Fl6fD6vfgwC3pRjp0v5Da10S6bZEXChKqZZANuD5e/f5YODd8Itn4PZbIlp9RPhsN8x+Gd5aLsLywyfAKK31oUjWH1GhKKXuBeYBDbzKZA2H//wZtLshYtVGjX37YfoLsHSF32LfAj/WWr8bqXojIhRrzjEHeBxQpjId2sFvX4Q+PStdXcz5IA8emSojOQ808BLwlNa6tLL1VVooSqlkYBEwwnS8bl147imYOhmSPN8uVZ+iIpj7G5g5Wz57sBQYp7X2LhEElRKKUioNyAHuNh1v3RKy34Sud4RdRZVj2w744f1wwPstkgcM01qfDrcOX7gnKqWaAuvwEEjWcNj+vzVLIAC3doIt6+GH93oWyQRylVJNwq0jLKEopeoDa4DbnMfq1IFXZsNb82S2XROpnw5L5sOvZ8lI0sDtwBpL0RoyIXdf1hxkFYYnJCkJFrwGo+4LpynVkxWrYMyDcMGs/M8DBoT6jglJKEopHzIHGek8lpYKOYvg7t6hVF8zyNsAw0aLvs3AO8CIUDTOoXZfczEIpH465P2pdgoEILM7rF0J6WnGw8OAWaFcL+gnRSk1GFiJYx6SlASrltRegVQkbwMMGG4cMmtguNba/zTUIiihWKqTbcDVFfN9PhnyjhwWVJtrBe+shhHj4JK7szoF3Ka1PhzoGgG7L+vFvgyHQEBGH3GB2Bk2GOY+bzzUAHhLKZUY6BrBvFNmAF2cmVnDYfJDQZxdC3n8Yc8fa1dgeqDz/XZfSqn2wA4cu0naZsgEqqbOQyLB2XNwR09RajooBjprrfd6nRvoSfkdDoEkJ8vEKS4Q/6SlwtL/lmVqB0nIwp8nnkKxlnBdY6rpT8NtncNoZS2k043w7BTjob5KqVFe5xm7L2uTwwEca+od28P2jdVb2xtrioqgUzej2v8LoK1pI6DXkzIBwyaHV+fGBRIqycly3ww0Bx4wHXAJxRoCT3XmZw2vngtUVYF+mZ6jsadMQ2RX96WUehD4Q8W8OnVg9ybZbxUnPA4cgo53GCeVD2it51XMsD0p1rLu086zRg6LC6SytM2A4UOMh6ZZ970cZ/fVF7DdfqU8RxBxQuTZqXI/HbTDMcp1CmWs84x7BsDNN0a0bbWWzjfB4B8YD9nue7lQrPX2oc7SE8dHuGW1nAn3G7Pvs+4/YH9SRgK2FYGmTeIq+UgzoB9c09SVnYqYgwB2oYx2lhwzEhID6jTjhEJCgudy+ZiyD0prjVKqLrLTz2ZBtXWD7N6IE1k+2QZ39nJlnweu1loXlT0p3XAIpEXzuECixR23QnO3UUg9RLVf3n1lOkv06RXNZsXJ7G7M7g2XheJ6nXucFCdCeNzfTJBNEEnAWcQWsZxjuyNrQRXHztHj0PomV3YxkOYDbsAhkJbXxwUSbVq1gOvd75UkIMOHeHGw8R1XTpxo0LG9Mbt9AgahdGgX7eZEhy//Aecd9rstrw/fbO/ESfh4M2zeKgaspwpk7T0xAVJTxU4zozXc0EZGqh3aGXVbnnRoB2v/6s6uUUKZ8KjYK1Yk1Hej1vD2Kvj9G2JBXBqCCVCDq6BbVxjUX8wHW7f0X97jPndIQJzP2KitavrDR2HCZPhwXXjnnyqAP78vCeDUcbiqvnd5D6FkJCDef2w0DduyovqyNx8yB0sXGCkCbT71uM/1EwDXZiGPjco1lhMnoedA+Opr97FrmsK9g6HL7fJiTkuVd9Q/vxWPFtt2iNpk3UfyvgkFj/ucHhcK8ORzboHUrQv/NQMmTfCvlB06SP5euADv58KSt2H5u1AchEcxf0JxHUpLDXzBmsL+g2IvX5HERFiTA72+H/x16taFIQMlvfgC/H5e4FGfP6HY9vApJRXUFlascvf9kx8KTSBOrr1GHDcEIiVF7rej/no+xAlZOVp7morVSDb+3Z13/xh3XjQoLDQOBs77EL2XjVBfWNWZk1/avysFHWI0JThj9sF3xge4LPU8CtdITHaKHha/EScuFA8aXGX/rrVfdx8RxcNw9YwPcRNrwzRer6m0Mvjom7coNnV73OfTPsRvr41Y/VKqApk93Hkv/w4WvBX9ug0GRQCHfIgT5WAK10hGDHXPFy5dgvv/DXoPhmXvyOw9Gnj8+PfVeqE0bgTTnjAfy9sgznGaZMDtPWDKz2S2fuRYZOr2uM/7EjAIZY8rp2bzzBOw4zNRkZgoLYWt2yWV0aQxfO+70KMb/KBveAuDe/ON2fk+4CBg84N47HNJtQWlYPEbMgsPdvPh19+IzfwTz8K/dIGuveHNRUZTByNHjhk9vRYDh3yWM/5NzqN564O7eE3B54MZ08QOZ2yWWGCFwqYt8JNJcGt3+PsngcvnmtdsPtZal5RNk3KdR/M2hNaomkLbDPHE9OV++MMrcN890lUFy85d0GsQLF7mv1yu+UefB5e3rWbiEEyL5rKUWp24Z1Tll4NNaC0v5bL3yuat8mT40xEmJMBfVojDaxPXfwe+cHdfPbXW6yvuJf4nDo3xlvXVyzw7WkIxUVQkmx7m/4+s6ZvW8ptdBwe2uW3pN2+FLq49qZwHGmqti30Altmwq8NamB2J5tdMkpNlg8SyBfLjNY2+TpyEPy5w53vc13VlwXYqqt5cc9jFy6Ak4v6pax633Azr/gxtWrmPLXd4K7540dPP8eKyDxWFsgyHGv+rr2WJM05gmjSGX85w53+82e7/a80HRp/65xAPekAFoWitbQfKeO3NSra2FjFkoHsoXVwMX31z+fvr842n2iIcOVcOFjpLr34PduwKu521inop0Oxad36Z7mz7Z/CnvxhPtd13p1A+BGwaGa3hl2Y3FnEMmPZ6lW3Ie2GO8Xg+1vykDJtQLI+gv3Ketfzd2qWkDJfCQjhp2MzXtInouXJWGk+b5fTEalr4XICEPCrn0iWJjhDHPyvXuJ16ts2Qbu3nM41zmaNInAAbLqFYQVrmOPOXrpCRQ03jxw/LolZhJaNtnSqApw2OCIcMlBGsx1PyK1NQHK8tAm8g/qhsPD7Nb0SEasmJk/J/3XALPD8nrEBqHDoCmYPc5yYkwL+OkjAfBo4DxrGtUShWlDaXR5b8AxKuoiZy8kt47nloc7MoFOe+Ahs/9tZvFRfDR3+DSVNEdf/pTneZyQ/BqjWyC9PAE16RWD03VmqtlyilxgM2byIzZ4vXhOqkEwsFrWWz9rqP5HtiIlzbFBpdLenceSg4La6i/Gk7+vcRr0V9zJ6LPtBaLzcewY9QLB4FdlLBuWdRkSyRblnv3/biSmC6SckBPPkF2uNVUiJWXMddnbk3Y7Ng9kz4Xj9jd18MTPbbJn8Htdb7Ef/2Ng4ehomPBt/IWOE0rYPAFgQ5iyBnIYweUfkf2V1dxOf/gtfgkSnyrjEwS2vtd8E9oFt1y53eBixvCBX59Sx47KdBtznq3NgVdlfw9puYCMXfeJd3cumS2Jus3yirh/v2Q/5B75FZm1bQ6Sa48zYJclMW/O2lV2WThYG/IWsmftW8wfq6b4H4um9UMd/nk7XtqhAvpbQU0prZb2BGazi43fOUoK9bcBq+PSU7R9PTxCdzepp5yTg7B370oHFO8i3i6/5IoDqDspvVWh+3Xvq2qBClpTB2omz97N8nmCtFj093un/RnW+u/HV9PmjYQFIg8jbA+J8aBaKBnwQjEAghforWejUSNs9GSQmMHCeraVeSpYbtQbF0+LNpCwzN8pzHzdFauzTwXoQTaWgx4PI+nZYKyxdemSdm1x7Z4nPuvD1/96bYOGoIEGkoG/hRKPEfQ9r0b114LOBSQJ89B0OypE+NFQWnZb2n1yC3QL57Z2wE8vZKGDjCUyC5wPhQA3KGFefRisqWh0Rps+Hzic3f4w+HfNmAFBdDt37y+fQZsXs3xfb1+WDj+yKYaPLSq2LE6uEAYQuQqbU2i8sPYQfftOIYrsEgGBBfxn98NbLRIy5cgJRrApd7YXp03fYWnIYHJnkqGUECPQ/UWodlVBK2zZJVYS8MXRnIbvVOd8kadaxIT4PXXo6uQLZul7gofgSSC/QJVyBQCaEAWOvKQ5GYuS6OHpf+/vk50dMu16kj7v+mPw2Hd0bPZe+FC6L369bPb4jabCSuY9ghaiFyUbZ9yIrlFDyibLdvK9ER+rk3oQVNaenl7Z71UsSLULProh9g57218OhTntpekHnIHOCZKhFl23YxpYYiawQNvcqMHAYzf149PCXt2SfqfD9dFcjO0vFa61WRqjeiQoFylUw24sHViM8nrpdmTJOup6qxcxfMeUU2IwYwbdgMjAomTGAoRFwoUK7EnA48iSOml72c+H6fOF4Mb8J1lhYJSkqkm3p9vmwDCnBbioDZwMxAysVwiIpQyi8u0e9+i0Sb8EvTJhI4Z2xWbJ+ezVtlb292jhgCBcH7wCPWskZUiKpQyiuRoGAvIiGPAtLsOjEh6N0Devc0m1WHy5FjYhCVa6UTJ4M+9XPg3/2tGEaKmAgFKDO3eADp0gxbob1p0Vx8bbVve/lv40ainU5PE71bSopoic+eExX7qQLxx7Vv/+W0N99o0haIo8jIcl6oIczDRmsd04S42x0H7EGGklU1HQIeA5JjfY9i9qQ4seY23RAF52gMzuCuAIXAamRv7xqttUGzFn2umFBsjZCALvchwumBOOOPFeeBdYh9ztuW9cEVpUoIpSJKqQSgMzJi6wt0x8+wOgwuAtuBtVbaELN3RZBUOaE4seY8bYCOiA/lDshAoSHS5aVZqT7i/Oeslc4g6+JHkJ3t+4C9wOFozC0iyf8DF8oHzHnNkc0AAAAASUVORK5CYII=",
                "id": "TringlymansJSONUtilities",
                "name": "Tringlyman's JSON Utilities",
                "docsURI": "https://sites.google.com/view/tringlys-scratch-extesions/gallery/documents/tringlymans-js-and-console-functons-extension",
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