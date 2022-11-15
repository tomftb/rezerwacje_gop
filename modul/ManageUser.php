<?php
class ManageUser
{
    private $inpArray=array();
    private $actData=array();
    private $accountType='';
    private $Log;
    private $dbLink;
    
    public function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities=NEW Utilities();
    }
    public function cUser(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->inpArray['ID']=0;
        $this->actData['haslo']='';
        // self::checkInputFields(); /* TO DO */
        self::checkUserValueLength();
        self::checkUserData();
        self::addUser();
        $this->utilities->jsonResponse('ok','cModal');
    }
    protected function setActSessionPermRole(){
        $this->Log->log(0,"[".__METHOD__."]");
        if($_SESSION['userid']!==$this->inpArray['ID']) { return ''; }
        $this->dbLink->query("SELECT `id_rola` as 'IdRola' FROM `uzytkownik` WHERE `id`=:id",[':id'=>[$this->inpArray['ID'],'INT']]); 
        $idRole=$this->dbLink->sth->fetch(PDO::FETCH_ASSOC);
        if(!is_array($idRole)){
            Throw New Exception('USER '.$this->inpArray['ID'].' NOT EXIST IN DATABASE',1);
        }    
        $this->Log->logMulti(0,$idRole['IdRola'],__LINE__."::".__METHOD__." idRole");
        // UPDATE CURRENT USER SESSION PERM;
        $permRole=array();
        $idRole=intval($idRole['IdRola'],10);
        if($idRole>0){
            $this->dbLink->query("SELECT `SKROT` FROM `v_upr_i_slo_rola_v2` WHERE `idRola`=".$idRole); 
            $permRole=$this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC);
        }
        $this->dbLink->query('SELECT `SKROT` FROM `v_uzyt_i_upr_v2` WHERE `idUzytkownik`='.$this->inpArray['ID']); 
        $perm=$this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC);
        $_SESSION['perm']=array();
        foreach(array_merge($perm,$permRole) as $v){
            array_push($_SESSION['perm'],$v['SKROT']);
        }
        $this->Log->logMulti(2,$_SESSION['perm'],__LINE__."::".__METHOD__." SESSION['perm']");
    }
    public function eUserOn(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        //$this->Log->logMulti(2,$this->inpArray,__METHOD__."::POST");
        // self::checkInputFields(); /* TO DO */
        //throw new exception('aaaa');
        self::checkUserValueLength();
        self::sqlGetUserFullData();
        self::checkUserData();
        self::updateUser();    
        $this->utilities->jsonResponse('ok','cModal');
    }
    private function checkUserData(){
        self::sqlCheckUserExist();
        self::checkUserAccountType();
        self::checkUserAccountPassword();   
    }
    private function updateUser(){
        $this->Log->log(0,"[".__METHOD__."]");
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            self::sqlUpdateUser();  
            self::setPerm();
            self::setActSessionPermRole();
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }
    }
    private function sqlCheckUserExist(){
        $this->Log->log(0,"[".__METHOD__."]");
        $query_data=[
            ':id'=>array(intval($this->inpArray['ID'],10),'INT'),
            ':login'=>array(trim($this->inpArray['Login']),'STR'),
            ':imie'=>array(trim($this->inpArray['Imie']),'STR'),
            ':nazwisko'=>array(trim($this->inpArray['Nazwisko']),'STR')
            ];
        if(count($this->dbLink->squery("select `id` FROM `uzytkownik` WHERE `id`!=:id AND `wsk_u`='0' AND (`login`=:login OR (`nazwisko`=:nazwisko AND `imie`=:imie))",$query_data))>0){
            Throw New Exception("Istnieje już użytkownik o podanym loginie lub imieniu i nazwisku",0);
        }
    }
    private function checkUserAccountType(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setAccountType();
        self::checkAccountTypeExist();
    }
    private function setAccountType(){
        $acc=explode('|',$this->inpArray['accounttype']);
        $this->inpArray['accounttype']=intval($acc[0],10); 
    }
    private function checkAccountTypeExist()
    {
        $tmp=$this->dbLink->squery("select `id`,`name` FROM `app_account_type` WHERE `id`=:id AND `wsk_u`='0'",[':id'=>[$this->inpArray['accounttype'],'INT']]);
        if(!is_array($tmp)){
            throw new Exception(' ACCOUNT TYPE '.$this->inpArray['accounttype'].' NOT EXIST IN DATABASE',1);
        }
        $this->accountType=$tmp[0]['name'];  
    }
    private function checkUserAccountPassword(){
        $this->Log->log(0,"ACCOUNT TYPE => ".$this->accountType);
        switch($this->accountType){
            case 'Active Directory':
                /* NOTHING TO DO => SET OLD PASSWORD */
                $this->inpArray['Haslo']=$this->actData['haslo'];
                break;
            case 'Local':
                self::setUserPassword(); 
                break;
            default:
                throw new Exception(' ACCOUNT TYPE `'.$this->accountType.'` NOT OPERATED',1);
        }
    }
    private function setUserPassword(){
        //$this->actData['haslo']
        //$this->actData['typ']
        if(strcmp($this->inpArray['Haslo'],'')===0 && strcmp($this->actData['haslo'],'')!==0){
            /* USE OLD PASSWORD */
            $this->inpArray['Haslo']=$this->actData['haslo'];
        }
        else{
            self::checkUserPassword();
            self::setPassword();
        }
    }
    private function checkUserPassword(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* TRIM */
        $this->Log->log(0,$this->inpArray['Haslo']);
        $this->inpArray['Haslo']=trim($this->inpArray['Haslo']);
        /* LENGTH */
        $err=self::checkPasswordLength();
        /* PREG_MATCH = TWO DIGIT */
        if(!preg_match('/.*\d+.*/', $this->inpArray['Haslo'])){
            $err.='<br/>W haśle musi się znależć co najmniej jedna cyfra';
        }
        if(!preg_match('/.*\D+.*\D+.*/', $this->inpArray['Haslo'])){
            $err.='<br/>W haśle muszą się znależć co najmniej dwie litery';
        }
        if(!preg_match('/[!@#$%^&*()_+]+/', $this->inpArray['Haslo'])){
            $err.='<br/>W haśle musi się znależć co najmniej jeden znak specjalny !@#$%^&*()_+';
        }
        if($err){ 
            Throw New Exception($err,0);    
        }
    }
    private function checkPasswordLength(){
        $length = strlen($this->inpArray['Haslo']);
        if($length<6){
                    return 'za krótkie hasło';
        }
        if($length>30){
            return 'za długie hasło';
        }
        return ''; 
    }
    private function setPassword(){
        $this->Log->log(0,"[".__METHOD__."] PASSWORD_BCRYPT ALGORITHM");
        $this->inpArray['Haslo']=password_hash($this->inpArray['Haslo'], PASSWORD_BCRYPT);
        //$this->Log->log(0,$this->inpArray['Haslo']);
        $this->Log->log(0,"LENGTH => ".mb_strlen($this->inpArray['Haslo']));
    }
    protected function setUserPerm($permArray,$userId)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if($this->getError()) { return '';}
        foreach($permArray as $value)
        {
            //echo $value[0].' - '.$value[1];
            if($value[2]>0){
                self::sqlAddUserPerm($userId,$value[0]);
            }
            else{
                self::sqlRemoveUserPerm($userId,$value[0]);
            }
        }
    }
    public function uPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::setPerm();
        self::setActSessionPermRole();
        $this->utilities->jsonResponse('ok','cModal');
    }
    private function sqlGetSloPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        $db=array(); 
        $this->dbLink->query("SELECT `ID` FROM `v_slo_upr` WHERE `ID`>0");
        foreach($this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC)  as $v){
            array_push($db,$v['ID']);
        }
        $this->Log->logMulti(2,$db,__LINE__."::".__METHOD__." db");
        return ($db);
    }
    protected function checkPermInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        $this->Log->log(2,"[".__METHOD__."]");   
        foreach($t1 as $v)
        {
            //$this->Log->logMulti(0,$v,__LINE__."::".__METHOD__." t1");
            $this->Log->log(2,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2))
            {  
                Throw New Exception ("DICTIONARY ID => ".$v." NOT FOUND IN DB",1);
            }         
        }
    }
    private function setPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        $permDb=self::sqlGetSloPerm();
        $permPost=$this->utilities->getArrayKeyValue('ID',$this->utilities->getCboxFromInput($this->inpArray));
        self::checkPermInDb($permPost,$permDb);
        foreach($permDb as $v){
            if(in_array($v,$permPost)){
                self::sqlAddUserPerm($this->inpArray['ID'],$v);
            }
            else{
                self::sqlRemoveUserPerm($this->inpArray['ID'],$v);
            }
        } 
    }
    protected function checkExistSloPerm($permTab)
    {
       // CHECK SLO IS AVALIABLE
        foreach($permTab as $value)
        {
            if(!$this->checkExistInDb('v_slo_upr','ID=?',$value[0]))
            { 
                $value[1]=preg_replace('/_/', ' ', $value[1]);
                $this->response->setError(1,"[".$value[1]."] PERMISSION DICTIONARY WAS DELETED");
            }
        }
    }
    protected function checkUserValueLength(){
        $this->Log->log(0,"[".__METHOD__."]");
        $check[0]=$this->utilities->checkValueLength($this->inpArray['Imie'],'polu imię',3,30);
        $check[1]=$this->utilities->checkValueLength($this->inpArray['Nazwisko'],'polu nazwisko',3,30);
        $check[2]=$this->utilities->checkValueLength($this->inpArray['Login'],'polu login',3,30);
        
        if($check[0]!=='' || $check[1]!=='' || $check[2]!==''){
            Throw New Exception($check[0].$check[1].$check[2],0);
        }
    }
    protected function addUser(){
        $this->Log->log(0,"[".__METHOD__."]");
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            self::sqlAddUser();
            $this->inpArray['ID']= $this->dbLink->lastInsertId(); 
            self::setPerm();
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Eception ("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
           
        }
    }
    private function sqlAddUser(){
        $qData=[];
        self::addSqlUserAddOns($qData);
        $this->dbLink->query("INSERT INTO `uzytkownik` (`imie`,`nazwisko`,`login`,`haslo`,`email`,`typ`,`id_rola`,`mod_dat`,`mod_user`,`mod_user_id`) VALUES
		(:imie,:nazwisko,:login,:haslo,:email,:typ,:id_rola,:mod_dat,:mod_user,:mod_user_id);",$qData);
    } 
    private function sqlUpdateUser()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $qData=[
            ':id'=>[$this->inpArray['ID'],'INT'], 
        ];
        self::addSqlUserAddOns($qData);
        $this->dbLink->query("UPDATE `uzytkownik` SET `imie`=:imie,`nazwisko`=:nazwisko,`login`=:login,`email`=:email,`haslo`=:haslo,`typ`=:typ,`id_rola`=:id_rola,`mod_dat`=:mod_dat,`mod_user`=:mod_user,`mod_user_id`=:mod_user_id WHERE `id`=:id",$qData);
    }
    private function addSqlUserAddOns(&$data){
        $this->Log->log(0,"[".__METHOD__."]");
        $addOns=[
            ':imie'=>[trim($this->inpArray['Imie']),'STR'],
            ':nazwisko'=>[trim($this->inpArray['Nazwisko']),'STR'],
            ':login'=>[trim($this->inpArray['Login']),'STR'],
            ':email'=>[trim($this->inpArray['Email']),'STR'],
            ':haslo'=>[$this->inpArray['Haslo'],'STR'],
            ':typ'=>[$this->inpArray['accounttype'],'INT'],
            ':id_rola'=>[$this->inpArray['Rola'],'INT'],
            ':mod_dat'=>[CDT,'STR'],
            ':mod_user'=>[$_SESSION["username"],'STR'],
            ':mod_user_id'=>[$_SESSION["userid"],'INT']
        ];
        $this->utilities->mergeArray($data,$addOns);
    }
    protected function sqlAddUserPerm($userId,$value)
    {
        $this->Log->log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
        /* CHECK IS EXIST */ 
        $this->dbLink->query("select * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`=".$userId." AND `idUprawnienie`=".$value);
        if(!is_array($this->dbLink->sth->fetch(PDO::FETCH_ASSOC))){
            /* NOT EXIST => INSERT */
            $this->dbLink->query('INSERT INTO `uzyt_i_upr` (`id_uzytkownik`,`id_uprawnienie`) VALUES ('.$userId.','.$value.')'); 
        }
    }
    protected function sqlRemoveUserPerm($userId,$value)
    {
        $this->Log->log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
         /* CHECK IS EXIST */
        $this->dbLink->query("select * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`=".$userId." AND `idUprawnienie`=".$value);
        if(is_array($this->dbLink->sth->fetch(PDO::FETCH_ASSOC))){
            /* EXIST -> DELETE */
            $this->dbLink->query('DELETE FROM `uzyt_i_upr` WHERE `id_uzytkownik`='.$userId.' AND `id_uprawnienie`='.$value); 
        }   
    }
    protected function sqlGetUserFullData(){
        $this->Log->log(0,"[".__METHOD__."]");
        $user=$this->dbLink->squery("select * FROM `uzytkownik` WHERE `id`=:i",[':i'=>[$this->inpArray['ID'],'INT']]); 
        if(!is_array($user)){
            throw new Exception(' USER `'.$this->inpArray['ID'].'` NOT EXIST IN DATABASE', 1);
        }
        $this->actData=$user[0];
        $this->Log->logMulti(0,$this->actData);
    }
    # DELETED PROJECT IN DB
    public function dUser(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST); 
        $this->utilities->keyExist($this->inpArray,'ID');
        $this->utilities->isEmptyKeyValue($this->inpArray,'ID',true,1);
        /* TO DO => CHECK INPUT */
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query("UPDATE `uzytkownik` SET `wsk_u`='1' WHERE `id`=:id",[':id'=>[$this->inpArray['ID'],'INT']]); 
            $this->dbLink->commit();  
        }
        catch (PDOException $e){
            $this->dbLink->rollback();
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
        }
        $this->utilities->jsonResponse('ok','cModal');
    }
    public function getUsersLike(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->responseType='GET';
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        $this->Log->log(0,"[".__METHOD__."] filter => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT u.`id` as 'ID',u.`imie` as 'Imie',u.`nazwisko` as 'Nazwisko',u.`login` as 'Login',u.`email` as 'Email',a.`name` as 'TypKonta', (SELECT r.`NAZWA` FROM `slo_rola` as r WHERE  u.`id_rola`=r.`id` ) as `Rola` FROM `uzytkownik` u, `app_account_type` as a WHERE u.`typ`=a.`id`  AND u.`wsk_u`=:wsk_u AND";
        $where='';
        $idWhere='';
        $query_data=array();
        $result['users']=[];
        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $idWhere="u.`id` LIKE (:id) OR ";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] filter not numeric ");
        }
        $where=" (".$idWhere." u.`imie` LIKE :filtr OR u.`nazwisko` LIKE :filtr OR u.`email` LIKE :filtr OR a.`name` LIKE :filtr) ORDER BY u.`id` ASC";
        self::setGetWsk('u');
        //self::setGetWsk('v');
        $query_data[':wsk_u']=array($this->inpArray['u'],'STR');
        $query_data[':filtr']=array('%'.$f.'%','STR');
        try{
            $result['users']=$this->dbLink->squery($select.$where,$query_data);   
	}
	catch (PDOException $e){
            Throw New Exception("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1);
	}
        /* $this->dbLink->sth->fetchAll(PDO::FETCH_ASSOC) */
        $this->utilities->jsonResponse($result);  
    }
    private function getUsers(){
        return $this->dbLink->squery("SELECT u.`id` as 'ID',u.`imie` as 'Imie',u.`nazwisko` as 'Nazwisko',u.`login` as 'Login',u.`email` as 'Email',a.`name` as 'TypKonta', (SELECT r.`NAZWA` FROM `slo_rola` as r WHERE  u.`id_rola`=r.`id` ) as `Rola` FROM `uzytkownik` u, `app_account_type` as a WHERE u.`typ`=a.`id`  AND u.`wsk_u`='0' ORDER BY u.Id");   
    }
    private function setGetWsk($wsk='u'){
        $this->inpArray[$wsk]=filter_input(INPUT_GET,$wsk);
        if($this->inpArray[$wsk]===null || $this->inpArray[$wsk]===false){
            $this->Log->log(0,"[".__METHOD__."] wsk_".$wsk." NOT EXIST, SET DEFAULT 0");
            $this->inpArray[$wsk]='0';
        }
    }
    public function getUserDel(){
        $this->Log->log(0,"[".__METHOD__."]");    
        $this->utilities->setGet('id',$this->inpArray);
        /* TO DO GET USER DALA WITH DELETE SLO */
        $this->utilities->jsonResponse($this->inpArray['id'],'dUser');
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID'){
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->actData=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    public function getUserPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        array_push($this->actData,$this->inpArray['id']);
        array_push($this->actData,self::sqlGetUserPerm());
        $this->utilities->jsonResponse($this->actData,'uPermOff');
    }
    private function sqlGetUserPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* GET DICTIONARY */
        $slo=$this->dbLink->squery('SELECT * FROM `v_slo_upr` WHERE `ID`>0 ORDER BY `ID` ASC');
        $this->Log->logMulti(0,$slo,__LINE__."::".__METHOD__." slo");
        /* GET USER DICTIONARY */
        $userSlo=$this->dbLink->squery('SELECT * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`=:i ORDER BY `idUprawnienie` ASC',[':i'=>[$this->inpArray['id'],'INT']]);
        $this->Log->logMulti(0,$userSlo,__LINE__."::".__METHOD__." userSlo");
        /* COMBINE */
        return(self::combineSlo($slo,'ID',$userSlo,'idUprawnienie'));
 }
    protected function combineSlo($slo,$sloKey,$usrSol,$sloUserKey){
        // $sloKey = ID
        // $sloUserKey = idUprawnienie
        foreach($slo as $id => $value){
            foreach($usrSol as $key => $valueEmpl){
                if($value[$sloKey]===$valueEmpl[$sloUserKey]){
                    $slo[$id]['DEFAULT']='t';
                    unset($usrSol[$key]);
                    break;
                }
            }
        }
        return $slo;
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getUserDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        self::getUserAllDetails(); 
        $this->utilities->jsonResponse($this->actData,'eUser');
    }
    private function getUserAllDetails(){
        try{
            /* GET USER DATA */
            self::sqlGetUserData();
            /* GET USER PERM */
            $this->actData['perm']=self::sqlGetUserPerm();
            /* GET USER ROLE */
            self::getUserRole();
            /* GET ACCOUNT TYPE */
            self::getAccountType();
            $this->Log->logMulti(2,$this->actData,__LINE__."::".__METHOD__." data");
        }
        catch (PDOException $e){
            Throw New Exception ("[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage(),1); 
        }  
    }
    private function sqlGetUserdata(){
        $this->Log->log(0,"[".__METHOD__."] USER ID => ".$this->inpArray['id']);
        $user=$this->dbLink->squery("SELECT * FROM `v_all_user` WHERE `id`=:i",[':i'=>[$this->inpArray['id'],'INT']]);
        $count=count($user);
        if($count!==1){
            Throw New Exception ('Użytkownik o ID '.$this->inpArray['id'].' został usunięty ',0);
        }
        if($count>1){
            Throw New Exception ('There is more than 1 ('.$count.') user with ID '.$this->inpArray['id'],1);
        }
        $this->actData['user']=$user[0];
    }
    private function getAccountType(){
        $this->Log->log(0,"[".__METHOD__."] TYP KONTA => ".$this->actData['user']['TypKontaValue']);
        $noUserAccount=$this->dbLink->squery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`wsk_u`='0' AND a.`id`!=".$this->actData['user']['TypKontaValue']." ORDER BY a.`id`");
        $this->Log->logMulti(2,$noUserAccount,'noUserAccount');
        $account=$this->dbLink->squery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`id`=".$this->actData['user']['TypKontaValue']);
        $this->actData['accounttype']=array_merge($account,$noUserAccount);
    }
    public function getUserRole(){
        $this->Log->log(0,"[".__METHOD__."] ID USER ROLE => ".$this->actData['user']['IdRola']);
        $userRoleSlo=[];
        $emptArr=[['ID'=>'0','NAZWA'=>'','DEFAULT'=>'t']];
        /* GET ALL ROLE */ 
        $allRole=$this->dbLink->squery("SELECT * FROM `v_slo_rola`");
        if($this->actData['user']['IdRola']!='')
        {
            // COMBINE USER DICT
            $emptArr=array('ID'=>'0','NAZWA'=>''); 
            $userRole=$this->dbLink->squery('SELECT *,"t" AS "DEFAULT" FROM `v_slo_rola` WHERE `ID`=:i',[':i'=>[$this->actData['user']['IdRola'],'INT']]);
            array_push($userRole,$emptArr);
            foreach($allRole as $key => $value){
                if($value['ID']===$userRole[0]['ID']){
                    unset($allRole[$key]);
                    break;
                }
            }
            $userRoleSlo=array_merge($userRole,$allRole);
        }
        else{
            $userRoleSlo=array_merge($emptArr,$allRole);
        }
       $this->actData['role']=$userRoleSlo;
    }
    public function getNewUserSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        // SLO UPR
        $actData['perm']=$this->dbLink->squery('SELECT * FROM `v_slo_upr` ORDER BY `ID` ASC ');
        // SLO ROLA
        $actData['role']=$this->dbLink->squery('SELECT * FROM `v_slo_rola` ORDER BY `ID` ASC ');
        /* ACCOUNT TYPE */
        $actData['accounttype']=$this->dbLink->squery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`wsk_u`='0' ORDER BY a.`id`");
        array_push($actData['role'],array('ID'=>'0','NAZWA'=>'','DEFAULT'=>'t'));
        $this->utilities->jsonResponse($actData,'cUser');
    }
    public function getModulUsersDefaults(){
        $this->Log->log(0,"[".__METHOD__."]");
        $v['perm']=$_SESSION['perm'];
        $v['users']=self::getUsers();
        $this->utilities->jsonResponse($v,'runMain');  
    }
    function __destruct(){}
}