<?php if(!defined('APP_URL')){exit;}; ?>
<header id="header" class=" pt-0 pb-0 mb-0">
        <div class="row mt-0 mb-0 pb-0" >
            <div class="col-4 pr-0 pt-4">
                <div id="logo" class="float-right">
                  <h1>
                      <a href="<?=APP_URL?>?id=1" class="scrollto"><?=APP_NAME?></a>
                  </h1>
                </div>
            </div>
            <div class="col-7 ml-0 pt-4">
                <nav id="nav-menu-container" class="float-left">
                  <ul class="nav-menu" onclick="setMenuActive()">
                    <li id="li-1"><i class="fa fa-server menu-active" aria-hidden="true"></i><a href="<?=APP_URL?>?id=1">Rezerwuj Klaster</a></li>
                    <li id="li-3"><i class="fa fa-address-card-o" aria-hidden="true"></i><a href="<?=APP_URL?>?id=3">Projekty</a></li>
                    <li id="li-4"><i class="fa fa-user-circle-o" aria-hidden="true"></i><a href="<?=APP_URL?>?id=4">Pracownicy</a></li>
                      <li id="li-5"><i class="fa fa-cog" aria-hidden="true"></i><a href="<?=APP_URL?>?id=5"> Administrator</a>
                          <ul  class="mt-0 ml-0 " onclick="setMenuActive()">
                            <li id="li-6"><a href="<?=APP_URL?>?id=6">Użytkownicy</a></li>
                            <li id="li-7"><a href="<?=APP_URL?>?id=7">Uprawnienia</a></li>
                            <li id="li-8"><a href="<?=APP_URL?>?id=8">Role</a></li>
                            <li id="li-10"><a href="<?=APP_URL?>?id=10">Parametry</a></li>
                            <li id="li-11"><a href="<?=APP_URL?>?id=11">Elementy Projektu</a></li>
                          </ul>
                        </li>
                    <li><i class="fa fa-sign-out" aria-hidden="true"></i><a href="<?=APP_URL?>?logout=t"> Wyloguj</a></li>
                  </ul>
                </nav><!-- #nav-menu-container -->     
            </div>
            <div class="col-1 pt-3 d-none" id="appLoadNotify">
                <img src="<?=APP_URL?>/img/loading_60_60.gif" alt="load" />
            </div>
        </div>
</header><!-- #header -->
