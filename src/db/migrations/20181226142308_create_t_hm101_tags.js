// 标签信息表，用户服务人员和产品标签
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
		knex.schema.dropTableIfExists('t_hm101_tags');
    return knex.schema.createTable('t_hm101_tags', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //标签对象 01-产品  02-服务人员
        table.string('target', 2);
        //标签对象id
        table.integer('targetId', 11);
        //标签名称
        table.string('name', 20);
        //标签人
        table.integer('tagerId', 11);

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
        return knex.schema.dropTableIfExists('t_hm101_tags')
    }
};
