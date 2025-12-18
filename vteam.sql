-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Värd: mariadb:3306
-- Tid vid skapande: 14 dec 2025 kl 10:56
-- Serverversion: 12.1.2-MariaDB-ubu2404
-- PHP-version: 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databas: `vteam`
--


DROP TABLE IF EXISTS `cities_to_charging`;
DROP TABLE IF EXISTS `cities_to_parking`;
DROP TABLE IF EXISTS `charging_zones`;
DROP TABLE IF EXISTS `parking_zones`;
DROP TABLE IF EXISTS `transactions`;
DROP TABLE IF EXISTS `trips`;
DROP TABLE IF EXISTS `scooter_in_use`;
DROP TABLE IF EXISTS `cards`;
DROP TABLE IF EXISTS `wallets`;
DROP TABLE IF EXISTS `scooters`;
DROP TABLE IF EXISTS `cities`;
DROP TABLE IF EXISTS `users`;


-- --------------------------------------------------------

--
-- Tabellstruktur `wallets`
--
CREATE TABLE `wallets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `balance` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `charging_zones`
--

CREATE TABLE `charging_zones` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `capacity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `charging_zones`
--
-- --------------------------------------------------------

--
-- Tabellstruktur `cities`
--

CREATE TABLE `cities` (
  `id` int(11) NOT NULL,
  `name` varchar(32) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `cities_to_charging`
--
CREATE TABLE `cities_to_charging` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `charging_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `cities_to_parking`
--

CREATE TABLE `cities_to_parking` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `parking_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `parking_zones`
--

CREATE TABLE `parking_zones` (
  `id` int(11) NOT NULL,
  `city_id` int(11) NOT NULL,
  `max_lat` decimal(9,6) NOT NULL,
  `max_long` decimal(9,6) NOT NULL,
  `min_lat` decimal(9,6) NOT NULL,
  `min_long` decimal(9,6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumpning av Data i tabell `parking_zones`
--

-- --------------------------------------------------------

--
-- Tabellstruktur `scooters`
--

CREATE TABLE `scooters` (
  `id` int(11) NOT NULL,
  `status` int(11) NOT NULL DEFAULT 10,
  `battery` int(3) NOT NULL DEFAULT 100,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `occupied` tinyint(1) NOT NULL DEFAULT 0,
  `city_id` int(11) NOT NULL,
  `current_zone_id` int(11) DEFAULT NULL,
  `current_zone_type` enum('charging','parking') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumpning av Data i tabell `scooters`
--


-- --------------------------------------------------------

--
-- Tabellstruktur `scooter_in_use`
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
-- Tabellstruktur `trips`
--

CREATE TABLE `trips` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `scooter_id` int(11) NOT NULL,
  `cost` decimal(10,2) NOT NULL,
  `start_latitude` decimal(9,6) NOT NULL,
  `start_longitude` decimal(9,6) NOT NULL,
  `end_latitude` decimal(9,6) DEFAULT NULL,
  `end_longitude` decimal(9,6) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellstruktur `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(64) NOT NULL,
  `password` varchar(256) NOT NULL,
  `email` varchar(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;


--
-- Index för dumpade tabeller
--

--
-- Index för tabell `wallets`
--
ALTER TABLE `wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`);
  -- ADD UNIQUE(`user_id`);

--
-- Index för tabell `charging_zones`
--
ALTER TABLE `charging_zones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_charging_city` (`city_id`);

--
-- Index för tabell `cities`
--
ALTER TABLE `cities`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Index för tabell `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `charging_id` (`charging_id`);

--
-- Index för tabell `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`),
  ADD KEY `parking_id` (`parking_id`);

--
-- Index för tabell `parking_zones`
--
ALTER TABLE `parking_zones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_parking_city` (`city_id`);

--
-- Index för tabell `scooters`
--
ALTER TABLE `scooters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scooter_city` (`city_id`);

--
-- Index för tabell `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scooter_id` (`scooter_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index för tabell `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `scooter_id` (`scooter_id`);

--
-- Index för tabell `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT för dumpade tabeller
--

--
-- AUTO_INCREMENT för tabell `wallets`
--
ALTER TABLE `wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `charging_zones`
--
ALTER TABLE `charging_zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `cities`
--
ALTER TABLE `cities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `parking_zones`
--
ALTER TABLE `parking_zones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `scooters`
--
ALTER TABLE `scooters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `trips`
--
ALTER TABLE `trips`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT för tabell `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restriktioner för dumpade tabeller
--

--
-- Restriktioner för tabell `wallets`
--
ALTER TABLE `wallets`
  ADD CONSTRAINT `fk_wallet_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `charging_zones`
--
ALTER TABLE `charging_zones`
  ADD CONSTRAINT `fk_charging_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `cities_to_charging`
--
ALTER TABLE `cities_to_charging`
  ADD CONSTRAINT `fk_ctc_charging` FOREIGN KEY (`charging_id`) REFERENCES `charging_zones` (`id`)ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctc_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`)ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `cities_to_parking`
--
ALTER TABLE `cities_to_parking`
  ADD CONSTRAINT `fk_ctp_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctp_parking` FOREIGN KEY (`parking_id`) REFERENCES `parking_zones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `parking_zones`
--
ALTER TABLE `parking_zones`
  ADD CONSTRAINT `fk_parking_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `scooters`
--
ALTER TABLE `scooters`
  ADD CONSTRAINT `fk_scooter_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `scooter_in_use`
--
ALTER TABLE `scooter_in_use`
  ADD CONSTRAINT `fk_siu_scooter` FOREIGN KEY (`scooter_id`) REFERENCES `scooters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_siu_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restriktioner för tabell `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `fk_trips_scooter` FOREIGN KEY (`scooter_id`) REFERENCES `scooters` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_trips_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION  */;
