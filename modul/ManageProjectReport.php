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
        self::uploadFiles(APP_ROOT.UPLOAD_PROJECT_REPORT_IMG_DIR,UPLOAD_PROJECT_REPORT_IMG_DIR); 
        /* create Report */
        /* PARSE ACTUALL FILE WITH DELETE CHECKBOX AND INSERTED FILE*/
        $this->Parser=ParserProjectReport::init();
        $this->Parser->parseDocImage($this->inpArray,$this->files);
        $this->inpArray=$this->Parser->getPost();
        $this->files=$this->Parser->getFiles();    
        $this->Log->LogMulti(0,$this->inpArray,__METHOD__);
        //sleep(10);
        //Throw New Exception (__METHOD__.__LINE__.' TEST ERROR',0);
        self::createDocument();
        
        $this->utilities->jsonResponse($this->documentName,'downloadProjectReportDoc');
    }
    public function setProjectReportImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::uploadFiles(APP_URL."router.php?task=showProjectTmpReportFile&file=",TMP_UPLOAD_DIR); 
        $this->utilities->jsonResponse($this->files,'showReportPreview'); 
    }
    public function getProjectReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        $stage=new manageProjectStage();
        $v['id']=$this->inpArray['id'];
        $v['data']=$stage->getAllStage();
        $v['act']=parent::getProjectStage(['idp'=>[$this->inpArray['id'],'INT']]);
        $this->utilities->jsonResponse($v,'pReportOff'); 
    }
    public function genProjectReportTestDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $post=filter_input_array(INPUT_POST);
        /* parse data */
        if(empty($post)){ Throw New Exception ('NO STAGE REPORT DATA',0);}
        if(!array_key_exists('stage', $post)){Throw New Exception ('POST STAGE DATA KEY NOT EXIST',1);}
        //$this->inpArray=json_decode($post['stage']);
        //print_r($this->inpArray);
        
        $doc = new createDoc(json_decode($post['stage']),[],'TestProjectStage','.docx',UPLOAD_PROJECT_REPORT_DOC_DIR);
        $doc->genReportStage();
        //echo "DOC NAME: ".$doc->getDocName();
        
        //FileDownload::getFile(APP_ROOT.UPLOAD_PROJECT_DOC_DIR,$doc->getDocName());
        $this->utilities->jsonResponse($doc->getDocName(),'downloadProjectReportDoc');
        
        //$this->utilities->jsonResponse('','cModal');
       
        //$this->utilities->jsonResponse($doc->getDocName(),'downloadProjectDoc');
    }
    private function uploadFiles($linkToFile='',$uploadDir=''){
        $this->modul['FILE']=NEW File();
        $this->modul['FILE']->setUrl($linkToFile);
        //$this->modul['FILE']->setNewFileName($_SESSION['uid']);
        $this->modul['FILE']->setFileNamePrefix('reportImage');
        $this->modul['FILE']->setUploadDir($uploadDir);
        $this->modul['FILE']->setAcceptedFileExtension(['image/jpeg','image/png','image/jpg']);
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
        self::uploadFiles('',UPLOAD_PROJECT_REPORT_IMG_DIR); 
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
        /* Throw New Exception('TEST',0); */
        $this->utilities->jsonResponse('','cModal');
    }
    private function setReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Log->logMulti(0,$this->inpArray,"POST");  
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
        $this->Log->log(0,"[".__METHOD__."]");
        /* create doc */
        $doc=new createDoc($this->inpArray,$this->files,'ProjectReport1','.docx',APP_ROOT.UPLOAD_PROJECT_REPORT_DOC_DIR);
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
        $this->Log->logMulti(0,$this->files,"FILE");
        foreach($this->files as $k => $v){
            
            if($this->Parser->assignFileFromFiles($k,$v,$this->reportData)){
                UNSET($this->files[$k]);
            }
        }
    }
    public function downloadProjectReportDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        FileDownload::getFile(UPLOAD_PROJECT_REPORT_DOC_DIR,filter_input(INPUT_GET,"file"));
    } 
    public function downloadProjectReportImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        FileDownload::getFile(UPLOAD_PROJECT_REPORT_IMG_DIR,filter_input(INPUT_GET,"file"));
    }
}