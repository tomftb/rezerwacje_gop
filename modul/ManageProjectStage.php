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
        $data['data']=self::getAllStage();
        $data['headTitle']='Etapy';
        $this->utilities->jsonResponse($data,'');
    }
    public function getAllStage(){
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
        $this->inpArray['wskb']=$this->Items->unsetBlock($this->Items->setGetWsk('b'),'slo_project_stage','buffer_user_id',$_SESSION['userid']);
        $parm[':wsk_u']=[$this->Items->setGetWsk('d'),'STR'];
        $parm[':wsk_v']=[$this->Items->setGetWsk('v'),'STR'];
        $parm[':title']=['%'.$f.'%','STR'];
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
        return parent::getStages($where,$parm);
    }
    private function getProjectStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->brTag='&lt;br /&gt;';
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $this->data['stage']=parent::getStage($id);
        $this->Items->checkBlock($this->data['stage']['bu'],$this->data['stage']['bl'],$_SESSION['userid']);
        $this->Items->setBlock($id,"slo_project_stage","buffer_user_id",$_SESSION['userid']);
    }
    public function getProjectStageHideSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::getProjectStage();
        $this->data['slo']=$this->Items->getSlo('psHide');
        $this->utilities->jsonResponse($this->data,'psHide');  
    }
    public function getProjectStageDelSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::getProjectStage();
        $this->data['slo']=$this->Items->getSlo('psDelete');
        $this->utilities->jsonResponse($this->data,'psDelete');  
    }
    private function preapareProjectStageData($data){
        return str_replace($this->brTag,"",$data);
    }
    public function psDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        $data['stage'] = parent::getStageFullData($this->inpArray['id']);
        $Variable = new ManageProjectVariable();
        $data['variable'] = $Variable->getSimpleAll();
        $this->utilities->jsonResponseData($data);
    }
    public function psShortDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        $this->utilities->jsonResponseData(parent::getStageFullData($this->inpArray['id']));
    }
    private function setChangeState(){
        $this->data=$this->Items->setPostId();
        $this->Log->log(0,"[".__METHOD__."] POST");
        $this->Log->logMulti(0,$this->data);
        //Throw new Exception('TEST'.__LINE__,0);
        $this->data['reason']=$this->Items->setReason($this->data);
        $this->data['wskb']= $this->Items->getBufferUserId($this->data['id'],'slo_project_stage','buffer_user_id');
        $this->Items->checkBlock($this->data['wskb']['bu'],$this->data['wskb']['bl'],$_SESSION['userid']);
    }
    public function psHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setChangeState();
        parent::hideStage();
        $this->Items->setBlock($this->data['id'],"slo_project_stage","buffer_user_id",'');
        //Throw new Exception('TEST'.__LINE__,0);
        $this->utilities->jsonResponse('','cModal');
    }
    public function psDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setChangeState();
        parent::deleteStage();
        $this->Items->setBlock($this->data['id'],"slo_project_stage","buffer_user_id",'');
        $this->utilities->jsonResponse('','cModal');
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
        parent::getStage($this->inpArray['id']);
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
    public function getNewStageDefaults(){
        $type=htmlentities(nl2br(filter_input(INPUT_GET,'type')), ENT_QUOTES,'UTF-8',FALSE);
        $this->Log->log(0,"[".__METHOD__."]\r\nTYPE - ".$type);
        /* GET DEFAULT PARAMETERS */
        
        $value['list'] = parent::getStageGlossaryList();
        $value['text'] = parent::getStageGlossaryText();
        $value['image'] = parent::getStageGlossaryImage();
        /* SETUP PARAMETER */
        $parm=[];
        foreach(parent::getStageParameters('STAGE_TEXT_%') as $v){
            //print_r($v);
            $parm[$v['s']]=['n'=>$v['n'],'v'=>$v['v']];
            //$value['text']['parameter']
        };
        $value['text']['parameter']=$parm;
        $parm=[];
        foreach(parent::getStageParameters('STAGE_LIST_%') as $v){
            //print_r($v);
            $parm[$v['s']]=['n'=>$v['n'],'v'=>$v['v']];
        }
        $value['list']['parameter']=$parm;
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
        //$this->Log->logMulti(0,filter_input(INPUT_POST,'stage'));
        $this->data=json_decode(filter_input(INPUT_POST,'stage'));
        //$this->Log->log(0,$this->data);
        $this->error='';
        $prefix="";
        if(!is_object($this->data)){
            Throw New Exception ('POST DATA IS NOT A OBJECT',1);
        }
        if(!property_exists($this->data,'data')){
            /* NO SECTION */
            Throw New Exception ('POST DATA PROPERTY NOT EXIST',1);
        }
        if(!property_exists($this->data,'section')){
            /* NO SECTION */
            Throw New Exception ('POST SECTION PROEPRTY NOT EXIST',1);
        }
        self::checkValue('title',$prefix);
        self::checkValue('departmentId',$prefix);
        self::checkValue('departmentName',$prefix);
        $this->error.=$prefix.$this->utilities->checkValueLength($this->data->data->title,'[title]',1,1024);
        if($this->error){
            Throw New Exception ($this->error,0);
        }
        parent::manageStage();  
        //self::getprojectsstagelike();
        $this->utilities->jsonResponse('','Zapis się powiódł');   
    }
    private function checkValue($key='',&$prefix){
        $this->Log->log(0,"[".__METHOD__."]\r\nKEY - ".$key); 
        
        //$this->data
        if(!property_exists($this->data->data,$key)){
            Throw New Exception ('NO `'.$key.'` KEY IN POST',1);
        }
        /* REMOVE WHITE CHARACTER */
        $this->data->$key=trim($this->data->data->$key);

        if($this->data->data->$key===''){
            $this->error.=$prefix.'['.$key.'] VALUE IS EMPTY!';
            $prefix='<br/>';
        }
    }
    public function uploadStageImage(){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $File = New FileImage();
        $File->setUploadDir(TMP_UPLOAD_DIR);
        $File->setMaxFileSize(20971520);
        $File->setAcceptedFileExtension(array(
                        'image/bmp',
                        'image/jpeg',
                        'image/png'
                        ));
        $File->setFileNamePrefix('stageImage_');
        $Error = $File->getErr();
        $this->Log->log(0,$File->getLog());
        if($Error){
            $this->Log->log(0,"[".__METHOD__."] ERROR EXISTS"); 
            Throw New Exception ($Error,0);
        }
        $this->utilities->jsonResponse($File->getImage(),'');           
    }
    public function deleteStageImage(){
        self::deleteImage(UPLOAD_DIR);
    }
    public function deleteTmpStageImage(){
        self::deleteImage(TMP_UPLOAD_DIR);
    }
    private function deleteImage($dir=''){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $POST = filter_input_array(INPUT_POST);
        $this->Log->log(0,$POST); 
        if(empty($POST)){
            Throw New Exception (__METHOD__.' No File to remove',1); 
        }
        array_walk($POST,['File','deleteFile'],$dir);
        $this->utilities->jsonResponse('',''); 
    }
    public function getTmpStageImage(){
        $this->Log->log(0,"[".__METHOD__."]");        
        //FileDownload::getFile(TMP_UPLOAD_DIR,filter_input(INPUT_GET,"file"));
        FileShow::getFile(TMP_UPLOAD_DIR,filter_input(INPUT_GET,"file")); 
    } 
    public function getStageImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        //FileDownload::getFile(UPLOAD_DIR,filter_input(INPUT_GET,"file"));
        FileShow::getFile(UPLOAD_DIR,filter_input(INPUT_GET,"file")); 
    } 
}