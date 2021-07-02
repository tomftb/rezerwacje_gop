<?php
class ManageEmployee
{
    private $inpArray=array();
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
    public function cEmployee()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::checkEmployeeValueLength();
        self::employeeExist();
        self::addEmployee();     
        $this->utilities->jsonResponse(__METHOD__,'ok','cModal');
    }
    private function employeeExist(){
        $this->Log->log(0,"[".__METHOD__."]");  
        $sql=[
            ':imie'=>[$this->inpArray['Imie'],'STR'],
            ':nazwisko'=>[$this->inpArray['Nazwisko'],'STR'],
            ];
        if (count($this->dbLink->squery('SELECT * FROM `pracownik` WHERE imie=:imie AND `nazwisko`=:nazwisko AND wsk_u=0',$sql))>0){
            Throw New Exception("Istnieje już pracownik o podanym imieniu i nazwisku",0);
        }
    }
    private function employeeExistId(){
        $this->Log->log(0,"[".__METHOD__."]");  
        $sql=[
            ':imie'=>[$this->inpArray['Imie'],'STR'],
            ':nazwisko'=>[$this->inpArray['Nazwisko'],'STR'],
            ':id'=>[$this->inpArray['ID'],'INT'],
            ];
        if (count($this->dbLink->squery('SELECT * FROM `pracownik` WHERE imie=:imie AND `nazwisko`=:nazwisko AND wsk_u=0 AND id!=:id',$sql))>0){
            Throw New Exception("Istnieje już pracownik o podanym imieniu i nazwisku",0);
        }
    }
    public function eEmployeeOn()
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->keyExist($this->inpArray,'ID');
        $this->utilities->isEmptyKeyValue($this->inpArray,'ID',true,0);
        self::checkEmployeeValueLength();
        self::employeeExistId();
        self::updateEmployee();

        $this->utilities->jsonResponse(__METHOD__,'ok','cModal');          
    }
    protected function setEmployeeSpec($idEmployee)
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        // CHECK AVALIABLE DICTIONARY
        $specPost=self::getSpecTabId();
        $specDb=self::getSpec();
        $this->checkSpecInDb($specPost,$specDb);
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
            $sql=[
              'idp'=>[$idEmployee,'INT'],
              'ids'=>[$v,'INT']
            ];
            if(in_array($v,$t2)){
                SELF::addEmployeeSpec($sql);
            }
            else{
                self::removeEmployeeSpec($sql);
            }
        } 
    }
    public function eEmployeeSpecOn()
    {
        $this->Log->log(0,"[".__METHOD__."]");   
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'ID',true,1);
        self::setEmployeeSpec($this->inpArray['ID']);
        $this->utilities->jsonResponse(__METHOD__,'ok','cModal','POST');          
    }
    protected function checkSpecInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        $this->Log->log(0,"[".__METHOD__."]");   
        foreach($t1 as $v){
            $this->Log->log(0,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2)){  
                Throw New Exception ("DICTIONARY ID => ".$v." NOT FOUND IN DB",1);
            }         
        }
    }
    private function getSpec()
    {
        $db=array();
        $this->dbLink->query('SELECT `ID` FROM `v_slo_u_spec`');
        foreach($this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC) as $v)
        {
            array_push($db,$v['ID']);
        }
        $this->Log->logMulti(2,$db,__LINE__."::".__METHOD__." db");
        return ($db);
    }
    protected function checkEmployeeValueLength()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $err='';
        if(strlen($this->inpArray['Imie'])<3 || strlen($this->inpArray['Nazwisko'])<3){
            $err.=$this->infoArray['imie_nazwisko'][0]."<br/>";
        }
        if(strlen($this->inpArray['Imie'])>30 || strlen($this->inpArray['Nazwisko'])>30){
             $err.=$this->infoArray['imie_nazwisko'][2]."<br/>";
        }
        if($err){
            Throw New Exception($err,0);
        }
    }
    protected function addEmployee()
    {
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $sql=[
                ':imie'=>[$this->inpArray['Imie'],'STR'],
                ':nazwisko'=>[$this->inpArray['Nazwisko'],'STR'],
                ':stanowisko'=>[$this->inpArray['Stanowisko'],'STR'],
                ':mod_user'=>[$_SESSION["username"],'STR'],
                ':mod_user_id'=>[$_SESSION["userid"],'STR']
            ];
            $this->dbLink->query('INSERT INTO `pracownik` (imie,nazwisko,stanowisko,mod_user,mod_user_id) 
		VALUES
		(:imie,:nazwisko,:stanowisko,:mod_user,:mod_user_id)'
            ,$sql);
            self::setEmployeeSpec($this->dbLink->lastInsertId()); 
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception ("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1); 
        }      
    }
    protected function updateEmployee()
    {
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $sql=[
                ':imie'=>[$this->inpArray['Imie'],'STR'],
                ':nazwisko'=>[$this->inpArray['Nazwisko'],'STR'],
                ':stanowisko'=>[$this->inpArray['Stanowisko'],'STR'],
                ':mod_user'=>[$_SESSION["username"],'STR'],
                ':mod_user_id'=>[$_SESSION["userid"],'STR'],
                ':email'=>[$this->inpArray['Email'],'STR'],
                ':id'=>[$this->inpArray['ID'],'INT'],
                ':dat_mod'=>[$_SESSION["username"],'STR']
            ];
            $this->dbLink->query('UPDATE `pracownik` SET imie=:imie, nazwisko=:nazwisko, stanowisko=:stanowisko,dat_mod=:dat_mod, mod_user=:mod_user,mod_user_id=:mod_user_id,email=:email WHERE id=:id'
            ,$sql);
            self::setEmployeeSpec($this->inpArray['ID']);
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception ("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1); 
        }  
    }
    protected function addEmployeeSpec($sql)
    {
        // CHECK IS EXIST
        if(self::employeeSpecExists($sql)===0){
            // NOT EXIST -> ADD
            $this->Log->log(1,"[".__METHOD__."] SPEC SENDED IN POST AND NOT EXIST IN DB=> ADD"); 
            $this->dbLink->query('INSERT INTO prac_i_slo_u_spec (id_prac,id_slo_u_spec) VALUES (:idp,:ids)',$sql); 
        }
        else{
            $this->Log->log(1,"[".__METHOD__."] SPEC SENDED IN POST BUT ALREADY EXIST => NOTHING TO DO"); 
        }
    }
    protected function removeEmployeeSpec($sql)
    {
        if(self::employeeSpecExists($sql)>0){
            // EXIST -> REMOVE
            $this->Log->log(1,"[".__METHOD__."] SPEC EXIST BUT NOT SENDED IN POST => REMOVE"); 
            $this->dbLink->query('DELETE FROM prac_i_slo_u_spec WHERE id_prac=:idp AND id_slo_u_spec=:ids',$sql); 
        }   
        else{
            $this->Log->log(1,"[".__METHOD__."] SPEC NOT SENDED IN POST AND NOT EXIST ID DB => NOTHING TO DO"); 
        }
    }
    private function employeeSpecExists($sql){
        $this->dbLink->query('SELECT * FROM prac_i_slo_u_spec WHERE  id_prac=:idp AND id_slo_u_spec=:ids',$sql);
        return count($this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC));
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
        $this->Log->logMulti(2,$tmpArray,__LINE__."::".__METHOD__." specPost");
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
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'ID',true,1);
        if(count(self::getEmplProj($this->inpArray['ID']))>0){
            Throw New Exception ('Employee can\'t be deleted. This employee appears in projects.',0);
        }  
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query('UPDATE `pracownik` SET `wsk_u`=1 WHERE `id`=:i',[':i'=>[$this->inpArray['ID'],'STR']]);
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }
        $this->utilities->jsonResponse(__METHOD__,'ok','cModal');
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
        $this->utilities->jsonResponse(__METHOD__,$data,'sEmployees','GET');
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getEmployeeProjects()
    {
        $data=[];        
        $this->utilities->setGet('id',$this->inpArray);
        $data[0]=$this->inpArray['id'];
        $data[1]=self::getEmplProj($this->inpArray['id']);
        $this->utilities->jsonResponse(__METHOD__,$data,'projects');
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB FOR DELETING EMPLOYY
    public function getDeletedEmployeeProjects()
    {
        $data=[];
        $this->utilities->setGet('id',$this->inpArray);


            /* TO DO 
            $data[1]=$this->query('SELECT \'NoPERM\' FROM v_proj_prac_v4 WHERE ID_Pracownik=? ORDER BY ID_Projekt ASC',$this->utilities->getData());
            $this->response['info']='NO PERMISSION TO SEE EMPLOYEE PROJECTS';
             * 
             */
        $data[0]=$this->inpArray['id'];
        $data[1]=$this->dbLink->squery('SELECT ID_Projekt,Numer_umowy,Temat_umowy,Procent_udziału,Data_od,Data_do FROM v_proj_prac_v4 WHERE ID_Pracownik=:i ORDER BY ID_Projekt ASC',[':i'=>[$this->inpArray['id'],'INT']]);       
        $this->utilities->jsonResponse(__METHOD__,$data,'dEmployee');
    }
    private function getEmplProj($id)
    {
        return ($this->dbLink->squery('SELECT ID_Projekt,Numer_umowy,Temat_umowy,Procent_udziału,Data_od,Data_do FROM v_proj_prac_v4 WHERE ID_Pracownik=:i ORDER BY ID_Projekt ASC',[':i'=>[$id,'INT']]));
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    private function employeeSpec($idEmployee)
    {
        $this->Log->log(0,"[".__METHOD__."] ID Employess => ".$idEmployee);
        // GET DICTIONARY
        $emplSpec=$this->dbLink->squery('SELECT * FROM `v_slo_u_spec` ORDER BY `ID` ASC ');
        // GET EMPLOYEE DICTIONARY 
        $emplSlo=$this->dbLink->squery('SELECT * FROM v_all_prac_spec WHERE idPracownik=:i ORDER BY idSlownik ASC ',['i'=>[$idEmployee,'INT']]);
        // COMBINE
        return ($this->combineSloEmployeeSpec($emplSpec,$emplSlo));
    }
    public function getEmployeeSpec()
    {
        $data=[];
        $this->utilities->setGet('id',$this->inpArray);
        $data[0]=self::getEmpData($this->inpArray['id']);
        $data[1]=self::employeeSpec($this->inpArray['id']);
        
        $this->utilities->jsonResponse(__METHOD__,$data,'eEmployeeSpec');
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
        $data=[];
        $this->utilities->setGet('id',$this->inpArray);
        $data[0]=self::getEmpData($this->inpArray['id']);
        $data[1]=self::employeeSpec($this->inpArray['id']);
        $this->Log->LogMulti(2,$data,__LINE__."::".__METHOD__." data");
        $this->utilities->jsonResponse(__METHOD__,$data,'eEmployee');
    }
    private function getEmpData($id){
        $e=$this->dbLink->squery('SELECT * FROM v_all_prac_v4 WHERE ID=:i',[':i'=>[$id,'INT']]);
        if(count($e)!==1){
            Throw New Exception ('Employee already deleted!',0);
        }
        return $e[0];  
    }
    function __destruct(){}
}