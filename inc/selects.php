<?php
	session_start();
	require("_funciones.php");
	$toolSQL = new toolSQL();
	$tools   = new tools();

	$creado = date("Y-m-d H:i:s");
	$hora = date("His");

?>