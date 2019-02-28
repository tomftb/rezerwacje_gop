<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageProject extends initialDb
{
    private $inpArray=array();
    protected $err="";
    protected $valueToReturn=null;
    protected $idEmployee=null;
    private $taskPerm= ['perm'=>'','type'=>''];
    const maxPercentPersToProj=100;
    protected $infoArray=array
            (
                "imie_nazwisko"=>array
                (
                    "Podane Imię lub Nazwisko jest za krótkie",
                    "Istnieje już pracownik o podanym Imieniu i Nazwisku",
                    "Podane Imię lub Nazwisko jest za długie"
                ),
                "input"=>array
                (
                    "Nie uzupełniono pola.",
                    "Wprowadzona wartość jest za długa",
                    "Wprowadzona wartość jest za krótka"
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
            }
        }
    }
    protected function cEmployee($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkEmployeeValueLength($this->inpArray);
        if($this->checkExistInDb('pracownik','imie=? AND nazwisko=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko']))
        {
            $this->err.=$this->infoArray['imie_nazwisko'][1]."<br/>";
        }
        // CHECK AVALIABLE DICTIONARY
        $specArray=$this->returnSpecTabFromPost($this->inpArray);
        $this->checkExistSloSpec($specArray);
        if(!$this->err)
        {
            $this->addEmployee($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->editEmployeeSpec($specArray,$this->queryLastId());
            }    
        }
    }
    protected function editEmployee($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkEmployeeValueLength($this->inpArray);
        
        $this->getIdEmployee();
     
        if(!$this->err)
        {
            if($this->checkExistInDb('pracownik','imie=? AND nazwisko=? AND id!=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko'].','.$this->inpArray['idEmployee']))
            {
                $this->err.=$this->infoArray['imie_nazwisko'][1]."<br/>";
            }
        }
        // CHECK AVALIABLE DICTIONARY
        $specArray=$this->returnSpecTabFromPost($this->inpArray);
        $this->checkExistSloSpec($specArray);
        if(!$this->err)
        {
            $this->updateEmployee($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->editEmployeeSpec($specArray,$this->inpArray['idEmployee']);
            }    
        }
    }
    protected function editEmployeeSpec($specArray,$employeeId)
    {
        // print_r($specArray);
        if(!$this->err)
        {
            foreach($specArray as $value)
            {
                //echo $value[0].' - '.$value[1];
                if($value[2]>0)
                {
                    $this->addEmployeeSpec($employeeId,$value[0]);
                }
                else
                {
                    $this->removeEmployeeSpec($employeeId,$value[0]);
                }
            }
        }
    }
    protected function updateEmployeeSpec($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        // CHECK AVALIABLE DICTIONARY
        $specArray=$this->returnSpecTabFromPost($this->inpArray);
        $this->checkExistSloSpec($specArray);
        // GET ID
        $id=$this->getIdEmployee();
        
        if(!$this->err)
        {
            $this->editEmployeeSpec($specArray,$id);
        }
    }
    protected function getIdEmployee()
    {
        if (array_key_exists("idEmployee",$this->inpArray))
        {
            return $this->inpArray['idEmployee'];
        }
        else
        {
            $this->err.= '[idEmployee]FORM KEY NOT EXIST';
            return(0);
        } 
    }
    protected function checkExistSloSpec($specTab)
    {
       // CHECK SLO IS AVALIABLE
        foreach($specTab as $value)
        {
            if(!$this->checkExistInDb('v_slo_u_spec','ID=?',$value[0]))
            { 
                $value[1]=preg_replace('/_/', ' ', $value[1]);
                $this->err.="[".$value[1]."]DICTIONARY WAS DELETED<br/>";
            }
        }
    }
    protected function checkEmployeeValueLength($employeeData)
    {
        if(strlen($employeeData['imie'])<3 || strlen($employeeData['nazwisko'])<3)
        {
            $this->err.=$this->infoArray['imie_nazwisko'][0]."<br/>";
        }
        if(strlen($employeeData['imie'])>30 || strlen($employeeData['nazwisko'])>30)
        {
            $this->err.=$this->infoArray['imie_nazwisko'][2]."<br/>";
        }
    }
    protected function addEmployee($employeeData)
    {
        $this->query('INSERT INTO pracownik 
            (imie,nazwisko,stanowisko,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?)'
            ,$employeeData['imie'].",".$employeeData['nazwisko'].",".$employeeData['stanowisko'].",".$_SESSION["username"].','.$_SESSION["userid"]);
    }
    protected function updateEmployee($employeeData)
    {
        $curretDateTime=date('Y-m-d H:i:s');
        $this->query('UPDATE pracownik SET imie=?, nazwisko=?, stanowisko=?, dat_mod=?, mod_user=?,mod_user_id=? WHERE id=?'
            ,$employeeData['imie'].",".$employeeData['nazwisko'].",".$employeeData['stanowisko'].','.$curretDateTime.",".$_SESSION["username"].','.$_SESSION["userid"].','.$employeeData['idEmployee']);
    }
    protected function addEmployeeSpec($employeeId,$value)
    {
        //echo $employeeId.' - '.$value;
        // CHECK IS EXIST
        if(!$this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->query('INSERT INTO prac_i_slo_u_spec (id_prac,id_slo_u_spec) VALUES (?,?)',$employeeId.",".$value); 
        }
    }
    protected function removeEmployeeSpec($employeeId,$value)
    {
        if($this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // EXIST -> DELETE
            $this->query('DELETE FROM prac_i_slo_u_spec WHERE id_prac=? AND id_slo_u_spec=?',$employeeId.",".$value); 
        }   
    }
    protected function returnSpecTabFromPost($DATA)
    {
        $tmpArray=array();
        $tmpRec=array();
        $id='';
        $name='';
        foreach($DATA as $key => $value)
        {
            //echo $key." - ".$value."\n";
            //echo "STRPOS - ".strpos($key,'cbox')."\n";
            if(strpos($key,'cbox-')!==false) 
            {
                //echo "FOUND\n";
                $tmpData=explode('-',$key);
                //print_r($tmpData);
                // GET ID $tmpData[1]
                // GET NAME $tmpData[2]
                $id=explode(':',$tmpData[1]);
                $name=explode(':',$tmpData[2]);
                array_push($tmpRec,$id[1],$name[1],$value);
                array_push($tmpArray,$tmpRec);
            }
            $tmpRec=[];
        }
        
        //print_r($tmpArray);
        return $tmpArray;
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
            $this->err.="NO VALUE TO CHECK<br/>";
            return(0);
        }
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
    protected function isEmpty($key,$data)
    {
        if(trim($data)==='')
        {
            $this->err.="[".$key."]".$this->infoArray['input'][0]."<br/>";
        };
    }
    protected function getPersonData($id)
    {
        $this->query('SELECT * FROM uzytkownik WHERE id=?',$id);
        $personData=$this->queryReturnValue();
        if(count($personData)>0)
        {
            return($personData);
        }
        else
        {
            $this->err.="[${id}] NO DATA ABOUT PERSON IN DB!<br/>";
        };
    }
    # DELETED PROJECT IN DB
    protected function deleteEmployee($postData)
    {
        $this->getPostData($postData);
        if (array_key_exists("idEmployee",$this->inpArray))
        {
            $this->getEmployeeProjects($this->inpArray['idEmployee']);
            //print_r($this->valueToReturn);
            //echo (count($this->valueToReturn));
            
            if(count($this->valueToReturn)>0)
            {
                $this->valueToReturn='';
                $this->err.= 'Employee can\'t be deleted. This employee appears in projects.';
            }
            else
            {
                $this->query('UPDATE pracownik SET wsk_u=? WHERE id=?',"1,".$this->inpArray['idEmployee']);
            }
            
        }
        else
        {
            $this->err.= '[idEmployee]FORM KEY NOT EXIST';
        }    
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployees()
    {
        $valueToReturn=array();
        $this->query('SELECT * FROM v_all_prac WHERE 1=? ORDER BY id asc',1);
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployeeProjects($idEmployee)
    {
        $this->query('SELECT idProjekt,numerUmowy,tematUmowy,procentUdzial,datOd,datDo FROM v_proj_prac_v3 WHERE idPracownik=? ORDER BY idProjekt ASC',$idEmployee);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL NOT DELETED PROJECTs Members,LEADERs,SLO and other FROM DB
    public function getProjectPers($tableToSelect)
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY ImieNazwisko ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID')
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    public function getEmployeeAllocation($idEmployee)
    {
        // GET DICTIONARY
        $this->getSlo('v_slo_u_spec');
        // $this->valueToReturn act slo
        // GET EMPLOYEE DICTIONARY 
        $this->query('SELECT * FROM v_all_prac_spec WHERE idPracownik=? ORDER BY idSlownik ASC ',$idEmployee);
        $emplSlo=$this->queryReturnValue();

        // COMBINE
        $this->combineSloEmployeeAllocation($this->valueToReturn,$emplSlo);
    }
    protected function combineSloEmployeeAllocation($slo,$empSol)
    {
        foreach($slo as $id => $value)
        {
            foreach($empSol as $key => $valueEmpl)
            {
                if($value['ID']===$valueEmpl['idSlownik'])
                {
                    $slo[$id]['DEFAULT']='t';
                    unset($empSol[$key]);
                    break;
                }
            }
        }
        $this->valueToReturn=$slo;
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getEmployeeDetails($idEmployee)
    {
        // CHECK GET
	$valueToReturn=array();
	$this->query('SELECT * FROM v_all_prac_v2 WHERE ID=?',$idEmployee);   
        array_push($valueToReturn,$this->queryReturnValue());
        
	$this->getEmployeeAllocation($idEmployee);
        array_push($valueToReturn,$this->valueToReturn);
	$this->valueToReturn=$valueToReturn;
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
class checkGetData extends manageProject
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        array("getemployees",'LOG_INTO_PRAC','user'),
        array("getemployeesspecslo",'','user'),
        array("cEmployee",'','user'),
        array("getEmployeeProj",'SHOW_PROJ_EMPL','user'),
        array('deleteEmployee','DEL_EMPL','user'),
        array('getEmployeeAllocation','SHOW_ALLOC_EMPL','user'),
        array('employeeAllocation','EDIT_ALLOC_EMPL','user'),
        array('getEmployeeDetails','SHOW_EMPL','user'),
        array('editEmployee','EDIT_EMPL','user')
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
                $this->checkLoggedUserPerm($this->taskPerm['name']);
            }
            if(!$this->err)
            {
                $this->runTask();
            }
        }
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
    private function getUrlData()
    {
        foreach($_GET as $key=>$value)
        {
            $this->urlGetData[$key]=$value;
        }
    }
    private function addNewTypOfErr()
    {
        $this->infoArray['urlTask'][0]='[manageEmployee]Wrong function to execute';
        $this->infoArray['urlTask'][1]='[manageEmployee]Task not exists';
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
    private function runTask()
    {

        switch($this->urlGetData['task']):
        
        case "getemployees" :
            $this->getEmployees($_POST);
            break;
        case "getemployeesspecslo" :
            $this->getSlo('v_slo_u_spec');
            break;
        case "cEmployee":
            //print_r($_POST);
            $this->cEmployee($_POST);
            break;
        case 'editEmployee':
            $this->editEmployee($_POST);
            break;
        case 'getEmployeeProj':
            $this->idEmployee=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getEmployeeProjects($this->idEmployee);
            // v_udzial_count_projekt_prac
            break;
        case 'getEmployeeAllocation':
            $this->idEmployee=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getEmployeeAllocation($this->idEmployee);
            break;
        case 'deleteEmployee':
            $this->deleteEmployee($_POST);
        case 'employeeAllocation':
            $this->updateEmployeeSpec($_POST);
            break;
        case 'getEmployeeDetails':
            $this->idEmployee=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getEmployeeDetails($this->idEmployee);
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