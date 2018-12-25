const fs = require('fs');
const process = require('child_process');

function walkFile(pathResolve, mime){
	console.log(pathResolve);
  let files = fs.readdirSync( pathResolve )
  let fileList = {}
	let content =
				fs.readFileSync(pathResolve+'/header.md', 'utf8');

  for( let [ i, item] of files.entries() ) {
    let itemArr = item.split('\.')
  	let itemMime = ( itemArr.length > 1 ) ? itemArr[ itemArr.length - 1 ] : 'undefined';
  	let itemName = ( itemArr.length > 1 ) ? itemArr[0] : 'undefined';

  	//非header的所有md文件
    if( mime === itemMime && "header" != itemName) {
    	content = content+'\n'+fs.readFileSync(pathResolve+'/'+item, 'utf8');
    };
	};
  return content
}

let targetpath = __dirname + "/inters";
let interfaces = walkFile(targetpath, "md");
fs.writeFileSync(__dirname+'/interfaces.md',interfaces);

process.exec('aglio -i interfaces.md -o interfaces.html',
	function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error: ' + error);
        }
});

