<?php
	$index = 5;
	require('mod/header.php');
	require('mod/aside.php');
?>

<div class="container">
	<div class="card-panel">
		<div id="crear-cajas"></div>
		<div class="mt-40" id="cajas"></div>
	</div>
</div>
<div id="modal-cajas" class="modal modal-meddium modal-fixed-footer"></div>
<div id="modal-auxiliar1" class="modal modal-full modal-fixed-footer"></div>
<div id="modal-auxiliar2" class="modal modal-full modal-fixed-footer"></div>

<?php
	require("mod/footer.php");
?>
<script>
	document.addEventListener("DOMContentLoaded", () => {
		plantillas("caja_crear");
		cargar_registros("cajas", cms_pagina, cms_busqueda);
	});
</script>