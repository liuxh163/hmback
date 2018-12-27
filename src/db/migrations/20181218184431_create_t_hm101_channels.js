// 渠道信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_channels', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //渠道名称
        table.string('name', 20).notNullable();
        //渠道简介
        table.string('desc',256);
        //渠道编号
        table.integer('channelNum', 6).notNullable();
        //渠道联系人
        table.string('contact', 20).notNullable();
        //渠道联系人电话
        table.string('telephone', 16).notNullable();
        //渠道企业代码
        table.string('bizCode', 20).unique();

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
        return knex.schema.dropTableIfExists('t_hm101_loans')
    }
};
