// TODO: VALIDACION LOGIN
const validacion_login = () => {

	const formulario = document.getElementById('login_form');
	formulario.addEventListener("submit", (e) => {
		e.preventDefault();

		const boton = document.getElementById('action_login');
		boton.setAttribute("disabled", "disabled");

		const validaciones = [
			['user', '', 'required', 'email'],
			['pass', '', 'required', 'length=8,60']
		];

		const respuesta = validar_formulario(validaciones, false);
		if(respuesta) {

			var xhr = new XMLHttpRequest();
			var params 	= $(formulario).serialize();
			xhr.open("POST", "inc/login.php",true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(params);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						data = xhr.responseText.trim();
						console.log(data);
						if(data < 0)
							new Toast({message: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, type: 'danger'});
						else
						if(data == 0){
							new Toast({message: 'El correo electrónico y/o contraseña no coincide con nuestros registros.', type: 'warning'});
						} else {

							window.open("dashboard", "_self");

						}

					} else {
						new Toast({message: "Ha ocurrido un error, verifique su conexión a Internet", type: 'danger'});
					}
					boton.removeAttribute("disabled");
				}
			}

		} else {
			boton.removeAttribute("disabled");
		}
	});
}

// TODO: VALIDACION RECUPERAR
const validacion_recuperar = () => {

	const formulario = document.getElementById('recuperar_form');
	formulario.addEventListener("submit", (e) => {
		e.preventDefault();

		const boton = document.getElementById('action_recuperar');
		boton.setAttribute("disabled", "disabled");

		const validaciones = [
			['user', '', 'required', 'email'],
		];

		const respuesta = validar_formulario(validaciones, false);
		if(respuesta) {

			var xhr = new XMLHttpRequest();
			var params 	= $(formulario).serialize();
			xhr.open("POST", "inc/login.php",true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(params);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						data = xhr.responseText.trim();
						console.log(data);
						if(data < 0)
							new Toast({message: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, type: 'danger'});
						else
						if(data == 0){
							new Toast({message: 'El correo electrónico no coincide con nuestros registros.', type: 'warning'});
						} else {
							new Toast({message: 'Se ha enviado un correo de verficación, por favor revisa tu bandeja.', type: 'success'});
							setTimeout(() => { window.open("login", "_self"); }, 2000);

						}

					} else {
						new Toast({message: "Ha ocurrido un error, verifique su conexión a Internet", type: 'danger'});
					}
					boton.removeAttribute("disabled");
				}
			}

		} else {
			boton.removeAttribute("disabled");
		}
	});
}

// TODO: VALIDACION CAMBIO CONTRASEN
const validar_contrasena = () => {

	const formulario = document.getElementById('recuperar_form');
	formulario.addEventListener("submit", (e) => {
		e.preventDefault();

		const boton = document.getElementById('action_recuperar');
		boton.setAttribute("disabled", "disabled");

		const validaciones = [
			['usr_password', '', 'required', 'length=8,60', 'confirmacion'],
			['usr_password2', '', 'required', 'length=8,60', 'confirmacion'],
		];

		const respuesta = validar_formulario(validaciones, false);
		if(respuesta) {

			var xhr = new XMLHttpRequest();
			var params 	= $(formulario).serialize();
			xhr.open("POST", "inc/login.php",true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(params);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						data = xhr.responseText.trim();
						console.log(data);
						if(data < 0)
							new Toast({message: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, type: 'danger'});
						else
						if(data == 0){
							new Toast({message: 'El correo electrónico no coincide con nuestros registros.', type: 'warning'});
						} else {

							new Toast({message: 'La contraseña se ha recuperado con exito.', type: 'success'});
							setTimeout(() => { window.open("login", "_self"); }, 2000);

						}

					} else {
						new Toast({message: "Ha ocurrido un error, verifique su conexión a Internet", type: 'danger'});
					}
					boton.removeAttribute("disabled");
				}
			}

		} else {
			boton.removeAttribute("disabled");
		}
	});
}

