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
async function AutoLoad(router,workdir,opts){
  let option = Object.assign({log:false},opts);
  workdir = workdir.replace(/\\/g,'/');
  var filelist = require('glob').sync(`${workdir}/**/+(*.js|*.cjs|*.mjs)`);
  let l1filelist = [];
  let l2filelist = [];
  let l3filelist = [];
  let path = require('path')
  for (var file of filelist) {
      let tmp = {
        file:file,
        handler : (await import('file://'+file)).default,
        url : file.slice(workdir.length),
        deeplength:file.split('/').length
      };
      if (path.basename(file).startsWith('[...')){
        let index = l3filelist.findIndex(c=>c.deeplength<=tmp.deeplength);
        index = index==-1?0:index;
        l3filelist.insertAt(index,tmp);
      }
      else if (path.basename(file).startsWith('[')){
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
  for (var item of l1filelist.concat(l2filelist).concat(l3filelist)) {
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
