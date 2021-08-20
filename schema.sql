CREATE TABLE `Sessions` (
	`id` int NOT NULL AUTO_INCREMENT,
	`date` DATETIME NOT NULL,
	`name` varchar(255) NOT NULL,
	`phase_id` int NOT NULL,
	`mesocycle_id` int NOT NULL,
	`microcycle_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Sets` (
	`id` int NOT NULL AUTO_INCREMENT,
	`load` int NOT NULL,
	`reps` int NOT NULL,
	`session_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Microcycle` (
	`id` int NOT NULL AUTO_INCREMENT,
	`date` DATETIME NOT NULL,
	`deload` BOOLEAN NOT NULL AUTO_INCREMENT,
	`mesocycle_id` int NOT NULL,
	`phase_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Mesocycle` (
	`id` int NOT NULL AUTO_INCREMENT,
	`date` DATETIME NOT NULL,
	`phase_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE `Phase` (
	`id` int NOT NULL AUTO_INCREMENT,
	`date` DATETIME NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_fk0` FOREIGN KEY (`phase_id`) REFERENCES `Phase`(`id`);

ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_fk1` FOREIGN KEY (`mesocycle_id`) REFERENCES `Mesocycle`(`id`);

ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_fk2` FOREIGN KEY (`microcycle_id`) REFERENCES `Microcycle`(`id`);

ALTER TABLE `Sets` ADD CONSTRAINT `Sets_fk0` FOREIGN KEY (`session_id`) REFERENCES `Sessions`(`id`);

ALTER TABLE `Microcycle` ADD CONSTRAINT `Microcycle_fk0` FOREIGN KEY (`mesocycle_id`) REFERENCES `Mesocycle`(`id`);

ALTER TABLE `Microcycle` ADD CONSTRAINT `Microcycle_fk1` FOREIGN KEY (`phase_id`) REFERENCES `Phase`(`id`);

ALTER TABLE `Mesocycle` ADD CONSTRAINT `Mesocycle_fk0` FOREIGN KEY (`phase_id`) REFERENCES `Phase`(`id`);





