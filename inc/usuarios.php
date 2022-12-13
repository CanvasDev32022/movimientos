<?php 
	session_start();
	require '_funciones.php';
	$toolSQL = new toolSQL();
	$tools 	 = new tools();


	$creado = date("Y-m-d H:i:s");
	$hora = date("His");

	if($_POST['action'] == "lista") 
	{
		$idioma		= $_POST['idioma'];
		$busqueda 	= $_POST['busqueda'];
		$pagina		= $_POST['pagina'];
		$max		= $cms_max_results['usuarios'];
		$busqueda = "%".$busqueda."%";

		$prepare 	= "SELECT COUNT(1) AS registros FROM usuarios usr INNER JOIN roles rol ON rol.rol_id = usr.rol_id INNER JOIN _estados est ON est.est_id = usr.est_id WHERE borrado_logico = 0 AND (usr_nombres LIKE ? OR usr_apellidos LIKE ? OR rol.rol_nombre_$idioma LIKE ? OR est.est_nombre_$idioma LIKE ?)";
		$params 	= [$busqueda, $busqueda, $busqueda, $busqueda];
		$types		= ['s', 's', 's','s'];
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
				$prepare 	= "SELECT usr_id, usr_nombres, usr_apellidos, rol.rol_nombre_$idioma, usr.est_id FROM usuarios usr INNER JOIN roles rol ON rol.rol_id = usr.rol_id INNER JOIN _estados est ON est.est_id = usr.est_id WHERE borrado_logico = 0 AND (usr_nombres LIKE ? OR usr_apellidos LIKE ? OR rol.rol_nombre_$idioma LIKE ? OR est.est_nombre_$idioma LIKE ?) ORDER BY usr_nombres ASC LIMIT $inferior, $max ";
				$params 	= [$busqueda, $busqueda, $busqueda, $busqueda];
				$types		= ['s', 's', 's','s'];
				$usrS		= $toolSQL->selectSQL($prepare, $types, $params);
				if($usrS < 0)
					echo -2;
				else
					echo json_encode($usrS)."::".$paginas."::".$pagina."::".$registros."::".$_SESSION['adm_rol'];
			}
		}	
	}
	elseif($_POST['action'] == "obtener_crear") 
	{
		$idioma = $_POST['idioma'];
		$prepare 	= "SELECT rol_id, rol_nombre_$idioma FROM roles WHERE ?";
		$params 	= [1];
		$types		= ['i'];
		$rolS 		= $toolSQL->selectSQL($prepare, $types, $params);
		if($rolS <= 0)
			echo -1;
		else
		{
			$prepare 	= "SELECT est_id, est_nombre_$idioma FROM _estados WHERE ?";
			$params 	= [1];
			$types		= ['i'];
			$estS 		= $toolSQL->selectSQL($prepare, $types, $params);
			if($estS <= 0)
				echo -2;
			else
				echo json_encode($rolS)."::".json_encode($estS);
		}
	}
	elseif($_POST['action'] == "crear")
	{
		$prepare = "SELECT COUNT(1) AS conteo FROM usuarios WHERE usr_email = ? AND borrado_logico = 0";
		$params = [$_POST['usr_email']];
		$types = ['s'];
		$usrS = $toolSQL->selectSQL($prepare, $types, $params);
		if($usrS < 0)
			echo -1;
		else
		{
			$registros = $usrS[0]['conteo'];
			if($registros > 0) {
				echo 0;
			} else {
					
				$codigo = $tools->getCode(20);
				$prepare = "INSERT INTO usuarios (usr_codigo, usr_nombres, usr_apellidos, usr_email, usr_password, rol_id, est_id, usr_creado) VALUES (?,?,?,?,?,?,?,?)";
				$params = [
					$codigo,
					$_POST['usr_nombres'],
					$_POST['usr_apellidos'],
					$_POST['usr_email'],
					password_hash($_POST['usr_password'], PASSWORD_BCRYPT),
					intval($_POST['usr_rol']),
					intval($_POST['est_id']),
					$creado
				];
				$types = ['s','s','s','s','s','i','i','s'];
				$usrI = $toolSQL->insertSQL($prepare, $types, $params);
				echo $usrI;
			}
		}
	}
	elseif($_POST['action'] == "obtener_editar")
	{
		$idioma = $_POST['idioma'];
		$prepare = "SELECT usr_id, usr_nombres, usr_apellidos, usr_email, usr_password, rol_id, est_id FROM usuarios WHERE usr_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$usrS = $toolSQL->selectSQL($prepare, $types, $params);
		if($usrS <= 0)
			echo -1;
		else 
		{
			$prepare 	= "SELECT rol_id, rol_nombre_$idioma FROM roles WHERE ?";
			$params 	= [1];
			$types		= ['i'];
			$rolS 		= $toolSQL->selectSQL($prepare, $types, $params);
			if($rolS <= 0)
				echo -2;
			else
			{
				$prepare 	= "SELECT est_id, est_nombre_$idioma FROM _estados WHERE ?";
				$params 	= [1];
				$types		= ['i'];
				$estS 		= $toolSQL->selectSQL($prepare, $types, $params);
				if($estS <= 0)
					echo -3;
				else
					echo json_encode($usrS)."::".json_encode($rolS)."::".json_encode($estS);
			}
		}
	}
	elseif($_POST['action'] == "editar")
	{
		if($_POST['usr_password']) {

			$prepare = "UPDATE usuarios SET usr_nombres = ?, usr_apellidos = ?, usr_password = ?, rol_id = ?, est_id = ? WHERE usr_id = ?";
			$params = [
				$_POST['usr_nombres'],
				$_POST['usr_apellidos'],
				password_hash($_POST['usr_password'], PASSWORD_BCRYPT),
				intval($_POST['usr_rol']),
				intval($_POST['est_id']),
				intval($_POST['usr_id'])
			];
			$types = ['s','s','s','i','i','i'];

		} else {

			$prepare = "UPDATE usuarios SET usr_nombres = ?, usr_apellidos = ?, rol_id = ?, est_id = ? WHERE usr_id = ?";
			$params = [
				$_POST['usr_nombres'],
				$_POST['usr_apellidos'],
				intval($_POST['usr_rol']),
				intval($_POST['est_id']),
				intval($_POST['usr_id'])
			];
			$types = ['s','s','i','i','i'];
		}
		$usrU = $toolSQL->updateSQL($prepare, $types, $params);
		echo $usrU;
	}
	elseif($_POST['action'] == "eliminar")
	{
		$prepare = "UPDATE usuarios SET borrado_logico = 1 WHERE usr_id = ?";
		$params = [intval($_POST['id'])];
		$types = ['i'];
		$usrD = $toolSQL->updateSQL($prepare, $types, $params);
		echo $usrD;
	}
?>