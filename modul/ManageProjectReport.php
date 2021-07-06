<?php
interface InterfaceProjectReport{
    public function setProjectReportDoc();
    public function setProjectReportImage();
    public function getProjectReportData();
    public function setProjectReport();
}
final class ManageProjectReport extends DatabaseProjectReport implements InterfaceProjectReport{
    private $files=[];
    private $inpArray=[];
    private $documentName='';
    private $idProject=0;
    private $reportData=[];
    private $Log;
    private $Parser;
    
    public function __construct(){
        parent::__construct();
        $this->Log=Logger::init(__METHOD__);
        $this->utilities=NEW Utilities();
    }
    public function setProjectReportDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        /* parse data */
        if(empty($this->inpArray)){ Throw New Exception ('NO STAGE SELECTED',0);}
        /* parse file */
        self::uploadFiles(APP_ROOT.UPLOAD_DIR,UPLOAD_DIR); 
        /* create Report */
        self::createDocument();
        $this->utilities->jsonResponse(__METHOD__,$this->documentName,'downloadReportDoc','POST');
    }
    public function setProjectReportImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::uploadFiles(APP_URL."router.php?task=showProjectReportFile&dir=".TMP_UPLOAD_DIR."&file=",TMP_UPLOAD_DIR); 
        $this->utilities->jsonResponse(__METHOD__,$this->files,'showStagePreview','POST'); 
    }
    public function getProjectReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $stage=new manageProjectStage();
        $this->utilities->jsonResponse(__METHOD__,['id'=>filter_input(INPUT_GET,'id'),'data'=>$stage->getAllStage()],'pReportOff','POST'); 
    }
    private function uploadFiles($linkToFile='',$uploadDir=''){
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
        /* ADD FILE TO Report DATA */
        self::addFileToReportData();
        $this->Log->logMulti(2,$this->reportData);
        self::checkIsInputEmpty();
        /* ADD DATA TO DB -> DatabaseProjectReport class*/
        parent::addReport($this->idProject,$this->reportData);
        // Throw New Exception('TST',0);
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    private function setReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Log->logMulti(2,$this->inpArray,"POST");  
        /* SET PROJECT ID */
        self::setProjectId();
        if(empty($this->inpArray)){ throw New Exception('NO STAGE SELECTED',0);}
    }
    private function checkIsInputEmpty(){
        if(!empty($this->inpArray) ||  !empty($this->files)){ 
            $this->Log->logMulti(0,$this->inpArray,"_POST:");
            $this->Log->logMulti(0,$this->files,'_FILES:');
            throw New Exception('SOME EXTRA DATA SENDED VIA POST / FILES => WRONG KEY?',1);
        }
    }
    private function createDocument(){
        /* create doc */
        $doc=new createDoc($this->inpArray,$this->files,'ProjectReport1','.docx');
        $doc->createProjectStageReport();
        $this->documentName=$doc->getDocName();
    }
    private function setProjectId(){
        if(!array_key_exists('id', $this->inpArray)){ throw New Exception('NO ID KEY IN POST',1);}
        $this->idProject=$this->inpArray['id'];
        UNSET($this->inpArray['id']);
    }
    private function parseReportData(){
        $this->Parser=ParserProjectReport::init();
        foreach($this->inpArray as $k => $v){
            if($this->Parser->parseKeyValue($k,$v,$this->reportData)){
                UNSET($this->inpArray[$k]);
            }
        }
        /* CHECK REPORT DATA KEYS */
        array_map([$this->Parser,'checkReportKeys'],$this->reportData);
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
        foreach($this->files as $k => $v){
            if($this->Parser->assignFileFromFiles($k,$v,$this->reportData)){
                UNSET($this->files[$k]);
            }
        }
    }
}