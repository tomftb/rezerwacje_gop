<?php
class ManageProjectStage extends ManageProjectStageDatabase
{
    protected $filter='';
    private $stageData=array();
    private $lastStageId=0;
    private $dbLink;
    private $actProjectStageData=array();
    private $brTag='';
    private $Items;
    

    function __construct(){
        parent::__construct();
        $this->utilities=NEW Utilities();
        $this->Items=NEW ManageProjectItems();
        /* TO DO -> MOVE dbLink tasks to get data from abstract class database */
        $this->dbLink=LoadDb::load();
    }
    function __destruct(){
        parent::__destruct();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsstagelike(){ 
        $this->Log->log(0,"[".__METHOD__."]");
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $where='';
        $parm=[];

        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $parm[':id']=array($f_int,'INT');
            $parm[':number']=array($f_int,'INT');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`id` LIKE (:id) OR s.`number` LIKE (:number) OR s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] filter not numeric ");
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`title` LIKE :title) ORDER BY s.`id` ASC";
        }
        $this->inpArray['u']=$this->Items->setGetWsk('u');
        $this->inpArray['b']=$this->Items->setGetWsk('b');
        $this->inpArray['v']=$this->Items->setGetWsk('v');
        $this->inpArray['wskb']=$this->Items->unsetBlock($this->inpArray['b'],'SLO_PROJEKT_ETAP','buffer_user_id',$_SESSION['userid']);

        $parm[':wsk_u']=array($this->inpArray['u'],'STR');
        $parm[':wsk_v']=array($this->inpArray['v'],'STR');
        $parm[':title']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
        $return['data']=parent::getStages($where,$parm);
        $return['headTitle']='Etapy';
        $this->utilities->jsonResponse($return,'runModal');
    }
    public function getProjectStageHideSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        $this->utilities->setGet('id',$this->inpArray);
        self::getProjectStageData($this->inpArray['id']);
        $this->Items->checkBlock($this->actProjectStageData['head']['bu'],$this->actProjectStageData['head']['bl'],$_SESSION['userid']);
        $this->Items->setBlock($this->inpArray['id'],"SLO_PROJEKT_ETAP","buffer_user_id",$_SESSION['userid']);
        $this->actProjectStageData['slo']=$this->Items->getSlo('psHide');
        $this->utilities->jsonResponse($this->actProjectStageData,'psHide');  
    }
    public function getProjectStageDelSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->actProjectStageData=array();
        $this->brTag='&lt;br /&gt;';
        $this->utilities->setGet('id',$this->inpArray);
        self::getProjectStageData($this->inpArray['id']);
        $this->Items->checkBlock($this->actProjectStageData['head']['bu'],$this->actProjectStageData['head']['bl'],$_SESSION['userid']);
        $this->Items->setBlock($this->inpArray['id'],"SLO_PROJEKT_ETAP","buffer_user_id",$_SESSION['userid']);
        $this->actProjectStageData['slo']=$this->Items->getSlo('psDelete');
        $this->utilities->jsonResponse($this->actProjectStageData,'psDelete');  
    }

    private function getProjectStageData($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID => $id");
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
        $this->utilities->jsonResponse($this->actProjectStageData,'psDetails');
    }
    public function psHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=$this->Items->setPostId();
        $this->inpArray['reason']=$this->Items->setReason();
        $this->inpArray['wskb']= $this->Items->getBufferUserId($this->inpArray['id'],'SLO_PROJEKT_ETAP','buffer_user_id');
        $this->Items->checkBlock($this->inpArray['wskb']['bu'],$this->inpArray['wskb']['bl'],$_SESSION['userid']);
        self::sqlHideStage();
        $this->Items->setBlock($this->inpArray['id'],"SLO_PROJEKT_ETAP","buffer_user_id",'');
        $this->utilities->jsonResponse('','cModal');
    }
    public function psDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=$this->Items->setPostId();
        $this->inpArray['reason']=$this->Items->setReason();
        $this->inpArray['wskb']= $this->Items->getBufferUserId($this->inpArray['id'],'SLO_PROJEKT_ETAP','buffer_user_id');
        $this->Items->checkBlock($this->inpArray['wskb']['bu'],$this->inpArray['wskb']['bl'],$_SESSION['userid']);
        self::sqlDeleteStage();
        $this->Items->setBlock($this->inpArray['id'],"SLO_PROJEKT_ETAP","buffer_user_id",'');
        $this->utilities->jsonResponse('','cModal');
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

    public function psCreate()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::checkInputFields();
        self::checkInputFieldsLength();
        self::createStage();
        self::addProjectStage();
        $this->utilities->jsonResponse('','cModal');
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
        $this->Items->checkBlock($this->actProjectStageData['head']['bu'],'',$_SESSION['userid']);
        self::updateProjectStage();
        $this->utilities->jsonResponse('','cModal');
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
        //Throw New Exception ("[".__METHOD__."] TEST: ",0);
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
    public function getNewStageDefaults(){
        $type=htmlentities(nl2br(filter_input(INPUT_GET,'type')), ENT_QUOTES,'UTF-8',FALSE);
        $this->Log->log(0,"[".__METHOD__."]\r\nTYPE - ".$type);
        /* GET DEFAULT PARAMETERS */
        $value['glossary'] = parent::getStageGlossary();
        /* SETUP PARAMETER */
        $parm=[];
        foreach($value['glossary']['parameter'] as $v){
            //print_r($v);
            $parm[$v['s']]=['n'=>$v['n'],'v'=>$v['v']];
        }
        $value['glossary']['parameter']=$parm;
        $this->utilities->jsonResponse($value,'createText');
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
        $this->Items->setBlock($this->inpArray['id'],"SLO_PROJEKT_ETAP","buffer_user_id",$_SESSION['userid']);
        $this->utilities->jsonResponse('','block');
    }
    public function getAllStage(){
        $data=[];
        $head=$this->dbLink->squery("SELECT s.`id` as 'i',s.`number` as 'n',s.`title` as 't',s.`create_user_login` as 'cu' FROM `slo_projekt_etap` s WHERE s.`id`>0 AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
        foreach($head as $v){
            /* GET STAGE BODY */
            /* REMOVE s.`file_selected` */
            $body=$this->dbLink->squery("SELECT s.`value` as 'v', null as 'f',s.`file_position` as 'fp' FROM `slo_projekt_etap_ele` s WHERE s.`id_projekt_etap`=".$v['i']." AND s.`wsk_v`='0' AND s.`wsk_u`='0' ORDER BY s.`id`");   
            foreach($body as $kb => $vb){
                $body[$kb]['v']=html_entity_decode($body[$kb]['v']);
            }
            array_push($data,array('i'=>$v['i'],'n'=>$v['n'],'t'=>html_entity_decode($v['t']),'cu'=>$v['cu'],'v'=>$body));
        }
        return $data;
    }
    public function getModulStageDefaults(){
        /*
         * NOT USED 04.02.2022
         */
        //$v['perm']=$_SESSION['perm'];
        //Throw New Exception (json_encode(['showTable','adasdasds']),0);
        $v['data']=$this->dbLink->squery("SELECT s.`id` as '0',s.`number` as '1',s.`title` as '2',(select e.`value` as '3' FROM `slo_projekt_etap_ele` as e WHERE e.`id_projekt_etap`=s.`id` and `wsk_u`='0' and `wsk_v`='0' ORDER BY e.`id` ASC LIMIT 0,1) as `v`,b.`login` as 'bl' FROM `slo_projekt_etap` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`wsk_u`='0' and s.`wsk_v`='0' ORDER BY s.`id` ASC");
        $v['headTitle']='Etapy';
        $this->utilities->jsonResponse($v,'showTable');
    }
    public function confirmProjectStageText(){
        $this->Log->log(0,"[".__METHOD__."]");
        //$input=filter_input_array(INPUT_POST);
        $this->Log->logMulti(0,filter_input(INPUT_POST,'stage'));
        $this->data=json_decode(filter_input(INPUT_POST,'stage'));
        
        $this->Log->logMulti(0,$this->data);
        
        parent::manageStage();
        $this->utilities->jsonResponse('','cModal');
     
        
    }
}