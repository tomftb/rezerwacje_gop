-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Sty 2019, 07:50
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
-- Struktura tabeli dla tabeli `klaster`
--

CREATE TABLE `klaster` (
  `id` int(11) NOT NULL,
  `nod` varchar(5) COLLATE utf8_polish_ci NOT NULL,
  `pracownia` int(11) NOT NULL DEFAULT '1' COMMENT 'klucz obcy.',
  `DAT_MOD` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `USER_MOD` varchar(30) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci COMMENT='Tabela przechowuje informacje na temat klastrów.';

--
-- Zrzut danych tabeli `klaster`
--

INSERT INTO `klaster` (`id`, `nod`, `pracownia`, `DAT_MOD`, `USER_MOD`) VALUES
(1, 'c1', 4, '2018-03-21 11:36:17', ''),
(2, 'c2', 3, '2018-03-21 11:36:17', ''),
(3, 'c3', 3, '2018-03-21 11:36:17', ''),
(4, 'c4', 3, '2018-03-21 11:36:17', ''),
(5, 'c5', 3, '2018-03-21 11:36:17', ''),
(6, 'c6', 3, '2018-03-21 11:36:17', ''),
(7, 'c7', 2, '2018-03-21 11:36:17', ''),
(8, 'c8', 2, '2018-03-21 11:36:17', ''),
(9, 'c9', 2, '2018-03-21 11:36:17', ''),
(10, 'c10', 2, '2018-03-21 11:36:17', ''),
(11, 'c11', 2, '2018-03-21 11:36:17', ''),
(12, 'c12', 2, '2018-03-21 11:36:17', ''),
(13, 'c13', 2, '2018-03-21 11:36:17', ''),
(14, 'c14', 2, '2018-03-21 11:36:17', ''),
(15, 'c15', 2, '2018-03-21 11:36:17', ''),
(16, 'c16', 2, '2018-03-21 11:36:17', ''),
(17, 'c17', 2, '2018-03-21 11:36:17', ''),
(18, 'c18', 2, '2018-03-21 11:36:17', ''),
(19, 'c19', 5, '2018-03-21 11:36:17', ''),
(20, 'c20', 5, '2018-03-21 11:36:17', ''),
(21, 'c21', 5, '2018-03-21 11:36:17', ''),
(22, 'c22', 5, '2018-03-21 11:36:17', ''),
(23, 'c23', 5, '2018-03-21 11:36:17', ''),
(24, 'c24', 5, '2018-03-21 11:36:17', ''),
(25, 'c25', 5, '2018-03-21 11:36:17', ''),
(26, 'c26', 5, '2018-03-21 11:36:17', ''),
(27, 'c27', 5, '2018-03-21 11:36:17', ''),
(28, 'c28', 5, '2018-03-21 11:36:17', ''),
(29, 'c29', 5, '2018-03-21 11:36:17', ''),
(30, 'c30', 5, '2018-03-21 11:36:17', ''),
(31, 'c31', 5, '2018-03-21 11:36:17', ''),
(32, 'c32', 5, '2018-03-21 11:36:17', ''),
(33, 'c33', 5, '2018-03-21 11:36:17', ''),
(34, 'c34', 5, '2018-03-21 11:36:17', ''),
(35, 'c35', 5, '2018-03-21 11:36:17', ''),
(36, 'c36', 5, '2018-03-21 11:36:17', ''),
(37, 'c37', 5, '2018-03-21 11:36:17', ''),
(38, 'c38', 5, '2018-03-21 11:36:17', ''),
(39, 'c39', 5, '2018-03-21 11:36:17', ''),
(40, 'c40', 5, '2018-03-21 11:36:17', ''),
(41, 'c41', 5, '2018-03-21 11:36:17', ''),
(42, 'c42', 5, '2018-03-21 11:36:17', ''),
(43, 'c43', 5, '2018-03-21 11:36:17', ''),
(44, 'c44', 5, '2018-03-21 11:36:17', ''),
(45, 'c45', 5, '2018-03-21 11:36:17', ''),
(46, 'c46', 5, '2018-03-21 11:36:17', ''),
(47, 'c47', 5, '2018-03-21 11:36:17', ''),
(48, 'c48', 5, '2018-03-21 11:36:17', ''),
(49, 'c49', 5, '2018-03-21 11:36:17', ''),
(50, 'c50', 5, '2018-03-21 11:36:17', ''),
(51, 'c51', 5, '2018-03-21 11:36:17', ''),
(52, 'c52', 5, '2018-03-21 11:36:17', ''),
(53, 'c53', 5, '2018-03-21 11:36:17', ''),
(54, 'c54', 5, '2018-03-21 11:36:17', ''),
(55, 'c55', 5, '2018-03-21 11:36:17', ''),
(56, 'c56', 5, '2018-03-21 11:36:17', ''),
(57, 'c57', 5, '2018-03-21 11:36:17', ''),
(58, 'c58', 5, '2018-03-21 11:36:17', ''),
(59, 'c59', 5, '2018-03-21 11:36:17', ''),
(60, 'c60', 5, '2018-03-21 11:36:17', ''),
(61, 'c61', 5, '2018-03-21 11:36:17', ''),
(62, 'c62', 5, '2018-03-21 11:36:17', ''),
(63, 'c63', 5, '2018-03-21 11:36:17', ''),
(64, 'c64', 5, '2018-03-21 11:36:17', ''),
(65, 'c65', 5, '2018-03-21 11:36:17', ''),
(66, 'c66', 5, '2018-03-21 11:36:17', ''),
(67, 'c67', 5, '2018-03-21 11:36:17', ''),
(68, 'c68', 5, '2018-03-21 11:36:17', ''),
(69, 'c69', 5, '2018-03-21 11:36:17', ''),
(70, 'c70', 5, '2018-03-21 11:36:17', ''),
(71, 'c71', 5, '2018-03-21 11:36:17', ''),
(72, 'c72', 5, '2018-03-21 11:36:17', ''),
(73, 'c73', 5, '2018-03-21 11:36:17', ''),
(74, 'c74', 5, '2018-03-21 11:36:17', ''),
(75, 'c75', 5, '2018-03-21 11:36:17', ''),
(76, 'c76', 5, '2018-03-21 11:36:17', ''),
(77, 'c77', 5, '2018-03-21 11:36:17', ''),
(78, 'c78', 5, '2018-03-21 11:36:17', ''),
(79, 'c79', 5, '2018-03-21 11:36:17', ''),
(80, 'c91', 5, '2018-03-21 11:36:17', ''),
(81, 'c92', 5, '2018-03-21 11:36:17', ''),
(82, 'c93', 5, '2018-03-21 11:36:17', ''),
(83, 'c94', 5, '2018-03-21 11:36:17', ''),
(84, 'c95', 5, '2018-03-21 11:36:17', ''),
(85, 'c96', 5, '2018-03-21 11:36:17', ''),
(86, 'c97', 5, '2018-03-21 11:36:17', ''),
(87, 'c101', 5, '2018-03-21 11:36:17', ''),
(88, 'c102', 5, '2018-03-21 11:36:17', ''),
(89, 'c103', 5, '2018-03-21 11:36:17', ''),
(90, 'c104', 5, '2018-03-21 11:36:17', ''),
(91, 'c105', 5, '2018-03-21 11:36:17', ''),
(92, 'c106', 5, '2018-03-21 11:36:17', ''),
(93, 'c107', 5, '2018-03-21 11:36:17', ''),
(94, 'c108', 5, '2018-03-21 11:36:17', ''),
(95, 'c109', 5, '2018-03-21 11:36:17', ''),
(96, 'c110', 5, '2018-03-21 11:36:17', ''),
(97, 'c111', 5, '2018-03-21 11:36:17', ''),
(98, 'c112', 5, '2018-03-21 11:36:17', ''),
(99, 'c113', 5, '2018-03-21 11:36:17', ''),
(100, 'c114', 5, '2018-03-21 11:36:17', ''),
(101, 'c115', 5, '2018-03-21 11:36:17', ''),
(102, 'c116', 5, '2018-03-21 11:36:17', ''),
(103, 'c117', 5, '2018-03-21 11:36:17', ''),
(104, 'c118', 5, '2018-03-21 11:36:17', ''),
(105, 'c119', 5, '2018-03-21 11:36:17', ''),
(106, 'c120', 5, '2018-03-21 11:36:17', ''),
(107, 'c121', 5, '2018-03-21 11:36:17', ''),
(108, 'c122', 5, '2018-03-21 11:36:17', ''),
(109, 'c123', 5, '2018-03-21 11:36:17', ''),
(110, 'c124', 5, '2018-03-21 11:36:17', ''),
(111, 'c125', 5, '2018-03-21 11:36:17', ''),
(112, 'c201', 5, '2018-03-21 11:36:17', ''),
(113, 'c202', 5, '2018-03-21 11:36:17', ''),
(114, 'c203', 5, '2018-03-21 11:36:17', ''),
(115, 'c204', 5, '2018-03-21 11:36:17', ''),
(116, 'c205', 5, '2018-03-21 11:36:17', ''),
(117, 'c206', 5, '2018-03-21 11:36:17', ''),
(118, 'c207', 5, '2018-03-21 11:36:17', ''),
(119, 'c208', 5, '2018-03-21 11:36:17', ''),
(120, 'c209', 5, '2018-03-21 11:36:17', ''),
(121, 'c210', 5, '2018-03-21 11:36:17', ''),
(122, 'c211', 5, '2018-03-21 11:36:17', ''),
(123, 'c212', 5, '2018-03-21 11:36:17', ''),
(124, 'c213', 5, '2018-03-21 11:36:17', ''),
(125, 'c214', 5, '2018-03-21 11:36:17', ''),
(126, 'c215', 5, '2018-03-21 11:36:17', ''),
(127, 'c216', 5, '2018-03-21 11:36:17', ''),
(128, 'c217', 5, '2018-03-21 11:36:17', ''),
(129, 'c218', 5, '2018-03-21 11:36:17', ''),
(130, 'c219', 5, '2018-03-21 11:36:17', ''),
(131, 'c220', 5, '2018-03-21 11:36:17', ''),
(132, 'c221', 1, '2018-03-21 11:36:17', ''),
(133, 'c222', 1, '2018-03-21 11:36:17', ''),
(134, 'c223', 1, '2018-03-21 11:36:17', ''),
(135, 'c224', 1, '2018-03-21 11:36:17', ''),
(136, 'c225', 1, '2018-03-21 11:36:17', ''),
(137, 'c226', 1, '2018-03-21 11:36:17', ''),
(138, 'c227', 1, '2018-03-21 11:36:17', ''),
(139, 'c228', 1, '2018-03-21 11:36:17', ''),
(140, 'c229', 1, '2018-03-21 11:36:17', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `pracownia`
--

CREATE TABLE `pracownia` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(20) COLLATE utf8_polish_ci NOT NULL,
  `WSK_U` int(1) NOT NULL DEFAULT '0' COMMENT 'Wskażnik usunięcia.',
  `WSK_U_DAT` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `WSK_U_USER` varchar(30) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `pracownia`
--

INSERT INTO `pracownia` (`id`, `nazwa`, `WSK_U`, `WSK_U_DAT`, `WSK_U_USER`) VALUES
(1, 'Brak rezerwacji', 0, '0000-00-00 00:00:00', ''),
(2, 'Pracownia 1', 0, '0000-00-00 00:00:00', ''),
(3, 'Pracownia 2', 0, '0000-00-00 00:00:00', ''),
(4, 'PPS', 0, '0000-00-00 00:00:00', ''),
(5, 'PWiR', 0, '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `projekt_dok`
--

CREATE TABLE `projekt_dok` (
  `id` int(11) NOT NULL,
  `id_projekt` int(11) NOT NULL,
  `nazwa` varchar(30) NOT NULL,
  `external_id` int(11) NOT NULL,
  `wsk_u` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `projekt_nowy`
--

CREATE TABLE `projekt_nowy` (
  `id` int(11) NOT NULL,
  `create_user` varchar(30) NOT NULL,
  `create_date` datetime NOT NULL,
  `typ_umowy` varchar(30) NOT NULL,
  `typ_umowy_alt` varchar(30) NOT NULL,
  `numer_umowy` varchar(30) NOT NULL,
  `temat_umowy` text NOT NULL,
  `kier_grupy` varchar(30) NOT NULL,
  `kier_grupy_id` int(11) NOT NULL,
  `term_realizacji` date NOT NULL,
  `harm_data` date NOT NULL,
  `koniec_proj` date NOT NULL,
  `nadzor` varchar(30) NOT NULL,
  `nadzor_id` int(11) NOT NULL,
  `dok` text NOT NULL,
  `dok_id` int(11) NOT NULL,
  `dok_dod` text NOT NULL,
  `dok_dod_id` int(11) NOT NULL,
  `status` enum('n','m','e') NOT NULL DEFAULT 'n',
  `wsk_u` int(11) NOT NULL,
  `mod_user` varchar(30) NOT NULL,
  `mod_user_id` int(11) NOT NULL,
  `dat_usn` datetime NOT NULL,
  `dat_kor` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `slo_dok`
--

CREATE TABLE `slo_dok` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(30) NOT NULL,
  `nazwa_alt` varchar(30) NOT NULL,
  `wsk_u` enum('0','1') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `slo_u_spec`
--

CREATE TABLE `slo_u_spec` (
  `id` int(11) NOT NULL,
  `nazwa` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `wsk_u` enum('0','1') COLLATE utf8_polish_ci NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `slo_u_spec`
--

INSERT INTO `slo_u_spec` (`id`, `nazwa`, `wsk_u`) VALUES
(1, 'Członek Grupy Realizującej', '0'),
(2, 'Lider Grupy Realizującej', '0'),
(3, 'Kierownik Zespołu Projektów', '0'),
(4, 'Główny Technolog GOP', '0'),
(5, 'Zastępca Kierownika Ośrodka Obliczeniowego', '0'),
(6, 'Kierownika Ośrodka Obliczeniowego', '0');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownik`
--

CREATE TABLE `uzytkownik` (
  `id` int(11) NOT NULL,
  `imie` varchar(30) NOT NULL,
  `nazwisko` varchar(30) NOT NULL,
  `stanowisko` varchar(50) NOT NULL,
  `login` varchar(30) NOT NULL,
  `haslo` varchar(1024) NOT NULL,
  `email` varchar(30) NOT NULL,
  `typ` char(1) NOT NULL DEFAULT 'a' COMMENT 'Konto lokalne, czy AD.',
  `rola` int(11) NOT NULL DEFAULT '1',
  `wsk_u` tinyint(1) NOT NULL DEFAULT '0',
  `dat_dod` datetime NOT NULL,
  `dat_usn` datetime NOT NULL,
  `tmp_imie` varchar(100) NOT NULL,
  `tmp_nazwisko` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Zrzut danych tabeli `uzytkownik`
--

INSERT INTO `uzytkownik` (`id`, `imie`, `nazwisko`, `stanowisko`, `login`, `haslo`, `email`, `typ`, `rola`, `wsk_u`, `dat_dod`, `dat_usn`, `tmp_imie`, `tmp_nazwisko`) VALUES
(1, 'Tomasz', 'Borczyński', 'Programista', 'tborczynski', '', 'tomasz.borczynski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Borczyński', 'Tomasz'),
(104, 'Bąk', 'Mateusz', 'GDS QC_InField', 'mbak', '', 'mateusz.bąk@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Mateusz', 'Bąk'),
(105, 'Białek', 'Szymon', 'GDS QC_InField', 'sbialek', '', 'szymon.białek@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Szymon', 'Białek'),
(106, 'Biesaga', 'Jacek', 'Kierownik Zespołu Projektów 2', 'jbiesaga', '', 'jacek.biesaga@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Jacek', 'Biesaga'),
(107, 'Bobakowska', 'Elżbieta', 'GDS QC_InField', 'ebobakowska', '', 'elżbieta.bobakowska@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Elżbieta', 'Bobakowska'),
(108, 'Burliga-Drąg', 'Joanna', 'Specjalista Geofizyk', 'jburliga-drag', '', 'joanna.burliga-drąg@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Joanna', 'Burliga-Drąg'),
(109, 'Buszka', 'Tomasz', 'Specjalista Geofizyk', 'tbuszka', '', 'tomasz.buszka@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Tomasz', 'Buszka'),
(110, 'Dalętka', 'Justyna', 'Samodzielny Inż. Geofizyk', 'jdaletka', '', 'justyna.dalętka@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Justyna', 'Dalętka'),
(111, 'Dybalak', 'Robert', 'Senior Geofizyk', 'rdybalak', '', 'robert.dybalak@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Robert', 'Dybalak'),
(112, 'Gadubała', 'Rafał', 'Specjalista Geofizyk', 'rgadubala', '', 'rafał.gadubała@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Rafał', 'Gadubała'),
(113, 'Gawrońska', 'Dorota', 'Samodzielny Inż. Geofizyk', 'dgawronska', '', 'dorota.gawrońska@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dorota', 'Gawrońska'),
(114, 'Gawroński', 'Dariusz', 'Specjalista Geofizyk', 'dgawronski', '', 'dariusz.gawroński@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dariusz', 'Gawroński'),
(115, 'Hodiak', 'Ryszard', 'GDS QC_InField', 'rhodiak', '', 'ryszard.hodiak@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Ryszard', 'Hodiak'),
(116, 'Hyjek', 'Paulina', 'Starszy Inż. Geofizyk', 'phyjek', '', 'paulina.hyjek@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Paulina', 'Hyjek'),
(117, 'Idzikowski', 'Piotr', 'Kierownik Pracowni Baz Danych Sejsmicznych', 'pidzikowski', '', 'piotr.idzikowski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Piotr', 'Idzikowski'),
(118, 'Kobusiński', 'Wojciech', 'Kierownik Zespołu Przetwarzania Specjalistycznego', 'wkobusinski', '', 'wojciech.kobusiński@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Wojciech', 'Kobusiński'),
(119, 'Kolasiński', 'Krzysztof', 'Kierownik Ośrodka Obliczeniowego', 'kkolasinski', '', 'krzysztof.kolasiński@geofizyka', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Krzysztof', 'Kolasiński'),
(120, 'Komorowska', 'Joanna', 'Specjalista Geofizyk', 'jkomorowska', '', 'joanna.komorowska@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Joanna', 'Komorowska'),
(121, 'Kowalski', 'Henryk', 'Kierownik Pracowni Wdrożeń i Rozwoju', 'hkowalski', '', 'henryk.kowalski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Henryk', 'Kowalski'),
(122, 'Lubomski', 'Sławomir', 'Specjalista Geofizyk', 'slubomski', '', 'sławomir.lubomski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Sławomir', 'Lubomski'),
(123, 'Łaszewski', 'Krzysztof', 'Specjalista Geofizyk', 'klaszewski', '', 'krzysztof.łaszewski@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Krzysztof', 'Łaszewski'),
(124, 'Masiukiewicz', 'Dorota', 'Specjalista Geofizyk', 'dmasiukiewicz', '', 'dorota.masiukiewicz@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dorota', 'Masiukiewicz'),
(125, 'Mucha', 'Wojciech', 'Starszy Inż. Geofizyk', 'wmucha', '', 'wojciech.mucha@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Wojciech', 'Mucha'),
(126, 'Nowak', 'Małgorzata', 'Specjalista Geofizyk', 'mnowak', '', 'małgorzata.nowak@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Małgorzata', 'Nowak'),
(127, 'Nussbeutel', 'Dorota', 'Specjalista Geofizyk', 'dnussbeutel', '', 'dorota.nussbeutel@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dorota', 'Nussbeutel'),
(128, 'Ogonowski', 'Waldemar', 'Kierownik Zespołu Projektów 2', 'wogonowski', '', 'waldemar.ogonowski@geofizyka.p', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Waldemar', 'Ogonowski'),
(129, 'Orlik', 'Grzegorz', 'Samodzielny Inż. Geofizyk', 'gorlik', '', 'grzegorz.orlik@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Grzegorz', 'Orlik'),
(130, 'Orzeszko', 'Maciej', 'Senior Geofizyk', 'morzeszko', '', 'maciej.orzeszko@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Maciej', 'Orzeszko'),
(131, 'Osiński', 'Marcin', 'Specjalista Geofizyk', 'mosinski', '', 'marcin.osiński@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Marcin', 'Osiński'),
(132, 'Pielesz', 'Aleksander', 'Specjalista Geofizyk', 'apielesz', '', 'aleksander.pielesz@geofizyka.p', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Aleksander', 'Pielesz'),
(133, 'Popielarski', 'Marek', 'Senior Geofizyk', 'mpopielarski', '', 'marek.popielarski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Marek', 'Popielarski'),
(134, 'Rabiasz', 'Marek', 'Senior Geofizyk', 'mrabiasz', '', 'marek.rabiasz@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Marek', 'Rabiasz'),
(135, 'Saj', 'Dariusz', 'Specjalista Geofizyk', 'dsaj', '', 'dariusz.saj@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Dariusz', 'Saj'),
(136, 'Siemińska', 'Katarzyna', 'Samodzielny Inż. Geofizyk', 'ksieminska', '', 'katarzyna.siemińska@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Katarzyna', 'Siemińska'),
(137, 'Sinicki', 'Radosław', 'GDS QC_InField', 'rsinicki', '', 'radosław.sinicki@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Radosław', 'Sinicki'),
(138, 'Sobociński', 'Romuald', 'Senior Geofizyk', 'rsobocinski', '', 'romuald.sobociński@geofizyka.p', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Romuald', 'Sobociński'),
(139, 'Susmarski', 'Waldemar', 'Senior Geofizyk', 'wsusmarski', '', 'waldemar.susmarski@geofizyka.p', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Waldemar', 'Susmarski'),
(140, 'Szal', 'Magdalena', 'Starszy Inż. Geofizyk', 'mszal', '', 'magdalena.szal@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Magdalena', 'Szal'),
(141, 'Szczechowska-Milczarek', 'Magdalena', 'Specjalista Geofizyk', 'mszczechowska', '', 'magdalena.szczechowska-milczar', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Magdalena', 'Szczechowska-Milczarek'),
(142, 'Szybiński', 'Marcin', 'Samodzielny Inż. Geofizyk', 'mszybinski', '', 'marcin.szybiński@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Marcin', 'Szybiński'),
(143, 'Szydło', 'Tomasz', 'Specjalista Geofizyk', 'tszydlo', '', 'tomasz.szydło@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Tomasz', 'Szydło'),
(144, 'Świętochowski', 'Karol', 'Starszy Inż. Geofizyk', 'kswietochowski', '', 'karol.świętochowski@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Karol', 'Świętochowski'),
(145, 'Theis', 'Robert', 'Specjalista Geofizyk', 'rtheis', '', 'robert.theis@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Robert', 'Theis'),
(146, 'Tlałka', 'Justyna', 'Specjalista Geofizyk', 'jtlalka', '', 'justyna.tlałka@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Justyna', 'Tlałka'),
(147, 'Tlałka', 'Seweryn', 'Główny Technolog GOP', 'stlalka', '', 'seweryn.tlałka@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Seweryn', 'Tlałka'),
(148, 'Torba', 'Tomasz', 'GDS QC_InField', 'ttorba', '', 'tomasz.torba@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Tomasz', 'Torba'),
(149, 'Ulman', 'Tomasz', 'Senior Geofizyk', 'tulman', '', 'tomasz.ulman@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Tomasz', 'Ulman'),
(150, 'Ulman', 'Elżbieta', 'Samodzielny Inż. Geofizyk', 'eulman', '', 'elżbieta.ulman@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Elżbieta', 'Ulman'),
(151, 'Van Marke De Lumen', 'Katarzyna', 'Samodzielny Referent ds.. Ekonomicznych', 'kmarke', '', 'katarzyna.van marke de lumen@g', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Katarzyna', 'Van Marke De Lumen'),
(152, 'Wędrowski', 'Piotr', 'Senior Geofizyk', 'pwedrowski', '', 'piotr.wędrowski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Piotr', 'Wędrowski'),
(153, 'Wilk', 'Marcin', 'Specjalista Geofizyk', 'mwilk', '', 'marcin.wilk@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Marcin', 'Wilk'),
(154, 'Wołk', 'Jadwiga', 'Specjalista Geofizyk', 'jwolk', '', 'jadwiga.wołk@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Jadwiga', 'Wołk'),
(155, 'Zalewska', 'Małgorzata', 'Samodzielny Inż. Geofizyk', 'mzalewska', '', 'małgorzata.zalewska@geofizyka.', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Małgorzata', 'Zalewska'),
(156, 'Zalewski', 'Rafał', 'Samodzielny Inż. Geofizyk', 'rzalewski', '', 'rafał.zalewski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Rafał', 'Zalewski'),
(157, 'Ząbik', 'Grzegorz', 'Senior Geofizyk', 'gzabik', '', 'grzegorz.ząbik@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Grzegorz', 'Ząbik'),
(158, 'Zduniak', 'Anna', 'Samodzielny Inż. Geofizyk', 'azduniak', '', 'anna.zduniak@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Anna', 'Zduniak'),
(159, 'Żurawski', 'Karol', 'Samodzielny Inż. Geofizyk', 'kżurawski', '', 'karol.żurawski@geofizyka.pl', 'a', 1, 0, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'Karol', 'Żurawski');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzyt_i_slo_u_spec`
--

CREATE TABLE `uzyt_i_slo_u_spec` (
  `id_user` int(11) NOT NULL,
  `id_slo_u_spec` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `klaster`
--
ALTER TABLE `klaster`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nodUNIQUE` (`nod`) USING BTREE,
  ADD KEY `FK_pracownia` (`pracownia`);

--
-- Indeksy dla tabeli `pracownia`
--
ALTER TABLE `pracownia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nazwaUNIQE` (`nazwa`) USING BTREE;

--
-- Indeksy dla tabeli `projekt_dok`
--
ALTER TABLE `projekt_dok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nazwa` (`nazwa`) USING BTREE,
  ADD KEY `FK_dok_projekt` (`id_projekt`);

--
-- Indeksy dla tabeli `projekt_nowy`
--
ALTER TABLE `projekt_nowy`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_numer_umowy` (`numer_umowy`) USING BTREE,
  ADD KEY `kier_grupy_id` (`kier_grupy_id`),
  ADD KEY `nadzor_id` (`nadzor_id`);

--
-- Indeksy dla tabeli `slo_dok`
--
ALTER TABLE `slo_dok`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_nazwa_slo_dok` (`nazwa`);

--
-- Indeksy dla tabeli `slo_u_spec`
--
ALTER TABLE `slo_u_spec`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_nazwa_u_spec` (`nazwa`);

--
-- Indeksy dla tabeli `uzytkownik`
--
ALTER TABLE `uzytkownik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uc_login` (`login`),
  ADD UNIQUE KEY `uc_imie_nazwisko` (`imie`,`nazwisko`),
  ADD KEY `idx_nazwisko` (`nazwisko`) USING BTREE,
  ADD KEY `idx_login` (`login`) USING BTREE,
  ADD KEY `idx_email` (`email`) USING BTREE,
  ADD KEY `FK_rola` (`rola`);

--
-- Indeksy dla tabeli `uzyt_i_slo_u_spec`
--
ALTER TABLE `uzyt_i_slo_u_spec`
  ADD UNIQUE KEY `uc_id_user_slo_u_spec` (`id_user`,`id_slo_u_spec`),
  ADD KEY `fk_id_slo_u_spec` (`id_slo_u_spec`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT dla tabeli `klaster`
--
ALTER TABLE `klaster`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=141;

--
-- AUTO_INCREMENT dla tabeli `pracownia`
--
ALTER TABLE `pracownia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT dla tabeli `projekt_dok`
--
ALTER TABLE `projekt_dok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `projekt_nowy`
--
ALTER TABLE `projekt_nowy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `slo_u_spec`
--
ALTER TABLE `slo_u_spec`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `uzytkownik`
--
ALTER TABLE `uzytkownik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=160;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `klaster`
--
ALTER TABLE `klaster`
  ADD CONSTRAINT `FK_pracownia` FOREIGN KEY (`pracownia`) REFERENCES `pracownia` (`id`);

--
-- Ograniczenia dla tabeli `projekt_dok`
--
ALTER TABLE `projekt_dok`
  ADD CONSTRAINT `FK_dok_projekt` FOREIGN KEY (`id_projekt`) REFERENCES `projekt_nowy` (`id`);

--
-- Ograniczenia dla tabeli `uzyt_i_slo_u_spec`
--
ALTER TABLE `uzyt_i_slo_u_spec`
  ADD CONSTRAINT `fk_id_slo_u_spec` FOREIGN KEY (`id_slo_u_spec`) REFERENCES `slo_u_spec` (`id`),
  ADD CONSTRAINT `fk_id_user` FOREIGN KEY (`id_user`) REFERENCES `uzytkownik` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
