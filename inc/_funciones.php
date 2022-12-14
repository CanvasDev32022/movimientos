<?php 
	require_once("_config.php");
	date_default_timezone_set('America/Bogota');
	// Activar / Descativar DEBUG
	if(DEBUG == "true")
		ini_set('display_errors', 1);
	else
		ini_set('display_errors', 0);

	class toolSQL
	{
		function consoleLOG($data){echo '<script>console.log('. json_encode( $data ) .')</script>';}
		
		function dbConnect()
		{
			$sql = mysqli_connect(SERVER, USER, PASS, DB);
			if(!$sql)
			{
				echo 'Ha ocurrido un error inesperado en la conexión de la base de datos<br>';
				exit();
			}
			mysqli_query ($sql,"SET NAMES 'utf8'");
			mysqli_set_charset($sql, "utf8");
			return $sql;
		}

		function dbDisconnect($sql)
		{
			$close = mysqli_close($sql);
			if(!$close)
				echo 'Ha ocurrido un error inexperado en la desconexión de la base de datos<br>';
			return $close;
		}

		function selectSQL($prepare, $type, $params)
		{
			/* Verifico que los tipos de datos coincidan con los parámetros*/
			if($this->typesVerify($params, $type))
			{
				$data = array();
				/* Realiza la conexión*/
				$sql = $this->dbConnect();
				/* Se prepara la sentencia, retorna -1 ante un error || retorna array de resultados.*/
				if($stmt = $sql->prepare($prepare))
				{
					/* Arreglo de parámetros finales*/
					$a_params = array();

					/* Se referencian los parámetros*/
					$param_type = '';
					$n = count($type);
					for($i = 0; $i < $n; $i++)
						$param_type .= $type[$i];

					$a_params[] = & $param_type;

					for($i = 0; $i < $n; $i++)
						$a_params[] = & $params[$i];

					/* Envío de parámetros */
					call_user_func_array(array($stmt, 'bind_param'), $a_params);

					$stmt->execute();
					$result = $stmt->get_result();
					if($result)
					{
						if($result->num_rows > 0)
						{
							while ($row = $result->fetch_assoc()) 
								array_push($data, $row);

							$stmt->close();
							$this->dbDisconnect($sql);
							return $data;
						}
						else
						{
							$stmt->close();
							$this->dbDisconnect($sql);
							return 0;
						}
					}
					else
					{
						$this->errorLog($query, mysqli_error($sql));
						$stmt->close();
						$this->dbDisconnect($sql);
						return -1;
					}
				}
				else
				{
					$this->errorLog($prepare, mysqli_error($sql));
					$this->dbDisconnect($sql);
					return -2;
				}
			}
			else
				return -3;				
		}

		function insertSQL($prepare, $type, $params)
		{
			if($this->typesVerify($params, $type))
			{
				$data = array();
				/* Realiza la conexión*/
				$sql = $this->dbConnect();
				/* Se prepara la sentencia, retorna -1 ante un error || retorna array de resultados.*/
				if($stmt = $sql->prepare($prepare))
				{
					/* Arreglo de parámetros finales*/
					$a_params = array();

					/* Se referencian los parámetros*/
					$param_type = '';
					$n = count($type);
					for($i = 0; $i < $n; $i++)
						$param_type .= $type[$i];

					$a_params[] = & $param_type;

					for($i = 0; $i < $n; $i++)
						$a_params[] = & $params[$i];

					/* Envío de parámetros */
					call_user_func_array(array($stmt, 'bind_param'), $a_params);

					if($stmt->execute())
					{
						if(isset($_SESSION) && count($_SESSION) > 2)
							$this->historyLog($prepare, $params, $_SESSION['adm_id'], $_SESSION['adm_completo']);

						$stmt->close();
						return 1;
					}
					else
					{
						$this->errorLog($query, mysqli_error($sql));
						$stmt->close();
						$this->dbDisconnect($sql);
						return -1;
					}
				}
				else
				{
					$this->errorLog($query, mysqli_error($sql));
					$stmt->close();
					$this->dbDisconnect($sql);
					return -2;
				}
			}
			else
				return -3;
		}

		function updateSQL($prepare, $type, $params)
		{
			if($this->typesVerify($params, $type))
			{
				$data = array();
				/* Realiza la conexión*/
				$sql = $this->dbConnect();
				/* Se prepara la sentencia, retorna -1 ante un error || retorna array de resultados.*/
				if($stmt = $sql->prepare($prepare))
				{
					/* Arreglo de parámetros finales*/
					$a_params = array();

					/* Se referencian los parámetros*/
					$param_type = '';
					$n = count($type);
					for($i = 0; $i < $n; $i++)
						$param_type .= $type[$i];

					$a_params[] = & $param_type;

					for($i = 0; $i < $n; $i++)
						$a_params[] = & $params[$i];

					/* Envío de parámetros */
					call_user_func_array(array($stmt, 'bind_param'), $a_params);

					if($stmt->execute())
					{
						if(isset($_SESSION) && count($_SESSION) > 2)
							$this->historyLog($prepare, $params, $_SESSION['adm_id'], $_SESSION['adm_completo']);

						$stmt->close();
						return 1;
					}
					else
					{
						$this->errorLog($query, mysqli_error($sql));
						$stmt->close();
						$this->dbDisconnect($sql);
						return -1;
					}
				}
				else
				{
					$this->errorLog($query, mysqli_error($sql));
					$stmt->close();
					$this->dbDisconnect($sql);
					return -2;
				}
			}
			else
				return -3;
		}

		function deleteSQL($prepare, $type, $params)
		{
			if($this->typesVerify($params, $type))
			{
				$data = array();
				/* Realiza la conexión*/
				$sql = $this->dbConnect();
				/* Se prepara la sentencia, retorna -1 ante un error || retorna array de resultados.*/
				if($stmt = $sql->prepare($prepare))
				{
					/* Arreglo de parámetros finales*/
					$a_params = array();

					/* Se referencian los parámetros*/
					$param_type = '';
					$n = count($type);
					for($i = 0; $i < $n; $i++)
						$param_type .= $type[$i];

					$a_params[] = & $param_type;

					for($i = 0; $i < $n; $i++)
						$a_params[] = & $params[$i];

					/* Envío de parámetros */
					call_user_func_array(array($stmt, 'bind_param'), $a_params);

					if($stmt->execute())
					{
						if(isset($_SESSION) && count($_SESSION) > 2)
							$this->historyLog($prepare, $params, $_SESSION['adm_id'], $_SESSION['adm_completo']);

						$stmt->close();
						return 1;
					}
					else
					{
						$this->errorLog($query, mysqli_error($sql));
						$stmt->close();
						$this->dbDisconnect($sql);
						return -1;
					}
				}
				else
				{
					$this->errorLog($query, mysqli_error($sql));
					$stmt->close();
					$this->dbDisconnect($sql);
					return -2;
				}
			}
			else
				return -3;
		}

		function typesVerify($params, $types)
		{
			foreach ($params as $key => $value)
			{
				if(gettype($value)[0] != $types[$key])
					return 0;
			}
			return 1;
		}

		function errorLog($query, $error)
		{
			$file = fopen('query_error.log','a');
			fwrite($file,"[".date("r")."] [$error] [$query]\r\n");
			fclose($file);
		}

		function historyLog($prepare, $params, $id, $usuario)
		{
			$file = fopen('history.log','a');
			$parametros = "";
			foreach ($params as $key => $value)
			{
				$parametros = $parametros.",".$value;
			}
			$parametros = trim($parametros, ",");

			fwrite($file,"[".date("r")."] [id:$id - user:$usuario]\r\n[$prepare]\r\n[$parametros]\r\n\r\n");
			fclose($file);
		}

		function getIP()
		{
			if (isset($_SERVER["HTTP_CLIENT_IP"]))
				return $_SERVER["HTTP_CLIENT_IP"];
			elseif (isset($_SERVER["HTTP_X_FORWARDED_FOR"]))
				return $_SERVER["HTTP_X_FORWARDED_FOR"];
			elseif (isset($_SERVER["HTTP_X_FORWARDED"]))
				return $_SERVER["HTTP_X_FORWARDED"];
			elseif (isset($_SERVER["HTTP_FORWARDED_FOR"]))
				return $_SERVER["HTTP_FORWARDED_FOR"];
			elseif (isset($_SERVER["HTTP_FORWARDED"]))
				return $_SERVER["HTTP_FORWARDED"];
			else
				return $_SERVER["REMOTE_ADDR"];
		}

		function generarSlug($cadena)
		{
			$cadena = str_replace(
				array('á', 'à', 'ä', 'â', 'ª', 'Á', 'À', 'Â', 'Ä'),
				array('a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a'),
				$cadena);

			$cadena = str_replace(
				array('é', 'è', 'ë', 'ê', 'É', 'È', 'Ê', 'Ë'),
				array('e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'),
				$cadena);

			$cadena = str_replace(
				array('í', 'ì', 'ï', 'î', 'Í', 'Ì', 'Ï', 'Î'),
				array('i', 'i', 'i', 'i', 'i', 'i', 'i', 'i'),
				$cadena);

			$cadena = str_replace(
				array('ó', 'ò', 'ö', 'ô', 'Ó', 'Ò', 'Ö', 'Ô'),
				array('o', 'o', 'o', 'o', 'o', 'o', 'o', 'o'),
				$cadena);

			$cadena = str_replace(
				array('ú', 'ù', 'ü', 'û', 'Ú', 'Ù', 'Û', 'Ü'),
				array('u', 'u', 'u', 'u', 'u', 'u', 'u', 'u'),
				$cadena);

			$cadena = str_replace(
				array('ñ', 'Ñ', 'ç', 'Ç', ' ', '"', "'", ',', '.','%'),
				array('n', 'n', 'c', 'c', '-', '', '', '', '','<'),
				$cadena);

			$cadena = strtolower($cadena);
				return $cadena;
		}
	}
		
	class tools
	{
		function getCode($length = 10){
			$code = '';

			$pattern = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890';
			$max = strlen($pattern)-1;
			for($i=0;$i < $length ;$i++) 
				$code .= $pattern[mt_rand(0,$max)];

			return $code;
		}

		function valor2str($valor){
			$valor = str_replace(
		        array('$', '.'),array('', ''),$valor);
			return $valor;
		}

		function desajustar_valor($valor)
		{
			$valor = str_replace(
		        array('$', '.'),
		        array('', ''),
		        $valor);

			return $valor;
		}

		function desajustar_porcentaje($valor)
		{
			$valor = str_replace(
		        array('%', '.'),
		        array('', ''),
		        $valor);

			return $valor;
		}

		// TODO: Funcion para guardado de imagenes
		function guardarImg($ruta, $index, $cms_width) 
		{
			$hora = $GLOBALS['hora'];
			$cms_image_width = $GLOBALS['cms_image_width'];
			if($_FILES[$index]['type'] != "") {
				$archivo = "";
				$tmp_extension = mime_content_type($_FILES[$index]['tmp_name']);
				$extension = explode("/", $tmp_extension)[1];
				$nombre = $this->getCode(20).$hora;
				$archivo = $nombre.".".$extension;
				move_uploaded_file($_FILES[$index]['tmp_name'], $ruta.$archivo);

				// TODO: Verificamos que la imagen no supere el tamaño máximo
				$size = getimagesize($ruta.$archivo);
				if($size > $cms_image_width[$cms_width]['imagen'])
					// TODO: Redimensionamos la imagen y generamos el imagen
					$this->imageResize($ruta, $archivo, $cms_image_width[$cms_width]['imagen']);
				else
					// TODO: Creamos la imagen WEBP
					$this->img2webp($archivo, $nombre.".webp");

			} else {
				$archivo = "";
			}

			return $archivo;
		}

		// TODO: Funcion para eliminacion de imagenes
		function eliminarImg($ruta, $archivo)
		{
			$webp = explode(".", $archivo);
			unlink($ruta.$archivo);
			unlink($ruta.$webp[0].".webp");
		}

		function imageResize($url, $image, $width, $tipo='')
		{
			// Calculamos el alto basado en el RATIO
			$size = getimagesize($url.$image);
			$ratio = $size[0] / $size[1];
			$height = round($width / $ratio); 

			// Ejecutamos la función dependiendo la extensión
			$archivo = explode(".", $image);
			if($archivo[1] =="jpg" || $archivo[1] =="jpeg") $nuevo = imagecreatefromjpeg($url.$image);
			if($archivo[1] =="png") $nuevo = imagecreatefrompng($url.$image);
			if($archivo[1] =="gif") $nuevo = imagecreatefromgif($url.$image);

			// Se genera la imagen
			$thumb = imagecreatetruecolor($width, $height);
			imagecopyresampled($thumb,$nuevo,0,0,0,0,$width,$height,$size[0],$size[1]);

			$thumb_name = $url.$archivo[0].$tipo.".".$archivo[1];

			if($archivo[1] =="jpg" || $archivo[1] =="jpeg") imagejpeg($thumb, $thumb_name,80);
			if($archivo[1] =="png") imagepng($thumb, $thumb_name);
			if($archivo[1] =="gif") imagegif($thumb, $thumb_name);

			$this->img2webp($thumb_name, $url.$archivo[0].$tipo.".webp");
		}

		function img2webp($source, $destination, $quality=80) 
		{
			$extension = pathinfo($source, PATHINFO_EXTENSION);  	
			if($extension == 'jpeg' || $extension == 'jpg')   		
			$image = imagecreatefromjpeg($source);  	
			elseif ($extension == 'gif')   		
			$image = imagecreatefromgif($source);  	
			elseif ($extension == 'png')   		
			$image = imagecreatefrompng($source);  	
			return imagewebp($image, $destination, $quality);  	  
		}

		function validar_acceso($index, $usr_rol)
		{
			include("_vars.php");
			$roles = explode(",", $cms_seccion[$index]['acceso']);
			$indexA = array_search($usr_rol, $roles);
			if($indexA !== false)
				return 1;
			else
				return 0;
		}

		// TODO: Funcion de tiempo para verse en H:i:s (00:00:00)
		function convertir_tiempo($min) 
		{
			$segundos = $min * 60;
			$minutos = floor($min);
			$horas = floor($min / 60);
			$minutos2 = $minutos % 60;
			$segundos2 = $minutos % 60 % 60 % 60;

			$minutos2 = $minutos2 < 10 ? "0".$minutos2 : $minutos2;
			$segundos2 = $segundos2 < 10 ? "0".$segundos2 : $segundos2;
			$horas = $horas < 10 ? "0".$horas : $horas;


			return $horas.":".$minutos2.":".$segundos2;
		}
	}
	
	class session
	{
		function accessAdmin()
		{
			require('../config/inc/variables.php');
			$toolSQL = new toolSQL();
			/* Acceso al Admin */
			if(isset($_SESSION['token']))
			{
				$usr_id = $_SESSION['id'];
				$usr_token = $_SESSION['token'];
				$usr_ip = $toolSQL->getIP();

				$prepare = "SELECT cnx_token FROM _conexiones WHERE usr_id = ? AND cnx_ip = ? AND cnx_estado = ? ORDER BY cnx_creado DESC LIMIT 1";
				$params = [$usr_id, $usr_ip, 1];
				$types = ['i','s','i'];
				$cnx = $toolSQL->selectSQL($prepare, $types, $params);

				if(password_verify($usr_token, $cnx[0][0]))
				{
					$prepare = "SELECT rol_id FROM usuarios WHERE usr_id = ?";
					$params = [$usr_id];
					$types = ['i'];
					$usr = $toolSQL->selectSQL($prepare, $types, $params);
					if($usr[0][0] == 1)
					{
						return 1;
					}
					else
					{
						$toolSQL->consoleLOG('Rol Errado');
						$_SESSION['notification'] = ['acceso_rol', 'warning'];
						return -1;
					}
				}
				else
				{
					$toolSQL->consoleLOG('El token no coincide');
					$_SESSION['notification'] = ['acceso_login', 'warning'];
					return 0;
				}
			}
			else
			{
				$toolSQL->consoleLOG('No existe Token');
				$_SESSION['notification'] = ['acceso_login', 'warning'];
				return 0;
			}
		}

		/*
			0 	-> Debe iniciar sesión
			-1	-> No tiene acceso al módulo
			1	-> Credenciales correctas
		*/

		function obtenerCredenciales() {

			$toolSQL = new toolSQL();
			if(!isset($_SESSION['adm_id'])) {
			
				$prepare = "SELECT usr_id, usr_nombres, usr_apellidos, usr_password, rol_id, usr_codigo FROM usuarios WHERE usr_codigo = ?";
				$params = [$_COOKIE['adm_token']];
				$types = ['s'];
				$usrS = $toolSQL->selectSQL($prepare, $types, $params);

				if($usrS > 0) {
					
					$nombre = explode(" ", $usrS[0]['usr_nombres'])[0];
					$_SESSION['adm_id'] = $usrS[0]['usr_id'];
					$_SESSION['adm_nombre'] = $nombre;
					$_SESSION['adm_rol'] = $usrS[0]['rol_id'];
					$_SESSION['adm_completo'] = $usrS[0]['usr_nombres']." ".$usrS[0]['usr_apellidos'];
					$_SESSION['adm_codigo'] = $usrS[0]['usr_codigo'];
				}
			}
		}
	}

?>