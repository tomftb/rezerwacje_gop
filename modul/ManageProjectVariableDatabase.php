<?php
/**
 * Description of ManageProjectVariableDatabase
 *
 * @author tborczynski
 * 
 * MANAGE PROJECT VARIABLE DATABASE QUERY
 */
abstract class ManageProjectVariableDatabase {
    private $dbLink;
    protected $Log;
    protected $input;
    protected $newData=array();
    private $date='';
    protected $error='';
    protected $Items;
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->dbUtilities=new DatabaseUtilities();
        $this->date=date("Y-m-d H:i:s");
        $this->RA=filter_input(INPUT_SERVER,'REMOTE_ADDR');
        $this->Items=NEW ManageProjectItems();
    }
    public function __destruct(){}
    protected function getVariables(){
        return $this->dbLink->squery("SELECT * FROM `slo_project_stage_variable` s WHERE s.`deleted`='0' ORDER BY s.`id` ASC");
    }
    protected function checkUnique(&$error,$first,$key='',$value='',$column='name',$id=0){
        $this->Log->log(0,"[".__METHOD__."]\r\n KEY => ".$key."\r\n VALUE => ".$value);
         /*
          * PARAMTER MUST BY INSERTED WITHOUT CHAR => ' "
          */
         $parm=[
            ':parm'=>[$value,'STR'],
            ':id'=>[$id,'INT']
        ];
        if(intval($this->dbLink->squery("SELECT count(*) as c FROM `slo_project_stage_variable` WHERE `".$column."`=:parm AND `id`!=:id ORDER BY `id` ASC",$parm)[0]['c'],10)>0){
            $error.="[".$key."] Wprowadzona wartość istnieje już w bazie danych.<br/>";
            $first='<br/>';
        }
    }
    protected function manageVariable($data){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$data);
        $parm=[
            ':n'=>[$data->name,'STR'],
            ':w'=>[$data->value,'STR']
        ];
        if($data->id>0){
            $parm[':id']=[$data->id,'INT'];
            $this->dbLink->query(
                "UPDATE `slo_project_stage_variable` SET `name`=:n,`value`=:w,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id;"
                ,array_merge($parm,$this->dbUtilities->getAlterParm())
                );
            $this->Items->unsetBlock($data->id,'slo_project_stage_variable','buffer_user_id',$_SESSION['userid']);
        }
        else{
            $this->dbLink->query(
                "INSERT INTO `slo_project_stage_variable` (`name`,`value`,".$this->dbUtilities->getCreateSql()[0].",".$this->dbUtilities->getCreateAlterSql()[0].") VALUES (:n,:w,".$this->dbUtilities->getCreateSql()[1].",".$this->dbUtilities->getCreateAlterSql()[1].");"
                ,array_merge($parm, $this->dbUtilities->getCreateParm(),$this->dbUtilities->getAlterParm())
            );
        }
    }
    protected function getAll($sql='',$parm=[]){
        /* */
        $this->Log->log(0,$sql);
        $this->Log->logMulti(0,$parm);
        $data=[];
        foreach($this->dbLink->squery($sql,$parm) as $v){
            array_push($data,[$v['i'],$v['n'],html_entity_decode($v['v']),'bl'=>$v['bl']]);
        }
        return $data;
    }
    protected function getVariableData($id=0){
        $this->Log->log(0,"[".__METHOD__."] ID RECORD => ".$id);
        $variable=$this->dbLink->squery("SELECT s.`id` as 'i',s.`name` as 'n',s.`value` as 'v',s.`create_user_full_name` as 'cu',s.`create_user_login` as 'cul',s.`create_date` as 'cd',s.`mod_user_login` as 'mu',s.`mod_date` as 'md',s.`buffer_user_id` as 'bu',s.`deleted` as 'wu',b.`login` as 'bl' FROM `slo_project_stage_variable` as s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id` WHERE s.`id`=:id AND s.`deleted`='0' LIMIT 0,1",[':id'=>[$id,'INT']]);
        if(count($variable)===0){
            throw new Exception('VARIABLE DOES NOT EXIST ANYMORE!', 0);
        }
        else{
            //$this->newData['variable']=$tmpData[0];
            return $variable[0];
        }
    }
    protected function getVariableWithoutRecord($idRecord=0){
        $this->Log->log(0,"[".__METHOD__."] ID RECORD => ".$idRecord);
        return $this->dbLink->squery("SELECT * FROM `slo_project_stage_variable` s WHERE s.`deleted`='0' AND s.id!=:id ORDER BY s.`id` ASC",[':id'=>[$idRecord,'INT']]);
    }
    protected function changeState($state='1',$stateCol='hidden',$reasonCol='hidden_reason'){
            $parm=[
                ':id'=>[$this->newData['id'],'INT'],
                ':state'=>[$state,'STR'],
                ':reason'=>array($this->newData['reason'],'STR')
            ];
        $this->dbLink->setQuery("UPDATE `slo_project_stage_variable` SET `${stateCol}`=:state,`${reasonCol}`=:reason,".$this->dbUtilities->getAlterSql()." WHERE `id`=:id",array_merge($parm,$this->dbUtilities->getAlterParm()));
        $this->dbLink->runTransaction();
    }
}