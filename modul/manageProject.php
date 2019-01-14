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
    protected $idProject=null;
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
                ),
                "id_projekt"=>array
                (
                    "Musisz wskazać co najmniej jedną osobę do projektu",
                    "Pracownik jest już przypisany do projektu"
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
        //print_r($arrayOfWhere);
        //echo $valueToCheck;
        if(trim($valueToCheck)!='')
        {
            $this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)."<br/>";
            return(count($this->queryReturnValue()));
        }
        else
        {
            $this->err.="NO VALUE TO CHECK<br/>";
            return(0);
        };
    }
    private function explodeValue($valueToExplode,$delimiter)
    {
        return $arrayOfValue=explode($delimiter,$valueToExplode);
    }
    protected function getTeamValueToFind()
    {
        if(!$this->err)
        {
            $teamValueToFind=array(
                                    'team_czlonek_grupy_pers', 
                                    'team_czlonek_grupy_percent',
                                    'd-start_team_czlonek_grupy',
                                    'd-end_team_czlonek_grupy'
            );
            return($teamValueToFind);
        }
    }
    protected function checkAndAddignTeamValue($key,$value,&$teamValueToFind,&$persAttributes,&$allPers,&$counter,$teamValueToFindLength)
    {
        $found=strpos($key,$teamValueToFind);
        if($found!==null && trim($found)!=='')
        {    
            //echo 'str pos - '.$found."\n";
            $persAttributes[$counter]=$value;
            $counter++;
            if($counter===$teamValueToFindLength)
            {
                // LAST ELEMENT OF PERS
                array_push($allPers,$persAttributes);
                $counter=0;
            }
        }
    }
    protected function getTeam()
    {
        $teamValueToFind=$this->getTeamValueToFind();
        $teamValueToFindLength=count($teamValueToFind);
        $persAttributes=array();
        $allPers=array();
        $counter=0;
        if(!$this->err)
        {
            foreach($this->inpArray as $key =>$value)
            {
                //echo $key.' - '.$value.' - '.$teamValueToFind[$counter]."\n";
                if($key==='addTeamToProjectid')
                {
                    $this->idProject=$value;
                }
                $this->checkAndAddignTeamValue($key,$value,$teamValueToFind[$counter],$persAttributes,$allPers,$counter,$teamValueToFindLength);
            }
            //print_r($allPers);
            return($allPers);
        }
        return($allPers);
    }
    protected function addTeamToProject($valueToAdd)
    {
        /*
         * team[][0] - id
         * team[][1] - percent to setup
         * team[][2] - data start
         * team[][3] - data end
         */
        $this->parsePostData($valueToAdd);
        $team=$this->getTeam();
        $curretDateTime=date('Y-m-d H:i:s');
        if(!$this->err)
        {
            // CHECK EXIST $this->idProject
            foreach($team as $value)
            {
               $this->checkExistInDb('projekt_pracownik','id_projekt=? AND id_uzytkownik=? ',$this->idProject.','.$value[0]); 
            }
            if(!$this->err)
            {
                //echo 'NOT FOUND IN DB';
                foreach($team as $value)
                {
                   $this->query('INSERT INTO projekt_pracownik 
            (id_projekt,id_uzytkownik,imie,nazwisko,udzial_procent,dat_od,dat_do,mod_dat,mod_user_id,mod_user_name) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
        ,$this->idProject.','.$value[0].',novalue,novalue,'.$value[1].','.$value[2].','.$value[3].','.$curretDateTime.',1,'.$this->user);
                 
                }
                //$this->getError();
            }
        }
    }
    protected function checkValuesOfProject()
    {
        $valueToCheck=array(
            'numer_umowy',
            'temat_umowy'
        );
        foreach($valueToCheck as $value)
        {
            if(trim($this->inpArray[$value])==='')
            {
                $this->err.=$this->infoArray[$value][0]."<br/>";
            }
            else
            {
                if($this->checkExistInDb('projekt_nowy',$value.'=? AND wsk_u=? ',$this->inpArray[$value].",0")>0)
                {
                    $this->err.=$this->infoArray[$value][1]."<br/>";
                }
            }
        } 
    }
    protected function addNewProject($valueToAdd)
    {
        $this->parsePostData($valueToAdd);
        $this->checkValuesOfProject();
        
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
        "addteam"
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
        case "addteam":
            $this->setUser($_SESSION["username"]);
            $this->addTeamToProject($_POST);
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
            $this->getProjectPers('v_slo_czlonek_proj');
            break;
        case "getprojectsleader":
            $this->getProjectPers('v_slo_lider_proj');
            break;
        case "getprojectsmanager":
            $this->getProjectPers('v_slo_kier_proj');
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

