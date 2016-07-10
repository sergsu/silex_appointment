CREATE DATABASE silex_appointment;

CREATE TABLE IF NOT EXISTS `silex_appointment`.`doctors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INT NOT NULL,
  `deleted_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

INSERT INTO `silex_appointment`.`doctors` (`name`, `created_at`, `updated_at`, `version`)
    VALUES ('John Doe', UTC_TIMESTAMP(), UTC_TIMESTAMP(), 1)
      ,('Jane Doe', UTC_TIMESTAMP(), UTC_TIMESTAMP(), 1)
      ,('Jack Doe', UTC_TIMESTAMP(), UTC_TIMESTAMP(), 1)
      ,('Jim Doe', UTC_TIMESTAMP(), UTC_TIMESTAMP(), 1)
;

CREATE TABLE IF NOT EXISTS `silex_appointment`.`appointments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `doctor_id` INT NOT NULL,
  `time_start` TIMESTAMP NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `confirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `version` INT NOT NULL,
  `deleted_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `doctor_id_idx` (`doctor_id` ASC),
  CONSTRAINT `doctor_id`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `silex_appointment`.`doctors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;