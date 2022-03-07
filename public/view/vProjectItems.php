<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="container-fluid pl-0 pr-5 mr-5"  style="margin-top:-65px; position:fixed; z-index:996;">
    <div class="row">
        <div class="col-4" >
            <div class="btn pull-left mt-0" > 
                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <div class="btn-group" role="group">
                        <button class="btn btn-info text-white" type="button" onclick="ProjectStage.show()">
                        Etapy
                        </button>
                        <button type="button" class="btn  btn-info dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu bg-info">
                            <a id="createData" class="dropdown-item bg-info text-white" data-toggle="modal" data-target="#AdaptedModal" onclick="ProjectStage.preapreData()" href="#">Dodaj tekst</a>
                            <a id="createImage" class="dropdown-item bg-info text-white" onclick="ProjectStage.prepareData('tx')" href="#">Dodaj zdjęcie</a>
                            <a id="createTable" class="dropdown-item bg-info text-white" data-toggle="modal" data-target="#AdaptedModal" onclick="ProjectStage.prepareTable('t')" href="#">Dodaj tabelę</a>
                            <a id="createList" class="dropdown-item bg-info text-white" data-toggle="modal" data-target="#AdaptedModal" onclick="ProjectStage.prepareList('l')" href="#">Dodaj listę</a>
                            <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                        </div>
                    </div>
                    <div class="btn-group" role="group">
                      <button class="btn btn-warning text-white" type="button" onclick="ProjectConst.show()">
                        Stałe
                      </button>
                      <button type="button" class="btn  btn-warning dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                      <div class="dropdown-menu bg-warning text-white">
                        <a id="stageConstBtn" class="dropdown-item bg-warning text-white" onclick="ProjectConst.new()" href="#">Dodaj</a>
                        <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Elementy projektu (<span id="headTitle"></span>):</h2>
        </div>
        <div class="col-4" >
             <div class="row float-right w-100 mr-0">
                <div class="col-4">
                    <h5 class="mt-3 text-secondary text-right" > 
                        <i class="fa fa-search"></i>&nbspSzukaj:</span>
                    </h5>
                </div>
                <div class="col-8 pl-0 pr-0">
                    <div class="form-group mb-0">
                    <input class="ml-1 form-control mt-2" id='findData' onchange="ProjectItems.filterData(this.value)"/>
                    </div>
                    <div class="form-group form-check mt-0">
                    <label class="form-check-label"><input type="checkbox" class="form-check-input" value="0" onclick="ProjectItems.filterHiddenData(this)"><small>Pokaż ukryte</small></label></div>
                </div>
            </div>  
            </div>
        </div>
    </div>
<!-- LEGEND -->
<div class="modal fade mb-0 pb-0 col-sm-12" id="legendDiv">
    <hr class="w-100"></hr>
        <small class="modal-title text-left text-secondary pl-1 pb-2" id="fieldModalLabel">Legenda:</small> 
            <ul class="text-secondary font-weight-normal small" style="list-style-type:square;">
                <li>A - litera alfabetu, C - cyfra</li>
                <li>Nazwa:</li>
                    <ul style="list-style-type:disc;">
                        <li>Musi się zacząć A</li>
                        <li>Min 3 znaki</li>
                        <li>Max 30 znaków</li>
                        <li>Może zawierać zawierać A,C,- </li>
                    </ul>
            </ul>
</div>    
<!-- END LEGEND --><?php

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

