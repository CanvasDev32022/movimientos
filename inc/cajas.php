<?php 
	session_start();
	require '_funciones.php';
	$toolSQL = new toolSQL();
	$tools 	 = new tools();
	$sesion = new session();
	$sesion->obtenerCredenciales();


	$creado = date("Y-m-d H:i:s");
	$hora = date("His");


	if($_POST['action'] == "lista")
	{
		$idioma		= $_POST['idioma'];
		$busqueda 	= $_POST['busqueda'];
		$pagina		= $_POST['pagina'];
		$max		= $cms_max_results['usuarios'];
		$busqueda = "%".$busqueda."%";

		$prepare = "SELECT count(1) AS registros FROM cajas WHERE borrado_logico = 0 AND (caj_nombre LIKE ? OR caj_monto LIKE ?)";
		$params = [$busqueda, $busqueda];
		$types = ['s','s'];
		$cajS = $toolSQL->selectSQL($prepare, $types, $params);
		if($cajS < 0)
			echo -1;
		else
		{
			$registros = $cajS[0]['registros'];
			if($registros == 0) {
				echo "0::".$_SESSION['adm_rol'];
			} else {

				// Calculamos el número de páginas
				$paginas = ceil($registros / $max);
				// Ajustamos la página actual en caso de que no exista
				if($pagina > $paginas)
					$pagina = $paginas;
				// Calculamos el rango inferior de registros a traer
				$inferior = $max * ($pagina - 1);
				// Consulta de Búsqueda
				$prepare = "SELECT caj_id, caj_nombre, caj_monto FROM cajas WHERE borrado_logico = 0 AND (caj_nombre LIKE ? OR caj_monto LIKE ?) ORDER BY caj_creado DESC LIMIT $inferior, $max";
				$params = [$busqueda, $busqueda];
				$types = ['s','s'];
				$cajS = $toolSQL->selectSQL($prepare, $types, $params);
				if($cajS < 0)
					echo -2;
				else
					echo json_encode($cajS)."::".$paginas."::".$pagina."::".$registros."::".$_SESSION['adm_rol'];

			}
		}
	}
	elseif($_POST['action'] == "crear")
	{
		for ($i=0; $i < count($_POST['caj_nombre']); $i++) { 
			
			if($_POST['caj_nombre'][$i] != "") {

				$valor = $tools->desajustar_valor($_POST['caj_monto'][$i]);
				$prepare = "INSERT INTO cajas (caj_nombre, caj_monto, caj_creado) VALUES (?,?,?)";
				$params = [
					$_POST['caj_nombre'][$i],
					doubleval($valor),
					$creado
				];
				$types = ['s','d','s'];
				$cajI = $toolSQL->insertSQL($prepare, $types, $params);
				if($cajI < 0) {
					echo -1;
					exit;
				}
			}
		}
		echo 1;
	}
?>