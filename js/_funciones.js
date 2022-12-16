const cargar_registros = (seccion,pagina,busqueda,action="lista", id=0) => {
	// console.log({seccion, pagina, busqueda, action, id});

	const url = id ? "?s="+busqueda+"&p="+pagina+"&c="+id : "?s="+busqueda+"&p="+pagina;
	const cmp = document.getElementById(seccion);
	var xhr 	= new XMLHttpRequest();
	var params 	= "busqueda="+busqueda+"&pagina="+pagina+"&idioma="+cms_idioma+"&action="+action+"&id="+id;
	xhr.open("POST", "inc/"+seccion+".php",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	//console.log(params);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
			{
				var tmpA = xhr.responseText.trim().split("::");
				data = xhr.responseText.trim().split("::")[0];
				var rol = xhr.responseText.trim().split("::")[tmpA.length - 1];

				if(document.getElementById(seccion+'-container') == null)
					document.getElementById(seccion).innerHTML = plantillas(seccion, "", rol, pagina, busqueda);

				// console.log(data);
				if(data < 0)
					M.toast({html: "Ha ocurrido un error. Por favor, intente de nuevo. Código: "+data, classes: 'toasterror'});
				else
				if(data == 0)
				{
					document.getElementById('resultado').innerHTML = "";
					document.getElementById('paginador').innerHTML = "";
					document.getElementById('paginadorB').innerHTML = "";
					var registrosC = document.getElementById('registros');
					registrosC.innerHTML = "No hay registros";
					busqueda = "";
					pagina = 1;
					history.pushState(null, "", url);
				}
				else
				{
					data = xhr.responseText.trim();
					// Separamos los resultados del número de páginas y página actual
					// console.log(data);
					data = data.split("::");
					var datos 	= JSON.parse(data[0]);
					var paginas = parseInt(data[1]);
					var pagina 	= parseInt(data[2]);
					var registros = parseInt(data[3]);
					

					// Mostramos los resultados
					var contenedor = document.getElementById('resultado');
					contenedor.innerHTML = "";
					for(var i=0; i<datos.length; i++)
						contenedor.innerHTML = contenedor.innerHTML + plantillas(seccion+'_lista', datos[i], rol, pagina, busqueda);

					// Paginación
					var paginador  = document.getElementById('paginador');
					var paginadorB = document.getElementById('paginadorB');
					// Verificamos qué números de páginas deben mostrarse
					if(paginas > 5 && pagina > 3)
					{
						if((pagina + 2) > paginas)
							superior = paginas;
						else
							superior = pagina + 2;

						if((superior - 4) < 1)
							inferior = 1;
						else
							inferior = superior - 4;
					}
					else
					if(paginas > 5)
					{
						var inferior = 1;
						var superior = 5;
					}
					else
					{
						var inferior = 1;
						var superior = paginas;
					}
					// Mostramos las páginas del paginador
					paginador.innerHTML = "";
					for(var i=inferior; i<=superior; i++)
					{
						if(i == (pagina))
							paginador.innerHTML = paginador.innerHTML +
								'<li class="active"><a>'+i+'</a></li>';
						else
							paginador.innerHTML = paginador.innerHTML +
								`<li class="waves-effect"><a onclick="cargar_registros('${seccion}',${i},'${busqueda}')">${i}</a></li>`;
					}
					paginadorB.innerHTML = paginador.innerHTML;
					// Verificamos si el botón atrás está activo

					//variable de idioma
					var p1 = "Primera página";
					var pU = "Ultima página";

					if(pagina == 1)
					{
						paginador.innerHTML = `<li title="${p1}" class="disabled"><a><i class="material-icons">first_page</i></a></li>` + paginador.innerHTML;
						paginadorB.innerHTML = `<li title="${p1}" class="disabled"><a><i class="material-icons">first_page</i></a></li>` + paginadorB.innerHTML;
					}
					else
					{
						paginador.innerHTML = `<li title="${p1}" class="waves-effect"><a onclick="cargar_registros('${seccion}',1,'${busqueda}','${action}')"><i class="material-icons">first_page</i></a></li>` + paginador.innerHTML;
						paginadorB.innerHTML = `<li title="${p1}" class="waves-effect"><a onclick="cargar_registros('${seccion}',1,'${busqueda}','${action}')"><i class="material-icons">first_page</i></a></li>` + paginadorB.innerHTML;
					}
					// Verificamos si el botón adelante está activo
					if(pagina == paginas)
					{
						paginador.innerHTML = paginador.innerHTML + `<li title="${pU}" class="disabled"><a><i class="material-icons">last_page</i></a></li>`;
						paginadorB.innerHTML = paginadorB.innerHTML + `<li title="${pU}" class="disabled"><a><i class="material-icons">last_page</i></a></li>`;
					}
					else
					{
						paginador.innerHTML = paginador.innerHTML + `<li title="${pU}" class="waves-effect"><a onclick="cargar_registros('${seccion}',${paginas},'${busqueda}','${action}')"><i class="material-icons">last_page</i></a></li>`;
						paginadorB.innerHTML = paginadorB.innerHTML + `<li title="${pU}" class="waves-effect"><a onclick="cargar_registros('${seccion}',${paginas},'${busqueda}','${action}')"><i class="material-icons">last_page</i></a></li>`;
						//console.log(paginador);
					}
					// Cargamos la info de registros
					var registrosC = document.getElementById('registros');
					registrosC.innerHTML = `<b>Registros:</b> ${registros} - <b>Páginas: </b>${paginas}`;
					// Modificamos la URL
					history.pushState(null, "", url);
				}
			}
			else
				M.toast({html: "Ha ocurrido un error. verifique su conexión a Internet", classes: 'toasterror'});
		}
	}
}
const eliminar_registro = (id, seccion, pagina, busqueda, action='lista', datos) => {
	Swal.fire({
		title: "¿Estás seguro de eliminar el registro?",
		text:  "Una vez eliminado no podrá ser recuperado",
		icon: "error",
		showCancelButton: true,
		confirmButtonColor: '#19a0c9',
		cancelButtonColor: '#003359',
		confirmButtonText: "Confirmar",
		cancelButtonText: "Cancelar",
		reverseButtons: true
	})

		.then((result) => {
			if (result.isConfirmed)
		{
			var xhr_usr = new XMLHttpRequest();
			var params = "id="+id+"&action=eliminar";
			xhr_usr.open("POST", "inc/"+seccion+".php",true);
			xhr_usr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr_usr.send(params);
			xhr_usr.onreadystatechange = function()
			{
				if(xhr_usr.readyState == 4)
				{
					if(xhr_usr.status == 200)
					{
						var data = xhr_usr.responseText.trim();
						console.log(data);
						if(data < 0)
							M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
						else
						{
							M.toast({html: "El registro ha sido eliminado correctamente.", classes: 'toastdone'});
							cargar_registros(seccion, pagina, busqueda, action, datos);

						}
					}
					else
						M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}
		} 
	});
}

/*TODO: FUNCION DE ACCESO */
const validar_acceso = (indice, rol) => {
	const boton = indice;
	const accesos = accesos_botones[boton].split(",");

	const acceso = accesos.indexOf(rol) > -1 ? 1 : 0;
	return acceso;
}

/* Secundarias */
function texto2moneda(cmp){
	if(cmp.value != "")
	{
		var valor = cmp.value;
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		var entero = parseInt(valor);
		if(isNaN(entero))
			cmp.value = 0;
		else
			cmp.value = '$'+new Intl.NumberFormat("de-DE").format(entero);
	}
}

function moneda2texto(valor){
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	return valor;
}

function copiar_contenido(cmp){
	var seleccion = document.createRange();
	seleccion.selectNodeContents(cmp);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(seleccion);
	var res = document.execCommand('copy');
	window.getSelection().removeRange(seleccion);
	if(res)
		M.toast({html: cms_traducciones[0][cms_idioma]['mensaje5'], classes: 'toastdone'});
}

// TODO: Formatear fecha
const formato_fecha = (fecha, idioma="es", metodo=0) => {
	if(fecha == '0000-00-00 00:00:00')
		return '0000-00-00';
	else
	{
		var tmp = fecha.split(" ");
		var tmpF = tmp[0].split("-");
		//console.log(tmpF);
		if(tmp[1] != undefined)
		var hora = tmp[1].split(":");

		if(tmpF[1] == "01")
			var mes = 'Enero';
		else
		if(tmpF[1] == "02")
			var mes = 'Febrero';
		else
		if(tmpF[1] == "03")
			var mes = 'Marzo';
		else
		if(tmpF[1] == "04")
			var mes = 'Abril';
		else
		if(tmpF[1] == "05")
			var mes = 'Mayo';
		else
		if(tmpF[1] == "06")
			var mes = 'Junio';
		else
		if(tmpF[1] == "07")
			var mes = 'Julio';
		else
		if(tmpF[1] == "08")
			var mes = 'Agosto';
		else
		if(tmpF[1] == "09")
			var mes = 'Septiembre';
		else
		if(tmpF[1] == "10")
			var mes = 'Octubre';
		else
		if(tmpF[1] == "11")
			var mes = 'Noviembre';
		else
		if(tmpF[1] == "12")
			var mes = 'Diciembre';
		else
			return 'Sin establecer';

		mesA = mes.substring(0,3); // Abreviación del mes a 3 caracteres desde el primer caracter.
	 
		if(tmp[1] != undefined){
				if(metodo == 0){
						return mes+" "+tmpF[2]+" / "+tmpF[0]+" - "+hora[0]+":"+hora[1];
				}
				if(metodo == 1){
						return mesA+" "+tmpF[2]+" / "+tmpF[0]+" - "+hora[0]+":"+hora[1];
				}
		}else{
				if(metodo == 0){
						return mes+" "+tmpF[2]+" / "+tmpF[0];
				}
				if(metodo == 1){
						return mesA+" "+tmpF[2]+" / "+tmpF[0];
				}
		}
	}
};

function obtener_variables(){
	var url = window.location.search.split("?");
	url = url[1].split("&");
	var variables = [];
	for(var i=0; i<url.length; i++)
	{
		var temp = url[i].split("=");
		if(temp[0] == 'p')
			variables[0] = temp[1];
		if(temp[0] == 's')
			variables[1] = temp[1];
	}

	return variables;
}

function cambiar_idioma(idioma){
	console.log(idioma);
	var xhr 	= new XMLHttpRequest();
	var params 	= "idioma="+idioma+"&action=set_idioma";
	xhr.open('POST', 'inc/configuracion.php',true);
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
					M.toast({html: cms_traducciones[0][cms_idioma]['mensaje4'+":"]+data, classes: 'toasterror'});
				else
				{
					
					location.reload();
				}
			}
			else
				M.toast({html: cms_traducciones[0][cms_idioma]['mensaje3']+".", classes: 'toasterror'});
		}
	}
}

