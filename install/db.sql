CREATE DATABASE silex_appointment;

CREATE TABLE IF NOT EXISTS `silex_appointment`.`doctors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `version` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

INSERT INTO `silex_appointment`.`doctors` (`name`, `created_at`, `updated_at`, `version`)
    VALUES ('John Doe', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 1)
      ,('Jane Doe', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 1)
      ,('Jack Doe', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 1)
      ,('Jim Doe', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 1)
;

CREATE TABLE IF NOT EXISTS `silex_appointment`.`appointments` (
  `doctor_id` INT NOT NULL,
  `time_start` INT UNSIGNED NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `confirmed` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  `version` INT NULL,
  `deleted_at` TIMESTAMP NULL,
  INDEX `doctor_id_idx` (`doctor_id` ASC),
  CONSTRAINT `doctor_id`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `silex_appointment`.`doctors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;