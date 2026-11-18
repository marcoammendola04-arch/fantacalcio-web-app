-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Nov 17, 2026 alle 10:20
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fantacalcio_db`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `assegnazioneasta`
--

CREATE TABLE `assegnazioneasta` (
  `id` int(11) NOT NULL,
  `asta_id` int(11) NOT NULL,
  `giocatore_reale_id` int(11) NOT NULL,
  `utente_id` int(11) NOT NULL,
  `prezzo_pagato` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `assegnazioneasta`
--

INSERT INTO `assegnazioneasta` (`id`, `asta_id`, `giocatore_reale_id`, `utente_id`, `prezzo_pagato`) VALUES
(1, 1, 1, 1, 100),
(2, 1, 2, 1, 150),
(3, 1, 3, 2, 300),
(30, 1, 5, 1, 15),
(31, 1, 9, 1, 15),
(32, 1, 13, 1, 15),
(33, 1, 7, 1, 20),
(34, 1, 11, 1, 20),
(35, 1, 4, 1, 25),
(36, 1, 8, 1, 25),
(37, 1, 12, 1, 20),
(38, 1, 15, 1, 20),
(39, 1, 6, 1, 10),
(40, 1, 10, 1, 10),
(41, 1, 20, 2, 20),
(42, 1, 19, 2, 30),
(43, 3, 5, 10, 45),
(44, 3, 19, 10, 0),
(45, 3, 1, 1, 5),
(46, 3, 3, 1, 80),
(47, 3, 14, 10, 3),
(48, 3, 10, 10, 10),
(49, 3, 30, 10, 21),
(50, 3, 31, 10, 15),
(51, 3, 52, 10, 16),
(52, 3, 46, 10, 23),
(53, 3, 50, 10, 8),
(54, 3, 54, 10, 23),
(55, 3, 49, 10, 11),
(56, 3, 36, 10, 14),
(57, 3, 76, 10, 7),
(58, 3, 11, 10, 15),
(59, 3, 69, 10, 9),
(60, 3, 78, 10, 13),
(61, 3, 68, 10, 10),
(62, 3, 62, 10, 4),
(63, 3, 65, 10, 50),
(64, 3, 94, 10, 38),
(65, 3, 8, 10, 150),
(66, 3, 92, 10, 21),
(67, 3, 87, 10, 21),
(68, 3, 89, 10, 5),
(69, 3, 85, 10, 50),
(70, 3, 29, 1, 26),
(71, 3, 6, 1, 30),
(72, 3, 27, 1, 10),
(73, 3, 48, 1, 8),
(74, 3, 35, 1, 19),
(75, 3, 41, 1, 15),
(76, 3, 55, 1, 12),
(77, 3, 33, 1, 17),
(78, 3, 40, 1, 6),
(79, 3, 37, 1, 9),
(80, 3, 80, 1, 6),
(81, 3, 58, 1, 32),
(82, 3, 63, 1, 9),
(83, 3, 67, 1, 7),
(84, 3, 61, 1, 24),
(85, 3, 66, 1, 18),
(86, 3, 72, 1, 25),
(87, 3, 97, 1, 13),
(88, 3, 96, 1, 29),
(89, 3, 100, 1, 35),
(90, 3, 98, 1, 40),
(91, 3, 81, 1, 15),
(92, 3, 88, 1, 9);

-- --------------------------------------------------------

--
-- Struttura della tabella `asta`
--

CREATE TABLE `asta` (
  `id` int(11) NOT NULL,
  `lega_id` int(11) NOT NULL,
  `stato` enum('non iniziata','in corso','conclusa') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `asta`
--

INSERT INTO `asta` (`id`, `lega_id`, `stato`) VALUES
(1, 1, 'in corso'),
(3, 7, 'in corso');

-- --------------------------------------------------------

--
-- Struttura della tabella `formazione`
--

CREATE TABLE `formazione` (
  `id` int(11) NOT NULL,
  `utente_id` int(11) NOT NULL,
  `giornata_id` int(11) NOT NULL,
  `modulo` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `formazione`
--

INSERT INTO `formazione` (`id`, `utente_id`, `giornata_id`, `modulo`) VALUES
(1, 1, 1, '4-3-3'),
(2, 1, 8, '3-4-3'),
(3, 10, 8, '4-5-1'),
(4, 10, 10, '3-5-2');

-- --------------------------------------------------------

--
-- Struttura della tabella `formazionegiocatore`
--

CREATE TABLE `formazionegiocatore` (
  `id` int(11) NOT NULL,
  `formazione_id` int(11) NOT NULL,
  `giocatore_reale_id` int(11) NOT NULL,
  `titolare` tinyint(1) NOT NULL,
  `ordine_panchina` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `formazionegiocatore`
--

INSERT INTO `formazionegiocatore` (`id`, `formazione_id`, `giocatore_reale_id`, `titolare`, `ordine_panchina`) VALUES
(29, 1, 2, 1, NULL),
(30, 1, 1, 1, NULL),
(31, 1, 5, 1, NULL),
(32, 1, 9, 1, NULL),
(33, 1, 13, 1, NULL),
(34, 1, 7, 1, NULL),
(35, 1, 11, 1, NULL),
(36, 1, 15, 1, NULL),
(37, 1, 4, 1, NULL),
(38, 1, 8, 1, NULL),
(39, 1, 12, 1, NULL),
(40, 1, 6, 0, 1),
(41, 1, 10, 0, 2),
(42, 2, 1, 1, NULL),
(43, 2, 3, 1, NULL),
(44, 2, 29, 1, NULL),
(45, 2, 35, 1, NULL),
(46, 2, 58, 1, NULL),
(47, 2, 61, 1, NULL),
(48, 2, 66, 1, NULL),
(49, 2, 96, 1, NULL),
(50, 2, 100, 1, NULL),
(51, 2, 98, 1, NULL),
(52, 2, 55, 1, NULL),
(53, 2, 48, 0, 1),
(54, 2, 41, 0, 2),
(55, 2, 33, 0, 3),
(56, 2, 40, 0, 4),
(57, 2, 37, 0, 5),
(58, 2, 80, 0, 6),
(59, 2, 63, 0, 7),
(60, 2, 67, 0, 8),
(61, 2, 72, 0, 9),
(62, 2, 97, 0, 10),
(63, 2, 81, 0, 11),
(64, 2, 88, 0, 12),
(65, 2, 27, 0, 13),
(66, 2, 6, 0, 14),
(67, 3, 5, 1, NULL),
(68, 3, 19, 1, NULL),
(69, 3, 30, 1, NULL),
(70, 3, 31, 1, NULL),
(71, 3, 46, 1, NULL),
(72, 3, 54, 1, NULL),
(73, 3, 11, 1, NULL),
(74, 3, 78, 1, NULL),
(75, 3, 68, 1, NULL),
(76, 3, 65, 1, NULL),
(77, 3, 85, 1, NULL),
(78, 3, 14, 0, 1),
(79, 3, 10, 0, 2),
(80, 3, 52, 0, 3),
(81, 3, 50, 0, 4),
(82, 3, 49, 0, 5),
(83, 3, 36, 0, 6),
(84, 3, 76, 0, 7),
(85, 3, 69, 0, 8),
(86, 3, 62, 0, 9),
(87, 3, 89, 0, 10),
(88, 3, 87, 0, 11),
(89, 3, 92, 0, 12),
(90, 3, 8, 0, 13),
(91, 3, 94, 0, 14),
(117, 4, 5, 1, NULL),
(118, 4, 19, 1, NULL),
(119, 4, 10, 1, NULL),
(120, 4, 31, 1, NULL),
(121, 4, 54, 1, NULL),
(122, 4, 11, 1, NULL),
(123, 4, 68, 1, NULL),
(124, 4, 78, 1, NULL),
(125, 4, 65, 1, NULL),
(126, 4, 8, 1, NULL),
(127, 4, 92, 1, NULL),
(128, 4, 14, 0, 1),
(129, 4, 30, 0, 2),
(130, 4, 52, 0, 3),
(131, 4, 50, 0, 4),
(132, 4, 46, 0, 5),
(133, 4, 49, 0, 6),
(134, 4, 36, 0, 7),
(135, 4, 76, 0, 8),
(136, 4, 69, 0, 9),
(137, 4, 62, 0, 10),
(138, 4, 94, 0, 11),
(139, 4, 87, 0, 12),
(140, 4, 89, 0, 13),
(141, 4, 85, 0, 14);

-- --------------------------------------------------------

--
-- Struttura della tabella `giocatorereale`
--

CREATE TABLE `giocatorereale` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `ruolo` enum('portiere','difensore','centrocampista','attaccante') NOT NULL,
  `squadra_reale_id` int(11) NOT NULL,
  `quotazione` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `giocatorereale`
--

INSERT INTO `giocatorereale` (`id`, `nome`, `cognome`, `ruolo`, `squadra_reale_id`, `quotazione`) VALUES
(1, 'Federico', 'Dimarco', 'difensore', 2, 60),
(2, 'Mike', 'Maignan', 'portiere', 3, 30),
(3, 'Nico', 'Paz', 'centrocampista', 6, 80),
(4, 'Randal', 'Kolo Muani', 'attaccante', 4, 120),
(5, '', 'Wesley', 'difensore', 5, 45),
(6, 'Guglielmo', 'Vicario', 'portiere', 4, 30),
(7, 'Arthur', 'Atta', 'centrocampista', 7, 35),
(8, 'Lautaro', 'Martinez', 'attaccante', 2, 150),
(9, 'Federico', 'Gatti', 'difensore', 4, 20),
(10, 'Ivan', 'Provedel', 'portiere', 2, 10),
(11, 'Luka', 'Modric', 'centrocampista', 3, 15),
(12, 'Goncalo', 'Ramos', 'attaccante', 3, 110),
(13, 'Fikayo', 'Tomori', 'difensore', 3, 18),
(14, 'David', 'De Gea', 'portiere', 7, 25),
(15, 'Lucas', 'Da Cunha', 'centrocampista', 6, 40),
(16, 'Andrea', 'Pinamonti', 'attaccante', 10, 30),
(17, 'Gianluca', 'Mancini', 'difensore', 5, 30),
(18, 'Mile', 'Svilar', 'portiere', 5, 45),
(19, 'Kevin', 'De Bruyne', 'centrocampista', 1, 42),
(20, 'Alisson', 'Santos', 'attaccante', 1, 38),
(21, 'Justin', 'Bijlow', 'portiere', 11, 7),
(22, 'B', 'Butez', 'portiere', 6, 28),
(23, 'Elia', 'Caprile', 'portiere', 13, 15),
(24, 'Marco', 'Carnesecchi', 'portiere', 15, 17),
(25, 'Edoardo', 'Corvi', 'portiere', 16, 1),
(26, 'F', 'Falcone', 'portiere', 12, 9),
(27, 'Pierluigi', 'Gollini', 'portiere', 5, 10),
(28, 'Cristos', 'Mandas', 'portiere', 8, 32),
(29, 'Joseph', 'Martinez', 'portiere', 2, 26),
(30, 'Alex', 'Meret', 'portiere', 1, 21),
(31, 'Manuel', 'Akanji', 'difensore', 2, 15),
(32, 'David', 'Alaba', 'difensore', 19, 6),
(33, 'B', 'Balerdi', 'difensore', 5, 17),
(34, 'Davide', 'Bartesaghi', 'difensore', 3, 5),
(35, 'Alessandro', 'Bastoni', 'difensore', 2, 19),
(36, 'Rafik', 'Belghali', 'difensore', 9, 14),
(37, 'Raoul', 'Bellanova', 'difensore', 15, 9),
(38, 'Lorenzo', 'Bernasconi', 'difensore', 15, 6),
(39, 'Luca', 'Bertola', 'difensore', 19, 4),
(40, 'Samuele', 'Birindelli', 'difensore', 17, 6),
(41, 'Yan', 'Bisseck', 'difensore', 2, 15),
(42, 'B', 'Bremer', 'difensore', 4, 38),
(43, 'B', 'Buongiorno', 'difensore', 1, 4),
(44, 'Juan', 'Cabal', 'difensore', 4, 2),
(45, 'Andrea', 'Cambiaso', 'difensore', 4, 4),
(46, 'Carlos', 'Augusto', 'difensore', 2, 23),
(47, 'Zeki', 'Celik', 'difensore', 4, 6),
(48, 'Trevoh', 'Chalobah', 'difensore', 6, 8),
(49, 'Yan', 'Couto', 'difensore', 6, 11),
(50, 'Koni', 'De winter', 'difensore', 3, 8),
(51, 'Edoardo', 'Delprato', 'difensore', 16, 9),
(52, 'Giovanni', 'Di Lorenzo', 'difensore', 1, 16),
(53, 'Mario', 'Gila', 'difensore', 3, 18),
(54, 'Mario', 'Hermoso', 'difensore', 5, 23),
(55, 'Pierre', 'Kalulu', 'difensore', 4, 12),
(56, 'Kerim', 'Alajbegovic', 'centrocampista', 4, 15),
(57, 'Mattia', 'Baldanzi', 'centrocampista', 11, 10),
(58, 'Niccolò', 'Barella', 'centrocampista', 2, 32),
(59, 'Martin', 'Baturina', 'centrocampista', 6, 78),
(60, 'Adrian', 'Bernabè', 'centrocampista', 16, 8),
(61, 'Federico', 'Bernardeschi', 'centrocampista', 20, 24),
(62, 'Marco', 'Brescianini', 'centrocampista', 7, 4),
(63, 'Davide', 'Cacciamani', 'centrocampista', 9, 9),
(64, 'Hakan', 'Calhanoglu', 'centrocampista', 2, 100),
(65, 'Giacomo', 'Calò', 'centrocampista', 18, 50),
(66, 'Niccolò', 'Cambiaghi', 'centrocampista', 20, 18),
(67, 'Matteo', 'Cancellieri', 'centrocampista', 8, 7),
(68, 'Maxence', 'Caqueret', 'centrocampista', 6, 10),
(69, 'Samuel', 'Chukwueze', 'centrocampista', 3, 9),
(70, 'Andrea', 'Colpani', 'centrocampista', 17, 5),
(71, 'Francisco', 'Conceicao', 'centrocampista', 4, 20),
(72, 'Andy', 'Diouf', 'centrocampista', 2, 25),
(73, 'Douglas', 'Luiz', 'centrocampista', 4, 14),
(74, 'Jurgen', 'Ekkelenkamp', 'centrocampista', 19, 29),
(75, 'Niccolò', 'Fagioli', 'centrocampista', 4, 10),
(76, 'Gianluca', 'Gaetano', 'centrocampista', 15, 7),
(77, 'Pedro', 'Goncalves', 'centrocampista', 7, 17),
(78, 'Nico', 'Gonzalez', 'centrocampista', 4, 13),
(79, 'Gustav', 'Isaksen', 'centrocampista', 8, 30),
(80, 'Curtis', 'Jones', 'centrocampista', 2, 6),
(81, 'Akor', 'Adams', 'attaccante', 14, 15),
(82, 'Che', 'Adams', 'attaccante', 9, 17),
(83, 'Domenico', 'Berardi', 'attaccante', 10, 35),
(84, 'Jeremie', 'Boga', 'attaccante', 4, 9),
(85, 'Pio', 'Esposito', 'attaccante', 2, 50),
(86, 'Ange', 'Bonny', 'attaccante', 2, 9),
(87, 'Santiago', 'Castro', 'attaccante', 5, 21),
(88, 'Lorenzo', 'Colombo', 'attaccante', 11, 9),
(89, 'Patrick', 'Cutrone', 'attaccante', 17, 5),
(90, 'Keinan', 'Davis', 'attaccante', 19, 33),
(91, 'Charles', 'De ketelaere', 'attaccante', 15, 28),
(92, 'Assane', 'Diao', 'attaccante', 6, 21),
(93, 'Tasos', 'Douvikas', 'attaccante', 6, 72),
(94, 'Paulo', 'Dybala', 'attaccante', 5, 38),
(95, 'Sebastiano', 'Esposito', 'attaccante', 10, 19),
(96, 'Giorgi', 'Kvernadze', 'attaccante', 18, 29),
(97, 'Noa', 'Lang', 'attaccante', 1, 13),
(98, 'Antonio', 'Raimondo', 'attaccante', 18, 40),
(99, 'Giacomo', 'Raspadori', 'attaccante', 15, 6),
(100, 'Giovanni', 'Simeone', 'attaccante', 9, 35);

-- --------------------------------------------------------

--
-- Struttura della tabella `giornata`
--

CREATE TABLE `giornata` (
  `id` int(11) NOT NULL,
  `lega_id` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `stato` enum('da giocare','in corso','conclusa') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `giornata`
--

INSERT INTO `giornata` (`id`, `lega_id`, `numero`, `stato`) VALUES
(1, 1, 1, 'da giocare'),
(3, 1, 2, 'conclusa'),
(4, 1, 3, 'in corso'),
(5, 1, 4, 'da giocare'),
(6, 7, 1, 'conclusa'),
(7, 7, 2, 'conclusa'),
(8, 7, 3, 'conclusa'),
(9, 7, 4, 'conclusa'),
(10, 7, 5, 'in corso'),
(11, 7, 6, 'da giocare'),
(12, 7, 7, 'da giocare'),
(13, 7, 8, 'da giocare'),
(14, 7, 9, 'da giocare'),
(15, 7, 10, 'da giocare'),
(16, 7, 11, 'da giocare'),
(17, 7, 12, 'da giocare'),
(18, 7, 13, 'da giocare'),
(19, 7, 14, 'da giocare'),
(20, 7, 15, 'da giocare'),
(21, 7, 16, 'da giocare'),
(22, 7, 17, 'da giocare'),
(23, 7, 18, 'da giocare'),
(24, 7, 19, 'da giocare'),
(25, 7, 20, 'da giocare'),
(26, 7, 21, 'da giocare'),
(27, 7, 22, 'da giocare'),
(28, 7, 23, 'da giocare'),
(29, 7, 24, 'da giocare'),
(30, 7, 25, 'da giocare'),
(31, 7, 26, 'da giocare'),
(32, 7, 27, 'da giocare'),
(33, 7, 28, 'da giocare'),
(34, 7, 29, 'da giocare'),
(35, 7, 30, 'da giocare'),
(36, 7, 31, 'da giocare'),
(37, 7, 32, 'da giocare'),
(38, 7, 33, 'da giocare'),
(39, 7, 34, 'da giocare'),
(40, 7, 35, 'da giocare'),
(41, 7, 36, 'da giocare'),
(42, 7, 37, 'da giocare'),
(43, 7, 38, 'da giocare');

-- --------------------------------------------------------

--
-- Struttura della tabella `lega`
--

CREATE TABLE `lega` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `id_creatore` int(11) NOT NULL,
  `budget_iniziale` int(11) NOT NULL,
  `stato` enum('in preparazione','asta in corso','attiva','conclusa') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `lega`
--

INSERT INTO `lega` (`id`, `nome`, `id_creatore`, `budget_iniziale`, `stato`) VALUES
(1, 'Lega Amici', 1, 500, 'in preparazione'),
(2, 'Fantacalcio test', 3, 500, 'in preparazione'),
(3, 'Lega test', 3, 500, 'in preparazione'),
(4, 'Lega test', 3, 0, 'in preparazione'),
(5, 'Lega test Spazi', 3, 500, 'in preparazione'),
(6, 'Lega 2', 8, 500, 'in preparazione'),
(7, 'LucaLega', 10, 1000, 'in preparazione'),
(8, 'LucaLega2', 10, 100, 'in preparazione'),
(9, 'LucaLega3', 10, 500, 'in preparazione');

-- --------------------------------------------------------

--
-- Struttura della tabella `partecipazionelega`
--

CREATE TABLE `partecipazionelega` (
  `id` int(11) NOT NULL,
  `utente_id` int(11) NOT NULL,
  `lega_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `partecipazionelega`
