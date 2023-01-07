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

		$prepare = "SELECT count(1) AS registros FROM centro_costos WHERE borrado_logico = 0 AND (cco_codigo LIKE ? OR cco_nombre LIKE ? OR cco_detalle LIKE ?)";
		$params = [$busqueda, $busqueda, $busqueda];
		$types = ['s','s','s'];
		$ccoS = $toolSQL->selectSQL($prepare, $types, $params);
		if($ccoS < 0)
			echo -1;
		else
		{
			$registros = $ccoS[0]['registros'];
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
				$prepare = "SELECT cco_id, cco_codigo, cco_nombre, cco_detalle FROM centro_costos WHERE borrado_logico = 0 AND (cco_codigo LIKE ? OR cco_nombre LIKE ? OR cco_detalle LIKE ?) ORDER BY cco_codigo ASC LIMIT $inferior, $max";
				$params = [$busqueda, $busqueda, $busqueda];
				$types = ['s','s','s'];
				$ccoS = $toolSQL->selectSQL($prepare, $types, $params);
				if($ccoS < 0)
					echo -2;
				else
					echo json_encode($ccoS)."::".$paginas."::".$pagina."::".$registros."::".$_SESSION['adm_rol'];

			}
		}
	}
	elseif($_POST['action'] == "crear")
	{
		for ($i=0; $i < count($_POST['cco_codigo']); $i++) {

			if($_POST['cco_codigo'][$i] != "") { 

				$prepare = "INSERT INTO centro_costos (cco_codigo, cco_nombre, cco_detalle, cco_creado) VALUES (?,?,?,?)";
				$params = [
					$_POST['cco_codigo'][$i],
					$_POST['cco_nombre'][$i],
					$_POST['cco_detalle'][$i],
					$creado
				];
				$types = ['s','s','s','s'];
				$ccoI = $toolSQL->insertSQL($prepare, $types, $params);
				if($ccoI < 0){
					echo -1;
					exit;
				}
			}
		}
		echo 1;
	}
	elseif($_POST['action'] == "obtener_editar")
	{
		$prepare = "SELECT cco_id, cco_codigo, cco_nombre, cco_detalle FROM centro_costos WHERE cco_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$ccoS = $toolSQL->selectSQL($prepare, $types, $params);
		if($ccoS <= 0)
			echo -1;
		else
			echo json_encode($ccoS);
	}
	elseif($_POST['action'] == "editar")
	{
		$prepare = "UPDATE centro_costos SET cco_codigo = ?, cco_nombre = ?, cco_detalle = ? WHERE cco_id = ?";
		$params = [
			$_POST['cco_codigo'],
			$_POST['cco_nombre'],
			$_POST['cco_detalle'],
			intval($_POST['cco_id'])
		];
		$types = ['s','s','s','i'];
		$ccoU = $toolSQL->updateSQL($prepare, $types, $params);
		echo $ccoU;
	}
	elseif($_POST['action'] == "eliminar")
	{
		$prepare = "UPDATE centro_costos SET borrado_logico = 1 WHERE cco_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$movD = $toolSQL->updateSQL($prepare, $types, $params);
		echo $movD;
	}
?>