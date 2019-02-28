<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<script type="text/javascript" src="<?php echo $URL;?>/js/projekty.js"></script>
<body>
<div class="w-100 " style="margin-top:-55px; border:0px solid red; position:fixed;">
    <div class="btn pull-left mt-0" > 
        <button id='addNewProjectButton' class="btn btn-info pull-right mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#ProjectAdaptedModal" onclick="createAdaptedModal('createProject','','','n')">Dodaj projekt</button>
    </div> 
</div>
<div class="w-100 " style="margin-top:150px; border:0px solid red;" >

<div class="mr-3 ml-3">
    <div  style="border:0px solid green;">
        <table class="table table-striped table-condensed">
          <thead class="thead-dark">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Numer</th>
              <th scope="col">Temat</th>
              <th scope="col">Data utworzenia</th>
              <th scope="col">Lider</th>
              <th scope="col">Manager</th>
              <th scope="col">Termin realizacji</th>
              <th scope="col">Termin harmonogram</th>
              <th scope="col">Koniec projektu</th>
              <th scope="col">Status</th>
              <th scope="col">Opcje</th>
            </tr>
          </thead>
          <tbody id="projectData">
          </tbody>
        </table>
    </div>
</div>
</div>
<!-- ADAPTED MODAL PROJECT -->
<div class="modal fade " id="ProjectAdaptedModal" tabindex="-1" role="dialog" aria-labelledby="ProjectAdaptedModalContent" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content" style="border:0px solid red">
          <div class="modal-header" id="ProjectAdaptedBgTitle">
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="ProjectAdaptedTextTitle">USUWANIE PROJEKTU:</span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body mb-0 pb-0 pt-0 mt-0" id="ProjectAdaptedBodyContent" style="border:0px solid blue">
                <div class="form-group row mb-1 pb-0  pt-0 mt-0" style="border:0px solid green" id="ProjectAdaptedBodyContentTitle">
                    <div class=" col-sm-12 mt-4" >
                        <h5 class="modal-title text-center" id="fieldModalLabel"><span id="projectTitle"></span></h5> 
                    </div>
                </div>
                <div class="form-group row mb-0 pb-0" style="border:0px solid orange" >
                    <div class="col-sm-12"  id="ProjectAdaptedDynamicData">
                    </div>
                </div>
                <div class="form-group row mb-0" style="border:0px solid black" >
                    <div class=" col-sm-12" id="ProjectAdaptedButtonsBottom">
                    </div>
                </div>
                <div class="alert alert-danger row" id="errDiv-Adapted-overall" style="border:0px solid blue">
                        <span id="errText-Adapted-overall"></span>
                </div>
                <div class="form-group row" id="ProjectAdaptedBodyExtra" style="border:0px solid blue"></div>
            </div>
            <div class="modal-footer w-100 mt-1" >
                <div class="w-100 mr-0 ml-0 pr-0 pl-0" style="border:0px solid purple">
                     <div class="row w-100" style="border:0px solid black">
                        <small class="text-left text-secondary" id="fieldModalLabel">Project id: <span id="projectId"></span></small> 
                        <small class="text-left text-secondary" id="fieldModalLabel2"><span id="projectId2"></span></small> 
                     </div>
                </div>
            </div>
        </div>
    </div>
</div>   
<!-- END ADAPTED MODAL PROJECT -->
<div id="readroot" style="display: none">
        <div class="input-group" name="pdfExtra">
            <input type="text" class="entry form-control" id="inputPdfDok" placeholder="" name="inputPdfDok" onblur="parseFieldValue(this,'inputPdfDok')"/>            
                <div class="input-group-addon input-group-append ">
                    <div class=" btn  btn-danger rounded-right" onclick="closeNode(this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode),this.parentNode.parentNode)">
                        <i class="fa fa-minus" aria-hidden="true"></i>
                    </div>
                </div>
            <div class="text-left w-100 mb-0 mt-0" id="errDiv-pdfExtra" style="display: none;" >
                <div class="alert alert-danger mb-0">
                    <span id="errText-pdfExtra"></span>
            </div>  
        </div>
    </div>  
</div>
<!-- PROJECT DETAIL TEMPLATE -->
<div class="modal fade mb-0" tabindex="-1" role="dialog" id="addProjectModalDetail" aria-hidden="true">
<div class="modal-body mb-0 pb-1 pt-1">
<form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="createPdfForm">
    <div class="form-group row mt-2 mb-1" id="addProjectModalDetailFields">		
    </div>
    <div class="form-group row mb-0" id="addProjectModalDetailButtons">
       <div class=" col-sm-12" style="border:0px solid green;" >
           <div class="btn-group pull-right">
                <button class="btn btn-dark" data-dismiss="modal">Anuluj</button>
                <button id="postDataSubmit" class="btn btn-info" >Edytuj</button>
           </div>
       </div>
     </div>
</form>
</div>
</div>
<!-- END PROJECT DETAIL TEMPLATE -->
<!-- LEGEND -->
<div class="modal fade mb-0 pb-0 col-sm-12" id="legendDiv" style="border:0px solid green;">
    <hr class="w-100"></hr>
        <small class="modal-title text-left text-secondary pl-1 pb-2" id="fieldModalLabel">Legenda:</small> 
            <ul class="text-secondary font-weight-normal small" style="list-style-type:square;">
                <li>A - litera alfabetu, C - cyfra</li>
                <li>Numer,temat i dokument:</li>
                    <ul style="list-style-type:disc;">
                        <li>może się zaczą A|C</li>
                        <li>może zawierać A,C,/,_,- i spacje</li>
                        <li>może się zakończyć .</li>
                    </ul>
                <li>Numer - max 20 znaków.</li>
                <li>Temat - max 100 znaków.</li>
                <li>Dokument - max 30 znaków</li>
            </ul>
</div>    
<!-- END LEGEND -->
<div id="div-inputPdf7a" style="display:block; border:0px solid black;"></div>
<script>
window.onload=getAjaxData('getProjectDefaultValues','','','','');
</script>