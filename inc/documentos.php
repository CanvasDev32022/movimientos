<?php 
	session_start();
	require("_funciones.php");
	$toolSQL = new toolSQL();
	$tools   = new tools();

	$creado = date("Y-m-d H:i:s");
	$hora = date("His");


	if($_POST['action'] == "subir_imagen")
	{
		$ruta = "../../uploads/archivos/";
		if($_FILES['prd_galeria']['type'] != "") {
			$archivo = "";
			$tmp_extension = mime_content_type($_FILES['prd_galeria']['tmp_name']);
			$extension = explode("/", $tmp_extension)[1];
			$nombre = $tools->getCode(20).$hora;
			$archivo = $nombre.".".$extension;
			move_uploaded_file($_FILES['prd_galeria']['tmp_name'], $ruta.$archivo);

			// TODO: Verificamos que la imagen no supere el tamaño máximo
			$size = getimagesize($ruta.$archivo);
			if($size > $cms_image_width['prd_galeria']['imagen'])
				// TODO: Redimensionamos la imagen y generamos el imagen
				$tools->imageResize($ruta, $archivo, $cms_image_width['prd_galeria']['imagen']);
			else
				// TODO: Creamos la imagen WEBP
				$tools->img2webp($archivo, $nombre.".webp");

		} else {
			$archivo = "";
		}

		echo $archivo;
	}
	elseif($_POST['action'] == "eliminar")
	{
		$ruta = "../../uploads/archivos/";
		$archivo = explode("/", $_POST['archivo'])[1];
		$webp = explode(".", $archivo);
		unlink($ruta.$archivo);
		unlink($ruta.$webp[0].".webp");
		echo 1;
	}


?>