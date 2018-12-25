// 产品信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    return knex.schema.createTable('t_hm101_products', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //页首轮播图id
        table.integer('carouselId', 11).notNullable();
        //产品描述
        table.string('decription', 128);
        //产品浏览次数
        table.integer('views', 8).notNullable().defaultTo(0);
        //医院简介H5页面内容Id
        table.integer('hospitalH5Id', 11);
        //行程轮播图id
        table.integer('daysCarouId', 11).notNullable();
        //产品服务H5页面内容Id
        table.integer('serviceH5Id', 11);
        //体检详情H5页面内容Id
        table.integer('examH5Id', 11);
        //启停用状态 01-启用  02-停用
        table.string('status',2).notNullable().defaultTo('01');

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
        return knex.schema.dropTableIfExists('t_hm101_products')
    }
};
