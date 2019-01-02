<footer class="sticky-footer fixed-bottom bg-dark">
    <div class="row">
        <div class="col-sm-3">
            <div class="text-left ml-2">
                <small class="text-white">Zalogowano - <?php echo $_SESSION["username"];?> <span class="text-info"><?php echo " (".$_SESSION["mail"].")"; ?></span></small>
            </div>
        </div>
  <div class="col-sm-6">
      <div class="text-center">
        <small class="text-white">GT: Rezerwacje GOP</small>
    </div>
    </div>
    <div class="col-sm-3">
        <div class="text-right  mr-2">
            <small class="text-white">Autor: Tomasz Borczyński</small>
        </div>
    </div> 
    </div>
</footer>
</body>
</html>