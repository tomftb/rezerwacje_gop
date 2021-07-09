<?php if(!defined("APP_URL")){ die('Direct access not permitted');} ?>
<body onload="loadData();">
<div class="w-100" style="margin-top:-55px; position:fixed;  z-index:996;">
    
    <div class="row">
        <div class="col-4" >
            <div class="btn pull-left mt-0" > 
                <button id='createData' class="btn btn-info pull-left mr-0 mb-0 mt-0 ml-1"  data-toggle="modal" data-target="#AdaptedModal" onclick="create();">Dodaj użytkownika</button>
            </div> 
        </div>
        <div class="col-4" >
            <h2 class="text-center mb-3 mt-1 text-info">Użytkownicy :</h2>
        </div>
        <div class="col-4 " >
            <div class="row float-right mr-4">
                <div class="col-4 pr-0 mr-0">
                    <h5 class="mt-2 text-secondary" >Szukaj : </h5>
                </div>
                <div class="col-8 pl-0 ml-0 pr-0 mr-0">
                    <input class="ml-1 form-control mt-1" onchange="findData(this.value)"/>
                </div>
            </div>
        </div>
    </div>

</div>
<div class="w-100" style="margin-top:155px;">
    <div class="row mb-1">
        <div class="col-12 alert alert-danger  d-none mb-0" id="overAllErr">
        </div>
    </div>
    <div class="row">
        <div class="col-12 mr-3 ml-3">
            <div>
                <table class="table table-striped table-condensed">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Imię</th>
                      <th scope="col">Nazwisko</th>
                      <th scope="col">Login</th>
                      <th scope="col">Email</th>
                      <th scope="col">Typ</th>
                      <th scope="col">Rola</th>
                      <th scope="col">Opcje</th>
                    </tr>
                  </thead>
                  <tbody id="allUsersData">
                  </tbody>
                </table>
            </div>
        </div>
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
<div id="div-inputPdf7a" style="display:block;margin-bottom:50px;">
</div>
