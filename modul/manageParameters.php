<?php
class manageParameters extends initialDb
{
    private $inpArray=array();
    protected $filter='';
    protected $valueToReturn=null;
    protected $taskPerm= ['perm'=>'','type'=>''];
    private $parmSkrt='';
    
    function __construct()
    {
        parent::__construct();
        $this->log(0,"[".__METHOD__."]");
        $this->utilities=NEW utilities();
        $this->response=NEW Response('Parameters');
    }
    public function getAllParm()
    {
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->log(0,"[".__METHOD__."] filter => ".$f);
        $this->query('SELECT `ID` as \'i\' ,`Skrót` as \'s\',`Nazwa` as \'n\',`Opis` as \'o\',`Wartość` as \'v\',`Typ` as \'t\',`ModDat` as \'md\',`ModUser` as \'mu\' FROM `v_parm_v2` WHERE ID LIKE (?) OR Skrót LIKE (?) OR Nazwa LIKE (?) OR Opis LIKE (?) OR Wartość LIKE (?) ORDER BY ID asc'
                ,$f.",".$f.",".$f.",".$f.",".$f);
        return($this->response->setResponse(__METHOD__,$this->queryReturnValue(),'','GET'));
    }
    public function updateParm()
    {
        $this->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->checkKeyExist('id',$this->inpArray,$this->response->error);
        $this->utilities->checkKeyExist('value',$this->inpArray,$this->response->error);
        self::checkParameterId();
        // PARSE TAKE PARM SKROT
        self::getParmSkrt();
        self::parseParm();
        self::update();
        //return(self::getAllParm());
        $v['i']=$this->inpArray['id'];
        $v['d']=date('Y-m-d H:i:s'); //2019-03-12 14:10:39
        $v['u']=$_SESSION['username'];
        return($this->response->setResponse(__METHOD__,$v,'pUpdate','GET'));
    }
    private function checkParameterId()
    {
        if($this->response->getError()!=='') { return false;}
        if(!$this->checkExistInDb('parametry','ID=?',$this->inpArray['id']))
        {
            $this->response->setError(1, "ERROR");
        }
    }
    private function update()
    {
        if($this->response->getError()) { return '';}
        $this->query('UPDATE parametry SET WARTOSC=?,MOD_DAT=?,MOD_USER=?,MOD_USER_ID=? WHERE ID=?',$this->inpArray['value'].','.$this->cDT.','.$_SESSION['username'].','.$_SESSION['userid'].','.$this->inpArray['id']);
    }
    public function getParmSkrt()
    {
        if($this->response->getError()) { return '';}
        $this->parmSkrt=$this->query('SELECT `SKROT` FROM parametry WHERE ID=?',$this->inpArray['id'])[0]['SKROT'];
        
        $this->logMulti(0,$this->parmSkrt);
    }
    private function parseParm()
    {
        $this->log(0,"[".__METHOD__."]");
        $this->logMulti(0,$this->parmSkrt);
        //print_r($skrot);
        //echo "SKROT: ".$skrot['SKROT']."<br/>";
        switch($this->parmSkrt):
            case 'MAIL_RECIPIENT':
                //echo "MAIL_RECIPIENT\n";
                $tmp=explode(';',$this->inpArray['value']);
                //echo "\n";
                foreach($tmp as $lp => $email)
                {
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
                    {
                        $this->response->setError(0,"[LP. ".$lp."] BŁĘDNY ADRES EMAIL");
                        //$this->err.="[LP. ".$lp."] BŁĘDNY ADRES EMAIL</br>";
                    }
                }
                break;
            case 'MAIL_PORT_OUT':
                if(!preg_match('/^\d{2,5}$/', $this->inpArray['value'], $matches))
                {
                    $this->response->setError(0,"BŁĘDNY PORT WYCHODZĄCY");
                    //$this->err.="BŁĘDNY PORT WYCHODZĄCY</br>";
                }
                break;
            case 'MAIL_CHARSET':
                if(!preg_match('/^[a-zA-Z][a-zA-Z\-\d]{2,9}$/', $this->inpArray['value'], $matches))
                {
                    $this->response->setError(0,"BŁĘDNE KODOWANIE ZNAKÓW");
                    //$this->err.="BŁĘDNE KODOWANIE ZNAKÓW</br>";
                }
                break;
            case 'MAIL_USER':
                if (!filter_var($this->inpArray['value'], FILTER_VALIDATE_EMAIL))
                {
                    $this->response->setError(0,"BŁĘDNY ADRES EMAIL");
                    //$this->err.="BŁĘDNY ADRES EMAIL</br>";
                }
                break;
            case 'MAIL_SRV':
                $tmp=explode('.',$this->inpArray['value']);
                if(count($tmp)<3)
                {
                    $this->response->setError(0,"BŁĘDNY SERWER POCZTY");
                    //$this->err.="BŁĘDNE SERWER POCZTY l </br>";
                }
                else
                {
                    foreach($tmp as $part)
                    {
                        if(!preg_match('/^[a-zA-Z\d][a-zA-Z\_\-\d]{0,48}[a-zA-Z\d]{0,1}$/', $part, $matches))
                        {
                            $this->response->setError(0,"BŁĘDNY SERWER POCZTY");
                            //$this->err.="BŁĘDNY SERWER POCZTY</br>";
                            break;
                        }
                    }
                }
                break;
            case 'MAIL_PASS':
                if(strlen($this->inpArray['value'])>0)
                {
                    $plchar='\ą\Ą\c\Ć\ę\Ę\ł\Ł\ó\Ó\ś\Ś\ż\Ż\ź\Ź\ń\Ń';
                    if(!preg_match('/^[a-zA-Z\_\+\=\-\d'.$plchar.']{2,9}$/', $this->inpArray['value'], $matches))
                    {
                        $this->response->setError(0,"BŁĘDNE HASŁO");
                        //$this->err.="BŁĘDNE HASŁO</br>";
                    }
                    //echo "PARSE PASSWORD\n";
                }
                break;
            case 'MAIL_RECV':
            default:
                break;
        endswitch;
    }
    function __destruct()
    {}
}