function decimal(x) {
	return Number.parseFloat(x).toFixed(1);
}

function ajustarPrecio(x){
	return '$'+x.toLocaleString('de-DE');
}

function zeroFill( number, width )
{
	width -= number.toString().length;
	if ( width > 0 )
	{
		return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
	}
	return number + ""; // always return a string
}

function buscar(seccion, cmp){
	var variables = obtener_variables();
	var busqueda = document.getElementById(cmp).value;
	var pagina = variables[0];

	if(event.which == 13 || event.which == 9)
	{
		if(localStorage.busqueda == "")
			var action = "lista";
		else
			var action = localStorage.busqueda;

		cargar_registros(seccion, pagina, busqueda, action);
	}
}

function mostrar_detalle(cmp)
{
	var detalles = cmp;
	document.getElementById('modal-auxiliar1').innerHTML = 
	`
		<div class="modal-content">
			<span class="modal-action modal-close"><i class="material-icons">cancel</i></span>
			<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
				<div class="container mt-0">
					<div class="row mb-0">
						<div class="col s12 m11 l11">
							<h5 class="breadcrumbs-title mt-0 mb-0"><span>${cms_traducciones[0][cms_idioma]['Detalles del registro']}</span></h5>
						</div>
					</div>
				</div>
			</div>

			<div class="panel">
				<div class="row">
					
					<div class="col m12 s12">

						${detalles}
					</div>
				</div>
			</div>
		</div>;
	`;;
	$('#modal-auxiliar1').modal({dismissible: false});
	var instance = M.Modal.getInstance(document.getElementById('modal-auxiliar1'));
	instance.open();
}

const cargar_variaciones = (productos, estados, visibles, detalles) => {

	if(productos.length > 0)
	{
		var status_var = "";
		var visible = "";
		var collapse = "<ul class='collapsible'>";
		productos.forEach(function(producto, index){
			status_var = "";
			visible = "";

			for (var i = 0; i < estados.length; i++)
			{
				if(estados[i]['prs_id'] == producto['prs_id'])
					var selected = "selected";
				else
					var selected = "";

				status_var = status_var + `<option value="${estados[i]['prs_id']}" ${selected}>${estados[i]['prs_nombre_'+cms_idioma]}</option>`;

			}

			for (var i = 0; i < visibles.length; i++)
			{
				if(visibles[i]['boo_id'] == producto['prd_visible'])
					var selected = "selected";
				else
					var selected = "";

				visible = visible + `<option value="${visibles[i]['boo_id']}" ${selected}>${visibles[i]['boo_nombre_'+cms_idioma]}</option>`;
			}

			var x = producto['vrd_ids'].split(",");

			//Obtenemos el nombre complementario del producto (Variaciones)
			var complemento = "";
			for(var i=0; i<x.length; i++)
			{
				var index = -1;
				for(var j=0; j<detalles.length; j++)
				{
					if(parseInt(detalles[j]['vrd_id']) == parseInt(x[i]))
					{
						index = j;
					}
				}
				if(index != -1)
					complemento = complemento + " " + detalles[index]['vrd_nombre'];
			}


			if(producto['prd_imagenprincipal'] != ""){
				var $imagen = "uploads/productos/"+producto['prd_imagenprincipal'];
			}
			else{
				var $imagen = "";
			}

			collapse = collapse + `
				<li>
					<div class="collapsible-header"><b>${complemento}</b></div>
					<div class="collapsible-body">
						<div class="panel">
							<div class="row">
							<input type="hidden" id="prd_id${producto['prd_id']}" name="prd_idv[]" value="${producto['prd_id']}">
							<input type="hidden" name="imagen[]"  id="imagen[${producto['prd_id']}]" value="${producto['prd_imagenprincipal']}">
								<div class="col s12 m3">
									<span class="dropify-label">${cms_traducciones[0][cms_idioma]['imagen principal']}</span>
									<input type="file"  id="var_imagen${producto['prd_id']}" name="var_imagen[]" class="dropify productos-imagen" data-default-file="${$imagen}">
								</div>
								<div class="col s2 m4">
									<label for="var_precio">${cms_traducciones[0][cms_idioma]['precio']}</label>
									<input type="text" name="var_precio[]" id="var_precio${producto['prd_id']}" class="validate" minlength="2" required maxlength="30" placeholder="" value="${producto['prd_precio']}">
								</div>
								<div class="col s2 m4">
									<label for="var_promocion">${cms_traducciones[0][cms_idioma]['promocion']}</label>
									<input type="text" name="var_promocion[]" id="var_promocion${producto['prd_id']}" class="validate" minlength="2" required maxlength="30" placeholder="" value="${producto['prd_promocion']}">
								</div>
								
								<div class="col s2 m4 select">
									<label for="var_estado">${cms_traducciones[0][cms_idioma]['estado']}</label>
									<select name="var_estado[]" id="var_estado${producto['prd_id']}" required>
										<option value=""selected disabled>${cms_traducciones[0][cms_idioma]['Seleccione una opcion']}</option>
										${status_var}
									</select>
								</div>

								<div class="col s2 m4 select">
									<label for="var_visible">${cms_traducciones[0][cms_idioma]['visible']}</label>
									<select name="var_visible[]" id="var_visible${producto['prd_id']}" required>
										<option value=""selected disabled>${cms_traducciones[0][cms_idioma]['Seleccione una opcion']}</option>
										${visible}
									</select>
								</div>
							</div>
						</div>
					</div>
				</li>`;
		});

		collapse = collapse + "<ul>";

		return collapse;
	}
	else
	{
		return "";
	}
}

