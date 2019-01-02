<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php"); ?>
<header id="header">
    <div class="container">
      <div id="logo" class="pull-left">
        <h1> <img src="<?php echo $URL; ?>/gt_utilities/gt_logo_34.png" alt="" title="GT_LOGO"  />
            <a href="<?php echo $URL."?id=1"; ?>" class="scrollto">Rezerwacje GOP</a>
        </h1>
      </div>
      <nav id="nav-menu-container" style="border:0px solid black">
        <ul class="nav-menu" onclick="setMenuActive()">
            <li id="li-1"><i class="fa fa-server" aria-hidden="true"></i><a href="<?php echo $URL."?id=1"; ?>">Rezerwuj Klaster</a></li>
            <li id="li-2"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?php echo $URL."?id=2"; ?>">Zgłoś projekt</a></li>
            <li id="li-3"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?php echo $URL."?id=3"; ?>"> Projekty</a></li>
            <li ><i class="fa fa-cog" aria-hidden="true"></i><a href=""> Administrator</a>
                <ul class="mt-0 ml-0">
                  <li><a href="#">Użytkownicy</a></li>
                  <li><a href="#">Uprawnienia</a></li>
                  <li><a href="#">Parametry</a></li>
                  <li><a href="#">Opcje</a></li>
                </ul>
              </li>
          <li><i class="fa fa-sign-out" aria-hidden="true"></i><a href="<?php echo $URL."?logout=t"; ?>"> Wyloguj</a></li>
        </ul>
      </nav><!-- #nav-menu-container -->
    </div>
  </header><!-- #header -->
  <SCRIPT type="text/javascript" src="<?php echo $URL; ?>/js/headerView.js"></SCRIPT>