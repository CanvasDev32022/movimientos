// TODO: FUNCION CARGAR ARCHIVOS
const cargar_archivos = () => {

	const modulo = "archivos";
	const seccion_singular = "archivo";
	const seccion_legible = "Archvio";

	const modal = document.getElementById('modal-archivos');

	modal.innerHTML = `
		<form method="POST" id="${seccion_singular}_form">
			<div class="modal-header">
				<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
					<div class="container mt-0">
						<div class="row mb-0">
							<div class="col s12 m11 l11">
								<h5 class="breadcrumbs-title mt-0 mb-0"><span>Subir archivo</span></h5>
							</div>
							<span class="modal-action modal-close"><i class="material-icons">close</i></span>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-content">
				<div class="panel">
					<div class="row">
						<div class="col s12 m12">
							<span class="dropify-label">Imagen<i class="requerido">*</i></span>
							<input type="file" id="prd_galeria" name="prd_galeria" class="dropify" data-default-file="" accept="image/*" onchange="validar(this)">
							<div id="error.prd_galeria" class="form-error"></div>
						</div>
						<div class="col s12 m12 input-field">
							<input type="text" name="titulo" id="titulo" placeholder="" autocomplete="off" onkeyup="validar(this)">
							<label for="titulo">Título<i class="requerido">*</i></label>
							<div id="error.titulo" class="form-error"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-footer">
				<div class="row m-0">
					<div class="col s12 m4 offset-m8 nput-field">
						<input type="hidden" name="action" id="action" value="subir_imagen">
						<button type="submit" id="action_${seccion_singular}" class="btn waves-effect waves-light btnppal">SUBIR</button>
					</div>
				</div>
			</div>
		</form>`;

	$('#prd_galeria').dropify({
		messages: {
			'default': "Selecciona o arrastra una imagen",
			'replace': "Selecciona o arrastra una imagen",
			'remove':  "Eliminar",
			'error':   "Ooops, Algo ha salido mal",
		}
	});

	M.updateTextFields();
	validacion_documento();
	$('#modal-archivos').modal({dismissible: false});
	var instance = M.Modal.getInstance(modal);
	instance.open();
	// Hacemos FOCUS y seleccionamos el texto del primer campo
	document.getElementById('titulo').focus();
	document.getElementById('titulo').select();
}

// TODO: FUNCION CARGAR THUMB ARCHIVO
const cargar_archivo_thumb = (archivo, titulo, ruta="") => {

	const extension = archivo.split(".")[1];
	let contenido = "";
	contenido = document.getElementById('archivosC').innerHTML;

	contenido = `
		<a class="archivo" id="${archivo.split(".")[0]}">
			<span class="borrable" onclick="eliminar_archivo(this)" idC="${archivo.split(".")[0]}" archivo="${ruta}${archivo}"><i class="material-icons">close</i></span>
			<div class="archivo-container">
				<img src="../uploads/${ruta}${archivo}" alt="${titulo}" loading="lazy">
			</div>
			<div class="archivo-footer">${titulo}</div>
		</a>
	`+ contenido;

	document.getElementById('archivosC').innerHTML = contenido;
}

// TODO: FUNCION PARA ELIMINAR ARCHIVO
const eliminar_archivo = (cmp) => {
	
	const archivo = cmp.getAttribute("archivo"); 
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
	}).then((result) => {
		if (result.isConfirmed)
		{

			var xhr = new XMLHttpRequest();
			var params 	= "archivo="+archivo+"&action=eliminar";
			xhr.open("POST", "inc/documentos.php",true);
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
							M.toast({html: "El registro ha sido eliminado correctamente.", classes: 'toastdone'});
							const id = cmp.getAttribute("idC");
							const padre = document.getElementById("archivosC");
							const hijo = document.getElementById(id);
							padre.removeChild(hijo);

							let nuevos = [];
							const archivos = document.getElementById('archivos_input').value.split(";;");
							archivos.forEach((arc) => {
								const tmp = arc.split("||");
								const tmp2 = archivo.split("/");

								if(tmp[1] != tmp2[tmp2.length - 1])
									nuevos.push(arc);
							});

							document.getElementById('archivos_input').value = nuevos.join(";;");
						}
					}
					else
						M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
				}
			}

		}
	});
}

// TODO: FUNCION PARA ANULAR ARCHIVOS
const anular_archivo = (cmp) => {

	const archivo = cmp.getAttribute("archivo"); 
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
	}).then((result) => {
		if (result.isConfirmed)
		{

			
			M.toast({html: "El registro ha sido eliminado correctamente.", classes: 'toastdone'});
			const id = cmp.getAttribute("idC");
			const padre = document.getElementById("archivosC");
			const hijo = document.getElementById(id);
			padre.removeChild(hijo);

			let nuevos = [];
			const archivos = document.getElementById('archivos_input').value.split(";;");
			archivos.forEach((arc) => {
				const tmp = arc.split("||");
				const tmp2 = archivo.split("/");
				
				if(tmp[1] != tmp2[tmp2.length - 1])
					nuevos.push(arc);
			});

			document.getElementById('archivos_input').value = nuevos.join(";;");
		}
	});
}