<?php
final class UrlManager{
   
    private $Log;
    private $urlData=[];
    private $taskPerm=[];
    private $returnType='json';
    private $availableFunction=[
        "task"=>"task"
    ];
    private $availableTask=[
        ["pCreate",'ADD_PROJ'],
        ["pDelete",'DEL_PROJ'],
        ["getprojects",'LOG_INTO_PROJ'],
        ["getprojectslike",'LOG_INTO_PROJ'],
        ["getprojectsmember",''],
        ["getprojectsleader",''],
        ["getprojectsmanager",''],
        ["getprojectgltech",''],
        ["getprojectglkier",''],
        ["getProjectTeam",'SHOW_TEAM_PROJ'],
        ['pDetails','SHOW_PROJ'],
        ["gettypeofagreement",''],
        ["getadditionaldictdoc",''],
        ["pTeamOff",'EDIT_TEAM_PROJ'],
        ["getallavailableemployeeprojsumperc",''],
        ["pTeam",'EDIT_TEAM_PROJ'],
        ['pDoc','SHOW_DOK_PROJ'],
        ['pClose','CLOSE_PROJ'],
        ['pDocEdit','EDIT_DOK_PROJ'],
        ['pEdit','EDIT_PROJ'],
        ['pPDF','GEN_PDF_PROJ'],
        ['downloadProjectPdf','GEN_PDF_PROJ'],
        ['getProjectDefaultValues','ADD_PROJ'],
        ['getProjectCloseSlo','CLOSE_PROJ'],
        ['getProjectDeleteSlo','DEL_PROJ'],
        ['getProjectEmailData','EMAIL_PROJ'],
        ['pEmail','EMAIL_PROJ'],
        ["getAllParm",'LOG_INTO_PARM'],
        ['updateParm','EDIT_PARM'],
        ["getAllPerm",'LOG_INTO_PERM'],
        ["getUsersWithPerm",'SHOW_PERM_USER'],
        ['uPermUsers','EDIT_PERM_USER'],
        ["getAllRole",'LOG_INTO_ROLE'],
        ["getNewRoleSlo",'ADD_ROLE'],
        ["cRole",'ADD_ROLE'],
        ["getUsersWithPerm",'SHOW_PERM_USER'],
        ['rEdit','EDIT_ROLE'],
        ['getRoleDetails','SHOW_ROLE'],
        ['getRoleUsers','DEL_ROLE'],
        ['rDelete','DEL_ROLE'],
        ["getUsersLike",'LOG_INTO_USER'],
        ["getNewUserSlo",'ADD_USER'],
        ["getPermSlo",''],
        ["cUser",'ADD_USER'],
        ['getUserDel','DEL_USER'],
        ['getUserPerm','SHOW_PERM_USER'],
        ['uPerm','EDIT_PERM_USER'],
        ['getUserDetails','SHOW_USER'],
        ['getRoleSlo',''],
        ['eUserOn','EDIT_USER'],
        ['dUser','DEL_USER'],
        ["getEmployeesLike","LOG_INTO_EMPL"],
        ["getEmployeesSpecSlo",'ADD_EMPL'],
        ["cEmployee",'ADD_EMPL'],
        ["getEmployeeProjects",'SHOW_PROJ_EMPL'],
        ['getDeletedEmployeeProjects','DEL_EMPL'],
        ['dEmployee','DEL_EMPL'],
        ['getEmployeeSpec','SHOW_ALLOC_EMPL'],
        ['eEmployeeSpecOn','EDIT_ALLOC_EMPL'],
        ['getEmployeeDetails','SHOW_EMPL'],
        ['eEmployeeOn','EDIT_EMPL'],
        ['getProjectReportData','SHOW_PROJ_REPORT'],
        ['getprojectsstagelike','LOG_INTO_STAGE'],
        ['psCreate','ADD_STAGE'],
        ['psEdit','EDIT_STAGE'],
        ['psDelete','DEL_STAGE'],
        ['psHide','HIDE_STAGE'],
        ['getProjectStageDelSlo','DEL_STAGE'],
        ['getProjectStageHideSlo','DEL_STAGE'],
        ['psDetails','SHOW_STAGE','user'],
        ['psShortDetails','SHOW_STAGE','user'],
        ['getNewStageDefaults','ADD_STAGE'],
        ['setProjectStageWskB','EDIT_STAGE'],
        ['setProjectReportImage','GEN_PROJECT_REPORT'],
        ['setProjectReportDoc','GEN_PROJ_REP_DOC'],
        ['downloadProjectReportDoc','GEN_PROJ_REP_DOC'],
        ['pGenDoc','GEN_DOC_PROJ','user'],
        ['downloadProjectDoc','GEN_DOC_PROJ'],
        ['downloadProjectReportImage','GEN_PROJ_REP_DOC'],
        ['showProjectReportFile','GEN_PROJ_REP_DOC'],
        ['showProjectTmpReportFile','GEN_PROJ_REP_DOC'],
        ['setProjectReport','SAVE_PROJ_REPORT'],
        ['getModulClusterDefaultData','LOG_INTO_CLUSTR'],
        ['updateClustr','EDIT_CLUSTR'],
        ['getModulUsersDefaults','LOG_INTO_USER'],
        ['getModulProjectDefaults','LOG_INTO_PROJ'],
        ['getModulPermissionsDefaults','LOG_INTO_PERM'],
        ['getModulRoleDefaults','LOG_INTO_ROLE'],
        ['getModulEmployeesDefaults','LOG_INTO_EMPL'],
        ['getModulParametersDefaults','LOG_INTO_PARM'],
        ['getModulStageDefaults','LOG_INTO_STAGE'],
        ['getProjectConstantsList','LOG_INTO_STAGE'],
        ['confirmProjectConstant','LOG_INTO_STAGE'],
        ['getprojectsconstantslike','LOG_INTO_STAGE'],
        ['getProjectConstantHideSlo','LOG_INTO_STAGE'],
        ['getProjectConstantDelSlo','LOG_INTO_STAGE'],
        ['pcDetails','LOG_INTO_STAGE'],
        ['pcHide','LOG_INTO_STAGE'],
        ['pcDelete','LOG_INTO_STAGE'],
        ['getProjectConstantDetails','LOG_INTO_STAGE'],
        ['confirmProjectStageText','LOG_INTO_STAGE'],
        ['blockConstant','LOG_INTO_STAGE'],
        ['genProjectReportTestDoc','LOG_INTO_STAGE'],
        ['uploadStageImage','LOG_INTO_STAGE'],
        ['deleteStageImage','LOG_INTO_STAGE'],
        ['deleteTmpStageImage','LOG_INTO_STAGE'],
        ['getTmpStageImage','LOG_INTO_STAGE'],
        ['getStageImage','LOG_INTO_STAGE'],
        ['getProjectVariablesLike','LOG_INTO_STAGE'],
        ['getProjectVariablesList','LOG_INTO_STAGE'],
        ['confirmProjectVariable','LOG_INTO_STAGE'],
        ['getProjectVariableDetails','LOG_INTO_STAGE'],
        ['blockVariable','LOG_INTO_STAGE'],
        ['getProjectVariableDelSlo','LOG_INTO_STAGE'],
        ['getProjectVariableHideSlo','LOG_INTO_STAGE'],
        ['pvHide','LOG_INTO_STAGE'],
        ['pvDelete','LOG_INTO_STAGE'],
        ['getProjectVariablesSimpleList','LOG_INTO_STAGE']
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
        if(!array_key_exists($this->availableFunction["task"], $this->urlData)){  
            $this->Log->logMulti(2,$this->urlGetData,__LINE__."::".__METHOD__." urlGetData");
            Throw New Exception('Wrong function to execute',0);
        }
    }
    private function checkUrlTask()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $found=false;
        foreach($this->availableTask as $task)
        {
            $this->Log->logMulti(2,$task);
            if($task[0]==$this->urlData['task']){
                $this->Log->log(0,"[".__METHOD__."] task in availableTask => ".$task[0]); 
                self::setTaskPerm($task[1]);
                $found=true;
                break;
            }   
        }
        if(!$found){
            Throw New Exception(__METHOD__.' Task not exists => '.$this->urlData['task'],1);
        }
    }
    private function setTaskPerm($perm){
        $this->Log->log(0,"[".__METHOD__."]".$perm);
        $this->taskPerm['name']=$perm;
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
