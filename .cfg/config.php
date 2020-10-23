<?php
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/class/dbManage.php");
class initialDb extends dbManage
{
    private $dbParm=array
            (
                'host'=>'127.0.0.1',
                'db'=>'rezerwacjegop',
                'port'=>3306,
                'user'=>'rezerwacjegop',
                'pass'=>'NURQYnZ1TmlSYnlvVUJUTg==',
                'logLvl'=>0,
                'cipher'=>'y'
            );
    private $dbLink="";
    function __construct()
    {   
        $this->dbLink=parent::__construct($this->dbParm['host'],$this->dbParm['db'],$this->dbParm['port'],$this->dbParm['user'],$this->dbParm['pass'],$this->dbParm['logLvl'],$this->dbParm['cipher']);
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
//$dbLink=NEW initialDb();
//$dbLink->getDbLink();