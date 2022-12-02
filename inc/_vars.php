<?php
	//Variable para realizar búsquedas
	$cms_busqueda 	 	= "";
	$cms_pagina 	 	= 1;
	$cms_url 			= explode('?', $_SERVER['REQUEST_URI']);

	$cms_seccion = [
		/* 00 */array('slug'=>'dashboard', 	 	'padre'=>'', 			'modulo'=>'dashboard',  	'buscar'=> false, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"dashboard", 				'acceso'=>"0,1"),
		/* 01 */array('slug'=>'usuarios',  	 	'padre'=>'', 			'modulo'=>'usuarios',   	'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"usuarios", 					'acceso'=>"0,1"),
	];

?>