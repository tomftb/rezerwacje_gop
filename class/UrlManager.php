<?php
final class UrlManager{
   
    private $Log;
    private $urlData=[];
    private $taskPerm=[];
    private $returnType='json';
    private $avaliableFunction=[
        "task"=>"task"
    ];
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
        ['getProjectDefaultValues','ADD_PROJ','user'],
        ['getProjectCloseSlo','CLOSE_PROJ','sys'],
        ['getProjectDeleteSlo','DEL_PROJ','sys'],
        ['getProjectEmailData','EMAIL_PROJ','user'],
        ['pEmail','EMAIL_PROJ','user'],
        ["getAllParm",'LOG_INTO_PARM','user'],
        ['updateParm','EDIT_PARM','user'],
        ["getAllPerm",'LOG_INTO_PERM','user'],
        ["getUsersWithPerm",'SHOW_PERM_USER','user'],
        ['uPermUsers','EDIT_PERM_USER','user'],
        ["getAllRole",'LOG_INTO_ROLE','user'],
        ["getNewRoleSlo",'ADD_ROLE','user'],
        ["cRole",'ADD_ROLE','user'],
        ["getUsersWithPerm",'SHOW_PERM_USER','user'],
        ['rEdit','EDIT_ROLE','user'],
        ['getRoleDetails','SHOW_ROLE','user'],
        ['getRoleUsers','DEL_ROLE','uer'],
        ['rDelete','DEL_ROLE','user'],
        ["getUsersLike",'LOG_INTO_USER','user'],
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
        ["getEmployeesLike","LOG_INTO_EMPL","user"],
        ["getEmployeesSpecSlo",'ADD_EMPL','user'],
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
        ['downloadProjectReportImage','GEN_PROJ_REP_DOC','user','file'],
        ['showProjectReportFile','GEN_PROJ_REP_DOC','user','file'],
        ['setProjectReport','SAVE_PROJ_REPORT','user','json'],
        ['getModulClusterDefaultData','LOG_INTO_CLUSTR',''],
        ['updateClustr','EDIT_CLUSTR',''],
        ['getModulUsersDefaults','LOG_INTO_USER',''],
        ['getModulProjectDefaults','LOG_INTO_PROJ',''],
        ['getModulPermissionsDefaults','LOG_INTO_PERM',''],
        ['getModulRoleDefaults','LOG_INTO_ROLE',''],
        ['getModulEmployeesDefaults','LOG_INTO_EMPL',''],
        ['getModulParametersDefaults','LOG_INTO_PARM',''],
        ['getModulStageDefaults','LOG_INTO_STAGE','']
    ];
        
    public function __construct(){
        $this->Log = Logger::init(__FILE__);
    }
    
    public function setUrlData(){
        $this->Log->log(2,"[".__METHOD__."]");
        $GET=filter_input_array(INPUT_GET);
        if(empty($GET)){ 
           Throw New Exception("No task to run",0);
        }
        foreach($GET as $key => $value){
            $this->urlData[$key]=$value;
            $this->Log->log(2,"[".__METHOD__."] $key => $value");
        }
        self::checkUrlFunction();
        self::checkUrlTask();
    }
    private function checkUrlFunction(){
        $this->Log->log(0,"[".__METHOD__."]");
        if(!array_key_exists($this->avaliableFunction["task"], $this->urlData)){  
            $this->Log->logMulti(2,$this->urlGetData,__LINE__."::".__METHOD__." urlGetData");
            Throw New Exception('Wrong function to execute',0);
        }
    }
    private function checkUrlTask()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $found=false;
        foreach($this->avaliableTask as $task)
        {
            $this->Log->logMulti(2,$task);
            if($task[0]==$this->urlData['task']){
                $this->Log->log(0,"[".__METHOD__."] task in avaliableTask => ".$task[0]); 
                self::setTaskPerm($task[1]);
                self::setTaskPermType($task[2]);
                self::setReturnType($task);
                
                $found=true;
                break;
            }   
        }
        if(!$found){
            Throw New Exception(__METHOD__.' Task not exists => '.$this->urlData['task'],0);
        }
       
    }
    private function setReturnType($task){
        if(array_key_exists(3, $task)){
            $this->returnType=$task[3];
        }
    }
    private function setTaskPerm($perm){
        $this->Log->log(0,"[".__METHOD__."]".$perm);
        $this->taskPerm['name']=$perm;
    }
    private function setTaskPermType($type){
        $this->taskPerm['type']=$type;
    }
    public function getUrlReturnType(){
        return $this->returnType;
    }
    public function getUrlPerm(){
        $this->Log->log(0,"[".__METHOD__."]".$this->taskPerm['name']);
        return $this->taskPerm['name'];
    }
    public function getUrlTask(){
        return $this->urlData['task'];
    }
    function __destruct(){}
}
