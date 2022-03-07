<?php
/*
 * FASCADA PATTERN
 */
session_start();
define('DR',filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/..");
require(DR.'/.cfg/consts.php');
require(DR."/.cfg/config.php");
require(DR."/function/autoLoader.php");

final class Router
{
    private $Log;
    private $Error;
   
    public function __construct(PermManager $PermManager,ModulManager $ModulManager,UrlManager $UrlManager,ErrorHandler $Error,Logger $Logger){
        $this->Log=$Logger;
        $this->Error=$Error;
        $this->Log->log(0,"[".__METHOD__."]");

        try{
            $UrlManager->setUrlData();
            $PermManager->checkPermission($UrlManager->getUrlPerm());
            $ModulManager->loadMethod($UrlManager->getUrlTask());
        }
        catch(Throwable $t){
            //$this->Log->log(0,$t->getMessage()."\r\nFILE:".$t->getFile()."\r\nLINE:".$t->getLine());
            $this->Log->log(0,"ERROR IN:\r\nFILE:".$t->getFile()."\r\nLINE:".$t->getLine());
            $this->Error->setError($t->getMessage(),$t->getCode());
        }
        finally {
            $this->Log->log(0,"[".__METHOD__."] finally");
        } 
    }   
    /*
     * DESTRUCT RETURN DATA
     */
    public function __destruct(){
        if($this->Error->getError()){
            $this->Log->log(2,"[".__METHOD__."] ERROR EXIST: ".$this->Error->getError());
            echo json_encode(['status'=>1,'type'=>'POST','data'=>[],'info'=>$this->Error->getError()]);
        }
        else{
            $this->Log->log(2,"[".__METHOD__."] NO ERROR");
        }
    }
}
/* 
 * PERM MANAGER Subsystem 
 */
$PermManager = New PermManager();
/* 
 * MODUL MANAGER Subsystem 
 */
$ModulManager = New ModulManager();
/* 
 * URL MANAGER Subsystem 
 */
$UrlManager = New UrlManager();
/*
 * ERROR Subsystem
 */
$Error = New ErrorHandler();
/*
 * LOGGER Subsystem
 */
$Logger = Logger::init(__FILE__);
/*
 * FASCADE Object
 */
NEW Router($PermManager,$ModulManager,$UrlManager,$Error,$Logger);
