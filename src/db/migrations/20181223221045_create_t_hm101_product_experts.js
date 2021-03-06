// 产品专家信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_product_experts');
    return knex.schema.createTable('t_hm101_product_experts', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //产品Id
        table.integer('productId', 11).comment('所属产品Id');
        //专家图片位置
        table.string('picFileId', 96).comment('产品专家图片表位置');
        //专家描述
        table.string('desc', 128).comment('产品专家描述');
        //专家点赞数
        table.integer('thumbs', 8).notNullable().defaultTo(0).comment('产品专家点赞数量，非空，默认0');
        //专家星级
        table.string('ranks', 3).comment('产品专家星级，购买产品后评论');
        //专家姓名
        table.string('name', 20).comment('产品专家名称');
        //专家国籍
        table.string('nation', 20).comment('产品专家所属国籍');

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
        return knex.schema.dropTableIfExists('t_hm101_product_experts')
    }
};
