<?php
interface InterfaceProjectReport{
    public function getProjectReportDoc();
    public function setProjectReportImage();
    public function getProjectReportData();
    public function setProjectReport();
}
final class ManageProjectReport extends ManageProjectReportDatabase implements InterfaceProjectReport{
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
    }
    
    public function getProjectReportDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        
        $variable = New ManageProjectVariable();
        $post=filter_input_array(INPUT_POST);
        $stageExists=false;
        /* parse data */
        if(empty($post)){ Throw New Exception ('NO PROJECT REPORT DATA',0);}
        $dataJson=json_decode($post['data']);
        //print_r($dataJson);
        if(!property_exists($dataJson,'data')){Throw New Exception ('POST PROJECT REPORT data KEY NOT EXIST',1);}
        if(!property_exists($dataJson,'stage')){Throw New Exception ('POST PROJECT REPORT stage KEY NOT EXIST',1);}
        if(!property_exists($dataJson,'footer')){Throw New Exception ('POST PROJECT REPORT footer KEY NOT EXIST',1);}
        if(!property_exists($dataJson,'heading')){Throw New Exception ('POST PROJECT REPORT heading KEY NOT EXIST',1);}
        //echo gettype($dataJson->stage)."\n"; 
        foreach($dataJson->stage as $s){
                $stageExists=true;
                break;
        }
        if(!$stageExists){
            //Throw New Exception ('NO STAGE SELECTED',2);
            $this->Utilities->jsonResponse('','NO STAGE SELECTED');
            return true;
        }
        
        /* SWAP VARIABLE PROPERTY KEY WITH VALUE */
        foreach($dataJson->stage as $s){
            //print_r($s);
            $variable->parsePartVariable($s);
        }
        foreach($dataJson->heading as $s){
            //print_r($s);
            $variable->parsePartVariable($s);
        }
        foreach($dataJson->footer as $s){
            //print_r($s);
            $variable->parsePartVariable($s);
        }
        $Doc = new createDoc($dataJson,[],'ProjectReport','.docx',UPLOAD_PROJECT_REPORT_DOC_DIR);
        $Doc->genProjectReport();
        $this->Utilities->jsonResponse($Doc->getDocName(),'');
    }
    private function preareReportTestDoc(){
        $post=filter_input_array(INPUT_POST);
         /* parse data */
        if(empty($post)){ Throw New Exception ('NO STAGE REPORT DATA',0);}
        if(!array_key_exists('stage', $post)){Throw New Exception ('POST STAGE DATA KEY NOT EXIST',1);}
        $dataJson=json_decode($post['stage']);
         /* SWAP VARIABLE PROPERTY KEY WITH VALUE */
        $variable = New ManageProjectVariable();
        $variable->parsePartVariable($dataJson);
        return $dataJson;
    }
    public function genProjectReportTestDocFooter(){
        $this->Log->log(0,"[".__METHOD__."]");
        $doc = new createDoc(self::preareReportTestDoc(),[],'TestProjectStage','.docx',UPLOAD_PROJECT_REPORT_DOC_DIR);
        $doc->genReportStageFooter();
        $this->Utilities->jsonResponse($doc->getDocName(),'downloadProjectReportDoc');
    }
    public function genProjectReportTestDocHeading(){
        $this->Log->log(0,"[".__METHOD__."]");
        $doc = new createDoc(self::preareReportTestDoc(),[],'TestProjectStage','.docx',UPLOAD_PROJECT_REPORT_DOC_DIR);
        $doc->genReportStageHeading();
        $this->Utilities->jsonResponse($doc->getDocName(),'downloadProjectReportDoc');
    }
     public function genProjectReportTestDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $doc = new createDoc(self::preareReportTestDoc(),[],'TestProjectStage','.docx',UPLOAD_PROJECT_REPORT_DOC_DIR);
        $doc->genReportStage();
        $this->Utilities->jsonResponse($doc->getDocName(),'downloadProjectReportDoc');
    }
    public function setProjectReportImage(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::uploadFiles(APP_URL."router.php?task=showProjectTmpReportFile&file=",TMP_UPLOAD_DIR); 
        $this->Utilities->jsonResponse($this->files,'showReportPreview'); 
    }
    private function getProjectReportFullData($id=0){
        $this->Log->log(0,"[".__METHOD__."]");
        $stage=new ManageProjectStage();
        $v['id']=$id;
        $v['all']=$stage->getAllStage('b');
        $v['footer']=$stage->getAllStage('f');
        $v['heading']=$stage->getAllStage('h');
        $v['act']=parent::getReport(['id_project'=>[$id,'INT']]);
        $v['department']=$this->DatabaseUtilities->getUserDepartment($_SESSION['userid']);
        return $v;
    }
    public function getProjectReportData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities->setGet('id',$this->inpArray);
        $this->Utilities->jsonResponse(self::getProjectReportFullData($this->inpArray['id']),'pReportOff'); 
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
        $this->Utilities->jsonResponse('','cModal');
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
    public function saveProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        $Report=json_decode(filter_input(INPUT_POST,'data'));
        //$this->Log->log(0,$Report);
        $idReport=parent::updateReport($Report);
        $this->Utilities->jsonResponse(parent::getReportById(['id'=>[$idReport,'INT']]),'Zapis się powiódł'); 
    }
}