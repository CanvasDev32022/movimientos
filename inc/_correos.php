<?php 
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\SMTP;
	use PHPMailer\PHPMailer\Exception;

	require_once("_funciones.php");
	$creado = date("Y-m-d H:i:s");
	$hora = date("His");

	class Mailing extends toolSQL
	{

		function mailCredential() {
			$prepare = "SELECT cor_envia, cor_envianombre, cor_email, cor_password, cor_servidorsmtp, cor_servidorpop, cor_smtp, cor_pop FROM correo WHERE ?";
			$params = [1];
			$types = ['i'];
			$corS = $this->selectSQL($prepare, $types, $params);
			if($corS <= 0) {
				echo -1;
				exit;

			} else {

				$prepare = "SELECT con_correo, con_telefono FROM contacto WHERE ?";
				$params = [1];
				$types = ['i'];
				$conS = $this->selectSQL($prepare, $types, $params);
				if($conS < 0) {
					echo -2;
					exit;
				}
			}

			$credenciales = array($corS[0], $conS[0]);
			return $credenciales;
		}
		
		function mailRecovery($nombre, $email, $codigo) {
			
			$smtp = $this->mailCredential();
			$phone = $smtp[1]['con_telefono']; 
			$maskPhone = substr($phone,0,2) == 57 ? "(".substr($phone,0,2).")"." ".substr($phone,2,3)." ".substr($phone,5,3)." ".substr($phone,8,4) : substr($phone,0,3)." ".substr($phone,3,3)." ".substr($phone,6,4);

			// TODO: CONFIGURACION INICIAL SERVIDOR CORREOS
			$EMAIL_PORT 	 = $smtp[0]['cor_smtp'];
			$HOST_EMAIL 	 = $smtp[0]['cor_servidorsmtp'];
			$EMAIL_USER 	 = $smtp[0]['cor_email'];
			$EMAIL_PASS 	 = $smtp[0]['cor_password'];
			$EMAIL_ENVIA 	 = $smtp[0]['cor_envianombre'];

			// TODO: CONFIGURACION ADICINAL 
			$EMAIL_NOMBRE 	 = $smtp[0]['cor_envia'];

			require 'mail_new/Exception.php';
			require 'mail_new/PHPMailer.php';
			require 'mail_new/SMTP.php';
			$mail = new PHPMailer(true);

			$mail->isSMTP();                                            // Send using SMTP
			$mail->Host = $HOST_EMAIL;
			$mail->SMTPAuth   = true;                                   // Enable SMTP authentication
			$mail->Username = $EMAIL_USER;                 
			$mail->Password = $EMAIL_PASS; 
			$mail->SMTPSecure = "tls";         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
			$mail->Port       = $EMAIL_PORT;


			$mail->From = $EMAIL_NOMBRE; 
			$mail->FromName = SITENAME;

			$mail->isHTML(true);

			$mail->AddAddress($email);

			$mail->Subject = "Recuperar Contraseña";
			$mail->CharSet = 'UTF-8';
			$mail->Body = '
				<!DOCTYPE html>
				<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title>Recuperar contraseña - '.SITENAME.'</title>
					<meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
					<meta name="color-scheme" content="light dark">
					<meta name="supported-color-schemes" content="light dark">
					<style>
						:root { supported-color-schemes: light dark; }
						@media (prefers-color-scheme: dark) {
							.background-dark:not([class^="x_"]) { background: #000000 !important;}
							.background-light:not([class^="x_"]) { background: #FFFFFF !important; color: #000000 !important;}
							.background-beach:not([class^="x_"]) { background: #fff5de !important; color: #000000 !important;}
							.background-azuloscuro:not([class^="x_"]) { background: #000310 !important; color: #FFFFFF !important;}
							.background-grey:not([class^="x_"]) { background: #e6e6e6 !important; color: #000000 !important;}
							.background-footer:not([class^="x_"]) { background: #222222 !important; color: #959595 !important;}
						}
						html {
							box-sizing: border-box;
						}
						*, *:before, *:after {
							box-sizing: inherit;
						}
						
						body {
							font-family: Arial, Times, "Times New Roman", "serif";
							font-size: 13px;
							color: #000000;
							margin: 0px;
						}

						table {
							border-collapse: collapse;
							padding: 0px !important;
						}

						tr{
							padding: 0px !important;
						}

						a,
						a:link,
						a:visited {
							text-decoration: none;
							color: #959595;
						}
							
					</style>
					<style id="hteumeuleu-css-dark-mode-outlook-com">
						[data-ogsb] .background-dark { background-color: #000000 !important;}
						[data-ogsb] .background-light { background-color: #FFFFFF !important; color: #000000 !important;}
						[data-ogsb] .background-beach { background-color: #fff5de !important; color: #000000 !important;}
						[data-ogsb] .background-azuloscuro { background-color: #000310 !important; color: #FFFFFF !important;}
						[data-ogsb] .background-grey { background-color: #e6e6e6 !important; color: #000000 !important;}
						[data-ogsb] .background-footer { background-color: #222222 !important; color: #959595 !important;}
				  </style>
				</head>
				<body>
					<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" aling="center">
						<tbody>
							<tr>
								<td valing="top" width="650" align="center">
									<table width="650" border="0" cellpadding="0" cellspacing="0" align="center">
										<tbody>
											<!-- HEADER -->
											<tr bgcolor="#e6e6e6" style="background: #e6e6e6;">
												<td width="650" align="center" class="background-grey" style="padding: 20px;">
													<table border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td width="160" align="left">
																	<img src="'.URLSITE.'img/home/logo-mobile.png" width="150" alt="'.SITENAME.'" border="0" style="display: block;">
																</td>
																<td width="490">
																	
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
											<!-- /HEADER -->
											<!-- TABLA CONTENEDOR -->
											<tr bgcolor="#ffffff" style="background: #ffffff;">
												<td width="650" align="center" class="background-light" style="padding: 20px;">
													<table border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td width="550" style="font-size: 18px; font-weight: bold;">
																	Restablecer Contraseña.
																</td>
															</tr>
															<tr>
																<td height="20"></td>
															</tr>
															<tr>
																<td width="550" style="font-weight: 600; font-size: 16px;">
																	Hola, '.$nombre.'
																</td>
															</tr>
															<tr>
																<td width="550" style="font-size: 16px;">
																	Para restablecer su contraseña por favor ingrese al siguiente link:
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
											<tr bgcolor="#ffffff" style="background: #ffffff;">
												<td width="650" align="center" class="background-light" style="padding-bottom: 20px;">
													<table border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td width="200" align="center" style="background: #0899c5; padding: 10px; border-radius: 20px;">
																	<a href="'.URLSITE.'contrasena-recuperar?k='.$codigo.'" target="_blank" style="color: #ffffff; font-weight: 600; font-size: 16px; ">Restablecer</a>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
											<!-- /TABLA CONTENEDOR -->
											<!-- FOOTER -->
											<tr bgcolor="#e6e6e6" style="background: #e6e6e6;">
												<td width="650" align="center" class="background-grey" style="padding: 20px 20px;">
													<table border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td width="550" align="left">
																	Este es un correo automático, por favor no lo responda.
																</td>
															</tr>
															<tr>
																<td width="550" align="left">
																	Ante cualquier inquietud, llame al: <a href="tel:'.$smtp[1]['con_telefono'].'" style="color: #24adf3;">'.$maskPhone.'</a>
																</td>
															</tr>
															
														</tbody>
													</table>
												</td>
											</tr>
											<tr bgcolor="#ffffff" style="background: #ffffff;">
												<td width="650" align="center" class="background-light" style="padding: 20px 20px;">
													<table border="0" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td width="70" align="left" style="font-weight: 600;">
																	<a href="mailto:'.$smtp[1]['con_correo'].'" style="color: #24adf3;">@Hantik</a>
																</td>
																<td width="580" align="left" style="font-weight: 600;">
																	Cali - Valle del Cauca, Colombia
																</td>
															</tr>

														</tbody>
													</table>
												</td>
											</tr>
											<!-- /FOOTER -->
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</body>
				</html>
			';
			$mail->send();

			return $mail;
		}
	}




?>