<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<body>
<div class="w-100 " style="margin-top:100px;position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-4" >
        </div>
        <div class=" col-sm-4" >
            <h2 class="text-center mb-3 mt-1 text-dark">Administrator :</h2>
        </div>
        <div class=" col-sm-4" >
            <div class="row float-right mr-4">
            </div>
        </div>
    </div>
    <div class="row">
        <div class=" col-sm-12" >
            <div class="text-center mt-3" > 
            <a href="<?php echo $FURL."?id=6"; ?>" class="btn btn-outline-dark btn-lg " role="button" aria-pressed="true">Użytkwonicy</a>
            <a href="<?php echo $FURL."?id=7"; ?>" class="btn btn-outline-dark btn-lg ml-3" role="button" aria-pressed="true">Uprawnienia</a>
            <a href="<?php echo $FURL."?id=8"; ?>" class="btn btn-outline-dark btn-lg ml-3" role="button" aria-pressed="true">Role</a>
            <a href="<?php echo $FURL."?id=10"; ?>" class="btn btn-outline-dark btn-lg ml-3" role="button" aria-pressed="true">Parametry</a>
            </div> 
        </div>
    </div>
</div>