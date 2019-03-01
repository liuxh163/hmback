const pinyin = require('node-pinyin')
function hmpinyin(str){
    return pinyin(str).join('');
}
export default hmpinyin