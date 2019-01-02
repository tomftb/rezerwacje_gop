<?php
if(!isset($_SESSION["permission"]) ||  $_SESSION["permission"]!=='yes')
{
?>
<script>window.location.replace(window.location.protocol+'//'+window.location.host+"/");</script>
<?php
};
?>

