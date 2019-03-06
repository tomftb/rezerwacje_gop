<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php"); ?>
<header id="header" style="border: 0px solid purple;">
        <div class="row">
            <div class="col pr-0">
                <div id="logo" class="pull-right" style="border: 0px solid orange;">
                  <h1><img src="<?php echo $URL; ?>/gt_utilities/gt_logo_34.png" alt="" title="GT_LOGO"  />
                      <a href="<?php echo $URL."?id=1"; ?>" class="scrollto">Rezerwacje GOP</a>
                  </h1>
                </div>
            </div>
            <div class="col-sm-8 ml-0 " style="border:0px solid purple">
                <nav id="nav-menu-container pull-left" style="border:0px solid black">
                  <ul class="nav-menu" onclick="setMenuActive()">
                      <li id="li-1"><i class="fa fa-server" aria-hidden="true"></i><a href="<?php echo $URL."?id=1"; ?>">Rezerwuj Klaster</a></li>
                      <li id="li-2"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?php echo $URL."?id=2"; ?>">Zgłoś projekt</a></li>
                      <li id="li-3"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?php echo $URL."?id=3"; ?>">Projekty</a></li>
                      <li id="li-4"><i class="fa fa-user-circle-o" aria-hidden="true"></i><a href="<?php echo $URL."?id=4"; ?>">Pracownicy</a></li>
                      <li id="li-5"><i class="fa fa-cog" aria-hidden="true"></i><a href="<?php echo $URL."?id=5"; ?>"> Administrator</a>
                          <ul  class="mt-0 ml-0 nav-menu" onclick="setMenuActive()">
                            <li id="li-6"><a href="<?php echo $URL."?id=6"; ?>">Użytkownicy</a></li>
                            <li id="li-7"><a href="<?php echo $URL."?id=7"; ?>">Uprawnienia</a></li>
                            <li id="li-8"><a href="<?php echo $URL."?id=8"; ?>">ROle</a></li>
                            <li id="li-9"><a href="<?php echo $URL."?id=9"; ?>">Opcje</a></li>
                            <li id="li-10"><a href="<?php echo $URL."?id=10"; ?>">Parametry</a></li>
                          </ul>
                        </li>
                    <li><i class="fa fa-sign-out" aria-hidden="true"></i><a href="<?php echo $URL."?logout=t"; ?>"> Wyloguj</a></li>
                  </ul>
                </nav><!-- #nav-menu-container -->
            </div>
        </div>
</header><!-- #header -->
<SCRIPT type="text/javascript" src="<?php echo $URL; ?>/js/headerView.js"></SCRIPT>