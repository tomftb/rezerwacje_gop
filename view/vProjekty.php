<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<script type="text/javascript" src="<?php echo $URL;?>/js/projekty.js"></script>
<body>
<div class="w-100 " style="margin-top:-55px; border:0px solid red; position:fixed;">
    <div class="btn pull-left mt-0" > 
        <button class="btn btn-info pull-right mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#addProjectModal" onclick="setDefault()">Dodaj projekt</button>
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
<?php
    $inputFileds=array(
        array('s-umowa',"Do realizacji :",'typ_umowy'),
        array('t','Numer:','numer_umowy'),
        array('t','Temat:','temat_umowy'),
        array('s-prac','Do kierowania grupa powołuje:','kier_grupy'),
        array('d','Termin realizacji','term_realizacji'),
        array('d','Kierującego zobowiązuję do przedstawienia harmonogramu prac do dnia','harm_data'),
        array('d','Kierującego zobowiązuję do zakończenia prac i napisania raportu z realizacji zadania do dnia)','koniec_proj'),
        array('s-prac','Nadzór nad realizacją <span id="pdfTypUmowy">umowy</span> powierzam','nadzor'),
        array('l-dok','Wykaz powiązanych dokumentów :','','dokPowiazane')
        );
?>
<div class="modal fade " id="addProjectModal" tabindex="-1" role="dialog" aria-labelledby="addProjectModalContent" aria-hidden="true">
<div class="modal-dialog modal-lg mb-0" role="document" >
    <div class="modal-content mb-0">
      <div class="modal-header bg-info">
          <!-- <h2 class="modal-title" id="fieldModalLabel"><p class="text-center">Create PDF FILE FROM input from</p></h2>-->
      <h2 class="modal-title" id="fieldModalLabel"><span class="text-center text-white">POWOŁANIE GRUPY REALIZUJĄCEJ</span></h2> 
      <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close" onclick="setDefault()">
          <i class="fa fa-times" aria-hidden="true"></i>
        </button>
      </div>
        <div class="modal-body mb-0 pb-1 pt-1">
        <form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="createPdfForm">
    <?php
    foreach($inputFileds as $id => $value)
    {
       ?>
     <div class="form-group row mt-2 mb-1" style="border:0px solid blue;">
        <label for="inputPdf<?php echo $id; ?>" class="col-sm-8 control-label text-right font-weight-bold"><?php echo $value[1]; ?></label>
            <div class="col-sm-4" id="div-inputPdf<?php echo $id;?>">
                
                <?php
                // check data type
                $tmpSelect=array();
                $condition=explode('-',$value[0]);
                $onChange="";
                $lastIdExtraDoc=0;
                if($condition[0]==='t')
                {
                    echo '<input type="text" class="form-control" name="'.$value[2].'" id="'.$value[2].'" placeholder="Pole wymagane" onblur="parseValue(this,\''.$value[2].'\')"/>';
                     echo '<div class="text-left w-100 mb-0 mt-1">
                <div class="alert alert-danger mb-0" id="errDiv-'.$value[2].'" style="display: none;">
                <span id="errText-'.$value[2].'"></span>
            </div>  
            </div>';
                }
                else if($condition[0]==='d')
                {
                    echo '<div class="input-group date" data-provide="datepicker"">
                        <input type="text" class="form-control" name="d-'.$value[2].'" id="d-'.$value[2].'" placeholder="DD.MM.YYYY">
                        <div class="input-group-addon input-group-append">
                            <div class="input-group-append ">
                                <span class="input-group-text" id="basic-addon2"><i class="fa fa-calendar" aria-hidden="true"></i></span>
                            </div>
                        </div>
                    </div>';
                }
                else
                {
                };
                ?>       
        </div>
     </div>
    <?php
     };
     ?>
            <div class="form-group row mt-0" style="border:0px solid red;">
                <div class="col-sm-12" id="additionalDoc">
                    
                </div>
            </div>
       <div class="form-group row mt-0" style="border:0px solid red;">
            <label for="inputPdf<?php echo $id; ?>" class="col-sm-8 control-label text-right font-weight-bold ">Dodatkowe dokumenty:</label>
            <div class="col-sm-4" id="extraFormDoc">
                <div id="writeroot" ></div>
                <div class="entry input-group " >
                    <button class="btn btn-success btn-add" type="button" onclick="addFormField()">
                                    <i class="fa fa-plus" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
            <div class="col-sm-4" id="extraFormDocButton">
                
                </div>
       </div> 
    <div class="form-group row mb-0" >
       <div class=" col-sm-12" >
         <button  id="postData" class="btn btn-info pull-right" onclick="postDataToUrl('createPdfForm')">Utwórz</button>
       </div>
     </div>
    </form>
    </div>
        <div class="modal-footer w-100 mt-0 mb-0 pb-0 pl-0 pr-0" style="border:0px solid red">
            <div class=" w-100 mb-0" style="border:0px solid black">
                <div class="mb-1 " style="border:0px solid orange">
                    <hr class="mt-1 mb-1"></hr>
                        <small class="modal-title text-left text-secondary pl-1 pb-2" id="fieldModalLabel">Legenda: </small> 
                        <ul class="text-secondary font-weight-normal small" style="list-style-type:square;">
                            <li>A - litera alfabetu, C - cyfra</li>
                            <li>Numer,Temat,Dodatkowe dokumenty:</li>
                                <ul style="list-style-type:disc;">
                                <li>może się zaczą A|C</li>
                                <li>może zawierać A,C,/,_,- i spacje</li>
                                <li>może się zakończyć .</li>
                                </ul>
                            <li>Numer - max 20 znaków.</li>
                            <li>Temat - max 100 znaków.</li>
                            <li>Dodatkowe dokumenty - max 50 znaków</li>
                        </ul>
                </div>
                <div class="alert alert-danger mb-0" id="errDiv-overall" style="display: none; border:0px solid green">
                    <span id="errText-overall"></span>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>