const inicializar_variaciones = (productos) => {

	let imagenes_variaciones = [];
	if(productos.length > 0)
	{
		productos.forEach(function(producto, index){
			//Inicializamos las imágenes
			imagenes_variaciones.push($(`#var_imagen${producto['prd_id']}`).dropify({
				messages: {
					'default': "Selecciona o arrastra una imagen",
					'replace': "Selecciona o arrastra una imagen",
					'remove':  "Eliminar",
					'error':   "Ooops, Algo ha salido mal",
				}
			}));

			imagenes_variaciones[imagenes_variaciones.length - 1].on('dropify.afterClear', function(event, element){
				document.getElementById(`var_imagen${producto['prd_id']}C`).value = "";
			});

			//Inicializamos los estados
			$(`#var_estado${producto['prd_id']}`).selectize();
			$(`#var_visible${producto['prd_id']}`).selectize();

		});
	}
}

// TODO: FUNCION QUE GENERA LAS VARIACIONES
const generar_variaciones = (seccion) => {

	const seccion_singular = "producto";
	const seccion_legible = "Producto";

	const boton = document.getElementById('action_variacion');
	boton.setAttribute("disabled", "disabled");

	const variaciones_productos = document.getElementById("variaciones_productos");
	variaciones_productos.innerHTML = loaderComponent();

	const id = document.getElementById('prd_id') != null ? document.getElementById('prd_id').value : 0;
	var xhr = new XMLHttpRequest();
	var params = $(`#${seccion_singular}_form`).serialize();
	params = params + "&variaciones=''";
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
					M.toast({html: "Debes seleccionar al menos una variación", classes: 'toasterror'});
					variaciones_productos.innerHTML = "";
				} else {
					
					const tmp = data.split("::");
					const combinaciones = JSON.parse(tmp[0]);
					const datos = JSON.parse(tmp[1]);
					const variaciones = JSON.parse(tmp[2]);
					const visibles = JSON.parse(tmp[3]);
					const estados = JSON.parse(tmp[4]);
					variacionesLength = 0;
					let collapse = `<ul class="collection custom-collection">`;
					let imagenes_variaciones = [];
					let generar = false;

					const tmpC = combinaciones[0].split(",");
					if(variacionesLength != 0) {

						if(variacionesLength != tmpC.length) {

							Swal.fire({
								title: "¿Estás seguro de eliminar el registro?",
								text:  "Una vez eliminado no podrá ser recuperado",
								icon: "error",
								showCancelButton: true,
								confirmButtonColor: '#19a0c9',
								cancelButtonColor: '#003359',
								confirmButtonText: "Confirmar",
								cancelButtonText: "Cancelar",
								reverseButtons: true
							}).then((willDelete) => {

								if(willDelete) {

									generar = true;
									if(generar) {

										let vrd_imagen = "";
										let prd_id = "";
										let vrd_precio = "";
										let vrd_promocion = "";
										let vrd_estado = "";
										let vrd_visible = "";
										let vrd_id = "";

										variacionesLength = tmp.length;
										combinaciones.forEach((combinacion, i) => {

											let existe = false;
											if(datos != 0) {

												datos.forEach((dato, i2) => {

													if(combinacion == dato['vrd_ids']) {

														existe = true;
														prd_id = dato['prd_id'];
														vrd_precio = dato['prd_precio'];
														vrd_promocion = dato['prd_promocion'];
														vrd_estado = dato['prs_id'];
														vrd_visible = dato['prd_visible'];
														vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
													}

												});
											}


											if(!existe) {

												vrd_imagen = "";
												prd_id = 0;
												vrd_precio = producto[0]['prd_precio']
												vrd_promocion = producto[0]['prd_promocion']
												vrd_estado = producto[0]['prs_id']
												vrd_visible = 0;
												vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
											}

											// TODO: ESTABLECEMOS EL NOMBRE DE LA VARIACION
											const tmpC = combinaciones[i].split(",");
											let nombre = "";
											let var_id = "";

											tmpC.forEach((tm, i3) => {

												variaciones.forEach((variacion, i4) => {

													if(parseInt(tm) == parseInt(variacion['vrd_id']))
														nombre = nombre + ` ${variacion['vrd_nombre']}`;

												});
											});


											let status_var = "";
											let visible = "";
											for (var j = 0; j < visibles.length; j++) {
												visible = visibles[j]['boo_id'] == vrd_visible ? "checked" : "";
											}								

											vrd_imagen = vrd_imagen != "" ? `../uploads/productos/${vrd_imagen}` : "";
											collapse = collapse + `
												<li class="collection-item">
													<div class="collection-header">${nombre} 
														<div class="collection-action">
															<input type="hidden" name="prd_idv[]" value="${prd_id}">
															<input type="hidden" name="vrd_ids[]" value="${combinacion}">
															<div class="switch">
																<label>
																Mostrado
																<input type="checkbox" ${visible}>
																<span class="lever"></span>
																</label>
				  											</div>
				  										</div> 
			  										</div>
												</li>`;
										});

										collapse = collapse + "<ul>";
										variaciones_productos.innerHTML = collapse;
										variaciones_productos.style.display = "block";
										$('.collapsible').collapsible();

										combinaciones.forEach(function(combinacion, index) {

											$(`#var_estados_${vrd_id}`).selectize();
											// $(`#var_visible_${vrd_id}`).selectize();

										});
										M.updateTextFields();
									}

								}
							});

						} else {

							generar = true;
							if(generar) {

								let vrd_imagen = "";
								let prd_id = "";
								let vrd_precio = "";
								let vrd_promocion = "";
								let vrd_estado = "";
								let vrd_visible = "";
								let vrd_id = "";

								variacionesLength = tmp.length;
								combinaciones.forEach((combinacion, i) => {

									let existe = false;
									if(datos != 0) {

										datos.forEach((dato, i2) => {

											if(combinacion == dato['vrd_ids']) {

												existe = true;
												prd_id = dato['prd_id'];
												vrd_visible = dato['prd_visible'];
												vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
											}

										});
									}


									if(!existe) {

										vrd_imagen = "";
										prd_id = 0;
										vrd_visible = 0;
										vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
									}

									// TODO: ESTABLECEMOS EL NOMBRE DE LA VARIACION
									const tmpC = combinaciones[i].split(",");
									let nombre = "";
									let var_id = "";

									tmpC.forEach((tm, i3) => {

										variaciones.forEach((variacion, i4) => {

											if(parseInt(tm) == parseInt(variacion['vrd_id']))
												nombre = nombre + ` ${variacion['vrd_nombre']}`;

										});
									});


									let status_var = "";
									let visible = "";
									for (var j = 0; j < visibles.length; j++) {
										visible = visibles[j]['boo_id'] == vrd_visible ? "checked" : "";
									}								

									vrd_imagen = vrd_imagen != "" ? `../uploads/productos/${vrd_imagen}` : "";
									collapse = collapse + `
										<li class="collection-item">
											<div class="collection-header">${nombre} 
												<div class="collection-action">
													<input type="hidden" name="prd_idv[]" value="${prd_id}">
													<input type="hidden" name="vrd_ids[]" value="${combinacion}">
													<div class="switch">
														<label>
														Mostrado
														<input type="checkbox" ${visible}>
														<span class="lever"></span>
														</label>
		  											</div>
		  										</div> 
	  										</div>
										</li>`;
								});

								collapse = collapse + "<ul>";
								variaciones_productos.innerHTML = collapse;
								variaciones_productos.style.display = "block";
								$('.collapsible').collapsible();

								combinaciones.forEach(function(combinacion, index) {

									$(`#var_estados_${vrd_id}`).selectize();
									// $(`#var_visible_${vrd_id}`).selectize();

								});
								M.updateTextFields();
							}
				
						}

					} else {

						generar = true;
						if(generar) {

							let vrd_imagen = "";
							let prd_id = "";
							let vrd_precio = "";
							let vrd_promocion = "";
							let vrd_estado = "";
							let vrd_visible = "";
							let vrd_id = "";

							variacionesLength = tmp.length;
							combinaciones.forEach((combinacion, i) => {

								let existe = false;
								if(datos != 0) {

									datos.forEach((dato, i2) => {

										if(combinacion == dato['vrd_ids']) {

											existe = true;
											prd_id = dato['prd_id'];
											vrd_visible = dato['prd_visible'];
											vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
										}

									});
								}


								if(!existe) {

									prd_id = 0;
									vrd_visible = 0;
									vrd_id = combinacion.split(",")[0]+combinacion.split(",")[1];
								}

								// TODO: ESTABLECEMOS EL NOMBRE DE LA VARIACION
								const tmpC = combinaciones[i].split(",");
								let nombre = "";
								let var_id = "";

								tmpC.forEach((tm, i3) => {

									variaciones.forEach((variacion, i4) => {

										if(parseInt(tm) == parseInt(variacion['vrd_id']))
											nombre = nombre + ` ${variacion['vrd_nombre']}`;

									});
								});


								let status_var = "";
								let visible = "";
								for (var j = 0; j < visibles.length; j++) {
									visible = visibles[j]['boo_id'] == vrd_visible ? "checked" : "";
								}								

								vrd_imagen = vrd_imagen != "" ? `../uploads/productos/${vrd_imagen}` : "";
								collapse = collapse + `
									<li class="collection-item">
										<div class="collection-header">${nombre} 
											<div class="collection-action">
												<input type="hidden" name="prd_idv[]" value="${prd_id}">
												<input type="hidden" name="vrd_ids[]" value="${combinacion}">
												<div class="switch">
													<label>
													Mostrado
													<input type="checkbox" id="var_visible_${vrd_id}" ${visible}>
													<span class="lever"></span>
													</label>
	  											</div>
	  										</div> 
  										</div>
									</li>`;
							});

							collapse = collapse + "<ul>";
							variaciones_productos.innerHTML = collapse;
							variaciones_productos.style.display = "block";
							$('.collapsible').collapsible();

							combinaciones.forEach(function(combinacion, index) {

								$(`#var_estados_${vrd_id}`).selectize();
								// $(`#var_visible_${vrd_id}`).selectize();

							});
							M.updateTextFields();
						}

					}

					document.getElementById('vrd_id').value = combinaciones;
				}

			} else {
				M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}

			boton.removeAttribute("disabled");
		}
	}
}

