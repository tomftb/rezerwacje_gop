<?php
function checkPerm($perm,$permArray,$stop=1)
{
    $DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
    if(!in_array($perm,$permArray))
    {
        echo '<div class="container" style="margin-top:100px;">';
        echo '<div class="alert alert-danger row">';
        echo "<span>[${perm}] BRAK DOSTĘPU</span>";
        echo '</div>';
        echo '</div>';
        if($stop)
        {
            if(checkFile($DOC_ROOT.'/view/footer.php')) {include ($DOC_ROOT.'/view/footer.php');}
            die(); 
        }
        else
        {
            return 0;
        }
    }
}