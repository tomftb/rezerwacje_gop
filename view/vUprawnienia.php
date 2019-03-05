<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<body>
<div class="w-100 " style="margin-top:100px;" >
<div class="mr-3 ml-3">
    <div>
        <h2 class="text-center mt-3 mb-3 text-info">Uprawnienia :</h2>
        <table class="table table-striped table-condensed">
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
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="AdaptedTextTitle">DODAJ PRACOWNIKA:</span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close">
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
    <div class="modal-body mb-0 pb-1 pt-1 pr-0">
        <form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="newForm">
            <div class="form-group mt-2 mb-0" id="formModalDetailFields">
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
                <li>Imię,nazwisko i stanowisko:</li>
                    <ul style="list-style-type:disc;">
                        <li>może się zaczą A|C</li>
                        <li>Imię może zawierać A i spacje</li>
                        <li>Nazwisko może zawierać zawierać A,- i spacje</li>
                        <li>Stanowisko może zawierać A,C,_,-,. i spacje</li>
                    </ul>
                <li>Imię - min 3, max 30 znaków.</li>
                <li>Nazwisko - min 3, max 30 znaków.</li>
                <li>Stanowisko - max 50 znaków</li>
            </ul>
</div>    
<!-- END LEGEND -->
<div id="div-inputPdf7a" style="display:block;margin-bottom:50px;"></div>