// TODO: ESTABLECER ESTADO ACTIVO | INACTIVO
const establecer_estado = (estado) => {
	if(estado)
		return `<span class="verde_ hide-on-med-and-down" title="Activo">■</span><span class="verde_ hide-on-large-only">•</span>`;
	else
		return `<span class="rojo_ hide-on-med-and-down" title="Inactivo">■</span><span class="rojo_ hide-on-large-only">•</span>`;
}

// TODO: AJUSTAR PRECIO EN MODULOS
const ajustar_valor = (cmp) => {

	if(cmp.value != "") {

		var valor = cmp.value;
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace(".", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		valor = valor.replace("$", "");
		var entero = parseInt(valor);

		cmp.value = isNaN(entero) ? 0 : '$'+new Intl.NumberFormat("de-DE").format(entero);
	}
}

function desajustar_valor(valor){
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace(".", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	valor = valor.replace("$", "");
	return valor;
}

// TODO: AJUSTAR PORCENTAJE EN MODULOS
const ajustar_porcentaje = (cmp) => {

	if(cmp.value != "") {

		var dato = cmp.value;
		dato = dato.replace("%", "");
		dato = dato.replace("%", "");
		dato = dato.replace("%", "");
		dato = dato.replace("%", "");
		var entero = parseInt(dato);

		cmp.value = isNaN(entero) ? 0 : entero+"%";
	}
}

function desajustar_procentaje(valor){
	valor = valor.replace("%", "");
	valor = valor.replace("%", "");
	valor = valor.replace("%", "");
	valor = valor.replace("%", "");
	return valor;
}

// TODO: CREAR HIPERVINCULO EMAIL
const boton_email = (email) => {
	const boton = email != "" ? `<a href="mailto:${email}">${email}</a>` : "";
	return boton;
}

// TODO: CREAR HIPERVINCULO TELEFONO
const boton_telefono = (telefono) => {
	const boton = telefono != "" ? `<a href="tel:${telefono}">${telefono}</a>` : "";
	return boton;
}

function vacio(valor) 
{
	if(valor == "" || valor == '0000-00-00 00:00:00')
		return 'Sin registro';
	else
		return valor;
}

function locacion(valor, ruta="")
{
	if(valor == 'Sin registro')
		return 'Sin registro';
	else
		return `<a href="../uploads/cotizaciones/${ruta}/${valor}" target="blank">${valor}</a>`;
}

function mostrar_mes(mes)
{
	if(mes == 1)
		return "Ene";
	else
	if(mes == 2)
		return "Feb";
	else
	if(mes == 3)
		return "Mar";
	else
	if(mes == 4)
		return "Abr";
	else
	if(mes == 5)
		return "May";
	else
	if(mes == 6)
		return "Jun";
	else
	if(mes == 7)
		return "Jul";
	else
	if(mes == 8)
		return "Ago";
	else
	if(mes == 9)
		return "Sep";
	else
	if(mes == 10)
		return "Oct";
	else
	if(mes == 11)
		return "Nov";
	else
	if(mes == 12)
		return "Dic";
}

function obtenerFecha(id, type){
	if(type == "start")
	{

			if(id == 'Últimos 30 días')
					return moment().subtract(29, 'days');
			else
			if(id == 'Esta semana')
					return moment().startOf('week');
			else
			if(id == 'Última semana')
					return moment().subtract(1,'week').startOf('week');
			else
			if(id == 'Este mes')
					return moment().startOf('month');
			else
			if(id == 'Último mes')
					return moment().subtract(1, 'month').startOf('month');
			else
			if(id == 'Este año')
					return moment().startOf('year');
			else
			if(id == 'El año pasado')
					return moment().subtract(1, 'year').startOf('year');
			else
					return moment(localStorage.firstDate);
	}
	else
	{

			if(id == 'Últimos 30 días')
					return moment();
			else
			if(id == 'Esta semana')
					return moment().endOf('week');
			else
			if(id == 'Última semana')
					return moment().subtract(1,'week').endOf('week');
			else
			if(id == 'Este mes')
					return moment().endOf('month');
			else
			if(id == 'Último mes')
					return moment().subtract(1, 'month').endOf('month');
			else
			if(id == 'Este año')
					return moment().endOf('year');
			else
			if(id == 'El año pasado')
					return moment().subtract(1, 'year').endOf('year');
			else
					return moment();
	}
}

// TODO: VALIDAR SI ES URL
const url_valida = (url) => {
	try {
		new URL(url);
	} catch (e) {
		return false;
	}
	return true;
};

// TODO: SOBRE ESCRIBIT TITULO COLLAPSIBLE
const titulo_collapsible = (cmp) => {

	const texto = cmp.value;
	const id = cmp.id.split("_").pop();
	document.getElementById(`titulo-${id}`).innerHTML = texto;
}

function generarContraseña(tamaño){
	var slug ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var codigo= ' ';
		var max = slug.length;
		for (var i = 0; i < tamaño; i++ ) {
				codigo += slug.charAt(Math.floor(Math.random() * max));
		}

	document.getElementById('modal-auxiliar1').innerHTML = `
		<div class="modal-content">
			<h4>Modal Header</h4>
			<p>Contraseña: ${codigo}</p>
		</div>
		<div class="modal-footer">
			<a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
		</div>
	</div>
	`;
	$('#modal-auxiliar1').modal('open');
}

// TODO: Funciom para convertir string para url
const generar_slug = (cadena)  => {
	// Reemplaza los carácteres especiales | simbolos con un espacio 
	slug = cadena.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase();
 
	// Corta los espacios al inicio y al final del sluging 
	slug = slug.replace(/^\s+|\s+$/gm, '');
 
	// Reemplaza el espacio con guión  
	slug = slug.replace(/\s+/g, '-');

	return slug;
}

// TODO: Funcion detalle proyectos
const cargar_detalles_proyecto = (id, datos, seccion) => {

	let contenedorDetalle = "";
	switch (seccion) {
		case "detalles":

			const titulo = datos[0] == "" || datos[0] == undefined ? "" : datos[0];
			const valor  = datos[1] == "" || datos[1] == undefined ? "" : datos[1];

			contenedorDetalle = contenedorDetalle + `
			<tr id="detalle-${id}">
				<td>
					<input type="text" name="detalle-titulo[]" id="titulo-${id}" placeholder="" onchange="verificar_detalles(this, '${seccion}')" onkeyup="validar(this)" autocomplete="off" value="${titulo}">
					<div id="error.titulo-${id}" class="form-error"></div>
				</td>
				<td>
					<input type="text" name="detalle-descripcion[]" id="descripcion-${id}" placeholder="" onchange="verificar_detalles(this, '${seccion}')" onkeyup="validar(this)" autocomplete="off" value="${valor}">
					<div id="error.descripcion-${id}" class="form-error"></div>
				</td>
				<td>
					<a onclick="eliminar_detalle(this, '${seccion}')" idC="detalle-${id}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar"><i class="material-icons">remove</i></a>
				</td>
			</tr>`;

			validaciones_dproyecto.push(
				[`titulo-${id}`, 	  '', 'lengthPass=1,100'],
				[`descripcion-${id}`, '', 'lengthPass=1,255']
			);

			break;
		case "rubros":

			const rid 			= datos['prb_id'] 			!= undefined ? datos['prb_id'] : 0;
			const rubros 		= datos['prb_nombre'] 		!= undefined ? datos['prb_nombre'] : "";
			const rdescripcion 	= datos['prb_descripción'] 	!= undefined ? datos['prb_descripción'] : "";
			const rvalor 		= datos['prb_valor'] 		!= undefined ? datos['prb_valor'] : 0;

			contenedorDetalle = contenedorDetalle + `
			<tr id="rubro-${id}">
				<td>
					<input type="hidden" name="prb_ids[]" id="prb_id-${id}" value="${rid}">
					<input type="text" name="rubros[]" id="rubros-${id}" placeholder="" onchange="verificar_detalles(this, '${seccion}')" autocomplete="off" value="${rubros}">
					<div id="error.rubros-${id}" class="form-error"></div>
				</td>
				<td>
					<input type="text" name="rubro-descripcion[]" id="rdescripcion-${id}" placeholder="" onchange="verificar_detalles(this, '${seccion}')" autocomplete="off" value="${rdescripcion}">
					<div id="error.rdescripcion-${id}" class="form-error"></div>
				</td>
				<td>
					<input type="text" name="rubro-valor[]" id="rvalor-${id}" placeholder="" onchange="verificar_detalles(this, '${seccion}')" onkeyup="ajustar_valor(this)" autocomplete="off" value="${ajustarPrecio(rvalor)}">
					<div id="error.rvalor-${id}" class="form-error"></div>
				</td>
				<td>
					<a onclick="eliminar_detalle(this, '${seccion}')" idC="rubro-${id}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue" title="Eliminar"><i class="material-icons">remove</i></a>
				</td>
			</tr>`;

			validaciones_dproyecto.push(
				[`rubros-${id}`, 		'', 'lengthPass=1,100'],
				[`rdescripcion-${id}`, 	'', 'lengthPass=1,255'],
				[`rvalor-${id}`, 		'', 'precio'],
			);

			break;
		default:
			contenedorDetalle = "";
			break;
	}

		
	$(`#${seccion}`).append(contenedorDetalle);
}

// TODO: Eliminar detalle de proyecto
const eliminar_detalle = (cmp, seccion) => {
	
	const padre = document.getElementById(seccion);
	const id = cmp.getAttribute("idC");
	const hijo = document.getElementById(id);

	const tmpE = padre.querySelectorAll("tr");
	const elements = padre.querySelectorAll("tr")[tmpE.length - 1];

	if(elements.id == id) {
		M.toast({html: 'No se puede remover, se debe mantener al menos (1) elementos vacios.', classes: 'toastwarning'});
	} else {
		
		const hijo_elements = hijo.querySelectorAll("input");
		for (var i = 0; i < validaciones_dproyecto.length; i++) {

			for (var j = 0; j < hijo_elements.length; j++) {

				const hijo_id = hijo_elements[j].id;

				if(validaciones_dproyecto[i][0] == hijo_id) {
					validaciones_dproyecto.splice(i, 1);
				}
			}
		}
		padre.removeChild(hijo)
	}
}

// TODO: Verificar los detalles existentes
const verificar_detalles = (cmp, seccion) => {

	let valor = cmp.value;
	let id = cmp.id.split("-")[0];
	let indice = cmp.id.split("-")[1];
	// // TODO: Verificamos que el item no esté vacío
	if(valor != "")
	{
		// TODO: Generamos un ID válido
		do{
			indice++;
		}
		while(document.getElementById(`${id}-${indice}`) != null);
		if(document.getElementById(`${id}-${indice - 1}`).value != "") {
			cargar_detalles_proyecto(indice, [], seccion);
		}
	}
}

// TODO: Cargar estdisticas index
const cargar_estadisticas = () => {

	var xhr = new XMLHttpRequest();
	var params 	= "action=estadisticas";
	xhr.open("POST", "inc/index.php",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
			{
				res = xhr.responseText.trim();
				// console.log(res);
				if(res < 0)
					M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+res, classes: 'toasterror'});
				else
				{
					const tmp = res.split("::");
					const whatsapp = JSON.parse(tmp[0]);
					const llamadas = JSON.parse(tmp[1]);
					const contactos = JSON.parse(tmp[2]);


					let lineChart = "";
					let mayor = 0;
					const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

					const WhatsApp = [];
					const Llamadas = [];
					const Contacto = [];
					labels.forEach((mes, i) => {

						const id = i + 1;

						whatsapp.forEach((whats, w) => {

							if(whats['whatsapp'] > mayor)
								mayor = whats['whatsapp'];

							if(id == whats['mes']) {
								WhatsApp.push(whats['whatsapp']);
							} else {
								WhatsApp.push(0);
							}

						});

						llamadas.forEach((llamada, l) => {

							if(llamada['llamada'] > mayor)
								mayor = llamada['llamada'];

							if(id == llamada['mes']) {
								Llamadas.push(llamada['llamada']);
							} else {
								Llamadas.push(0);
							}

						});

						contactos.forEach((contacto, c) => {

							if(contacto['contacto'] > mayor)
								mayor = contacto['contacto'];

							if(id == contacto['mes']) {
								Contacto.push(contacto['contacto']);
							} else {
								Contacto.push(0);
							}

						});

					});


					const data = {
						labels: labels,
						datasets: [
							{
								label: 'Llamadas',
								data: Llamadas,
								borderColor: '#003359',
								backgroundColor: '#003359'
							},
							{
								label: 'WhatsApp',
								data: WhatsApp,
								borderColor: '#0cc243',
								backgroundColor: '#0cc243'
							},
							{
								label: 'Formulario de Contacto',
								data: Contacto,
								borderColor: '#ff6223',
								backgroundColor: '#ff6223'
							}
						]
					};

					const config = {
						type: 'line',
						data: data,
						options: {
							respnsive: true,
							maintainAspectRatio: false,
							plugins: {
								legend: {
									position: 'top',
								},
								title: {
									display: true,
									text: "Estadisticas"
								}
							},
							scales: 
							{
								y: {
									beginAtZero: true,
									// the data maximum used for determining the ticks is Math.max(dataMax, suggestedMax)
									suggestedMax: mayor + Math.ceil(mayor * 20 / 100),
									suggestedMin: 0,
								}
							}
						}
					}
					const ctx = document.getElementById('line-chart').getContext('2d');
					lineChart = new Chart(ctx, config);
				}
			} else {
				M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}
	}
}

