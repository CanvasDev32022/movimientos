<?php
	session_start();
	include('_funciones.php');
	$toolSQL = new toolSQL();
	$tools = new tools();

	require('_correos.php');
	$mail = new Mailing();


	$creado = date("Y-m-d H:i:s");
	$hora = date("His");

	if($_POST['action'] == "login") 
	{
		$prepare = "SELECT usr_id, usr_codigo, usr_nombres, usr_apellidos, usr_email, usr_password, rol_id FROM usuarios WHERE usr_email = ? AND est_id = 1";
		$params = [$_POST['user']];
		$types = ['s'];
		$usrS = $toolSQL->selectSQL($prepare, $types, $params);
		if($usrS < 0) 
			echo -1;
		elseif($usrS == 0){
			echo 0;
		} else {

			if(password_verify($_POST['pass'], $usrS[0]['usr_password'])) {

				$expirar = isset($_POST['recuerdame']) ? strtotime("+1 year") : strtotime("+1 days");
				setcookie("adm_token", $usrS[0]['usr_codigo'], $expirar, "/");
				echo 1;

			} else {
				echo 0;
			}

		}
	} 
	elseif($_POST['action'] == "logout")
	{
		// TODO: DESTRUIMOS LAS COOKIES DE SESION
		unset($_SESSION);
		setcookie("adm_token",$_COOKIE['adm_token'], 1, "/", false, false);
		session_destroy();
		echo 1;
	}
	elseif($_POST['action'] == "recuperar")
	{
		$prepare = "SELECT usr_id, usr_codigo, usr_nombres, usr_apellidos, usr_email FROM usuarios WHERE usr_email = ? AND est_id = 1";
		$params = [$_POST['user']];
		$types = ['s'];
		$usrS = $toolSQL->selectSQL($prepare, $types, $params);
		if($usrS < 0) 
			echo -1;
		else
		{
			if($usrS == 0) {
				echo 0;
			} else {

				$codigo = $tools->getCode(20).$hora;
				$nombre = explode(" ", $usrS[0]['usr_nombres'])[0];

				$prepare = "INSERT INTO _recuperar (usr_id, rec_codigo) VALUES (?,?)";
				$params = [intval($usrS[0]['usr_id']), $codigo];
				$types = ['i','s'];
				$recI = $toolSQL->insertSQL($prepare, $types, $params);
				
				$mail->mailRecovery($nombre, $_POST['user'], $codigo);
				echo $recI;

			}
		}
	}
	elseif($_POST['action'] == "contrasena")
	{
		$prepare = "SELECT usr_id FROM _recuperar WHERE rec_codigo = ?";
		$params = [$_POST['k']];
		$types = ['s'];
		$rprS = $toolSQL->selectSQL($prepare, $types, $params);
		if($rprS <= 0)
			echo -1;
		else
		{
			$prepare = "UPDATE usuarios SET usr_password = ? WHERE usr_id = ?";
			$params = [
				password_hash($_POST['usr_password'], PASSWORD_BCRYPT),
				intval($rprS[0]['usr_id'])
			];
			$types = ['s','i'];
			$usrU = $toolSQL->updateSQL($prepare, $types, $params);
			echo $usrU;
		}
	}
?>