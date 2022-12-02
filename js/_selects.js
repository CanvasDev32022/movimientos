const cargar_select = (select, valor, cmp, id=0) => {
	
	if(select == "ciudades") {

		const ciudades = colombia[id]['ciudades'];
		var control = cmp[0].selectize;
		control.clearOptions();

		for (var i = 0; i < ciudades.length; i++)
			control.addOption({'value': ciudades[i], 'text': ciudades[i]});

		control.refreshOptions();
	}
}


function reiniciar_select(cmp, mensaje)
{
	var control = cmp[0].selectize;
	control.setValue(0);
	control.clearOptions();
	control.addOption({'value': "", 'text': mensaje});
	//control.refreshOptions();
}