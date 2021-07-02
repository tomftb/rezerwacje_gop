<?php
class ManageEmployee
{
    private $inpArray=array();
    protected $responseType='POST';
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
    private $Log;
    private $dbLink;
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
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
            $this->response->setError(1,$this->utilities->getInfo());
        }
    }
    public function cEmployee()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        self::setInpArray();
        self::checkEmployeeValueLength();
        if($this->checkExistInDb('pracownik','imie=? AND nazwisko=?',$this->inpArray['Imie'].','.$this->inpArray['Nazwisko']))
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][1]."<br/>");
        }
        $this->addEmployee();
        $this->Log->log(0,"[".__METHOD__."] EMPLOYEE ID => ".$this->queryLastId());
        $this->setEmployeeSpec($this->queryLastId());           
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    public function eEmployeeOn()
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        self::setInpArray();
        self::checkEmployeeValueLength();
        $this->utilities->checkKeyExist('ID',$this->inpArray,$this->response->error);
        if($this->utilities->getStatus()===0)
        {
            if($this->checkExistInDb('pracownik','imie=? AND nazwisko=? AND id!=?',$this->inpArray['Imie'].','.$this->inpArray['Nazwisko'].','.$this->inpArray['ID']))
            {
                $this->response->setError(0,$this->infoArray['imie_nazwisko'][1]."<br/>");
            }
        }
        else
        {
            $this->response->setError(1,$this->utilities->getInfo());
        }
        $this->updateEmployee();
        $this->setEmployeeSpec($this->inpArray['ID']);

        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));          
    }
    protected function setEmployeeSpec($idEmployee)
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        if($this->response->getError()){ return ''; }
        // CHECK AVALIABLE DICTIONARY
        $specPost=self::getSpecTabId();
        $specDb=self::getSpec();
        $this->checkSpecInDb($specPost,$specDb);
        if($this->response->getError()){ return ''; }
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
    public function eEmployeeSpecOn()
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        self::setInpArray();
        // GET ID
        // $this->inpArray['idEmployee']
        $this->utilities->checkKeyExist('ID',$this->inpArray,$this->respone->error);
        if(!$this->utilities->getStatus()===0)
        {
            $this->response->setError(1,$this->utilities->getInfo());
        }
        self::setEmployeeSpec($this->inpArray['ID']);
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));          
    }
    protected function checkSpecInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        $this->Log->log(0,"[".__METHOD__."]");   
        foreach($t1 as $v)
        {
            //$this->logMultidimensional(0,$v,__LINE__."::".__METHOD__." t1");
            $this->Log->log(0,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2))
            {  
                $this->response->setError(1,"DICTIONARY ID => ".$v." NOT FOUND IN DB");
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
        $this->Log->log(0,"[".__METHOD__."]");   
        if($this->response->getError()){ return ''; }
        if(strlen($this->inpArray['Imie'])<3 || strlen($this->inpArray['Nazwisko'])<3)
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][0]."<br/>");
        }
        if(strlen($this->inpArray['Imie'])>30 || strlen($this->inpArray['Nazwisko'])>30)
        {
            $this->response->setError(0,$this->infoArray['imie_nazwisko'][2]."<br/>");
        }
    }
    protected function addEmployee()
    {
        if($this->response->getError()) { return '';}
        $this->query('INSERT INTO pracownik 
            (imie,nazwisko,stanowisko,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?)'
            ,$this->inpArray['Imie'].",".$this->inpArray['Nazwisko'].",".$this->inpArray['Stanowisko'].",".$_SESSION["username"].','.$_SESSION["userid"]);
    }
    protected function updateEmployee()
    {
        if($this->response->getError()) { return '';}
        $this->query('UPDATE pracownik SET imie=?, nazwisko=?, stanowisko=?, dat_mod=?, mod_user=?,mod_user_id=?,email=? WHERE id=?'
            ,$this->inpArray['Imie'].",".$this->inpArray['Nazwisko'].",".$this->inpArray['Stanowisko'].','.$this->cDT.",".$_SESSION["username"].','.$_SESSION["userid"].','.$this->inpArray['Email'].",".$this->inpArray['ID']);
    }
    protected function addEmployeeSpec($employeeId,$value)
    {
        // CHECK IS EXIST
        if(!$this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->Log->log(1,"[".__METHOD__."] SPEC SENDED IN POST AND NOT EXIST IN DB=> ADD"); 
            $this->query('INSERT INTO prac_i_slo_u_spec (id_prac,id_slo_u_spec) VALUES (?,?)',$employeeId.",".$value); 
        }
        else
        {
            $this->Log->log(1,"[".__METHOD__."] SPEC SENDED IN POST BUT ALREADY EXIST => NOTHING TO DO"); 
        }
    }
    protected function removeEmployeeSpec($employeeId,$value)
    {
        if($this->checkExistInDb('prac_i_slo_u_spec','id_prac=? AND id_slo_u_spec=?',$employeeId.','.$value))
        {
            // EXIST -> REMOVE
            $this->Log->log(1,"[".__METHOD__."] SPEC EXIST BUT NOT SENDED IN POST => REMOVE"); 
            $this->query('DELETE FROM prac_i_slo_u_spec WHERE id_prac=? AND id_slo_u_spec=?',$employeeId.",".$value); 
        }   
        else
        {
            $this->Log->log(1,"[".__METHOD__."] SPEC NOT SENDED IN POST AND NOT EXIST ID DB => NOTHING TO DO"); 
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
    # DELETED EMPLOYEE IN DB
    public function dEmployee()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=$this->utilities->getPost();
        if (array_key_exists("ID",$this->inpArray['data']))
        {
            //if(1>0)
            if(count(self::getEmplProj($this->inpArray['data']['ID']))>0)
            {
                $this->response->setError(0,'Employee can\'t be deleted. This employee appears in projects.');
            }
            else
            {
                $this->query('UPDATE `pracownik` SET `wsk_u`=? WHERE `id`=?',"1,".$this->inpArray['data']['ID']);
            }         
        }
        else
        {
            $this->response->setError(1,'KEY ID NOT EXIST IN FORM');
        }    
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    public function getEmployeesSpecSlo()
    {
        $this->utilities->setGetString('function',$this->inpArray);
        $this->utilities->jsonResponse(__METHOD__,$this->dbLink->squery('SELECT * FROM `v_slo_u_spec` ORDER BY `ID` ASC'),$this->inpArray['function']);
    }
    public function getEmployeesLike(){
        $this->Log->log(0,"[".__METHOD__."]");
        $f='%'.filter_input(INPUT_GET,'filter').'%';
        $this->Log->log(1,"[".__METHOD__."] filter => ".$f);
        $data=$this->dbLink->squery('SELECT * FROM `v_all_prac_v5` WHERE ID LIKE (:f) OR ImieNazwisko LIKE (:f) OR Stanowisko LIKE (:f) OR Procent LIKE (:f) OR Email LIKE (:f)ORDER BY ID asc',[':f'=>[$f,'STR']]); 
        echo json_encode($this->utilities->getResponse(__METHOD__,$data,'sEmployees','GET'));
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployeeProjects()
    {
        $data=array();        
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {
            $data[0]=$this->utilities->getData();
            $data[1]=self::getEmplProj($this->utilities->getData());
        }
        return($this->response->setResponse(__METHOD__,$data,'projects'));
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
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
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
        return($this->response->setResponse(__METHOD__,$data,'dEmployee'));
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
    private function employeeSpec($idEmployee)
    {
        $this->Log->log(0,"[".__METHOD__."] ID Employess => ".$idEmployee);
        // GET DICTIONARY
        $emplSpec=$this->query('SELECT * FROM `v_slo_u_spec` WHERE 1=? ORDER BY `ID` ASC ',1);
        // GET EMPLOYEE DICTIONARY 
        $emplSlo=$this->query('SELECT * FROM v_all_prac_spec WHERE idPracownik=? ORDER BY idSlownik ASC ',$idEmployee);
        // COMBINE
        return ($this->combineSloEmployeeSpec($emplSpec,$emplSlo));
    }
    public function getEmployeeSpec()
    {
        $data=array();
        if($this->utilities->checkInputGetValInt('id')===1)
        {
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {
            $data[0]=$this->query('SELECT * FROM v_all_prac_v4 WHERE ID=?',$this->utilities->getData())[0];   
            $data[1]=self::employeeSpec($this->utilities->getData());
        }
        return($this->response->setResponse(__METHOD__,$data,'eEmployeeSpec'));
    }
    protected function combineSloEmployeeSpec($slo,$empSol)
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
        $this->Log->log(0,"[".__METHOD__."]");
        $data=array();
        if($this->utilities->checkInputGetValInt('id')===1)
        {
            $this->response->setError(1,' KEY ID in $_GET IS EMPTY');
        }
        else
        {   
            $data[0]=$this->query('SELECT * FROM v_all_prac_v4 WHERE ID=?',$this->utilities->getData())[0];   
            $data[1]=self::employeeSpec($this->utilities->getData());
            $this->logMultidimensional(2,$data,__LINE__."::".__METHOD__." data");
            return($this->response->setResponse(__METHOD__,$data,'eEmployee'));
        }
    }
    function __destruct()
    {}
}