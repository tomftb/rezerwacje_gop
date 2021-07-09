<?php if(!defined("DR")){ die('Direct access not permitted'); } ?>
<center>    
    <div class="container mt-5 w-100">
        <div class="row">
            <div class="col-12 alert alert-danger mt-5 d-none" id="bookClusterDivErr">
            </div>
        </div>
        <div class="row" id="bookCluster">
            <div class="col-12">
                <div class="row justify-content-md-center">
                    <h2 class="text-center pt-5">Rezerwuj klaster :</h2>
                </div>
                <div class="row justify-content-md-center">
                    <table style="width:800px;" class="mb-5">
                    <tr>
                        <td style="width:300px;">
                            <h4 class="text-right mr-1">Wskaż zakres nodów :</h4>
                        </td>
                        <td>
                            <select class="form-control w-100 border border-info" name="nod0" id="bookClusterNod0">
                            </select>
                        </td>
                        <td>
                            <select class="form-control w-100 border border-info" name="nod1" id="bookClusterNod1">
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h4 class="text-right mr-1">Wskaż pracownie :</h4>
                        </td>
                        <td colspan="2" >
                            <select class="form-control w-100 border border-info" name="pracownia" id="bookClusterLab">
                            </select>
                        </td>
                    </tr>
                    <tr height="40px;">
                        <td>&nbsp;</td>
                        <td colspan="2"><button type="button w-100" class="btn btn-success" id="bookClusterBtn">Rezerwuj</button></td>
                    </tr>
                    <tr height="40px;">
                        <td>&nbsp;</td>
                        <td colspan="2" id="bookClusterInfo" class="bg-warning text-secondary rounded pl-3 d-none"></td>
                    </tr>
                    </table>
                </div>
                
            </div>
        </div>
    </div>
      </center>
<center>
    <table class="t_main" >	
	<thead>
            <tr>
                <th colspan="2">
                <h2 class="text-center pt-1">Aktualny przydział nodów:</h2>
                </th>
            </tr>
            <tr>
                <th class="th_main" width="200px">
                    <h5 class="text-center pt-1">Pracownia :</h5>
                </th>
                <th class="th_main" width="600px">
                    <h5 class="text-center pt-1">Przypisane nody :</h5>
                </th>
            </tr>
	</thead>
        <tbody id="clusterTableBody">
        </tbody>
	</table>
</center>