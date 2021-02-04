<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php"); ?>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");?>
<body>
<div class="w-100 " style="margin-top:-55px;position:fixed; z-index:996;">
    <div class="row">
        <div class=" col-sm-4" >
        </div>
        <div class=" col-sm-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Uprawnienia :</h2>
        </div>
        <div class=" col-sm-4" >
            <div class="row float-right mr-4">
                <div class="sm-col-8">
                    <h5 class="mt-2 text-secondary" >Szukaj : </h5>
                </div>
                <div class="sm-col-4">
                    <input class="ml-1 form-control mt-1" onchange="findData(this.value)"/>
                </div>
            </div>
        </div>
    </div>
</div>
