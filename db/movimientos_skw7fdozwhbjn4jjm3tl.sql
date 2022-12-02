-- phpMyAdmin SQL Dump
-- version 4.9.10
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 02-12-2022 a las 14:46:30
-- Versión del servidor: 5.7.33
-- Versión de PHP: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movimientos_skw7fdozwhbjn4jjm3tl`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `rol_id` int(11) NOT NULL,
  `rol_nombre_es` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol_nombre_en` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rol_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`rol_id`, `rol_nombre_es`, `rol_nombre_en`, `rol_modificado`, `rol_creado`) VALUES
(1, 'Administrador', 'Administrator', '2021-02-16 07:28:07', '2021-02-16 07:28:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usr_id` int(11) NOT NULL,
  `usr_codigo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usr_nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usr_apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usr_email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usr_password` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol_id` int(11) NOT NULL,
  `est_id` int(11) NOT NULL,
  `borrado_logico` tinyint(1) NOT NULL,
  `usr_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usr_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usr_id`, `usr_codigo`, `usr_nombres`, `usr_apellidos`, `usr_email`, `usr_password`, `rol_id`, `est_id`, `borrado_logico`, `usr_modificado`, `usr_creado`) VALUES
(1, 'DyBuMNxrBjuNH5hTG9By', 'Carlos ', 'Millan', 'canvas.desarrollo3@gmail.com', '$2y$10$UFIyi848fHyPe6omrUYTF.mJIXee3fgdu2lpWWZbdZP3tApB90OHq', 0, 1, 0, '2022-11-24 16:39:56', '2022-10-24 17:33:33'),
(2, 'dGaRHsn7LPb1uqBa6RJy', 'Harvy', 'Vargas', 'canvas.comercial@gmail.com', '$2y$10$RXApFE5mRVsi1TRGDcqwGubFEZhbW5mMl0NXyvq5PDRlWcvK3iqVK', 1, 1, 0, '2022-11-22 16:58:37', '2022-11-22 16:58:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_estados`
--

CREATE TABLE `_estados` (
  `est_id` int(11) NOT NULL,
  `est_nombre_es` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `est_nombre_en` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `_estados`
--

INSERT INTO `_estados` (`est_id`, `est_nombre_es`, `est_nombre_en`) VALUES
(1, 'Activo', 'Enabled'),
(0, 'Inactivo', 'Disabled');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`rol_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usr_id`);

--
-- Indices de la tabla `_estados`
--
ALTER TABLE `_estados`
  ADD PRIMARY KEY (`est_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `rol_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usr_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `_estados`
--
ALTER TABLE `_estados`
  MODIFY `est_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
