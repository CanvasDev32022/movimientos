const plantillas = (seccion, datos, rol=0, pagina=1, busqueda="", id=0, cmp) => {
	
	// TODO: MODULO USUARIOS
	if(seccion == "usuarios")
	{
		const seccion_singular = "usuario";
		const seccion_legible = "Usuario";

		let botones_accesos = "";
		if(validar_acceso('usuario_crear', rol)){
			botones_accesos = `
				<div class="fixed-action-btn">
					<a class="btn-floating btn-large btnppal" title="Crear ${seccion_legible}" onclick="plantillas('${seccion_singular}_crear', '')" id="crear_${seccion_singular}">
						<i class="large material-icons">add</i>
					</a>
				</div>`; 
		}

		return`
		${botones_accesos}
		<div class="row mb-5" id="${seccion}-container">
			<div class="col m5 s12 pl-10">
				<div id="registros" class="paginador-left"></div>
			</div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginador"></ul>
				</div>
			</div>
		</div>
		<div class="tabla">
			<table class="custom-table">
				<thead>
					<tr>
						<th class="table-40">Nombres</th>
						<th class="table-30">Rol</th>
						<th class="table-30">Acciones</th>
					</tr>
				</thead>
				<tbody id="resultado"></tbody>
			</table>
		</div>
		<div class="row mt-5">
			<div class="col m5 s12"></div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginadorB"></ul>
				</div>
			</div>
		</div>`;
	}
	else
	if(seccion == "usuarios_lista")
	{
		const modulo = "usuarios";
		const seccion_legible = "Usuario";
		const seccion_singular = "usuario";

		//Acceso para botones
		var botones_accesos = "";
		if(validar_acceso('usuario_ver', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_ver','','','${pagina}','${busqueda}',${datos['usr_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Ver ${seccion_legible}"><i class="material-icons">visibility</i></a>`;
		
		if(validar_acceso('usuario_editar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_editar','','','${pagina}','${busqueda}',${datos['usr_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Editar ${seccion_legible}"><i class="material-icons">edit</i></a>`;

		if(validar_acceso('usuario_eliminar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="eliminar_registro(${datos['usr_id']}, '${modulo}', ${pagina}, '${busqueda}')" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar ${seccion_legible}"><i class="material-icons">delete</i></a>`;

		
		var contenedor = `  
			<td>${datos['usr_nombres']} ${datos['usr_apellidos']} ${establecer_estado(datos['est_id'])}</td>
			<td>${datos['rol_nombre_'+cms_idioma]}</td>
			<td>${botones_accesos}</td>`;

		return contenedor;
	}
	else
	if(seccion == "usuario_crear")
	{
		const modulo = "usuarios";
		const seccion_legible = "Usuario";
		const seccion_singular = "usuario";

		const modal = document.getElementById(`modal-${modulo}`);
		modal.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&action=obtener_crear";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						const tmp = data.split("::");
						const roles = JSON.parse(tmp[0]);
						const estados = JSON.parse(tmp[1]);

						var optionsRol = "";
						for(var i=0; i<roles.length; i++)
							optionsRol = optionsRol + `<option value="${roles[i]['rol_id']}">${roles[i]['rol_nombre_'+cms_idioma]}</option>`;

						var optionEstados = "";
						for(var i = 0; i<estados.length; i++)
							optionEstados = optionEstados + `<option value="${estados[i]['est_id']}">${estados[i]['est_nombre_'+cms_idioma]}</option>`

						modal.innerHTML = `
						<form method="POST" id="${seccion_singular}_form">
							<div class="modal-header">
								<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
									<div class="container mt-0">
										<div class="row mb-0">
											<div class="col s12 m11 l11">
												<h5 class="breadcrumbs-title mt-0 mb-0"><span>Crear ${seccion_legible}</span></h5>
											</div>
											<span class="modal-action modal-close"><i class="material-icons">close</i></span>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-content">
								<div class="panel">
									<div class="row">
										<div class="col s12 m6 input-field">
											<input type="text" name="usr_nombres" id="usr_nombres" placeholder="" autocomplete="off" onkeyup="validar(this)">
											<label for="usr_nombres">Nombres<i class="requerido">*</i></label>
											<div id="error.usr_nombres" class="form-error"></div>
										</div>
										<div class="col s12 m6 input-field">
											<input type="text" name="usr_apellidos" id="usr_apellidos" placeholder="" autocomplete="off" onkeyup="validar(this)">
											<label for="usr_apellidos">Apellidos<i class="requerido">*</i></label>
											<div id="error.usr_apellidos" class="form-error"></div>
										</div>
										<div class="col s12 m6 input-field">
											<input type="email" name="usr_email" id="usr_email" placeholder="" autocomplete="off" onkeyup="validar(this)">
											<label for="usr_email">Correo electrónico<i class="requerido">*</i></label>
											<div id="error.usr_email" class="form-error"></div>
										</div>
										<div class="col s12 m6 select">
											<label for="usr_rol">Rol</label><i class="requerido">*</i>
											<select name="usr_rol" id="usr_rol" onchange="validar(this)">
												${optionsRol}
											</select>
											<div id="error.usr_rol" class="form-error"></div>
										</div>
										<div class="col s12 m6 input-field">
											<input type="password" name="usr_password" id="usr_password" placeholder="" autocomplete="off" onkeyup="validar(this)">
											<label for="usr_password">Contraseña<i class="requerido">*</i></label>
											<div id="error.usr_password" class="form-error"></div>
										</div>
										<div class="col s12 m6 input-field">
											<input type="password" name="usr_password2" id="usr_password2" placeholder="" autocomplete="off" onkeyup="validar(this)">
											<label for="usr_password2">Cofirmar contraseña<i class="requerido">*</i></label>
											<div id="error.usr_password2" class="form-error"></div>
										</div>
										<div class="col s12 m6 select">
											<label for="est_id">Estado</label><i class="requerido">*</i>
											<select name="est_id" id="est_id" onchange="validar(this)">
												${optionEstados}
											</select>
											<div id="error.est_id" class="form-error"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<div class="row m-0">
									<div class="col s12 m4 offset-m8 nput-field">
										<input type="hidden" name="action" id="action" value="crear">
										<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">Crear ${seccion_legible}</button>
									</div>
								</div>
							</div>
						</form>`;
						
						$('#usr_rol').selectize();
						$('#est_id').selectize();
						$('#usr_padre').selectize();
						M.updateTextFields();

						const validaciones = [
							['usr_nombres',		'Nombres', 				'required', 'length=1,100'],
							['usr_apellidos', 	'Apellidos', 			'required', 'length=1,100'],
							['usr_email', 		'Correo electrónico', 	'required', 'email'],
							['usr_password', 	'Contraseña', 			'required', 'length=8,60', 'confirmacion'],
							['usr_password2', 	'Confirmar contraseña', 'required', 'length=8,60', 'confirmacion'],
							['usr_rol', 		'Rol', 					'required'],
							['est_id', 			'Estado', 				'required'],
						];

						validacion_usuarios(modulo, validaciones);
						// Configura el Modal y lo Abre 
						
						// Hacemos FOCUS y seleccionamos el texto del primer campo
						document.getElementById('usr_nombres').focus();
						document.getElementById('usr_nombres').select();
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}

		$('#modal-'+modulo).modal({dismissible: false});
		var instance = M.Modal.getInstance(modal);
		instance.open();
	}
	else
	if(seccion == "usuario_editar")
	{
		const modulo = "usuarios";
		const seccion_legible = "Usuario";
		const seccion_singular = "usuario";

		const modal = document.getElementById(`modal-${modulo}`);
		modal.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&id="+id+"&action=obtener_editar";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						data = data.split("::");
						const datos 	= JSON.parse(data[0]);
						const roles 	= JSON.parse(data[1]);
						const estados = JSON.parse(data[2]);

						var optionsRol = "";
						for(var i=0; i<roles.length; i++) {

							const selected  = roles[i]['rol_id'] == datos[0]['rol_id'] ? "selected": "";
							optionsRol = optionsRol + `<option value="${roles[i]['rol_id']}" ${selected}>${roles[i]['rol_nombre_'+cms_idioma]}</option>`;
						}

						var optionEstados = "";
						for(var i = 0; i<estados.length; i++) {

							const selected = estados[i]['est_id'] == datos[0]['est_id'] ? "selected" : "";
							optionEstados = optionEstados + `<option value="${estados[i]['est_id']}" ${selected}>${estados[i]['est_nombre_'+cms_idioma]}</option>`;
						}

						modal.innerHTML = `
							<form method="POST" id="${seccion_singular}_form">
								<div class="modal-header">
									<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
										<div class="container mt-0">
											<div class="row mb-0">
												<div class="col s12 m11 l11">
													<h5 class="breadcrumbs-title mt-0 mb-0"><span>Editar ${seccion_legible}</span></h5>
												</div>
												<span class="modal-action modal-close"><i class="material-icons">close</i></span>
											</div>
										</div>
									</div>
								</div>
								<div class="modal-content">
									<div class="panel">
									<input type="hidden" name="usr_id" id="usr_id" value="${datos[0]['usr_id']}">
										<div class="row">
											<div class="col s12 m6 input-field">
												<input type="text" name="usr_nombres" id="usr_nombres" placeholder="" autocomplete="off" onkeyup="validar(this)" value="${datos[0]['usr_nombres']}">
												<label for="usr_nombres">Nombres<i class="requerido">*</i></label>
												<div id="error.usr_nombres" class="form-error"></div>
											</div>
											<div class="col s12 m6 input-field">
												<input type="text" name="usr_apellidos" id="usr_apellidos" placeholder="" autocomplete="off" onkeyup="validar(this)" value="${datos[0]['usr_apellidos']}">
												<label for="usr_apellidos">Apellidos<i class="requerido">*</i></label>
												<div id="error.usr_apellidos" class="form-error"></div>
											</div>
											<div class="col s12 m6 input-field">
												<input type="email" id="usr_email" placeholder="" autocomplete="off" onkeyup="validar(this)" value="${datos[0]['usr_email']}" disabled>
												<label for="usr_email">Correo electrónico<i class="requerido">*</i></label>
												<div id="error.usr_email" class="form-error"></div>
											</div>
											<div class="col s12 m6 select">
												<label for="usr_rol">Rol</label><i class="requerido">*</i>
												<select name="usr_rol" id="usr_rol" onchange="validar(this)">
													${optionsRol}
												</select>
												<div id="error.usr_rol" class="form-error"></div>
											</div>
											<div class="col s12 m6 input-field">
												<input type="password" name="usr_password" id="usr_password" placeholder="" autocomplete="off" onkeyup="validar(this)">
												<label for="usr_password">Contraseña</label>
												<div id="error.usr_password" class="form-error"></div>
											</div>
											<div class="col s12 m6 input-field">
												<input type="password" name="usr_password2" id="usr_password2" placeholder="" autocomplete="off" onkeyup="validar(this)">
												<label for="usr_password2">Cofirmar contraseña</label>
												<div id="error.usr_password2" class="form-error"></div>
											</div>
											<div class="col s12 m6 select">
												<label for="est_id">Estado</label><i class="requerido">*</i>
												<select name="est_id" id="est_id" onchange="validar(this)">
													${optionEstados}
												</select>
												<div id="error.est_id" class="form-error"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="modal-footer">
									<div class="row m-0">
										<div class="col s12 m4 offset-m8 nput-field">
											<input type="hidden" name="action" id="action" value="editar">
											<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">Editar ${seccion_legible}</button>
										</div>
									</div>
								</div>
							</form>`;

						//Inicializamos los Select
						$('#usr_rol').selectize();
						$('#est_id').selectize();
						$('#usr_padre').selectize();
						M.updateTextFields();

						const validaciones = [
							['usr_nombres',		'Nombres', 				'required', 'length=1,100'],
							['usr_apellidos', 	'Apellidos', 			'required', 'length=1,100'],
							['usr_email', 		'Correo electrónico', 	'required', 'email'],
							['usr_password', 	'Contraseña', 			'lengthPass=8,60', 'confirmacion'],
							['usr_password2', 	'Confirmar contraseña', 'lengthPass=8,60', 'confirmacion'],
							['usr_rol', 		'Rol', 					'required'],
							['est_id', 			'Estado', 				'required'],
						];
						validacion_usuarios(modulo, validaciones);
				
						// Hacemos FOCUS y seleccionamos el texto del primer campo
						document.getElementById('usr_nombres').focus();
						document.getElementById('usr_nombres').select();
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}

		$('#modal-'+modulo).modal({dismissible: false});
		var instance = M.Modal.getInstance(modal);
		instance.open();
	}
	else
	if(seccion == "usuario_ver")
	{
		var modulo = "usuarios";
		var seccion_legible = cms_traducciones[0][cms_idioma]['usuario'];
		var seccion_singular = "usuario";

		// TODO: Abrimos el modal con el complemento de carga
		carga_loader(`modal-${modulo}`, true);

		$('#modal-'+modulo).modal({
			dismissible: false,
			onCloseEnd: () => {
				document.getElementById(`modal-${modulo}`).innerHTML = "";
			}
		});
		var instance = M.Modal.getInstance(document.getElementById('modal-'+modulo));
		instance.open();

		// TODO: Obtenemos los datos para el formulario
		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&id="+id+"&action=obtener_ver";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data <= 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						var tmp = data.split("::");
						var datos = JSON.parse(tmp[0]);
						var extras = JSON.parse(tmp[1]);

						var campos_extra = "";
						var valor_select = "";

						if(extras != 0)
						{
							extras.forEach(function(element){
								if(element['cpe_tipo'] == 'select')
								{
									var temp = element['cpe_valores_'+cms_idioma].split(",");
									temp.forEach(function(selects){
										var select = selects.split("=>");
										if(parseInt(select[0]) == parseInt(datos[0][element['cpe_slug']]))
											valor_select = select[1];
									});
								}
								else
									valor_select = datos[0][element['cpe_slug']];

								campos_extra = campos_extra + 
									`<div class="table-40v ver-titulo">${element['cpe_nombre_'+cms_idioma]}</div>
									<div class="table-60v" ondblclick="copiar_contenido(this)" onclick="mostrar_detalle(this)">${valor_select}</div>
									<div class="table-copy"><i onclick="mostrar_detalle('${valor_select}')" class="material-icons">open_in_new</i></div>`;
							});
						}

						if(datos[0]['padre_nombre'] == null && datos[0]['padre_apellidos'] == null)
							var padre = cms_traducciones[0][cms_idioma]['sin padre'];
						else
							padre = datos[0]['padre_nombre']+" "+datos[0]['padre_apellidos'];

						document.getElementById('modal-'+modulo).innerHTML = 
							`<div class="modal-content">
								<span class="modal-action modal-close"><i class="material-icons">cancel</i></span>
								<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
									<div class="container mt-0">
										<div class="row mb-0">
											<div class="col s12 m11 l11">
												<h5 class="breadcrumbs-title mt-0 mb-0"><span>${cms_traducciones[0][cms_idioma]['Información del usuario']}</span></h5>
											</div>
										</div>
									</div>
								</div>

								<div class="panel">
									<div class="row">
										<div class="col m12 s12 sugerencias">
											${cms_traducciones[0][cms_idioma]['mensaje8']}
										</div>
										<div class="col m12 s12">
											<div class="table-40v ver-titulo">ID</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${id}</div>
											<div class="table-copy"><i class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['nombre']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${datos[0]['usr_nombres']}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${datos[0]['usr_nombres']}')" class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['apellido']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${datos[0]['usr_apellidos']}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${datos[0]['usr_apellidos']}')" class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['correo electronico']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${email(datos[0]['usr_email'])}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${datos[0]['usr_email']}')" class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['rol']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${datos[0]['rol_nombre_'+cms_idioma]}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${datos[0]['rol_nombre_'+cms_idioma]}')" class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['estado']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${datos[0]['est_nombre_'+cms_idioma]}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${datos[0]['est_nombre_'+cms_idioma]}')" class="material-icons">open_in_new</i></div>

											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['padre']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${padre}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${padre}')" class="material-icons">open_in_new</i></div>
										
											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['mensaje11']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${formato_fecha(datos[0]['usr_modificado'])}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${formato_fecha(datos[0]['usr_modificado'])}')" class="material-icons">open_in_new</i></div>
											
											<div class="table-40v ver-titulo">${cms_traducciones[0][cms_idioma]['creado']}</div>
											<div class="table-60v" ondblclick="copiar_contenido(this)">${formato_fecha(datos[0]['usr_creado'])}</div>
											<div class="table-copy"><i onclick="mostrar_detalle('${formato_fecha(datos[0]['usr_creado'])}')" class="material-icons">open_in_new</i></div>

											${campos_extra}
										</div>
									</div>
								</div>
							</div>`;
					}
				}
				else
					M.toast({html:cms_traducciones[0][cms_idioma]['mensaje3'], classes: 'toasterror'});
			}
		}
	}
	// TODO: MODULO CENTRO DE COSTOS
	else
	if(seccion == "ccostos")
	{
		const seccion_singular = "ccosto";
		const seccion_legible = "Centro de costo";

		return `
		<div class="row mb-5" id="${seccion}-container">
			<div class="col m5 s12 pl-10">
				<div id="registros" class="paginador-left"></div>
			</div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginador"></ul>
				</div>
			</div>
		</div>
		<div class="tabla">
			<table class="custom-table">
				<thead>
					<tr>
						<th class="table-10">Código</th>
						<th class="table-30">Nombre</th>
						<th class="table-40">Observaciones</th>
						<th class="table-20">Acciones</th>
					</tr>
				</thead>
				<tbody id="resultado"></tbody>
			</table>
		</div>
		<div class="row mt-5">
			<div class="col m5 s12"></div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginadorB"></ul>
				</div>
			</div>
		</div>`;
	}
	else
	if(seccion == "ccostos_lista")
	{
		const modulo = "ccostos";
		const seccion_singular = "ccosto";
		const seccion_legible = "Centro de costo";

		//Acceso para botones
		var botones_accesos = "";
		if(validar_acceso('movimiento_ver', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_ver','','','${pagina}','${busqueda}',${datos['cco_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Ver ${seccion_legible}"><i class="material-icons">visibility</i></a>`;
		
		if(validar_acceso('movimiento_editar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_editar','','','${pagina}','${busqueda}',${datos['cco_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Editar ${seccion_legible}"><i class="material-icons">edit</i></a>`;

		if(validar_acceso('movimiento_eliminar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="eliminar_registro(${datos['cco_id']}, '${modulo}', ${pagina}, '${busqueda}')" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar ${seccion_legible}"><i class="material-icons">delete</i></a>`;

		var contenedor = `  
			<td>${datos['cco_codigo']}</td>
			<td class="texto-azuloscuro">${datos['cco_nombre']}</td>
			<td>${datos['cco_detalle']}</td>
			<td>${botones_accesos}</td>`;

		return contenedor;
	}
	else
	if(seccion == "ccosto_crear")
	{
		const modulo = "ccostos";
		const seccion_singular = "ccosto";
		const seccion_legible = "Centro de costo";

		const cmp = document.getElementById(`crear-${modulo}`);
		cmp.innerHTML = loaderComponent();

		cmp.innerHTML = `
		<form method="POST" id="${seccion_singular}_form">
			<ul class="collapsible custom-collapsible" id="ccostos-registros"></ul>
			<div class="row m-0">
				<div class="col s12 m3 offset-m9 nput-field">
					<input type="hidden" name="action" id="action" value="crear">
					<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal azulclaro">Guardar</button>
				</div>
			</div>
		</form>`;

		crear_ccosto();
		$('.collapsible').collapsible();
		document.getElementById(`${seccion_singular}_form`).addEventListener("submit", validacion_ccostos, false);
	}
	else
	if(seccion == "ccosto_editar")
	{
		const modulo = "ccostos";
		const seccion_singular = "ccosto";
		const seccion_legible = "Centro de costo";

		const modal = document.getElementById(`modal-${modulo}`);
		modal.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&id="+id+"&action=obtener_editar";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						const tmp = data.split("::");
						const datos = JSON.parse(tmp[0]);

						modal.innerHTML = `
						<form method="POST" id="${seccion_singular}_modal">
							<div class="modal-header">
								<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
									<div class="container mt-0">
										<div class="row mb-0">
											<div class="col s12 m11 l11">
												<h5 class="breadcrumbs-title mt-0 mb-0"><span>Editar ${seccion_legible}</span></h5>
											</div>
											<span class="modal-action modal-close"><i class="material-icons">close</i></span>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-content">
								<div class="panel">
									<input type="hidden" name="cco_id" id="cco_id" value="${datos[0]['cco_id']}">
									<div class="row">
										<div class="col s12 m3 input-field">
											<input type="text" name="cco_codigo" id="cco_codigo" placeholder="" onkeyup="validar(this)" value="${datos[0]['cco_codigo']}">
											<label>Código<i class="requerido">*</i></label>
											<div class="form-error" id="error.cco_codigo"></div>
										</div>
										<div class="col s12 m9 input-field">
											<input type="text" name="cco_nombre" id="cco_nombre" placeholder="" onkeyup="validar(this)" value="${datos[0]['cco_nombre']}">
											<label>Nombre<i class="requerido">*</i></label>
											<div class="form-error" id="error.cco_nombre"></div>
										</div>
										<div class="col s12 m12">
											<label>Observación</label>
											<textarea name="cco_detalle" id="cco_detalle" class="materialize-textarea" onkeyup="validar(this)">${datos[0]['cco_detalle']}</textarea>
											<div class="form-error" id="error.cco_detalle"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<div class="row m-0">
									<div class="col s12 m4 offset-m8 nput-field">
										<input type="hidden" name="action" id="action" value="editar">
										<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">Editar ${seccion_legible}</button>
									</div>
								</div>
							</div>
						</form>`;
						
						M.updateTextFields();
						document.getElementById(`${seccion_singular}_modal`).addEventListener("submit", validacion_ccostos, false);
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}

		$('#modal-'+modulo).modal({dismissible: false});
		var instance = M.Modal.getInstance(modal);
		instance.open();
	}
	// TODO: MODULO Movimientos
	else
	if(seccion == "movimientos") 
	{
		const seccion_singular = "movimiento";
		const seccion_legible = "Movimientos";

		return `
		<div class="row mb-5" id="${seccion}-container">
			<div class="col m5 s12 pl-10">
				<div id="registros" class="paginador-left"></div>
			</div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginador"></ul>
				</div>
			</div>
		</div>
		<div class="tabla">
			<table class="custom-table">
				<thead>
					<tr>
						<th class="table-10">ID</th>
						<th class="table-10">Fecha</th>
						<th class="table-10">Valor</th>
						<th class="table-15">Detalle</th>
						<th class="table-15">Centro de Costo</th>
						<th class="table-10">Banco / Caja</th>
						<th class="table-15">Empresa</th>
						<th class="table-10">Acciones</th>
					</tr>
				</thead>
				<tbody id="resultado"></tbody>
			</table>
		</div>
		<div class="row mt-5">
			<div class="col m5 s12"></div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginadorB"></ul>
				</div>
			</div>
		</div>`;
	}
	else
	if(seccion == "movimientos_lista")
	{
		const modulo = "movimientos";
		const seccion_singular = "movimiento";
		const seccion_legible = "Movimientos";

		//Acceso para botones
		var botones_accesos = "";
		if(validar_acceso('movimiento_ver', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_ver','','','${pagina}','${busqueda}',${datos['mov_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Ver ${seccion_legible}"><i class="material-icons">visibility</i></a>`;
		
		if(validar_acceso('movimiento_editar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_editar','','','${pagina}','${busqueda}',${datos['mov_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Editar ${seccion_legible}"><i class="material-icons">edit</i></a>`;

		if(validar_acceso('movimiento_eliminar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="eliminar_registro(${datos['mov_id']}, '${modulo}', ${pagina}, '${busqueda}')" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar ${seccion_legible}"><i class="material-icons">delete</i></a>`;

		let sucursal = "";
		if(datos['ban_nombre'] != null) {
			const numeroTexto = datos['ban_numero'].toString();
			const mask_numero = numeroTexto.slice(numeroTexto.length - 2);
			sucursal = `${mask_numero} - ${datos['ban_nombre']}`;
		} else {
			sucursal = `${datos['caj_id']} - ${datos['caj_nombre']}`;
		};

		const claseTipo = datos['mtp_slug'] == "+" ? "mov-add" : "mov-deg";
		var contenedor = `  
			<td>${datos['mov_id']}</td>
			<td>${datos['mov_fecha']}</td>
			<td class="mov ${claseTipo}"><i>${datos['mtp_slug']}</i> ${ajustarPrecio(datos['mov_valor'])}</td>
			<td>${datos['mov_detalle']}</td>
			<td>${datos['cco_codigo']} - ${datos['cco_nombre']}</td>
			<td>${sucursal}</td>
			<td class="texto-azuloscuro">${datos['emp_nombre']}</td>
			<td>${botones_accesos}</td>`;

		return contenedor;
	}
	else
	if(seccion == "movimiento_crear")
	{
		const modulo = "movimientos";
		const seccion_singular = "movimiento";
		const seccion_legible = "Movimientos";

		const cmp = document.getElementById(`crear-${modulo}`);
		cmp.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params 	= "idioma="+cms_idioma+"&action=obtener_crear";
		xhr.open("POST", "inc/"+modulo+".php",true);
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
					{
						const tmp = data.split("::");
						centros_global 	= JSON.parse(tmp[0]);
						bancos_global 	= JSON.parse(tmp[1]);
						cajas_global 	= JSON.parse(tmp[2]);
						empresas_global = JSON.parse(tmp[3]);
						tipos_global 	= JSON.parse(tmp[4]);

						cmp.innerHTML = `
						<form method="POST" id="${seccion_singular}_form">
							<ul class="collapsible custom-collapsible" id="mregistro"></ul>
							<div class="row m-0">
								<div class="col s12 m3 offset-m9 nput-field">
									<input type="hidden" name="action" id="action" value="crear">
									<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal azulclaro">Guardar</button>
								</div>
							</div>
						</form>`;

						crear_movimiento();
						$('.collapsible').collapsible();
						document.getElementById(`${seccion_singular}_form`).addEventListener("submit", validacion_movimientos, false);
					}

				} else {
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}
		}
	}
	else
	if(seccion == "movimiento_editar")
	{
		const modulo = "movimientos";
		const seccion_singular = "movimiento";
		const seccion_legible = "Movimiento";

		const modal = document.getElementById(`modal-${modulo}`);
		modal.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&id="+id+"&action=obtener_editar";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						const tmp = data.split("::");
						const datos 	= JSON.parse(tmp[0]);
						const centros 	= JSON.parse(tmp[1]);
						const bancos 	= JSON.parse(tmp[2]);
						const cajas 	= JSON.parse(tmp[3]);
						const empresas 	= JSON.parse(tmp[4]);
						const tipos 	= JSON.parse(tmp[5]);

						let optionTipos = "";
						for (var i = 0; i < tipos.length; i++) {
							const selected = datos[0]['mtp_id'] == tipos[i]['mtp_id'] ? "selected" : "";
							optionTipos = optionTipos + `<option value="${tipos[i]['mtp_id']}" ${selected}>${tipos[i]['mtp_nombre']}</option>`;
						}

						let optionCentros = "";
						for (var i = 0; i < centros.length; i++) {
							const selected = datos[0]['cco_id'] == centros[i]['cco_id'] ? "selected" : "";
							optionCentros = optionCentros + `<option value="${centros[i]['cco_id']}" ${selected}>${centros[i]['cco_codigo']} - ${centros[i]['cco_nombre']}</option>`;
						}

						let optionEmpresa = "";
						for (var i = 0; i < empresas.length; i++) {
							const selected = datos[0]['emp_id'] == empresas[i]['emp_id'] ? "selected" : "";
							optionEmpresa = optionEmpresa + `<option value="${empresas[i]['emp_id']}" ${selected}>${empresas[i]['emp_nombre']}</option>`;
						}

						let optionBancos = `<optgroup label="Bancos">`;
						for (var i = 0; i < bancos.length; i++) {
							const numeroTexto = bancos[i]['ban_numero'].toString();
							const numero = numeroTexto.slice(numeroTexto.length - 2);
							const selected = datos[0]['ban_id'] == bancos[i]['ban_id'] ? "selected" : "";
							optionBancos = optionBancos + `<option value="${bancos[i]['ban_id']}:1" ${selected}>${numero} - ${bancos[i]['ban_nombre']}</option>`;
						}

						optionBancos = optionBancos + `</optgroup>`;

						let optionCajas = `<optgroup label="Cajas">`;
						for (var i = 0; i < cajas.length; i++) {
							const selected = datos[0]['caj_id'] == cajas[i]['caj_id'] ? "selected" : "";
							optionCajas = optionCajas + `<option value="${cajas[i]['caj_id']}:2" ${selected}>${cajas[i]['caj_nombre']}</option>`;
						}

						optionCajas = optionCajas + `</optgroup>`;

						modal.innerHTML = `
						<form method="POST" id="${seccion_singular}_modal">
							<div class="modal-header">
								<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
									<div class="container mt-0">
										<div class="row mb-0">
											<div class="col s12 m11 l11">
												<h5 class="breadcrumbs-title mt-0 mb-0"><span>Editar ${seccion_legible}</span></h5>
											</div>
											<span class="modal-action modal-close"><i class="material-icons">close</i></span>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-content">
								<div class="panel">
									<input type="hidden" name="mov_id" id="mov_id" value="${datos[0]['mov_id']}">
									<div class="row">
										<div class="col s12 m4 input-field">
											<input type="date" name="mov_fecha" id="mov_fecha" placeholder="" autocomplete="off" onchange="validar(this)" onkeyup="validar(this)" value="${datos[0]['mov_fecha']}">
											<label>Fecha<i class="requerido">*</i></label>
											<div class="form-error" id="error.mov_fecha"></div>
										</div>
										<div class="col s12 m4">
											<label>Tipo</label><i class="requerido">*</i>
											<select name="mtp_id" id="mtp_id" onchange="validar(this)">
												<option value="" selected disabled>Seleccione una opci&oacute;n</option>
												${optionTipos}
											</select>
											<div class="form-error" id="error.mtp_id"></div>
										</div>
										<div class="col s12 m4 input-field">
											<input type="text" name="mov_valor" id="mov_valor" placeholder="" autocomplete="off" onkeyup="ajustar_valor(this); validar(this)" value="${ajustarPrecio(datos[0]['mov_valor'])}">
											<label>Valor<i class="requerido">*</i></label>
											<div class="form-error" id="error.mov_valor"></div>
										</div>
										<div class="col s12 m4 select">
											<label>Centro de Costo</label><i class="requerido">*</i>
											<select name="cco_id" id="cco_id" onchange="validar(this)">
												<option value="" selected disabled>Seleccione una opci&oacute;n</option>
												${optionCentros}
											</select>
											<div class="form-error" id="error.cco_id"></div>
										</div>
										<div class="col s12 m4 select">
											<label>Banco / Caja</label><i class="requerido">*</i>
											<select name="suc_id" id="suc_id" onchange="validar(this)">
												<option value="" selected disabled>Seleccione una opci&oacute;n</option>
												${optionBancos}
												${optionCajas}
											</select>
											<div class="form-error" id="error.suc_id"></div>
										</div>
										<div class="col s12 m4 select">
											<label>Empresa</label><i class="requerido">*</i>
											<select name="emp_id" id="emp_id" onchange="validar(this)">
												<option value="" selected disabled>Seleccione una opci&oacute;n</option>
												${optionEmpresa}
											</select>
											<div class="form-error" id="error.emp_id"></div>
										</div>
										<div class="col s12 m12">
											<label>Detalle<i class="requerido">*</i></label>
											<textarea name="mov_detalle" id="mov_detalle" class="materialize-textarea" autocomplete="off" onchange="validar(this)" onkeyup="titulo_item(this)">${datos[0]['mov_detalle']}</textarea>
											<div class="form-error" id="error.mov_detalle"></div>
										</div>
										<div class="col s12 m12">
											<label>Observaciones</label>
											<textarea name="mov_observaciones" id="mov_observaciones" class="materialize-textarea" autocomplete="off" onchange="validar(this)">${datos[0]['mov_observacion']}</textarea>
											<div class="form-error" id="error.mov_observaciones"></div>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<div class="row m-0">
									<div class="col s12 m4 offset-m8 nput-field">
										<input type="hidden" name="action" id="action" value="editar">
										<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">Editar ${seccion_legible}</button>
									</div>
								</div>
							</div>
						</form>`;
						
						$(`#mtp_id`).selectize();
						$(`#cco_id`).selectize();
						$(`#suc_id`).selectize();
						$(`#emp_id`).selectize();
						M.updateTextFields();
						document.getElementById(`${seccion_singular}_modal`).addEventListener("submit", validacion_movimientos, false);
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}

		$('#modal-'+modulo).modal({dismissible: false});
		var instance = M.Modal.getInstance(modal);
		instance.open();
	}
	// TODO: MODULO BANCOS
	else
	if(seccion == "bancos")
	{
		const seccion_singular = "banco";
		const seccion_legible = "Banco";

		return `
		<div class="row mb-5" id="${seccion}-container">
			<div class="col m5 s12 pl-10">
				<div id="registros" class="paginador-left"></div>
			</div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginador"></ul>
				</div>
			</div>
		</div>
		<div class="tabla">
			<table class="custom-table">
				<thead>
					<tr>
						<th class="table-15">Numero</th>
						<th class="table-25">Nombre</th>
						<th class="table-20">Banco</th>
						<th class="table-20">Monto Actual</th>
						<th class="table-20">Acciones</th>
					</tr>
				</thead>
				<tbody id="resultado"></tbody>
			</table>
		</div>
		<div class="row mt-5">
			<div class="col m5 s12"></div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginadorB"></ul>
				</div>
			</div>
		</div>`;
	}
	else
	if(seccion == "bancos_lista")
	{
		const modulo = "bancos";
		const seccion_singular = "banco";
		const seccion_legible = "Banco";

		//Acceso para botones
		var botones_accesos = "";
		if(validar_acceso('movimiento_ver', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_ver','','','${pagina}','${busqueda}',${datos['ban_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Ver ${seccion_legible}"><i class="material-icons">visibility</i></a>`;
		
		if(validar_acceso('movimiento_editar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_editar','','','${pagina}','${busqueda}',${datos['ban_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Editar ${seccion_legible}"><i class="material-icons">edit</i></a>`;

		if(validar_acceso('movimiento_eliminar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="eliminar_registro(${datos['ban_id']}, '${modulo}', ${pagina}, '${busqueda}')" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar ${seccion_legible}"><i class="material-icons">delete</i></a>`;

		const numeroTexto = datos['ban_numero'].toString();
		const numero = numeroTexto.slice(numeroTexto.length - 2);

		var contenedor = `  
			<td>${numero}</td>
			<td class="texto-azuloscuro">${datos['ban_nombre']}</td>
			<td>${datos['btp_nombre']}</td>
			<td>${ajustarPrecio(datos['ban_monto'])}</td>
			<td>${botones_accesos}</td>`;

		return contenedor;
	}
	else
	if(seccion == "banco_crear")
	{
		const modulo = "bancos";
		const seccion_singular = "banco";
		const seccion_legible = "Banco";

		const cmp = document.getElementById(`crear-${modulo}`);
		cmp.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params 	= "idioma="+cms_idioma+"&action=obtener_crear";
		xhr.open("POST", "inc/"+modulo+".php",true);
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
					{
						const tmp = data.split("::");
						tipos_global = JSON.parse(tmp[0]);

						cmp.innerHTML = `
						<form method="POST" id="${seccion_singular}_form">
							<ul class="collapsible custom-collapsible" id="${seccion_singular}-registros"></ul>
							<div class="row m-0">
								<div class="col s12 m3 offset-m9 nput-field">
									<input type="hidden" name="action" id="action" value="crear">
									<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal azulclaro">Guardar</button>
								</div>
							</div>
						</form>`;

						crear_banco();
						$('.collapsible').collapsible();
						document.getElementById(`${seccion_singular}_form`).addEventListener("submit", validacion_bancos, false);
					}

				} else {
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}
		}		
	}
	else
	if(seccion == "banco_editar")
	{
		const modulo = "bancos";
		const seccion_singular = "banco";
		const seccion_legible = "Banco";

		const modal = document.getElementById(`modal-${modulo}`);
		modal.innerHTML = loaderComponent();

		var xhr = new XMLHttpRequest();
		var params = "idioma="+cms_idioma+"&id="+id+"&action=obtener_editar";
		xhr.open("POST", "inc/"+modulo+".php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					// console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						const tmp = data.split("::");
						const datos = JSON.parse(tmp[0]);
						const bancos = JSON.parse(tmp[1]);

						let optionBancos = "";
						for (var i = 0; i < bancos.length; i++) {
							const selected = datos[0]['btp_id'] == bancos[i]['btp_id'] ? "selected" : "";
							optionBancos = optionBancos + `<option value="${bancos[i]['btp_id']}" ${selected}>${bancos[i]['btp_nombre']}</option>`;
						}

						modal.innerHTML = `
						<form method="POST" id="${seccion_singular}_modal">
							<div class="modal-header">
								<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
									<div class="container mt-0">
										<div class="row mb-0">
											<div class="col s12 m11 l11">
												<h5 class="breadcrumbs-title mt-0 mb-0"><span>Editar ${seccion_legible}</span></h5>
											</div>
											<span class="modal-action modal-close"><i class="material-icons">close</i></span>
										</div>
									</div>
								</div>
							</div>
							<div class="modal-content">
								<div class="panel">
									<input type="hidden" name="ban_id" id="ban_id" value="${datos[0]['ban_id']}">
									<div class="row">
										<div class="col s12 m4 input-field">
											<input type="text" name="ban_numero" id="ban_numero" placeholder="" onkeyup="validar(this)" value="${datos[0]['ban_numero']}">
											<label>Numero</label>
											<div class="form-error" id="error.ban_numero"></div>
										</div>
										<div class="col s12 m4 input-field">
											<input type="text" name="ban_nombre" id="ban_nombre" placeholder="" onkeyup="validar(this)" value="${datos[0]['ban_nombre']}">
											<label>Nombre</label>
											<div class="form-error" id="error.ban_nombre"></div>
										</div>
										<div class="col s12 m4 select">
											<label>Banco</label>
											<select name="btp_id" id="btp_id" onchange="validar(this)">
												<option value="" selected disabled>Seleccione una opci&oacute;n</option>
												${optionBancos}
											</select>
											<div class="form-error" id="error.btp_id"></div>
										</div>
										<div class="col s12 m4 input-field">
											<input type="text" name="ban_monto" id="ban_monto" placeholder="" onkeyup="ajustar_valor(this);" value="${ajustarPrecio(datos[0]['ban_monto'])}">
											<label>Monto</label>
											<div class="form-error" id="error.ban_monto"></div>
										</div> 
									</div>
								</div>
							</div>
							<div class="modal-footer">
								<div class="row m-0">
									<div class="col s12 m4 offset-m8 nput-field">
										<input type="hidden" name="action" id="action" value="editar">
										<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">Editar ${seccion_legible}</button>
									</div>
								</div>
							</div>
						</form>`;
						
						$('#btp_id').selectize();
						M.updateTextFields();
						document.getElementById(`${seccion_singular}_modal`).addEventListener("submit", validacion_bancos, false);
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}

		$('#modal-'+modulo).modal({dismissible: false});
		var instance = M.Modal.getInstance(modal);
		instance.open();
	}
	// TODO: MODULO CAJAS
	else
	if(seccion == "cajas")
	{
		const seccion_singular = "caja";
		const seccion_legible = "Caja";

		return `
		<div class="row mb-5" id="${seccion}-container">
			<div class="col m5 s12 pl-10">
				<div id="registros" class="paginador-left"></div>
			</div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginador"></ul>
				</div>
			</div>
		</div>
		<div class="tabla">
			<table class="custom-table">
				<thead>
					<tr>
						<th class="table-20">Id</th>
						<th class="table-30">Nombre</th>
						<th class="table-30">Monto Actual</th>
						<th class="table-20">Acciones</th>
					</tr>
				</thead>
				<tbody id="resultado"></tbody>
			</table>
		</div>
		<div class="row mt-5">
			<div class="col m5 s12"></div>
			<div class="col m7 s12 pr-0">
				<div class="paginador-right">
					<ul class="pagination" id="paginadorB"></ul>
				</div>
			</div>
		</div>`;
	}
	else
	if(seccion == "cajas_lista")
	{
		const modulo = "cajas";
		const seccion_singular = "caja";
		const seccion_legible = "Caja";

		//Acceso para botones
		var botones_accesos = "";
		if(validar_acceso('movimiento_ver', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_ver','','','${pagina}','${busqueda}',${datos['caj_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Ver ${seccion_legible}"><i class="material-icons">visibility</i></a>`;
		
		if(validar_acceso('movimiento_editar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="plantillas('${seccion_singular}_editar','','','${pagina}','${busqueda}',${datos['caj_id']})" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Editar ${seccion_legible}"><i class="material-icons">edit</i></a>`;

		if(validar_acceso('movimiento_eliminar', rol))
			botones_accesos = botones_accesos + 
			`<a onclick="eliminar_registro(${datos['caj_id']}, '${modulo}', ${pagina}, '${busqueda}')" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar ${seccion_legible}"><i class="material-icons">delete</i></a>`;

		var contenedor = `  
			<td>${datos['caj_id']}</td>
			<td class="texto-azuloscuro">${datos['caj_nombre']}</td>
			<td>${ajustarPrecio(datos['caj_monto'])}</td>
			<td>${botones_accesos}</td>`;

		return contenedor;
	}
	else
	if(seccion == "caja_crear")
	{
		const modulo = "cajas";
		const seccion_singular = "caja";
		const seccion_legible = "Caja";

		const cmp = document.getElementById(`crear-${modulo}`);
		cmp.innerHTML = loaderComponent();

		cmp.innerHTML = `
		<form method="POST" id="${seccion_singular}_form">
			<ul class="collapsible custom-collapsible" id="${seccion_singular}-registros"></ul>
			<div class="row m-0">
				<div class="col s12 m3 offset-m9 nput-field">
					<input type="hidden" name="action" id="action" value="crear">
					<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal azulclaro">Guardar</button>
				</div>
			</div>
		</form>`;

		crear_caja();
		$('.collapsible').collapsible();
		document.getElementById(`${seccion_singular}_form`).addEventListener("submit", validacion_cajas, false);
	}
}
