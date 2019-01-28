<?php
if(checkFile('function/ldap.php')) include('function/ldap.php');
if(checkFile('.cfg/config.php')) include_once('.cfg/config.php');

class validLogin extends ldapAuth
{
    private $info="";
    private $url="";
    private $getLogout="";
    private $bgColor="";
    private $userName="";
    private $userPassword="";
    private $userData=array();
    private $showLog=0;
    
    public function __construct()
    {
       //echo "konstruktor run<br/>";
        $this->userName=filter_input(INPUT_POST,"username");
        $this->userPassword=filter_input(INPUT_POST,"password");
        //echo "username - ".$this->userName."<br/>";
    }
    
    public function checkLoginData()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; };
        if($this->checkGet())
        {
            //echo "aa";
            return 0;
        }
        else if(isset($_SESSION["permission"]) && $_SESSION["permission"]==='yes')
        {
            //echo "bb";
            return 1;
        }
        else if((trim($this->userName)==='') && (trim($this->userPassword)===''))
        {
            // echo "cc";
            return 0;
        }
        else
        {
            //echo "dd";
            if(!$this->checkLoginInValidUsers()) {return 0;};
            if(!$this->checkLoginInAD()) {return 0;};
        }
        return 1;
    }
    private function checkGet()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; };
        $this->getLogout = filter_input(INPUT_GET, 'logout');
        //echo $this->getLogout."<br/>";
        if($this->getLogout==='t')
        {
            // SET PARAMATERS OF VIEW
            $this->info='Wylogowano.';
            $this->bgColor='bg-success';
            // CLEAR SESSION DATA
            $this->clearSessionData();
            return 1;
        };
        return 0;
    }
    public function getInfoValue()
    {
        return $this->info;
    }
    public function getBgColorValue()
    {
        return $this->bgColor;
    }
    private function clearSessionData()
    {
        foreach($_SESSION as $klucz=>$wartosc)
        {
            unset($_SESSION[$klucz]);	
        }; 
    }
    private function checkLoginInAD()
    {
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; };
        parent::__construct('geofizyka.geofizyka.pl','(&(sAMAccountName=%u)(objectcategory=person)(objectclass=user))','ou=Geofizyka, dc=geofizyka, dc=pl',389,'ldap@geofizyka.pl','Ld4p321',0);
        
        if($this->loginAd($this->userName,$this->userPassword))
        //if(!$ADcheck->getError())
        {
            $_SESSION["username"]=$this->userName;
            $_SESSION["permission"]="yes";
            $_SESSION["mail"]=$this->getUserAdData('mail',0);
            //$_SESSION["mail"]=$ADcheck->getUserAdData('mail',0);
            $_SESSION["nazwiskoImie"]=$this->getUserAdData('name',0);
            //$_SESSION["nazwiskoImie"]=$ADcheck->getUserAdData('name',0);
            
            return 1;
	}
        else
        {
            $this->info=$this->getError();
            $this->bgColor='bg-danger';
        };
        return 0;
    }
    private function checkLoginInValidUsers()
    {
        $dbLink=NEW initialDb();
        $dbLink->getDbLink();	
        $dbLink->query('SELECT id,imie,nazwisko,login FROM uzytkownik WHERE wsk_u=? AND login=?','0,'.$this->userName);
        $userData=$dbLink->queryReturnValue();
        
        #print_r($this->userFullInfo);
        #print_r($dbLink->queryReturnValue());
         
        #echo "Ilość znależionych rekordów - ".count($dbLink->queryReturnValue())."</br>";
        #die('STOP');
        if($this->showLog>0) { echo "[".__METHOD__."]<br/>"; };
        # OLD VERSION
        #if(checkFile('.cfg/users.php')) include('.cfg/users.php');
        # OLD VERSION
        #if(in_array($this->userName,$conf['validusers']))
        if(count($userData)>0)
        {
            $this->userData=$userData[0];
            $_SESSION["id"]=$this->userData['id'];
            return 1;
        }
        else
        {
            $this->info='Brak uprawnienia do zalogowania się.';
            $this->bgColor='bg-danger';
        }
        return 0;
    }
    public function __destruct() {
    
    }
}


