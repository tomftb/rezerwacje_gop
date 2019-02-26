<?php
//if(!isset($_SESSION["permission"]) ||  $_SESSION["permission"]!=='yes')
if(!isset($_SESSION["perm"]) && in_array('LOG_INTO_APP',$_SESSION['perm']))
{
?>
<script>window.location.replace(window.location.protocol+'//'+window.location.host+"/");</script>
<?php
};
?>

