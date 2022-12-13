-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3306
-- Tiempo de generación: 13-12-2022 a las 21:00:48
-- Versión del servidor: 5.7.33
-- Versión de PHP: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ztek_movimientos`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bancos`
--

CREATE TABLE `bancos` (
  `ban_id` int(11) NOT NULL,
  `ban_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ban_numero` double NOT NULL,
  `btp_id` int(11) NOT NULL COMMENT 'Tipo de Banco',
  `ban_monto` double NOT NULL,
  `borrado_logico` tinyint(1) NOT NULL COMMENT '0:Activo, 1:Borrado',
  `ban_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ban_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cajas`
--

CREATE TABLE `cajas` (
  `caj_id` int(11) NOT NULL,
  `caj_nombre` int(100) NOT NULL,
  `caj_monto` double NOT NULL,
  `borrado_logico` tinyint(1) NOT NULL COMMENT '0:Activo, 1:Borrado',
  `caj_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `caj_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `centro_costos`
--

CREATE TABLE `centro_costos` (
  `cco_id` int(11) NOT NULL,
  `cco_codigo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cco_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cco_detalle` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `borrado_logico` tinyint(1) NOT NULL COMMENT '0:Activo, 1:Borrado',
  `cco_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cco_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `emp_id` int(11) NOT NULL,
  `emp_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hantik SAS, Canvas Marketing y Diseño, Indigo Sex Shop',
  `borrado_logico` tinyint(1) NOT NULL COMMENT '0:Activo, 1:Borrado',
  `emp_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `emp_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `mov_id` int(11) NOT NULL,
  `mov_detalle` blob NOT NULL,
  `mov_fecha` date NOT NULL,
  `mov_valor` double NOT NULL,
  `mtp_id` int(11) NOT NULL COMMENT 'Tipo de Movimiento',
  `cco_id` int(11) NOT NULL COMMENT 'Centro de Costo',
  `ban_id` int(11) NOT NULL COMMENT 'Banco',
  `caj_id` int(11) NOT NULL COMMENT 'Caja',
  `emp_id` int(11) NOT NULL COMMENT 'Empresa',
  `mov_observacion` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `borrado_logico` tinyint(1) NOT NULL COMMENT '0:Activo, 1:Borrado',
  `mov_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mov_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Estructura de tabla para la tabla `_bancos_tipos`
--

CREATE TABLE `_bancos_tipos` (
  `btp_id` int(11) NOT NULL,
  `btp_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Bancolombia, Davivienda, BBVA, Banco W, etc',
  `btp_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `btp_creado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `_movimientos_tipos`
--

CREATE TABLE `_movimientos_tipos` (
  `mtp_id` int(11) NOT NULL,
  `mtp_nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Ingreso,Egreso, Endeudamiento, Pagos a prestamos, Préstamo a terceros, Pago a terceros',
  `mtp_slug` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Simbolo dependiendo del tipo (- o +)',
  `mtp_modificado` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `mtp_creado` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bancos`
--
ALTER TABLE `bancos`
  ADD PRIMARY KEY (`ban_id`);

--
-- Indices de la tabla `cajas`
--
ALTER TABLE `cajas`
  ADD PRIMARY KEY (`caj_id`);

--
-- Indices de la tabla `centro_costos`
--
ALTER TABLE `centro_costos`
  ADD PRIMARY KEY (`cco_id`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`emp_id`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`mov_id`);

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
-- Indices de la tabla `_bancos_tipos`
--
ALTER TABLE `_bancos_tipos`
  ADD PRIMARY KEY (`btp_id`);

--
-- Indices de la tabla `_estados`
--
ALTER TABLE `_estados`
  ADD PRIMARY KEY (`est_id`);

--
-- Indices de la tabla `_movimientos_tipos`
--
ALTER TABLE `_movimientos_tipos`
  ADD PRIMARY KEY (`mtp_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bancos`
--
ALTER TABLE `bancos`
  MODIFY `ban_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cajas`
--
ALTER TABLE `cajas`
  MODIFY `caj_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `centro_costos`
--
ALTER TABLE `centro_costos`
  MODIFY `cco_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `emp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `mov_id` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT de la tabla `_bancos_tipos`
--
ALTER TABLE `_bancos_tipos`
  MODIFY `btp_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `_estados`
--
ALTER TABLE `_estados`
  MODIFY `est_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `_movimientos_tipos`
--
ALTER TABLE `_movimientos_tipos`
  MODIFY `mtp_id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
