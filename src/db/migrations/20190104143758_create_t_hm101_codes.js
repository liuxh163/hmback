// 代码表
if (!process.env.NODE_ENV) {
    throw new Error('NODE_ENV not set')
}
exports.up = function(knex, Promise) {
	knex.schema.dropTableIfExists('t_hm101_codes');
    return knex.schema.createTable('t_hm101_codes', function(table) {
        table.charset('utf8mb4')
        table.collate('utf8mb4_unicode_ci')
        //id主键
        table.increments('id').primary();
        //父代码Id
        table.integer('parentId', 11).comment('父代码Id');
        //类别编码
        table.string('codeClass', 32).comment('代码类别编码');
        //类别描述
        table.string('classDesc', 80).comment('代码类别描述');
        //代码编码
        table.string('code', 32).comment('代码编码');
        //代码描述
        table.string('codeDesc', 128).comment('代码描述');
        //代码级别
        table.integer('level', 2).comment('代码级别');
        //显示顺序
        table.integer('order', 4).comment('代码字段显示顺序');
        //代码状态
        table.string('status', 2).comment('代码状态，码表类别-ZTBM');

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
        return knex.schema.dropTableIfExists('t_hm101_codes')
    }
};
