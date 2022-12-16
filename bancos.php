<?php
	$index = 4;
	require('mod/header.php');
	require('mod/aside.php');
?>

<div class="container">
	<div class="card-panel">
		<div id="crear-bancos"></div>
		<div class="mt-40" id="bancos"></div>
	</div>
</div>
<div id="modal-bancos" class="modal modal-meddium modal-fixed-footer"></div>
<div id="modal-auxiliar1" class="modal modal-full modal-fixed-footer"></div>
<div id="modal-auxiliar2" class="modal modal-full modal-fixed-footer"></div>

<?php
	require("mod/footer.php");
?>
<script>
	document.addEventListener("DOMContentLoaded", () => {
		plantillas("banco_crear");
		cargar_registros("bancos", cms_pagina, cms_busqueda);
	});
</script>