// TODO: VALIDAR FORMS INDEX
const validar_contacto = (e) => {

	e.preventDefault();
	
	const tmp_id = e.target.id;
	const id = tmp_id.split("_")[0];
	
	const boton = document.getElementById(`action_${id}`);
	boton.setAttribute("disabled", "disabled");

	let validaciones = [];
	if(id == "redes") {

		validaciones = [
			['insta', 	 '', 'required', 'url'],
			['youtube',  '', 'required', 'url'],
			['email', 	 '', 'required', 'email'],
		];

	} else
	if(id == "contacto") {

		validaciones = [
			['phone', 	 '', 'telefono'],
			['whatsapp', '', 'telefono'],
			['textw', 	 '', 'required', 'lengthPass=1,255'],
		];

	}

	const respuesta = validar_formulario(validaciones, false);
	if(respuesta) {

		var xhr = new XMLHttpRequest();
		var params 	= $(e.target).serialize();
		xhr.open("POST", "inc/index.php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					data = xhr.responseText.trim();
					console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						M.toast({html: 'Se ha guardado correctamente.', classes: 'toastdone'});
					}

				} else {
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
				boton.removeAttribute("disabled");
			}
		}

	} else {
		boton.removeAttribute("disabled");
	}
}

// TODO: VALIDACION MODULO USUARIOS
const validacion_usuarios = (seccion, validaciones) => {

	const seccion_singular = "usuario";
	const seccion_legible = "Usuario";

	const formulario = document.getElementById(`${seccion_singular}_form`);
	formulario.addEventListener("submit", (e) => {
		e.preventDefault();

		const boton = document.getElementById(`action_${seccion_singular}`);
		boton.setAttribute("disabled", "disabled");

		const respuesta = validar_formulario(validaciones, false);
		if(respuesta) {

			const id = document.getElementById('usr_id') != null ? document.getElementById('usr_id').value : 0;
			var xhr = new XMLHttpRequest();
			var params 	= $(formulario).serialize();
			xhr.open("POST", "inc/"+seccion+".php",true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(params);
			xhr.onreadystatechange = function()
			{
				if(xhr.readyState == 4)
				{
					if(xhr.status == 200)
					{
						data = xhr.responseText.trim();
						// console.log(data);
						if(data < 0)
							M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
						else
						if(data == 0) {
							M.toast({html: 'El correo electrónico ya existe en nuestros registros', classes: 'toastwarning'});
						} else {

							if(id == 0)
								M.toast({html: `El ${seccion_legible} se ha creado correctamente.`, classes: 'toastdone'});
							else
								M.toast({html: `El ${seccion_legible} se ha editado correctamente.`, classes: 'toastdone'});

							$(`#modal-${seccion}`).modal('close');
							var variables = obtener_variables();
							formulario.innerHTML = "";
							cargar_registros(seccion, variables[0],variables[1]);
						}
						boton.removeAttribute("disabled");
					}
					else
						M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}

		} else {
			boton.removeAttribute("disabled");
		}
	});
}

// TODO: VALIDACION MODULO MOVIMIENTOS
const validacion_movimientos = (event) => {
	event.preventDefault();

	const seccion = "movimientos";
	const seccion_singular = "movimiento";
	const seccion_legible = "Movimientos";

	let validaciones
	const formulario = event.target;
	if(formulario.id == "movimiento_modal") {

		validaciones = [
			[`mov_fecha`, 		'', 'required'],
			[`mtp_id`, 			'', 'required'],
			[`mov_valor`, 		'', 'required'],
			[`cco_id`, 			'', 'required'],
			[`suc_id`, 			'', 'required'],
			[`emp_id`, 			'', 'required'],
			[`mov_detalle`,		'', 'required'],
		];

	} else {
		validaciones = validaciones_global;
	}

	const boton = document.getElementById(`action_${seccion_singular}`);
	boton.setAttribute("disabled", "disabled");

	const respuesta = validar_formulario(validaciones, false);
	if(respuesta) {

		const id = document.getElementById('mov_id') != null ? document.getElementById('mov_id').value : 0;
		var xhr = new XMLHttpRequest();
		var params 	= $(formulario).serialize();
		xhr.open("POST", "inc/"+seccion+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					data = xhr.responseText.trim();
					console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						if(id == 0)
							M.toast({html: `Los ${seccion_legible} se ha creado correctamente.`, classes: 'toastdone'});
						else
							M.toast({html: `El ${seccion_legible} se ha editado correctamente.`, classes: 'toastdone'});


						var variables = obtener_variables();
						if(formulario.id == "movimiento_modal") {
							$(`#modal-${seccion}`).modal('close');
							formulario.innerHTML = "";
						} else {
							plantillas("movimiento_crear");
						}
						cargar_registros(seccion, variables[0],variables[1]);
					}
					boton.removeAttribute("disabled");
					
				} else {
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}
		}

	} else {
		boton.removeAttribute("disabled");
		M.toast({ html: "Existen campos requeridos sin completar!", classes: "toasterror" });
	}
}

