// 产品附加项信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_attendants');
    return knex.schema.createTable('t_hm101_attendants', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //附加项名称
        table.string('name', 20).notNullable();
        //附加项简介
        table.string('desc',256);
        //附加项金额
        table.decimal('price', 8, 2).notNullable();
        //附加项使用对象 01-成人男 02-成人女 03-儿童男  04-儿童女
        table.string('target', 2);
        //附加项分类
        table.string('type', 4);
        //附加项状态 01-启用，02-停用
        table.string('status', 2).notNullable().defaultTo('01');

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
        return knex.schema.dropTableIfExists('t_hm101_attendants')
    }
};
