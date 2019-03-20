<?php
$HTTP_HOST=filter_input(INPUT_SERVER,"HTTP_HOST");
$HTTP = (filter_input(INPUT_SERVER,"HTTPS") ? "HTTPS://" : "HTTP://"); 
$PORT=filter_input(INPUT_SERVER,"SERVER_PORT");
$URL=$HTTP.$HTTP_HOST;
?>

