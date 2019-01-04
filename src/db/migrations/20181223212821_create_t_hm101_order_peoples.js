// 订单人员信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_order_peoples');
    return knex.schema.createTable('t_hm101_order_peoples', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //订单编号
        table.string('orderNumber', 20).notNullable().unique();

        //中文姓
        table.string('firstName',20).notNullable();
        //中文名
        table.integer('lastName', 20).notNullable();
        //拼音姓
        table.string('firstPiyin',20).notNullable();
        //拼音名
        table.string('lastPiyin', 20).notNullable();
        //护照号
        table.integer('passport', 20).notNullable();
        //出生日期
        table.string('birthday', 10).notNullable();
        //证件期限
        table.string('passExpir', 10).notNullable();
        //人员目的 01-体检，02-随行
        table.string('objective', 2).notNullable().defaultTo('02');

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
        return knex.schema.dropTableIfExists('t_hm101_order_peoples')
    }
};
