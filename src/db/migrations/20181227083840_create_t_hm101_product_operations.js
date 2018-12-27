// 产品运营活动表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_product_operations', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //标签对象 01-产品
        table.string('target', 2).defaultTo('01');
        //标签对象id
        table.integer('targetId', 11);
        //活动名称
        table.string('name', 20);
        //活动内容
        table.string('content', 200);
        //活动变量名，内容中的{$变量}
        table.string('var1Name', 20);
        //活动变量值，用于替换内容中的{$变量}
        table.decimal('var1Value', 8, 2);
        //活动变量名，内容中的{$变量}
        table.string('var2Name', 20);
        //活动变量值，用于替换内容中的{$变量}
        table.decimal('var2Value', 8, 2);
        //活动起始时间
        table.dateTime('startTime', 20);
        //活动结束时间
        table.dateTime('endTime', 8, 2);

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
        return knex.schema.dropTableIfExists('t_hm101_product_operations')
    }
};
