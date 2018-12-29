// 论坛帖子信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_posts');
    return knex.schema.createTable('t_hm101_posts', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //话题Id
        table.integer('topicId', 11).notNullable();
        //帖子标题
        table.string('title', 64);
        //帖子内容
        table.integer('contentH5Id', 11).notNullable();
        //发帖人
        table.integer('posterId', 11).notNullable();
        //浏览次数
        table.integer('views', 8).notNullable().defaultTo(0);
        //发帖位置
        table.string('location', 20);

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
        return knex.schema.dropTableIfExists('t_hm101_posts')
    }
};
