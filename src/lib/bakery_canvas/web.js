/**
 * Skulpt Module for holding the Instructor API.
 *
 * This module is loaded in by getting the functions' source code from toString.
 * Isn't that crazy?
 *
 *
 */
var $builtinmodule = function (name) {
    var web = {__name__: new Sk.builtin.str("web")};

    web.get_model_info = new Sk.builtin.func(function(keys) {
        Sk.builtin.pyCheckArgs("get_model_info", arguments, 1, 1);
        let model = Sk.executionReports["model"];
        keys = Sk.ffi.remapToJs(keys).split(".");
        for (var i=0; i < keys.length; i++) {
            model = model[keys[i]];
        }
        return Sk.ffi.remapToPy(model());
    });

    web.download_file = new Sk.builtin.func(function(placement, directory, filename) {
        Sk.builtin.pyCheckArgs("download_file", arguments, 3, 3);
        const downloadFileUrl = Sk.executionReports["model"].configuration.urls["downloadFile"];
        const combiner = downloadFileUrl.includes("?") ? "&" : "?";
        const url = `${downloadFileUrl}${combiner}placement=${placement}&directory=${directory}&filename=${filename}`;
        const prom = new Promise(function (resolve, reject) {
            const xmlhttp = new XMLHttpRequest();

            xmlhttp.addEventListener("loadend", function (e) {
                resolve(Sk.ffi.remapToPy(xmlhttp.responseText));
            });

            xmlhttp.open("GET", url);
            xmlhttp.send(null);
        });
        const susp = new Sk.misceval.Suspension();
        let resolution = null;
        susp.resume = ()=>resolution;
        susp.data = {
            type: "Sk.promise",
            promise: prom.then((value) => {
                resolution = value;
                return value;
            }, (err) => {
                resolution ="";
                return err;
            })
        };
        return susp;
    });

    return web;
}