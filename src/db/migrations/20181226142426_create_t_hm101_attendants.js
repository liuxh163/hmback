// 产品附加项信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_attendants');
    return knex.schema.createTable('t_hm101_attendants', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //附加项名称
        table.string('name', 20).notNullable().comment('体检附加项名称');
        //附加项简介
        table.string('desc',256).comment('体检附加项简介');
        //附加项金额
        table.decimal('price', 8, 2).notNullable().comment('体检附加项金额');
        //附加项使用对象
        table.string('gender', 2).comment('体检附加项适用对象性别，码表类别-XBBM');
        //附加项分类
        table.string('type', 4).comment('体检附加项类型，暂留，目前为空');
        //附加项状态 01-启用，02-停用
        table.string('status', 2).notNullable().defaultTo('01').comment('体检附加项状态，非空，默认01启用，码表类别-ZTBM');

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
        return knex.schema.dropTableIfExists('t_hm101_attendants')
    }
};
