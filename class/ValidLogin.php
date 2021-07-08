<?php
class ValidLogin
{
    private $info="";
    private $getLogout="";
    private $bgColor="";
    private $userName="";
    private $userPassword="";
    private $userData=array();
    private $dbLink;
    private $logLink;
    private $Error;
    
    public function __construct(){
        $this->logLink=Logger::init(__METHOD__);
        $this->Error=New ErrorHandler();
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->userName=filter_input(INPUT_POST,"username");
        $this->userPassword=filter_input(INPUT_POST,"password");
    }
    public function checkLoginData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        if(self::checkGet()){
            return 0;
        }
        else if(self::checkSession()){
            return 1;
        }
        //else if(isset($_SESSION["perm"]) && in_array('LOG_INTO_APP',$_SESSION['perm'])){
         //   $this->logLink->log(0,"[".__METHOD__."] SESSION ALREADY INITIALISED");
        //    return 1;
       // }
        else if((trim($this->userName)==='') && (trim($this->userPassword)==='')){
            return 0;
        }
        else{
            try {
                self::loadDb();
                self::getUserData();
                self::checkUserData();
                self::checkLogin();
                self::getUserPerm();
                self::setSessionData();
            } 
            catch (Throwable $t){ // Executed only in PHP 7, will not match in PHP 5.x     
                self::setError($t->getMessage(),$t->getCode());
		return 0;
            } 
            finally{
            
            }
           
        }
        return 1;
    }
    private function checkSession(){
         $this->logLink->log(0,"[".__METHOD__."]");
         if(isset($_SESSION["perm"]) && in_array('LOG_INTO_APP',$_SESSION['perm'])){
            return 1;
         }
        return 0;
    }
    private function checkGet(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->getLogout = filter_input(INPUT_GET, 'logout');
        if($this->getLogout==='t'){
            $this->info='Wylogowano.';
            $this->bgColor='bg-success';
            if(!session_unset()){
                $this->logLink->log(0,"[".__METHOD__."] session_unset NOT WORK");
                return 0;
            }
            return 1;
        }
        return 0;
    }
    public function getInfoValue(){
        $this->logLink->log(0,"[".__METHOD__."]");
        return $this->info;
    }
    public function getBgColorValue(){
        $this->logLink->log(0,"[".__METHOD__."]");
        return $this->bgColor;
    }
    private function checkLoginInAD(){
        $this->logLink->log(0,"[".__METHOD__."]");
        /* GET FROM CONST */
        $ldap=new ldapAuth(ldapParm['host'],ldapParm['filter'],ldapParm['tree'],ldapParm['port'],ldapParm['user'],ldapParm['password']); 
        $ldap->loginAd($this->userName,$this->userPassword);
        $_SESSION["mail"]=$ldap->getUserAdData('mail',0);
        $_SESSION["nazwiskoImie"]=$ldap->getUserAdData('name',0);      
    }
    private function checkLogin(){
        $this->logLink->log(0,"[".__METHOD__."] ACCOUNT TYPE => ".$this->userData[0]['typ']);
        $this->userData[0]['typ']=intval($this->userData[0]['typ'],10);
        /* TO DO => GET AVALIABLE ACCOUNT TYPE */
        /* CHECK ACCOUNT TYPE */
        if($this->userData[0]['typ']===2){
            /* 
             * LOCAL ACCOUNT => CHECK PASSWORD 
             * password_hash("test", PASSWORD_BCRYPT, ["cost" => $cost]);
             */
            //$this->logLink->log(0,"[".__METHOD__."] ".password_hash($this->userPassword, PASSWORD_BCRYPT));
            if (!password_verify($this->userPassword, $this->userData[0]['haslo'])) {
                Throw New Exception('Błędne hasło.',0);
            }
            $_SESSION["mail"]=$this->userData[0]['email'];
            $_SESSION["nazwiskoImie"]=$this->userData[0]['nazwisko'].' '.$this->userData[0]['imie']; 
        }
        else if($this->userData[0]['typ']===1){
            /* AD ACCOUNT => CHECK IN AD */
            self::checkLoginInAD();
        }
        else{
            /* WRONG ACCOUNT TYPE => SET ERROR */
            $this->logLink->log(0,"[".__METHOD__."] Wrong account type => ".$this->userData[0]['typ']);
            Throw New Exception('Brak uprawnienia do zalogowania się.',0);
        }
    }
    private function setSessionData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $_SESSION["username"]=$this->userName;
        $_SESSION["userid"]=$this->userData[0]['id'];
        $_SESSION["perm"]=$this->userData['perm'];  
        $_SESSION["uid"]= uniqid();
    }
    private function getUserData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        try{
            $this->userData=$this->dbLink->squery("SELECT `id`,`imie`,`nazwisko`,`email`,`wsk_u`,`typ`,`haslo`,`id_rola` FROM `uzytkownik` WHERE `login`=:login",[':login'=>[$this->userName,'STR']]);
            $this->logLink->logMulti(2,$this->userData,__METHOD__);
	}
	catch (PDOException $e){
            $this->logLink->log(0,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            Throw New Exception('[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!');
	}
    }
    private function checkUserData(){
        $this->logLink->log(0,"[".__METHOD__."]");
        if(count($this->userData)!==1){
            $this->logLink->log(0,"[".__METHOD__."] THERE IS NO USER OR THERE IS MORE THAN ONE USER WITH LOGIN => ".$this->userName);
            Throw New Exception('Brak uprawnienia do zalogowania się.',0);
        }
    }
    private function loadDB(){
        $this->logLink->log(0,"[".__METHOD__."]");
	$this->dbLink=LoadDb::load();
	if(!$this->dbLink){
            Throw New Exception('Błąd Aplikacji. Skontaktuj się z Administratorem!',1);
	}
    }
    private function getUserPerm(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->setActSessionPermRole();
        if(!in_array('LOG_INTO_APP',$this->userData['perm'])){
            self::setError('[LOG_INTO_APP] Brak uprawnienia do zalogowania się','');
            return 0;
        }
        $this->logLink->log(0,"[".__METHOD__."] Uprawnienie `LOG_INTO_APP` istnieje, loguje...");
        return 1;
    }
    protected function setActSessionPermRole(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $sqlData[':id_rola']=array(intval($this->userData[0]['id_rola'],10),'INT');
        $sqlDataPerm[':id']=array(intval($this->userData[0]['id'],10),'INT');
        try{
            /* ROLE PERM */
            $this->userData['rolePerm']=$this->dbLink->squery("SELECT `SKROT` FROM v_upr_i_slo_rola_v2 WHERE `idRola`=:id_rola",$sqlData);
            $this->logLink->logMulti(2,$this->userData['rolePerm'],__METHOD__."::ROLE PERM");
            /* USER PERM */
            $this->userData['userPerm']=$this->dbLink->squery("SELECT `SKROT` FROM `v_uzyt_i_upr_v2` WHERE `idUzytkownik`=:id",$sqlDataPerm);
            $this->logLink->logMulti(2,$this->userData['userPerm'],__METHOD__."::USER PERM");
            /* COMBINE PERM */
            self::combinePerm();
	}
	catch (PDOException $e){
            $this->logLink->log(0,"[".__METHOD__."] Wystąpił błąd zapytania bazy danych: ".$e->getMessage());
            Throw New Exception('[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!',1);
	}
    }
    private function combinePerm(){
        $this->logLink->log(0,"[".__METHOD__."]");
        $this->userData['perm']=array();
        foreach($this->userData['rolePerm'] as $v){
            array_push($this->userData['perm'],$v['SKROT']);
        }
        foreach($this->userData['userPerm'] as $v){
            if(!in_array($v['SKROT'],$this->userData['perm'])){
                array_push($this->userData['perm'],$v['SKROT']);
            }
        }
        $this->logLink->logMulti(2,$this->userData['perm'],__METHOD__."::COMBINE PERM");
    }
    private function setError($error='',$lvl=0){
        $this->Error->setError($error,$lvl);
        $this->info=$this->Error->getError();
        $this->bgColor='bg-danger';
    }
    public function __destruct() {}
}