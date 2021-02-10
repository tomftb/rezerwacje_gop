<?php
session_start();
define('DR',filter_input(INPUT_SERVER,"DOCUMENT_ROOT"));
require(DR."/.cfg/config.php");
require(DR."/function/autoLoader.php");

class Router extends validPerm
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        array("pCreate",'ADD_PROJ','user'),
        array("pDelete",'DEL_PROJ','user'),
        array("getprojects",'LOG_INTO_PROJ','user'),
        array("getprojectslike",'LOG_INTO_PROJ','user'),
        array("getprojectsmember",'','sys'),
        array("getprojectsleader",'','sys'),
        array("getprojectsmanager",'','sys'),
        array("getprojectgltech",'','sys'),
        array("getprojectglkier",'','sys'),
        array("getProjectTeam",'SHOW_TEAM_PROJ','user'),
        array('pDetails','SHOW_PROJ','user'),
        array("gettypeofagreement",'','sys'),
        array("getadditionaldictdoc",'','sys'),
        array("pTeamOff",'EDIT_TEAM_PROJ','user'),
        array("getallavaliableemployeeprojsumperc",'','user'),
        array("pTeam",'EDIT_TEAM_PROJ','user'),
        array('pDoc','SHOW_DOK_PROJ','user'),
        array('pClose','CLOSE_PROJ','user'),
        array('pDocEdit','EDIT_DOK_PROJ','user'),
        array('pEdit','EDIT_PROJ','user'),
        array('pPDF','GEN_PDF_PROJ','user'),
        array('getProjectDefaultValues','','sys'),
        array('getProjectCloseSlo','','sys'),
        array('getProjectDeleteSlo','','sys'),
        array('getProjectEmailData','EMAIL_PROJ','user'),
        array('pEmail','EMAIL_PROJ','user'),
        array("getAllParm",'LOG_INTO_PARM','user'),
        array('updateParm','EDIT_PARM','user'),
        array("getAllPerm",'LOG_INTO_UPR','user'),
        array("getUsersWithPerm",'SHOW_PERM_USER','user'),
        array('uPermUsers','EDIT_PERM_USER','user'),
        array("getAllRole",'LOG_INTO_ROLE','user'),
        array("getNewRoleSlo",'ADD_ROLE','user'),
        array("cRole",'ADD_ROLE','user'),
        array("getUsersWithPerm",'SHOW_PERM_USER','user'),
        array('rEdit','EDIT_ROLE','user'),
        array('getRoleDetails','SHOW_ROLE','user'),
        array('getRoleUsers','SHOW_ROLE_USERS','sys'),
        array('rDelete','DEL_ROLE','user'),
        array("getusers",'LOG_INTO_UZYT','user'),
        array("getuserslike",'LOG_INTO_UZYT','user'),
        array("getNewUserSlo",'ADD_USER','user'),
        array("getPermSlo",'','user'),
        array("cUser",'ADD_USER','user'),
        array('getUserDel','DEL_USER','user'),
        array('getUserPerm','SHOW_PERM_USER','user'),
        array('uPerm','EDIT_PERM_USER','user'),
        array('getUserDetails','SHOW_USER','user'),
        array('getRoleSlo','','user'),
        array('eUserOn','EDIT_USER','user'),
        array('dUser','DEL_USER','user'),
        array("getEmployees",'LOG_INTO_PRAC','user'),
        array("getemployeeslike","LOG_INTO_PRAC","user"),
        array("getEmployeesSpecSlo",'','sys'),
        array("cEmployee",'ADD_EMPL','user'),
        array("getEmployeeProjects",'SHOW_PROJ_EMPL','user'),
        array('getDeletedEmployeeProjects','DEL_EMPL','user'),
        array('dEmployee','DEL_EMPL','user'),
        array('getEmployeeSpec','SHOW_ALLOC_EMPL','user'),
        array('eEmployeeSpecOn','EDIT_ALLOC_EMPL','user'),
        array('getEmployeeDetails','SHOW_EMPL','user'),
        array('eEmployeeOn','EDIT_EMPL','user'),
        array('getProjectReportData','GEN_RAPORT_PROJ','user'),
    );
    private $modul=array();
    private $modulData=array();
    private $taskPerm=array();
    function __construct()
    {
        parent::__construct();
        $this->log(2,"[".__METHOD__."]");
        $this->getUrlData();
        // CHECK FUNCTION
        if(!$this->checkUrlFunction())
        {
            return ($this->getError());
        }
        // CHECK PERM
        if(!$this->checkUrlTask())
        {
            return ($this->getError());
        }
        if($this->taskPerm['type']==='user')
        {
            $this->checkLoggedUserPerm('LOG_INTO_APP');
            $this->checkLoggedUserPerm($this->taskPerm['name']);    
        }
        else
        {
            /*
             * admin
             */
        }
        
        if(!$this->getError())
        {
            $this->runTask();
        }    
        
    }
    private function getUrlData()
    {
        $this->log(0,"[".__METHOD__."]");
        foreach($_GET as $key=>$value)
        {
            $this->urlGetData[$key]=$value;
            $this->log(0,"[".__METHOD__."] $key => $value");
        }
    }
    private function checkUrlFunction()
    {
        $this->log(0,"[".__METHOD__."]");
        if(array_key_exists($this->avaliableFunction["task"], $this->urlGetData))
        {    
            return true;
        }
        else
        {
            $this->setError(1,"Wrong function to execute:");
            $this->logMultidimensional(2,$this->urlGetData,__LINE__."::".__METHOD__." urlGetData");
        }
        return false;
    }
   
    private function checkUrlTask()
    {
        $this->log(0,"[".__METHOD__."]");
        foreach($this->avaliableTask as $id =>$task)
        {
            if($task[0]==$this->urlGetData['task'])
            {
                $this->setTaskPerm($this->avaliableTask[$id][1],$this->avaliableTask[$id][2]);
                $this->log(0,"[".__METHOD__."] task in avaliableTask");
                return true;
            }
        }
        $this->setError(1,__METHOD__.' Task not exists => '.$this->urlGetData['task']);
        return false;
    }
    private function setTaskPerm($permName='',$permType='')
    {
        $this->log(0,"[".__METHOD__."]");
        $this->taskPerm['name']=$permName;
        $this->taskPerm['type']=$permType;
        $this->log(0,"[".__METHOD__."] taskPerm['name'] => ".$this->taskPerm['name']." | taskPerm['type'] => ".$this->taskPerm['type']);
    }
    private function runTask()
    {
        /*
         * URUCHOM ZADANIE
         */
        self::loadModules();
        $this->log(0,"[".__METHOD__."] ".$this->urlGetData['task']);
        self::loadMethod();
    }
    private function loadModules()
    {
        $this->log(0,"[".__METHOD__."]");
        array_push($this->modul,new manageParameters());
        array_push($this->modul,new manageProject());       
        array_push($this->modul,new managePermission());
        array_push($this->modul,new manageRole());
        array_push($this->modul,new manageUser());
        array_push($this->modul,new manageEmployee());
    }
    private function loadMethod()
    {
        $methodFound=array(); // counter
        $methodFoundCounter=0;
        foreach($this->modul as $id => $name)
        {
            if(method_exists ( $name , $this->urlGetData['task'] ))
            {
                array_push($methodFound,$id);
                $this->log(0,"[".__METHOD__."] METHOD FOUND IN CLASS => ".get_class($name));
                $methodFoundCounter++;
            }
        }
        if($methodFoundCounter===0)
        {
            $this->setError(1,'Task not exists => '.$this->urlGetData['task']);    
        }
        else if($methodFoundCounter>1)
        {
            $this->setError(2,' Task avaliable in more than one model => '.$this->urlGetData['task']);  
        }
        else
        {
            // ok
            //$this->modul[$methodFound[0]]->{$this->urlGetData['task']}();
            //$this->modulData=$this->modul[$methodFound[0]]->returnData();
            $this->modulData=$this->modul[$methodFound[0]]->{$this->urlGetData['task']}();
        }
    }
    function parseReturnData()
    {
        if($this->getError()) { return '';}
        if($this->modulData['status']===true)
        {
            $this->setError(0,$this->modulData['info']);
        }
        else if($this->modulData['status']===false)
        {
            // no error;
        }
        else
        {
            $this->setError(0,'WRONG ANSWER FROM MODULE');
        }
    }
    function __destruct()
    {
        $this->log(2,"[".__METHOD__."]");
        if($this->getError())
        {
            $this->log(0,"[".__METHOD__."] ERROR EXIST");
            echo json_encode(array('status'=>"1",'task'=>'error','data'=>$this->getError()));
        }
        else
        {
            $this->log(0,"[".__METHOD__."] NO ERROR");
            echo json_encode($this->modulData);
        }
    }
}
$router=NEW Router();