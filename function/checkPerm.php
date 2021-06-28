<?php
function checkPerm($perm,$permArray,$stop=1)
{
    if(!in_array($perm,$permArray))
    {
        parseStop($perm,$stop);
    }
    else
    {
        return 1;
    }
}
function parseStop($perm,$stop)
{
    if($stop)
    {
        showErr($perm);
        die(); 
    }
    else
    {
        //echo '<div class="container" style="margin-top:100px;"></div>';
        return 0;
    }
}
function showErr($perm)
{
    $DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
    echo '<div class="container" style="margin-top:100px;">';
    echo '<div class="alert alert-danger row">';
    echo "<span>[${perm}] BRAK UPRAWNIENIA</span>";
    echo '</div>';
    echo '</div>'; 
    if(checkFile($DOC_ROOT.'/view/footer.php')) {include ($DOC_ROOT.'/view/footer.php');}
}
