<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageProject extends initialDb
{
    private $inpArray=array();
    private $user="";
    protected $err="";
    protected $valueToReturn=null;
    protected $infoArray=array
            (
                "numer_umowy"=>array
                (
                    "Nie podano numeru umowy",
                    "Istnieje już projekt o podanym numerze umowy"
                ),
                "temat_umowy"=>array
                (
                    "Nie podano tematu projektu",
                    "Istnieje już projekt o podanym temacie"
                )
            );
    
    function __construct()
    {
        parent::__construct();
    }
    
    private function parsePostData($postData)
    {
        $tmpArray=array();
        foreach($postData as $key =>$value)
        {
            $value=trim($value);
            $this->inpArray[$key]=$value;
            //echo $key." - ".$value."\n";
            if(substr($key, 0,2)==='d-')
            {
                if($value!=='')
                {
                    $tmpArray=explode('.',$value);
                    $this->inpArray[$key]=$tmpArray[2]."-".$tmpArray[1]."-".$tmpArray[0];
                    //echo $key." - ".$this->inpArray[$key];
                }
                else
                {
                   $this->inpArray[$key]='0000-00-00';
                };
           };
        }
    }
    public function setUser($user)
    {
        $this->user=$user;
    }
    private function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
        $arrayOfWhere=$this->explodeValue($whereCondition,'=');
        if($valueToCheck!='')
        {
            $this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)."<br/>";
            
            if(count($this->queryReturnValue()))
            {  
                $this->err.=$this->infoArray[$arrayOfWhere[0]][1]."<br/>";
            };
        }
        else
        {
            $this->err.=$this->infoArray[$arrayOfWhere[0]][0]."<br/>";
        };
    }
    private function explodeValue($valueToExplode,$delimiter)
    {
        return $arrayOfValue=explode($delimiter,$valueToExplode);
    }
    protected function addNewProject($valueToAdd)
    {
        $this->parsePostData($valueToAdd);
        $this->checkExistInDb('projekt_nowy','numer_umowy=? AND wsk_u=? ',$this->inpArray['numer_umowy'].",0");
        $this->checkExistInDb('projekt_nowy','temat_umowy=? AND wsk_u=? ',$this->inpArray['temat_umowy'].",0");
        
        if(!$this->err)
        {
            // EXPLODE FIELDS:
            $typ_umowy=explode('|',$this->inpArray['typ_umowy']);
            $kier_grupy=explode('|',$this->inpArray['kier_grupy']);
            $nadzor=explode('|',$this->inpArray['nadzor']);
            $curretDateTime=date('Y-m-d H:i:s');
            
                $this->query('INSERT INTO projekt_nowy 
            (create_user,create_date,typ_umowy,typ_umowy_alt,numer_umowy,temat_umowy,kier_grupy,kier_grupy_id,term_realizacji,harm_data,koniec_proj,nadzor,nadzor_id,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        ,$this->user.",${curretDateTime},".$typ_umowy[1].",".$typ_umowy[2].",".$this->inpArray['numer_umowy'].",".$this->inpArray['temat_umowy'].",".$kier_grupy[1].",".$kier_grupy[0].",".$this->inpArray['d-term_realizacji'].",".$this->inpArray['d-harm_data'].",".$this->inpArray['d-koniec_proj'].",".$nadzor[1].",".$nadzor[0].",".$this->user.",1");
                 
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->addNewProjectDok($this->queryLastId());  
            }    
        }     
    }
    protected function addNewProjectDok($id)
    {
        //echo __METHOD__."\n";
        $docCounter=1;
        if(!$this->err)
        {
            foreach($this->inpArray as $key => $value)
            {
                //echo $key." - ".$value."\n";
                if((strpos($key,'addDoc')!==false || strpos($key,'pdfExtra')!==false) && $value!=='') 
                {
                    // echo "FOUND\n";
                    $tmp=explode('|',$value);
                    if(!isset($tmp[1]))
                    {
                        $tmp[1]=$tmp[0];
                        $tmp[0]=$docCounter;
                    }
                    $this->query('INSERT INTO projekt_dok (id_projekt,nazwa,external_id,external_type) VALUES (?,?,?,?)',$id.",".$tmp[1].",".$tmp[0].",".$key);    
                    if($this->getError()!=='')
                    {
                        $this->err.=$this->getError()."<br/>";
                    }
                    $docCounter++;
                };
            }
        };
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllProjects()
    {
        $this->query('SELECT * FROM projekt_nowy WHERE wsk_u=? ORDER BY id desc',0);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL NOT DELETED PROJECTs Members,LEADERs,SLO and other FROM DB
    public function getProjectPers($tableToSelect)
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY ImieNazwisko ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
     # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getProjectSlo($tableToSelect)
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY ID ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # DELETED PROJECT IN DB
    function deleteProject($valueToDelete)
    {
        $this->parsePostData($valueToDelete);
        $this->query('UPDATE projekt_nowy SET wsk_u=? WHERE id=?',"1,".$this->inpArray['id']);
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
};
class checkGetData extends manageProject
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        "add",
        "edit",
        "del",
        "getprojects",
        "getprojectsmember",
        "getprojectsleader",
        "getprojectsmanager",
        "gettypeofagreement",
        "getadditionaldictdoc",
    );
    function __construct()
    {
        parent::__construct();
        $this->addNewTypOfErr();
        $this->getUrlData();
        if($this->checkUrlTask())
        {
            if($this->checkTask())
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
        $this->infoArray['urlTask'][0]='Wrong function to execute';
        $this->infoArray['urlTask'][1]='Task not exists';
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
        if (in_array($this->urlGetData['task'],$this->avaliableTask))
        {
            return 1;
        }
        else
        {
            $this->err.= $this->infoArray['urlTask'][1];
            return 0;
        }
        return 0;
    }
    private function runTask()
    {
        switch($this->urlGetData['task']):
        
        case "add" :
            $this->setUser($_SESSION["username"]);
            $this->addNewProject($_POST);
            break;
        case "edit":
            break;
        case "del":
            $this->deleteProject($_POST);
            break;
        case "getprojects":
            $this->getAllProjects();
            break;
        case "getprojectsmember":
            $this->getProjectPers('v_czlonek_proj');
            break;
        case "getprojectsleader":
            $this->getProjectPers('v_lider_proj');
            break;
        case "getprojectsmanager":
            $this->getProjectPers('v_kier_proj');
            break;
        case "gettypeofagreement":
            $this->getProjectSlo('v_slo_um_proj');
            break;
        case "getadditionaldictdoc":
            $this->getProjectSlo('v_slo_dok');
            break;
        default:
            //no task
            break;
        
        endswitch;
    }
    function __destruct()
    {}
}
$manageProject=NEW checkGetData();
$manageProject->getErrValue();

