


INSERT INTO `slo_list_type` (`NAME`) VALUES
('disc'),('circle'),('square'),('decimal'),('decimal-leading-zero'),('lower-roman'),('upper-roman'),('lower-greek'),('lower-latin'),('upper-latin'),('armenian'),('georgian'),('lower-alpha'),('upper-alpha');

ALTER TABLE `parametry` CHANGE `TYP` `TYP` ENUM('t','p','s','c','a','n','sc','sa','sf','sm','sl','slm') CHARACTER SET utf8 COLLATE utf8_polish_ci NOT NULL COMMENT 'sc - slo color, sa - text align, sf - font family, sm - font measurement, sl - list style, slm - list style measurement';

INSERT INTO `parametry` (`ID`, `NAZWA`, `SKROT`, `OPIS`, `WARTOSC`, `TYP`, `MOD_DAT`, `MOD_USER`, `MOD_USER_ID`) VALUES 
(NULL, 'Etapy projektu - lista - domyślny poziom listy', 'STAGE_LIST_DEFAULT_LVL', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'), 
(NULL, 'Etapy projektu - lista - maksymalny poziom listy', 'STAGE_LIST_MAX_LVL', '7', '7', 'n', '2022-04-12 00:00:00', 'tborczynski', '1')

INSERT INTO `parametry` (`ID`, `NAZWA`, `SKROT`, `OPIS`, `WARTOSC`, `TYP`, `MOD_DAT`, `MOD_USER`, `MOD_USER_ID`) VALUES 
(NULL, 'Etapy projektu - lista - domyślny poziom listy', 'STAGE_LIST_DEFAULT_LVL', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'), 
(NULL, 'Etapy projektu - lista - maksymalny poziom listy', 'STAGE_LIST_MAX_LVL', '7', '7', 'n', '2022-04-12 00:00:00', 'tborczynski', '1')


INSERT INTO `parametry` (`ID`, `NAZWA`, `SKROT`, `OPIS`, `WARTOSC`, `TYP`, `MOD_DAT`, `MOD_USER`, `MOD_USER_ID`) VALUES 
(NULL, 'Etapy projektu - lista - domyślna wartość wcięcia', 'STAGE_LIST_INDENTATION', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'),
(NULL, 'Etapy projektu - lista - domyślna wartość miary wcięcia', 'STAGE_LIST_INDENTATION_MEASUREMENT', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'),
(NULL, 'Etapy projektu - lista - domyślna wartość wysunięcia', 'STAGE_LIST_EJECTION', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'),
(NULL, 'Etapy projektu - lista - domyślna wartość miary wysunięcia', 'STAGE_LIST_EJECTION_MEASUREMENT', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1');


INSERT INTO `parametry` (`ID`, `NAZWA`, `SKROT`, `OPIS`, `WARTOSC`, `TYP`, `MOD_DAT`, `MOD_USER`, `MOD_USER_ID`) VALUES 
(NULL, 'Etapy projektu - lista - lewy margines', 'STAGE_LIST_MARGIN_LEFT', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'), 
(NULL, 'Etapy projektu - lista - prawy margines', 'STAGE_LIST_MARGIN_RIGHT', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'),
(NULL, 'Etapy projektu - lista - górny margines', 'STAGE_LIST_MARGIN_TOP', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1'), 
(NULL, 'Etapy projektu - lista - dony margines', 'STAGE_LIST_MARGIN_BOTTOM', '1', '1', 'n', '2022-04-12 00:00:00', 'tborczynski', '1');


/* CZCIONKA */

/* AKAPIT */