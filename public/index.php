<?php 
session_start();
define('DR',filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/..');
require(DR.'/.cfg/consts.php');
require(DR.'/.cfg/config.php');
require(DR."/function/autoLoader.php");
try{
    /* 
    * STATIC ABSTRACT FACTORY
    */
    PageManager::load(filter_input(INPUT_GET,"id", FILTER_VALIDATE_INT));
}
catch(Throwable $t){
    echo $t->getMessage()."<br/>";
    echo $t->getCode()."<br/>";
}
finally {
         
} 