--

INSERT INTO `partecipazionelega` (`id`, `utente_id`, `lega_id`) VALUES
(1, 1, 1),
(11, 1, 6),
(13, 1, 7),
(15, 1, 8),
(3, 2, 1),
(6, 3, 2),
(7, 3, 3),
(8, 3, 4),
(9, 3, 5),
(4, 4, 1),
(5, 5, 1),
(10, 8, 6),
(12, 10, 7),
(14, 10, 8),
(16, 10, 9);

-- --------------------------------------------------------

--
-- Struttura della tabella `squadrareale`
--

CREATE TABLE `squadrareale` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `squadrareale`
--

INSERT INTO `squadrareale` (`id`, `nome`) VALUES
(1, 'Napoli'),
(2, 'Inter'),
(3, 'Milan'),
(4, 'Juventus'),
(5, 'Roma'),
(6, 'Como'),
(7, 'Fiorentina'),
(8, 'Lazio'),
(9, 'Torino'),
(10, 'Sassuolo'),
(11, 'Genoa'),
(12, 'Lecce'),
(13, 'Cagliari'),
(14, 'Venezia'),
(15, 'Atalanta'),
(16, 'Parma'),
(17, 'Monza'),
(18, 'Frosinone'),
(19, 'Udinese'),
(20, 'Bologna');

