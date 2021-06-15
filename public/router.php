<?php
session_start();
define('DR',filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/..");
require(DR."/.cfg/config.php");
require(DR."/function/autoLoader.php");

class Router extends validPerm
{
    private $avaliableFunction=[
        "task"=>"task"
    ];
    private $urlGetData=[];
    private $avaliableTask=[
        ["pCreate",'ADD_PROJ','user'],
        ["pDelete",'DEL_PROJ','user'],
        ["getprojects",'LOG_INTO_PROJ','user'],
        ["getprojectslike",'LOG_INTO_PROJ','user'],
        ["getprojectsmember",'','sys'],
        ["getprojectsleader",'','sys'],
        ["getprojectsmanager",'','sys'],
        ["getprojectgltech",'','sys'],
        ["getprojectglkier",'','sys'],
        ["getProjectTeam",'SHOW_TEAM_PROJ','user'],
        ['pDetails','SHOW_PROJ','user'],
        ["gettypeofagreement",'','sys'],
        ["getadditionaldictdoc",'','sys'],
        ["pTeamOff",'EDIT_TEAM_PROJ','user'],
        ["getallavaliableemployeeprojsumperc",'','user'],
        ["pTeam",'EDIT_TEAM_PROJ','user'],
        ['pDoc','SHOW_DOK_PROJ','user'],
        ['pClose','CLOSE_PROJ','user'],
        ['pDocEdit','EDIT_DOK_PROJ','user'],
        ['pEdit','EDIT_PROJ','user'],
        ['pPDF','GEN_PDF_PROJ','user'],
        ['downloadProjectPdf','GEN_PDF_PROJ','user','file'],
        ['getProjectDefaultValues','','sys'],
        ['getProjectCloseSlo','','sys'],
        ['getProjectDeleteSlo','','sys'],
        ['getProjectEmailData','EMAIL_PROJ','user'],
        ['pEmail','EMAIL_PROJ','user'],
        ["getAllParm",'LOG_INTO_PARM','user'],
        ['updateParm','EDIT_PARM','user'],
        ["getAllPerm",'LOG_INTO_UPR','user'],
        ["getUsersWithPerm",'SHOW_PERM_USER','user'],
        ['uPermUsers','EDIT_PERM_USER','user'],
        ["getAllRole",'LOG_INTO_ROLE','user'],
        ["getNewRoleSlo",'ADD_ROLE','user'],
        ["cRole",'ADD_ROLE','user'],
        ["getUsersWithPerm",'SHOW_PERM_USER','user'],
        ['rEdit','EDIT_ROLE','user'],
        ['getRoleDetails','SHOW_ROLE','user'],
        ['getRoleUsers','SHOW_ROLE_USERS','sys'],
        ['rDelete','DEL_ROLE','user'],
        ["getUsersLike",'LOG_INTO_UZYT','user'],
        ["getNewUserSlo",'ADD_USER','user'],
        ["getPermSlo",'','user'],
        ["cUser",'ADD_USER','user'],
        ['getUserDel','DEL_USER','user'],
        ['getUserPerm','SHOW_PERM_USER','user'],
        ['uPerm','EDIT_PERM_USER','user'],
        ['getUserDetails','SHOW_USER','user'],
        ['getRoleSlo','','user'],
        ['eUserOn','EDIT_USER','user'],
        ['dUser','DEL_USER','user'],
        ["getEmployees",'LOG_INTO_PRAC','user'],
        ["getemployeeslike","LOG_INTO_PRAC","user"],
        ["getEmployeesSpecSlo",'','sys'],
        ["cEmployee",'ADD_EMPL','user'],
        ["getEmployeeProjects",'SHOW_PROJ_EMPL','user'],
        ['getDeletedEmployeeProjects','DEL_EMPL','user'],
        ['dEmployee','DEL_EMPL','user'],
        ['getEmployeeSpec','SHOW_ALLOC_EMPL','user'],
        ['eEmployeeSpecOn','EDIT_ALLOC_EMPL','user'],
        ['getEmployeeDetails','SHOW_EMPL','user'],
        ['eEmployeeOn','EDIT_EMPL','user'],
        ['getProjectReportData','SHOW_PROJ_REPORT','user'],
        ['getprojectsstagelike','LOG_INTO_STAGE','user'],
        ['psCreate','ADD_STAGE','user'],
        ['psEdit','EDIT_STAGE','user'],
        ['psDelete','DEL_STAGE','user'],
        ['psHide','HIDE_STAGE','user'],
        ['getProjectStageDelSlo','DEL_STAGE','user'],
        ['getProjectStageHideSlo','DEL_STAGE','user'],
        ['psDetails','SHOW_STAGE','user'],
        ['getNewStageSlo','ADD_STAGE','user'],
        ['setProjectStageWskB','EDIT_STAGE','user'],
        ['setProjectReportImage','GEN_PROJECT_REPORT','user'],
        ['setProjectReportDoc','GEN_PROJ_REP_DOC','user'],
        ['downloadReportDoc','GEN_PROJ_REP_DOC','user','file'],
        ['pGenDoc','GEN_DOC_PROJ','user'],
        ['downloadProjectDoc','GEN_DOC_PROJ','user','file'],
        ['showProjectReportFile','GEN_PROJ_REP_DOC','user','file'],
        ['setProjectReport','SAVE_PROJ_REPORT','user','json']
    ];
    private $modul=[];
    private $modulData=[];
    private $taskPerm=[];
    private $returnType='json';
    
    function __construct(){
        parent::__construct();
        parent::log(0,"[".__METHOD__."]");
        self::getUrlData();
        // CHECK FUNCTION
        if(!$this->checkUrlFunction()){
            return (parent::getError());
        }
        // CHECK PERM
        if(!$this->checkUrlTask()){
            return (parent::getError());
        }
        if($this->taskPerm['type']==='user'){
            parent::checkLoggedUserPerm('LOG_INTO_APP');
            parent::checkLoggedUserPerm($this->taskPerm['name']);    
        }
        else{
            /*
             * admin
             */
        }
       
        if(!parent::getError()){
            $this->runTask();
        }
    }

    private function getUrlData(){
        parent::log(2,"[".__METHOD__."]");
        $GET=filter_input_array(INPUT_GET);
        if(!$GET){ return false;}
        foreach($GET as $key=>$value){
            $this->urlGetData[$key]=$value;
            parent::log(0,"[".__METHOD__."] $key => $value");
        }
    }
    private function checkUrlFunction(){
        parent::log(2,"[".__METHOD__."]");
        if(array_key_exists($this->avaliableFunction["task"], $this->urlGetData)){    
            return true;
        }
        else{
            parent::setError(1,"Wrong function to execute:");
            parent::logMulti(0,$this->urlGetData,__LINE__."::".__METHOD__." urlGetData");
        }
        return false;
    }
   
    private function checkUrlTask()
    {
        parent::log(2,"[".__METHOD__."]");
        foreach($this->avaliableTask as $id =>$task)
        {
            if($task[0]==$this->urlGetData['task']){
                self::setTaskPerm($this->avaliableTask[$id][1],$this->avaliableTask[$id][2]);
                self::setReturnType($task);
                parent::log(2,"[".__METHOD__."] task in avaliableTask"); 
                return true;
            }
            
        }
        parent::setError(1,__METHOD__.' Task not exists => '.$this->urlGetData['task']);
        return false;
    }
    private function setReturnType($task){
        if(array_key_exists(3, $task)){
            $this->returnType=$task[3];
        }
    }
    private function setTaskPerm($permName='',$permType=''){
        parent::log(2,"[".__METHOD__."]");
        $this->taskPerm['name']=$permName;
        $this->taskPerm['type']=$permType;
        parent::log(2,"[".__METHOD__."] taskPerm['name'] => ".$this->taskPerm['name']." | taskPerm['type'] => ".$this->taskPerm['type']);
    }
    private function runTask()
    {
        /*
         * URUCHOM ZADANIE
         */
        self::loadModules();
        parent::log(2,"[".__METHOD__."] ".$this->urlGetData['task']);
        self::loadMethod();
    }
    private function loadModules(){
        parent::log(2,"[".__METHOD__."]");
        array_push($this->modul,new manageParameters());
        array_push($this->modul,new manageProject());       
        array_push($this->modul,new managePermission());
        array_push($this->modul,new manageRole());
        array_push($this->modul,new manageUser());
        array_push($this->modul,new manageEmployee());
        array_push($this->modul,new manageProjectStage());
        array_push($this->modul,new manageProjectReport());
    }
    private function loadMethod(){
        try { 
            /* CHEK METHOD EXIST, AND IS THERE ONLY ONE METHOD */
            self::findMethod();
            
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            parent::setError($t->getCode(),$t->getMessage(),$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            parent::setError($e->getCode(),$e->getMessage(),$e->getFile());
        }
    }
    private function findMethod(){
        $methodFound=array(); // counter
        $methodFoundCounter=0;
        foreach($this->modul as $id => $name){
            if(method_exists ( $name , $this->urlGetData['task'] )){
                array_push($methodFound,$id);
                parent::log(2,"[".__METHOD__."] METHOD FOUND IN CLASS => ".get_class($name));
                $methodFoundCounter++;
            }
        }
        if($methodFoundCounter===0){
            throw New Exception('Task not exists => '.$this->urlGetData['task'],1);
        }
        else if($methodFoundCounter>1){
            throw New Exception('Task avaliable in more than one model => '.$this->urlGetData['task'],1);
        }
        else{
            $this->modulData=$this->modul[$methodFound[0]]->{$this->urlGetData['task']}();
        }
    }
    private function parseReturnData(){
        if(parent::getError()) { return '';}
        if($this->modulData['status']===true){
            parent::setError(0,$this->modulData['info']);
        }
        else if($this->modulData['status']===false){
            // no error;
        }
        else{
            parent::setError(0,'WRONG ANSWER FROM MODULE');
        }
    }
    private function returnData(){
        if($this->returnType==='json'){
            parent::log(0,"[".__METHOD__."] RETURN JSON");
            echo json_encode($this->modulData);
        }
        else{
            parent::log(0,"[".__METHOD__."] RETURN HEADER FROM FILE");
            /* setup file */
        }
    }
    public function __destruct(){
        if(parent::getError()){
            parent::log(2,"[".__METHOD__."] ERROR EXIST: ".parent::getError());
            echo json_encode(array('status'=>1,'type'=>'POST','data'=>array(),'info'=>parent::getError()));
        }
        else{
            parent::log(2,"[".__METHOD__."] NO ERROR");
            self::returnData(); 
        }
    }
}
$router=NEW Router();