// 产品运营活动表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
		knex.schema.dropTableIfExists('t_hm101_product_operations');
    return knex.schema.createTable('t_hm101_product_operations', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //运营目标类型
        table.string('target', 2).defaultTo('01').comment('运营目标类型，非空，码表-MBZLBM，默认01-产品');
        //目标id
        table.integer('targetId', 11).comment('运营目标Id');
        //活动名称
        table.string('name', 20).comment('运营活动名称');
        //活动内容
        table.string('content', 200).comment('运营活动内容');
        //类型
        table.string('type', 2).comment('运营活动类型');
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
        return knex.schema.dropTableIfExists('t_hm101_product_operations')
    }
};