-- --------------------------------------------------------

--
-- Struttura della tabella `utente`
--

CREATE TABLE `utente` (
  `id` int(11) NOT NULL,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `ruolo` enum('admin','utente') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `utente`
--

INSERT INTO `utente` (`id`, `nome`, `cognome`, `email`, `password`, `ruolo`) VALUES
(1, 'mario', 'rossi', 'maro@test.com', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'utente'),
(2, 'Luca', 'Bianchi', 'luca@test.com', '589933533722196b4e217818c9f88815a96ebe9d04e7670b67064e45436ecde9', 'utente'),
(3, 'Marco', 'Ammendola', 'marco.ammendola@test.com', '5efc2b017da4f7736d192a74dde5891369e0685d4d38f2a455b6fcdab282df9c', 'admin'),
(4, 'Laura', 'verdi', 'laura@test.com', '5a797e04dd084f9e9502d0e0e54d0a0996bc9d13e14fbf1613425a8bb4b448ce', 'utente'),
(5, 'Claudia', 'rossi', 'claudia@test.com', '9d4d5749ec95b83643ed8b4d9361adc53936cffefac97fbec249bedbb1116708', 'utente'),
(6, 'Test', 'Utente', 'test.registrazione@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'utente'),
(7, 'Finto', 'Admin', 'finto.admin@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'utente'),
(8, 'giulio', 'bianchi', 'giulio@test.com', '93ff4d79302417d6912b8c2620c1a5fcb8dbe305c1a351a8f3cd7560e3f4d4f2', 'admin'),
(10, 'Luca', 'Neri', 'luca.neri@test.com', '0490537906e872405d9ddfd76f58676fe267bb8655f6b097011e9931963346d9', 'admin');

-- --------------------------------------------------------

--
-- Struttura della tabella `voto`
--

CREATE TABLE `voto` (
  `id` int(11) NOT NULL,
  `giocatore_reale_id` int(11) NOT NULL,
  `giornata_id` int(11) NOT NULL,
  `valore` decimal(3,1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `voto`
--

INSERT INTO `voto` (`id`, `giocatore_reale_id`, `giornata_id`, `valore`) VALUES
(1, 1, 1, 8.0),
(2, 3, 1, 6.5),
(3, 1, 4, 7.0),
(4, 1, 3, 6.5),
(5, 5, 8, 6.0),
(6, 19, 8, 6.0),
(7, 1, 8, 6.0),
(8, 3, 8, 6.5),
(9, 14, 8, 7.0),
(10, 10, 8, 8.0),
(11, 30, 8, 10.0),
(12, 31, 8, 5.0),
(13, 52, 8, 10.0),
(14, 46, 8, 6.0),
(15, 50, 8, 8.0),
(16, 54, 8, 9.0),
(17, 49, 8, 6.0),
(18, 36, 8, 6.0),
(19, 76, 8, 6.0),
(20, 11, 8, 5.0),
(21, 69, 8, 4.0),
(22, 78, 8, 6.0),
(23, 68, 8, 6.0),
(24, 62, 8, 8.0),
(25, 65, 8, 8.5),
(26, 94, 8, 9.0),
(27, 8, 8, 6.5),
(28, 92, 8, 7.0),
(29, 87, 8, 6.0),
(30, 89, 8, 6.0),
(31, 85, 8, 6.0),
(32, 29, 8, 6.0),
(33, 6, 8, 6.0),
(34, 27, 8, 6.0),
(35, 48, 8, 6.0),
(36, 35, 8, 6.0),
(37, 41, 8, 6.0),
(38, 55, 8, 6.0),
(39, 33, 8, 6.0),
(40, 40, 8, 6.0),
(41, 37, 8, 6.0),
(42, 80, 8, 6.0),
(43, 58, 8, 6.0),
(44, 63, 8, 6.0),
(45, 67, 8, 6.0),
(46, 61, 8, 6.0),
(47, 66, 8, 6.0),
(48, 72, 8, 6.0),
(49, 97, 8, 6.0),
(50, 96, 8, 6.0),
(51, 100, 8, 6.0),
(52, 98, 8, 6.0),
(53, 81, 8, 5.5),
(54, 88, 8, 6.0),
(55, 88, 10, 6.0),
(56, 81, 10, 6.0),
(57, 98, 10, 6.0),
(58, 100, 10, 6.0),
(59, 96, 10, 6.0),
(60, 97, 10, 6.0),
(61, 72, 10, 6.0),
(62, 66, 10, 6.0),
(63, 61, 10, 6.0),
(64, 67, 10, 6.0),
(65, 63, 10, 6.0),
(66, 58, 10, 6.0),
(67, 80, 10, 6.0),
(68, 37, 10, 6.0),
(69, 40, 10, 6.0),
(70, 33, 10, 6.0),
(71, 55, 10, 6.0),
(72, 41, 10, 5.0),
(73, 35, 10, 5.5),
(74, 48, 10, 5.5),
(75, 27, 10, 6.0),
(76, 6, 10, 6.0),
(77, 29, 10, 6.0),
(78, 85, 10, 6.0),
(79, 89, 10, 6.0),
(80, 87, 10, 6.0),
(81, 92, 10, 6.0),
(82, 8, 10, 7.0),
(83, 94, 10, 6.5),
(84, 65, 10, 14.5),
(85, 62, 10, 6.0),
(86, 68, 10, 6.0),
(87, 78, 10, 6.0),
(88, 69, 10, 6.0),
(89, 76, 10, 6.5),
(90, 36, 10, 6.0),
(91, 49, 10, 7.5),
(92, 54, 10, 6.0),
(93, 50, 10, 6.0),
(94, 46, 10, 6.0),
(95, 52, 10, 6.0),
(96, 31, 10, 6.0),
(97, 30, 10, 5.5),
(98, 10, 10, 6.5),
(99, 14, 10, 5.5),
(100, 3, 10, 6.0),
(101, 1, 10, 5.5),
(102, 19, 10, 6.5),
(103, 5, 10, 6.0);

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `assegnazioneasta`
--
ALTER TABLE `assegnazioneasta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `asta_id_2` (`asta_id`,`giocatore_reale_id`),
  ADD KEY `giocatore_reale_id` (`giocatore_reale_id`),
  ADD KEY `utente_id` (`utente_id`);

--
-- Indici per le tabelle `asta`
--
ALTER TABLE `asta`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lega_id` (`lega_id`);

--
-- Indici per le tabelle `formazione`
--
ALTER TABLE `formazione`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utente_id` (`utente_id`,`giornata_id`),
  ADD KEY `giornata_id` (`giornata_id`);

--
-- Indici per le tabelle `formazionegiocatore`
--
ALTER TABLE `formazionegiocatore`
  ADD PRIMARY KEY (`id`),
  ADD KEY `formazione_id` (`formazione_id`),
  ADD KEY `giocatore_reale_id` (`giocatore_reale_id`);

--
-- Indici per le tabelle `giocatorereale`
--
ALTER TABLE `giocatorereale`
  ADD PRIMARY KEY (`id`),
  ADD KEY `squadra_reale_id` (`squadra_reale_id`);

--
-- Indici per le tabelle `giornata`
--
ALTER TABLE `giornata`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `lega_id` (`lega_id`,`numero`);

--
-- Indici per le tabelle `lega`
--
ALTER TABLE `lega`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_creatore` (`id_creatore`);

--
-- Indici per le tabelle `partecipazionelega`
--
ALTER TABLE `partecipazionelega`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `utente_id` (`utente_id`,`lega_id`),
  ADD KEY `lega_id` (`lega_id`);

--
-- Indici per le tabelle `squadrareale`
--
ALTER TABLE `squadrareale`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `utente`
--
ALTER TABLE `utente`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indici per le tabelle `voto`
--
ALTER TABLE `voto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `giocatore_reale_id` (`giocatore_reale_id`,`giornata_id`),
  ADD KEY `giornata_id` (`giornata_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `assegnazioneasta`
--
ALTER TABLE `assegnazioneasta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT per la tabella `asta`
--
ALTER TABLE `asta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `formazione`
--
ALTER TABLE `formazione`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `formazionegiocatore`
--
ALTER TABLE `formazionegiocatore`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=142;

--
-- AUTO_INCREMENT per la tabella `giocatorereale`
--
ALTER TABLE `giocatorereale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT per la tabella `giornata`
--
ALTER TABLE `giornata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT per la tabella `lega`
--
ALTER TABLE `lega`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT per la tabella `partecipazionelega`
--
ALTER TABLE `partecipazionelega`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT per la tabella `squadrareale`
--
ALTER TABLE `squadrareale`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT per la tabella `utente`
--
ALTER TABLE `utente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT per la tabella `voto`
--
ALTER TABLE `voto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `assegnazioneasta`
--
ALTER TABLE `assegnazioneasta`
  ADD CONSTRAINT `assegnazioneasta_ibfk_1` FOREIGN KEY (`asta_id`) REFERENCES `asta` (`id`),
  ADD CONSTRAINT `assegnazioneasta_ibfk_2` FOREIGN KEY (`giocatore_reale_id`) REFERENCES `giocatorereale` (`id`),
  ADD CONSTRAINT `assegnazioneasta_ibfk_3` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`);

--
-- Limiti per la tabella `asta`
--
ALTER TABLE `asta`
  ADD CONSTRAINT `asta_ibfk_1` FOREIGN KEY (`lega_id`) REFERENCES `lega` (`id`);

--
-- Limiti per la tabella `formazione`
--
ALTER TABLE `formazione`
  ADD CONSTRAINT `formazione_ibfk_1` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`),
  ADD CONSTRAINT `formazione_ibfk_2` FOREIGN KEY (`giornata_id`) REFERENCES `giornata` (`id`);

--
-- Limiti per la tabella `formazionegiocatore`
--
ALTER TABLE `formazionegiocatore`
  ADD CONSTRAINT `formazionegiocatore_ibfk_1` FOREIGN KEY (`formazione_id`) REFERENCES `formazione` (`id`),
  ADD CONSTRAINT `formazionegiocatore_ibfk_2` FOREIGN KEY (`giocatore_reale_id`) REFERENCES `giocatorereale` (`id`);

--
-- Limiti per la tabella `giocatorereale`
--
ALTER TABLE `giocatorereale`
  ADD CONSTRAINT `giocatorereale_ibfk_1` FOREIGN KEY (`squadra_reale_id`) REFERENCES `squadrareale` (`id`);

--
-- Limiti per la tabella `giornata`
--
ALTER TABLE `giornata`
  ADD CONSTRAINT `giornata_ibfk_1` FOREIGN KEY (`lega_id`) REFERENCES `lega` (`id`);

--
-- Limiti per la tabella `lega`
--
ALTER TABLE `lega`
  ADD CONSTRAINT `lega_ibfk_1` FOREIGN KEY (`id_creatore`) REFERENCES `utente` (`id`);

--
-- Limiti per la tabella `partecipazionelega`
--
ALTER TABLE `partecipazionelega`
  ADD CONSTRAINT `partecipazionelega_ibfk_1` FOREIGN KEY (`lega_id`) REFERENCES `lega` (`id`),
  ADD CONSTRAINT `partecipazionelega_ibfk_2` FOREIGN KEY (`utente_id`) REFERENCES `utente` (`id`);

--
-- Limiti per la tabella `voto`
--
ALTER TABLE `voto`
  ADD CONSTRAINT `voto_ibfk_1` FOREIGN KEY (`giocatore_reale_id`) REFERENCES `giocatorereale` (`id`),
  ADD CONSTRAINT `voto_ibfk_2` FOREIGN KEY (`giornata_id`) REFERENCES `giornata` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
