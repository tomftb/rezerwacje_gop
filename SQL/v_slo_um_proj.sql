-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Sty 2019, 08:34
-- Wersja serwera: 10.1.30-MariaDB
-- Wersja PHP: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `rezerwacjegop`
--

-- --------------------------------------------------------

--
-- Struktura widoku `v_slo_um_proj`
--

CREATE ALGORITHM=UNDEFINED DEFINER=`rezerwacjegop`@`localhost` SQL SECURITY DEFINER VIEW `v_slo_um_proj`  AS  select `slo_um_proj`.`id` AS `ID`,`slo_um_proj`.`nazwa` AS `nazwa`,`slo_um_proj`.`nazwa_alt` AS `NazwaAlt` from `slo_um_proj` where (`slo_um_proj`.`wsk_u` = '0') ;

--
-- VIEW  `v_slo_um_proj`
-- Dane: Żaden
--

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
