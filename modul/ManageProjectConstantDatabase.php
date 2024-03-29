<?php
/**
 * Description of ManageProjectConstsDatabase
 *
 * @author tborczynski
 * 
 * MANAGE PROJECT CONSTS DATABASE QUERY
 */
abstract class ManageProjectConstantDatabase {
    private $dbLink;
    protected $Log;
    protected $inpArray=array();
    protected $newData=array();
    private $date='';
    protected $Items;
    
    protected $error='';
    
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->dbUtilities=new DatabaseUtilities();
        $this->date=date("Y-m-d H:i:s");
        $this->RA=filter_input(INPUT_SERVER,'REMOTE_ADDR');
        //$this->Items=$Items;
        $this->Items=NEW ManageProjectItems();
    }
    public function __destruct(){}
    protected function getConstants(){
        return $this->dbLink->squery("SELECT * FROM `slo_project_stage_const` s WHERE s.`wsk_u`='0' ORDER BY s.`id` ASC");
    }
    protected function checkConstantUnique($k='',$v='',$column='nazwa',$id=0){
        $this->Log->log(0,"[".__METHOD__."]\r\n KEY => ".$k."\r\n VALUE => ".$v);
         /*
          * PARAMTER MUST BY INSERTED WITHOUT CHAR => ' "
          */
         $parm=[
            ':parm'=>[$v,'STR'],
            ':id'=>[$id,'INT']
        ];
        if(intval($this->dbLink->squery("SELECT count(*) as c FROM `slo_project_stage_const` WHERE `".$column."`=:parm AND `id`!=:id ORDER BY `id` ASC",$parm)[0]['c'],10)>0){
            $this->error.="[".$k."] Wprowadzona wartość istnieje już w bazie danych.<br/>";
        }
    }
    protected function dbManageConstant($data=[]){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$data);
        //print_r($data);
        //print_r($_SESSION);
        $parm=[
            ':n'=>[$data['nazwa'],'STR'],
            ':w'=>[$data['wartosc'],'STR']
        ];
        if($data['id']>0){
            $parm[':id']=[$data['id'],'INT'];
            $this->dbLink->query(
                "UPDATE `slo_project_stage_const` SET `nazwa`=:n,`wartosc`=:w,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id;"
                ,array_merge($parm,$this->dbUtilities->getAlterParm())
                );
                $this->Items->unsetBlock($data['id'],'slo_project_stage_const','buffer_user_id',$_SESSION['userid']);
        }
        else{
            $this->dbLink->query(
                "INSERT INTO `slo_project_stage_const` (`nazwa`,`wartosc`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:n,:w,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
                );
        }
        
    }
    protected function getConstantsLike($sql='',$parm=[]){
        /* */
        $this->Log->log(0,$sql);
        $this->Log->logMulti(0,$parm);
        $data=[];
        foreach($this->dbLink->squery($sql,$parm) as $v){
            array_push($data,[$v['i'],$v['n'],html_entity_decode($v['v']),'bl'=>$v['bl']]);
        }
        return $data;
    }

    protected function getConstantData($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID RECORD => ".$id);
        $tmpData=$this->dbLink->squery("SELECT s.`id` as 'i',s.`nazwa` as 'n',s.`wartosc` as 'v',s.`create_user_full_name` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_user_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`wsk_u` as 'wu',b.`login` as 'bl' FROM `slo_project_stage_const` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id AND s.`wsk_u`='0' LIMIT 0,1",[':id'=>[$id,'INT']]);
        if(count($tmpData)===0){
            throw new Exception('CONST DOES NOT EXIST ANYMORE!', 0);
        }
        return $tmpData[0];
    }
    protected function getConstantWithoutRecord($idRecord=0){
        $this->Log->log(0,"[".__METHOD__."] ID RECORD => ".$idRecord);
        return $this->dbLink->squery("SELECT * FROM `slo_project_stage_const` s WHERE s.`wsk_u`='0' AND s.id!=:id ORDER BY s.`id` ASC",[':id'=>[$idRecord,'INT']]);
    }
    protected function hideConstant($hide='1'){
        $parm=[
            ':id'=>[$this->newData['id'],'INT'],
            ':wsk_v'=>[$hide,'STR'],
            ':reason'=>[$this->newData['reason'],'STR']
        ];
        $this->dbLink->setQuery("UPDATE `slo_project_stage_const` SET `wsk_v`=:wsk_v,`hide_reason`=:reason,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",array_merge($parm,$this->dbUtilities->getAlterParm()));
        $this->dbLink->runTransaction();
    }
    protected function deleteConstant($delete='1'){
        $parm=[
                ':id'=>[$this->newData['id'],'INT'],
                ':wsk_u'=>[$delete,'STR'],
                ':reason'=>array($this->newData['reason'],'STR')
            ];
        $this->dbLink->setQuery("UPDATE `slo_project_stage_const` SET `wsk_u`=:wsk_u,`delete_reason`=:reason,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",array_merge($parm,$this->dbUtilities->getAlterParm()));
        $this->dbLink->runTransaction();
    }
}
