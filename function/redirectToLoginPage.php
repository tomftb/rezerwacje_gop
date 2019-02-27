<?php
//if(!isset($_SESSION["permission"]) ||  $_SESSION["permission"]!=='yes')
if(isset($_SESSION))
{
    //echo "SESSION EXISTS<br/>";
    if(isset($_SESSION['perm']))
    {
        //echo "SESSION PERM EXISTS<br/>";
        if(in_array('LOG_INTO_APP',$_SESSION['perm']))
        {
            //echo "SESSION LOG_INTO_APP EXISTS<br/>";
            //OK
        }
        else
        {
            echo '<div class="container" style="margin-top:100px;">';
            echo '<div class="alert alert-danger row">';
            echo "<span>[LOG_INTO_APP] BRAK DOSTĘPU</span>";
            echo '</div>';
            echo '</div>';
            die();
        }
    }
    else
    {
        redirect(); 
    }
}
else
{
    //echo "NO SESSION<br/>";
    redirect();
}
function redirect()
{
    echo "<script>window.location.replace(window.location.protocol+'//'+window.location.host);</script>";
}
//die();