// TODO: funcion para generar password encrypt
function generarContraseña(tamaño){
	var slug ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var codigo= ' ';
		var max = slug.length;
		for (var i = 0; i < tamaño; i++ ) {
				codigo += slug.charAt(Math.floor(Math.random() * max));
		}

	document.getElementById('modal-auxiliar1').innerHTML = `
		<div class="modal-content">
			<h4>Modal Header</h4>
			<p>Contraseña: ${codigo}</p>
		</div>
		<div class="modal-footer">
			<a href="#!" class="modal-close waves-effect waves-green btn-flat">Agree</a>
		</div>
	</div>
	`;
	$('#modal-auxiliar1').modal('open');
}

// TODO: Crear movimiento
const crear_movimiento = (indice = 1) => {

	const cmp = document.getElementById('mregistro');

	let optionTipos = "";
	for (var i = 0; i < tipos_global.length; i++)
		optionTipos = optionTipos + `<option value="${tipos_global[i]['mtp_id']}">${tipos_global[i]['mtp_nombre']}</option>`;

	let optionCentros = "";
	for (var i = 0; i < centros_global.length; i++)
		optionCentros = optionCentros + `<option value="${centros_global[i]['cco_id']}">${centros_global[i]['cco_codigo']} - ${centros_global[i]['cco_nombre']}</option>`;

	let optionEmpresa = "";
	for (var i = 0; i < empresas_global.length; i++)
		optionEmpresa = optionEmpresa + `<option value="${empresas_global[i]['emp_id']}">${empresas_global[i]['emp_nombre']}</option>`;

	let optionBancos = `<optgroup label="Bancos">`;
	for (var i = 0; i < bancos_global.length; i++) {
		const numeroTexto = bancos_global[i]['ban_numero'].toString();
		const numero = numeroTexto.slice(numeroTexto.length - 2);
		optionBancos = optionBancos + `<option value="${bancos_global[i]['ban_id']}:1">${numero} - ${bancos_global[i]['ban_nombre']}</option>`;
	}

	optionBancos = optionBancos + `</optgroup>`;

	let optionCajas = `<optgroup label="Cajas">`;
	for (var i = 0; i < cajas_global.length; i++)
		optionCajas = optionCajas + `<option value="${cajas_global[i]['caj_id']}:2">${cajas_global[i]['caj_nombre']}</option>`;

	optionCajas = optionCajas + `</optgroup>`;

	let contenido = `
	<li id="movimiento-${indice}">
		<div class="collapsible-header collapsible-head">
			<div class="collapsible-titulo truncate" id="titulo-${indice}">${indice}.</div>
			<div class="collapsible-acciones">
				<a onclick="eliminar_item(this, 'mregistro', 'movimiento')" idC="movimiento-${indice}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue"><i class="material-icons">remove</i></a>
			</div>
		</div>
		<div class="collapsible-body">
			<div class="row">
				<div class="col s12 m4 input-field">
					<input type="date" name="mov_fecha[]" id="mov_fecha-${indice}" placeholder="" autocomplete="off" onchange="validar(this)" onkeyup="validar(this)">
					<label>Fecha<i class="requerido">*</i></label>
					<div class="form-error" id="error.mov_fecha-${indice}"></div>
				</div>
				<div class="col s12 m4">
					<label>Tipo</label><i class="requerido">*</i>
					<select name="mtp_id[]" id="mtp_id-${indice}" onchange="verificar_item(this,'movimientos'); validar(this)">
						<option value="" selected disabled>Seleccione una opci&oacute;n</option>
						${optionTipos}
					</select>
					<div class="form-error" id="error.mtp_id-${indice}"></div>
				</div>
				<div class="col s12 m4 input-field">
					<input type="text" name="mov_valor[]" id="mov_valor-${indice}" placeholder="" autocomplete="off" onkeyup="ajustar_valor(this); validar(this)" onchange="verificar_item(this,'movimientos');" value="">
					<label>Valor<i class="requerido">*</i></label>
					<div class="form-error" id="error.mov_valor-${indice}"></div>
				</div>
				<div class="col s12 m4 select">
					<label>Centro de Costo</label><i class="requerido">*</i>
					<select name="cco_id[]" id="cco_id-${indice}" onchange="verificar_item(this,'movimientos'); validar(this)">
						<option value="" selected disabled>Seleccione una opci&oacute;n</option>
						${optionCentros}
					</select>
					<div class="form-error" id="error.cco_id-${indice}"></div>
				</div>
				<div class="col s12 m4 select">
					<label>Banco / Caja</label><i class="requerido">*</i>
					<select name="suc_id[]" id="suc_id-${indice}" onchange="verificar_item(this,'movimientos'); validar(this)">
						<option value="" selected disabled>Seleccione una opci&oacute;n</option>
						${optionBancos}
						${optionCajas}
					</select>
					<div class="form-error" id="error.suc_id-${indice}"></div>
				</div>
				<div class="col s12 m4 select">
					<label>Empresa</label><i class="requerido">*</i>
					<select name="emp_id[]" id="emp_id-${indice}" onchange="verificar_item(this,'movimientos'); validar(this)">
						<option value="" selected disabled>Seleccione una opci&oacute;n</option>
						${optionEmpresa}
					</select>
					<div class="form-error" id="error.emp_id-${indice}"></div>
				</div>
				<div class="col s12 m12">
					<label>Detalle<i class="requerido">*</i></label>
					<textarea name="mov_detalle[]" id="mov_detalle-${indice}" class="materialize-textarea" autocomplete="off" onchange="verificar_item(this,'movimientos'); validar(this)" onkeyup="titulo_item(this)"></textarea>
					<div class="form-error" id="error.mov_detalle-${indice}"></div>
				</div>
				<div class="col s12 m12">
					<label>Observaciones</label>
					<textarea name="mov_observaciones[]" id="mov_observaciones-${indice}" class="materialize-textarea" autocomplete="off" onchange="verificar_item(this,'movimientos'); validar(this)"></textarea>
					<div class="form-error" id="error.mov_observaciones-${indice}"></div>
				</div>
			</div>
		</div>
	</li>`;

	$(cmp).append(contenido);

	document.getElementById(`mov_fecha-${indice}`).valueAsDate = new Date();
	$(`#mtp_id-${indice}`).selectize();
	$(`#cco_id-${indice}`).selectize();
	$(`#suc_id-${indice}`).selectize();
	$(`#emp_id-${indice}`).selectize();
	M.updateTextFields();
	validar_movimiento("movimiento");
}

