-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 21 Sie 2018, 13:51
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
-- Struktura tabeli dla tabeli `projekt`
--

CREATE TABLE `projekt` (
  `ID` int(11) NOT NULL,
  `NAZWA` varchar(100) NOT NULL,
  `ROZMIAR` int(11) NOT NULL,
  `ROZ_JED` varchar(2) NOT NULL,
  `ZGL_LOGIN` varchar(20) NOT NULL,
  `ZGL_N_I` varchar(50) NOT NULL,
  `ZGL_EMAIL` varchar(100) NOT NULL,
  `ZGL_OSOBY` varchar(1024) NOT NULL,
  `ZGL_DAT` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ZGL_HOST` varchar(30) NOT NULL,
  `WSK_U` tinyint(4) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Tabela przechowuje informacje na temat zgłaszanych projektów';

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `UK_PROJECT` (`NAZWA`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `projekt`
--
ALTER TABLE `projekt`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
