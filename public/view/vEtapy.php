<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="container-fluid pl-0 pr-5 mr-5"  style="margin-top:-65px; position:fixed; z-index:996;">
    <div class="row">
        <div class="col-4" >
            <div class="btn pull-left mt-0" > 
                <button id='createData' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="createData()">Dodaj etap </button>
                <button id="stageConstBtn" class="btn btn-warning pull-left mr-0 mb-0 mt-0 ml-1" onclick="StageConst.show()">Stałe</button>
            </div> 
        </div>
        <div class="col-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Etapy projektu :</h2>
        </div>
        <div class="col-4" >
             <div class="row float-right w-100 mr-0">
                <div class="col-4">
                    <h5 class="mt-3 text-secondary text-right" > 
                        <i class="fa fa-search"></i>Szukaj:</span>
                    </h5>
                </div>
                <div class="col-8 pl-0 pr-0">
                    <div class="form-group mb-0">
                    <input class="ml-1 form-control mt-2" id='findData' onchange="findData(this.value)"/>
                    </div>
                    <div class="form-group form-check mt-0">
                    <label class="form-check-label"><input type="checkbox" class="form-check-input" value="0" onclick="showHidden(this)"><small>Pokaż ukryte</small></label></div>
                </div>
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
<!-- END LEGEND -->