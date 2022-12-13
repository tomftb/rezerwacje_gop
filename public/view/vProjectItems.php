<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="container-fluid pl-0 pr-5 mr-5"  style="margin-top:-100px; position:fixed; z-index:996;">
    <div class="row">
        <div class="col-12" >
            <h2 class="text-center mb-2 m-0 text-info">Elementy projektu (<span id="headTitle"></span>):</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-6 mb-0 mt-0" >
            <div class="btn pull-left mt-0" > 
                <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                    <div class="btn-group" role="group">
                        <button class="btn btn-info text-white" type="button" onclick="Items.Stage.clearShow()">
                        Etapy
                        </button>
                        <button type="button" class="btn  btn-info dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          <span class="sr-only">Toggle Dropdown</span>
                        </button>
                        <div class="dropdown-menu bg-info">
                            <a id="createText" class="dropdown-item bg-info text-white" onclick="Items.Stage.createText()" href="#">Dodaj tekst</a>
                            <a id="createImage" class="dropdown-item bg-info text-white" onclick="Items.Stage.createImage()" href="#">Dodaj zdjęcie</a>
                            <a id="createTable" class="dropdown-item bg-info text-white" onclick="Items.Stage.createTable()" href="#">Dodaj tabelę</a>
                            <a id="createList" class="dropdown-item bg-info text-white" onclick="Items.Stage.createList()" href="#">Dodaj listę</a>
                            <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                        </div>
                    </div>
                    <div class="btn-group" role="group">
                      <button class="btn btn-warning text-white" type="button" onclick="Items.Constant.clearShow()">
                        Stałe
                      </button>
                      <button type="button" class="btn  btn-warning dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                      <div class="dropdown-menu bg-warning text-white">
                        <a id="createConst" class="dropdown-item bg-warning text-white" onclick="Items.Constant.create()" href="#">Dodaj</a>
                        <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                      </div>
                    </div>
                     <div class="btn-group" role="group">
                      <button class="btn btn-purple text-white" type="button" onclick="Items.Variable.clearShow()">
                        Zmienne
                      </button>
                      <button type="button" class="btn  btn-purple dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                      <div class="dropdown-menu bg-purple text-white">
                        <a id="createConst" class="dropdown-item bg-purple text-white" onclick="Items.Variable.create()" href="#">Dodaj</a>
                        <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                      </div>
                    </div>
                     <div class="btn-group" role="group">
                      <button class="btn btn-brown text-white" type="button" onclick="Items.Stage.showHeading()">
                        Nagłówek
                      </button>
                      <button type="button" class="btn btn-brown dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                      <div class="dropdown-menu bg-brown text-white">
                        <a id="createConst" class="dropdown-item bg-brown text-white" onclick="Items.Stage.createHeading()" href="#">Dodaj</a>
                        <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                      </div>
                    </div>
                     <div class="btn-group" role="group">
                      <button class="btn btn-brown text-white" type="button" onclick="Items.Stage.showFooter()">
                        Stopka
                      </button>
                      <button type="button" class="btn  btn-brown dropdown-toggle dropdown-toggle-split text-white" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                      <div class="dropdown-menu bg-brown text-white">
                        <a id="createConst" class="dropdown-item bg-brown text-white" onclick="Items.Stage.createFooter()" href="#">Dodaj</a>
                        <!--<a class="dropdown-item" href="#">Pokaż</a>-->
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-6 mb-0 mt-0" >
                <div class="input-group"><input type="text" class="form-control" placeholder="Szukaj..." onkeyup="Items.setFilterValue(this)" ><div class="input-group-append"><button class="btn btn-secondary" type="button" onclick="Items.filterOut(this)"><i class="fa fa-search"></i></button></div>
                  </div>
                    <div class="form-group form-check-inline mt-0">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="0" onclick="Items.hidden(this)">
                        <small class="text-secondary">Pokaż ukryte</small>
                    </label>
                    </div>
                    <div class="form-group form-check-inline mt-0 ">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="0" onclick="Items.deleted(this)">
                        <small class="text-danger">Pokaż usunięte</small>
                    </label>
                    </div>
                    <div class="form-group form-check-inline mt-0 ">
                    <label class="form-check-label">
                        <input type="checkbox" class="form-check-input" value="0" onclick="Items.all(this)">
                        <small class="text-primary">Pokaż wszystkie</small>
                    </label>
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

