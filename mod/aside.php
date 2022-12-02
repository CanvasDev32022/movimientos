	<aside class="sidenav-main nav-collapsible sidenav-dark sidenav-active-rounded <?php if($cms_seccion[$index]['aside'])  echo "nav-lock";  else  echo "nav-collapsed"; ?>">
		<div class="brand-sidebar">
			<h1 class="logo-wrapper">
				<a class="brand-logo" href="/">
					<img class="hide-on-med-and-down logo-left" src="img/home/logo-left.png" alt="Zuntek Logo" />
				<?php if($cms_seccion[$index]['aside']): ?>
					<img class="show-on-medium-and-down hide-on-med-and-up logo-mobile" src="img/home/logo-right.png" alt="materialize logo" />
				<?php endif; ?>
					<span class="logo-text hide-on-med-and-down"><img class="logo-right" src="img/home/logo-right-01.png" alt="materialize logo" /></span>
				</a>
				<a class="navbar-toggler" href="JavaScript:void(0)"><i class="material-icons"><?php if($cms_seccion[$index]['aside'])  echo "radio_button_checked";  else  echo "radio_button_unchecked"; ?></i></a>
			</h1>
		</div>
		<ul class="sidenav sidenav-collapsible leftside-navigation collapsible sidenav-fixed" id="slide-out" data-menu="menu-navigation" data-collapsible="accordion">
		<?php if($tools->validar_acceso(0,$usr_rol, $roles)): ?>
			<li class="bold <?php if($cms_seccion[$index]['modulo'] == 'dashboard') echo 'active' ?>">
				<a class="waves-effect waves-cyan <?php if($cms_seccion[$index]['modulo'] == 'dashboard') echo 'active' ?>" href="dashboard">
					<i class="material-icons">dashboard</i>
					<span class="menu-title">Dashboard</span>
				</a>
			</li>
		<?php endif; ?>
		<?php if($tools->validar_acceso(1,$usr_rol, $roles)): ?>
			<li class="bold <?php if($cms_seccion[$index]['modulo'] == 'usuarios') echo 'active' ?>">
				<a class="waves-effect waves-cyan <?php if($cms_seccion[$index]['modulo'] == 'usuarios') echo 'active' ?>" href="usuarios">
					<i class="material-icons">person_ouline</i>
					<span class="menu-title">Usuarios</span>
				</a>
			</li>
		<?php endif; ?>
		</ul>
		<div class="navigation-background"></div><a class="sidenav-trigger btn-sidenav-toggle btn-floating btn-medium waves-effect waves-light hide-on-large-only" data-target="slide-out"><i class="material-icons">menu</i></a>
	</aside>
	<div id="main" class="<?php if(!$cms_seccion[$index]['aside']) echo "main-full" ?>">
<?php if ($cms_seccion[$index]['titulo']): ?>
		<!-- Título  -->
		<div id="breadcrumbs-wrapper" class="breadcrumbs-bg-image">
			<div class="container mt-0">
				<div class="row mb-0">
					<div class="col s12 m6 l6">
						<h5 class="breadcrumbs-title mt-0 mb-0"><span><?php echo $cms_seccion[$index]['nombre']; ?></span></h5>
					</div>
				</div>
			</div>
		</div>
<?php endif ?>

<div id="carga-modal" class="modal carga-modal"></div>