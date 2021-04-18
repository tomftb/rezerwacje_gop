<?php
class manageProjectStage extends initialDb
{
    protected $responseType='POST';
    private $inpArray=array();
    protected $filter='';
    protected $taskPerm= ['perm'=>'','type'=>''];
    private $stageData=array();
    private $lastStageId=0;
    private $dbLink;
    private $actProjectStageData=array();
    protected $infoArray=array
            (
                "nazwa"=>array
                (
                    "Podana Nazwa jest za krótka",
                    "Podana Nazwa jest za długa",
                    "Istnieje już rola o podanej nazwie",
                )
            );
    function __construct()
    {
        parent::__construct();
        parent::log(0,"[".__METHOD__."]");
        $this->response=NEW Response('Etapy');
        $this->utilities=NEW utilities();
        $this->dbLink=parent::getDbLink();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsstagelike()
    { 
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        //$f=filter_input(INPUT_GET,'filter');
        //$f='a';
        parent::log(0,"[".__METHOD__."] filter => ".$f);
        $select="SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` ORDER BY e.`id` ASC LIMIT 0,1) as `v` FROM `slo_projekt_etap` s  ";
        $where='';
        if(is_numeric($f)){
            parent::log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $query_data=array(
                    ':id'=>array($f_int,'INT'),
                    ':number'=>array($f_int,'INT')
            );
            $where="WHERE s.`wsk_u`=:wsku AND (s.`id` LIKE (:id) OR s.`number` LIKE (:number) OR s.`title` LIKE :title) ORDER BY s.`id` ASC";
         }
        else{
            parent::log(0,"[".__METHOD__."] filter not numeric ");
            $where="WHERE s.`wsk_u`=:wsku AND (s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        $query_data[':wsku']=array('0','STR');
        $query_data[':title']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
        try
	{
            parent::newQuery($select.$where,$query_data);   
	}
	catch (PDOException $e)
	{
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
        $return=array();
        foreach(parent::getSth()->fetchAll(PDO::FETCH_ASSOC) as $v){
            array_push($return,array($v['i'],$v['n'],html_entity_decode($v['t']),html_entity_decode($v['v'])));
        }
        return($this->response->setResponse(__METHOD__,$return,'','GET'));
    }
    public function getProjectStageDeleteSlo()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,$this->utilities->getInfo());   
        }
        else
        {
            parent::logMulti(0,$this->utilities->getData());
            $v['stage']=self::getProjectStageData($this->utilities->getData());
            try{
                parent::newQuery("SELECT `id` as ID,`nazwa` AS Nazwa FROM `slo_usun_proj_etap` WHERE id>0 AND wsk_u='0' ORDER BY `ID` ASC");
                $v['slo']=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
            }
            catch (PDOException $e){
                $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            }
        }
        return($this->response->setResponse(__METHOD__,$v,'psDelete','POST'));  
    }
    private function getProjectStageData($id)
    {
        parent::log(0,"[".__METHOD__."]");
        try{
            $v[':id']=array($id,'INT');
            parent::newQuery("SELECT `id` as 'i',`id_dzial` as 'id',`number` as 'n',`title` as 't',`create_user_fullname` as 'cu',`create_user_login` as 'cul',`create_date` as 'cd',`mod_login` as 'mu',`mod_date` as 'md',`buffer_user_id` as 'bu',`wsk_u` as 'wu', `delete_fullname` as 'du' FROM `slo_projekt_etap` WHERE `id`=:id LIMIT 0,1",$v);
            $d['head']=parent::getSth()->fetch(PDO::FETCH_ASSOC);
            parent::newQuery("SELECT `id` as 'i',`value` as 'v',`file_selected` as 'f',`file_position` as 'fp',`wsk_v` as 'wsk_v' FROM `slo_projekt_etap_ele` WHERE `id_projekt_etap`=:id AND `wsk_u`='0' ",$v);
            $d['body']=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
        return $d;
    }
    public function psDetails()
    {
        parent::log(0,"[".__METHOD__."]");
        $v=array();
        if($this->utilities->checkInputGetValInt('id')['status']===1)
        {
            $this->response->setError(1,$this->utilities->getInfo());   
        }
        else
        {
            $v=self::getProjectStageData($this->utilities->getData());
        }
        return ($this->response->setResponse(__METHOD__,$v,'psDetails','POST'));
    }
    public function psDelete()
    {
        parent::log(0,"[".__METHOD__."]");
        $id=filter_input(INPUT_POST,'id',FILTER_VALIDATE_INT);
        $reason=explode('|',filter_input(INPUT_POST,'reason'));
        parent::log(0,'id => '.$id);
        if(!$id)
        {
            $this->response->setError(1,'FIELD ID NOT EXIST IN POST');
        }
        else
        {
            /* CHECK wsk_b */

            $query_data=array(
                ':id'=>array($id,'INT'),
                ':wsku'=>array('1','STR'),
                ':userid'=>array($_SESSION["userid"],'INT'),
                ':username'=>array($_SESSION["username"],'STR'),
                ':fullname'=>array($_SESSION["nazwiskoImie"],'STR'),
                ':aktualnadata'=>array($this->cDT,'STR'),
                ':ra'=>array($this->RA,'STR'),
                ':reason'=>array($reason[1],'STR')
            );
            try
            {
                parent::newQuery("UPDATE `slo_projekt_etap` SET `wsk_u`=:wsku,`delete_user_id`=:userid,`delete_login`=:username,`delete_fullname`=:fullname,`delete_date`=:aktualnadata,`delete_reason`=:reason,`delete_host`=:ra WHERE `id`=:id",$query_data);   
            }
            catch (PDOException $e)
            {
                $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            }
        }
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    public function psCreate()
    {
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        try {
            self::checkInputFields();
            self::checkInputFieldsLength();
            self::createStage();
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            $this->response->setError(1,'PHP7 Caught exception: '.$t->getMessage()." in ".$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            $this->response->setError(1,'PHP5 Caught exception: '.$e->getMessage()." in ".$e->getFile());
        }
        self::addProjectStage();
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    private function checkInputFields()
    {
        parent::log(0,"[".__METHOD__."]");
        parent::logMulti(0, $this->inpArray);
        $fieldValue=false;
        foreach($this->inpArray as $k => $v){
            if(preg_match('/^(\d)+(-value){1}$/', $k)){
                $fieldValue=true;
                break;
            }
        }
        if(!array_key_exists('id',$this->inpArray) || !array_key_exists('number',$this->inpArray) || !array_key_exists('title',$this->inpArray)){
            throw new ErrorException(' KEY id|number|title|value NOT EXIST IN POST', 0, 0, __METHOD__, __LINE__);
        }
        if($fieldValue===false)
        {
            $this->response->setError(0,' Należy wprowadzić wartość dla etapu projektu');
        }
    }
    private function checkInputFieldsLength()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $keyToCheck=array('number'=>array('numerze',1,200),'title'=>array('tytule',3,200),'value'=>array('zawartość',1,65535));
        foreach($this->inpArray as $k => $v){
            parent::log(0,$k);
            if(preg_match('/^(\d)+(-value){1}$/', $k)){
                self::checkValueLength($this->inpArray[$k],'zawartość '.$k,1,65535);
            }
            else if(array_key_exists($k, $keyToCheck)){
                self::checkValueLength($v,$keyToCheck[$k][0],$keyToCheck[$k][1],$keyToCheck[$k][2]);
            }
            else{
                /* FILE KEY ? */
            }   
        }
    }
    private function createStage()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $tmp=array();
        foreach($this->inpArray as $k => $v){
            $tmp=explode('-',$k);      
            if(is_numeric($tmp[0])){
                if(array_key_exists(1, $tmp))
                {
                    self::createStageData($tmp[0],$tmp[1],$v);
                }
                else{
                    /* NUMERIC WITHOUT DATA -> SETUP ERROR */
                    throw new ErrorException('STAGE ERROR, NO LABEL FOR KEY => '.$tmp[0], 0, 0, __METHOD__, __LINE__);
                }
            }
            else{
                /* NON NUMERIC FIELD */
            }
            
        }

        self::checkStageFileInserted();
    }
    private function createStageData($id,$field,$value)
    {
        /*
         * $stageData
         */
        $type='STR';
        if(preg_match('/^(id|value|file|fileposition)$/i', $field)){
            parent::log(0,"[".__METHOD__."] FOUND ".$field." FIELD");
            /*
             * SETUP SPECIAL CHARACTER
             */
            $value=htmlentities(nl2br($value), ENT_QUOTES,'UTF-8',FALSE);
            parent::log(0,'NEW VALUE: '.$value);
            if($field==='id')
            {
                $type='INT';
            }
            else{
                $type='STR';
            }
            $this->stageData[$id][':'.$field]=array($value,$type);
        }
        else{
            /* WRONG DATA */  
            throw new ErrorException("WRONG FIELD FOUND ".$field, 0, 0, __METHOD__, __LINE__);
           
        }
    }
    private function checkStageFileInserted()
    {
        foreach($this->stageData as $i => $s)
        {
            if(!array_key_exists(':file', $s))
            {
                $this->stageData[$i][':file']=array(0,'STR');
            }
        }
    }
    public function psEdit()
    {
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        try {
            self::checkInputFields();
            self::checkInputFieldsLength();
            self::createStage();
            self::checkStageData();
            //throw new ErrorException(' TEST', 0, 0, __METHOD__, __LINE__);
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            $this->response->setError(1,'PHP7 Caught exception: '.$t->getMessage()." in ".$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            $this->response->setError(1,'PHP5 Caught exception: '.$e->getMessage()." in ".$e->getFile());
        }
        
        self::updateProjectStage();
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    private function checkStageData()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $this->inpArray['id']=intval($this->inpArray['id']);
        $this->actProjectStageData=self::getProjectStageData($this->inpArray['id']); // $this->inpArray['id']
        /* EXIST AND IS NOT BLOCKED ? */
        parent::logMulti(2,$this->actProjectStageData,__METHOD__);
        self::checkStageHead();
        
        parent::log(0,"COUNT BODY => ".count($this->actProjectStageData['body']));
    }
    private function checkStageHead()
    {
        parent::log(0,"COUNT HEAD => ".is_array($this->actProjectStageData['head']));
        if(!is_array($this->actProjectStageData['head']))
        {
            throw new ErrorException(' STAGE '.$this->inpArray['id'].' WAS DELETED', 0, 0, __METHOD__, __LINE__);
        }
        if($this->actProjectStageData['head']['wu']==='1')
        {
            $this->response->setError(0,' Projekt został już usunięty przez '.$this->actProjectStageData['head']['du']);
            return false;
        }
        $idUser=intval($_SESSION['userid'],10);
        $idBuffer=intval($this->actProjectStageData['head']['bu'],10);
        parent::log(0,"Actual user id => ".$idUser);
        parent::log(0,"Buffer user id => ".$idBuffer);
        if($idBuffer>0 && $idUser!=$idBuffer)
        {
            $this->response->setError(0,' Aktualnie etap projektu jest już otwarty przez użytkownika '.$idBuffer);
            return false;
        }
    }
    protected function addProjectStage()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $this->inpArray['number']=intval($this->inpArray['number']);
        $this->inpArray['title']=htmlentities(nl2br($this->inpArray['title']), ENT_QUOTES,'UTF-8',FALSE);
       
        $sql1_data=array(
                    ':number'=>array($this->inpArray['number'],'INT'),
                    ':title'=>array($this->inpArray['title'],'STR'),
        );
        self::addInsertAddOns($sql1_data);
        try
	{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            parent::newQuery("INSERT INTO `slo_projekt_etap` (`number`,`title`,`create_user_id`,`create_user_login`,`create_user_fullname`,`create_date`,`create_host`,`mod_user_id`,`mod_login`,`mod_host`) VALUES (:number,:title,:userid,:username,:nazwiskoimie,:aktualnadata,:ra,:userid2,:username2,:ra2)",$sql1_data);
            $this->lastStageId =  $this->dbLink->lastInsertId(); /* public PDO::lastInsertId ( string $name = null ) : string */
            parent::log(0,"[".__METHOD__."] LAST INSERTED ID: ".$this->lastStageId ); //
            array_map(array($this, 'insertStageElement'),$this->stageData);
            $this->dbLink->commit();  //PHP 5 and new
	}
	catch (PDOException $e)
	{
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            $this->dbLink->rollback(); 
	}     
    }
    private function insertStageElement($value)
    {
        parent::log(0,"[".__METHOD__."]");
        $value[':idproject']=array($this->lastStageId,'INT');
        /* REMOVE FAKE ID */
        UNSET($value[':id']);
        self::addInsertAddOns($value);
        parent::newQuery("INSERT INTO `slo_projekt_etap_ele` (`id_projekt_etap`,`value`,`file_selected`,`file_position`,`create_user_id`,`create_user_login`,`create_user_fullname`,`create_date`,`create_host`,`mod_user_id`,`mod_login`,`mod_host`) VALUES (:idproject,:value,:file,:fileposition,:userid,:username,:nazwiskoimie,:aktualnadata,:ra,:userid2,:username2,:ra2)",$value);
    }
    private function addInsertAddOns(&$data)
    {
        $addOns=array(
                    ':userid'=>array($_SESSION["userid"],'INT'),
                    ':username'=>array($_SESSION["username"],'STR'),
                    ':nazwiskoimie'=>array($_SESSION["nazwiskoImie"],'STR'),
                    ':aktualnadata'=>array($this->cDT,'STR'),
                    ':ra'=>array($this->RA,'STR'),
                    ':userid2'=>array($_SESSION["userid"],'INT'),
                    ':username2'=>array($_SESSION["username"],'STR'),
                    ':ra2'=>array($this->RA,'STR')
        );
         self::mergeArray($data,$addOns);
    }

    private function updateProjectStage()
    {
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!=='') { return false;}
        $this->inpArray['id']=intval($this->inpArray['id']);
        $this->inpArray['number']=intval($this->inpArray['number']);
        $this->inpArray['title']=htmlentities(nl2br($this->inpArray['title']), ENT_QUOTES,'UTF-8',FALSE);
       
        $sql1_data=array(
                    ':id'=>array($this->inpArray['id'],'INT'),
                    ':number'=>array($this->inpArray['number'],'INT'),
                    ':title'=>array($this->inpArray['title'],'STR'),
        );
        self::addUpdateAddOns($sql1_data);
        try
	{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            parent::newQuery("UPDATE `slo_projekt_etap` SET `number`=:number,`title`=:title,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_date`=:mod_date,`mod_host`=:mod_host WHERE `id`=:id",$sql1_data);
            parent::log(0,"[".__METHOD__."] UPDATE PROJECT ID: ".$this->inpArray['id'] ); //
            self::manageStageElement();
            $this->dbLink->commit();  //PHP 5 and new
	}
	catch (PDOException $e)
	{
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            $this->dbLink->rollback(); 
	} 
    }
    private function updateStageElement($value)
    {
        parent::log(0,"[".__METHOD__."]");
        $value[':id_projekt_etap']=array($this->inpArray['id'],'INT');
        self::addUpdateAddOns($value);
        parent::logMulti(2,$value);
        parent::newQuery("UPDATE `slo_projekt_etap_ele` SET `value`=:value,`file_selected`=:file,`file_position`=:fileposition,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_host`=:mod_host,`mod_date`=:mod_date WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function deleteStageElement($value)
    {
        parent::log(0,"[".__METHOD__."]");
        $value[':id_projekt_etap']=array($this->inpArray['id'],'INT');
        self::addDeleteAddOns($value);
        parent::logMulti(0,$value);
        parent::newQuery("UPDATE `slo_projekt_etap_ele` SET `wsk_u`='1',`delete_user_id`=:delete_user_id,`delete_login`=:delete_login,`delete_fullname`=:delete_fullname,`delete_date`=:delete_date,`delete_host`=:delete_host WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function manageStageElement()
    {
        parent::log(0,"[".__METHOD__."]");
        $found=false;
        $tmp=array();
        foreach($this->actProjectStageData['body'] as $k => $v)
        {
            parent::log(0," STAGE => ".$v['i']);
            parent::logMulti(0,$this->stageData);
            self::checkInStageData($v,$found);
            if($found){
                self::updateStageElement($v);
                UNSET($this->actProjectStageData['body'][$k]);
            }
            else{
                $tmp[":id"]=array($v['i'],'INT');
                self::deleteStageElement($tmp);
            }
            $found=false;
        }
        /* INSERT NEW STAGE */
        $this->lastStageId=$this->inpArray['id'];
        array_map(array($this, 'insertStageElement'),$this->stageData);
        //$this->response->setError(0,'['.__METHOD__.']['.__LINE__.'] TEST STOP');
    }
    private function checkInStageData($v,&$found)
    {
        foreach($this->stageData as $ks => $vs)
        {
            parent::log(0," SENDED STAGE ID => ".$vs[':id'][0]);
            if($v['i']===$vs[':id'][0])
            {
                UNSET($this->stageData[$ks]);
                $found=true;
                break;
            }
        }
    }
    private function addUpdateAddOns(&$data)
    {
        $addOns=array(
                    ':mod_user_id'=>array($_SESSION["userid"],'INT'),
                    ':mod_login'=>array($_SESSION["username"],'STR'),
                    ':mod_date'=>array($this->cDT,'STR'),
                    ':mod_host'=>array($this->RA,'STR')
        );
        self::mergeArray($data,$addOns);
    }
    private function addDeleteAddOns(&$data)
    {
        $addOns=array(
                    ':delete_user_id'=>array($_SESSION["userid"],'INT'),
                    ':delete_login'=>array($_SESSION["username"],'STR'),
                    ':delete_fullname'=>array($_SESSION["nazwiskoImie"],'STR'),
                    ':delete_date'=>array($this->cDT,'STR'),
                    ':delete_host'=>array($this->RA,'STR')
        );
        self::mergeArray($data,$addOns);
    }
    private function mergeArray(&$mainArray,$additionalArray)
    {
        foreach($additionalArray as $k => $v)
        {
            $mainArray[$k]=$v;
        }
    }
    public function getNewStageSlo()
    {
        return ($this->response->setResponse(__METHOD__,'','psCreate','POST'));
    }
    protected function checkValueLength($value,$label,$min,$max)
    {
        parent::log(0,"[".__METHOD__."]");
        if(strlen($value)<$min)
        {
            $this->response->setError(0,"W ".$label." nie wprowadzono minimalnej ilości znaków");
        }
        if(strlen($value)>$max)
        {
            $this->response->setError(0,"W ".$label." przekroczono dopuszczalną ilość znaków");
        }
    }
    function __destruct()
    {}
}