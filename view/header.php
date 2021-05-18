<!DOCTYPE html>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Rezerwacje GOP</title>
<?php require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/modul/mValidUrl.php"); $u=uniqid();?>
<!-- IKONKA GT -->
<link rel="apple-touch-icon" sizes="57x57" href="<?=$URL?>/gt_utilities/ico/apple-icon-57x57.png">
<link rel="apple-touch-icon" sizes="60x60" href="<?=$URL?>/gt_utilities/ico/apple-icon-60x60.png">
<link rel="apple-touch-icon" sizes="72x72" href="<?=$URL?>/gt_utilities/ico/apple-icon-72x72.png">
<link rel="apple-touch-icon" sizes="76x76" href="<?=$URL?>/gt_utilities/ico/apple-icon-76x76.png">
<link rel="apple-touch-icon" sizes="114x114" href="<?=$URL?>/gt_utilities/ico/apple-icon-114x114.png">
<link rel="apple-touch-icon" sizes="120x120" href="<?=$URL?>/gt_utilities/ico/apple-icon-120x120.png">
<link rel="apple-touch-icon" sizes="144x144" href="<?=$URL?>/gt_utilities/ico/apple-icon-144x144.png">
<link rel="apple-touch-icon" sizes="152x152" href="<?=$URL?>/gt_utilities/ico/apple-icon-152x152.png">
<link rel="apple-touch-icon" sizes="180x180" href="<?=$URL?>/gt_utilities/ico/apple-icon-180x180.png">
<link rel="icon" type="image/png" sizes="192x192" href="<?=$URL?>/gt_utilities/ico/android-icon-192x192.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?=$URL?>/gt_utilities/ico/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="96x96" href="<?=$URL?>/gt_utilities/ico/favicon-96x96.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?=$URL?>/gt_utilities/ico/favicon-16x16.png">
<link rel="manifest" href="<?=$URL?>/gt_utilities/ico/manifest.json">
<meta name="msapplication-TileColor" content="#ffffff">
<meta name="msapplication-TileImage" content="<?=$URL?>/gt_utilities/ico/ms-icon-144x144.png">
<meta name="theme-color" content="#ffffff">
<!-- KONIEC IKONKA GT -->
<!-- CSS -->
<link rel="stylesheet" href="<?=$URL?>/css/gt-admin.css?<?=$u?>" >
<link rel="stylesheet" href="<?=$URL?>/css/bootstrap.min.4.5.3.css" >
<link rel="stylesheet" href="<?=$URL?>/css/bootstrap-datepicker.min.css" >
<link rel="stylesheet" href="<?=$URL?>/css/font-awesome.min.4.7.0.css" >
<link rel="stylesheet" href="<?=$URL?>/css/bootstrap-datepicker3.css" >
<link rel="stylesheet" href="<?=$URL?>/css/header.css?<?=$u?>" >
<link rel="stylesheet" href="<?=$URL?>/js/jquery.validationEngine/validationEngine.jquery.css" type="text/css" />
<!-- <link rel="stylesheet" href="<?=$URL?>/css/all.css"> load all FONTAWESOME styles -->
<!-- END CSS -->
<!-- JS -->
<script type="text/javascript" src="<?=$URL?>/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/jquery.validationEngine/lang/languages_new/jquery.validationEngine-pl.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/jquery.validationEngine/jquery.validationEngine.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/jquery-ui-1.10.1.custom/jquery-ui-1.10.1.custom.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/popper.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/bootstrap-4.1.3.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/bootstrap-datepicker.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/bootstrap-datepicker.en-GB.min.js"></script>
<script type="text/javascript" src="<?=$URL?>/js/datepicker_pl.js"></script>
<!-- END JS -->
<script>
    window.loggedUserPerm = <?= json_encode($_SESSION['perm'])?>;
</script>
<style>
@font-face {
    font-family: CrimsonText-Regular;
    src: url(<?=$URL?>/font/Crimson_Text/CrimsonText-Regular.ttf);
}
@font-face {
    font-family: CrimsonText-Italic;
    src: url(<?php echo$URL; ?>/font/Crimson_Text/CrimsonText-Italic.ttf);
}
@font-face {
    font-family: CrimsonText-Bold;
    src: url(<?=$URL?>/font/Crimson_Text/CrimsonText-Bold.ttf);
}
@font-face {
    font-family: Rubik-Black;
    src: url(<?=$URL?>/font/Rubik/Rubik-Black.ttf);
}
@font-face {
    font-family: Rubik-Bold;
    src: url(<?=$URL?>/font/Rubik/Rubik-Bold.ttf);
}

</style>
</head>
