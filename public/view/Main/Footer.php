<?php if(!defined('APP_NAME')) { exit();} ?>
<footer class="sticky-footer fixed-bottom bg-dark">
    <div class="row">
        <div class="col-sm-5">
            <div class="text-left ml-2">
                <small class="text-white">Zalogowano - <?=$_SESSION["username"]?> <span class="text-info"><?php echo " (".$_SESSION["mail"].")"; ?></span></small>
            </div>
        </div>
  <div class="col-sm-2">
      <div class="text-center">
        <small class="text-white"><?=APP_NAME?></small>
    </div>
    </div>
    <div class="col-sm-5">
        <div class="text-right  mr-2">
            <small class="text-white"><?=APP_AUTHOR?></small>
        </div>
    </div> 
    </div>
</footer>