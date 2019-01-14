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
        table.integer('topicId', 11).comment('帖子所属话题Id');
        //帖子标题
        table.string('title', 32).comment('帖子标题');
        //帖子内容
        table.string('content', 512).comment('帖子文字内容');
        //帖子内容
        table.string('picIds', 128).comment('帖子图片集id，逗号分隔图片文件Id');
        //发帖人
        table.integer('posterId', 11).comment('发帖人Id');
        //浏览次数
        table.integer('viewNum', 8).notNullable().defaultTo(0).comment('帖子浏览次数，非空，默认0');
        //发帖位置
        table.string('location', 20).comment('发帖时的位置');

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
        return knex.schema.dropTableIfExists('t_hm101_posts')
    }
};
