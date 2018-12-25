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

 Date: 12/24/2018 09:57:23 AM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `t_hm101_carousels`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_carousels`;
CREATE TABLE `t_hm101_carousels` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `location` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decription` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `description` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `chNum` int(6) NOT NULL,
  `contact` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `bizCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `topicId` int(11) NOT NULL,
  `targer` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` int(11) NOT NULL,
  `money` decimal(8,2) NOT NULL,
  `quantity` int(4) NOT NULL DEFAULT '1',
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_attentants_number_unique` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_order_peoples`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_order_peoples`;
CREATE TABLE `t_hm101_order_peoples` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `idNumber` int(20) NOT NULL,
  `telephone` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '02',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_peoples_number_unique` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_order_periods`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_order_periods`;
CREATE TABLE `t_hm101_order_periods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `OrderNumber` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `loanId` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `money` decimal(8,2) NOT NULL,
  `periods` int(3) NOT NULL DEFAULT '6',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `t_hm101_order_periods_ordernumber_unique` (`OrderNumber`)
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
  `money` decimal(8,2) NOT NULL,
  `payedMoney` decimal(8,2) NOT NULL DEFAULT '0.00',
  `buyerId` int(11) DEFAULT NULL,
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
  `views` int(8) NOT NULL DEFAULT '0',
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
  `decription` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
--  Table structure for `t_hm101_products`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_products`;
CREATE TABLE `t_hm101_products` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `carouselId` int(11) NOT NULL,
  `decription` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int(8) NOT NULL DEFAULT '0',
  `hospitalH5Id` int(11) DEFAULT NULL,
  `daysCarouId` int(11) NOT NULL,
  `serviceH5Id` int(11) DEFAULT NULL,
  `examH5Id` int(11) DEFAULT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
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
  `introduction` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `picPath` varchar(96) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `status` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '01',
  `nation` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `operator` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operateFlag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'A',
  `updatedAt` datetime NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
--  Table structure for `t_hm101_thumbups`
-- ----------------------------
DROP TABLE IF EXISTS `t_hm101_thumbups`;
CREATE TABLE `t_hm101_thumbups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `target` varchar(2) COLLATE utf8mb4_unicode_ci NOT NULL,
  `targetId` int(11) DEFAULT NULL,
  `likerId` int(11) DEFAULT NULL,
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
  `description` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
  `username` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
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
