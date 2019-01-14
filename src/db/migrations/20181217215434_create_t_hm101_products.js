// 产品信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_products');
    return knex.schema.createTable('t_hm101_products', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //产品描述
        table.string('desc', 128).comment('产品描述内容');
        //产品所属国家
        table.string('nation', 2).comment('产品所属国籍，码表-GJBM');
        //产品浏览次数
        table.integer('viewNum', 8).notNullable().defaultTo(0).comment('浏览次数，非空，默认0');
        //产品所属国家
        table.string('coverId', 20).comment('产品列表封面图片Id，files表中id');
        //亮点页面Id
        table.integer('featureH5Id', 11).comment('产品亮点内容介绍h5内容Id');
        //详情页面Id
        table.integer('detailH5Id', 11).comment('产品详细内容介绍h5内容Id');
        //行程页面id
        table.integer('routineH5Id', 11).comment('产品行程介绍h5内容Id');
        //费用页面Id
        table.integer('feeH5Id', 11).comment('产品费用内容介绍h5内容Id');
        //须知页面Id
        table.integer('noticeH5Id', 11).comment('产品须知内容介绍h5内容Id');
        //医院页面id
        table.integer('hospitalH5Id', 11).comment('产品医院内容介绍h5内容Id');
        //基础项页面Id
        table.integer('itemH5Id', 11).comment('产品基础项内容介绍h5内容Id');

        //产品成人单价
        table.decimal('adultPrice', 8, 2).notNullable().defaultTo(0.00).comment('产品男性体检单价');
        //产品成人女性单价
        table.decimal('womenPrice', 8, 2).notNullable().defaultTo(0.00).comment('产品女性体检单价');
        //产品随行单价
        table.decimal('followPrice', 8, 2).notNullable().defaultTo(0.00).comment('产品随行成人单价');
        //产品儿童单价
        table.decimal('childPrice', 8, 2).notNullable().defaultTo(0.00).comment('产品随行儿童单价');
        //启停用状态 01-启用  02-停用
        table.string('status',2).notNullable().defaultTo('02').comment('产品状态，非空，码表-ZTBM，默认02，停用');

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
        return knex.schema.dropTableIfExists('t_hm101_products')
    }
};
