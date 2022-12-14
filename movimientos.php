<?php
	$index = 3;
	require('mod/header.php');
	require('mod/aside.php');
?>

<div class="container">
	<div class="card-panel mb-10" id="movimientos"></div>
</div>
<div id="modal-movimientos" class="modal modal-meddium modal-fixed-footer"></div>
<div id="modal-auxiliar1" class="modal modal-full modal-fixed-footer"></div>
<div id="modal-auxiliar2" class="modal modal-full modal-fixed-footer"></div>

<?php
	require("mod/footer.php");
?>
<script>
	document.addEventListener("DOMContentLoaded", () => {
		cargar_registros("movimientos", cms_pagina, cms_busqueda);
	});
</script>