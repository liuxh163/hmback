// 订单信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_orders');
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
        return knex.schema.dropTableIfExists('t_hm101_orders')
    }
};
