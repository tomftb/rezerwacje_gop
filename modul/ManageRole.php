<?php
class ManageRole
{
    protected $idRole=0;
    private $inpArray=array();
    protected $filter='';
    private $Log;
    private $dbLink;
    function __construct()
    {
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllRole()
    {
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $this->utilities->jsonResponse(
                __METHOD__,
                $this->dbLink->squery('SELECT `ID` as \'i\',`Nazwa` as \'n\' FROM `v_slo_rola_all` WHERE `WSK_U`=\'0\' AND (`ID` LIKE (:f) OR `Nazwa` LIKE (:f)) ORDER BY ID ASC',[':f'=>[$f,'STR']]),
                '',
                'GET');
    }
    public function getNewRoleSlo()
    {
        $v['rola']=$this->dbLink->squery('select * from v_slo_rola');
        $v['perm']=$this->dbLink->squery('select `ID` as \'i\',`NAZWA` as \'n\' from v_slo_upr');
        $this->utilities->jsonResponse(__METHOD__,$v,'cRole');
    }
    public function rDelete()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'id',true,1); 
        $this->Log->log(0,'id role => '.$this->inpArray['id']);
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query('UPDATE `slo_rola` SET `WSK_U`=\'1\' WHERE `ID`=:i',[':i'=>[$this->inpArray['id'],'INT']]);
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }  
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    public function cRole()
    {
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'nazwa',true,1); 
        self::checkRoleValueLength();
        self::checkRoleName();
        UNSET($this->inpArray['id']);
        self::addRole();
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    public function rEdit()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'id',true,1);
        $this->utilities->validateKey($this->inpArray,'nazwa',true,1);
        $this->idRole=$this->inpArray['id'];
        UNSET($this->inpArray['id']);
        $sql=[
            ':n'=>[$this->inpArray['nazwa'],'STR'],
            ':i'=>[$this->idRole,'INT']
        ];
        self::checkRoleValueLength();
        self::checkEditedRoleName($sql);
        self::updateRole($sql);
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST');
    }
    protected function addRole()
    {
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $sql=[
                ':NAZWA'=>[$this->inpArray['nazwa'],'STR'],
                ':create_user'=>[$_SESSION["username"],'STR'],
                ':create_user_full_name'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':create_user_email'=>[$_SESSION["mail"],'STR'],
                ':create_host'=>[RA,'STR']
            ];
            $this->dbLink->query("INSERT INTO `slo_rola` (`NAZWA`,`create_user`,`create_user_full_name`,`create_user_email`,`create_host`) VALUES (:NAZWA,:create_user,:create_user_full_name,:create_user_email,:create_host)",$sql);
            // EDIT ROLE PERMISSION
            array_walk($this->inpArray,array('self', 'insertRolePerm'),$this->dbLink->lastInsertId());
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }  
    }
    private function checkRoleName()
    {
        $data=$this->dbLink->squery('SELECT * FROM `v_slo_rola` WHERE TRIM(`NAZWA`)=:n',[':n'=>[$this->inpArray['nazwa'],'STR']]);
        if(count($data)){
            Throw New Exception ('Istnieje rola o podanej nazwie',0);
        }
    }
    private function checkEditedRoleName($sql)
    {
        $data=$this->dbLink->squery('SELECT * FROM `v_slo_rola` WHERE TRIM(`NAZWA`)=:n AND `ID`!=:i',$sql);
        if(count($data)){
            Throw New Exception ('Istnieje rola o podanej nazwie',0);
        }
    }
    private function updateRole($sql)
    {
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query('UPDATE `slo_rola` SET `NAZWA`=:n WHERE `ID`=:i',$sql);
            UNSET($this->inpArray['nazwa']);
            self::removeRolePerm($this->idRole);  
            array_walk($this->inpArray,array('self', 'insertRolePerm'),$this->idRole);
            /* TO DO => CHECK SOMETHING LEFT FORM POST (inpArray) */
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        } 
    }
    private function removeRolePerm($idRole)
    {
        /* GET EXIST ROLE PERM */
        /* DELETE NOT SENDED */
        foreach($this->dbLink->squery('SELECT `id_upr` as \'iu\' FROM `upr_i_slo_rola` WHERE `id_rola`=:idr',['idr'=>[$idRole,'INT']]) as $v)
        {
            $this->Log->log(0,"[".__METHOD__."] ID PERM => ".$v['iu']);
            self::deleteRolePerm($idRole,$v['iu']);
       }
    }
    private function deleteRolePerm($idRole,$idUpr){
        if(!array_key_exists('perm_'.$idUpr, $this->inpArray ))
        {
            $this->Log->log(0,__METHOD__." REMOVE ROLE (${idRole}) PERM (${idUpr})");
            $sql=[
                    ':idr'=>[$idRole,'INT'],
                    ':idu'=>[$idUpr,'INT']
            ];
            $this->dbLink->query('DELETE FROM `upr_i_slo_rola` WHERE `id_rola`=:idr AND `id_upr`=:idu',$sql);  
        }
    }
    private function checkRolePermKey($id,$value)
    {
        if(preg_match('/^perm_(\d)+$/i', $id) && (intval($value,10)===1 ))
        {
            $this->Log->log(0,"[".__METHOD__."] PERM KEY => ".$id." AND VALUE 1");
            return true;
        }
        $this->Log->log(0,"[".__METHOD__."] NO PERM KEY, FOUND => ".$id." OR VALUE NOT 1 => ".$value);
        /* KEY perm_ NOT FOUND */
        /* WRONG VALUE, ACCEPT ONLY 1 */
        return false;
    }
    private function insertRolePerm($value,$keyPerm,$idRole)
    {
        if(!self::checkRolePermKey($keyPerm,$value)){
            return false;
        }
        $tmp_id=explode('_',$keyPerm);   
        $this->Log->log(0,"[".__METHOD__."] ADD ROLE (${idRole}) PERM (".$tmp_id[1].")"); 
        $sql=[
            ':idr'=>[$idRole,'INT'],
            ':idu'=>[$tmp_id[1],'INT']
        ];
        if(self::checkPermRolePairExitsts($sql)){
            return true;
        }
        // NOT EXIST -> ADD
        $this->Log->log(0,__METHOD__." NOT EXIST => ADD");
        self::checkExistSloPerm($tmp_id[1]);
        $this->dbLink->query('INSERT INTO `upr_i_slo_rola` (`id_rola`,`id_upr`) VALUES (:idr,:idu)',$sql); 
    }
    private function checkPermRolePairExitsts($sql){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->dbLink->query('SELECT * FROM `upr_i_slo_rola` WHERE id_rola=:idr AND id_upr=:idu',$sql);
        if(!is_array($this->dbLink->sth->fetch(PDO::FETCH_ASSOC))){
            return false;
        }
        return true;
    }
    private function checkExistSloPerm($idPerm)
    {
        $this->Log->log(0,"[".__METHOD__."] ID PERM => ".$idPerm);
        $this->dbLink->query('SELECT * FROM `uprawnienia` WHERE ID=:i',[':i'=>[$idPerm,'INT']]);
        if(!is_array($this->dbLink->sth->fetch(PDO::FETCH_ASSOC))){
            Throw New Exception ('UPR ('.$idPerm.') NOT EXIST IN DATABASE',1);
        }
    }
    private function getRole()
    {
        $roleData=$this->dbLink->squery('SELECT `ID` as \'i\',`Nazwa` as \'n\',`WSK_U` as \'u\',`create_user` as \'cu\',`create_user_email` as\'cue\',`create_date` as \'cd\' FROM `slo_rola` WHERE `ID`=:i',[':i'=>[$this->inpArray['id'],'INT']]);
        if(count($roleData)!==1){
            Throw New Exception ('FATAL DB ERROR. THERE EXIST MORE THAN ONE OR 0 ROLE WITH ID '.$this->inpArray['id'],1);
        }
        if($roleData[0]['u']==='1'){
            Throw New Exception ('ROLA ZOSTAŁA USUNIĘTA<br/>',0);
        }
        UNSET($roleData[0]['u']);
        return $roleData[0];
    }
    public function getRoleDetails()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        /* CHECK IS NOT REMOVED */
        $v['role']=self::getRole();
        $v['perm']=self::getRolePerm();
        $this->utilities->jsonResponse(__METHOD__,$v,'sRole','POST');
    }
    private function getRolePerm()
    {
        $slo=$this->dbLink->squery('SELECT `ID` as \'i\',`NAZWA` as \'n\' FROM `uprawnienia` WHERE ID>0');
        $rolePerm=$this->dbLink->squery('SELECT `id_rola`as \'i\',`id_upr` as \'iu\' FROM `upr_i_slo_rola` WHERE `id_rola`=:i',[':i'=>[$this->inpArray['id'],'INT']]);
        // COMBINE
       return($this->combineSlo($slo,'i',$rolePerm,'iu'));
    }
    protected function combineSlo($slo,$sloKey,$uprRole,$sloUserKey)
    {
        // $sloKey = ID
        // $sloUserKey = idUprawnienie
        foreach($slo as $id => $value)
        {
            foreach($uprRole as $key => $valueEmpl)
            {
                if($value[$sloKey]===$valueEmpl[$sloUserKey])
                {
                    /* SET CHECKED */
                    $this->Log->log(0,__METHOD__." FOUND (".$valueEmpl[$sloUserKey]." ".$value['n'].") SET CHECKED");
                    $slo[$id]['c']=1;
                    unset($uprRole[$key]);
                    break;
                }
            }
        }
        return($slo);
    }
    protected function checkRoleValueLength()
    {
        $err='';
        if(strlen($this->inpArray['nazwa'])<3){
            $err.="Podana Nazwa jest za krótka<br/>";
        }
        if(strlen($this->inpArray['nazwa'])>30){
            $err.= "Podana Nazwa jest za długa<br/>";
        }
        if($err){
            Throw New Excetion ($err,0);
        }
    }
    public function getRoleUsers()
    {
        $this->utilities->setGet('id',$this->inpArray);
        $v['role']=self::getRole();
        /*
         * TO DO ADD CHECK PERM SHOW_ROLE_USERS
         */
        $v['info']='[SHOW_ROLE_USERS] Brak uprawnienia aby zobaczyć listę przypisanych użytkowników.';
        if(in_array('SHOW_ROLE_USERS',$_SESSION['perm'])){
            $v['user']=$this->dbLink->squery('SELECT Imie,Nazwisko,Login,Email FROM v_all_user WHERE idRola=:idr AND wskU=\'0\' ORDER BY Nazwisko,Imie,ID ASC ',[':idr'=>[$this->inpArray['id'],'INT']]);
            $v['info']='';
        }
        else{
            $v['user']=$this->dbLink->squery('SELECT \'XXX\' as Imie ,\'XXX\' as Nazwisko,\'XXX\' as Login, \'XXX\'as Email FROM v_all_user WHERE idRola=:idr AND wskU=\'0\' ORDER BY Nazwisko,Imie,ID ASC',[':idr'=>[$this->inpArray['id'],'INT']]);
        }
       $this->utilities->jsonResponse(__METHOD__,$v,'rDelete','POST');
    }
    function __destruct(){}
}