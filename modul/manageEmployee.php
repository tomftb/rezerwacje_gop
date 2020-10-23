<?php
//session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageEmployee extends initialDb
{
    private $inpArray=array();
    protected $err="";
    protected $idEmployee=null;
    protected $filter='';
    protected $taskPerm= ['perm'=>'','type'=>''];
    const maxPercentPersToProj=100;
    private $response;
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
        require_once($this->DR."/class/utilities.php");
        require_once($this->DR."/class/response.php");
        $this->utilities=NEW utilities();
        $this->response=NEW Response('Employee');
    }
    private function setInpArray()
    {
        $this->utilities->getPost();
        if($this->utilities->getStatus()===0)
        {
            $this->inpArray=$this->utilities->getData();
        }
        else
        {
            $this->setError(1,$this->utilities->getInfo());
        }
    }
    public function cEmployee()
    {
        $this->log(0,"[".__METHOD__."]");
        self::setInpArray();
        self::checkEmployeeValueLength();
        if($this->checkExistInDb('pracownik','imie=? AND nazwisko=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko']))
        {
            $this->setError(0,$this->infoArray['imie_nazwisko'][1]."<br/>");
        }
        $this->addEmployee($this->inpArray);
        $this->log(0,"[".__METHOD__."] EMPLOYEE ID => ".$this->queryLastId());
        $this->setEmployeeSpec($this->queryLastId());           
        $this->response->setResponse(__METHOD__,'ok','cEmployee','POST');
    }
    public function editEmployee()
    {
        $this->log(0,"[".__METHOD__."]");   
        self::setInpArray();
        self::checkEmployeeValueLength();
        $this->utilities->checkKeyExist('idEmployee',$this->inpArray);
        if($this->utilities->getStatus()===0)
        {
            if($this->checkExistInDb('pracownik','imie=? AND nazwisko=? AND id!=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko'].','.$this->inpArray['idEmployee']))
            {
                $this->setError(0,$this->infoArray['imie_nazwisko'][1]."<br/>");
            }
        }
        else
        {
            $this->setError(1,$this->utilities->getInfo());
        }
        $this->updateEmployee($this->inpArray);
        $this->setEmployeeSpec($this->inpArray['idEmployee']);

        $this->response->setResponse(__METHOD__,'ok','cModal','POST');          
    }
    protected function setEmployeeSpec($idEmployee)
    {
        $this->log(0,"[".__METHOD__."]");   
        if($this->getError()){ return ''; }
        // CHECK AVALIABLE DICTIONARY
        $specPost=self::getSpecTabId();
        $specDb=self::getSpec();
        $this->checkSpecInDb($specPost,$specDb);
        if($this->getError()){ return ''; }
        self::setSpec($specDb,$specPost,$idEmployee);
    }
    private function setSpec($t1,$t2,$idEmployee)
    {
        /*
         * SET SLO
         * t1 => DATABASE
         * t2 => POST
         */
        foreach($t1 as $v)
        {
            if(in_array($v,$t2))
            {
                $this->addEmployeeSpec($idEmployee,$v);
            }
            else
            {
                $this->removeEmployeeSpec($idEmployee,$v);
            }
        } 
    }
    public function uEmployeeSpec()
    {
        $this->log(0,"[".__METHOD__."]");   
        self::setInpArray();
        // GET ID
        // $this->inpArray['idEmployee']
        $this->utilities->checkKeyExist('idEmployee',$this->inpArray);
        if(!$this->utilities->getStatus()===0)
        {
            $this->setError(1,$this->utilities->getInfo());
        }
        self::setEmployeeSpec($this->inpArray['idEmployee']);
        $this->setError(0,'TEST STOP');
        $this->response->setResponse(__METHOD__,'ok','cModal','POST');          
    }
    protected function checkSpecInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        $this->log(0,"[".__METHOD__."]");   
        foreach($t1 as $v)
        {
            //$this->logMultidimensional(0,$v,__LINE__."::".__METHOD__." t1");
            $this->log(0,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2))
            {  
                $this->setError(1,"DICTIONARY ID => ".$v." NOT FOUND IN DB");
                break;
            }         
        }
    }
    private function getSpec()
    {
        $db=array();
        foreach($this->query('SELECT `ID` FROM `v_slo_u_spec` WHERE `ID`>?',0) as $v)
        {
            array_push($db,$v['ID']);
        }
        $this->logMultidimensional(2,$db,__LINE__."::".__METHOD__." db");
        return ($db);
        //return ($this->query('SELECT `ID`,`NAZWA` FROM `v_slo_u_spec` WHERE `ID`>?',0));
    }
    protected function checkEmployeeValueLength()
    {
        $this->log(0,"[".__METHOD__."]");   
        if($this->getError()){ return ''; }
        if(strlen($this->inpArray['imie'])<3 || strlen($this->inpArray['nazwisko'])<3)
        {
            $this->setError(0,$this->infoArray['imie_nazwisko'][0]."<br/>");
        }
        if(strlen($this->inpArray['imie'])>30 || strlen($this->inpArray['nazwisko'])>30)
        {
            $this->setError(0,$this->infoArray['imie_nazwisko'][2]."<br/>");
        }
    }
    protected function addEmployee($employeeData)
    {
        if($this->getError()) { return '';}
        $this->query('INSERT INTO pracownik 
            (imie,nazwisko,stanowisko,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?)'
            ,$employeeData['imie'].",".$employeeData['nazwisko'].",".$employeeData['stanowisko'].",".$_SESSION["username"].','.$_SESSION["userid"]);
    }
    protected function updateEmployee($employeeData)
    {
        if($this->getError()) { return '';}
        $curretDateTime=date('Y-m-d H:i:s');
        $this->query('UPDATE pracownik SET imie=?, nazwisko=?, stanowisko=?, dat_mod=?, mod_user=?,mod_user_id=?,email=? WHERE id=?'
            ,$employeeData['imie'].",".$employeeData['nazwisko'].",".$employeeData['stanowisko'].','.$curretDateTime.",".$_SESSION["username"].','.$_SESSION["userid"].','.$employeeData['email'].",".$employeeData['idEmployee']);
    }
    protected function addEmployeeSpec($employeeId,$value)
    {
        // CHECK IS EXIST
        if(!$this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->log(1,"[".__METHOD__."] SPEC SENDED IN POST AND NOT EXIST IN DB=> ADD"); 
            $this->query('INSERT INTO prac_i_slo_u_spec (id_prac,id_slo_u_spec) VALUES (?,?)',$employeeId.",".$value); 
        }
        else
        {
            $this->log(1,"[".__METHOD__."] SPEC SENDED IN POST BUT ALREADY EXIST => NOTHING TO DO"); 
        }
    }
    protected function removeEmployeeSpec($employeeId,$value)
    {
        if($this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // EXIST -> REMOVE
            $this->log(1,"[".__METHOD__."] SPEC EXIST BUT NOT SENDED IN POST => REMOVE"); 
            $this->query('DELETE FROM prac_i_slo_u_spec WHERE id_prac=? AND id_slo_u_spec=?',$employeeId.",".$value); 
        }   
        else
        {
            $this->log(1,"[".__METHOD__."] SPEC NOT SENDED IN POST AND NOT EXIST ID DB => NOTHING TO DO"); 
        }
    }
    protected function getSpecTab()
    {
        $tmpArray=array();
        $id='';
        $name='';
        $i=0;
        foreach($this->inpArray as $key => $value)
        {
            if(strpos($key,'cbox-')!==false) 
            {
                $tmpData=explode('-',$key);
                $id=explode(':',$tmpData[1]);
                $name=explode(':',$tmpData[2]);
                $tmpArray[$i]['ID']=$id[1];
                $tmpArray[$i]['NAZWA']=$name[1];
                $tmpArray[$i]['CHECK']=$value;
                $i++;
            }
        }
        return $tmpArray;
    }
    protected function getSpecTabId()
    {
        $tmpArray=array();
        $id='';
        foreach($this->inpArray as $key => $value)
        {
            if(strpos($key,'cbox-')!==false) 
            {
                $tmpData=explode('-',$key);
                $id=explode(':',$tmpData[1]);
                array_push($tmpArray,$id[1]);
            }
        }
        $this->logMultidimensional(2,$tmpArray,__LINE__."::".__METHOD__." specPost");
        return $tmpArray;
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
        }
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
        }
    }
    # DELETED EMPLOYEE IN DB
    public function dEmployee()
    {
        $this->log(0,"[".__METHOD__."]");
        $this->inpArray=$this->utilities->getPost();
        if (array_key_exists("idEmployee",$this->inpArray['data']))
        {
            //if(1>0)
            if(count(self::getEmplProj($this->inpArray['data']['idEmployee']))>0)
            {
                $this->setError(0,'Employee can\'t be deleted. This employee appears in projects.');
            }
            else
            {
                $this->query('UPDATE `pracownik` SET `wsk_u`=? WHERE `id`=?',"1,".$this->inpArray['data']['idEmployee']);
            }         
        }
        else
        {
            $this->setError(1,'KEY idEmployee NOT EXIST IN FORM');
        }    
        $this->response->setResponse(__METHOD__,'ok','dEmployee','POST');
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployees()
    {
        $this->response->setResponse(__METHOD__,$this->query('SELECT * FROM `v_all_prac_v5` WHERE 1=? ORDER BY id asc',1),'sEmployees');
    }
    public function getEmployeesSpecSlo()
    {
        $f=$this->utilities->checkInputGetValSanitizeString('function');
        if($f['status']!==0)
        {
            $this->setError(1,$f['info']);
        }
        $this->response->setResponse(__METHOD__,$this->query('SELECT * FROM `v_slo_u_spec` WHERE 1=? ORDER BY `ID` ASC ',1),$f['data']);
    }
    public function getEmployeesLike()
    {
        $this->log(0,"[".__METHOD__."]");
        if($this->utilities->checkInputGetValSanitizeString('filter')['status']===1)
        {
            $this->setError(1,' KEY filter in $_GET IS EMPTY');
        }
        else
        {
            $f='%'.$this->utilities->getData().'%';
            $this->log(1,"[".__METHOD__."] filter => ".$f);
            $this->query('SELECT * FROM v_all_prac_v5 WHERE ID LIKE (?) OR ImieNazwisko LIKE (?) OR Stanowisko LIKE (?) OR Procent LIKE (?) OR Email LIKE (?)ORDER BY ID asc'
                ,$f.",".$f.",".$f.",".$f.",".$f); 
        }
        $this->logMultidimensional(2,$this->queryReturnValue(),__LINE__."::".__METHOD__." data");
        $this->response->setResponse(__METHOD__,$this->queryReturnValue(),'sEmployees');
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployeeProjects()
    {
        $data=array();        
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {
            $data[0]=$this->utilities->getData();
            $data[1]=self::getEmplProj($this->utilities->getData());
        }
        $this->response->setResponse(__METHOD__,$data,'projects');
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB FOR DELETING EMPLOYY
    public function getDeletedEmployeeProjects()
    {
        $this->logMultidimensional(2,$_GET,__LINE__."::".__METHOD__." _GET");
        $this->logMultidimensional(2,$_POST,__LINE__."::".__METHOD__." _POST");
        $this->logMultidimensional(2,$_SESSION,__LINE__."::".__METHOD__." _SESSION");
        $data=array();
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else if($this->utilities->checkInputGetValInt('id')['status']===0 && !(in_array('SHOW_PROJ_EMPL', $_SESSION['perm'])))
        {
            
            $data[1]=$this->query('SELECT \'NoPERM\' FROM v_proj_prac_v4 WHERE ID_Pracownik=? ORDER BY ID_Projekt ASC',$this->utilities->getData());
            $this->response['info']='NO PERMISSION TO SEE EMPLOYEE PROJECTS';
        }
        else
        {
            $data[0]=$this->utilities->getData();
            $data[1]=$this->query('SELECT ID_Projekt,Numer_umowy,Temat_umowy,Procent_udziału,Data_od,Data_do FROM v_proj_prac_v4 WHERE ID_Pracownik=? ORDER BY ID_Projekt ASC',$this->utilities->getData());  
        }
        $this->response->setResponse(__METHOD__,$data,'dEmployee');
    }
    private function getEmplProj($id)
    {
        return ($this->query('SELECT ID_Projekt,Numer_umowy,Temat_umowy,Procent_udziału,Data_od,Data_do FROM v_proj_prac_v4 WHERE ID_Pracownik=? ORDER BY ID_Projekt ASC',$id));
    }
    # RETURN ALL NOT DELETED PROJECTs Members,LEADERs,SLO and other FROM DB
    public function getProjectPers($tableToSelect)
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY ImieNazwisko ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }

    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    private function employeeAllocation($idEmployee)
    {
        $this->log(0,"[".__METHOD__."] ID Employess => ".$idEmployee);
        // GET DICTIONARY
        $emplSpec=$this->query('SELECT * FROM `v_slo_u_spec` WHERE 1=? ORDER BY `ID` ASC ',1);
        // GET EMPLOYEE DICTIONARY 
        $emplSlo=$this->query('SELECT * FROM v_all_prac_spec WHERE idPracownik=? ORDER BY idSlownik ASC ',$idEmployee);
        // COMBINE
        return ($this->combineSloEmployeeAllocation($emplSpec,$emplSlo));
    }
    public function getEmployeeAllocation()
    {
        $data=array();
        if($this->utilities->checkInputGetValInt('id')===1)
        {
            $this->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {
            $data[0]=$this->query('SELECT * FROM v_all_prac_v4 WHERE ID=?',$this->utilities->getData())[0];   
            $data[1]=self::employeeAllocation($this->utilities->getData());
        }
        $this->response->setResponse(__METHOD__,$data,'allocation');
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
        return $slo;
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getEmployeeDetails()
    {
        $this->log(0,"[".__METHOD__."]");
        $data=array();
        if($this->utilities->checkInputGetValInt('id')===1)
        {
            $this->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {   
            $data[0]=$this->query('SELECT * FROM v_all_prac_v4 WHERE ID=?',$this->utilities->getData());   
            $data[1]=self::employeeAllocation($this->utilities->getData());
            $this->logMultidimensional(2,$data,__LINE__."::".__METHOD__." data");
            $this->response->setResponse(__METHOD__,$data,'details');
        }
    }
    public function returnData()
    {
        $this->log(0,"[".__METHOD__."]");
        if($this->getError())
        {
            $this->log(0,"[".__METHOD__."] ERROR EXIST");
            $this->response->setErrResponse(1,$this->getError(),__METHOD__,'','details');
            return ($this->response->getResponse());
        }
        $this->log(0,"[".__METHOD__."] NO ERROR");
        return ($this->response->getResponse());
    }
    function __destruct()
    {}
}