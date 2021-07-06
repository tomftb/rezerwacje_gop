<?php
class ManageProjectStage 
{
    private $inpArray=array();
    protected $filter='';
    private $stageData=array();
    private $lastStageId=0;
    private $dbLink;
    private $actProjectStageData=array();
    private $brTag='';
    private $Log;

    function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
        $this->dbLink=LoadDb::load();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsstagelike(){ 
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        //$f=filter_input(INPUT_GET,'filter');
        //$f='a';
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',(select e.`value` FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC LIMIT 0,1) as `v`,b.`login` as 'bl' FROM `slo_projekt_etap` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $where='';
        $query_data=[];

        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $query_data[':number']=array($f_int,'INT');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`id` LIKE (:id) OR s.`number` LIKE (:number) OR s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] filter not numeric ");
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
 
        $return=array();
        /* */
        foreach($this->dbLink->squery($select.$where,$query_data) as $v){
            array_push($return,array($v['i'],$v['n'],html_entity_decode($v['t']),html_entity_decode($v['v']),'bl'=>$v['bl']));
        }
        $this->utilities->jsonResponse(__METHOD__,$return,'','GET');
    }
    public function getProjectStageHideSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        $this->utilities->setGet('id',$this->inpArray);
        self::getProjectStageData($this->inpArray['id']);
        self::checkWskB(intval($this->actProjectStageData['head']['bu'],10),$this->actProjectStageData['head']['bl']);
        self::setWskB(intval($_SESSION['userid'],10));
        self::getSlo('psHide');
        $this->utilities->jsonResponse(__METHOD__,$this->actProjectStageData,'psHide','POST');  
    }
    public function getProjectStageDelSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        $this->utilities->setGet('id',$this->inpArray);
        self::getProjectStageData($this->inpArray['id']);
        self::checkWskB(intval($this->actProjectStageData['head']['bu'],10),$this->actProjectStageData['head']['bl']);
        self::setWskB(intval($_SESSION['userid'],10));
        self::getSlo('psDelete');
        $this->utilities->jsonResponse(__METHOD__,$this->actProjectStageData,'psDelete','POST');  
    }
    private function setGetWsk($wsk='u'){
        $this->inpArray[$wsk]=filter_input(INPUT_GET,$wsk);
        if($this->inpArray[$wsk]===null || $this->inpArray[$wsk]===false){
            $this->Log->log(0,"[".__METHOD__."] wsk_".$wsk." NOT EXIST, SET DEFAULT 0");
            $this->inpArray[$wsk]='0';
        }
    }
    private function setPostId(){
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey(filter_input_array(INPUT_POST),'id',true,1);
    }
    private function checkWskB($wskb=0,$blogin=''){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->log(0,"[".__METHOD__."] user wskb => ".$wskb);
        $this->Log->log(0,"[".__METHOD__."] session userid => ".$_SESSION['userid']);
        if($wskb>0 && $wskb!==intval($_SESSION['userid'],10)){
            Throw New Exception("[ERROR] Aktualnie etap projektu jest aktualizowany przez - ${blogin}.",0);
        }
        /* $_SESSION['id']*/
    }
    private function setWskB($userid=0){
        $this->Log->log(0,"[".__METHOD__."] SET BUFFER USER ID => ".$userid);
        $query_data=[
            ':id'=>[$this->inpArray['id'],'INT'],
            ':buffer_user_id'=>[$userid,'INT'],
        ];
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap` SET `buffer_user_id`=:buffer_user_id WHERE `id`=:id",$query_data);
        $this->dbLink->runTransaction();
    }
    private function getWskB($idProject=0){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray['wskb']=$this->dbLink->squery("select b.`login` as 'bl',`buffer_user_id` as bu FROM `slo_projekt_etap` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id",[':id'=>[$idProject,'INT']])[0];    
    }
    private function releaseWskB($idStage){
        $this->Log->log(0,"[".__METHOD__."] idStage => ".$idStage);
        $this->Log->log(0,"[".__METHOD__."] session userid => ".$_SESSION['userid']);
        if($idStage==='0'){
            $this->Log->log(0,"[".__METHOD__."] idStage not defined, nothing to do");
        }
        else{
            /* check */
            self::getWskB($idStage);
            $this->Log->log(0,"[".__METHOD__."] buffer user id => ".$this->inpArray['wskb']['bu']);
            $userid=intval($_SESSION['userid'],10);
            if(intval($this->inpArray['wskb']['bu'],10)===$userid){
                $this->inpArray['id']=$idStage;
                self::setWskB();
            }
            else{
                $this->Log->log(0,"[".__METHOD__."] blocked by different user ".$this->inpArray['wskb']['bl']." (".$this->inpArray['wskb']['bu'].")");
            }
        }
    }
    private function getSlo($slo='psDelete'){
        $this->actProjectStageData['slo']=$this->dbLink->squery("SELECT s.`id` as ID,s.`nazwa` AS Nazwa FROM `slo` s,`app_task` a WHERE s.`id_app_task`=a.`id` AND s.id>0 AND s.wsk_u='0' AND a.`name`=:n ORDER BY s.`id` ASC",[':n'=>[$slo,'STR']]);  
    }
    private function getProjectStageData($id=0){
        $this->Log->log(0,"[".__METHOD__."]");
        $head=$this->dbLink->squery("SELECT s.`id` as 'i',s.`id_dzial` as 'id',s.`number` as 'n',s.`title` as 't',s.`create_user_fullname` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`wsk_u` as 'wu',s.`delete_fullname` as 'du',b.`login` as 'bl' FROM `slo_projekt_etap` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id LIMIT 0,1",[':id'=>[$id,'INT']]);
        $this->actProjectStageData['head']=array_map(array($this,'preapareProjectStageData'),$head[0]);
        $body=$this->dbLink->squery("SELECT `id` as 'i',`value` as 'v',`file_selected` as 'f',`file_position` as 'fp',`wsk_v` as 'wsk_v' FROM `slo_projekt_etap_ele` WHERE `id_projekt_etap`=:id AND `wsk_u`='0' ",[':id'=>[$id,'INT']]);
        $this->actProjectStageData['body']=array_map(array($this,'preapareProjectStageData'),$body);
       
    }
    private function preapareProjectStageData($data){
        return str_replace($this->brTag,"",$data);
    }
    public function psDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        $this->utilities->setGet('id',$this->inpArray);
        self::getProjectStageData($this->inpArray['id']);
        $this->utilities->jsonResponse(__METHOD__,$this->actProjectStageData,'psDetails','POST');
    }
    public function psHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setPostId();
        self::setReason();
        /* CHECK wsk_b */
        self::getWskB($this->inpArray['id']);
        self::checkWskB(intval($this->inpArray['wskb']['bu'],10),$this->inpArray['wskb']['bl']);
        self::sqlHideStage();
        self::setWskB();
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    public function psDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setPostId();
        self::setReason();
        /* CHECK wsk_b */
        self::getWskB($this->inpArray['id']);
        self::checkWskB(intval($this->inpArray['wskb']['bu'],10),$this->inpArray['wskb']['bl']);
        self::sqlDeleteStage();
        self::setWskB();
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    private function sqlDeleteStage(){
        $query_data=[
                ':id'=>[$this->inpArray['id'],'INT'],
                ':wsku'=>['1','STR'],
                ':userid'=>[$_SESSION["userid"],'INT'],
                ':username'=>[$_SESSION["username"],'STR'],
                ':fullname'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':aktualnadata'=>[CDT,'STR'],
                ':ra'=>[RA,'STR'],
                ':delete_reason'=>array($this->inpArray['reason'][1],'STR')
            ];
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap` SET `wsk_u`=:wsku,`delete_user_id`=:userid,`delete_login`=:username,`delete_fullname`=:fullname,`delete_date`=:aktualnadata,`delete_reason`=:delete_reason,`delete_host`=:ra WHERE `id`=:id",$query_data);
        $this->dbLink->runTransaction();
    }
    private function sqlHideStage(){
        $sqlParm=[
            ':id'=>[$this->inpArray['id'],'INT'],
            ':wsk_v'=>['1','STR'],
            ':hide_reason'=>[$this->inpArray['reason'][1],'STR']
        ];
        self::addUpdateAddOns($sqlParm);
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap` SET `wsk_v`=:wsk_v,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_date`=:mod_date,`hide_reason`=:hide_reason,`mod_host`=:mod_host WHERE `id`=:id",$sqlParm);
        $this->dbLink->runTransaction();
    }
    private function setReason(){
        $this->inpArray['reason']=explode('|',filter_input(INPUT_POST,'reason'));
        if(count($this->inpArray['reason'])!==2){
            $this->response->setError(1,"[".__METHOD__."] WRONG ARRAY MEMBERS, SHOULD BE 2:");
            $this->Log->logMulti(0,$this->inpArray['reason'],__METHOD__);
        }
    }
    public function psCreate()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::checkInputFields();
        self::checkInputFieldsLength();
        self::createStage();
        self::addProjectStage();
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    private function checkInputFields(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0, $this->inpArray);
        if(!is_array($this->inpArray)){
            throw new Exception('POST IS NOT AN ARRAY', 1);
        }
        $fieldValue=false;
        foreach($this->inpArray as $k => $v){
            if(preg_match('/^(\d)+(-value){1}$/', $k)){
                $fieldValue=true;
                break;
            }
        }
        if(!array_key_exists('id',$this->inpArray) || !array_key_exists('number',$this->inpArray) || !array_key_exists('title',$this->inpArray)){
            throw new Exception(' KEY id|number|title|value NOT EXIST IN POST', 1, 0, __METHOD__, __LINE__);
        }
        if($fieldValue===false){
            throw new Exception('Należy wprowadzić wartość dla etapu projektu',0);
        }
    }
    private function checkInputFieldsLength(){
        $this->Log->log(0,"[".__METHOD__."]");
        $keyToCheck=array('number'=>array('numerze',1,200),'title'=>array('tytule',3,200),'value'=>array('zawartość',1,65535));
        foreach($this->inpArray as $k => $v){
            $this->Log->log(0,$k);
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
        $this->Log->log(0,"[".__METHOD__."]");
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
                    throw new Exception('STAGE ERROR, NO LABEL FOR KEY => '.$tmp[0], 1, 0, __METHOD__, __LINE__);
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
            $this->Log->log(0,"[".__METHOD__."] FOUND ".$field." FIELD");
            /*
             * SETUP SPECIAL CHARACTER
             */
            $value=htmlentities(nl2br($value), ENT_QUOTES,'UTF-8',FALSE);
            $this->Log->log(0,'NEW VALUE: '.$value);
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
            throw new Exception("WRONG FIELD FOUND ".$field, 0, 0, __METHOD__, __LINE__);
           
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
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::checkInputFields();
        self::checkInputFieldsLength();
        self::createStage();
        self::checkStageData();
        self::checkWskB(intval($this->actProjectStageData['head']['bu'],10));
        self::updateProjectStage();
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    private function checkStageData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray['id']=intval($this->inpArray['id']);
        self::getProjectStageData($this->inpArray['id']);
        //$this->actProjectStageData=$this->inpArray['id']
        /* EXIST AND IS NOT BLOCKED ? */
        $this->Log->logMulti(2,$this->actProjectStageData,__METHOD__);
        self::checkStageHead();
        $this->Log->log(0,"COUNT BODY => ".count($this->actProjectStageData['body']));
    }
    private function checkStageHead(){
        $this->Log->log(0,"COUNT HEAD => ".is_array($this->actProjectStageData['head']));
        if(!is_array($this->actProjectStageData['head'])){
            throw new Exception(' STAGE '.$this->inpArray['id'].' WAS DELETED', 0, 0, __METHOD__, __LINE__);
        }
        if($this->actProjectStageData['head']['wu']==='1'){
            $this->response->setError(0,' Projekt został już usunięty przez '.$this->actProjectStageData['head']['du']);
            return false;
        }
        
    }
    protected function addProjectStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray['number']=intval($this->inpArray['number']);
        $this->inpArray['title']=htmlentities(nl2br($this->inpArray['title']), ENT_QUOTES,'UTF-8',FALSE);
        $sql1_data=[
                    ':number'=>[$this->inpArray['number'],'INT'],
                    ':title'=>[$this->inpArray['title'],'STR']
        ];
        self::addInsertAddOns($sql1_data);  
        try
	{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query("INSERT INTO `slo_projekt_etap` (`number`,`title`,`create_user_id`,`create_user_login`,`create_user_fullname`,`create_date`,`create_host`,`mod_user_id`,`mod_login`,`mod_host`) VALUES (:number,:title,:userid,:username,:nazwiskoimie,:aktualnadata,:ra,:userid2,:username2,:ra2)",$sql1_data);
            $this->lastStageId =  $this->dbLink->lastInsertId(); /* public PDO::lastInsertId ( string $name = null ) : string */
            $this->Log->log(0,"[".__METHOD__."] LAST INSERTED ID: ".$this->lastStageId ); //
            array_map(array($this, 'insertStageElement'),$this->stageData);
            $this->dbLink->runQuery();
            $this->dbLink->commit();  //PHP 5 and new
	}
	catch (PDOException $e)
	{
            $this->dbLink->rollback(); 
            throw new Exception("[".__METHOD__."] DATABASE ERROR: ".$e->getMessage(),1);
	}     
    }
    private function insertStageElement($value){
        $this->Log->log(0,"[".__METHOD__."]");
        $value[':idproject']=array($this->lastStageId,'INT');
        /* REMOVE FAKE ID */
        UNSET($value[':id']);
        self::addInsertAddOns($value);
        $this->dbLink->setQuery("INSERT INTO `slo_projekt_etap_ele` (`id_projekt_etap`,`value`,`file_selected`,`file_position`,`create_user_id`,`create_user_login`,`create_user_fullname`,`create_date`,`create_host`,`mod_user_id`,`mod_login`,`mod_host`) VALUES (:idproject,:value,:file,:fileposition,:userid,:username,:nazwiskoimie,:aktualnadata,:ra,:userid2,:username2,:ra2)",$value);
    }
    private function addInsertAddOns(&$data){
        $addOns=array(
                    ':userid'=>array($_SESSION["userid"],'INT'),
                    ':username'=>array($_SESSION["username"],'STR'),
                    ':nazwiskoimie'=>array($_SESSION["nazwiskoImie"],'STR'),
                    ':aktualnadata'=>array(CDT,'STR'),
                    ':ra'=>array(RA,'STR'),
                    ':userid2'=>array($_SESSION["userid"],'INT'),
                    ':username2'=>array($_SESSION["username"],'STR'),
                    ':ra2'=>array(RA,'STR')
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    private function updateProjectStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray['id']=intval($this->inpArray['id']);
        $this->inpArray['number']=intval($this->inpArray['number']);
        $this->inpArray['title']=htmlentities(nl2br($this->inpArray['title']), ENT_QUOTES,'UTF-8',FALSE);
       
        $sql1_data=array(
                    ':id'=>array($this->inpArray['id'],'INT'),
                    ':number'=>array($this->inpArray['number'],'INT'),
                    ':title'=>array($this->inpArray['title'],'STR'),
        );
        self::addUpdateAddOns($sql1_data);
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap` SET `number`=:number,`title`=:title,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_date`=:mod_date,`mod_host`=:mod_host WHERE `id`=:id",$sql1_data);
        $this->Log->log(0,"[".__METHOD__."] UPDATE PROJECT ID: ".$this->inpArray['id'] ); //
        self::manageStageElement();
        $this->dbLink->runTransaction();
        Throw New Exception ("[".__METHOD__."] TEST: ",0);
    }
    private function updateStageElement($value){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$value);
        $value[':id_projekt_etap']=[$this->inpArray['id'],'INT'];
        self::addUpdateAddOns($value);
        $this->Log->logMulti(2,$value);
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap_ele` SET `value`=:value,`file_selected`=:file,`file_position`=:fileposition,`mod_user_id`=:mod_user_id,`mod_login`=:mod_login,`mod_host`=:mod_host,`mod_date`=:mod_date WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function deleteStageElement($value){
        $this->Log->log(0,"[".__METHOD__."]");
        $value[':id_projekt_etap']=[$this->inpArray['id'],'INT'];
        self::addDeleteAddOns($value);
        $this->Log->logMulti(0,$value);
        $this->dbLink->setQuery("UPDATE `slo_projekt_etap_ele` SET `wsk_u`='1',`delete_user_id`=:delete_user_id,`delete_login`=:delete_login,`delete_fullname`=:delete_fullname,`delete_date`=:delete_date,`delete_host`=:delete_host WHERE `id_projekt_etap`=:id_projekt_etap AND `id`=:id",$value);
    }
    private function manageStageElement(){
        $this->Log->log(0,"[".__METHOD__."]");
        $found=false;
        $tmp=array();
        foreach($this->actProjectStageData['body'] as $k => $v){
            $this->Log->log(0," STAGE => ".$v['i']);
            $this->Log->logMulti(0,$this->stageData);
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
        $this->Log->log(0,"[".__METHOD__."]");
        foreach($this->stageData as $ks => $vs){
            $this->Log->log(0," SENDED STAGE ID => ".$vs[':id'][0]);
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
                    ':mod_date'=>array(CDT,'STR'),
                    ':mod_host'=>array(RA,'STR')
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    private function addDeleteAddOns(&$data){
        $addOns=array(
                    ':delete_user_id'=>array($_SESSION["userid"],'INT'),
                    ':delete_login'=>array($_SESSION["username"],'STR'),
                    ':delete_fullname'=>array($_SESSION["nazwiskoImie"],'STR'),
                    ':delete_date'=>array(CDT,'STR'),
                    ':delete_host'=>array(RA,'STR')
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    public function getNewStageSlo(){
        $this->utilities->jsonResponse(__METHOD__,'','psCreate','POST');
    }
    protected function checkDataLength($value,$label,$min,$max){
        $this->Log->log(0,"[".__METHOD__."]");
        $check=$this->utilities->checkValueLength($value,$label,$min,$max);
        if($check){
            Throw New Exception($check,0);
        }
    }
    public function setProjectStageWskB(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        self::setWskB(intval($_SESSION['userid'],10));
        $this->utilities->jsonResponse(__METHOD__,'','block','POST');
    }
    public function getProjectAllStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $return=[];
        $head=$this->dbLink->squery("SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',s.`create_user_login` as 'cu' FROM `slo_projekt_etap` s WHERE s.`id`>0 AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
        foreach($head as $v){
            /* GET STAGE BODY */
            $body=$this->dbLink->squery("SELECT s.`value` as 'v',s.`file_selected` as 'f',s.`file_position` as 'fp' FROM `slo_projekt_etap_ele` s WHERE s.`id_projekt_etap`=".$v['i']." AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
            foreach($body as $kb => $vb){
                $body[$kb]['v']=html_entity_decode($body[$kb]['v']);
            }
            array_push($return,array('i'=>$v['i'],'n'=>$v['n'],'t'=>html_entity_decode($v['t']),'cu'=>$v['cu'],'v'=>$body));
        }
        $this->utilities->jsonResponse(__METHOD__,$return,'','GET');
    }
    function __destruct(){}
}