<!-- ADAPTED MODAL PROJECT -->
<div class="modal fade " id="ProjectAdaptedModal" tabindex="-1" role="dialog" aria-labelledby="ProjectAdaptedModalContent" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" id="ProjectAdaptedBgTitle">
            <h2 class="modal-title" id="fieldModalLabel"><span class="text-white" id="ProjectAdaptedTextTitle">USUWANIE PROJEKTU:</span></h2> 
                <button type="button" class="close mr-0" data-dismiss="modal" aria-label="Close">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="modal-body mb-0 pb-1 pt-1" id="ProjectAdaptedBodyContent">
                <div class="form-group row" style="border:0px solid green" id="ProjectAdaptedBodyContentTitle">
                    <div class=" col-sm-12 mt-4" >
                        <h5 class="modal-title text-center" id="fieldModalLabel"><span id="projectTitle"></span></h5> 
                        
                    </div>
                </div>
                <div class="form-group row" >
                    <div class="col-sm-12"  id="ProjectAdaptedDynamicData">
                    </div>
                </div>
                <div class="form-group row" >
                    <div class=" col-sm-12" id="ProjectAdaptedButtonsBottom">
                        
                    </div>
                </div>
            </div>
            <div class="modal-footer w-100 mt-0" >
                <div class="text-left w-100">
                    <div class=" row" style="border:0px solid black">
                        <small class="modal-title text-left ml-1 text-secondary" id="fieldModalLabel">Project id: <span id="projectId"></span></small> 
                        <small class="modal-title text-left ml-1 text-secondary" id="fieldModalLabel2"><span id="projectId2"></span></small> 
                    </div>
                    <div class="alert alert-danger row" id="errDiv-Adapted-overall" style="display: none;" style="border:0px solid red">
                        <span id="errText-Adapted-overall"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>   
<!-- END ADAPTED MODAL PROJECT -->
<div id="readroot" style="display: none">
        <div class="input-group" name="pdfExtra">
            <input type="text" class="entry form-control" id="inputPdfDok" placeholder="" name="inputPdfDok" onblur="parseValue(this,'inputPdfDok')"/>            
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
<div class="modal fade" tabindex="-1" role="dialog" class="modal-content mb-0" id="addProjectModalDetail" aria-hidden="true">
<div class="modal-body mb-0 pb-1 pt-1">
<form class="form-horizontal"  autocomplete="off" method="POST"  ENCTYPE="multipart/form-data" action="javascript:void(0);" name="createPdfForm">
    <div class="form-group row mt-2 mb-1" id="addProjectModalDetailFields">		
    </div>
    <div class="form-group row mb-0" id="addProjectModalDetailButtons">
       <div class=" col-sm-12" >
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
<div id="div-inputPdf7a" style="display:block; border:0px solid black;"></div>
<script>
window.onload=setDefault();
</script>