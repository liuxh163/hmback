// 评论信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_comments', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //话题Id
        table.integer('topicId', 11).notNullable();
        //评论队形类型 01-产品，02-服务人员，03-帖子，04-回复
        table.string('targer', 2);
        //评论对象编号
        table.integer('targetId', 11).notNullable();
        //评论内容
        table.integer('contentH5Id', 11).notNullable();
        //评论人
        table.integer('commenterId', 11).notNullable();

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
        return knex.schema.dropTableIfExists('t_hm101_comments')
    }
};