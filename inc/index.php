<?php 
	session_start();
	require '_funciones.php';
	$toolSQL = new toolSQL();
	$tools 	 = new tools();


	$creado = date("Y-m-d H:i:s");
	$hora = date("His");


	if($_POST['action'] == "obtener_contacto")
	{
		$prepare = "SELECT con_facebook, con_instagram, con_youtube, con_correo, con_telefono, con_whatsapp, con_textwhats FROM contacto WHERE con_id = ?";
		$params = [1];
		$types = ['i'];
		$conS = $toolSQL->selectSQL($prepare, $types, $params);
		if($conS <= 0)
			echo -1;
		else
			echo json_encode($conS);
	}
	elseif($_POST['action'] == "redes") 
	{
		$prepare = "UPDATE contacto SET con_facebook = ?, con_instagram = ?, con_youtube = ?, con_correo = ? WHERE con_id = 1";
		$params = [
			$_POST['facebook'],
			$_POST['insta'],
			$_POST['youtube'],
			$_POST['email']
		];
		$types = ['s','s','s','s'];
		$conU = $toolSQL->updateSQL($prepare, $types, $params);
		echo $conU;
	}
	elseif($_POST['action'] == "contacto")
	{
		$prepare = "UPDATE contacto SET con_telefono = ?, con_whatsapp = ?, con_textwhats = ? WHERE con_id = 1";
		$params = [
			$_POST['phone'],
			$_POST['whatsapp'],
			$_POST['textw']
		];
		$types = ['s','s','s'];
		$conU = $toolSQL->updateSQL($prepare, $types, $params);
		echo $conU;
	}
	elseif($_POST['action'] == "estadisticas")
	{
		$anio = date("Y");

		// echo "anio == $anio";
		$fecha_inicial = $anio."-01-01 00:00:00";
		$fecha_final = $anio."-12-31 23:59:00";

		// echo "Fecha inicio: $fecha_inicial, Fecha fin: $fecha_final";

		$prepare = "
			SELECT SUM(clc_whatsapp) AS whatsapp, MONTH(clc_creado) AS mes FROM conversiones WHERE clc_creado >= ? AND clc_creado <= ?";
		$params = [$fecha_inicial, $fecha_final];
		$types = ['s','s'];
		$wS = $toolSQL->selectSQL($prepare, $types, $params);
		if($wS < 0)
			echo -1;
		else
		{
			$prepare = "
				SELECT SUM(clc_llamada) AS llamada, MONTH(clc_creado) AS mes FROM conversiones WHERE clc_creado >= ? AND clc_creado <= ?";
			$params = [$fecha_inicial, $fecha_final];
			$types = ['s','s'];
			$lS = $toolSQL->selectSQL($prepare, $types, $params);
			if($lS < 0)
				echo -1;
			else
			{
				$prepare = "SELECT SUM(clc_contacto) AS contacto, MONTH(clc_creado) AS mes FROM conversiones WHERE clc_creado >= ? AND clc_creado <= ?";
				$params = [$fecha_inicial, $fecha_final];
				$types = ['s','s'];
				$cS = $toolSQL->selectSQL($prepare, $types, $params);
				if($cS < 0)
					echo -1;
				else
					echo json_encode($wS)."::".json_encode($lS)."::".json_encode($cS);
			}
		}
	}
?>