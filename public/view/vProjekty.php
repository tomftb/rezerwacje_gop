<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="w-100 " style="margin-top:-55px; position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-4" >
            <div class="btn pull-left mt-0" > 
                 <button id='createData' class="btn btn-info pull-right mr-0 mb-0 mt-0 ml-1" data-toggle="modal" data-target="#AdaptedModal" onclick="newProject()">Dodaj projekt</button>
            </div> 
        </div>
        <div class=" col-sm-4">
            <h2 class="text-center mb-3 mt-1 text-info">Projekty :</h2>
        </div>
        <div class=" col-sm-4">
            <div class="row float-right mr-4">
                <div class="sm-col-8">
                    <h5 class="mt-2 text-secondary" >Szukaj : </h5>
                </div>
                <div class="sm-col-4">
                    <input class="ml-1 form-control mt-1" onchange="search(this.value)"/>
                </div>
            </div>
        </div>
    </div>
</div>
    
    
    
    