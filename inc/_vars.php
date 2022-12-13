<?php
	//Variable para realizar búsquedas
	$cms_busqueda 	 	= "";
	$cms_pagina 	 	= 1;
	$cms_url 			= explode('?', $_SERVER['REQUEST_URI']);

	$cms_seccion = [
		/* 00 */array('slug'=>'dashboard', 	 	'padre'=>'', 			'modulo'=>'dashboard',  	'buscar'=> false, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"dashboard", 				'acceso'=>"0,1"),
		/* 01 */array('slug'=>'usuarios',  	 	'padre'=>'', 			'modulo'=>'usuarios',   	'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"usuarios", 					'acceso'=>"0,1"),
	    /* 02 */array('slug'=>'centro-costos',  'padre'=>'', 			'modulo'=>'centro-costos',  'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"centros de costo", 			'acceso'=>"0,1"),
	    /* 03 */array('slug'=>'movimientos',  	'padre'=>'', 			'modulo'=>'movimientos',  	'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"movimientos", 				'acceso'=>"0,1"),
	    /* 04 */array('slug'=>'bancos',  		'padre'=>'bancos', 		'modulo'=>'bancos',  		'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"bancos", 					'acceso'=>"0,1"),
	    /* 05 */array('slug'=>'cajas',  		'padre'=>'cajas', 		'modulo'=>'cajas',  		'buscar'=> true, 	'titulo'=>true, 'aside'=>true,	 'nombre'=>"cajas", 					'acceso'=>"0,1"),

	];

?>