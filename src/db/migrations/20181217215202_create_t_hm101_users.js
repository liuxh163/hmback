// 用户信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_users', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        // 用户编号
        table.string('loginId', 9).notNullable().unique();
        // 用户手机号
        table.string('telephone', 16).unique();
        //用户头像
        table.string('iconPath', 96);
        // 用户微信OpenId
        table.string('openId', 32).unique();
        // 用户邮件
        table.string('email', 64).unique();
        // 用户个性签名
        table.string('slogan');
        // 用户实名
        table.string('realName');
        // 用户身份证号码
        table.string('idNumber',19).unique();
        // 用户密码
		table.string('password').notNullable();
        // 用户状态 01-启用  02-停用
        table.string('status').notNullable().defaultTo("01");
        // 用户名
        table.string('userName', 64);
        // 用户来源渠道编码
        table.string('source', 10);
        // 用户类型 01-普通用户 02-管理员
        table.string('type').notNullable()
        // 记录操作标志
        table.string('operateFlag').defaultTo('A')
            .notNullable();
        // 记录操作人id
        table.string('operator').notNullable();
        // 用户登录次数
        table.integer('loginCount').defaultTo(0);
        // 用户最后一次登录IP地址
        table.string('ipAddress', 32);
        // 用户邮寄地址
        table.string('address', 100);
        // 用户记录创建时间和更新时间
        table
            .dateTime('updatedAt')
            .notNullable();
        table
            .timestamp('createdAt')
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
