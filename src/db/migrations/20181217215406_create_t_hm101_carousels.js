// 轮播图信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_carousels');
    return knex.schema.createTable('t_hm101_carousels', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //轮播图位置 01-首页，02-日本，03-韩国，04-泰国，05-具体产品
        table.string('location', 2).notNullable();
        //轮播图产品Id
        table.string('productId', 11);
        //轮播图名称
        table.string('name', 20);
        //轮播图描述
        table.string('desc', 64);
        //轮播图图片位置
        table.string('picPath', 96).notNullable();
        //链接目标类型 01-产品 02-静态页员
        table.string('target', 2);
        //链接目标Id
		table.string('targetId');
        //启停用状态 01-启用  02-停用
        table.string('status',2).notNullable().defaultTo('01');

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
        return knex.schema.dropTableIfExists('t_hm101_carousels')
    }
};
