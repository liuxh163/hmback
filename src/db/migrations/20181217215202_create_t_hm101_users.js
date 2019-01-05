// 用户信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_users');
    return knex.schema.createTable('t_hm101_users', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        // 用户编号
        table.string('loginId', 9).notNullable().unique().comment('用户系统标识，唯一，应用内显示');
        // 用户手机号
        table.string('telephone', 16).unique().comment('用户手机号，用于登录，唯一');
        //用户头像
        table.string('iconPath', 96).comment('用户头像文件Id');
        // 用户微信OpenId
        table.string('openId', 32).unique().comment('用户微信登录Id');
        // 用户邮件
        table.string('email', 64).unique().comment('用户邮箱，唯一');
        // 用户个性签名
        table.string('slogan').comment('用户口号标语');
        // 用户实名
        table.string('realName').comment('用户真实姓名，用于申请金融贷款');
        // 用户身份证号码
        table.string('idNumber',19).unique().comment('用户身份证号，用于申请金融贷款');
        // 用户密码
		table.string('password').comment('用户密码，用于登录后台管理');
        // 用户状态 01-启用  02-停用
        table.string('status').notNullable().defaultTo("01").comment('轮播启用状态，非空，码表-ZTBM，默认01，起用');
        // 用户名
        table.string('userName', 64).comment('用户名，用于应用内显示');
        // 用户来源渠道编码
        table.string('source', 10).comment('用户来源渠道编码，取自渠道表');
        // 用户类型
        table.string('type').notNullable().defaultTo('01').comment('用户类型 码表-YHLXBM');
        // 用户登录次数
        table.integer('loginCount').defaultTo(0).comment('用户登录次数');
        // 用户最后一次登录IP地址
        table.string('ipAddress', 32).comment('用户最后一次登录IP地址');
        // 用户邮寄地址
        table.string('address', 100).comment('用户邮寄地址');

        // 记录操作人id
        table.string('operator').comment('表记录操作人Id');
        // 记录操作标志
        table.string('operateFlag').defaultTo('A').comment('记录操作标识，非空，默认A，A-新增，U-更新，D-删除')
            .notNullable();
        // 记录创建时间和更新时间
        table.dateTime('updatedAt').comment('记录更新时间，创建时与创建时间相同，用作排序');
        table.timestamp('createdAt').comment('记录创建时间，数据库自动默认当前时间')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex, Promise) {
    // 生产环境下不做表删除操作
    if (process.env.NODE_ENV !== 'production') {
        return knex.schema.dropTableIfExists('t_hm101_users')
    }
};
