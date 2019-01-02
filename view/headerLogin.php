<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Rezerwacje GOP</title>
<?php
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php");
if(!function_exists('checkFile')) require_once('../function/checkFile.php');
if(checkFile($_SERVER["DOCUMENT_ROOT"].'/css/gt-admin.css')) echo '<link href="'.$URL.'/css/gt-admin.css" rel="stylesheet">';
?>
<!-- IKONKA GT -->
<link rel="apple-touch-icon" sizes="57x57" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo $URL; ?>/gt_utilities/ico/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192" href="<?php echo $URL; ?>/gt_utilities/ico/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo $URL; ?>/gt_utilities/ico/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="<?php echo $URL; ?>/gt_utilities/ico/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo $URL; ?>/gt_utilities/ico/favicon-16x16.png">
<link rel="manifest" href="<?php echo $URL; ?>/gt_utilities/ico/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="<?php echo $URL; ?>/gt_utilities/ico/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
<!-- KONIEC IKONKA GT -->
<!-- JS -->
<script src="<?php echo $URL; ?>/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="<?php echo $URL; ?>/js/jquery.validationEngine/lang/languages_new/jquery.validationEngine-pl.js"></script>
<script type="text/javascript" src="<?php echo $URL; ?>/js/jquery.validationEngine/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<?php echo $URL; ?>/js/jquery-ui-1.10.1.custom/jquery-ui-1.10.1.custom.min.js"></script>
<script src="<?php echo $URL; ?>/js/bootstrap-4.1.3.min.js"></script>
<SCRIPT type="text/javascript" src="<?php echo $URL; ?>/js/getResolution.js"></SCRIPT>
<!-- END JS -->
<!-- CSS -->
<link href="<?php echo $URL; ?>/js/jquery.validationEngine/validationEngine.jquery.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" href="<?php echo $URL; ?>/css/bootstrap.min.4.1.1.css" >
<link rel="stylesheet" href="<?php echo $URL; ?>/css/font-awesome.min.4.7.0.css" >
<link rel="stylesheet" href="<?php echo $URL; ?>/css/bootstrap-datepicker3.css" >
</head>
<body onload="getResolution()">