// 服务人员信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_servants', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //服务人员姓名
        table.string('name', 20).notNullable();
        //服务人员简介
        table.string('introduction', 128);
        //服务人员图片位置
        table.string('picPath', 96).notNullable();
        //服务人员类型 01-翻译  02-地接
        table.string('type', 2).notNullable().defaultTo('01');
        //服务人员状态 01-启用  02-停用
        table.string('status', 2).notNullable().defaultTo('01');
        //服务人员国籍
        table.string('nation', 20);
        //服务内容 01-文字翻译，02-陪同翻译，03-文字翻译及陪同翻译，04-地面接待
        table.string('content', 2);

        // 记录操作人id
        table.string('operator').notNullable();
        // 记录操作标志
        table.string('operateFlag').defaultTo('A')
            .notNullable();
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
        return knex.schema.dropTableIfExists('t_hm101_servants')
    }
};
