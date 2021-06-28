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
<!-- ADAPTED MODAL PROJECT -->
<div class="modal fade" id="AdaptedModal" tabindex="-1" role="dialog" aria-labelledby="AdaptedModalContent" aria-hidden="true">
    <div class="modal-dialog modal-xl" role="document" id="AdaptedModalDialog" >
        <div class="modal-content">
          <div class="modal-header" id="AdaptedBgTitle">
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="AdaptedTextTitle"></span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close" id="closeModal" onclick="reloadData(defaultTask);">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body mb-0 pb-0 pt-0 mt-0" id="AdaptedBodyContent">
                <div class="form-group row mb-1 pb-0  pt-0 mt-0" id="AdaptedBodyContentTitle">
                    <div class=" col-sm-12 mt-4" >
                        <h5 class="modal-title text-center" id="fieldModalLabel">
                            <span id="projectTitle">
                            </span>
                        </h5> 
                    </div>
                </div>
                <div class="form-group row mb-0 pb-0">
                    <div class="col-sm-12"  id="AdaptedDynamicData">
                    </div>
                </div>
                <div class="form-group row mb-0">
                    <div class="col-sm-12" >
                        <div class="btn-group pull-right" id="AdaptedButtonsBottom">
                        </div>
                    </div>
                </div>
                    <div class="alert alert-danger row mt-1 mb-0" id="errDiv-Adapted-overall" style="display: none;">
                    </div>
                <div class="form-group row" id="AdaptedBodyExtra">
                </div>
            </div>
            <div class="modal-footer w-100 mt-1" >
                <div class="w-100 mr-0 ml-0 pr-0 pl-0">
                     <div class="row w-100" id="AdaptedModalInfo">           
                     </div>
                </div>
            </div>
        </div>
    </div>
</div>   
<!-- END ADAPTED MODAL PROJECT -->