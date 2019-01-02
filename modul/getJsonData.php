<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");

// parse GET
// check session
// return data depend of get value

//echo "GET - ".$_GET["id"]."\n";

require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/.cfg/config.php");

function projekty($con)
{
    $con->query('SELECT * FROM projekt_nowy WHERE wsk_u=? ORDER BY id desc',0);
    $post_data=$con->queryReturnValue();
    echo json_encode($post_data);
}
function uzytkwonikLider($con)
{
    $con->query('SELECT * FROM projekt_nowy WHERE wsk_u=? ORDER BY id desc',0);
    $post_data=$con->queryReturnValue();
    echo json_encode($post_data);
}

function uzytkwonikCzlonek($con)
{
    $con->query('SELECT * FROM projekt_nowy WHERE wsk_u=? ORDER BY id desc',0);
    $post_data=$con->queryReturnValue();
    echo json_encode($post_data);
}

projekty($dbLink);