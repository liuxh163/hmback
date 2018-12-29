if (!process.env.NODE_ENV) { throw new Error('NODE_ENV not set') };
require('dotenv').config();

const AliOss = require('ali-oss');
const UUID = require('uuid');
const Path= require('path');
const fs = require('fs');

const accessKeyId = process.env.ALI_ACCESSKEYID
const secretAccessKey = process.env.ALI_SECRETACCESSKEY
const region = process.env.FILE_REGION
const bucket = process.env.FILE_BUKET
/**
 * 现在region是外网，部署后最好换成内网
 */
let client = new AliOss({
    region: region,
    //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
    accessKeyId: accessKeyId,
    accessKeySecret: secretAccessKey,
    bucket: bucket

  });
class FileController{
    /**
     *  阿里的上传
     * 标准MULTIPARTDATA ,名字叫做filex，因为叫files的时候koa-body会变得很怪异
     *  如果需要，可以将多文件上传做并行，目前串行
     */
    async upload_alioss(ctx){
       try{
            let results = [];

            console.log(Object.prototype.toString(ctx.request.files.filex))
            if( Array.isArray(ctx.request.files.filex)){
                for(let i = 0 ; i < ctx.request.files.filex.length ; ++i ){
                    let file =  ctx.request.files.filex[i];
                    let result =await this.upload_alioss_file(file);
                    results.push(result);
                }
            }else{
                let file = ctx.request.files.filex;
                let result =await this.upload_alioss_file(file);
                results.push(result);
            }
            ctx.body = results
        }catch(error){
            console.log(error)
            ctx.throw(400, error)
        }

    }

    async upload_alioss_file(file){
        let result = {};
        try{
            let key = UUID.v1()+Path.extname(file.name);
            let stream = fs.createReadStream(file.path);
            let ali_result = await client.putStream(key, stream);
            result={
                name:file.name,
                code:0,
                message:"",
                fileID:ali_result.name,
                url:ali_result.url
            }
        }catch(e){
            //失败
            console.log("catch exception:"+e.message+" code:"+e.code)
            result = {
                name:file.name,
                code:1,
                message:e.message
            };
        }
        return result;
    }
}
export default FileController;
