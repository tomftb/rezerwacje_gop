<?php 
require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php");
    
    $optionWartosc=array("GB","TB"); 
    $disabled='';
    $info='';
    $border='border-info';
    if(!checkPerm('LOG_INTO_ZGL_PROJ',$_SESSION['perm'],0))
    {
        $border='border-white';
        $disabled='disabled';
        $info='<small class="text-secondary">[LOG_INTO_ZGL_PROJ] BRAK UPRAWNIENIA</small>';
    }
?>
<div style="margin-top:100px;">
    <center>
        <h3>
        <?php //echo  $_GET["id"]." - ".$_SERVER['HTTP_HOST']."<br/>".$_SERVER['REQUEST_URI']."</br>";?>
	GOP - zgłaszanie Projektu:
        </h4>
<!-- <form method="POST" action=""> -->
<form action="" method="POST" id="addFormProject">
    <table style="width:1024px;">
        <tr>
            <td class="width:100px;" rowspan="7">
                <img src="gt_utilities/gt_logo_przez_160x100.png" alt="Logo_Geofizyka_Torun"></br>
            </td>
            <td></td>
            <td class="w-50"></td>
        </tr>
        <tr>
            <td>
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Nazwa projektu :</p>
            </td>
            <td>
                <div class="container">
                    <div class="form-group row mb-0 ">
                        <div class="col pr-0 pl-0">
                            <input class="form-control w-100 border <?php echo $border;?>  validate[required, maxSize[100]]" type="text" name="nazwaProjektu" id="nazwaProjektu" value="" <?php echo $disabled; ?>/>
                        </div>
                    </div>
                    <div class="form-group row mb-1 mt-1">
                        <div class="col-sm-auto">
                            <?php 
                            if(isset($_POST["nazwaProjektu"]) && $_POST["nazwaProjektu"]!=trim('') ) 
                            {
                                echo '<span style="margin-top:10px; color:#8c8c8c; font-size:16px; font-weight:bold;">Ostatnio zgłoszony projekt - '.$_POST["nazwaProjektu"].'</span>';
                            };
                            ?>
                        </div>
                    </div> 
                    <div class="form-group row mb-0">
                        <!-- DIV WARNING -->
                        <div id="divErr">
                            <span class="S_LOAD_ERR" id="nowy_projekt_warn"></span><span id="nowy_projekt_name"></span>
                        </div>
                        <!-- END DIV WARNING -->
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Rozmiar pliku bazowego :</p>
            </td>
            <td>
                <div class="container">
                    <div class="form-group row mb-0">
                        <div class="col-sm mr-0 pr-0 pl-0">
                            <input class="form-control border <?php echo $border;?>  validate[custom[integer], required, maxSize[20]]" type="text" name="rozmiarPlik" id="rozmiarPlik" maxlength="20" value="" <?php echo $disabled; ?>/>
                        </div>
                        <div class="col-sm-auto ml-0 pl-0 pr-0">
                            <select class="form-control border <?php echo $border;?>" name="rozmiarJednostka" <?php echo $disabled; ?>><!-- SEL_JED -->
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
        <tr>
            <td>
                <p class="p_inp_20"><span class="S_LEGENDA">*</span>Lista przypisanych pracowników :</p>
            </td>
            <td>
                <div class="container">
                    <div class="form-group row mb-1 mt-1">
                        <div class="col-sm pr-0 pl-0">
                            <textarea name="przypisaniPracownicy" id="przypisaniPracownicy" class="form-control w-100 border <?php echo $border;?>  validate[required, maxSize[1024]]" <?php echo $disabled; ?>></textarea> <!-- validate[required, maxSize[1024]] -->
                        </div>
                    </div>
                    <div class="form-group row mb-1 mt-1">
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
                    <div class="form-group row mb-1 mt-1">
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
        <tr>
            <td colspan="2">
                <input type="hidden" name="host" id="host" value="HTTP://<?php echo $_SERVER['HTTP_HOST']; ?>"></input>
                <input type="hidden" name="username" id="username" value="<?php echo $_SESSION['username']; ?>"/>
                <input class="btn btn-success w-100" type="Submit" value="Zgłoś" name="zglos" <?php echo $disabled; ?>>
            </td>
        </tr>
        <tr>
            <td colspan="2">
                <?php echo $info; ?>
            </td>
        </tr>
        <tr>
            <td colspan="2">
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