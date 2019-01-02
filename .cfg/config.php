<?php
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/databaseManagement.php");

class initialDb extends dbManage
{
    private $dbParm=array
            (
                'host'=>'127.0.0.1',
                'db'=>'rezerwacjegop',
                'port'=>3306,
                'user'=>'rezerwacjegop',
                'pass'=>'5DPbvuNiRbyoUBTN',
                'logLvl'=>0
            );
    private $dbLink=""; // protected = visible from another class

    function __construct()
    {
        //echo "konstruktor";
        $this->dbLink=parent::__construct($this->dbParm['host'],$this->dbParm['db'],$this->dbParm['port'],$this->dbParm['user'],$this->dbParm['pass'],$this->dbParm['logLvl']);
    }		
    public function getDbLink()
    {
        return $this->dbLink;
    }
    function __destruct()
    {}
}
$dbLink=NEW initialDb();
$dbLink->getDbLink();	
?>
