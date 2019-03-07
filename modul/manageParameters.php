<?php
session_start();
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageParameters extends initialDb
{
    protected $idRole=0;
    private $inpArray=array();
    protected $err="";
    protected $valueToReturn=null;
    protected $taskPerm= ['perm'=>'','type'=>''];
    protected $infoArray=array
            (
                "nazwa"=>array
                (
                    "Podana Nazwa jest za krótka",
                    "Podana Nazwa jest za długa",
                    "Istnieje już rola o podanej nazwie",
                ),
                "input"=>array
                (
                    "Bład parametru"
                )
            );
    function __construct()
    {
        parent::__construct();
    }
    private function getPostData($postData=array())
    {
        $tmpArray=array();
        foreach($postData as $key =>$value)
        {
            $value=trim($value);
            $this->inpArray[$key]=$value;
        }
    }
    public function getAllParm()
    {
        $valueToReturn=array();
        $this->query('SELECT ID,Skrót,Nazwa,Opis,Wartość,Typ FROM v_parm WHERE 1=? ORDER BY id asc',1);
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
    protected function getSpecField($field)
    {
        if (array_key_exists($field,$this->inpArray))
        {
            return $this->inpArray[$field];
        }
        else
        {
            $this->err.= '['.$field.']FORM KEY NOT EXIST';
            return (0);
        } 
    }
     protected function checkSpecField($field)
    {
        if (array_key_exists($field,$this->inpArray))
        {
            return (true);
        }
        else
        {
            return (false);
        } 
    }
    private function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
        if(trim($valueToCheck)!='')
        {
            $this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)."<br/>";
            return(count($this->queryReturnValue()));
        }
        else
        {
            $this->err.="DATA NOT EXIST IN DATABASE<br/>";
            return(0);
        }
    }
    protected function setParm($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $id=$this->getSpecField("id");
        $value=$this->getSpecField("value");
        $this->checkLength($id,'input');
        $this->checkExistInDb('parametry','ID=?',$id);
        // PARSE TAKE PARM SKROT
        $skrot=$this->getParmSkrt($id);
        
        $this->parseParm($skrot,$value);
        $this->updateParm($this->inpArray);
        
    }
    protected function updateParm($uData)
    {
        if($this->err) { exit(0);}
        //print_r($_SESSION);
        $this->query('UPDATE parametry SET WARTOSC=?,MOD_USER=?,MOD_USER_ID=? WHERE ID=?',$uData['value'].','.$_SESSION['username'].','.$_SESSION['userid'].','.$uData['id']);
    }
    public function getParmSkrt($id)
    {
        if($this->err) { exit(0);}
        
        $this->query('SELECT SKROT FROM parametry WHERE ID=?',$id);
        $skrot=$this->queryReturnValue();
        return($skrot[0]);
    }
    protected function checkLength($data,$type)
    {
        if(strlen($data)<1)
        {
            $this->err.=$this->infoArray[$type][0]."<br/>";
        }
    }
    protected function parseParm($skrot,$value)
    {
        //print_r($skrot);
        //echo "SKROT: ".$skrot['SKROT']."<br/>";
        switch($skrot['SKROT']):
            case 'MAIL_RECIPIENT':
                //echo "MAIL_RECIPIENT\n";
                $tmp=explode(';',$value);
                //echo "\n";
                foreach($tmp as $lp => $email)
                {
                    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
                    {
                        $this->err.="[LP. ".$lp."] BŁĘDNY ADRES EMAIL</br>";
                    }
                }
                break;
            case 'MAIL_PORT_OUT':
                if(!preg_match('/^\d{2,5}$/', $value, $matches))
                {
                    $this->err.="BŁĘDNY PORT WYCHODZĄCY</br>";
                }
                break;
            case 'MAIL_CHARSET':
                if(!preg_match('/^[a-zA-Z][a-zA-Z\-\d]{2,9}$/', $value, $matches))
                {
                    $this->err.="BŁĘDNE KODOWANIE ZNAKÓW</br>";
                }
                break;
            case 'MAIL_USER':
                if (!filter_var($value, FILTER_VALIDATE_EMAIL))
                {
                    $this->err.="BŁĘDNY ADRES EMAIL</br>";
                }
                break;
            case 'MAIL_SRV':
                $tmp=explode('.',$value);
                if(count($tmp)<3)
                {
                     $this->err.="BŁĘDNE SERWER POCZTY l </br>";
                }
                else
                {
                    foreach($tmp as $part)
                    {
                        if(!preg_match('/^[a-zA-Z\d][a-zA-Z\_\-\d]{0,48}[a-zA-Z\d]{0,1}$/', $part, $matches))
                        {
                            $this->err.="BŁĘDNY SERWER POCZTY</br>";
                            break;
                        }
                    }
                }
                break;
            case 'MAIL_PASS':
                if(strlen($value)>0)
                {
                    $plchar='\ą\Ą\c\Ć\ę\Ę\ł\Ł\ó\Ó\ś\Ś\ż\Ż\ź\Ź\ń\Ń';
                    if(!preg_match('/^[a-zA-Z\_\+\=\-\d'.$plchar.']{2,9}$/', $value, $matches))
                    {
                        $this->err.="BŁĘDNE HASŁO</br>";
                    }
                    echo "PARSE PASSWORD\n";
                }
                break;
            case 'MAIL_RECV':
            default:
                break;
        endswitch;
    }
    public function getReturnedValue()
    {
        echo json_encode($this->valueToReturn);
    }
    public function getErrValue()
    {
        if($this->err)
        {
            echo json_encode(array("1",$this->err));
        }
        else
        {
            echo json_encode(array("0",$this->valueToReturn));
        }
    }
    
    function __destruct()
    {}
}
class checkGetData extends manageParameters
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        array("getAllParm",'LOG_INTO_PARM','user'),
        array('setParm','EDIT_PARM','user')
    );
    function __construct()
    {
        parent::__construct();
        $this->addNewTypOfErr();
        $this->getUrlData();
        
        if($this->checkUrlTask())
        {
            // CHECK PERM
            $this->checkTask();
            if($this->taskPerm['type']==='user')
            {
                $this->checkLoggedUserPerm('LOG_INTO_APP');
                $this->checkLoggedUserPerm($this->taskPerm['name']);
            }
            if(!$this->err)
            {
                $this->runTask();
            }
        }
    }
    private function getUrlData()
    {
        foreach($_GET as $key=>$value)
        {
            $this->urlGetData[$key]=$value;
        }
    }
    private function addNewTypOfErr()
    {
        $this->infoArray['urlTask'][0]='[manageParameters]Wrong function to execute';
        $this->infoArray['urlTask'][1]='[manageParameters]Task not exists';
    }
    private function checkUrlTask()
    {
        if(array_key_exists($this->avaliableFunction["task"], $this->urlGetData))
        {
            return 1;
        }
        else
        {
            $this->err.= $this->infoArray['urlTask'][0];
            return 0;
        }
        return 0;
    }
   
    private function checkTask()
    {
        foreach($this->avaliableTask as $id =>$task)
        {
            if($task[0]==$this->urlGetData['task'])
            {
                $this->setTaskPerm($this->avaliableTask[$id][1],$this->avaliableTask[$id][2]);
                return 1;
            }
        }
        $this->err.= $this->infoArray['urlTask'][1];
        return 0;
    }
    private function setTaskPerm($permName='',$permType='')
    {
        $this->taskPerm['name']=$permName;
        $this->taskPerm['type']=$permType;
    }
    protected function checkLoggedUserPerm($perm)
    {
        if(!in_array($perm,$_SESSION['perm']))
        {
           $this->err.="[${perm}] Brak uprawnienia";
           return 0;
        }
        else
        {
            return 1;
        }
    }
    private function runTask()
    {
        switch($this->urlGetData['task']):  
        case "getAllParm" : // ENUM 0,1
            $this->getAllParm();
            break;
        case 'setParm':
            $this->setParm($_POST);
        default:
            //no task
            break;
        endswitch;
    }
    function __destruct()
    {
        $this->getErrValue();
    }
}
$manageEmployee=NEW checkGetData();