// TODO: Validar item dinamico
const validar_movimiento = (seccion) => {

	const padre = document.getElementById("mregistro");
	const hijos = padre.querySelectorAll("li");
	const ultimo = Object.keys(hijos)[Object.keys(hijos).length - 1];

	let validaciones = [];
	for (var i = 0; i < hijos.length; i++) {

		const indice = hijos[i].id.split("-")[1];

		if(hijos.length == 1) {
			
			validaciones.push(
				[`mov_fecha-${indice}`, 		'', 'required'],
				[`mtp_id-${indice}`, 			'', 'required'],
				[`mov_valor-${indice}`, 		'', 'required'],
				[`cco_id-${indice}`, 			'', 'required'],
				[`suc_id-${indice}`, 			'', 'required'],
				[`emp_id-${indice}`, 			'', 'required'],
				[`mov_detalle-${indice}`,		'', 'required'],
			);

		} else {
			if(hijos[i].id != hijos[ultimo].id) {

				validaciones.push(
					[`mov_fecha-${indice}`, 		'', 'required'],
					[`mtp_id-${indice}`, 			'', 'required'],
					[`mov_valor-${indice}`, 		'', 'required'],
					[`cco_id-${indice}`, 			'', 'required'],
					[`suc_id-${indice}`, 			'', 'required'],
					[`emp_id-${indice}`, 			'', 'required'],
					[`mov_detalle-${indice}`,		'', 'required'],
				);

			}
		}	
	}

	validaciones_global = validaciones;
}

