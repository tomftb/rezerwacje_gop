<!DOCTYPE html>
<?php if(!defined('APP_URL')){exit;} ?>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title><?=APP_TITLE?></title>
<!-- CSS -->
<link rel="stylesheet" href="<?=APP_URL?>/css/gt-admin.css" >
<link rel="stylesheet" href="<?=APP_URL?>/css/bootstrap.min.4.5.3.css" >
<link rel="stylesheet" href="<?=APP_URL?>/css/bootstrap-datepicker.min.css" >
<link rel="stylesheet" href="<?=APP_URL?>/css/font-awesome.min.4.7.0.css" >
<link rel="stylesheet" href="<?=APP_URL?>/css/bootstrap-datepicker3.css" >
<link rel="stylesheet" href="<?=APP_URL?>/css/header.css" >
<!-- END CSS -->
<!-- JS -->
<script type="text/javascript" src="<?=APP_URL?>/js/jquery-3.3.1.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/jquery-ui-1.10.1.custom/jquery-ui-1.10.1.custom.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/popper.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/bootstrap-4.1.3.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/bootstrap-datepicker.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/bootstrap-datepicker.en-GB.min.js"></script>
<script type="text/javascript" src="<?=APP_URL?>/js/datepicker_pl.js"></script>
<!-- END JS -->
<script>
    window.loggedUserPerm = <?= json_encode($_SESSION['perm'])?>;
</script>
<style>
@font-face {
    font-family: CrimsonText-Regular;
    src: url(<?=APP_URL?>/font/Crimson_Text/CrimsonText-Regular.ttf);
}
@font-face {
    font-family: CrimsonText-Italic;
    src: url(<?=APP_URL?>/font/Crimson_Text/CrimsonText-Italic.ttf);
}
@font-face {
    font-family: CrimsonText-Bold;
    src: url(<?=APP_URL?>/font/Crimson_Text/CrimsonText-Bold.ttf);
}
@font-face {
    font-family: Rubik-Black;
    src: url(<?=APP_URL?>/font/Rubik/Rubik-Black.ttf);
}
@font-face {
    font-family: Rubik-Bold;
    src: url(<?=APP_URL?>/font/Rubik/Rubik-Bold.ttf);
}

</style>
</head>
