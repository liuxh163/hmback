// 金融贷款信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_loans');
    return knex.schema.createTable('t_hm101_loans', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //金融贷款名称
        table.string('name', 20).notNullable();
        //金融贷款简介
        table.integer('introH5Id',11);
        //贷款利率
        table.decimal('profits', 8, 4).notNullable();
        //分期数
        table.integer('periods', 2).notNullable().defaultTo(6);
        //贷款启停用状态 01-启用  02-停用
        table.string('status', 2).notNullable().defaultTo('01');
        //贷款政策介绍
        table.integer('policyH5Id', 11);
        //总额度
        table.decimal('limit', 9, 2);

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
        return knex.schema.dropTableIfExists('t_hm101_loans')
    }
};
