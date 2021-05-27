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
    private $brTag='';
    

    function __construct(){
        parent::__construct();
        parent::log(0,"[".__METHOD__."]");
        $this->response=NEW Response('Etapy');
        $this->utilities=NEW utilities();
        $this->dbLink=parent::getDbLink();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsstagelike(){ 
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        //$f=filter_input(INPUT_GET,'filter');
        //$f='a';
        parent::log(0,"[".__METHOD__."] filter => ".$f);
        parent::logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC LIMIT 0,1) as `v`,b.`login` as 'bl' FROM `slo_projekt_etap` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $where='';
        $query_data=array();
        if(is_numeric($f)){
            parent::log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $query_data[':number']=array($f_int,'INT');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`id` LIKE (:id) OR s.`number` LIKE (:number) OR s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        else{
            parent::log(0,"[".__METHOD__."] filter not numeric ");
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        self::setGetWsk('u');
        self::setGetWsk('v');
        self::setGetWsk('b');
        self::releaseWskB($this->inpArray['b']);
        $query_data[':wsk_u']=array($this->inpArray['u'],'STR');
        $query_data[':wsk_v']=array($this->inpArray['v'],'STR');
        $query_data[':title']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
        try{
            parent::newQuery($select.$where,$query_data);   
	}
	catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
        $return=array();
        foreach(parent::getSth()->fetchAll(PDO::FETCH_ASSOC) as $v){
            array_push($return,array($v['i'],$v['n'],html_entity_decode($v['t']),html_entity_decode($v['v']),'bl'=>$v['bl']));
        }
        return($this->response->setResponse(__METHOD__,$return,'','GET'));
    }
    public function getProjectStageHideSlo(){
        parent::log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        self::setGetId();
        self::getProjectStageData($this->inpArray['id']);
        self::checkWskB(intval($this->actProjectStageData['head']['bu'],10),$this->actProjectStageData['head']['bl']);
        self::setWskB(intval($_SESSION['userid'],10));
        self::getSlo('psHide');
        return($this->response->setResponse(__METHOD__,$this->actProjectStageData,'psHide','POST'));  
    }
    public function getProjectStageDelSlo(){
        parent::log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        self::setGetId();
        self::getProjectStageData($this->inpArray['id']);
        self::checkWskB(intval($this->actProjectStageData['head']['bu'],10),$this->actProjectStageData['head']['bl']);
        self::setWskB(intval($_SESSION['userid'],10));
        self::getSlo('psDelete');
        return($this->response->setResponse(__METHOD__,$this->actProjectStageData,'psDelete','POST'));  
    }
    private function setGetWsk($wsk='u'){
        $this->inpArray[$wsk]=filter_input(INPUT_GET,$wsk);
        if($this->inpArray[$wsk]===null || $this->inpArray[$wsk]===false){
            parent::log(0,"[".__METHOD__."] wsk_".$wsk." NOT EXIST, SET DEFAULT 0");
            $this->inpArray[$wsk]='0';
        }
    }
    private function setGetId(){
        if(!$this->utilities->setGetIntKey($this->inpArray['id'],'id')){
             $this->response->setError(1,"[".__METHOD__."] KEY id NOT EXIST OR ID IS NOT INT");
        }
    }
    private function setPostId(){
        $this->inpArray['id']=filter_input(INPUT_POST,'id',FILTER_VALIDATE_INT);
        if($this->inpArray['id']===null || $this->inpArray['id']===false){
            $this->response->setError(1,"[".__METHOD__."] KEY id NOT EXIST OR ID IS NOT INT");
        }
    }
    private function checkWskB($wskb=0,$blogin=''){
        parent::log(0,"[".__METHOD__."]");
        parent::log(0,"[".__METHOD__."] user wskb => ".$wskb);
        parent::log(0,"[".__METHOD__."] session userid => ".$_SESSION['userid']);
        if($wskb>0 && $wskb!==intval($_SESSION['userid'],10)){
            $this->response->setError(0,"[ERROR] Aktualnie etap projektu jest aktualizowany przez - ${blogin}.");
        }
        /* $_SESSION['id']*/
    }
    private function setWskB($userid=0){
        parent::log(0,"[".__METHOD__."] SET BUFFER USER ID => ".$userid);
        if($this->response->getError()!==''){ return false;}
        $query_data=array(
            ':id'=>array($this->inpArray['id'],'INT'),
            ':buffer_user_id'=>array($userid,'INT'),
        );
        try{
            parent::newQuery("UPDATE `slo_projekt_etap` SET `buffer_user_id`=:buffer_user_id WHERE `id`=:id",$query_data);   
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
    }
    private function getWskB($idProject){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){ return false;}
        $query_data=array(':id'=>array($idProject,'INT'));
        try{
            parent::newQuery("select b.`login` as 'bl',`buffer_user_id` as bu FROM `slo_projekt_etap` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id",$query_data);   
            $this->inpArray['wskb']=parent::getSth()->fetch(PDO::FETCH_ASSOC);
            parent::logMulti(0,$this->inpArray['wskb']);
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
    }
    private function releaseWskB($idStage){
        parent::log(0,"[".__METHOD__."] idStage => ".$idStage);
        parent::log(0,"[".__METHOD__."] session userid => ".$_SESSION['userid']);
        if($idStage==='0'){
            parent::log(0,"[".__METHOD__."] idStage not defined, nothing to do");
        }
        else{
            /* check */
            self::getWskB($idStage);
            parent::log(0,"[".__METHOD__."] buffer user id => ".$this->inpArray['wskb']['bu']);
            $userid=intval($_SESSION['userid'],10);
            if(intval($this->inpArray['wskb']['bu'],10)===$userid){
                $this->inpArray['id']=$idStage;
                self::setWskB();
            }
            else{
                parent::log(0,"[".__METHOD__."] blocked by different user ".$this->inpArray['wskb']['bl']." (".$this->inpArray['wskb']['bu'].")");
            }
        }
    }
    private function getSlo($slo='psDelete'){
        if($this->response->getError()!==''){ return false;}
        $sqlData=array(':name'=>array($slo,'STR'));
        //$this->actProjectStageData['stage']=
        try{
            parent::newQuery("SELECT s.`id` as ID,s.`nazwa` AS Nazwa FROM `slo` s,`app_task` a WHERE s.`id_app_task`=a.`id` AND s.id>0 AND s.wsk_u='0' AND a.`name`=:name ORDER BY s.`id` ASC",$sqlData);
            $this->actProjectStageData['slo']=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
    }
    private function getProjectStageData($id=0){
        parent::log(0,"[".__METHOD__."]");
        try{
            $v[':id']=array($id,'INT');
            parent::newQuery("SELECT s.`id` as 'i',s.`id_dzial` as 'id',s.`number` as 'n',s.`title` as 't',s.`create_user_fullname` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`wsk_u` as 'wu',s.`delete_fullname` as 'du',b.`login` as 'bl' FROM `slo_projekt_etap` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id LIMIT 0,1",$v);
            $this->actProjectStageData['head']=array_map(array($this,'preapareProjectStageData'),parent::getSth()->fetch(PDO::FETCH_ASSOC));
            parent::logMulti(0,$this->actProjectStageData['head'],__METHOD__);
            parent::newQuery("SELECT `id` as 'i',`value` as 'v',`file_selected` as 'f',`file_position` as 'fp',`wsk_v` as 'wsk_v' FROM `slo_projekt_etap_ele` WHERE `id_projekt_etap`=:id AND `wsk_u`='0' ",$v);
            $this->actProjectStageData['body']=array_map(array($this,'preapareProjectStageData'),parent::getSth()->fetchAll(PDO::FETCH_ASSOC));
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
    }
    private function preapareProjectStageData($data){
        return str_replace($this->brTag,"",$data);
    }
    public function psDetails(){
        parent::log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        self::setGetId();
        self::getProjectStageData($this->inpArray['id']);
        return ($this->response->setResponse(__METHOD__,$this->actProjectStageData,'psDetails','POST'));
    }
    public function psHide(){
        parent::log(0,"[".__METHOD__."]");
        self::setPostId();
        self::setReason();
        /* CHECK wsk_b */
        self::getWskB($this->inpArray['id']);
        self::checkWskB(intval($this->inpArray['wskb']['bu'],10),$this->inpArray['wskb']['bl']);
        self::sqlHideStage();
        self::setWskB();
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    public function psDelete(){
        parent::log(0,"[".__METHOD__."]");
        self::setPostId();
        self::setReason();
        /* CHECK wsk_b */
        self::getWskB($this->inpArray['id']);
        self::checkWskB(intval($this->inpArray['wskb']['bu'],10),$this->inpArray['wskb']['bl']);
        self::sqlDeleteStage();
        self::setWskB();
        return ($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    private function sqlDeleteStage(){
        if($this->response->getError()!==''){ return false;}
        $query_data=array(
                ':id'=>array($this->inpArray['id'],'INT'),
                ':wsku'=>array('1','STR'),
                ':userid'=>array($_SESSION["userid"],'INT'),
                ':username'=>array($_SESSION["username"],'STR'),
                ':fullname'=>array($_SESSION["nazwiskoImie"],'STR'),
                ':aktualnadata'=>array($this->cDT,'STR'),
                ':ra'=>array($this->RA,'STR'),
                ':delete_reason'=>array($this->inpArray['reason'][1],'STR')
            );
            try{
                parent::newQuery("UPDATE `slo_projekt_etap` SET `wsk_u`=:wsku,`delete_user_id`=:userid,`delete_login`=:username,`delete_fullname`=:fullname,`delete_date`=:aktualnadata,`delete_reason`=:delete_reason,`delete_host`=:ra WHERE `id`=:id",$query_data);   
            }
            catch (PDOException $e){
                $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            }
    }
    private function sqlHideStage(){
        if($this->response->getError()!==''){ return false;}
        $query_data=array(
            ':id'=>array($this->inpArray['id'],'INT'),
            ':wsk_v'=>array('1','STR'),
            ':hide_reason'=>array($this->inpArray['reason'][1],'STR')
        );
        self::addUpdateAddOns($query_data);
        try{
            parent::newQuery("UPDATE `slo_projekt_etap` SET `wsk_v`=:wsk_v,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_date`=:mod_date,`hide_reason`=:hide_reason,`mod_host`=:mod_host WHERE `id`=:id",$query_data);   
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
    }
    private function setReason(){
        $this->inpArray['reason']=explode('|',filter_input(INPUT_POST,'reason'));
        if(count($this->inpArray['reason'])!==2){
            $this->response->setError(1,"[".__METHOD__."] WRONG ARRAY MEMBERS, SHOULD BE 2:");
            parent::logMulti(0,$this->inpArray['reason'],__METHOD__);
        }
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
    private function checkInputFields(){
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
    private function checkInputFieldsLength(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $keyToCheck=array('number'=>array('numerze',1,200),'title'=>array('tytule',3,200),'value'=>array('zawartość',1,65535));
        foreach($this->inpArray as $k => $v){
            parent::log(0,$k);
            if(preg_match('/^(\d)+(-value){1}$/', $k)){
                self::checkDataLength($this->inpArray[$k],'zawartość '.$k,1,65535);
            }
            else if(array_key_exists($k, $keyToCheck)){
                self::checkDataLength($v,$keyToCheck[$k][0],$keyToCheck[$k][1],$keyToCheck[$k][2]);
            }
            else{
                /* FILE KEY ? */
            }   
        }
    }
    private function createStage(){
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
    private function createStageData($id,$field,$value){
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
    private function checkStageFileInserted(){
        foreach($this->stageData as $i => $s){
            if(!array_key_exists(':file', $s)){
                $this->stageData[$i][':file']=array(0,'STR');
            }
        }
    }
    public function psEdit(){
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        try {
            self::checkInputFields();
            self::checkInputFieldsLength();
            self::createStage();
            self::checkStageData();
            self::checkWskB(intval($this->actProjectStageData['head']['bu'],10));
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
    private function checkStageData(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()!==''){return false;}
        $this->inpArray['id']=intval($this->inpArray['id']);
        self::getProjectStageData($this->inpArray['id']);
        //$this->actProjectStageData=$this->inpArray['id']
        /* EXIST AND IS NOT BLOCKED ? */
        parent::logMulti(2,$this->actProjectStageData,__METHOD__);
        self::checkStageHead();
        parent::log(0,"COUNT BODY => ".count($this->actProjectStageData['body']));
    }
    private function checkStageHead(){
        parent::log(0,"COUNT HEAD => ".is_array($this->actProjectStageData['head']));
        if(!is_array($this->actProjectStageData['head'])){
            throw new ErrorException(' STAGE '.$this->inpArray['id'].' WAS DELETED', 0, 0, __METHOD__, __LINE__);
        }
        if($this->actProjectStageData['head']['wu']==='1'){
            $this->response->setError(0,' Projekt został już usunięty przez '.$this->actProjectStageData['head']['du']);
            return false;
        }
        
    }
    protected function addProjectStage(){
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
    private function insertStageElement($value){
        parent::log(0,"[".__METHOD__."]");
        $value[':idproject']=array($this->lastStageId,'INT');
        /* REMOVE FAKE ID */
        UNSET($value[':id']);
        self::addInsertAddOns($value);
        parent::newQuery("INSERT INTO `slo_projekt_etap_ele` (`id_projekt_etap`,`value`,`file_selected`,`file_position`,`create_user_id`,`create_user_login`,`create_user_fullname`,`create_date`,`create_host`,`mod_user_id`,`mod_login`,`mod_host`) VALUES (:idproject,:value,:file,:fileposition,:userid,:username,:nazwiskoimie,:aktualnadata,:ra,:userid2,:username2,:ra2)",$value);
    }
    private function addInsertAddOns(&$data){
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
        $this->utilities->mergeArray($data,$addOns);
    }

    private function updateProjectStage(){
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
    private function updateStageElement($value){
        parent::log(0,"[".__METHOD__."]");
        parent::logMulti(0,$value);
        $value[':id_projekt_etap']=array($this->inpArray['id'],'INT');
        self::addUpdateAddOns($value);
        parent::logMulti(2,$value);
        parent::newQuery("UPDATE `slo_projekt_etap_ele` SET `value`=:value,`file_selected`=:file,`file_position`=:fileposition,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_host`=:mod_host,`mod_date`=:mod_date WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function deleteStageElement($value){
        parent::log(0,"[".__METHOD__."]");
        $value[':id_projekt_etap']=array($this->inpArray['id'],'INT');
        self::addDeleteAddOns($value);
        parent::logMulti(0,$value);
        parent::newQuery("UPDATE `slo_projekt_etap_ele` SET `wsk_u`='1',`delete_user_id`=:delete_user_id,`delete_login`=:delete_login,`delete_fullname`=:delete_fullname,`delete_date`=:delete_date,`delete_host`=:delete_host WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function manageStageElement(){
        parent::log(0,"[".__METHOD__."]");
        $found=false;
        $tmp=array();
        foreach($this->actProjectStageData['body'] as $k => $v){
            parent::log(0," STAGE => ".$v['i']);
            parent::logMulti(0,$this->stageData);
            self::checkInStageData($v,$found);
            if($found){
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
    private function checkInStageData($v,&$found){
        parent::log(0,"[".__METHOD__."]");
        foreach($this->stageData as $ks => $vs){
            parent::log(0," SENDED STAGE ID => ".$vs[':id'][0]);
            if($v['i']===$vs[':id'][0]){
                self::updateStageElement($vs);
                UNSET($this->stageData[$ks]);
                $found=true;
                break;
            }
        }
    }
    private function addUpdateAddOns(&$data){
        $addOns=array(
                    ':mod_user_id'=>array($_SESSION["userid"],'INT'),
                    ':mod_login'=>array($_SESSION["username"],'STR'),
                    ':mod_date'=>array($this->cDT,'STR'),
                    ':mod_host'=>array($this->RA,'STR')
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    private function addDeleteAddOns(&$data){
        $addOns=array(
                    ':delete_user_id'=>array($_SESSION["userid"],'INT'),
                    ':delete_login'=>array($_SESSION["username"],'STR'),
                    ':delete_fullname'=>array($_SESSION["nazwiskoImie"],'STR'),
                    ':delete_date'=>array($this->cDT,'STR'),
                    ':delete_host'=>array($this->RA,'STR')
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    public function getNewStageSlo(){
        return ($this->response->setResponse(__METHOD__,'','psCreate','POST'));
    }
    protected function checkDataLength($value,$label,$min,$max){
        parent::log(0,"[".__METHOD__."]");
        $check=$this->utilities->checkValueLength($value,$label,$min,$max);
        if($check){
            $this->response->setError(0,$check);
        }
    }
    public function setProjectStageWskB(){
        parent::log(0,"[".__METHOD__."]");
        self::setGetId();
        self::setWskB(intval($_SESSION['userid'],10));
        return ($this->response->setResponse(__METHOD__,'','block','POST'));
    }
    public function getProjectAllStage(){
        parent::log(0,"[".__METHOD__."]");
        $return=[];
        //$stageBody="(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC)";
        try{
            parent::newQuery("SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',s.`create_user_login` as 'cu' FROM `slo_projekt_etap` s WHERE s.`id`>0 AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
            $head=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
            foreach($head as $v){
                /* GET STAGE BODY */
                parent::newQuery("SELECT s.`value` as 'v',s.`file_selected` as 'f',s.`file_position` as 'fp' FROM `slo_projekt_etap_ele` s WHERE s.`id_projekt_etap`=".$v['i']." AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
                $body=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
                foreach($body as $kb => $vb){
                    $body[$kb]['v']=html_entity_decode($body[$kb]['v']);
                }
                array_push($return,array('i'=>$v['i'],'n'=>$v['n'],'t'=>html_entity_decode($v['t']),'cu'=>$v['cu'],'v'=>$body));
            }
	}
	catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
        return($this->response->setResponse(__METHOD__,$return,'','GET'));
    }
    function __destruct()
    {}
}