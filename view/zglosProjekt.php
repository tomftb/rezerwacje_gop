<?php 
require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php");
$optionWartosc=array("GB","TB"); ?>

<div class="mt-5"><center><p class="P_MAIN">
<?php //echo  $_GET["id"]." - ".$_SERVER['HTTP_HOST']."<br/>".$_SERVER['REQUEST_URI']."</br>";?>
	
GOP - zgłaszanie Projektu:</p>
<!-- <form method="POST" action=""> -->
<form action="" method="POST" id="addFormProject">
    <table style="width:1024px; border:0px solid red">
        <tr  style="border:0px solid black">
            <td class="width:100px;" rowspan="6" style="border:0px solid red">
                <img src="gt_utilities/gt_logo_przez_160x100.png" alt="Logo_Geofizyka_Torun"></br>
            </td>
            <td class="" style="border:0px solid blue"></td>
            <td class="w-50"style="border:0px solid green"></td>
        </tr>
        <tr style="border:0px solid black">
            <td style="border:0px solid blue">
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Nazwa projektu :</p>
            </td>
            <td style="border:0px solid green">
                <div class="container">
                    <div class="form-group row mb-0 " style="border:0px solid black" >
                        <div class="col pr-0 pl-0">
                            <input class="form-control w-100 border border-info  validate[required, maxSize[100]]" type="text" name="nazwaProjektu" id="nazwaProjektu" value=""/>
                        </div>
                    </div>
                    <div class="form-group row mb-1 mt-1" style="border:0px solid red" >
                        <div class="col-sm-auto">
                            <?php 
                            if(isset($_POST["nazwaProjektu"]) && $_POST["nazwaProjektu"]!=trim('') ) 
                            {
                                echo '<span style="margin-top:10px; color:#8c8c8c; font-size:16px; font-weight:bold;">Ostatnio zgłoszony projekt - '.$_POST["nazwaProjektu"].'</span>';
                            };
                            ?>
                        </div>
                    </div> 
                    <div class="form-group row mb-0" style="border:0px solid black" >
                        <!-- DIV WARNING -->
                        <div id="divErr">
                            <span class="S_LOAD_ERR" id="nowy_projekt_warn"></span><span id="nowy_projekt_name"></span>
                        </div>
                        <!-- END DIV WARNING -->
                    </div>
                </div>
            </td>
        </tr>
        <tr style="border:0px solid black">
            <td style="border:0px solid blue">
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Rozmiar pliku bazowego :</p>
            </td>
            <td style="border:0px solid green">
                <div class="container">
                    <div class="form-group row mb-0 " style="border:0px solid black" >
                        <div class="col-sm mr-0 pr-0 pl-0">
                            <input class="form-control border border-info  validate[custom[integer], required, maxSize[20]]" type="text" name="rozmiarPlik" id="rozmiarPlik" maxlength="20" value=""/>
                        </div>
                        <div class="col-sm-auto ml-0 pl-0 pr-0">
                            <select class="form-control border border-info" name="rozmiarJednostka"><!-- SEL_JED -->
                            <?php
                                if(isset($_POST['rozmiarJednostka']))
                                {					
                                    echo "<option value=\"".$_POST['rozmiarJednostka']."\">".$_POST['rozmiarJednostka']."</option>";
                                };
                            ?>
                            <!-- <optgroup label="Dostępne :" class="OPTGROUP"> -->
                            <?php 
                            foreach($optionWartosc as $jednostkaWybor)
                            {
                                if(!isset($_POST['rozmiarJednostka']) )
                                {
                                    echo "<option value=\"".$jednostkaWybor."\">".$jednostkaWybor."</option>";
                                }
                                else
                                {
                                    if($_POST['rozmiarJednostka']!=$jednostkaWybor)
                                    {
                                        echo "<option value=\"".$jednostkaWybor."\">".$jednostkaWybor."</option>";
                                    }
                                }
                            }
                            ?>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row mb-1 mt-1" style="border:0px solid black" >
                        <div class="col-sm-auto">
                        <?php
                        if(isset($_POST["rozmiarPlik"]) && $_POST["rozmiarPlik"]!=trim('') )
                        {		
                            echo '<span style="margin-top:10px;color:#8c8c8c; font-size:16px; font-weight:bold;">Rozmiar zgłaszanego projektu - '.$_POST["rozmiarPlik"].' '.$_POST['rozmiarJednostka'].'</span>';
                        };
                        ?>
                        </div>
                    </div>
                </div>
            </td>
        </tr>
        <tr style="border:0px solid black">
            
            <td style="border:0px solid blue">
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Lista przypisanych pracowników :</p>
            </td>
            <td style="border:0px solid green">
                <div class="container">
                    <div class="form-group row mb-1 mt-1" style="border:0px solid black" >
                        <div class="col-sm pr-0 pl-0">
                            <textarea name="przypisaniPracownicy" id="przypisaniPracownicy" class="form-control w-100 border border-info  validate[required, maxSize[1024]]"></textarea> <!-- validate[required, maxSize[1024]] -->
                        </div>
                    </div>
                    <div class="form-group row mb-1 mt-1" style="border:0px solid black" >
                        <div class="col-sm-auto">
                            <?php
                            if(isset($_POST["przypisaniPracownicy"]) && $_POST["przypisaniPracownicy"]!=trim('') )
                            {		
                                echo '<span style="margin-top:10px;color:#8c8c8c; font-size:16px; font-weight:bold;">Przypisani użytkownicy - '.$_POST["przypisaniPracownicy"].'</span>';
                            };
                            ?>
                        </div>
                    </div>
                    <!-- DIV WARNING -->
                    <div class="form-group row mb-1 mt-1" style="border:0px solid black" >
                        <div class="col-sm">
                            <div id="divErr2">
                                <span class="S_LOAD_ERR" id="przypisaniPracownicy_warn"></span><span id="przypisaniPracownicy_name"></span>
                            </div>
                        </div>
                    </div>
                    <!-- END DIV WARNING -->
                </div>
            </td>
        </tr>
        <tr style="border:0px solid black">
            <td colspan="2" style="border:0px solid blue">
                <input type="hidden" name="host" id="host" value="HTTP://<?php echo $_SERVER['HTTP_HOST']; ?>"></input>
                <input type="hidden" name="username" id="username" value="<?php echo $_SESSION['username']; ?>"/>
                <input class="btn btn-success w-100" type="Submit" value="Zgłoś" name="zglos">
            </td>
        </tr>
        <tr style="border:0px solid black">
            <td colspan="2" style="border:0px solid blue">
                <p class="P_LEGENDA">Legenda:
                </br><span class="S_LEGENDA">-</span> Pola z sumbolem (<span class="S_LEGENDA">*</span>) wymagane;
                <br/><span class="S_LEGENDA">-</span> Przykładowa nazwa projektu - <span class="S_LEGENDA">PGNIG_Test-Torun_3D_2018</span>;
                <br/><span class="S_LEGENDA">-</span> Nazwa projektu może się zaczynać i kończyć na - <span class="S_LEGENDA">' a-Z , 0-9 '</span>;
                <br/><span class="S_LEGENDA">-</span> Nazwa projektu może zawierać  - <span class="S_LEGENDA">' a-Z , 0-9 , _ , - '</span>;
                <br/><span class="S_LEGENDA">-</span> Rozmiar pliku bazowego - <span class="S_LEGENDA">wartość całkowitoliczbowa</span>;
                <br/><span class="S_LEGENDA">-</span> W polu zgłaszane osoby rozpoczynamy jak i kończymy wprowadzanie symbolem - <span class="S_LEGENDA">' a-Z '</span>;
                <br/><span class="S_LEGENDA">-</span> W polu zgłaszane osoby można użyć symboli - <span class="S_LEGENDA">' a-Z , 0-9 , @ , _ , - , . , , '</span>;
                <br/><span class="S_LEGENDA">-</span> Białe znaki w nazwie Projketu są automatycznie usuwane (<span class="S_LEGENDA">spacja, tabulacja</span>);
                </p>
            </td>
        </tr>
    </table>	
</form>
</center></div>