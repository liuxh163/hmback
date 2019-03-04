const db = require('../db/db');
const G_TABLE_NAME = "t_hm101_appupgrade";
class Update{
    constructor(data){
        this.id = data.id
        this.app_path = data.app_path
        this.app_name = data.app_name
        this.app_package = data.app_package
        this.version_name = data.version_name
        this.app_version = data.app_version
        this.apptype = data.apptype
        this.isforceup = data.isforceup
        this.isabtest = data.isabtest
        this.update_introduce = data.update_introduce
        this.operator = data.operator
        this.operateFlag = data.operateFlag
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt

    }
    static async getNewest(app_package,app_version){
        let [result] = db(G_TABLE_NAME).select('*').
            where({app_package:app_package}).
            where('app_version','>',app_version).
            orderBy('app_version','desc').offset(0).limit(1);
        if(result) return new Update(result);
        return null;
    }
}

export default Update