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

 Date: 01/06/2019 23:43:54 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `t_hm101_attendants`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_attendants`;
CREATE TABLE `t_hm101_attendants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '体检附加项名称',
  `desc` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '体检附加项简介',
  `price` decimal(8,2) NOT NULL COMMENT '体检附加项金额',
  `gender` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '体检附加项适用对象性别，码表类别-XBBM',
  `type` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '体检附加项类型，暂留，目前为空',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '体检附加项状态，非空，默认01启用，码表类别-ZTBM',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_carousels`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_carousels`;
CREATE TABLE `t_hm101_carousels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图位置，码表-LBWZBM',
  `productId` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图如果属于具体产品，此字段为产品Id',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图名称',
  `desc` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图描述',
  `picFileId` varchar(96) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图图片Id',
  `linkType` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '轮播图点击链接类型',
  `linkId` int(11) DEFAULT NULL COMMENT '轮播图点击链接目标Id',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '轮播启用状态，非空，码表-ZTBM，默认02，停用',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_channels`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_channels`;
CREATE TABLE `t_hm101_channels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '渠道商名称',
  `desc` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '渠道商简介',
  `channelNum` int(6) DEFAULT NULL COMMENT '渠道商系统编号',
  `contact` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '渠道商联系人',
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '渠道商联系人电话',
  `bizCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '企业代码，唯一',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '渠道状态，非空，码表-ZTBM，默认01，启用',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_channels_bizcode_unique` (`bizCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Records of `t_hm101_codes`
-- ----------------------------
BEGIN;
INSERT INTO `t_hm101_codes` VALUES ('1', null, 'GJBM', '国家编码', '01', '日本', '0', '1', '01', '1', 'A', null, '2019-01-04 15:13:35'), ('2', null, 'GJBM', '国家编码', '02', '韩国', '0', '2', '01', '1', 'A', null, '2019-01-04 15:13:53'), ('3', null, 'GJBM', '国家编码', '03', '泰国', '0', '3', '01', '1', 'A', null, '2019-01-04 15:14:50'), ('4', null, 'MBZLBM', '目标种类编码', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:16:36'), ('5', null, 'MBZLBM', '目标种类编码', '02', '帖子', '0', '1', '01', '1', 'A', null, '2019-01-04 15:16:50'), ('6', null, 'MBZLBM', '目标种类编码', '03', '翻译人员', '0', '1', '01', '1', 'A', null, '2019-01-04 15:17:44'), ('7', null, 'MBZLBM', '目标种类编码', '04', '地接人员', '0', '1', '01', '1', 'A', null, '2019-01-04 15:21:11'), ('8', null, 'MBZLBM', '目标种类编码', '05', '回复', '0', '1', '01', '1', 'A', null, '2019-01-04 15:26:32'), ('9', null, 'DDLXBM', '订单类型', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:29:46'), ('10', null, 'DDLXBM', '订单类型', '02', '影像', '0', '2', '01', '1', 'A', null, '2019-01-04 15:30:49'), ('11', null, 'DDLXBM', '订单类型', '03', '翻译人员', '0', '3', '01', '1', 'A', null, '2019-01-04 15:33:17'), ('12', null, 'DDLXBM', '订单类型', '04', '地接人员', '0', '4', '01', '1', 'A', null, '2019-01-04 15:33:52'), ('13', null, 'XBBM', '性别编码', '01', '男', '0', '1', '01', '1', 'A', null, '2019-01-04 15:36:22'), ('14', null, 'XBBM', '性别编码', '02', '女', '0', '2', '01', '1', 'A', null, '2019-01-04 15:37:03'), ('15', null, 'ZTBM', '状态编码', '01', '启用', '0', '1', '01', '1', 'A', null, '2019-01-04 15:37:34'), ('16', null, 'ZTBM', '状态编码', '02', '停用', '0', '2', '01', '1', 'A', null, '2019-01-04 15:38:16'), ('17', null, 'YHLXBM', '用户类型编码', '01', '普通用户', '0', '1', '01', '1', 'A', null, '2019-01-04 15:39:12'), ('18', null, 'YHLXBM', '用户类型编码', '02', '管理员', '0', '1', '01', '1', 'A', null, '2019-01-04 15:39:41'), ('19', null, 'LBWZBM', '轮播位置编码', '01', '首页', '0', '1', '01', '1', 'A', null, '2019-01-04 15:40:41'), ('20', null, 'LBWZBM', '轮播位置编码', '02', '日本首页', '0', '2', '01', '1', 'A', null, '2019-01-04 15:40:52'), ('21', null, 'LBWZBM', '轮播位置编码', '03', '韩国首页', '0', '3', '01', '1', 'A', null, '2019-01-04 15:41:54'), ('22', null, 'LBWZBM', '轮播位置编码', '04', '泰国首页', '0', '4', '01', '1', 'A', null, '2019-01-04 15:42:37'), ('23', null, 'LBWZBM', '轮播位置编码', '05', '产品首页', '0', '5', '01', '1', 'A', null, '2019-01-04 15:43:12'), ('24', null, 'LJLXBM', '链接类型编码', '01', '产品', '0', '1', '01', '1', 'A', null, '2019-01-04 15:44:00'), ('25', null, 'LJLXBM', '链接类型编码', '02', '页面', '0', '2', '01', '1', 'A', null, '2019-01-04 15:45:13'), ('26', null, 'FWLXBM', '服务类型编码', '01', '文字翻译', '0', '1', '01', '1', 'A', null, '2019-01-04 15:48:37'), ('27', null, 'FWLXBM', '服务类型编码', '02', '陪同翻译', '0', '1', '01', '1', 'A', null, '2019-01-04 15:48:42'), ('28', null, 'FWLXBM', '服务类型编码', '03', '地面接待', '0', '1', '01', '1', 'A', null, '2019-01-04 15:49:56'), ('29', null, 'CXMDBM', '出行目的编码', '01', '体检', '0', '1', '01', '1', 'A', null, '2019-01-04 15:53:07'), ('30', null, 'CXMDBM', '出行目的编码', '02', '陪同', '0', '1', '01', '1', 'A', null, '2019-01-04 15:54:06');
COMMIT;

-- ----------------------------
--  Table structure for `t_hm101_comments`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_comments`;
CREATE TABLE `t_hm101_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '评论目标类型，码表-MBZLBM',
  `targetId` int(11) DEFAULT NULL COMMENT '评论目标Id',
  `contentH5Id` int(11) DEFAULT NULL COMMENT '评论内容h5表记录Id',
  `commenterId` int(11) DEFAULT NULL COMMENT '评论人Id',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_files`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_files`;
CREATE TABLE `t_hm101_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文件名称，上传时的物理名称',
  `type` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文件存储类型，去文件后缀名填充',
  `path` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '文件存储路径',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_htmls`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_htmls`;
CREATE TABLE `t_hm101_htmls` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'h5内容描述',
  `content` mediumtext COLLATE utf8mb4_unicode_ci COMMENT 'h5片段内容',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_loans`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_loans`;
CREATE TABLE `t_hm101_loans` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `introH5Id` int(11) DEFAULT NULL,
  `profits` decimal(8,4) NOT NULL,
  `periods` int(2) NOT NULL DEFAULT '6',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `policyH5Id` int(11) DEFAULT NULL,
  `limit` decimal(9,2) DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_order_attentants`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_order_attentants`;
CREATE TABLE `t_hm101_order_attentants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` int(11) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `quantity` int(4) NOT NULL DEFAULT '1',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_attentants_ordernumber_unique` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_order_peoples`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_order_peoples`;
CREATE TABLE `t_hm101_order_peoples` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstName` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastName` int(20) NOT NULL,
  `firstPiyin` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastPiyin` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passport` int(20) NOT NULL,
  `birthday` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `passExpir` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `objective` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_peoples_ordernumber_unique` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_order_periods`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_order_periods`;
CREATE TABLE `t_hm101_order_periods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `orderNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loanId` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `periods` int(3) NOT NULL DEFAULT '6',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_periods_ordernumber_unique` (`orderNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_orders`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_orders`;
CREATE TABLE `t_hm101_orders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` int(11) DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `payedMoney` decimal(8,2) NOT NULL DEFAULT '0.00',
  `buyerId` int(11) DEFAULT NULL,
  `contact` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_orders_number_unique` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_posts`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_posts`;
CREATE TABLE `t_hm101_posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` int(11) DEFAULT NULL COMMENT '帖子所属话题Id',
  `title` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '帖子标题',
  `contentH5Id` int(11) DEFAULT NULL COMMENT '帖子内容Id',
  `posterId` int(11) DEFAULT NULL COMMENT '发帖人Id',
  `viewNum` int(8) NOT NULL DEFAULT '0' COMMENT '帖子浏览次数，非空，默认0',
  `location` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '发帖时的位置',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_product_experts`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_product_experts`;
CREATE TABLE `t_hm101_product_experts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(11) DEFAULT NULL COMMENT '所属产品Id',
  `picFileId` varchar(96) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品专家图片表位置',
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品专家描述',
  `thumbs` int(8) NOT NULL DEFAULT '0' COMMENT '产品专家点赞数量，非空，默认0',
  `ranks` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品专家星级，购买产品后评论',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品专家名称',
  `nation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品专家所属国籍',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_product_operations`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_product_operations`;
CREATE TABLE `t_hm101_product_operations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '01' COMMENT '运营目标类型，非空，码表-MBZLBM，默认01-产品',
  `targetId` int(11) DEFAULT NULL COMMENT '运营目标Id',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '运营活动名称',
  `content` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '运营活动内容',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_products`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_products`;
CREATE TABLE `t_hm101_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品描述内容',
  `nation` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '产品所属国籍，码表-GJBM',
  `viewNum` int(8) NOT NULL DEFAULT '0' COMMENT '浏览次数，非空，默认0',
  `featureH5Id` int(11) DEFAULT NULL COMMENT '产品亮点内容介绍h5内容Id',
  `detailH5Id` int(11) DEFAULT NULL COMMENT '产品详细内容介绍h5内容Id',
  `routineH5Id` int(11) DEFAULT NULL COMMENT '产品行程介绍h5内容Id',
  `feeH5Id` int(11) DEFAULT NULL COMMENT '产品费用内容介绍h5内容Id',
  `noticeH5Id` int(11) DEFAULT NULL COMMENT '产品须知内容介绍h5内容Id',
  `hospitalH5Id` int(11) DEFAULT NULL COMMENT '产品医院内容介绍h5内容Id',
  `itemH5Id` int(11) DEFAULT NULL COMMENT '产品基础项内容介绍h5内容Id',
  `adultPrice` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '产品男性体检单价',
  `womenPrice` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '产品女性体检单价',
  `companyPrice` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '产品随行成人单价',
  `childPrice` decimal(8,2) NOT NULL DEFAULT '0.00' COMMENT '产品随行儿童单价',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02' COMMENT '产品状态，非空，码表-ZTBM，默认02，停用',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_servants`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_servants`;
CREATE TABLE `t_hm101_servants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '服务人员名称',
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '服务人员介绍',
  `picFileId` varchar(96) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '服务人员图片Id',
  `type` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '人员类型，码表-FWLXBM',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '人员状态，非空，码表-ZTBM，默认01，启用',
  `nation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '服务人员国籍，码表-GJBM',
  `introH5Id` int(11) DEFAULT NULL COMMENT '服务人员介绍h5内容Id',
  `literPrice` decimal(8,2) DEFAULT NULL COMMENT '文字翻译单价，含单位',
  `followPrice` decimal(8,2) DEFAULT NULL COMMENT '陪同翻译单价，含单位',
  `recepPrice` decimal(8,2) DEFAULT NULL COMMENT '地接服务单价，含单位0',
  `viewNum` int(8) NOT NULL DEFAULT '0' COMMENT '服务人员介绍浏览次数，非空，默认0',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_tags`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_tags`;
CREATE TABLE `t_hm101_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签对象类型，码表-MBZLBM',
  `targetId` int(11) DEFAULT NULL COMMENT '标签对象Id',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '标签名称，主要用于显示',
  `tagerId` int(11) DEFAULT NULL COMMENT '打标签人Id',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_thumbs`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_thumbs`;
CREATE TABLE `t_hm101_thumbs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '点赞目标类型，码表-MBZLBM',
  `targetId` int(11) DEFAULT NULL COMMENT '点赞目标Id',
  `likerId` int(11) DEFAULT NULL COMMENT '点赞用户Id',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '点赞状态，非空，码表-ZTBM，默认01，启用',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_topics`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_topics`;
CREATE TABLE `t_hm101_topics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '话题名称，用于显示',
  `desc` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '话题描述内容',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02' COMMENT '话题状态，非空，码表-ZTBM，默认02，停用',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_users`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_users`;
CREATE TABLE `t_hm101_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `loginId` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户系统标识，唯一，应用内显示',
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户手机号，用于登录，唯一',
  `iconPath` varchar(96) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户头像文件Id',
  `openId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户微信登录Id',
  `email` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户邮箱，唯一',
  `slogan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户口号标语',
  `realName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户真实姓名，用于申请金融贷款',
  `idNumber` varchar(19) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户身份证号，用于申请金融贷款',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户密码，用于登录后台管理',
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '轮播启用状态，非空，码表-ZTBM，默认01，起用',
  `userName` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户名，用于应用内显示',
  `source` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户来源渠道编码，取自渠道表',
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01' COMMENT '用户类型 码表-YHLXBM',
  `birthday` date DEFAULT NULL COMMENT '用户生日',
  `gender` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户性别 码表-XBBM',
  `loginCount` int(11) DEFAULT '0' COMMENT '用户登录次数',
  `ipAddress` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户最后一次登录IP地址',
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '用户邮寄地址',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '表记录操作人Id',
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A' COMMENT '记录操作标识，非空，默认A，A-新增，U-更新，D-删除',
  `updatedAt` datetime DEFAULT NULL COMMENT '记录更新时间，创建时与创建时间相同，用作排序',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '记录创建时间，数据库自动默认当前时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_users_loginid_unique` (`loginId`),
  UNIQUE KEY `t_hm101_users_telephone_unique` (`telephone`),
  UNIQUE KEY `t_hm101_users_openid_unique` (`openId`),
  UNIQUE KEY `t_hm101_users_email_unique` (`email`),
  UNIQUE KEY `t_hm101_users_idnumber_unique` (`idNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
