-- MySQL Script generated by MySQL Workbench
-- Wed Oct 12 11:46:18 2022
-- Modelusers: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema users
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema users
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `custom` DEFAULT CHARACTER SET utf8 ;
USE `custom` ;

-- -----------------------------------------------------
-- Table `custom`.`user`
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `custom`.`users` (
  `uid` varchar(1000) NOT NULL,
  `name` varchar(1000) NOT NULL,
  `email` varchar(1000) NOT NULL,
  `authtoken` varchar(1000) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `createdat` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (`uid`),
  UNIQUE (`name`),
  UNIQUE (`email`),
  UNIQUE (`authtoken`),
  PRIMARY KEY (`uid`))
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;