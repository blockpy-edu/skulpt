var $builtinmodule = function (name) {
    const {
        object: pyObject,
        int_: pyInt,
        str: pyStr,
        list: pyList,
        tuple: pyTuple,
        dict: pyDict,
        none: { none$: pyNone },
        bool: { false$: pyFalse, true$: pyTrue },
        NotImplemented: { NotImplemented$: pyNotImplemented },
        bool: pyBool,
        func: pyFunc,
        method: pyMethod,
        TypeError: pyTypeError,
        RuntimeError,
        ValueError,
        NotImplementedError,
        AttributeErrror,
        OverflowError,
        OSError,
        checkNone,
        checkBool,
        checkCallable,
        checkClass,
    } = Sk.builtin;

    const {
        callsimArray: pyCall,
        callsimOrSuspendArray: pyCallOrSuspend,
        iterFor,
        chain,
        isIndex,
        asIndexSized,
        isTrue,
        richCompareBool,
        objectRepr,
    } = Sk.misceval;

    const { remapToPy: toPy, remapToJs: toJs } = Sk.ffi;

    const {
        buildNativeClass,
        setUpModuleMethods,
        keywordArrayFromPyDict,
        keywordArrayToPyDict,
        objectHash,
        lookupSpecial,
        copyKeywordsToNamedArgs,
        typeName,
        iter: objectGetIter,
        gattr: objectGetAttr,
    } = Sk.abstr;

    const { getSetDict: genericGetSetDict, getAttr: genericGetAttr, setAttr: genericSetAttr } = Sk.generic;


    const STRING_IMAGE = new pyStr("Image");
    const STRING_PIL = new pyStr("PIL");
    const STRING_BINARY_READ = new pyStr("rb");
    const MOD_NAME = new pyStr("PIL.Image");

    const MODES = ["1", "L", "P", "RGB", "RGBA", "CMYK", "YCbCr", "LAB", "HSV", "I", "F"];
    const DEFAULT_MODE = "RGBA";

    if (!Sk.PIL) {
        Sk.PIL = {assets: {}};
    }

    /**
     * Convert a Python color to a JS color string
     * @param color
     * @param format
     * @returns {string}
     */
    function parsePyColor(color, format) {
        if (color.tp$name === "tuple") {
            return "rgba(" + color.v.join(",") + ")";
        } else if (color.tp$name === "int") {
            if (format.v.startsWith("RGB")) {
                const r = Math.round(color.v % 256),
                    g = Math.round((color.v / 256) % 256),
                    b = Math.round((color.v / 256 / 256) % 256);
                return `rgb(${r}, ${g}, ${b}, 255)`;
            } else {
                const value = Math.round(color.v);
                return `rgba(${value}, ${value}, ${value}, 255)`;
            }
        } else {
            throw new Sk.builtin.ValueError("Invalid color format");
        }
    }

    function PillowImage(canvas, mode) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.width = canvas.width;
        this.height = canvas.height;
        this.imageData = this.context.getImageData(0, 0, this.width, this.height);
        this.mode = mode || DEFAULT_MODE;
    }

    function newPilImage(data, mode) {
        return pyCall(Sk.builtin.PillowImage, [new PillowImage(data, mode)]);
    }

    function pilImageFromRawData(data) {
        return newPilImage(imageToCanvas(data));
    }

    function imageToCanvas(image) {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext("2d");
        context.drawImage(image, 0, 0);
        return canvas;
    }

    function loadImage(src, resolve, reject, cleanup=null) {
        const img = new Image();
        img.onload = function () {
            const canvas = imageToCanvas(img);
            if (cleanup) {
                cleanup();
            }
            Sk.PIL.assets[src] = img;
            resolve(newPilImage(canvas));
        };
        img.src = src;
        img.onerror = function (e) {
            if (cleanup) {
                try {
                    cleanup();
                } catch(e) {console.error("Error during cleanup:", e);}
            }
            console.error(e);
            // throw new Sk.builtin.ValueError("Failed to load image");
            reject(new Sk.builtin.ValueError("Failed to load image"));
        };
    }

    function getAsset(name) {
        return new Promise(function (resolve, reject) {
            if (!name.startsWith("http") && !name.startsWith("data:image")) {
                try {
                    name = Sk.fileToURL(name);
                } catch (e) {
                    reject(e);
                    throw e;
                }
            }
            if (Sk.PIL.assets[name] !== undefined) {
                //return Sk.PIL.assets[name];
                resolve(Sk.PIL.assets[name]);
            } else {
                var img = new Image();
                img.onload = function () {
                    Sk.PIL.assets[name] = this;
                    resolve(this);
                };
                img.onerror = function () {
                    reject(new OSError("Failed to load asset: " + name));
                };
                img.src = name;
            }
        });
    }

    // Open an image from a URL or file path
    PillowImage.open = function (src) {
        var imagePromise;
        console.log("PIL.open:", src);
        if (src.tp$name === "ReadableFile") {
            return Sk.misceval.chain(
                Sk.misceval.callsimOrSuspendArray(src.read, [src]),
                (bytes) => {
                    const uint8array = bytes.v;
                    const blob = new Blob([uint8array], {type: "image/png"});
                    const url = URL.createObjectURL(blob);
                    return Sk.misceval.promiseToSuspension(
                        new Promise(function (resolve, reject) {
                            const img = new Image();
                            img.onload = function () {
                                Sk.PIL.assets[src] = this;
                                const result = newPilImage(imageToCanvas(this));
                                console.log("Loaded image from file:", result);
                                resolve(result);
                            };
                            img.onerror = function () {
                                reject(new OSError("Failed to load PILImage from file"));
                            };
                            img.src = url;
                        })
                    );
                }
            );
        } else if (src.tp$name === "BytesIO") {
            imagePromise = new Promise(function (resolve, reject) {
                Sk.misceval.callsimArray(src.seek, [src, new Sk.builtin.int_(0)]);
                const bytes = Sk.misceval.callsimOrSuspendArray(src.read, [src]);
                const uint8array = bytes.v;
                const blob = new Blob([uint8array], {type: "image/png"});
                const url = URL.createObjectURL(blob);
                var img = new Image();
                img.onload = function () {
                    // TODO: Shouldn't this be getting the url/filename?
                    Sk.PIL.assets[src] = this;
                    resolve(this);
                };
                img.onerror = function () {
                    reject(new OSError("Failed to load asset loaded from BytesIO"));
                };
                img.src = url;
            });
        } else {
            imagePromise = getAsset(Sk.ffi.remapToJs(src));
        }
        console.log("Created promise:", imagePromise);
        var susp = new Sk.misceval.Suspension();
        let pilImage = Sk.builtin.none.none$;
        susp.resume = function () {
            console.log("Resuming", susp);
            if (susp.data["error"]) {
                throw susp.data["error"];
            } else {
                return pilImage;
            }
        };
        susp.data = {
            type: "Sk.promise",
            promise: imagePromise.then(function (value) {
                console.log("REACHED", value);
                const canvas = imageToCanvas(value);
                pilImage = newPilImage(canvas);
                return pilImage;
            }, function (err) {
                console.log("Error during promise evaluation", err, susp);
                // pilImage = newPilImage(document.createElement("canvas"));
                throw err;
            })
        };

        return susp;
    };

    PillowImage.prototype.size = function () {
        return new Sk.builtin.tuple([new Sk.builtin.int_(this.width),
                                     new Sk.builtin.int_(this.height)]);
    };

    PillowImage.prototype.getpixel = function (xy) {
        Sk.builtin.pyCheckArgs("getpixel", arguments, 1, 1, false, false);
        const values = Sk.ffi.remapToJs(xy);
        const x = values[0];
        const y = values[1];
        const index = (y * this.width + x) * 4;
        const data = this.imageData.data;
        const pixels= [
            new Sk.builtin.int_(data[index]),
            new Sk.builtin.int_(data[index + 1]),
            new Sk.builtin.int_(data[index + 2])
        ];
        if (this.mode === "L") {
            return pixels[0];
        }
        if (this.mode === "RGBA") {
            pixels.push(new Sk.builtin.int_(data[index + 3]));
        }
        return new Sk.builtin.tuple(pixels);
    };

    PillowImage.prototype.putpixel = function (xy, color) {
        // console.log(x, y, color);
        Sk.builtin.pyCheckArgs("putpixel", arguments, 2, 2, false, false);
        const values = Sk.ffi.remapToJs(xy);
        const x = values[0];
        const y = values[1];
        const index = (y * this.width + x) * 4;
        const data = this.imageData.data;
        const r = data[index] = color.v[0].v;
        const g = data[index + 1] = color.v[1].v;
        const b = data[index + 2] = color.v[2].v;
        const a = data[index + 3] = color.v.length > 3 ? color.v[3].v : 255; // Default to full opacity
        //this.context.putImageData(this.imageData, 0, 0);
        this.context.fillStyle = "rgba(" + [r, g, b, a/255].join() + ")";
        this.context.fillRect(x, y, 1, 1);
        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.save = function (filename, format) {
        if (filename.tp$name === "BytesIO") {
            const url = this.context.canvas.toDataURL("image/png");
            const base64Data = url.replace(/^data:image\/png;base64,/, "");
            const binaryData = atob(base64Data);
            const uint8Array = new Uint8Array(binaryData.length);

            for (let i = 0; i < binaryData.length; i++) {
                uint8Array[i] = binaryData.charCodeAt(i);
            }
            const bytes = new Sk.builtin.bytes(uint8Array);
            Sk.misceval.callsimArray(filename.write, [filename, bytes]);
            return pyNone;
        }
        /*const link = document.createElement("a");
        link.download = Sk.ffi.remapToJs(filename);
        link.href = this.canvas.toDataURL("image/png");
        link.click();
        return Sk.builtin.none.none$;*/
        return pyNone;
    };

    PillowImage.prototype.convert = function (mode) {
        mode = Sk.ffi.remapToJs(mode);

        const data = this.imageData.data;
        const newImageData = this.context.createImageData(this.width, this.height);
        const newData = newImageData.data;

        // Grayscale conversion (already implemented)
        if (mode === "L") {
            for (let i = 0; i < data.length; i += 4) {
                const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
                newData[i] = newData[i + 1] = newData[i + 2] = avg;
                newData[i + 3] = data[i + 3];  // Keep the alpha channel
            }
        } else if (mode === "RGB") {
            // RGB mode (remove the alpha channel)
            for (let i = 0; i < data.length; i += 4) {
                newData[i] = data[i];         // Red
                newData[i + 1] = data[i + 1]; // Green
                newData[i + 2] = data[i + 2]; // Blue
                newData[i + 3] = 255;         // No alpha in RGB, full opacity
            }
        } else if (mode === "RGBA") {
            // RGBA mode (ensure alpha channel exists, default to 255 if missing)
            for (let i = 0; i < data.length; i += 4) {
                newData[i] = data[i];         // Red
                newData[i + 1] = data[i + 1]; // Green
                newData[i + 2] = data[i + 2]; // Blue
                newData[i + 3] = data[i + 3] !== undefined ? data[i + 3] : 255; // Use alpha, default to opaque
            }
        } else if (mode === "1") {
            // 1-bit binary image (black and white, threshold at 128)
            for (let i = 0; i < data.length; i += 4) {
                const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]; // Grayscale value
                const value = avg > 128 ? 255 : 0;  // Threshold at 128
                newData[i] = newData[i + 1] = newData[i + 2] = value; // Black or White
                newData[i + 3] = 255;  // Full opacity
            }
        } else if (mode === "CMYK") {
            // CMYK mode
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i] / 255;
                const g = data[i + 1] / 255;
                const b = data[i + 2] / 255;

                const k = Math.min(1 - r, 1 - g, 1 - b);
                const c = (1 - r - k) / (1 - k) || 0;
                const m = (1 - g - k) / (1 - k) || 0;
                const y = (1 - b - k) / (1 - k) || 0;

                newData[i] = c * 255;
                newData[i + 1] = m * 255;
                newData[i + 2] = y * 255;
                newData[i + 3] = k * 255; // Use K (black) as alpha to keep 4 channels
            }
        } else {
            throw new Sk.builtin.ValueError("Unsupported mode: " + mode);
        }
        newImageData.data.set(newData);
        const [newCanvas, newContext] = makeCanvas(this.width, this.height);
        newContext.putImageData(newImageData, 0, 0);

        const newImage = newPilImage(newCanvas);
        newImage.v.mode = mode;
        return newImage;
    };

    PillowImage.prototype.load = function() {
        return pyCall(mod.PixelAccess, [this]);
    };

    PillowImage.prototype.filter = function (filter_type) {
        if (filter_type.v === "BLUR") {
            this.context.filter = "blur(5px)";
        } else if (filter_type.v === "SHARPEN") {
            // Canvas doesn't natively support sharpen, requires custom convolution
            const sharpenKernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
            ];
            applyKernel(this.canvas, this.context, sharpenKernel);
        }
        this.context.drawImage(this.canvas, 0, 0);
        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.copy = function () {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        const newContext = newCanvas.getContext("2d");
        newContext.drawImage(this.canvas, 0, 0);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.crop = function (box) {
        const [left, top, right, bottom] = box.v.map(b => b.v);
        const newCanvas = document.createElement("canvas");
        newCanvas.width = right - left;
        newCanvas.height = bottom - top;
        const newContext = newCanvas.getContext("2d");
        newContext.drawImage(this.canvas, left, top, newCanvas.width, newCanvas.height, 0, 0, newCanvas.width, newCanvas.height);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.resize = function (size) {
        const [newWidth, newHeight] = [size.v[0].v, size.v[1].v];
        const newCanvas = document.createElement("canvas");
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        const newContext = newCanvas.getContext("2d");
        newContext.drawImage(this.canvas, 0, 0, newWidth, newHeight);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.rotate = function (angle, expand) {
        angle = angle.v;
        expand = expand ? Sk.ffi.remapToJs(expand) : false;
        const radians = angle * Math.PI / 180;

        const newCanvas = document.createElement("canvas");
        const context = newCanvas.getContext("2d");

        if (expand) {
            const diagonal = Math.sqrt(this.width ** 2 + this.height ** 2);
            newCanvas.width = newCanvas.height = diagonal;
            context.translate(diagonal / 2, diagonal / 2);
        } else {
            newCanvas.width = this.width;
            newCanvas.height = this.height;
            context.translate(this.width / 2, this.height / 2);
        }

        context.rotate(radians);
        context.drawImage(this.canvas, -this.width / 2, -this.height / 2);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.transpose = function (method) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        const context = newCanvas.getContext("2d");

        if (method.v === "FLIP_LEFT_RIGHT") {
            context.translate(this.width, 0);
            context.scale(-1, 1);
        } else if (method.v === "FLIP_TOP_BOTTOM") {
            context.translate(0, this.height);
            context.scale(1, -1);
        } else if (method.v === "ROTATE_90") {
            newCanvas.width = this.height;
            newCanvas.height = this.width;
            context.rotate(Math.PI / 2);
            context.drawImage(this.canvas, 0, -this.height);
            return newPilImage(newCanvas);
        }

        context.drawImage(this.canvas, 0, 0);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.paste = function (im, box, mask) {
        const [x, y] = box.v.map(b => b.v);
        this.context.drawImage(im.v.canvas, x, y);
        if (mask) {
            // Optionally implement masking here
        }
        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.thumbnail = function (size) {
        const [targetWidth, targetHeight] = size.v.map(s => s.v);
        const aspectRatio = this.width / this.height;
        let newWidth, newHeight;

        if (this.width > this.height) {
            newWidth = targetWidth;
            newHeight = targetWidth / aspectRatio;
        } else {
            newHeight = targetHeight;
            newWidth = targetHeight * aspectRatio;
        }

        return this.resize(new Sk.builtin.tuple([new Sk.builtin.int_(newWidth), new Sk.builtin.int_(newHeight)]));
    };

    PillowImage.prototype.resize = function (size, resample) {
        const [newWidth, newHeight] = [size.v[0].v, size.v[1].v];
        const newCanvas = document.createElement("canvas");
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        const newContext = newCanvas.getContext("2d");

        // Resampling options, defaulting to bilinear
        if (resample && resample.v === "NEAREST") {
            newContext.imageSmoothingEnabled = false;
        } else {
            newContext.imageSmoothingEnabled = true;
        }

        newContext.drawImage(this.canvas, 0, 0, newWidth, newHeight);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.split = function () {
        const rCanvas = this.createChannelCanvas(0);
        const gCanvas = this.createChannelCanvas(1);
        const bCanvas = this.createChannelCanvas(2);
        const aCanvas = this.createChannelCanvas(3);

        return new Sk.builtin.tuple([
            newPilImage(rCanvas),
            newPilImage(gCanvas),
            newPilImage(bCanvas),
            newPilImage(aCanvas)
        ]);
    };

    function makeCanvas(width, height) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        return [canvas, context];
    }

    PillowImage.prototype.createChannelCanvas = function (channel) {
        const [newCanvas, newContext] = makeCanvas(this.width, this.height);
        const newImageData = newContext.createImageData(this.width, this.height);

        for (let i = 0; i < this.imageData.data.length; i += 4) {
            newImageData.data[i + channel] = this.imageData.data[i + channel];
            newImageData.data[i + 3] = 255; // Full opacity
        }
        newContext.putImageData(newImageData, 0, 0);
        return newCanvas;
    };

    PillowImage.prototype.merge = function (mode, bands) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = bands.v[0].v.width;
        newCanvas.height = bands.v[0].v.height;
        const newContext = newCanvas.getContext("2d");
        const newImageData = newContext.createImageData(newCanvas.width, newCanvas.height);

        for (let i = 0; i < newImageData.data.length; i += 4) {
            newImageData.data[i] = bands.v[0].v.imageData.data[i];       // Red or equivalent
            newImageData.data[i + 1] = bands.v[1].v.imageData.data[i + 1]; // Green or equivalent
            newImageData.data[i + 2] = bands.v[2].v.imageData.data[i + 2]; // Blue or equivalent
            newImageData.data[i + 3] = bands.v[3] ? bands.v[3].v.imageData.data[i + 3] : 255; // Alpha if available
        }

        newContext.putImageData(newImageData, 0, 0);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.enhance = function (factor) {
        const brightnessFactor = factor.v;
        const data = this.imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            data[i] = Math.min(255, data[i] * brightnessFactor);     // Red
            data[i + 1] = Math.min(255, data[i + 1] * brightnessFactor); // Green
            data[i + 2] = Math.min(255, data[i + 2] * brightnessFactor); // Blue
        }

        this.context.putImageData(this.imageData, 0, 0);
        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.point = function (lut) {
        const data = this.imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = lut.v[0].v[data[i]];         // Red
            data[i + 1] = lut.v[1].v[data[i + 1]]; // Green
            data[i + 2] = lut.v[2].v[data[i + 2]]; // Blue
        }
        this.context.putImageData(this.imageData, 0, 0);
        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.alpha_composite = function (im) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        const newContext = newCanvas.getContext("2d");

        // Draw the current image
        newContext.globalAlpha = 1;
        newContext.drawImage(this.canvas, 0, 0);

        // Overlay with the second image
        newContext.globalAlpha = im.v.alpha || 1;
        newContext.drawImage(im.v.canvas, 0, 0);

        return newPilImage(newCanvas);
    };

    PillowImage.prototype.blend = function (im, alpha) {
        const newCanvas = document.createElement("canvas");
        newCanvas.width = this.width;
        newCanvas.height = this.height;
        const newContext = newCanvas.getContext("2d");

        newContext.globalAlpha = 1 - alpha.v;
        newContext.drawImage(this.canvas, 0, 0);
        newContext.globalAlpha = alpha.v;
        newContext.drawImage(im.v.canvas, 0, 0);

        return newPilImage(newCanvas);
    };

    PillowImage.prototype.histogram = function () {
        const data = this.imageData.data;
        const hist = new Array(256).fill(0);

        for (let i = 0; i < data.length; i += 4) {
            const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2]; // Grayscale equivalent
            hist[Math.floor(avg)]++;
        }

        const converted = hist.map(v => new Sk.builtin.int_(v));
        return new Sk.builtin.list(converted);
    };

    PillowImage.prototype.paste_with_alpha = function (im, box, alphaMask) {
        const [x, y] = box.v.map(b => b.v);

        // Draw image with alpha mask
        this.context.globalCompositeOperation = "destination-in";
        this.context.drawImage(alphaMask.v.canvas, x, y);

        // Paste main image over masked area
        this.context.globalCompositeOperation = "source-over";
        this.context.drawImage(im.v.canvas, x, y);

        return Sk.builtin.none.none$;
    };

    PillowImage.prototype.transform = function (size, method) {
        const newCanvas = document.createElement("canvas");
        const [newWidth, newHeight] = size.v.map(s => s.v);
        newCanvas.width = newWidth;
        newCanvas.height = newHeight;
        const newContext = newCanvas.getContext("2d");

        if (method.v === "AFFINE") {
            // Placeholder for a more complex transformation logic
            newContext.setTransform(1, 0, 0, 1, 0, 0);
        } else if (method.v === "PERSPECTIVE") {
            // Placeholder for perspective transformation logic
        }

        newContext.drawImage(this.canvas, 0, 0, newWidth, newHeight);
        return newPilImage(newCanvas);
    };

    PillowImage.prototype.getbbox = function () {
        const data = this.imageData.data;
        let left = this.width, top = this.height, right = 0, bottom = 0;

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const index = (y * this.width + x) * 4;
                if (data[index + 3] !== 0) { // Not transparent
                    left = Math.min(left, x);
                    top = Math.min(top, y);
                    right = Math.max(right, x);
                    bottom = Math.max(bottom, y);
                }
            }
        }

        if (left > right || top > bottom) {
            return Sk.builtin.none.none$;
        }

        return new Sk.builtin.tuple([new Sk.builtin.int_(left), new Sk.builtin.int_(top), new Sk.builtin.int_(right), new Sk.builtin.int_(bottom)]);
    };

    // Register functions at module level
    var mod = {__name__: MOD_NAME};

    const new$ = function (mode, size, color) {
        const canvas = document.createElement("canvas");
        canvas.width = size.v[0].v;
        canvas.height = size.v[1].v;
        const context = canvas.getContext("2d");
        context.fillStyle = parsePyColor(color, mode);
        context.fillRect(0, 0, canvas.width, canvas.height);
        return newPilImage(canvas, mode.v);
    };
    new$.co_name = new Sk.builtin.str("new");
    new$.co_varnames = ["mode", "size", "color"];
    new$.$defaults = [new Sk.builtin.int_(0)];

    // Register the Pillow Image class
    mod.Image = Sk.builtin.PillowImage = Sk.misceval.buildClass(
        mod,
        function ($gbl, $loc) {
            $loc.__init__ = new Sk.builtin.func(function (self, canvas) {
                self.v = canvas;
            });

            $loc.new = new Sk.builtin.func(new$);

            $loc.size = new Sk.builtin.property(function (self) {
                return self.v.size();
            });

            $loc.width = new Sk.builtin.property(function (self) {
                return new Sk.builtin.int_(self.v.width);
            });

            $loc.height = new Sk.builtin.property(function (self) {
                return new Sk.builtin.int_(self.v.height);
            });

            $loc.mode = new Sk.builtin.property(function (self) {
                return new Sk.builtin.str(self.v.mode);
            });

            const getpixel = function (self, xy) {
                return self.v.getpixel(xy);
            };
            getpixel.co_name = new Sk.builtin.str("getpixel");
            getpixel.co_varnames = ["self", "xy"];
            $loc.getpixel = new Sk.builtin.func(getpixel);

            const putpixel = function (self, xy, color) {
                return self.v.putpixel(xy, color);
            };
            putpixel.co_name = new Sk.builtin.str("putpixel");
            putpixel.co_varnames = ["self", "xy", "color"];
            $loc.putpixel = new Sk.builtin.func(putpixel);

            const saveMethod = function (self, filename, format) {
                return self.v.save(filename, format);
            };
            saveMethod.co_name = new Sk.builtin.str("save");
            saveMethod.co_varnames = ["self", "filename", "format"];
            saveMethod.$defaults = [pyNone];
            $loc.save = new Sk.builtin.func(saveMethod);

            $loc.convert = new Sk.builtin.func(function (self, mode) {
                return self.v.convert(mode);
            });

            $loc.copy = new Sk.builtin.func(function (self) {
                return self.v.copy();
            });

            $loc.resize = new Sk.builtin.func(function (self, size) {
                return self.v.resize(size);
            });

            $loc.crop = new Sk.builtin.func(function (self, box) {
                return self.v.crop(box);
            });

            $loc.rotate = new Sk.builtin.func(function (self, angle, expand) {
                return self.v.rotate(angle, expand);
            });

            $loc.load = new Sk.builtin.func(function (self) {
                return self.v.load();
            });

            $loc.transpose = new Sk.builtin.func(function (self, method) {
                return self.v.transpose(method);
            });

            $loc.filter = new Sk.builtin.func(function (self, filter_type) {
                return self.v.filter(filter_type);
            });

            $loc.paste = new Sk.builtin.func(function (self, im, box, mask) {
                return self.v.paste(im, box, mask);
            });

            $loc.thumbnail = new Sk.builtin.func(function (self, size) {
                return self.v.thumbnail(size);
            });

            $loc.resize = new Sk.builtin.func(function (self, size, resample) {
                return self.v.resize(size, resample);
            });

            $loc.split = new Sk.builtin.func(function (self) {
                return self.v.split();
            });

            $loc.merge = new Sk.builtin.func(function (self, mode, bands) {
                return self.v.merge(mode, bands);
            });

            $loc.enhance = new Sk.builtin.func(function (self, factor) {
                return self.v.enhance(factor);
            });

            $loc.point = new Sk.builtin.func(function (self, lut) {
                return self.v.point(lut);
            });

            $loc.alpha_composite = new Sk.builtin.func(function (self, im) {
                return self.v.alpha_composite(im);
            });

            $loc.blend = new Sk.builtin.func(function (self, im, alpha) {
                return self.v.blend(im, alpha);
            });

            $loc.histogram = new Sk.builtin.func(function (self) {
                return self.v.histogram();
            });

            $loc.paste_with_alpha = new Sk.builtin.func(function (self, im, box, alphaMask) {
                return self.v.paste_with_alpha(im, box, alphaMask);
            });

            $loc.transform = new Sk.builtin.func(function (self, size, method) {
                return self.v.transform(size, method);
            });

            $loc.getbbox = new Sk.builtin.func(function (self) {
                return self.v.getbbox();
            });

            $loc.open = new Sk.builtin.func(function (src) {
                return PillowImage.open(src);
            });

            $loc.show = new Sk.builtin.func(function (self) {
                if (Sk.console === undefined) {
                    throw new Sk.builtin.NameError("Can not resolve drawing area. Sk.console is undefined!");
                }

                console.log(this, self);

                var consoleData = {
                    image: self.v.canvas,
                    file_or_url: "TEST GOES HERE"
                };

                Sk.console.printPILImage(consoleData);
            });
        },
        "Image",
        []
    );

    // Add Image.open function
    mod.open = new Sk.builtin.func(function (src) {
        return PillowImage.open(src);
    });

    mod.new_$rw$ = new Sk.builtin.func(new$);

    const PixelAccessClass = function($gbl, $loc) {
        $loc.__init__ = new Sk.builtin.func(function(self, image) {
            self.v = image;
        });

        $loc.__getitem__ = new Sk.builtin.func(function(self, index) {
            return self.v.getpixel(index.v[0], index.v[1]);
        });

        $loc.__setitem__ = new Sk.builtin.func(function(self, index, value) {
            return self.v.putpixel(index.v[0], index.v[1], value);
        });
    };
    mod.PixelAccess = Sk.misceval.buildClass(mod, PixelAccessClass, "PixelAccess", []);

    return mod;
};