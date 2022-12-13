<?php
	session_start();
	require_once('_funciones.php');
	$toolSQL = new toolSQL();

	// Establecemos el idioma por defecto.
	if(!isset($_SESSION['idioma']))
		$_SESSION['idioma'] = "es";

	if(!isset($_COOKIE['adm_token']))
		echo "<script> window.location='login'; </script>";
	else
	{
		if(!isset($_SESSION['adm_id']))
		{
			$prepare = "SELECT usr_id, usr_nombres, usr_apellidos, usr_password, rol_id, usr_codigo FROM usuarios WHERE usr_codigo = ?";
			$params = [$_COOKIE['adm_token']];
			$types = ['s'];
			$usrS = $toolSQL->selectSQL($prepare, $types, $params);
			if($usrS <= 0){
				echo "<script> window.location='dashboard'; </script>";
				exit();
			}
			else
			{
				$nombre = explode(" ", $usrS[0]['usr_nombres'])[0];
				$_SESSION['adm_id'] = $usrS[0]['usr_id'];
				$_SESSION['adm_nombre'] = $nombre;
				$_SESSION['adm_rol'] = $usrS[0]['rol_id'];
				$_SESSION['adm_completo'] = $usrS[0]['usr_nombres']." ".$usrS[0]['usr_apellidos'];
				$_SESSION['adm_codigo'] = $usrS[0]['usr_codigo'];


				$usr_rol = $_SESSION['adm_rol'];
				$roles = explode(",", $cms_seccion[$index]['acceso']);

				$indexA = array_search($usr_rol, $roles);
				if($indexA !== false)
				{

				}
				else
				{
					$_SESSION['notificacion'] = "acceso_restringido";
					echo "<script> window.location='dashboard'; </script>";
					exit();
				}
			}
		}
	}
?>