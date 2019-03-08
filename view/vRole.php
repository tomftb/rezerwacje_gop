<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<body>
<div class="w-100 "  style="margin-top:-55px;position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-2" >
            <div class="btn pull-left mt-0" > 
                <button id='addNewButton' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="createAdaptedModal('cRole',null)">Dodaj role</button>
            </div> 
        </div>
        <div class=" col-sm-8" >
            <h2 class="text-center mb-3 mt-1 text-info">Role :</h2>
        </div>
        <div class=" col-sm-2" >
             <div class="row ">
                <div class="sm-col-8">
                    <h5 class="text-right mt-2 text-secondary" >Szukaj : </h5>
                </div>
                <div class="sm-col-4">
                    <input class="form-control mt-1" onchange="getAjaxData('getAllRoleLike','&filter='+this.value,'sRole',null)"/>
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
</div>
</div>
<!-- ADAPTED MODAL PROJECT -->
<div class="modal fade" id="AdaptedModal" tabindex="-1" role="dialog" aria-labelledby="AdaptedModalContent" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" id="AdaptedBgTitle">
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="AdaptedTextTitle">DODAJ ROLE:</span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body mb-0 pb-0 pt-0 mt-0" id="AdaptedBodyContent">
                <div class="form-group row mb-1 pb-0  pt-0 mt-0">
                    <div class=" col-sm-12 mt-4" >
                        <h5 class="modal-title text-center" id="AdaptedBodyContentTitle">
                        </h5> 
                    </div>
                </div>
                <div class="form-group row mb-0 pb-0">
                    <div class="col-sm-12 pr-0 mr-0 ml-0 pl-0"  id="AdaptedDynamicData">
                    </div>
                </div>
                <div class="form-group row mb-0">
                    <div class="col-sm-12" id="AdaptedButtonsBottom">
                    </div>
                </div>
                    <div class="alert alert-danger row mt-1 mb-0" id="errDiv-Adapted-overall" style="display: none;">
                    </div>
                <div class="form-group row" id="AdaptedBodyExtra"></div>
            </div>
            <div class="modal-footer w-100 mt-1" >
                <div class="w-100 mr-0 ml-0 pr-0 pl-0">
                     <div class="row w-100">
                        <small class="text-left text-secondary" id="AdaptedModalInfo"></small>
                     </div>
                </div>
            </div>
        </div>
    </div>
</div>   
<!-- END ADAPTED MODAL PROJECT -->
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