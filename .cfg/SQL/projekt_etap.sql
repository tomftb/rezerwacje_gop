-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 16 Lip 2021, 09:03
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
-- Struktura tabeli dla tabeli `projekt_etap`
--

CREATE TABLE `projekt_etap` (
  `id` int(11) NOT NULL,
  `idProject` int(11) NOT NULL,
  `stageId` int(11) NOT NULL,
  `number` int(11) NOT NULL,
  `title` varchar(1024) COLLATE utf8_polish_ci NOT NULL,
  `create_user_id` int(11) NOT NULL,
  `create_user_login` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_user_full_name` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_user_email` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `create_date` datetime NOT NULL DEFAULT current_timestamp(),
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
-- Indeksy dla tabeli `projekt_etap`
--
ALTER TABLE `projekt_etap`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_projekt_etap_projekt_id` (`idProject`),
  ADD KEY `FK_projekt_nowy_createuser_id` (`create_user_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `projekt_etap`
--
ALTER TABLE `projekt_etap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `projekt_etap`
--
ALTER TABLE `projekt_etap`
  ADD CONSTRAINT `FK_projekt_etap_projekt_id` FOREIGN KEY (`idProject`) REFERENCES `projekt_nowy` (`id`),
  ADD CONSTRAINT `FK_projekt_etap_cuser_id` FOREIGN KEY (`create_user_id`) REFERENCES `uzytkownik` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
