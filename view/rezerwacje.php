<?php require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php");   ?>
<?php
    if(checkPerm('EDIT_KLAST',$_SESSION['perm'],0))
    {
?>
<div class="mt-5 w-100">
    <center>               
        <h2 class="text-center pt-5">Rezerwacje klastra :</h2>
	<form method="POST" action="">
    	<table style="width:800px;" class="mb-5">
            <tr>
                <td style="width:300px;">
                    <h4 class="text-right mr-1">Wskaż zakres nodów :</h4>
                </td>
                <?php
                $optionWartosc=array();  
                for($i=0;$i<2;$i++)
                {
                    echo '<td>';
                    echo "<select class=\"form-control w-100 border border-info\" name=\"nod".$i."\">"; //class=\"SEL_NOD\"
                    if(ISSET($_POST['nod'.$i]))
                    {
                        echo "<optgroup label=\"Aktualny :\" class=\"OPTGROUP\">";
                        $optionWartosc=explode('|',$_POST['nod'.$i]);
                        echo "<option value=\"".$optionWartosc[0]."|".$optionWartosc[1]."\">".$optionWartosc[1]."</option>";
                    }
                    echo "<optgroup label=\"Dostępne :\" class=\"OPTGROUP\">";	
                    echo $optionKlaster;
                    echo "</select>";
                    echo '</td>';
                }
                ?>
            </tr>
            <tr>
                <td>
                    <h4 class="text-right mr-1">Wskaż pracownie :</h4>
                </td>
                <td colspan="2">
                    <select class="form-control w-100 border border-info" name="pracownia"> <!-- class="SEL_PRAC" -->
                    <?php
                    if(ISSET($_POST['pracownia']))
                    {
                        echo "<optgroup label=\"Aktualny :\" class=\"OPTGROUP\">";
                        $optionWartosc=explode('|',$_POST['pracownia']);
                        echo "<option value=\"".$optionWartosc[0]."|".$optionWartosc[1]."\">".$optionWartosc[1]."</option>";
                    }
                    ?>
                    <optgroup label="Dostępne :" class="OPTGROUP">
                    <?php echo $optionPrac; ?>
                    </select>
                </td>
            </tr>
            <tr height="40px;">
                <td>&nbsp;</td>
                <td colspan="2"><input  class="btn btn-success w-100"  type="Submit" value="Rezerwuj" name="rezerwuj"></td>
                <!-- class="inp_szukaj"-->
            </tr>
    </table>
    </form>
    </center>
</div>
<?php
}
