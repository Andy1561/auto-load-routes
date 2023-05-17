let path = require('path')
let glob = require('glob')
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
Array.prototype.insertAt = function(i,...rest){
  this.splice(i,0,...rest)
  return this
}
async function loadRouter(router,workdir,{printlog=false}={}){
    workdir = workdir.replace(/\\/g,'/');
    let filelist = glob.sync(`${workdir}/**/+(*.js|*.cjs|*.mjs)`);
    let l1filelist = [];
    let l2filelist = [];
    let l3filelist = [];
    for (let file of filelist) {
        let filename = path.basename(file)
        if (filename.startsWith('_'))
        {
            continue
        }
        let tmp = {
          handler : (await import('file://'+file)).default,
          url : file.slice(workdir.length),
          deeplength:file.slice(workdir.length+1).split('/').length
        }
        if (filename.startsWith('[...')){
          let index = l3filelist.findIndex(c=>c.deeplength<=tmp.deeplength);
          index = index==-1?0:index;
          l3filelist.insertAt(index,tmp);
        }
        else if (filename.startsWith('[')){
          let index = l2filelist.findIndex(c=>c.deeplength<=tmp.deeplength);
          index = index==-1?0:index;
          l2filelist.insertAt(index,tmp);
        }
        else{
          let index = l1filelist.findIndex(c=>c.deeplength<=tmp.deeplength);
          index = index==-1?0:index;
          l1filelist.insertAt(index,tmp);
        }
    }
    for (let item of [...l1filelist,...l2filelist,...l3filelist]) {
        let { url, methods } = loadRouter(item.url);
        if (methods.includes("GET")) {
            router.get(url, item.handler);
            if (printlog)
                console.info(`${item.url} > GET ${url} `)
        }
        if (methods.includes("POST")) {
            router.post(url, item.handler);
            if (printlog)
                console.info(`${item.url} > POST ${url} `)
        }
    }
    return router;
}
module.exports = loadRouter
