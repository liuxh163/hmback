// 订单人员信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_order_peoples', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //订单编号
        table.string('number', 20).notNullable().unique();
        //订单人员姓名
        table.string('name',20).notNullable();
        //人员身份证
        table.integer('idNumber', 20).notNullable();
        //人员联系电话
        table.string('telephone', 16).notNullable();
        //人员目的 01-体检，02-随行
        table.string('status', 2).notNullable().defaultTo('02');

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
        return knex.schema.dropTableIfExists('t_hm101_order_peoples')
    }
};
