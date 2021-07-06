<?php
class ManageParameters 
{
    private $inpArray=array();
    protected $filter='';
    private $parmSkrt='';
    private $Log;
    private $dbLink;
    
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
    }
    public function getAllParm()
    {
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $sql=[
            ':f'=>[$f,'STR']
        ];
        $result=$this->dbLink->squery('SELECT `ID` as \'i\' ,`Skrót` as \'s\',`Nazwa` as \'n\',`Opis` as \'o\',`Wartość` as \'v\',`Typ` as \'t\',`ModDat` as \'md\',`ModUser` as \'mu\' FROM `v_parm_v2` WHERE ID LIKE (:f) OR Skrót LIKE (:f) OR Nazwa LIKE (:f) OR Opis LIKE (:f) OR Wartość LIKE (:f) ORDER BY ID asc'
                ,$sql);
        $this->utilities->jsonResponse(__METHOD__,$result,'showAll','GET');
    }
    public function updateParm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'id',true,1);
        $this->utilities->validateKey($this->inpArray,'value',true,1);
        $sql[':i']=[$this->inpArray['id'],'INT'];
        self::verifyParameterId($sql);
        // PARSE TAKE PARM SKROT
        self::getParmSkrt($sql);
        self::parseParm();
        self::update();
        //return(self::getAllParm());
        $v['i']=$this->inpArray['id'];
        $v['d']=date('Y-m-d H:i:s'); //2019-03-12 14:10:39
        $v['u']=$_SESSION['username'];
        $this->utilities->jsonResponse(__METHOD__,$v,'pUpdate','GET');
    }
    private function verifyParameterId($sql)
    {
        if(count($this->dbLink->squery("SELECT * FROM parametry WHERE ID=:i;",$sql))!=1){
            Throw New Exception ('Parameter with ID => '.$this->inpArray['id'].' not exist or is more than one',1);
        }
    }
    private function update()
    {
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $sql=[
                ':W'=>[$this->inpArray['value'],'STR'],
                ':MD'=>[CDT,'STR'],
                ':MU'=>[$_SESSION["username"],'STR'],
                ':MUI'=>[$_SESSION["userid"],'STR'],
                ':I'=>[$this->inpArray['id'],'INT']
            ];
            $this->dbLink->query('UPDATE parametry SET WARTOSC=:W,MOD_DAT=:MD,MOD_USER=:MU,MOD_USER_ID=:MUI WHERE ID=:I',$sql);
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception ("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1); 
        } 
    }
    public function getParmSkrt($sql)
    {
        $this->parmSkrt=$this->dbLink->squery('SELECT `SKROT` FROM parametry WHERE ID=:i',$sql)[0]['SKROT'];
        $this->Log->logMulti(0,$this->parmSkrt);
    }
    private function parseParm()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->parmSkrt="check".$this->parmSkrt;
        $this->Log->logMulti(0,$this->parmSkrt);
        $validators=array_filter(get_class_methods(__CLASS__),[$this,"getCheck"]);
        if(in_array($this->parmSkrt,$validators)){
            self::{$this->parmSkrt}();
            //call_user_func(self::$this->parmSkrt);
        }
    }
    private function getCheck($var){
         if(preg_match('/^(check)/', $var)){
            return $var;
        }
    }
    private function checkMAIL_PASS(){
        if(strlen($this->inpArray['value'])===0) { return false; }    
        $plchar='\ą\Ą\c\Ć\ę\Ę\ł\Ł\ó\Ó\ś\Ś\ż\Ż\ź\Ź\ń\Ń';
        if(!preg_match('/^[a-zA-Z\_\+\=\-\d'.$plchar.']{2,9}$/', $this->inpArray['value'])){
            Throw New Exception ("BŁĘDNE HASŁO",0); 
        }
    }
    private function checkMAIL_SRV(){
        $tmp=explode('.',$this->inpArray['value']);
        if(count($tmp)<3){
            Throw New Exception ("BŁĘDNY SERWER POCZTY",0); 
        }
        foreach($tmp as $part){
            if(!preg_match('/^[a-zA-Z\d][a-zA-Z\_\-\d]{0,48}[a-zA-Z\d]{0,1}$/', $part)){
                Throw New Exception ("BŁĘDNY SERWER POCZTY",0); 
            }
        }
    }
    private function checkMAIL_USER(){
        if (!filter_var($this->inpArray['value'], FILTER_VALIDATE_EMAIL)){
            Throw New Exception ("BŁĘDNY ADRES EMAIL",0); 
        }
    }
    private function checkMAIL_CHARSET(){
        if(!preg_match('/^[a-zA-Z][a-zA-Z\-\d]{2,9}$/', $this->inpArray['value'])){
            Throw New Exception ("BŁĘDNE KODOWANIE ZNAKÓW",0); 
        }
    }
    private function checkMAIL_PORT_OUT(){
        if(!preg_match('/^\d{2,5}$/', $this->inpArray['value'])){
            Throw New Exception ("BŁĘDNY PORT WYCHODZĄCY",0); 
        }
    }
    private function checkMAIL_RECIPIENT(){
        $err='';
        $tmp=explode(';',$this->inpArray['value']);
        //echo "\n";
        foreach($tmp as $lp => $email){
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)){
               $err.="[LP. ".$lp."] BŁĘDNY ADRES EMAIL<br/>";
            }
        }
        if($err){
            Throw New Exception ($err,0); 
        }
    }
    function __destruct(){}
}