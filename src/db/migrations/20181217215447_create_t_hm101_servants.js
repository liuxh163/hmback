// 服务人员信息表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
    knex.schema.dropTableIfExists('t_hm101_servants');
    return knex.schema.createTable('t_hm101_servants', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //服务人员姓名
        table.string('name', 20).notNullable();
        //服务人员简介
        table.string('desc', 128);
        //服务人员图片位置
        table.string('picPath', 96).notNullable();
        //服务人员类型 01-翻译  02-地接
        table.string('type', 2).notNullable().defaultTo('01');
        //服务人员状态 01-启用  02-停用
        table.string('status', 2).notNullable().defaultTo('01');
        //服务人员国籍
        table.string('nation', 20);
        //服务内容 01-文字翻译，02-陪同翻译，03-文字翻译及陪同翻译，04-地面接待
        table.string('service', 2);
        //服务人员介绍页面内容
        table.integer('introH5Id', 11).notNullable();
        //文翻单价
        table.decimal('literPrice', 8, 2);
        //文翻单价
        table.decimal('followPrice', 8, 2);
        //地接价格
        table.decimal('recepPrice', 8, 2);
        //浏览次数
        table.integer('viewNum', 8).notNullable().defaultTo(0);

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
        return knex.schema.dropTableIfExists('t_hm101_servants')
    }
};