// TODO: Crear centro de costos
const crear_ccosto = (indice = 1) => {

	const modulo = "ccostos";
	const seccion_singular = "ccosto";
	const seccion_legible = "Centro de costo";

	const cmp = document.getElementById("ccostos-registros");

	let contenido = `
	<li id="ccosto-${indice}">
		<div class="collapsible-header collapsible-head">
			<div class="collapsible-titulo truncate" id="titulo-${indice}">${indice}.</div>
			<div class="collapsible-acciones">
				<a onclick="eliminar_item(this, 'ccostos-registros', 'ccostos')" idC="ccosto-${indice}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue"><i class="material-icons">remove</i></a>
			</div>
		</div>
		<div class="collapsible-body">
			<div class="row">
				<div class="col s12 m3 input-field">
					<input type="text" name="cco_codigo[]" id="cco_codigo-${indice}" placeholder="" onkeyup="validar(this); verificar_item(this, 'ccostos')">
					<label>Código<i class="requerido">*</i></label>
					<div class="form-error" id="error.cco_codigo-${indice}"></div>
				</div>
				<div class="col s12 m9 input-field">
					<input type="text" name="cco_nombre[]" id="cco_nombre-${indice}" placeholder="" onkeyup="validar(this); verificar_item(this, 'ccostos'); titulo_item(this)">
					<label>Nombre<i class="requerido">*</i></label>
					<div class="form-error" id="error.cco_nombre-${indice}"></div>
				</div>
				<div class="col s12 m12">
					<label>Observación</label>
					<textarea name="cco_detalle[]" id="cco_detalle-${indice}" class="materialize-textarea" onkeyup="validar(this)"></textarea>
					<div class="form-error" id="error.cco_detalle-${indice}"></div>
				</div>
			</div>
		</div>
	</li>`;

	$(cmp).append(contenido);
	M.updateTextFields();
	validar_ccosto("ccostos");
}

// TODO: Validar item dinamico
const validar_ccosto = (seccion) => {

	const padre = document.getElementById("ccostos-registros");
	const hijos = padre.querySelectorAll("li");
	const ultimo = Object.keys(hijos)[Object.keys(hijos).length - 1];

	let validaciones = [];
	for (var i = 0; i < hijos.length; i++) {

		const indice = hijos[i].id.split("-")[1];

		if(hijos.length == 1) {
			
			validaciones.push(
				[`cco_codigo-${indice}`, 	'', 'required'],
				[`cco_nombre-${indice}`, 	'', 'required'],
			);

		} else {
			if(hijos[i].id != hijos[ultimo].id) {

				validaciones.push(
					[`cco_codigo-${indice}`, 	'', 'required'],
					[`cco_nombre-${indice}`, 	'', 'required'],
				);

			}
		}	
	}

	validaciones_global = validaciones;
}