// TODO: funciones de error par FORM DATA
function errorHandler(event) {
	app.toast.show({text: 'Ha ocurrido un error. Intente de nuevo.',closeTimeout: 2000, cssClass: 'toasterror'});
	popup_carga.close();
}

function abortHandler(event) {
	app.toast.show({text: 'Ha cancelado el proceso.',closeTimeout: 2000, cssClass: 'toastwarning'});
	popup_carga.close();
}

// TODO: FUNCIONES PARA VALIDACION DE FORMULARIO Y LIMPIEZA DE INPUT, SELECT(Mejorar a futuro) PD: Cuando tenga tiempo

// TODO: Limpieza de input y div error
const validar = (cmp) => {

	var tipo = cmp.tagName;
	var id = cmp.id;
	var clase = cmp.classList;

	if(tipo == "INPUT")
	{
		if(clase[clase.length -1] == "input-error")
		{
			document.getElementById(id).classList.remove("input-error");
			document.getElementById('error.'+id).innerHTML = "";
		}
	}
	else
	if(tipo == "SELECT")
	{
		if(clase[clase.length -1] == "input-error")
		{
			document.getElementById(id).classList.remove("input-error");
			document.getElementById('error.'+id).innerHTML = "";
		}
	}
	if(tipo == "TEXTAREA")
	{
		if(clase[clase.length -1] == "input-error")
		{
			document.getElementById(id).classList.remove("input-error");
			document.getElementById('error.'+id).innerHTML = "";
		}
	}
}

