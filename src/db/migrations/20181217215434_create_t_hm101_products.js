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
        table.string('desc', 128);
        //产品浏览次数
        table.integer('views', 8).notNullable().defaultTo(0);

        //亮点页面Id
        table.integer('featureH5Id', 11);
        //详情页面Id
        table.integer('detailH5Id', 11);
        //行程页面id
        table.integer('routinH5Id', 11);
        //费用页面Id
        table.integer('feeH5Id', 11);
        //须知页面Id
        table.integer('noticeH5Id', 11);
        //医院页面id
        table.integer('hospitalH5Id', 11);
        //基础项页面Id
        table.integer('priceH5Id', 11);

        //产品成人单价
        table.decimal('adultPrice', 8, 2).notNullable();
        //产品随行单价
        table.decimal('companyPrice', 8, 2).notNullable();
        //产品儿童单价
        table.decimal('childPrice', 8, 2).notNullable();
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
