document.addEventListener('DOMContentLoaded', function() {
	cms_idioma = document.getElementById("lng").getAttribute("data");
	localStorage.variableanterior = "";

	cargar_componentes();
	// cargar_credenciales();
});

function cargar_credenciales() {
	var xhr 	= new XMLHttpRequest();
	var params 	= "action=cargar_credenciales";
	xhr.open("POST", "inc/usuarios.php",true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xhr.send(params);
	xhr.onreadystatechange = function()
	{
		if(xhr.readyState == 4)
		{
			if(xhr.status == 200)
			{
				data = xhr.responseText.trim();
				if(data < 0)
					M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
				else
				{
					data = data.split("::");
					credenciales = JSON.parse(data[0]);
				}
			}
			else
				M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
		}
	}
}

if(document.getElementById('usuario-logout') != null) {
	document.getElementById('usuario-logout').addEventListener('click', function(event){
		var xhr = new XMLHttpRequest();
		var params = "action=logout";
		xhr.open("POST", "inc/login.php",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(params);
		xhr.onreadystatechange = function()
		{
			if(xhr.readyState == 4)
			{
				if(xhr.status == 200)
				{
					var data = xhr.responseText.trim();
					console.log(data);
					if(data < 0)
						M.toast({html: 'Ha ocurrido un error. Por favor, intente de nuevo. Código: '+data, classes: 'toasterror'});
					else
					{
						location.reload();
					}
				}
				else
					M.toast({html: "Ha ocurrido un error, verifique su conexión a Internet", classes: 'toasterror'});
			}
		}
	});
}

const toggleUpdateLogin = (e) => {

	const cmp = e.target;
	const padre = $(cmp).parent();
	const classes = $(padre)[0].classList;

	if(!$(cmp).is(":focus")) {
		classes.remove('focus-active');
	} else {
		classes.add('focus-active');
	}
}