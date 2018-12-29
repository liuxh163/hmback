// 订单分期信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_order_periods');
    return knex.schema.createTable('t_hm101_order_periods', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //订单编号
        table.string('orderNumber', 20).notNullable().unique();
        //金融产品编号
        table.integer('loanId', 11).notNullable();
        //金融产品名称
        table.string('name',20);
        //贷款总金额
        table.decimal('price', 8, 2).notNullable();
        //贷款分期数
        table.integer('periods', 3).notNullable().defaultTo(6);
        //订单状态 01-启用分期，02-停用分期
        table.string('status', 2).notNullable().defaultTo('01');

        // 记录操作人id
        table.string('operator').notNullable();
        // 记录操作标志
        table.string('operateFlag').defaultTo('A')
            .notNullable();
        // 记录创建时间和更新时间
        table.dateTime('updatedAt')
            .notNullable();
        table.timestamp('createdAt')
            .notNullable()
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
};

exports.down = function(knex, Promise) {
    // 生产环境下不做表删除操作
    if (process.env.NODE_ENV !== 'production') {
        return knex.schema.dropTableIfExists('t_hm101_order_periods')
    }
};
