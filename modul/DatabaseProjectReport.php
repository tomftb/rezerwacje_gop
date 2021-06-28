<?php
class DatabaseProjectReport{
    private $dbLink;
    private $utilities;
    private $Log;
    private $stageDbId=0;
    private $projectStageDb=[];
    private $stageValueDbId=0;
    private $idProject=0;
    
    protected function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->utilities=NEW Utilities();
    }
    protected function addReport($idProject,$dataProject){
        $this->Log->log(0,"[".__METHOD__."]"); 
        try{
            /* GET ALL STAGE VALUE */
            $sql[':idproject']=[$idProject,'INT'];
            $this->idProject=$idProject;
            self::getProjectStage($sql);
            self::setAddOns($sql);
            array_walk($dataProject,array($this,'manageStage'),$sql);
        }
	catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception("DATABASE ERROR: ".$e->getMessage(),1); 
	} 
    }
    /*
     * ADD SQL USER FIELDS
     */
    private function setAddOns(&$data){
        $this->utilities->mergeArray($data,[
                ':userid'=>[$_SESSION["userid"],'INT'],
                ':userlogin'=>[$_SESSION["username"],'STR'],
                ':userfullname'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':useremail'=>[$_SESSION["mail"],'STR'],
                ':date'=>[CDT,'STR'],
                ':host'=>[RA,'STR']
        ]);
    }
    /*
     * GET PROJECT ALL STAGE AND STAGE VALUE FROM DATABASE
     */
    private function getProjectStage($sql){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $this->projectStageDb=$this->dbLink->squery("SELECT `id`,`stageId`,`number`,`title`,'n' as 'inserted' FROM `projekt_etap` WHERE idProject=:idproject AND wsk_u='0'",$sql);
        array_walk($this->projectStageDb,[$this,'getProjectStageValue']);
        $this->Log->logMulti(2,$this->projectStageDb,__METHOD__); 
    }
    /*
     * GET PROJECT ALL STAGE VALUE FROM DATABASE
     */
    private function getProjectStageValue(&$stage){
        $this->Log->log(2,"[".__METHOD__."]"); 
        $sql[':id']=[$stage['id'],'INT'];
        $stage['data']=$this->dbLink->squery("SELECT `id`,`valueId`,`value`,`fileposition`,`file`,'n' as 'inserted' FROM `projekt_etap_wartosc` WHERE idProjectStage=:id AND wsk_u='0'",$sql);
    }
    /*
     * CHECK AND UPDATE OD INSERT STAGE TO PROJECT
     */
    private function manageStage($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $sql[':stageId']=[$key,'INT'];
        $sql[':number']=[$value['n'],'INT'];
        $sql[':title']=[$value['t'],'STR'];
        /* CHECK PROJECT REPORT STAGE EXIST IN DATABASE => IF EXIST => UPDATE OTHERWISE => INSERT*/
        self::checkStageExist($key,$value,$this->stageDbId);
        if($this->stageDbId){
            self::updateStage($value,$key,$sql);
        }
        else{
            self::insertStage($value,$key,$sql);
        }
        $this->Log->logMulti(0,$this->projectStageDb,__METHOD__); 
        //Throw new ErrorException('test stop',0);
    }
    private function checkStageExist($stageId,$stageData,$idStageDb){
        $this->Log->log(0,"[".__METHOD__."]"); 
        $this->Log->logMulti(0,$stageId,"STAGE POST ID"); 
        $this->Log->logMulti(0,$stageData['d'],"STAGE POST DATA"); 
        $iStage=0;
        $iStageValue=0;
        $idStageValue=0;
        foreach($this->projectStageDb as $k => $v){
            if(intval($stageId,10)===intval($v['stageId'],10)){
                $this->Log->log(0,"FOUND stageId => ".$v['id']);
                $iStage++;
                $idStageDb=$v['id'];
                $this->projectStageDb[$k]['inserted']='y';
                /* CHECK STAGE VALUE */
                $this->Log->log(0,"LOOP OVER DATA");
                foreach($v['data'] as $kData => $vData){
                    //$this->Log->logMulti(0,$vData,"[".__METHOD__."]"); 
                    $this->Log->log(0,"VALUE ID => ".$vData['valueId']);
                    if(array_key_exists($vData['valueId'],$stageData['d'])){
                        $this->Log->log(0,"FOUND valueId => ".$v['id']);
                        $this->projectStageDb[$k]['data'][$kData]['inserted']='y';
                        $iStageValue++;
                        $idStageValue=$vData['valueId'];
                    }
                }
            }
        }
        //Throw new ErrorException('test stop',0);
        $this->Log->log(0,"[".__METHOD__."] iStage => ".$iStage); 
        $this->Log->log(0,"[".__METHOD__."] iStageValue => ".$iStageValue); 
        self::checkFound($iStage,"THERE IS MORE THAT ONE STAGE IN PROJECT => ".$this->idProject." WITH STAGE ID ".$stageId);
        self::checkFound($iStageValue,"THERE IS MORE THAT ONE STAGE VALUE IN PROJECT STAGE OF PROJECT => ".$this->idProject." WITH STAGE VALUE ID".$idStageValue);
    }
    private function checkFound($iFound,$info=''){
        if($iFound>1){
            throw New Exception("RESULT COUNT = ".$iFound.". ${info} AND WSK U = 0",1);  
        }
    }
    private function setUpStageId($sql,$projectId,$stageId,&$idDb){
        $this->Log->log(0,"[".__METHOD__."]"); 
        //$projectId=[11111,'INT'];
        $result=$this->dbLink->squery($sql,[':id1'=>$projectId,":id2"=>$stageId]);
        $resultCount=count($result);

        //$this->Log->logMulti(0,$result[0]['id']);
        if($resultCount>1){
            throw New Exception('RESULT COUNT = '.$resultCount.'. THERE IS MORE THAT ONE STAGE WITH PROJECT ID => '.$projectId[0]." AND STAGE ID => ".$stageId[0]." AND WSK U = 0",1);  
        }
        else if($resultCount===1){
            $this->Log->log(2,"[".__METHOD__."] RESULT COUNT === 1 => UPDATE => ".$result[0]['id']);
            $idDb=$result[0]['id'];
            return true;
        }
        else{
            $this->Log->log(2,"[".__METHOD__."] RESULT COUNT === 0 => INSERT"); 
            return false;
        } 
    }
    private function insertStage($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->dbLink->beginTransaction(); //PHP 5.1 and new
        $this->dbLink->query("INSERT INTO `projekt_etap` ("
                . "`idProject`,"
                . "`stageId`,"
                . "`number`,"
                . "`title`,"
                . "`create_user_id`,"
                . "`create_user_login`,"
                . "`create_user_full_name`,"
                . "`create_user_email`,"
                . "`create_date`,"
                . "`create_host`"
                . ") VALUES ("
                . ":idproject,"
                . ":stageId,"
                . ":number,"
                . ":title,"
                . ":userid,"
                . ":userlogin,"
                . ":userfullname,"
                . ":useremail,"
                . ":date,"
                . ":host)"
                ,$sql);
        self::addReportStageValue($value['d'],$this->dbLink->lastInsertId());
        $this->dbLink->commit();  //PHP 5 and new
    }
    private function updateStage($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->dbLink->beginTransaction(); //PHP 5.1 and new //(`idProject`,`stageId`,
        $this->dbLink->query("UPDATE `projekt_etap` SET "
                . "`number`=:number,"
                . "`title`=:title,"
                . "`mod_user_id`=:userid,"
                . "`mod_user_login`=:userlogin,"
                . "`mod_user_full_name`=:userfullname,"
                . "`mod_user_email`=:useremail,"
                . "`mod_date`=:date,"
                . "`mod_host`=:host "
                . "WHERE "
                . "`idProject`=:idproject "
                . "AND `stageId`=:stageId"
                ,$sql);
        self::manageStageValue($value['d'],$this->stageDbId);
        $this->dbLink->commit();  //PHP 5 and new
    }
    private function addReportStageValue($value,$stageId){
        $this->Log->log(0,"[".__METHOD__."]");
        $sql[':idProjectStage']=[$stageId,'INT'];/* public PDO::lastInsertId ( string $name = null ) : string */
        self::setAddOns($sql);
        array_walk($value,array($this,'insertStageValue'),$sql);      
    }
    private function manageStageValue($value,$stageId){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->LogMulti(0,$value);
        $sql[':idProjectStage']=[$stageId,'INT'];/* public PDO::lastInsertId ( string $name = null ) : string */
        self::setAddOns($sql);
        foreach($value as $k => $v){
            if(self::setUpStageId("SELECT `id` FROM `projekt_etap_wartosc` WHERE "
                    . "`idProjectStage`=:id1 "
                    . "AND valueId=:id2 "
                    . "AND wsk_u='0'"
                    ,$sql[':idProjectStage'],[$k,'INT'],$this->stageValueDbId)){
                self::updateStageValue($v,$k,$sql);
            }
            else{
                /* FEATURE => FOR NEW STAGE VALUE */
                $this->Log->log(0,"[".__METHOD__."] INSERT STAGE VALUE");
                self::insertStageValue($v,$k,$sql);
            }
        }
    }
    private function insertStageValue($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]KEY => ${key}");
        $this->Log->LogMulti(0,$value,'VALUE');
        self::addValueAddOns($value,$key,$sql);
        $this->Log->LogMulti(0,$sql,"SQL");
        $this->dbLink->query("INSERT INTO `projekt_etap_wartosc` ("
                . "`idProjectStage`,"
                . "`valueId`,"
                . "`value`,"
                . "`fileposition`,"
                . "`file`,"
                . "`create_user_id`,"
                . "`create_user_login`,"
                . "`create_user_full_name`,"
                . "`create_user_email`,"
                . "`create_date`,"
                . "`create_host`"
                . ") VALUES ("
                . ":idProjectStage,"
                . ":valueId,"
                . ":value,"
                . ":fileposition,"
                . ":file,"
                . ":userid,"
                . ":userlogin,"
                . ":userfullname,"
                . ":useremail,"
                . ":date,"
                . ":host)"
                ,$sql);
    }
    private function updateStageValue($value,$key,$sql){
        $this->Log->log(0,"[".__METHOD__."]STAGE VALUE ID => ".$this->stageValueDbId." KEY => ${key}");
        $this->Log->logMulti(2,$sql);
        $this->Log->logMulti(2,$value);
        self::addValueAddOns($value,$key,$sql);
        $this->dbLink->query("UPDATE `projekt_etap_wartosc` SET "
                . "`value`=:value,"
                . "`fileposition`=:fileposition,"
                . "`file`=:file,"
                . "`mod_user_id`=:userid,"
                . "`mod_user_login`=:userlogin,"
                . "`mod_user_full_name`=:userfullname,"
                . "`mod_user_email`=:useremail,"
                . "`create_date`=:date,"
                . "`create_host`=:host "
                . "WHERE `"
                . "idProjectStage`=:idProjectStage "
                . "AND `valueId`=:valueId"
                ,$sql);       
    }
    private function addValueAddOns($v,$k,&$sql){
        $sql[':valueId']=[$k,'INT'];
        $sql[':fileposition']=[$v['fileposition'],'STR'];
        $sql[':value']=[$v['value'],'STR'];
        $sql[':file']=[$v['fileData'],'STR']; 
    }
}