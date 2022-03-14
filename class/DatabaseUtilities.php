<?php

class DatabaseUtilities {
    private $dbLink;
    private $sqlAddOn=[
        /* create */
        'ci'=>[
            '`create_user_id`,`create_user_login`,`create_user_full_name`,`create_user_email`,`create_date`,`create_host`',
            ':create_user_id,:create_user_login,:create_user_full_name,:create_user_email,:create_date,:create_host'
        ],
        /* mod */
        'mi'=>[
            '`mod_user_id`,`mod_user_login`,`mod_user_full_name`,`mod_user_email`,`mod_date`,`mod_host`',
            ':mod_user_id,:mod_user_login,:mod_user_full_name,:mod_user_email,:mod_date,:mod_host'
        ],
        /* SQL UPDATE */
        'mu'=>'`mod_user_id`=:mod_user_id,`mod_user_login`=:mod_user_login,`mod_user_full_name`=:mod_user_full_name,`mod_user_email`=:mod_user_email,`mod_date`=:mod_date,`mod_host`=:mod_host',
    ];
    private $date='';
    private $RA='';
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->date=date("Y-m-d H:i:s");
        $this->RA=filter_input(INPUT_SERVER,'REMOTE_ADDR');
    }
    public function __destruct(){}
   
    public function getCreateParm(){
        return [
            ':create_user_id'=>[intval($_SESSION['userid'],10),'INT'],
            ':create_user_login'=>[$_SESSION['username'],'STR'],
            ':create_user_full_name'=>[$_SESSION['nazwiskoImie'],'STR'],
            ':create_user_email'=>[$_SESSION['mail'],'STR'],
            ':create_date'=>[$this->date,'STR'],
            ':create_host'=>[$this->RA,'STR']
        ];
    }
    public function getAlterParm(){
        return[
            ':mod_user_id'=>[intval($_SESSION['userid'],10),'INT'],
            ':mod_user_login'=>[$_SESSION['username'],'STR'],
            ':mod_user_full_name'=>[$_SESSION['nazwiskoImie'],'STR'],
            ':mod_user_email'=>[$_SESSION['mail'],'STR'],
            ':mod_date'=>[$this->date,'STR'],
            ':mod_host'=>[$this->RA,'STR']
        ];
    }
    public function exist($table='',$where=''){
        $query = $this->dbLink->prepare('SELECT * FROM '.$table.' WHERE '.$where.';');
        $query->execute();
        if(!$query->rowCount()){
            Throw new Exception ('RECORD `'.$where.'` NOT EXIST IN TABLE `'.$table.'`',1);
        }
    }
    public function getColor(){
        $this->Log->log(0,"[".__METHOD__."]");
        return $this->dbLink->squery('SELECT `ENG` as n,`HEX` as v FROM `SLO_COLOR` ORDER BY `ENG` ASC');
    }
    public function getFontFamily(){
        $this->Log->log(0,"[".__METHOD__."]");
        return $this->dbLink->squery('SELECT `NAME` as n,`NAME` as v FROM `SLO_FONT_FAMILY` ORDER BY `NAME` ASC');
    }
    public function getStyle($GROUP=0){
        $this->Log->log(0,"[".__METHOD__."]\r\nGROUP - $GROUP");
        return $this->dbLink->squery('SELECT `PL` as n,`ENG` as v FROM `SLO_STYLE` WHERE `GROUP`='.$GROUP.' ORDER BY `NUMBER` ASC');
    }
    public function getParam($SHORTCUT=''){
        $this->Log->log(0,"[".__METHOD__."]\r\nSHORTCUT - $SHORTCUT");
        return $this->dbLink->squery('SELECT `SKROT` as s, `OPIS` as n,`WARTOSC` as v FROM `PARAMETRY` WHERE `SKROT` LIKE "'.$SHORTCUT.'" ORDER BY `ID` ASC');
    }
     public function getUserDepartment($id_user=0){
        $this->Log->log(0,"[".__METHOD__."]\r\ID USER - ${id_user}");
        return $this->dbLink->squery('SELECT d.`NAME` as n,d.`ID` as v FROM `DEPARTMENT_USER` as du, `DEPARTMENT` d WHERE du.`id_department`=d.`id` AND `id_user`=:id_user ORDER BY `id_department` ASC',[':id_user'=>[$id_user,'INT']]);
    }
    public function getCreateSql(){
        return $this->sqlAddOn['ci'];
    }
    public function getAlterSql(){
        return $this->sqlAddOn['mu'];
    }
    public function getCreateAlterSql(){
        return $this->sqlAddOn['mi'];
    }
    public function getDate(){
        return $this->date;
    }
     public function RA(){
        return $this->RA;
    }
}
