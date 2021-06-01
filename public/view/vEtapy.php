<?php
if(!defined("DR")){
    die('Direct access not permitted');

}
else{
    require_once(DR."/function/redirectToLoginPage.php");
    require_once(DR."/modul/mValidUrl.php");
} 
?>
<body>
<div class="w-100 "  style="margin-top:-65px;position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-4" >
            <div class="btn pull-left mt-0" > 
                <button id='createData' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="createData()">Dodaj etap </button>
            </div> 
        </div>
        <div class=" col-sm-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Etapy projektu :</h2>
        </div>
        <div class=" col-sm-4" >
             <div class="row float-right mr-4">
                <div class="sm-col-8">
                    <h5 class="mt-2 text-secondary" > 
                                <i class="fa fa-search"></i> Szukaj  </span>

                    </h5>
                </div>
                <div class="sm-col-4">
                    <div class="form-group mb-0">
                    <input class="ml-1 form-control mt-1" id='findData' onchange="findData(this.value)"/>
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