// TODO: Validacion de campos del formulario
const validar_formulario = (validaciones, toast = false) => {
	var errores = [];
	var valor = "";
	var enviar = true;
	var tmp = "";
	validaciones.forEach(function(validacion, i){

		// console.log(validacion[0])
		if(validacion[0]) 
		{
			var valor = document.getElementById(validacion[0]).value;

			for (var i = 2; i < validacion.length; i++) {
				var tmp = validacion[i].split("=");

				if(tmp[0] == 'required')
				{
					if(valor == "" || valor == null)
					{
						errores.push([validacion[0], "Este campo es obligatorio.", "El campo "+validacion[1]+" es obligarorio."]);
						break;
					}
				}
				else
				if(tmp[0] == 'length')
				{
					var valores = tmp[1].split(",");

					if(valor.length < valores[0] || valores.length > valores[1])
					{
						errores.push([validacion[0], 'El campo debe contener entre '+valores[0]+' y '+valores[1]+' caracteres.', 'El campo debe contener entre '+valores[0]+' y '+valores[1]+' caracteres.']);
						break;
					}
				}
				else
				if(tmp[0] == 'lengthPass')
				{
					var valores = tmp[1].split(",");
					if(valor != "")
					{
						if(valor.length < valores[0] || valor.length > valores[1])
						{
							errores.push([validacion[0], 'El campo debe contener entre '+valores[0]+' y '+valores[1]+' caracteres.', 'El campo debe contener entre '+valores[0]+' y '+valores[1]+' caracteres.']);
							break;
						}
					}
				}
				else
				if(tmp[0] == 'email') 
				{
					if(!(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)))
					{
						errores.push([validacion[0], 'El correo electrónico debe ser válido. Ej: nombre@correo.com', 'El correo electrónico debe ser válido. Ej: nombre@correo.com']);
						break;
					}
				}
				else 
				if(tmp[0] == 'confirmacion')
				{
					var tmpC = validacion[0].split("_");
					var password = document.getElementById(tmpC[0]+'_password').value;
					var password2 = document.getElementById(tmpC[0]+'_password2').value;
					if(password != password2)
					{
						errores.push([validacion[0], "Los campos deben coincidir", 'El campo '+validacion[1]+ ' es obligatorio']);
					}
				}
				else 
				if(tmp[0] == 'telefono')
				{
					if(valor.length < 10)
					{
						errores.push([validacion[0], 'El numero debe ser válido. Ej: 1234567890 o (602)1234567', 'El numero debe ser válido. Ej: 1234567890 o (602)1234567']);
						break;
					}
				}
				else 
				if(tmp[0] == 'imagen')
				{
					if(document.getElementById(`${validacion[0]}C`) != null) {

						var imagen = document.getElementById(`${validacion[0]}C`)
						if(!imagen.value)
						{
							var tmp = document.getElementById(validacion[0]).files;
							if(tmp.length == 0)
								errores.push([validacion[0], "Este campo es obligatorio.", "El campo "+validacion[1]+" es obligarorio."]);
						}

					} else {

						var tmp = document.getElementById(validacion[0]).files;
						if(tmp.length == 0) {
							errores.push([validacion[0], "Este campo es obligatorio.", "El campo "+validacion[1]+" es obligarorio."]);
							break;
						}

					}
				}
				else
				if(tmp[0] == 'numero')
				{
					if(!(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(valor)))
					{
						errores.push([validacion[0], "El numero debe ser válido. Ej: 1234567890", "El numero debe ser válido. Ej: 1234567890"]);
						break;
					}
				}
				else
				if(tmp[0] == 'precio')
				{
					var precio = desajustar_valor(valor);
					if(!(/^-?\d+$/.test(precio)))
					{
						errores.push([validacion[0], "El precio debe ser válido. Ej: $1.000", "El precio debe ser válido. Ej: $1.000"]);
						break;
					}
				}
				else
				if(tmp[0] == 'porcentaje')
				{
					var precio = desajustar_procentaje(valor);
					if(!(/^-?\d+$/.test(precio)))
					{
						errores.push([validacion[0], "El precio debe ser válido. Ej: 1%", "El precio debe ser válido. Ej: 1%"]);
						break;
					}
				}
				else
				if(tmp[0] == 'url')
				{
					const url = url_valida(valor);
					if(valor > 0 && !url) {
						errores.push([validacion[0], "La url tiene que ser valida", "La url tiene que ser valida"]);
						break;
					}
				}
				else
				if(tmp[0] == "archivo")
				{
					var tmp = document.getElementById(validacion[0]).files;
					if(!tmp.length) {
						errores.push([validacion[0], "Este campo es obligatorio.", "El campo "+validacion[1]+" es obligarorio."]);
						break;
					}
				}
				else
				if(tmp[0] == "ckeditor")
				{
					const instances = CKEDITOR.instances;
					const contenido = instances[validacion[0]].getData();

					if(contenido == "" || contenido == null) {
						errores.push([validacion[0], "Este campo es obligatorio.", "El campo "+validacion[1]+" es obligarorio."]);
						break;
					}
						
				}
			}
		}

		
	})


	if(toast && errores.length > 0)
	{
		errores.forEach(function(errorT, index){
			M.toast({html: errorT[2], classes: 'toastdone'});
			document.getElementById(errorT[0]).classList.add("input-error");
		});
		enviar = false;
	}
	else
	if(errores.length > 0)
	{
		for (var i = 0; i < errores.length; i++) {
			document.getElementById(errores[i][0]).classList.add("input-error");
			document.getElementById('error.'+errores[i][0]).innerHTML = errores[i][1];
		}		

		enviar = false;
	}
	return enviar;
}