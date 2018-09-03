const path = require('path');
const mapDir = require('node-map-directory');
const showdown  = require('showdown');
const converter = new showdown.Converter({omitExtraWLInCodeBlocks: true, parseImgDimensions: true, simpleLineBreaks: false, tasklists: true, noHeaderId: true, openLinksInNewWindow: true, emoji: true});
const fs = require('fs');
const mkdirp = require('mkdirp');

function rec(dirs, src, dist) {

  // const files =  [].concat.apply([], dirs.map(function(dir) {
  //   if (dir.type == 'file' && dir.extension == '.md' && dir.name !== '') {
  //     return path.resolve(__dirname, paths.join('/') + '/' + dir.name + dir.extension);
  //   } else if (dir.type == 'dir' && dir.children.length > 0 && dir.name !== '') {
  //     return rec(dir.children, paths.concat([dir.name]));
  //   } else {
  //     return null;
  //   }
  // })).filter(function(dir) {
  //   return dir !== null;
  // });
  var files = [];
  var menus = [];

  for (var i = 0; i < dirs.length; i++) {
    if (dirs[i].type == 'file' && dirs[i].extension == '.md' && dirs[i].name !== '') {
      menus.push({
        text: dirs[i].name.replace(/^\d+-/, ''),
        href: dirs[i].name.replace(/^\d+-/, '') + '.html'
      });

      files.push({
        src: path.resolve(__dirname, src.join('/') + '/' + dirs[i].name + dirs[i].extension),
        dist: path.resolve(__dirname, dist.join('/') + '/' + dirs[i].name.replace(/^\d+-/, '') + '.html'),
      });
    } else if (dirs[i].type == 'dir' && dirs[i].children.length > 0 && dirs[i].name !== '') {
      var kids = [];
      
      for (var j = 0; j < dirs[i].children.length; j++) {
        if (dirs[i].children[j].type == 'file' && dirs[i].children[j].extension == '.md' && dirs[i].children[j].name !== '') {
          kids.push({
            text: dirs[i].children[j].name.replace(/^\d+-/, ''),
            href: dirs[i].children[j].name.replace(/^\d+-/, '') + '.html'
          });

          files.push({
            src: path.resolve(__dirname, src.concat([dirs[i].name]).join('/') + '/' + dirs[i].children[j].name + dirs[i].children[j].extension),
            dist: path.resolve(__dirname, dist.concat([dirs[i].name]).join('/') + '/' + dirs[i].children[j].name.replace(/^\d+-/, '') + '.html'),
          });
        }
      }

      menus.push({
        text: dirs[i].name.replace(/^\d+-/, ''),
        kids: kids,
      });
    }
  }

  return {
    menus: menus,
    files: files
  };
}

function writeFile(dist, contents, cb) {
  mkdirp(path.dirname(dist), function (err) {
    if (err) return cb(err);

    fs.writeFile(dist, contents, cb);
  });
}

function cover(src, dist) {
  fs.readFile(src, 'utf8', function(err, data) {
    if(err)
      return console.log(err);

    const html = converter.makeHtml(data);
    // const metadata = converter.getMetadata();
    // console.error(metadata);

    writeFile(dist, html, function(err) {
      if(err)
        return console.log(err);

      console.log("The file was saved!");
    });
  });
}

mapDir(path.resolve(__dirname, 'mds'))
.then(function(currentDirMap) {
  var data = rec(currentDirMap, ['mds'], ['dist']);
  
  for (var i = 0; i < data.files.length; i++) {
    cover(data.files[i].src, data.files[i].dist);
  }
  

  // var p = path.resolve(__dirname, 'mds/' + currentDirMap[1].name + '/' + currentDirMap[1].children[0].name + currentDirMap[1].children[0].extension);


});