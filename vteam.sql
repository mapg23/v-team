-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: mariadb:3306
-- Generation Time: Nov 13, 2025 at 12:19 PM
-- Server version: 12.0.2-MariaDB-ubu2404
-- PHP Version: 8.3.27

-- Test edited

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vteam`
--

-- --------------------------------------------------------
DROP TABLE IF EXISTS `cities_to_charging`;
DROP TABLE IF EXISTS `cities_to_parking`;
DROP TABLE IF EXISTS `charging_zones`;
DROP TABLE IF EXISTS `parking_zones`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `scooter_in_use`;
DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `scooters`;
DROP TABLE IF EXISTS `cities`;
DROP TABLE IF EXISTS `users`;



--
-- Table structure for table `cards`
--

CREATE TABLE `cards` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_holder` varchar(32) NOT NULL,
  `card_number` int(11) NOT NULL,
  `card_exp_date` int(11) NOT NULL,
  `card_secret` int(11) NOT NULL,
  `balance` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `charging_zones`
--

CREATE TABLE `charging_zones` (
  `id` int(11) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `cities`
--

INSERT INTO `cities` (`id`, `name`, `latitude`, `longitude`) VALUES
(1, 'Bankeryd', 57.863142, 14.127853),
(2, 'Habo', 57.916015, 14.052711),
(3, 'Jönköping', 57.782563, 14.165719);

-- --------------------------------------------------------

--
-- Table structure for table `cities_to_charging`
--

CREATE TABLE `cities_to_charging` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `charging_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cities_to_parking`
--

CREATE TABLE `cities_to_parking` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `parking_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parking_zones`
--

CREATE TABLE `parking_zones` (
  `id` int(11) NOT NULL,
  `max_lat` decimal(9,6) NOT NULL,
  `max_long` decimal(9,6) NOT NULL,
  `min_lat` decimal(9,6) NOT NULL,
  `min_long` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scooters`
--

CREATE TABLE `scooters` (
  `id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 10,
  `battery` int(3) NOT NULL DEFAULT 100,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
  `occupied` tinyint(1) NOT NULL DEFAULT 0,
  `city_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scooter_in_use`
--

CREATE TABLE `scooter_in_use` (
  `id` int(11) NOT NULL,
  `scooter_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `expected_end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `scooter_id` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `start_latitude` decimal(9,6) NOT NULL,
  `start_longitude` decimal(9,6) NOT NULL
  `end_latitude` decimal(9,6) NOT NULL,
  `end_longitude` decimal(9,6) NOT NULL
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cards`
--
ALTER TABLE `cards`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `charging_zones`
--
ALTER TABLE `charging_zones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `charging_id` (`charging_id`);

--
-- Indexes for table `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `parking_id` (`parking_id`);

--
-- Indexes for table `parking_zones`
--
ALTER TABLE `parking_zones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scooters`
--
ALTER TABLE `scooters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scooter_city` (`city_id`);

--
-- Indexes for table `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scooter_id` (`scooter_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `scooter_id` (`scooter_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cards`
--
ALTER TABLE `cards`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `charging_zones`
--
ALTER TABLE `charging_zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parking_zones`
--
ALTER TABLE `parking_zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scooters`
--
ALTER TABLE `scooters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cards`
--
ALTER TABLE `cards`
  ADD CONSTRAINT `fk_card_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  ADD CONSTRAINT `fk_ctc_charging` FOREIGN KEY (`charging_id`) REFERENCES `charging_zones` (`id`),
  ADD CONSTRAINT `fk_ctc_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  ADD CONSTRAINT `fk_ctp_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`),
  ADD CONSTRAINT `fk_ctp_parking` FOREIGN KEY (`parking_id`) REFERENCES `parking_zones` (`id`);

--
-- Constraints for table `scooters`
--
ALTER TABLE `scooters`
  ADD CONSTRAINT `fk_scooter_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`);

--
-- Constraints for table `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  ADD CONSTRAINT `fk_siu_scooter` FOREIGN KEY (`scooter_id`) REFERENCES `scooters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_siu_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `fk_trips_scooter` FOREIGN KEY (`scooter_id`) REFERENCES `scooters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trips_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
