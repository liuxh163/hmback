const region = process.env.FILE_REGION
const bucket = process.env.FILE_BUKET

const region_internal = process.env.FILE_REGION_INTERNAL
const path_prefix = 'http://'+bucket+'.'+region+'.aliyuncs.com/'

class OssFileUtil{
    static absPath(path){
        if(!path ) return path;
        if(path == '') return path;
        path = this.relPath(path);
        path = path_prefix+path;
        return path;
    }
    static relPath(path){
        return path.replace(path_prefix,'');;
    }
}




export { OssFileUtil }
