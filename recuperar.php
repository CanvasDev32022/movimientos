<?php 
	include('inc/_config.php');
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

	<script src="js/toast.min.js"></script>
	<title>Recuperar contraseña - <?php echo SITENAME ?></title>
</head>
<body>
	<div class="login-card">
		<img src="img/home/logo-right-01.png" alt="<?php SITENAME ?>">
		<h3>Ingresa tus credenciales.</h3>
		<form method="POST" id="recuperar_form" class="login-form">
			<input type="text" name="user" id="user" placeholder="Correo electr&oacute;nico" autocomplete="off" onkeyup="validar(this)">
			<div class="form-error" id="error.user"></div>
		
			<input type="hidden" id="action" name="action" value="recuperar">
			<button type="submit" id="action_recuperar">
				Recuperar
			</button>
			<a href="login">
				Iniciar sesi&oacute;n
			</a>
		</form>
	</div>
	<script type="text/javascript" src="js/jquery-3.2.1.min.js"></script>
	<script type="text/javascript" src="js/_funciones.js?0.0.0"></script>
	<script type="text/javascript" src="js/_validaciones.js?0.0.0"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/jquery.ui.touch-punch.min.js"></script>
	<script>
		document.addEventListener("DOMContentLoaded", () => {
			validacion_recuperar();
		});
	</script>
</body>
</html>