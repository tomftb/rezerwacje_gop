<?php if(!defined('APP_URL')){exit;}; ?>
<header id="header" style="border: 0px solid purple;">
        <div class="row">
            <div class="col pr-0">
                <div id="logo" class="pull-right" style="border: 0px solid orange;">
                  <h1>
                      <a href="<?=APP_URL?>?id=1" class="scrollto"><?=APP_NAME?></a>
                  </h1>
                </div>
            </div>
            <div class="col-sm-8 ml-0 " style="border:0px solid purple">
                <nav id="nav-menu-container pull-left" style="border:0px solid black">
                  <ul class="nav-menu" onclick="setMenuActive()">
                       <li id="li-1"><i class="fa fa-server" aria-hidden="true"></i><a href="<?=APP_URL?>?id=1">Rezerwuj Klaster</a></li>
                      <li id="li-3"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?=APP_URL?>?id=3">Projekty</a></li>
                      <li id="li-4"><i class="fa fa-user-circle-o" aria-hidden="true"></i><a href="<?=APP_URL?>?id=4">Pracownicy</a></li>
                      <li id="li-5"><i class="fa fa-cog" aria-hidden="true"></i><a href="<?=APP_URL?>?id=5"> Administrator</a>
                          <ul  class="mt-0 ml-0 nav-menu" onclick="setMenuActive()">
                            <li id="li-6"><a href="<?=APP_URL?>?id=6">Użytkownicy</a></li>
                            <li id="li-7"><a href="<?=APP_URL?>?id=7">Uprawnienia</a></li>
                            <li id="li-8"><a href="<?=APP_URL?>?id=8">Role</a></li>
                            <li id="li-10"><a href="<?=APP_URL?>?id=10">Parametry</a></li>
                            <li id="li-11"><a href="<?=APP_URL?>?id=11">Etapy Projektu</a></li>
                          </ul>
                        </li>
                    <li><i class="fa fa-sign-out" aria-hidden="true"></i><a href="<?=APP_URL?>?logout=t"> Wyloguj</a></li>
                  </ul>
                </nav><!-- #nav-menu-container -->
            </div>
        </div>
</header><!-- #header -->
<SCRIPT type="text/javascript" src="<?=APP_URL?>/js/headerView.js?<?=uniqid()?>"></SCRIPT>