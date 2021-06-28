<?php
class initialDb extends dbManage{
    public function __construct(){   
        /* GET DATABASE CONFIG FROM FILE .cfg/config.php */
        parent::__construct(dbParm['host'],dbParm['db'],dbParm['port'],dbParm['user'],dbParm['pass'],dbParm['logLvl'],dbParm['cipher']);
        parent::log(2,"[".__METHOD__."]");
    }
    function __destruct(){
        $this->log(2,"[".__METHOD__."]");
    }
}