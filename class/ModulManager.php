<?php
/*
 * Command Interface
 */
interface TaskInterface
{
    /* execute */
    public function run();
}
/*
 * Complex Command 
 */
class Task implements TaskInterface
{
    /**
     * @var Receiver
     */
    private $modul;

    /**
     * Context data, required for launching the receiver's methods.
     */
    private $task;
    /**
     * Complex commands can accept one or several receiver objects along with
     * any context data via the constructor.
     */
    public function __construct($modul, string $task){
        $this->modul = $modul;
        $this->task = $task;
    }
    /**
     * Commands can delegate to any methods of a receiver.
     */
    public function run(){
        /*
         * ComplexCommand: Complex stuff should be done by a receiver object.
         */
        $this->modul->{$this->task}();
        
        //$this->receiver->methodToRun(PARAM);
    }
}
class Invoker
{
    /**
     * @var Command
     */
    private $task;

    /**
     * Initialize commands.
     */
    public function setTask(Task $task){
        $this->task = $task;
    }
    /**
     * The Invoker does not depend on concrete command or receiver classes. The
     * Invoker passes a request to a receiver indirectly, by executing a
     * command.
     */
    public function runTask(){
        $this->task->run();
    }
}
final class ModulManager{
    
    private $modulData;
    private $modul=[];
    private $Log;
    
    public function __construct(){
        $this->Log = Logger::init(__FILE__);
        self::loadModules();
    }
    
    public function loadModules(){
        $this->Log->log(0,"[".__METHOD__."]");
        array_push($this->modul,new ManageParameters());
        array_push($this->modul,new ManageProject());       
        array_push($this->modul,new ManagePermission());
        array_push($this->modul,new ManageRole());
        array_push($this->modul,new ManageUser());
        array_push($this->modul,new ManageEmployee());
        array_push($this->modul,new ManageProjectStage());
        array_push($this->modul,new ManageProjectReport());    
    }
    
    public function loadMethod($method=''){
        $this->Log->log(0,"[".__METHOD__."]");
        $methodFound=[];
        $methodFoundCounter=0;
        foreach($this->modul as $id => $name){
            if(method_exists ( $name , $method )){
                array_push($methodFound,$id);
                $this->Log->log(0,"[".__METHOD__."] METHOD FOUND IN CLASS => ".get_class($name));
                $methodFoundCounter++;
            }
        }
        if($methodFoundCounter===0){
            throw New Exception('Task not exists => '.$method,1);
        }
        else if($methodFoundCounter>1){
            throw New Exception('Task avaliable in more than one model => '.$method,1);
        }
        else{
            /*
             * RUN CLASS METHOD
             */
            $invoker = new Invoker();
            /*
             * $this->modul[$methodFound[0]] =>  already new Obkect()
             */
            $invoker->setTask(New Task($this->modul[$methodFound[0]],$method));
            $invoker->runTask();
            /*
             * OLD VERSION
             */
            //$this->modulData=$this->modul[$methodFound[0]]->{$method}();
        }
    }
    public function getResult($returnType='json'){
        /* OLD VERSION
        if($returnType==='json'){
            $this->Log->log(0,"[".__METHOD__."] RETURN JSON");
            echo json_encode($this->modulData);
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] RETURN HEADER FROM FILE");
            // setup file
        }
        */
    }
    public function __destruct(){}
}
