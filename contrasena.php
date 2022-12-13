<?php 
	$codigo = $_GET['k'];
	include('inc/_config.php');
	include('inc/_funciones.php');
	$toolSQL = new toolSQL();

	$prepare = "SELECT COUNT(1) AS conteo FROM _recuperar WHERE rec_codigo = ? AND rec_estado = 1";
	$params = [$codigo];
	$types = ['s'];
	$rprS = $toolSQL->selectSQL($prepare, $types, $params);

?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui">
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css2?family=Muli:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
	<link rel="icon" type="image/png" href="img/home/favicon.png">
	<meta name="robots" content="noindex">
	<meta name="googlebot" content="noindex">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<link rel="shortcut icon" sizes="196x196" href="img/app.png">
	<link rel="stylesheet" href="css/login.css">
	<link rel="stylesheet" href="css/toast.min.css">
	<script type="text/javascript" src="js/toast.min.js"></script>
	<title>Cambiar contrase&ntilde;a - <?php echo SITENAME ?></title>
</head>
<body>
	<div class="login-card">
	<?php if($rprS < 0): ?>
		<form class="login-form">
			<h2>Ha ocurrido un error codigo: -1.</h2>
		</form>
	<?php elseif($rprS[0]['conteo'] > 0): ?>
		<form class="login-form">
			<h2>Este codigo ya no es valido</h2>
			<a href="login">
				Iniciar sesi&oacute;n
			</a>	
		</form>
	<?php else: ?>
	<?php 
		$prepare = "UPDATE _recuperar SET rec_estado = 1 WHERE rec_codigo = ?";
		$params = [$codigo];
		$types = ['s'];
		$recU = $toolSQL->updateSQL($prepare, $types, $params);

	?>
		<img src="img/home/logo-right-01.png" alt="<?php SITENAME ?>">
		<h3>Ingresa tus credenciales.</h3>
		<form method="POST" id="recuperar_form" class="login-form">
			<input type="hidden" name="k" id="k" value="<?php echo $codigo; ?>">
			<input type="password" name="usr_password" id="usr_password" placeholder="Contrase&ntilde;a" autocomplete="off" onkeyup="validar(this)">
			<div class="form-error" id="error.usr_password"></div>
			<input type="password" name="usr_password2" id="usr_password2" placeholder="Confirmar contrase&ntilde;a" autocomplete="off" onkeyup="validar(this)">
			<div class="form-error" id="error.usr_password2"></div>
			
			<input type="hidden" id="action" name="action" value="contrasena">
			<button type="submit" id="action_recuperar">
				Recuperar
			</button>
			<a href="login">
				Iniciar sesi&oacute;n
			</a>
		</form>
	<?php endif; ?>
	</div>
	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="js/_funciones.js?0.0.0"></script>
	<script type="text/javascript" src="js/_validaciones.js?0.0.0"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/jquery.ui.touch-punch.min.js"></script>
	<script>
		document.addEventListener("DOMContentLoaded", () => {
			if(document.getElementById('recuperar_form') != null)
				validar_contrasena();
		});
	</script>
</body>
</html>