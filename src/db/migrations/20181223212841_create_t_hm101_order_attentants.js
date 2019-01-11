// 订单附加项信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_order_attentants');
    return knex.schema.createTable('t_hm101_order_attentants', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //订单编号
        table.integer('orderNumber', 11).notNullable();
        //附加项编号
        table.integer('targetId',11).notNullable();
        //附加项金额
        table.decimal('price', 8, 2).notNullable();
        //附加项数量
        table.integer('quantity', 4).notNullable().defaultTo(1);
        //附加项名称
        table.string('name', 20).notNullable();
        //附加项订购人员
        table.integer('ownerId', 11).notNullable();

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
        return knex.schema.dropTableIfExists('t_hm101_order_attentantss')
    }
};