// TODO: Crear item dinamico
const crear_banco = (indice = 1) => {

	const cmp = document.getElementById("banco-registros");
	let optionBancos = "";
	for (var i = 0; i < tipos_global.length; i++)
		optionBancos = optionBancos + `<option value="${tipos_global[i]['btp_id']}">${tipos_global[i]['btp_nombre']}</option>`;

	let contenido = `
	<li id="banco-${indice}">
		<div class="collapsible-header collapsible-head">
			<div class="collapsible-titulo truncate" id="titulo-${indice}">${indice}.</div>
			<div class="collapsible-acciones">
				<a onclick="eliminar_item(this, 'banco-registros', 'bancos')" idC="banco-${indice}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue"><i class="material-icons">remove</i></a>
			</div>
		</div>
		<div class="collapsible-body">
			<div class="row">
				<div class="col s12 m3 input-field">
					<input type="text" name="ban_numero[]" id="ban_numero-${indice}" placeholder="" onkeyup="validar(this)" onchange="verificar_item(this,'bancos');">
					<label>Numero</label>
					<div class="form-error" id="error.ban_numero-${indice}"></div>
				</div>
				<div class="col s12 m3 input-field">
					<input type="text" name="ban_nombre[]" id="ban_nombre-${indice}" placeholder="" onkeyup="validar(this); titulo_item(this)" onchange="verificar_item(this,'bancos');">
					<label>Nombre</label>
					<div class="form-error" id="error.ban_nombre-${indice}"></div>
				</div>
				<div class="col s12 m3 select">
					<label>Banco</label>
					<select name="btp_id[]" id="btp_id-${indice}" onchange="validar(this); verificar_item(this,'bancos');">
						<option value="" selected disabled>Seleccione una opci&oacute;n</option>
						${optionBancos}
					</select>
					<div class="form-error" id="error.btp_id-${indice}"></div>
				</div>
				<div class="col s12 m3 input-field">
					<input type="text" name="ban_monto[]" id="ban_monto-${indice}" placeholder="" onkeyup="ajustar_valor(this); verificar_item(this,'bancos')" value="$0">
					<label>Monto</label>
					<div class="form-error" id="error.ban_monto-${indice}"></div>
				</div> 
			</div>
		</div>
	</li>`;

	$(cmp).append(contenido);
	$(`#btp_id-${indice}`).selectize();
	M.updateTextFields();
	validar_banco("banco");
}

// TODO: Validar item dinamico
const validar_banco = (seccion) => {

	const padre = document.getElementById("banco-registros");
	const hijos = padre.querySelectorAll("li");
	const ultimo = Object.keys(hijos)[Object.keys(hijos).length - 1];

	let validaciones = [];
	for (var i = 0; i < hijos.length; i++) {

		const indice = hijos[i].id.split("-")[1];

		if(hijos.length == 1) {
			
			validaciones.push(
				[`ban_numero-${indice}`, 	'', 'required'],
				[`ban_nombre-${indice}`, 	'', 'required'],
				[`btp_id-${indice}`, 		'', 'required'],
				[`ban_monto-${indice}`, 	'', 'required'],
			);

		} else {
			if(hijos[i].id != hijos[ultimo].id) {

				validaciones.push(
					[`ban_numero-${indice}`, 	'', 'required'],
					[`ban_nombre-${indice}`, 	'', 'required'],
					[`btp_id-${indice}`, 		'', 'required'],
					[`ban_monto-${indice}`, 	'', 'required'],
				);

			}
		}	
	}

	validaciones_global = validaciones;
}

// TODO: Crear item dinamico
const crear_caja = (indice = 1) => {

	const cmp = document.getElementById("caja-registros");
	let optionBancos = "";
	for (var i = 0; i < tipos_global.length; i++)
		optionBancos = optionBancos + `<option value="${tipos_global[i]['btp_id']}">${tipos_global[i]['btp_nombre']}</option>`;

	let contenido = `
	<li id="caja-${indice}">
		<div class="collapsible-header collapsible-head">
			<div class="collapsible-titulo truncate" id="titulo-${indice}">${indice}.</div>
			<div class="collapsible-acciones">
				<a onclick="eliminar_item(this, 'caja-registros', 'caja')" idC="caja-${indice}" class="btn-floating btn-small btn-xs waves-effect waves-light outline-blue"><i class="material-icons">remove</i></a>
			</div>
		</div>
		<div class="collapsible-body">
			<div class="row">
				<div class="col s12 m4 input-field">
					<input type="text" name="caj_nombre[]" id="caj_nombre-${indice}" placeholder="" onkeyup="validar(this); titulo_item(this)" onchange="verificar_item(this,'cajas');">
					<label>Nombre</label>
					<div class="form-error" id="error.caj_nombre-${indice}"></div>
				</div>
				<div class="col s12 m4 input-field">
					<input type="text" name="caj_monto[]" id="caj_monto-${indice}" placeholder="" onkeyup="validar(this); ajustar_valor(this)" onchange="verificar_item(this,'cajas');" value="$0">
					<label>Monto</label>
					<div class="form-error" id="error.caj_monto-${indice}"></div>
				</div>
			</div>
		</div>
	</li>`;

	$(cmp).append(contenido);
	$(`#btp_id-${indice}`).selectize();
	M.updateTextFields();
	validar_caja("banco");
}

// TODO: Validar item dinamico
const validar_caja = (seccion) => {

	const padre = document.getElementById("caja-registros");
	const hijos = padre.querySelectorAll("li");
	const ultimo = Object.keys(hijos)[Object.keys(hijos).length - 1];

	let validaciones = [];
	for (var i = 0; i < hijos.length; i++) {

		const indice = hijos[i].id.split("-")[1];

		if(hijos.length == 1) {
			
			validaciones.push(
				[`caj_nombre-${indice}`, 	'', 'required'],
				[`caj_monto-${indice}`, 	'', 'required'],
			);

		} else {
			if(hijos[i].id != hijos[ultimo].id) {

				validaciones.push(
					[`caj_nombre-${indice}`, 	'', 'required'],
					[`caj_monto-${indice}`, 	'', 'required'],
				);

			}
		}	
	}

	validaciones_global = validaciones;
}

// TODO: eliminar_item
const eliminar_item = (cmp, seccion, modulo) => {

	const id 	= cmp.getAttribute("idC");
	const padre = document.getElementById(seccion);
	const hijo 	= document.getElementById(id);

	const tmpE = padre.querySelectorAll("li");
	const elements = padre.querySelectorAll("li")[tmpE.length - 1];

	if(elements.id == id) {
		M.toast({html: 'No se puede remover, se debe mantener al menos (1) elementos vacios.', classes: 'toastwarning'});
	} else {
		
		padre.removeChild(hijo);
		if(modulo == "movimientos") {
			validar_movimiento(modulo);
		} else 
		if(modulo == "ccostos") {
			validar_ccosto(modulo);
		} else
		if(modulo == "bancos") {
			validar_banco(modulo);
		}
	}
}

// TODO: Verificar los item existentes
const verificar_item = (cmp, modulo) => {

	let valor = cmp.value;
	let id = cmp.id.split("-")[0];
	let indice = cmp.id.split("-")[1];
	// // TODO: Verificamos que el item no esté vacío
	if(valor != "")
	{
		// TODO: Generamos un ID válido
		do{
			indice++;
		}
		while(document.getElementById(`${id}-${indice}`) != null);
		if(document.getElementById(`${id}-${indice - 1}`).value != "") {

			if(modulo == "movimientos") {
				crear_movimiento(indice);
			} else 
			if(modulo == "ccostos") {
				crear_ccosto(indice);
			} else 
			if(modulo == "bancos") {
				crear_banco(indice);
			} else 
			if(modulo == "cajas") {
				crear_caja(indice);
			}
		}
	}
}

// TODO: Funcion para sobre escribir el titulo del item
const titulo_item = (cmp) => {
	const titulo = cmp.value;
	const id = cmp.id.split("-")[1];
	document.getElementById(`titulo-${id}`).innerHTML = `${id}. ${titulo}`;
}

// TODO: Obtener parametro de URL
const getUrlParam = (param) => {
	const location = window.location.href;
	const url = new URL(location);
	const dato = url.searchParams.get(param) != null ? url.searchParams.get(param) : 0;
	return dato;
}