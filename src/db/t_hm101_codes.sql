/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50552
 Source Host           : localhost
 Source Database       : hm101_development

 Target Server Type    : MySQL
 Target Server Version : 50552
 File Encoding         : utf-8

 Date: 01/15/2019 21:23:36 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `t_hm101_codes`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_codes`;
CREATE TABLE `t_hm101_codes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parentId` int(11) DEFAULT NULL,
  `codeClass` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classDesc` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `code` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `codeDesc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` int(2) DEFAULT NULL,
  `order` int(4) DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Records of `t_hm101_codes`
-- ----------------------------
BEGIN;
INSERT INTO `t_hm101_codes` VALUES ('1', null, 'GJBM', '国家编码', '01', '日本', '0', '1', '01', '1', 'A', null, '2019-01-04 15:13:35'), ('2', null, 'GJBM', '国家编码', '02', '韩国', '0', '2', '01', '1', 'A', null, '2019-01-04 15:13:53'), ('3', null, 'GJBM', '国家编码', '03', '泰国', '0', '3', '01', '1', 'A', null, '2019-01-04 15:14:50'), ('4', null, 'MBZLBM', '目标种类编码', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:16:36'), ('5', null, 'MBZLBM', '目标种类编码', '02', '帖子', '0', '1', '01', '1', 'A', null, '2019-01-04 15:16:50'), ('6', null, 'MBZLBM', '目标种类编码', '03', '服务人员', '0', '1', '01', '1', 'A', null, '2019-01-04 15:17:44'), ('8', null, 'MBZLBM', '目标种类编码', '05', '评论', '0', '1', '01', '1', 'A', null, '2019-01-04 15:26:32'), ('9', null, 'DDLXBM', '订单类型', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:29:46'), ('10', null, 'DDLXBM', '订单类型', '02', '影像', '0', '2', '01', '1', 'A', null, '2019-01-04 15:30:49'), ('11', null, 'DDLXBM', '订单类型', '03', '翻译人员', '0', '3', '01', '1', 'A', null, '2019-01-04 15:33:17'), ('12', null, 'DDLXBM', '订单类型', '04', '地接人员', '0', '4', '01', '1', 'A', null, '2019-01-04 15:33:52'), ('13', null, 'XBBM', '性别编码', '01', '男', '0', '1', '01', '1', 'A', null, '2019-01-04 15:36:22'), ('14', null, 'XBBM', '性别编码', '02', '女', '0', '2', '01', '1', 'A', null, '2019-01-04 15:37:03'), ('15', null, 'ZTBM', '状态编码', '01', '启用', '0', '1', '01', '1', 'A', null, '2019-01-04 15:37:34'), ('16', null, 'ZTBM', '状态编码', '02', '停用', '0', '2', '01', '1', 'A', null, '2019-01-04 15:38:16'), ('17', null, 'YHLXBM', '用户类型编码', '01', '普通用户', '0', '1', '01', '1', 'A', null, '2019-01-04 15:39:12'), ('18', null, 'YHLXBM', '用户类型编码', '02', '管理员', '0', '1', '01', '1', 'A', null, '2019-01-04 15:39:41'), ('19', null, 'LBWZBM', '轮播位置编码', '01', '首页', '0', '1', '01', '1', 'A', null, '2019-01-04 15:40:41'), ('20', null, 'LBWZBM', '轮播位置编码', '02', '日本首页', '0', '2', '01', '1', 'A', null, '2019-01-04 15:40:52'), ('21', null, 'LBWZBM', '轮播位置编码', '03', '韩国首页', '0', '3', '01', '1', 'A', null, '2019-01-04 15:41:54'), ('22', null, 'LBWZBM', '轮播位置编码', '04', '泰国首页', '0', '4', '01', '1', 'A', null, '2019-01-04 15:42:37'), ('23', null, 'LBWZBM', '轮播位置编码', '05', '产品首页', '0', '5', '01', '1', 'A', null, '2019-01-04 15:43:12'), ('24', null, 'LJLXBM', '链接类型编码', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:44:00'), ('25', null, 'LJLXBM', '链接类型编码', '02', '页面', '0', '2', '01', '1', 'A', null, '2019-01-04 15:45:13'), ('26', null, 'FWLXBM', '服务类型编码', '01', '文字翻译', '0', '1', '01', '1', 'A', null, '2019-01-04 15:48:37'), ('27', null, 'FWLXBM', '服务类型编码', '02', '陪同翻译', '0', '1', '01', '1', 'A', null, '2019-01-04 15:48:42'), ('28', null, 'FWLXBM', '服务类型编码', '03', '地面接待', '0', '1', '01', '1', 'A', null, '2019-01-04 15:49:56'), ('29', null, 'CXMDBM', '出行目的编码', '01', '体检', '0', '1', '01', '1', 'A', null, '2019-01-04 15:53:07'), ('30', null, 'CXMDBM', '出行目的编码', '02', '陪同', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('31', null, 'FWRYFLBM', '服务人员分类编码', '01', '推荐', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('32', null, 'FWRYFLBM', '服务人员分类编码', '02', '最热', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('33', null, 'FWRYFLBM', '服务人员分类编码', '03', '没有', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('34', null, 'FWRYSFSYBM', '服务人员是否首页', '01', '是', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('35', null, 'FWRYSFSYBM', '服务人员是否首页', '02', '否', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06'), ('36', null, 'YYLXBM', '运营类型编码', '01', '分期', '0', '1', '01', '1', 'A', null, '2019-01-14 19:22:51'), ('37', null, 'YYLXBM', '运营类型编码', '02', '出行卡', '0', '2', '01', '1', 'A', null, '2019-01-14 19:23:00'), ('38', null, 'CPBQLXBM', '产品标签类型编码', '01', '推荐', '0', '1', '01', '1', 'A', null, '2019-01-15 21:20:17'), ('39', null, 'CPBQLXBM', '产品标签类型编码', '02', '最热', '0', '2', '01', '1', 'A', null, '2019-01-15 21:21:39'), ('40', null, 'CPBQLXBM', '产品标签类型编码 ', '03', '普通', '0', '3', '01', '1', 'A', null, '2019-01-15 21:22:02');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
