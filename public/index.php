<?php 
session_start();
define('DR',filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/..');
require(DR.'/.cfg/consts.php');
require(DR.'/.cfg/config.php');
require(DR."/function/autoLoader.php");
/* 
 * STATIC ABSTRACT FACTORY
 */
PageManager::load(filter_input(INPUT_GET,"id", FILTER_VALIDATE_INT));