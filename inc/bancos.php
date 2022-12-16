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

		$prepare = "SELECT count(1) AS registros FROM bancos ban INNER JOIN _bancos_tipos btp ON(btp.btp_id = ban.btp_id) WHERE borrado_logico = 0 AND (ban_nombre LIKE ? OR ban_numero LIKE ? OR btp.btp_nombre LIKE ?)";
		$params = [$busqueda, $busqueda, $busqueda];
		$types = ['s','s','s'];
		$banS = $toolSQL->selectSQL($prepare, $types, $params);
		if($banS < 0)
			echo -1;
		else
		{
			$registros = $banS[0]['registros'];
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
				$prepare = "SELECT ban_id, ban_nombre, ban_numero, btp.btp_nombre, ban_monto FROM bancos ban INNER JOIN _bancos_tipos btp ON(btp.btp_id = ban.btp_id) WHERE borrado_logico = 0 AND (ban_nombre LIKE ? OR ban_numero LIKE ? OR btp.btp_nombre LIKE ?) ORDER BY ban_creado DESC LIMIT $inferior, $max";
				$params = [$busqueda, $busqueda, $busqueda];
				$types = ['s','s','s'];
				$banS = $toolSQL->selectSQL($prepare, $types, $params);
				if($banS < 0)
					echo -2;
				else
					echo json_encode($banS)."::".$paginas."::".$pagina."::".$registros."::".$_SESSION['adm_rol'];

			}
		}
	}
	elseif($_POST['action'] == "obtener_crear")
	{
		$idioma = $_POST['idioma'];
		$prepare = "SELECT btp_id, btp_nombre FROM _bancos_tipos WHERE ?";
		$params = [1];
		$types = ['i'];
		$btpS = $toolSQL->selectSQL($prepare, $types, $params);
		if($btpS < 0)
			echo -1;
		else
			echo json_encode($btpS);
	}
	elseif($_POST['action'] == "crear")
	{
		for ($i=0; $i < count($_POST['ban_numero']); $i++) { 
			
			if($_POST['ban_numero'][$i]) {

				$monto = $tools->desajustar_valor($_POST['ban_monto'][$i]);
				$prepare = "INSERT INTO bancos (ban_numero, ban_nombre, btp_id, ban_monto, ban_creado) VALUES (?,?,?,?,?)";
				$params = [
					doubleval($_POST['ban_numero'][$i]),
					$_POST['ban_nombre'][$i],
					intval($_POST['btp_id'][$i]),
					doubleval($monto),
					$creado
				];
				$types = ['d','s','i','d','s'];
				$banI = $toolSQL->insertSQL($prepare, $types, $params);
				if($banI < 0) {
					echo -1;
					exit;
				}
			}
		}
		echo 1;
	}
	elseif($_POST['action'] == "obtener_editar")
	{
		$idioma = $_POST['idioma'];
		$prepare = "SELECT ban_id, ban_numero, ban_nombre, btp_id, ban_monto FROM bancos WHERE ban_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$banS = $toolSQL->selectSQL($prepare, $types, $params);
		if($banS <= 0)
			echo -1;
		else
		{
			$prepare = "SELECT btp_id, btp_nombre FROM _bancos_tipos WHERE ?";
			$params = [1];
			$types = ['i'];
			$btpS = $toolSQL->selectSQL($prepare, $types, $params);
			if($btpS < 0)
				echo -2;
			else
				echo json_encode($banS)."::".json_encode($btpS);
		}		
	}
	elseif($_POST['action'] == "editar")
	{
		$monto = $tools->desajustar_valor($_POST['ban_monto']);
		$prepare = "UPDATE bancos SET ban_numero = ?, ban_nombre = ?, btp_id = ?, ban_monto = ? WHERE ban_id = ?";
		$params = [
			doubleval($_POST['ban_numero']),
			$_POST['ban_nombre'],
			intval($_POST['btp_id']),
			doubleval($monto),
			intval($_POST['ban_id'])
		];
		$types = ['d','s','i','d','i'];
		$banU = $toolSQL->updateSQL($prepare, $types, $params);
		echo $banU;
	}
	elseif($_POST['action'] == "eliminar")
	{
		$prepare = "UPDATE bancos SET borrado_logico = 1 WHERE ban_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$banD = $toolSQL->updateSQL($prepare, $types, $params);
		echo $banD;
	}
	elseif($_POST['action'] == "obtener_bancos")
	{
		$prepare = "SELECT ban_id, ban_nombre, ban_numero FROM bancos WHERE ?";
		$params = [1];
		$types = ['i'];
		$banS = $toolSQL->selectSQL($prepare, $types, $params);
		if($banS < 0)
			echo -2;
		else
			echo json_encode($banS);
	}
?>