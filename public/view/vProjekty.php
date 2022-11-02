<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<div class="container-fluid pl-0 pr-5 mr-5" style="margin-top:-100px; position:fixed; z-index:996;" id="mainHead"> 
    <div class="row">
        <div class="col-12" >
            <h2 class="text-center m-0 text-info">Projekty :</h2>
        </div>
    </div>
    <div class="row">
        <div class="col-6" >
            <div class="btn pull-left mt-0 mb-0" > 
                <button id='createData' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="newProject();">Dodaj projekt</button>
            </div> 
        </div>
        <div class="col-6">
            <div class="row float-right w-100 mr-0 mt-0 mb-0">
                <div class="col-4 pr-0">
                    <h5 class="mt-3 text-secondary text-right">Szukaj :</h5>
                </div>
                <div class="col-8 pl-0 pr-0">
                    <input class="ml-1 form-control mt-2"  onchange="findData(this.value)"/>
                </div>
            </div>
        </div>
    </div>
</div>
    
    
    
    