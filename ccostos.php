<?php
	$index = 2;
	require('mod/header.php');
	require('mod/aside.php');
?>

<div class="container">
	<div class="card-panel">
		<div id="crear-ccostos"></div>
		<div class="mt-40" id="ccostos"></div>
	</div>
</div>
<div id="modal-ccostos" class="modal modal-meddium modal-fixed-footer"></div>
<div id="modal-auxiliar1" class="modal modal-full modal-fixed-footer"></div>
<div id="modal-auxiliar2" class="modal modal-full modal-fixed-footer"></div>

<?php
	require("mod/footer.php");
?>
<script>
	document.addEventListener("DOMContentLoaded", () => {
		plantillas("ccosto_crear");
		cargar_registros("ccostos", cms_pagina, cms_busqueda);
	});
</script>