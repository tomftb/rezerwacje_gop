-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 16 Lip 2021, 10:18
-- Wersja serwera: 10.4.17-MariaDB
-- Wersja PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
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
-- Struktura tabeli dla tabeli `projekt_etap_wartosc_plik`
--

CREATE TABLE `projekt_etap_wartosc_plik` (
  `id` int(11) NOT NULL,
  `idProjectStageValue` int(11) NOT NULL,
  `fileId` int(11) NOT NULL DEFAULT 0,
  `filename` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `fileposition` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `originalname` varchar(200) COLLATE utf8_polish_ci NOT NULL,
  `size` int(11) NOT NULL,
  `type` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_user_id` int(11) NOT NULL,
  `create_user_login` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_user_full_name` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_user_email` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_date` datetime NOT NULL,
  `create_host` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `mod_user_id` int(11) DEFAULT NULL,
  `mod_user_login` varchar(100) COLLATE utf8_polish_ci DEFAULT NULL,
  `mod_user_full_name` varchar(100) COLLATE utf8_polish_ci DEFAULT NULL,
  `mod_user_email` varchar(100) COLLATE utf8_polish_ci DEFAULT NULL,
  `mod_date` datetime DEFAULT NULL,
  `mod_host` varchar(100) COLLATE utf8_polish_ci DEFAULT NULL,
  `wsk_u` enum('0','1') COLLATE utf8_polish_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `projekt_etap_wartosc_plik`
--
ALTER TABLE `projekt_etap_wartosc_plik`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_projekt_etap3_projekt_id` (`idProjectStageValue`),
  ADD KEY `FK_projekt_etap3_cuser_id` (`create_user_id`);

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `projekt_etap_wartosc_plik`
--
ALTER TABLE `projekt_etap_wartosc_plik`
  ADD CONSTRAINT `FK_projekt_etap3_cuser_id` FOREIGN KEY (`create_user_id`) REFERENCES `uzytkownik` (`id`),
  ADD CONSTRAINT `FK_projekt_etap3_projekt_id` FOREIGN KEY (`idProjectStageValue`) REFERENCES `projekt_etap_wartosc` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
