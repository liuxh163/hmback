// H5内容信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_htmls', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //h5内容描述
        table.string('desc', 20);
        //h5内容
        table.text('content', 'medium');

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
        return knex.schema.dropTableIfExists('t_hm101_htmls')
    }
};
