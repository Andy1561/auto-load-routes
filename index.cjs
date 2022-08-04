function loadRouter(filename) {
    filename = filename.replace(/\\/g, "/");
    let urlarray = filename.split("/");
    let methods = [];
    let lasturl = urlarray[urlarray.length - 1].replace(/\.[^/.]+$/, "");
    if (lasturl.toLowerCase().endsWith(".get")) {
        methods.push("GET");
        lasturl = lasturl.slice(0, -4);
    } else if (lasturl.toLowerCase().endsWith(".post")) {
        methods.push("POST");
        lasturl = lasturl.slice(0, -5);
    } else {
        methods.push("GET");
        methods.push("POST");
    }

    let regex = /(\[{1})(\.{3})([\S]+?)(\]{1})/g;
    if (regex.test(lasturl)) {
        let slug = lasturl.replace(regex, "$3");
        lasturl = "*";
    } else {
        regex = /(\[{1})([\S]+?)(\]{1})/g;
        if (regex.test(lasturl)) {
            let slug = lasturl.replace(regex, ":$2/");
            lasturl = slug.slice(0, -1);
        }
    }
    urlarray[urlarray.length - 1] = lasturl;
    if (lasturl.toLowerCase() == "index") {
        urlarray.pop();
    }
    return {
        url: urlarray.join("/"),
        methods: methods,
    };
}
async function AutoLoad(router,workdir,opts){
    let option = Object.assign({log:false},opts);
    workdir = workdir.replace(/\\/g,'/');
    var filelist = require('glob').sync(`${workdir}/**/+(*.js|*.cjs|*.mjs)`);
    let maps = [];
    for (var file of filelist) {
        maps.push({
            handler : (await import('file://'+file)).default,
            url : file.slice(workdir.length)
        })
    }
    for (var item of maps) {
        let { url, methods } = loadRouter(item.url);
        if (methods.includes("GET")) {
            router.get(url, item.handler);
            if (option.log)
                console.info(`${item.url} > GET ${url} `)
        }
        if (methods.includes("POST")) {
            router.post(url, item.handler);
            if (option.log)
                console.info(`${item.url} > POST ${url} `)
        }
    }
    return router;
}
module.exports = {
    AutoLoad
}