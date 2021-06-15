<?php
abstract class DatabaseProjectReport{
    
}

interface InterfaceProjectReport{
    
}

final class manageProjectReport extends DatabaseProjectReport implements InterfaceProjectReport{
    private $files=[];
    private $response;
    private $inpArray=[];
    private $documentName='';
    private $idProject=0;
    private $reportData=[];
    private $dbLink;
    private $Log;
     
    public function __construct(){
        $this->response=NEW Response('Project');
        $this->utilities=NEW utilities();
        $this->Log=Logger::init();
        $this->dbLink=LoadDb::load();
    }
    public function setProjectReportDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        /* parse data */
        if(empty($this->inpArray)){ $this->response->setError(0,'NO STAGE SELECTED');}
        /* parse file */
        self::uploadFiles(APP_ROOT.UPLOAD_DIR,UPLOAD_DIR); 
        /* create Report */
        self::createDocument();
        return($this->response->setResponse(__METHOD__,$this->documentName,'downloadReportDoc','POST'));
    }
    public function setProjectReportImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::uploadFiles(APP_URL."router.php?task=showProjectReportFile&dir=".TMP_UPLOAD_DIR."&file=",TMP_UPLOAD_DIR); 
        return($this->response->setResponse(__METHOD__,$this->files,'showStagePreview','POST')); 
    }
    public function getProjectReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $stage=new manageProjectStage();
        $stDdata=$stage->getProjectAllStage();
        $this->Log->logMulti(2,$stDdata['data']['value']);
        return($this->response->setResponse(__METHOD__, ['id'=>filter_input(INPUT_GET,'id'),'data'=>$stDdata['data']['value']],'pReportOff','POST')); 
    }
    private function uploadFiles($linkToFile='',$uploadDir=''){
        if($this->response->getError()) { return false;}
        $this->modul['FILE']=NEW file();
        $this->modul['FILE']->setUrl($linkToFile);
        $this->modul['FILE']->setNewFileName($_SESSION['uid']);
        $this->modul['FILE']->setUploadDir(APP_ROOT.$uploadDir);
        $this->modul['FILE']->setAcceptedFileExtension(array('image/jpeg'));
        $this->modul['FILE']->setMaxFileSize(100000);
        $this->modul['FILE']->uploadFiles();
        $this->Log->log(0,$this->modul['FILE']->getLog());
        /* IF ERROR EXIST */
        if($this->modul['FILE']->getErr()){ throw New Exception('FILES ERROR => '.$this->modul['FILE']->getErr(),0);}
        $this->files=$this->modul['FILE']->getUploadFiles();
    }
    public function setProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* GET FILES */
        self::uploadFiles('',UPLOAD_DIR); 
        /* SET POST */
        self::setReportData();
        /* PARSE POST DATA */
        self::parseReportData();
        /* ADD DATA TO DB*/
        self::addProjectReportData();
        $this->response->setError(0,"[".__METHOD__."][".__LINE__."] TEST ERROR");
        return($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    private function setReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Log->logMulti(2,$this->inpArray,"POST");  
        /* SET PROJECT ID */
        self::setProjectId();
        if(empty($this->inpArray)){ throw New Exception('NO STAGE SELECTED',0);}
    }
    private function addProjectReportData(){
        $sql[':idproject']=[$this->idProject,'INT'];
        self::sqlInsertAddOns($sql);
        array_walk($this->reportData,array($this,'insertReportToDB'),$sql);
    }
    private function createDocument(){
        if($this->response->getError()) { return false;}
        /* create doc */
        $doc=new createDoc($this->inpArray,$this->files,'ProjectReport1','.docx');
        $doc->createProjectStageReport();
        $this->response->setError(0,$doc->getError());
        $this->documentName=$doc->getDocName();
    }
    private function setProjectId(){
        if(!array_key_exists('id', $this->inpArray)){ throw New Exception('NO ID KEY IN POST',1);}
        $this->idProject=$this->inpArray['id'];
        UNSET($this->inpArray['id']);
    }
    private function parseReportData(){
        foreach($this->inpArray as $k => $v){
            if(self::parseKeyValue($k,$v)){
                UNSET($this->inpArray[$k]);
            }
        }
        /* CHECK REPORT DATA KEYS */
        array_map([$this,'checkReportKeys'],$this->reportData);
        /* ADD FILE TO Report DATA */
        self::addFileToReportData();
        $this->Log->logMulti(0,$this->reportData);
        if(!empty($this->inpArray) ||  !empty($this->files)){ 
            $this->Log->logMulti(0,$this->inpArray,"_POST:");
            $this->Log->logMulti(0,$this->files,'_FILES:');
            throw New Exception('SOME EXTRA DATA SENDED VIA POST / FILES => WRONG KEY?',1);
        }
    }
    private function checkReportKeys($v){
        $this->Log->log(2,"[".__METHOD__."]");
        if(count($v)!==3){
            $this->Log->logMulti(0,$v,__METHOD__);
            throw New Exception('WRONG INPUT POST (TITLE,NUMBER,DATA)COUNT, WRONG KEYS NAME?',1);
        }
        foreach($v['d'] as $data){
            if(count($data)!==2){
                $this->Log->logMulti(0,$v['d'],__METHOD__);
                throw New Exception('WRONG INPUT FILEPOSITION/VALUE POST COUNT, WRONG KEYS NAME?',1); 
            }
        }
    }
    private function parseKeyValue($k,$v){
        if(preg_match('/^\d*\d+-n$/',$k) || preg_match('/^\d*\d+-t$/',$k)){
            $this->Log->log(2,"FOUND NUMBER / TITLE => ${k} => ${v}");
            $id=explode('-',$k);
            $this->reportData[$id[0]][$id[1]]=$v;//$id[1]
            return true;
        }
        if(preg_match('/^\d*\d+-\d*\d+-fileposition$/',$k) || preg_match('/^\d*\d+-\d*\d+-value/',$k)){
            $this->Log->log(2,"FOUND FILEPOSITION / VALUE => ${k} => ${v}");
            $id=explode('-',$k);
            $this->reportData[$id[0]]['d'][$id[1]][$id[2]]=$v;
            return true;
        }
        return false;
    }
    private function addFileToReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* CHECK AND ADD FILE FROM $this->files */

        foreach($this->reportData as $id => $data){ 
            foreach($data['d'] as $key => $value){
                $this->Log->log(2,'reportDataKEY => '.$key);
                /* ADD EMPTY */
                $this->reportData[$id]['d'][$key]['fileData']='';
            }  
        } 
        $this->Log->logMulti(0,$this->reportData,'FILL-KEYS');
        array_walk($this->files,array($this,'assignFileFromFiles'));      
    }
    private function assignFileFromFiles($v,$k){
        $this->Log->logMulti(0,$this->files);
        $fileId=explode('-',$k);
        if(preg_match('/^\d*\d+-\d*\d+-fileData/',$k) && isset($this->reportData[$fileId[0]]['d'][$fileId[1]])){
            $this->Log->log(2,"FOUND FILE AND reportData key Exist => ${k} => ${v}");
            $this->reportData[$fileId[0]]['d'][$fileId[1]][$fileId[2]]=$v;
            UNSET($this->files[$k]);    
        }
    }
    private function sqlInsertAddOns(&$data){
        $this->utilities->mergeArray($data,[
                ':userid'=>[$_SESSION["userid"],'INT'],
                ':userlogin'=>[$_SESSION["username"],'STR'],
                ':userfullname'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':useremail'=>[$_SESSION["mail"],'STR'],
                ':createdate'=>[CDT,'STR'],
                ':createhost'=>[RA,'STR']
        ]);
    }
    private function insertReportToDB($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."][${key}]");
        $sql[':stageId']=[$key,'INT'];
        $sql[':number']=[$value['n'],'INT'];
        $sql[':title']=[$value['t'],'STR'];
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->newQuery("INSERT INTO `projekt_etap` (`idProject`,`stageId`,`number`,`title`,`create_user_id`,`create_user_login`,`create_user_full_name`,`create_user_email`,`create_date`,`create_host`) VALUES (:idproject,:stageId,:number,:title,:userid,:userlogin,:userfullname,:useremail,:createdate,:createhost)",$sql);
            self::insertReportValue($value['d']);
            $this->dbLink->commit();  //PHP 5 and new
	}
	catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception("DATABASE ERROR: ".$e->getMessage(),1); 
	} 
    }
    private function insertReportValue($value){
        $this->Log->log(0,"[".__METHOD__."]");
        $sql[':idProjectStage']=[$this->dbLink->lastInsertId(),'INT'];/* public PDO::lastInsertId ( string $name = null ) : string */
        self::sqlInsertAddOns($sql);
        array_walk($value,array($this,'insertReportValueToDB'),$sql);      
    }
    private function insertReportValueToDB($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."][${key}]");
        $sql[':valueId']=[$key,'INT'];
        $sql[':fileposition']=[$value['fileposition'],'STR'];
        $sql[':value']=[$value['value'],'STR'];
        $sql[':file']=[$value['fileData'],'STR']; 
        $this->dbLink->newQuery("INSERT INTO `projekt_etap_wartosc` (`idProjectStage`,`valueId`,`value`,`fileposition`,`file`,`create_user_id`,`create_user_login`,`create_user_full_name`,`create_user_email`,`create_date`,`create_host`) VALUES (:idProjectStage,:valueId,:value,:fileposition,:file,:userid,:userlogin,:userfullname,:useremail,:createdate,:createhost)",$sql);
    }
}