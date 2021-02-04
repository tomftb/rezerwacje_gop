<?php
class initialDb extends dbManage
{
    private $dbLink="";
    function __construct()
    {   
        /* GET DATABASE CONFIG FROM FILE .cfg/config.php */
        
        $this->dbLink=parent::__construct(dbParm['host'],dbParm['db'],dbParm['port'],dbParm['user'],dbParm['pass'],dbParm['logLvl'],dbParm['cipher']);
        $this->log(2,"[".__METHOD__."]");
    }		
    public function getDbLink()
    {
        $this->log(0,"[".__METHOD__."]");
        return $this->dbLink;
    }
    function __destruct()
    {
        $this->log(2,"[".__METHOD__."]");
    }
}