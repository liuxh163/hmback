// 订单信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_orders', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //订单编号
        table.string('number', 20).notNullable().unique();
        //订单类型 01-产品，02-影像，03-翻译
        table.string('target',2).notNullable();
        //订单对象编号
        table.integer('targetId', 11);
        //订单金额
        table.decimal('price', 8, 2).notNullable();
        //已付金额
        table.decimal('payedMoney', 8, 2).notNullable().defaultTo(0.00);
        //订单用户
        table.integer('buyerId', 11);
        //订单联系人姓名，订单生成时由订单用户带出，可修改
        table.string('contact',2).notNullable();
        //订单联系人电话，订单生成时由订单用户带出，可修改
        table.string('telephone',2).notNullable();
        //订单状态 01-未支付，02-定金已付，03-全额已付，04-取消，05-过期，06-申请退款，07-退款中，08-已退款
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
        return knex.schema.dropTableIfExists('t_hm101_orders')
    }
};
