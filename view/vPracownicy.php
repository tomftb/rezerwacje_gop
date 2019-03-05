<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<script type="text/javascript" src="<?php echo $URL;?>/js/pracownicy.js"></script>
<body>
<div class="w-100 " style="margin-top:-55px;position:fixed;">
    <div class="row">
        <div class=" col-sm-2" >
            <div class="btn pull-left mt-0" > 
            <button id="addNewEmployeeButton" class="btn btn-info pull-right mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#ProjectAdaptedModal" onclick="createAdaptedModal('cEmployee',null)">Dodaj pracownika</button>
            </div> 
        </div>
        <div class=" col-sm-8" >
            <h2 class="text-center mb-3 mt-1 text-info">Pracownicy :</h2>
        </div>
        <div class=" col-sm-2" >
        </div>
    </div>
</div>
<div class="w-100 " style="margin-top:150px;" >
<div class="mr-3 ml-3">
    <div>
        <table class="table table-striped table-condensed">
          <thead class="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Imię i Nazwisko</th>
              <th scope="col">Stanowisko</th>
              <th scope="col">Procent wykorzystania</th>
              <th scope="col">Opcje</th>
            </tr>
          </thead>
          <tbody id="allEmployeesData">
          </tbody>
        </table>
    </div>
</div>
</div>
<!-- ADAPTED MODAL PROJECT -->
<div class="modal fade" id="ProjectAdaptedModal" tabindex="-1" role="dialog" aria-labelledby="ProjectAdaptedModalContent" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" id="ProjectAdaptedBgTitle">
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="ProjectAdaptedTextTitle">DODAJ PRACOWNIKA:</span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body mb-0 pb-0 pt-0 mt-0" id="ProjectAdaptedBodyContent">
                <div class="form-group row mb-1 pb-0  pt-0 mt-0" id="ProjectAdaptedBodyContentTitle">
                    <div class=" col-sm-12 mt-4" >
                        <h5 class="modal-title text-center" id="fieldModalLabel">
                            <span id="projectTitle">
                            </span>
                        </h5> 
                    </div>
                </div>
                <div class="form-group row mb-0 pb-0">
                    <div class="col-sm-12"  id="ProjectAdaptedDynamicData">
                    </div>
                </div>
                <div class="form-group row mb-0">
                    <div class="col-sm-12" id="ProjectAdaptedButtonsBottom">
                    </div>
                </div>
                    <div class="alert alert-danger row mt-1 mb-0" id="errDiv-Adapted-overall" style="display: none;">
                    </div>
                <div class="form-group row" id="ProjectAdaptedBodyExtra"></div>
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
<!-- EMPLOYEE DETAIL TEMPLATE -->
<div class="modal fade mb-0" tabindex="-1" role="dialog" id="employeeModalDetail" aria-hidden="true">
<div class="modal-body mb-0 pb-1 pt-1">
<form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="newForm">
    <div class="form-group row mt-2 mb-1" id="addProjectModalDetailFields"></div>
</form>
</div>
</div>
<!-- END EMPLOYEE DETAIL TEMPLATE -->
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
<div id="div-inputPdf7a" style="display:block;margin-bottom:50px;">
    
    
    
</div>
<script>
window.onload=getAjaxData('getemployees','','sEmployees',null);
</script>