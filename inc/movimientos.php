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

		$prepare 	= "
			SELECT COUNT(1) AS registros 
			FROM movimientos mov 
			INNER JOIN centro_costos cco ON(cco.cco_id = mov.cco_id) 
			left JOIN bancos ban ON(ban.ban_id = mov.ban_id) 
			left JOIN cajas caj ON(caj.caj_id = mov.caj_id) 
			INNER JOIN empresas emp ON(emp.emp_id = mov.emp_id) 
			WHERE mov.mov_id LIKE ? OR mov.mov_fecha LIKE ? OR mov.mov_detalle LIKE ? OR cco.cco_nombre LIKE ? OR ban.ban_nombre LIKE ? OR caj.caj_nombre LIKE ? OR emp.emp_id LIKE ?";
		$params 	= [$busqueda, $busqueda, $busqueda, $busqueda, $busqueda, $busqueda, $busqueda];
		$types		= ['s', 's', 's','s','s','s','s'];
		$usrS		= $toolSQL->selectSQL($prepare, $types, $params);
		if($usrS < 0)
			echo -1;
		else
		{
			$registros = $usrS[0]['registros'];
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
				$prepare 	= "
					SELECT mov_id, mov_fecha, mov_valor, mov_detalle, cco.cco_codigo, cco.cco_nombre, ban.ban_numero, ban.ban_nombre, caj.caj_id, caj.caj_nombre, emp.emp_nombre
					FROM movimientos mov 
					INNER JOIN centro_costos cco ON(cco.cco_id = mov.cco_id) 
					left JOIN bancos ban ON(ban.ban_id = mov.ban_id) 
					left JOIN cajas caj ON(caj.caj_id = mov.caj_id) 
					INNER JOIN empresas emp ON(emp.emp_id = mov.emp_id) 
					WHERE mov.mov_id LIKE ? OR mov.mov_fecha LIKE ? OR mov.mov_detalle LIKE ? OR cco.cco_nombre LIKE ? OR ban.ban_nombre LIKE ? OR caj.caj_nombre LIKE ? OR emp.emp_id LIKE ?";
				$params 	= [$busqueda, $busqueda, $busqueda, $busqueda, $busqueda, $busqueda, $busqueda];
				$types		= ['s', 's', 's','s','s','s','s'];
				$usrS		= $toolSQL->selectSQL($prepare, $types, $params);
				if($usrS < 0)
					echo -1;
				else
					echo json_encode($usrS)."::".$paginas."::".$pagina."::".$registros."::".$_SESSION['adm_rol'];
			}
		}
	}
	elseif($_POST['action'] == "obtener_crear")
	{
		$prepare = "SELECT cco_id, cco_codigo, cco_nombre FROM centro_costos WHERE ?";
		$params = [1];
		$types = ['i'];
		$ccoS = $toolSQL->selectSQL($prepare, $types, $params);
		if($ccoS < 0)
			echo -1;
		else
		{
			$prepare = "SELECT ban_id, ban_nombre, ban_numero FROM bancos WHERE ?";
			$params = [1];
			$types = ['i'];
			$banS = $toolSQL->selectSQL($prepare, $types, $params);
			if($banS < 0)
				echo -2;
			else
			{
				$prepare = "SELECT caj_id, caj_nombre FROM cajas WHERE ?";
				$params = [1];
				$types = ['i'];
				$cajS = $toolSQL->selectSQL($prepare, $types, $params);
				if($cajS < 0)
					echo -3;
				else
				{
					$prepare = "SELECT emp_id, emp_nombre FROM empresas WHERE ?";
					$params = [1];
					$types = ['i'];
					$empS = $toolSQL->selectSQL($prepare, $types, $params);
					if($empS < 0)
						echo -4;
					else
					{
						$prepare = "SELECT mov_id FROM movimientos WHERE ? ORDER BY mov_id DESC LIMIT 1";
						$params = [1];
						$types = ['i'];
						$movS = $toolSQL->selectSQL($prepare, $types, $params);
						if($movS < 0)
							echo -5;
						else
						{
							$prepare = "SELECT mtp_id, mtp_nombre FROM _movimientos_tipos WHERE ?";
							$params = [1];
							$types = ['i'];
							$mtpS = $toolSQL->selectSQL($prepare, $types, $params);
							if($mtpS < 0)
								echo -6;
							else	
								echo json_encode($ccoS)."::".json_encode($banS)."::".json_encode($cajS)."::".json_encode($empS)."::",json_encode($movS)."::".json_encode($mtpS);
						}
					}
				}
			}	
		}
	}
	elseif($_POST['action'] == "crear")
	{
		for ($i=0; $i < count($_POST['mov_fecha']); $i++) { 
			
			if($_POST['mtp_id'][$i] != "") {

				$suc_id = explode(":", $_POST['suc_id'][$i]);
				$ban_id = $suc_id[1] == 1 ? $suc_id[0] : 0;
				$caj_id = $suc_id[1] == 2 ? $suc_id[0] : 0;

				$valor = $tools->desajustar_valor($_POST['mov_valor'][$i]);
				$prepare = "INSERT INTO movimientos (mov_detalle, mov_fecha, mov_valor, mtp_id, cco_id, ban_id, caj_id, emp_id, mov_observacion, mov_creado) VALUES (?,?,?,?,?,?,?,?,?,?)";
				$params = [
					$_POST['mov_detalle'][$i],
					$_POST['mov_fecha'][$i],
					doubleval($valor),
					intval($_POST['mtp_id'][$i]),
					intval($_POST['cco_id'][$i]),
					intval($ban_id),
					intval($caj_id),
					intval($_POST['emp_id'][$i]),
					$_POST['mov_observaciones'][$i],
					$creado,
				];
				$types = ['s','s','d','i','i','i','i','i','s','s'];
				$movS = $toolSQL->insertSQL($prepare, $types, $params);
				if($movS < 0) {
					echo -1;
					exit;
				}	
			}
		}
		echo 1;
	}

?>