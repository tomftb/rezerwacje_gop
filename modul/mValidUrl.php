<?php
$HTTP_HOST=filter_input(INPUT_SERVER,"HTTP_HOST");
$HTTP = (filter_input(INPUT_SERVER,"HTTPS") ? "HTTPS://" : "HTTP://"); 
$URL=$HTTP.$HTTP_HOST;
?>

