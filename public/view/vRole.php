<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="container-fluid pl-0 pr-5 mr-5" style="margin-top:-55px; position:fixed; z-index:996;border:0px solid green;" id="mainHead"> 
    <div class="row">
        <div class="col-4" >
            <div class="btn pull-left mt-0" >
                <button id='createData' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="createData()">Dodaj role</button>
            </div> 
        </div>
        <div class="col-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Role :</h2>
        </div>
        <div class="col-4" style="border:0px solid pink;">
            <div class="row float-right w-100 mr-0" style="border:0px solid purple;">
                <div class="col-4 pr-0" style="border:0px solid black;">
                    <h5 class="mt-3 text-secondary text-right"style="border:0px solid black;" >Szukaj :</h5>
                </div>
                <div class="col-8 pl-0 pr-0" style="border:0px solid red;">
                    <input class="ml-1 form-control mt-2"  onchange="findData(this.value)"/>
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