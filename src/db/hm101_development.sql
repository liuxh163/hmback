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

 Date: 01/02/2019 17:04:55 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `knex_migrations`
-- ----------------------------
DROP TABLE IF EXISTS `knex_migrations`;
CREATE TABLE `knex_migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `batch` int(11) DEFAULT NULL,
  `migration_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `knex_migrations_lock`
-- ----------------------------
DROP TABLE IF EXISTS `knex_migrations_lock`;
CREATE TABLE `knex_migrations_lock` (
  `is_locked` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_attendants`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_attendants`;
CREATE TABLE `t_hm101_attendants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(4) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_carousels`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_carousels`;
CREATE TABLE `t_hm101_carousels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `productId` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desc` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picPath` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetId` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_channels`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_channels`;
CREATE TABLE `t_hm101_channels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channelNum` int(6) NOT NULL,
  `contact` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bizCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_channels_bizcode_unique` (`bizCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_comments`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_comments`;
CREATE TABLE `t_hm101_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetId` int(11) NOT NULL,
  `contentH5Id` int(11) NOT NULL,
  `commenterId` int(11) NOT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_files`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_files`;
CREATE TABLE `t_hm101_files` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_htmls`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_htmls`;
CREATE TABLE `t_hm101_htmls` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` mediumtext COLLATE utf8mb4_unicode_ci,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
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
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_orders_number_unique` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_posts`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_posts`;
CREATE TABLE `t_hm101_posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `topicId` int(11) NOT NULL,
  `title` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contentH5Id` int(11) NOT NULL,
  `posterId` int(11) NOT NULL,
  `viewNum` int(8) NOT NULL DEFAULT '0',
  `location` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_product_experts`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_product_experts`;
CREATE TABLE `t_hm101_product_experts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `productId` int(11) NOT NULL,
  `picPath` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `likes` int(8) NOT NULL DEFAULT '0',
  `ranks` varchar(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_product_operations`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_product_operations`;
CREATE TABLE `t_hm101_product_operations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '01',
  `targetId` int(11) DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_products`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_products`;
CREATE TABLE `t_hm101_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nation` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `viewNum` int(8) NOT NULL DEFAULT '0',
  `featureH5Id` int(11) DEFAULT NULL,
  `detailH5Id` int(11) DEFAULT NULL,
  `routineH5Id` int(11) DEFAULT NULL,
  `feeH5Id` int(11) DEFAULT NULL,
  `noticeH5Id` int(11) DEFAULT NULL,
  `hospitalH5Id` int(11) DEFAULT NULL,
  `itemH5Id` int(11) DEFAULT NULL,
  `adultPrice` decimal(8,2) NOT NULL DEFAULT '0.00',
  `womenPrice` decimal(8,2) NOT NULL DEFAULT '0.00',
  `companyPrice` decimal(8,2) NOT NULL DEFAULT '0.00',
  `childPrice` decimal(8,2) NOT NULL DEFAULT '0.00',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_servants`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_servants`;
CREATE TABLE `t_hm101_servants` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picPath` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `nation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `introH5Id` int(11) NOT NULL,
  `literPrice` decimal(8,2) DEFAULT NULL,
  `followPrice` decimal(8,2) DEFAULT NULL,
  `recepPrice` decimal(8,2) DEFAULT NULL,
  `viewNum` int(8) NOT NULL DEFAULT '0',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_tags`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_tags`;
CREATE TABLE `t_hm101_tags` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `targetId` int(11) DEFAULT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tagerId` int(11) DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_thumbs`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_thumbs`;
CREATE TABLE `t_hm101_thumbs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` int(11) DEFAULT NULL,
  `likerId` int(11) DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_topics`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_topics`;
CREATE TABLE `t_hm101_topics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_users`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_users`;
CREATE TABLE `t_hm101_users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `loginId` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `iconPath` varchar(96) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `openId` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `slogan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `realName` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `idNumber` varchar(19) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `userName` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loginCount` int(11) DEFAULT '0',
  `ipAddress` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_users_loginid_unique` (`loginId`),
  UNIQUE KEY `t_hm101_users_telephone_unique` (`telephone`),
  UNIQUE KEY `t_hm101_users_openid_unique` (`openId`),
  UNIQUE KEY `t_hm101_users_email_unique` (`email`),
  UNIQUE KEY `t_hm101_users_idnumber_unique` (`idNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
