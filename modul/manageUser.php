<?php
class manageUser extends initialDb
{
    private $inpArray=array();
    private $actData=array();
    private $responseType='POST';
    private $accountType='';

    function __construct(){
        parent::__construct();
        parent::log(0,"[".__METHOD__."]");
        $this->utilities=NEW utilities();
        $this->response=NEW Response('User');
    }
    public function cUser(){
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->inpArray['ID']=0;
        $this->actData['haslo']='';
        try {
            // self::checkInputFields(); /* TO DO */
            self::checkUserValueLength();
            self::checkUserData();
            self::addUser();
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            $this->response->setError(1,'PHP7 Caught exception: '.$t->getMessage()." in ".$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            $this->response->setError(1,'PHP5 Caught exception: '.$e->getMessage()." in ".$e->getFile());
        }
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    protected function setActSessionPermRole(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        if($_SESSION['userid']!==$this->inpArray['ID']) { return ''; }
        $qData[':id']=array($this->inpArray['ID'],'INT');
        parent::newQuery("SELECT `id_rola` as 'IdRola' FROM `uzytkownik` WHERE `id`=:id",$qData); 
        $idRole=parent::getSth()->fetch(PDO::FETCH_ASSOC);
        if(!is_array($idRole)){
            throw new ErrorException(' USER '.$this->inpArray['ID'].' NOT EXIST IN DATABASE', 0, 0, __METHOD__, __LINE__);
        }    
        $this->logMulti(0,$idRole['IdRola'],__LINE__."::".__METHOD__." idRole");
        // UPDATE CURRENT USER SESSION PERM;
        $permRole=array();
        $idRole=intval($idRole['IdRola'],10);
        if($idRole>0){
            parent::newQuery("SELECT `SKROT` FROM `v_upr_i_slo_rola_v2` WHERE `idRola`=".$idRole); 
            $permRole=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        }
        parent::newQuery('SELECT `SKROT` FROM `v_uzyt_i_upr_v2` WHERE `idUzytkownik`='.$this->inpArray['ID']); 
        $perm=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        $_SESSION['perm']=array();
        foreach(array_merge($perm,$permRole) as $v){
            array_push($_SESSION['perm'],$v['SKROT']);
        }
        $this->logMultidimensional(2,$_SESSION['perm'],__LINE__."::".__METHOD__." SESSION['perm']");
    }
    public function eUserOn(){
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        //parent::logMulti(2,$this->inpArray,__METHOD__."::POST");
        try {
            // self::checkInputFields(); /* TO DO */
            self::checkUserValueLength();
            self::sqlGetUserFullData();
            self::checkUserData();
            self::updateUser();    
        } 
        catch (Throwable $t) { // Executed only in PHP 7, will not match in PHP 5.x         
            $this->response->setError(1,'PHP7 Caught exception: '.$t->getMessage()." in ".$t->getFile());
        } 
        catch (Exception $e) {// Executed only in PHP 5.x, will not be reached in PHP 7
            $this->response->setError(1,'PHP5 Caught exception: '.$e->getMessage()." in ".$e->getFile());
        }
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    private function checkUserData(){
        if($this->response->getError()){ return false;}
        try{
            self::sqlCheckUserExist();
            self::checkUserAccountType();
            self::checkUserAccountPassword();   
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
    }
    private function updateUser(){
        if($this->response->getError()){ return false;}
        try{
            parent::beginTransaction(); //PHP 5.1 and new
            self::sqlUpdateUser();  
            self::setPerm();
            self::setActSessionPermRole();
            parent::commit();  
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage()); 
            parent::rollback();
        }
    }
    private function sqlCheckUserExist(){
        parent::log(0,"[".__METHOD__."]");
        $query_data=array(
            ':id'=>array(intval($this->inpArray['ID'],10),'INT'),
            ':login'=>array(trim($this->inpArray['Login']),'STR'),
            ':imie'=>array(trim($this->inpArray['Imie']),'STR'),
            ':nazwisko'=>array(trim($this->inpArray['Nazwisko']),'STR')
            );
        parent::newQuery("select `id` FROM `uzytkownik` WHERE `id`!=:id AND `wsk_u`='0' AND (`login`=:login OR (`nazwisko`=:nazwisko AND `imie`=:imie))",$query_data); 
        if(count(parent::getSth()->fetchAll(PDO::FETCH_ASSOC))>0){
            $this->response->setError(0,"Istnieje już użytkownik o podanym loginie lub imieniu i nazwisku");
        }
    }
    
    private function checkUserAccountType(){
        parent::log(0,"[".__METHOD__."]");
        self::setAccountType();
        self::checkAccountTypeExist();
    }
    private function setAccountType(){
        $acc=explode('|',$this->inpArray['accounttype']);
        $this->inpArray['accounttype']=intval($acc[0],10); 
    }
    private function checkAccountTypeExist(){
        $qData[':id']=array($this->inpArray['accounttype'],'INT'); //$this->inpArray['accounttype']
        parent::newQuery("select `id`,`name` FROM `app_account_type` WHERE `id`=:id AND `wsk_u`='0'",$qData); 
        $tmp=parent::getSth()->fetch(PDO::FETCH_ASSOC);
        if(!is_array($tmp)){
            throw new ErrorException(' ACCOUNT TYPE '.$this->inpArray['accounttype'].' NOT EXIST IN DATABASE', 0, 0, __METHOD__, __LINE__);
        }
        else{
            $this->accountType=$tmp['name'];
        }
    }
    private function checkUserAccountPassword(){
        parent::log(0,"[".__METHOD__."]");
        parent::log(0,"ACCOUNT TYPE => ".$this->accountType);
        switch($this->accountType){
            case 'Active Directory':
                /* NOTHING TO DO => SET OLD PASSWORD */
                $this->inpArray['Haslo']=$this->actData['haslo'];
                break;
            case 'Local':
                self::setUserPassword(); 
                break;
            default:
                    throw new ErrorException(' ACCOUNT TYPE `'.$this->accountType.'` NOT OPERATED', 0, 0, __METHOD__, __LINE__);
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
        parent::log(0,"[".__METHOD__."]");
        /* TRIM */
        parent::log(0,$this->inpArray['Haslo']);
        $this->inpArray['Haslo']=trim($this->inpArray['Haslo']);
        /* LENGTH */
        $check=self::checkDataLength($this->inpArray['Haslo'],'polu hasło',6,30);
        if($check){
            $this->response->setError(0,$check);
        }
        /* PREG_MATCH = TWO DIGIT */
        if(!preg_match('/.*\d+.*/', $this->inpArray['Haslo'])){
            $this->response->setError(0,'W haśle musi się znależć co najmniej jedna cyfra');
        }
        if(!preg_match('/.*\D+.*\D+.*/', $this->inpArray['Haslo'])){
            $this->response->setError(0,'W haśle muszą się znależć co najmniej dwie litery');
        }
        if(!preg_match('/[!@#$%^&*()_+]+/', $this->inpArray['Haslo'])){
            $this->response->setError(0,'W haśle musi się znależć co najmniej jeden znak specjalny !@#$%^&*()_+');
        }
    }
    private function setPassword(){
        parent::log(0,"[".__METHOD__."] PASSWORD_BCRYPT ALGORITHM");
        if($this->response->getError()){ return false;}
        $this->inpArray['Haslo']=password_hash($this->inpArray['Haslo'], PASSWORD_BCRYPT);
        //parent::log(0,$this->inpArray['Haslo']);
        parent::log(0,"LENGTH => ".mb_strlen($this->inpArray['Haslo']));
    }
    protected function setUserPerm($permArray,$userId)
    {
        parent::log(0,"[".__METHOD__."]");
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
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        self::setPerm();
        self::setActSessionPermRole();
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    private function sqlGetSloPerm(){
        parent::log(0,"[".__METHOD__."]");
        $db=array();
        parent::newQuery("SELECT `ID` FROM `v_slo_upr` WHERE `ID`>0");   
        //$tmp=parent::getSth()->fetchAll(PDO::FETCH_ASSOC)['bu'];
        foreach(parent::getSth()->fetchAll(PDO::FETCH_ASSOC) as $v){
            array_push($db,$v['ID']);
        }
        $this->logMulti(2,$db,__LINE__."::".__METHOD__." db");
        return ($db);
    }
    protected function checkPermInDb($t1,$t2)
    {
        /*
         * CHECK EXIST IN DB
         * t1 => POST
         * t2 => DATABASE
         */
        parent::log(2,"[".__METHOD__."]");   
        foreach($t1 as $v)
        {
            //$this->logMultidimensional(0,$v,__LINE__."::".__METHOD__." t1");
            parent::log(2,"[".__METHOD__."] ID => ".$v); 
            if(!in_array($v,$t2))
            {  
                $this->response->setError(1,"DICTIONARY ID => ".$v." NOT FOUND IN DB");
                break;
            }         
        }
    }
    private function setPerm(){
        if($this->response->getError()){ return false;}
        $permDb=self::sqlGetSloPerm();
        $permPost=$this->utilities->getArrayKeyValue('ID',$this->utilities->getCboxFromInput($this->inpArray));
        self::checkPermInDb($permPost,$permDb);
        if($this->response->getError()) { return ''; }
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
    protected function checkDataLength($value,$label,$min,$max){
        parent::log(0,"[".__METHOD__."]");
        $check=$this->utilities->checkValueLength($value,$label,$min,$max);
        if($check){
            $this->response->setError(0,$check);
        }
    }
    protected function checkUserValueLength(){
        parent::log(0,"[".__METHOD__."]");
        $check[0]=self::checkDataLength($this->inpArray['Imie'],'polu imię',3,30);
        $check[1]=self::checkDataLength($this->inpArray['Nazwisko'],'polu nazwisko',3,30);
        $check[2]=self::checkDataLength($this->inpArray['Login'],'polu login',3,30);
        foreach($check as $v){
            if($v){
                $this->response->setError(0,$v);
            }
        }
    }
    protected function addUser(){
        if($this->response->getError()){ return false;}
        try{
            parent::beginTransaction(); //PHP 5.1 and new
            self::sqlUpdateUser();  
            self::sqlAddUser();
            $this->inpArray['ID']= parent::lastInsertId(); 
            self::setPerm();
            parent::commit();  
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage()); 
            parent::rollback();
        }
    }
    private function sqlAddUser(){
        $qData=array();
        self::addSqlUserAddOns($qData);
        parent::newQuery("INSERT INTO `uzytkownik` (`imie`,`nazwisko`,`login`,`haslo`,`email`,`typ`,`id_rola`,`mod_dat`,`mod_user`,`mod_user_id`) VALUES
		(:imie,:nazwisko,:login,:email,:haslo,:typ,:id_rola,:mod_dat,:mod_user,:mod_user_id);",$qData);
    } 
    private function sqlUpdateUser()
    {
        if($this->response->getError()){ return false;}
        $qData=array(
            ':id'=>array($this->inpArray['ID'],'INT'), 
        );
        self::addSqlUserAddOns($qData);
        parent::newQuery("UPDATE `uzytkownik` SET `imie`=:imie,`nazwisko`=:nazwisko,`login`=:login,`email`=:email,`haslo`=:haslo,`typ`=:typ,`id_rola`=:id_rola,`mod_dat`=:mod_dat,`mod_user`=:mod_user,`mod_user_id`=:mod_user_id WHERE `id`=:id",$qData);
    }
    private function addSqlUserAddOns(&$data){
        $addOns=array(
            ':imie'=>array(trim($this->inpArray['Imie']),'STR'),
            ':nazwisko'=>array(trim($this->inpArray['Nazwisko']),'STR'),
            ':login'=>array(trim($this->inpArray['Login']),'STR'),
            ':email'=>array(trim($this->inpArray['Email']),'STR'),
            ':haslo'=>array($this->inpArray['Haslo'],'STR'),
            ':typ'=>array($this->inpArray['accounttype'],'INT'),
            ':id_rola'=>array($this->inpArray['Rola'],'INT'),
            ':mod_dat'=>array($this->cDT,'STR'),
            ':mod_user'=>array($_SESSION["username"],'STR'),
            ':mod_user_id'=>array($_SESSION["userid"],'INT'),
        );
        $this->utilities->mergeArray($data,$addOns);
    }
    protected function sqlAddUserPerm($userId,$value)
    {
        if($this->response->getError()) { return ''; }
        parent::log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
        /* CHECK IS EXIST */
        parent::newQuery("select * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`=".$userId." AND `idUprawnienie`=".$value); 
        if(!is_array(parent::getSth()->fetch(PDO::FETCH_ASSOC))){
            /* NOT EXIST => INSERT */
            parent::newQuery('INSERT INTO `uzyt_i_upr` (`id_uzytkownik`,`id_uprawnienie`) VALUES ('.$userId.','.$value.')'); 
        }
    }
    protected function sqlRemoveUserPerm($userId,$value)
    {
        if($this->response->getError()) { return ''; }
        parent::log(2,"[".__METHOD__."] USER ID => ".$userId.", VALUE => ".$value);
         /* CHECK IS EXIST */
        parent::newQuery("select * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`=".$userId." AND `idUprawnienie`=".$value); 
        if(is_array(parent::getSth()->fetch(PDO::FETCH_ASSOC))){
            /* EXIST -> DELETE */
            parent::newQuery('DELETE FROM `uzyt_i_upr` WHERE `id_uzytkownik`='.$userId.' AND `id_uprawnienie`='.$value); 
        }   
    }
    protected function sqlGetUserFullData(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()) { return ''; }
        try{
            $qData[':id']=array($this->inpArray['ID'],'INT'); //$this->inpArray['accounttype']
            parent::newQuery("select * FROM `uzytkownik` WHERE `id`=:id",$qData); 
            $this->actData=parent::getSth()->fetch(PDO::FETCH_ASSOC);
            if(!is_array($this->actData)){
                throw new ErrorException(' USER `'.$this->inpArray['ID'].'` NOT EXIST IN', 0, 0, __METHOD__, __LINE__);
            } 
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
       
        parent::logMulti(0,$this->actData);
    }
    # DELETED PROJECT IN DB
    public function dUser(){
        parent::log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST); 
        /* TO DO => CHECK INPUT */
        try{
            $qData[':id']=array($this->inpArray['ID'],'INT'); //$this->inpArray['accounttype']
            parent::newQuery("UPDATE `uzytkownik` SET `wsk_u`='1' WHERE `id`=:id",$qData); 
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }
        return($this->response->setResponse(__METHOD__,'ok','cModal','POST'));
    }
    public function getUsersLike(){
        parent::log(0,"[".__METHOD__."]");
        $this->responseType='GET';
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);

        parent::log(0,"[".__METHOD__."] filter => ".$f);
        parent::logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT u.`id` as 'ID',u.`imie` as 'Imie',u.`nazwisko` as 'Nazwisko',u.`login` as 'Login',u.`email` as 'Email',a.`name` as 'TypKonta', (SELECT r.`NAZWA` FROM `slo_rola` as r WHERE  u.`id_rola`=r.`id` ) as `Rola` FROM `uzytkownik` u, `app_account_type` as a WHERE u.`typ`=a.`id`  AND u.`wsk_u`=:wsk_u AND";
        $where='';
        $idWhere='';
        $query_data=array();
        if(is_numeric($f)){
            parent::log(0,"[".__METHOD__."] filter is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $idWhere="u.`id` LIKE (:id) OR ";
        }
        else{
            parent::log(0,"[".__METHOD__."] filter not numeric ");
        }
        $where=" (".$idWhere." u.`imie` LIKE :filtr OR u.`nazwisko` LIKE :filtr OR u.`email` LIKE :filtr OR a.`name` LIKE :filtr) ORDER BY u.`id` ASC";
        self::setGetWsk('u');
        //self::setGetWsk('v');
        $query_data[':wsk_u']=array($this->inpArray['u'],'STR');
        $query_data[':filtr']=array('%'.$f.'%','STR');
        try{
            parent::newQuery($select.$where,$query_data);   
	}
	catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
	}
        return($this->response->setResponse(__METHOD__,parent::getSth()->fetchAll(PDO::FETCH_ASSOC),'','GET'));  
    }
    private function setGetWsk($wsk='u'){
        $this->inpArray[$wsk]=filter_input(INPUT_GET,$wsk);
        if($this->inpArray[$wsk]===null || $this->inpArray[$wsk]===false){
            parent::log(0,"[".__METHOD__."] wsk_".$wsk." NOT EXIST, SET DEFAULT 0");
            $this->inpArray[$wsk]='0';
        }
    }
    public function getUserDel(){
        parent::log(0,"[".__METHOD__."]");    
        self::setGetId();
        /* TO DO GET USER DALA WITH DELETE SLO */
        return($this->response->setResponse(__METHOD__,$this->inpArray['id'],'dUser','POST'));
        
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID'){
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->actData=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    public function getUserPerm(){
        parent::log(0,"[".__METHOD__."]");
        self::setGetId();
        array_push($this->actData,$this->inpArray['id']);
        array_push($this->actData,self::sqlGetUserPerm());
        return($this->response->setResponse(__METHOD__,$this->actData,'uPermOff','POST'));
    }
    private function sqlGetUserPerm(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        /* GET DICTIONARY */
        parent::newQuery('SELECT * FROM `v_slo_upr` WHERE `ID`>0 ORDER BY `ID` ASC ');
        $slo=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        parent::logMulti(2,$slo,__LINE__."::".__METHOD__." slo");
        /* GET USER DICTIONARY */
        parent::newQuery('SELECT * FROM `v_uzyt_i_upr` WHERE `idUzytkownik`='.$this->inpArray['id'].' ORDER BY `idUprawnienie` ASC');
        $userSlo=parent::getSth()->fetchAll(PDO::FETCH_ASSOC);
        parent::logMulti(2,$userSlo,__LINE__."::".__METHOD__." userSlo");
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
        parent::log(0,"[".__METHOD__."]");
        self::setGetId();
        self::getUserAllDetails(); 
        return($this->response->setResponse(__METHOD__,$this->actData,'eUser','POST'));
    }
    private function getUserAllDetails(){
        if($this->response->getError()){ return false;}
        try{
            /* GET USER DATA */
            $this->actData['user']=self::sqlGetUserData();
            /* GET USER PERM */
            $this->actData['perm']=self::sqlGetUserPerm();
            /* GET USER ROLE */
            $this->actData['role']=self::getUserRole();
            /* GET ACCOUNT TYPE */
            $this->actData['accounttype']=self::getAccountType();
            $this->logMultidimensional(2,$this->actData,__LINE__."::".__METHOD__." data");
        }
        catch (PDOException $e){
            $this->response->setError(1,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
        }  
    }
    private function sqlGetUserdata(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        $sqlData=array(':id'=>array($this->inpArray['id'],'INT'));
        parent::newQuery("SELECT * FROM `v_all_user` WHERE `id`=:id",$sqlData);
        return (parent::getSth()->fetch(PDO::FETCH_ASSOC));
    }
    private function getAccountType(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        $noUserAccount=self::sqlGetNotUserAccountType();
        parent::logMulti(0,$noUserAccount,'noUserAccount');
        $account[0]=self::sqlGetUserAccountType();
        return array_merge($account,$noUserAccount);
    }
    protected function sqlGetAllAccountType(){
        parent::log(0,"[".__METHOD__."]");
        if($this->response->getError()){ return false;}
        parent::newQuery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`wsk_u`='0' ORDER BY a.`id`");
        return ( parent::getSth()->fetchAll(PDO::FETCH_ASSOC));
    }
    private function sqlGetUserAccountType(){
        parent::newQuery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`id`=".$this->actData['user']['TypKontaValue']);
        return ( parent::getSth()->fetch(PDO::FETCH_ASSOC));
    }
    private function sqlGetNotUserAccountType(){
        parent::newQuery("SELECT a.`id`,a.`name` FROM `app_account_type` a WHERE a.`wsk_u`='0' AND a.`id`!=".$this->actData['user']['TypKontaValue']." ORDER BY a.`id`");
        return ( parent::getSth()->fetchAll(PDO::FETCH_ASSOC));
    }
    public function getUserRole(){
        parent::log(0,"[".__METHOD__."] ID USER ROLE => ".$this->actData['user']['IdRola']);
        if($this->response->getError()){ return false;}
        $userRoleSlo=array();
        $emptArr=array(array('ID'=>'0','NAZWA'=>'','DEFAULT'=>'t'));
        /* GET ALL ROLE */ 
        $allRole=self::sqlGetAllRole();
  
        if($this->actData['user']['IdRola']!='')
        {
            // COMBINE USER DICT
            $emptArr=array('ID'=>'0','NAZWA'=>''); 
            $userRole=self::sqlGetUserRole($this->actData['user']['IdRola']);
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
       return $userRoleSlo;
    }
    private function sqlGetAllRole(){
        parent::newQuery("SELECT * FROM `v_slo_rola`");
        return (parent::getSth()->fetchAll(PDO::FETCH_ASSOC));
    }
    private function sqlGetUserRole($idRole){
        parent::newQuery('SELECT *,"t" AS "DEFAULT" FROM `v_slo_rola` WHERE `ID`='.$idRole);
        return (parent::getSth()->fetchAll(PDO::FETCH_ASSOC));
    }
    public function getNewUserSlo(){
        parent::log(0,"[".__METHOD__."]");
        // SLO UPR
        $actData['perm']=$this->query('SELECT * FROM v_slo_upr WHERE 1=? ORDER BY ID ASC ',1);
        // SLO ROLA
        $actData['role']=$this->query('SELECT * FROM v_slo_rola WHERE 1=? ORDER BY ID ASC ',1);
        /* ACCOUNT TYPE */
        $actData['accounttype']=self::sqlGetAllAccountType();
        array_push($actData['role'],array('ID'=>'0','NAZWA'=>'','DEFAULT'=>'t'));
        return($this->response->setResponse(__METHOD__, $actData,'cUser','POST'));
    }
    private function setGetId(){
        if(!$this->utilities->setGetIntKey($this->inpArray['id'],'id')){
             $this->response->setError(1,"[".__METHOD__."] KEY id NOT EXIST OR ID IS NOT INT");
        }
    }
    function __destruct()
    {}
}