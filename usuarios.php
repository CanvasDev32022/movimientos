<?php
	$index = 1;
	require('mod/header.php');
	require('mod/aside.php');
?>

<div class="container">
	<div class="card-panel" id="usuarios"></div>
</div>
<div id="modal-usuarios" class="modal modal-meddium modal-fixed-footer"></div>
<div id="modal-auxiliar1" class="modal modal-full modal-fixed-footer"></div>
<div id="modal-auxiliar2" class="modal modal-full modal-fixed-footer"></div>

<?php
	require("mod/footer.php");
?>
<script>
	document.addEventListener("DOMContentLoaded", () => {
		cargar_registros("usuarios", cms_pagina, cms_busqueda);
	});
</script>
