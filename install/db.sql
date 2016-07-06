CREATE DATABASE silex_booking;

CREATE TABLE IF NOT EXISTS `silex_booking`.`doctors` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `silex_booking`.`appointments` (
  `doctor_id` INT NOT NULL,
  `time_start` INT UNSIGNED NOT NULL,
  INDEX `doctor_id_idx` (`doctor_id` ASC),
  CONSTRAINT `doctor_id`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `silex_booking`.`doctors` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;