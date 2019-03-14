<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<body>
<div class="w-100 " style="margin-top:-55px;position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-4" >
            
        </div>
        <div class=" col-sm-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Parametry :</h2>
        </div>
        <div class=" col-sm-4" >
            <div class="row float-right mr-4">
                <div class="sm-col-8">
                    <h5 class="mt-2 text-secondary" >Szukaj : </h5>
                </div>
                <div class="sm-col-4">
                    <input class="ml-1 form-control mt-1" onchange="getAjaxData('getAllParmLike','&filter='+this.value,'sParm',null)"/>
                </div>
            </div>
        </div>
    </div>
</div>
<div class="w-100 " style="margin-top:150px;" >
<div class="mr-3 ml-3">
    <div>
        <table class="table table-striped table-condensed" id="allDataTable">
          <thead class="thead-dark" id="allDataHeader">
          </thead>
          <tbody id="allDataBody">
          </tbody>
        </table>
    </div>
    <div class="alert alert-danger row mt-1 mb-0" id="errDiv-Adapted-overall" style="display: none;">
                    </div>
</div>
</div>
<!-- DETAIL TEMPLATE -->
<div class="modal fade mb-0" tabindex="-1" role="dialog" id="formModalDetail" aria-hidden="true">
    <div class="modal-body mb-0 pb-1 pt-1">
        <form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="newForm">
            <div class="form-group row mt-2 mb-0" id="formModalDetailFields">
            </div>
        </form>
    </div>
</div>
<!-- END DETAIL TEMPLATE -->
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
<div id="div-inputPdf7a" style="display:block;margin-bottom:50px;"></div>