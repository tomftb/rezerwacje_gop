<?php
class ldapAuth extends errorConfirm  {

	private $ADparm=array('AD_url'=>"",'AD_filter'=>"",'AD_tree'=>"",'AD_port'=>"",'AD_user'=>"",'AD_pass'=>"",'AD_log'=>0);
        private $ADallUserData=array('user'=>"",'filter'=>"");
	private $ADuserData=array();
	private $library=array('ldap','curl');
	private $functionLibrary=array('ldap'=>array('ldap_connect','ldap_bind','ldap_search','ldap_get_entries'),'curl'=>array('curl_init'));
	function __construct($AD_url="",$AD_filter="",$AD_tree="",$AD_port="",$AD_user="",$AD_pass="")
	{
            parent::__construct();
            $this->log(0,"[".__METHOD__."]");
            self::checkInitialParameters(get_defined_vars());
            self::checkLibraryExists($this->library[0]);
            self::checkPort($this->ADparm["AD_url"],$this->ADparm["AD_port"]);		
	}
        private function checkInitialParameters($parm)
        {
            foreach($parm as $k =>$v)
            {
                $this->log(2,"[".__METHOD__."] $k => $v");
		if(trim($v)!="")
		{	
                    $this->ADparm[$k]=$v;		
		}
		else
		{
                    $this->setError(2,"[ERROR][".__METHOD__."] Nie wprowadzono konfiguracji $k => $v ");
		}
            }
        }
        private function checkLibraryExists($library)
	{
            $this->log(2,"[".__METHOD__."]");
            if($this->getError()) { return false; }
            if(extension_loaded($library))
            {	
                $this->log(1,"[".__METHOD__."] Rozszerzenie ".$library." jest uwzględnione w konfiguracji PHP.");
		foreach($this->functionLibrary[$library] as $libraryId => $functionName)
		{
                    $this->checkFunctionExists($library,$functionName);
		}		
            }
            else
            {
		$this->setError(2,"[".mb_strtoupper($library)."] Rozszerzenie ".$library." NIE jest uwzględnione w konfiguracji PHP.");	
            }
	}
	private function checkFunctionExists($library,$function)
	{
            $this->log(2,"[".__METHOD__."]");
            if($this->getError()) { return false; }
            if (function_exists($function))
            {
                $this->log(1,"[".__METHOD__."] Funkcja ".$function." istnieje.");
            }
            else
            {
		$this->setError(2,"[".mb_strtoupper($library)."] Funkcja ".$function." NIE istnieje.");			
            }
	}
	public function getUserAdData($data1="",$data2=0) // ldpa -> array [][]
	{
            $this->log(0,"[".__METHOD__."]");
            if($this->getError()) { return false; }	
            $this->log(1,"[".__METHOD__."]Przekazane parametry [".$data1."][".$data2."]");	
			
		/*
		if(!is_numeric($data2))
		{
			$this->setError(0,"[".__METHOD__."]","Drugi parametr powinien być liczbą.",1);
		}
		*/
		if($data1!="" && $data2>=0)
		{	
			if(in_array($data1,$this->ADuserData))
			{
                            $this->log(1,"[".__METHOD__."][LDAP]".$this->ADuserData[$data1][$data2]);
                            return $this->ADuserData[$data1][$data2];
			}
			else
			{
				$this->setError(0,"[".__METHOD__."]","Nie odnaleziono szukanego rekordu.",2);
			}
		}
		else
		{
                    $this->log(1,"[".__METHOD__."][LDAP] Zwracam całość");
                    return $this->ADuserData;
		}
	}
	/*-------------------------------------------------- END getUserAdData ------------------------------------*/
	private function checkPort($host,$port) // check host 
	{
            $this->log(1,"[".__METHOD__."]");
            if($this->getError()) { return false; }
            $errno="";
            $errstr="";
            $timeout=4;
            try
            {
		$connection = @fsockopen($host,$port,$errno,$errstr,$timeout);//
		if (is_resource($connection))
		{
                    $this->log(1,"[".__METHOD__."] connection is_resource. $host:$port ( ".getservbyport($port, 'tcp').") jest otwarty.");     
                    fclose($connection);
                }
		else
		{
                    $errno=iconv('cp1250', "UTF-8", $errno);
                    $errstr=iconv('cp1250', "UTF-8", $errstr);
                    $this->setError(2,"[".__METHOD__."] Client REMOTE ADDR => ".$_SERVER['REMOTE_ADDR'].". Brak odpowiedzi ".$host.":".$port." [".$errno." - ".$errstr."].");
		}
            }
            catch (Exception $e)
            {
                $this->setError(2,"[".__METHOD__."] Przechwycono wyjatek: ".$e->getMessage());
            }
	}
	public function loginAd($user="",$password="")
	{
            $this->log(0,"[".__METHOD__."]");
            if($this->clearData($user,0)!=null && $this->clearData($password,0)!="")
            {
            	foreach(get_defined_vars() as $key =>$value)
            	{
                    $this->log(2,"[".__METHOD__."] ${key} - ${value}");
                    $this->ADparm[$key]=$value;
		}
                //self::getAllAdUsers();
                self::connectAD();	
            }
            else
            {
                $this->setError(0,"[ERROR]"," Nie wprowadzono danych autoryzacyjnych użytkownika.",0);
            }
	}
	private function connectAD()
	{	
            $this->log(0,"[".__METHOD__."]");
            try
            {
                $ADLDAP_CON = ldap_connect('ldap://'.$this->ADparm['AD_url']);
                ldap_set_option($ADLDAP_CON, LDAP_OPT_PROTOCOL_VERSION, 3);  
                if(@ldap_bind($ADLDAP_CON,$this->ADparm['AD_user'],$this->ADparm['AD_pass'])) //
                {
                    $this->log(1,"[".__METHOD__."] ldap_bind => ok");
                    //$this->logMultidimensional(1,$this->ADparm['user'],__METHOD__." ADParm[user]",0);
                    //$this->logMultidimensional(1,$this->ADparm['user'],__METHOD__." ADParm[filter]",0);
                    $filter = str_replace('%u',$this->ADparm['user'],$this->ADparm['AD_filter']);
                    //$sr=ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], '(&(sAMAccountName=tborczynski)(objectcategory=person)(objectclass=user))');
                    $sr = @ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], $filter);
                    if(!$sr)
                    {
                        $this->log(0,"[".__METHOD__."] ldap_search ERROR");
                        $this->setError(2,"[ERROR] Sprawdz parametr AD_tree i filtr.");
                    }
                    $this->logMultidimensional(1,$sr,__METHOD__." sr",0);
                    //$this->logMultidimensional(1,$filter,__METHOD__." filter",0);
                    $result = @ldap_get_entries($ADLDAP_CON, $sr);
                    //var_dump($result);
                    //die();
                    if(!$result)
                    {
                        $this->log(0,"[".__METHOD__."] ldap_get_entries ERROR");
                        $this->setError(2,"[ERROR] Sprawdz parametr filtr.");
                    }
                    if($result['count'] == 1)
                    {
                        $this->log(1,"[".__METHOD__."] ldap_get_entries == 1");
                        self::ldapUserBind($ADLDAP_CON,$result[0]['dn'],$this->ADparm['password'],$sr);
                    }
                    else
                    {
                        $this->log(0,"[".__METHOD__."] ldap_get_entries != 1");
                        $this->setError(0,"[ERROR] Z danymi autoryzacyjnymi nie jest powiązany żaden użytkownik AD.");
                    }				
                    @ldap_unbind($ADLDAP_CON);
                }
                else
                {
                    $this->log(0,"[".__METHOD__."] ldap_bind == FALSE");
                    $this->setError(0,"[ERROR][".__METHOD__."]"," ldap_bind = FALSE");
                }
            }
            catch(Exception $e)
            {
                $this->setError(2,"[".__METHOD__."]","Przechwycono wyjatek: ".$e->getMessage());
            }	
            return 0;
	}
        private function ldapUserBind(&$connLink,$user,$pass,$sr='')
        {
            if(@ldap_bind($connLink,$user,$pass))
            {
                $this->ADuserData=ldap_get_attributes($connLink,ldap_first_entry($connLink, $sr));
                //$this->logMultidimensional(1,$this->ADuserData,__METHOD__,0);
                //ldap_unbind($connLink);
            }
            else
            {
                $this->log(0,"[".__METHOD__."] ldap_bind => NO");
                $this->setError(0,"[ERROR][AD] Błędne dane autoryzacyjne.");
            }
        }
        private function getAllAdUsers()
        {
            $this->log(0,"[".__METHOD__."]");
            $this->ADallUserData['filter']='(&(physicalDeliveryOfficeName=%u)(objectcategory=person)(objectclass=user))';
            /*
             * PRZYKLADOWA KONSTRUKCJA
             */
            $this->ADallUserData['user']=array(
                array("HOŁUB","ROMAN","156")
            );
            /*
             * PRZYKLADOWA KONTRUKCJA :
             */
            $nr_tel = array(
                    array('ewid' => '001602','tel' => '502509059')
            );
            $ADLDAP_CON = ldap_connect('ldap://'.$this->ADparm['AD_url']);
            ldap_set_option($ADLDAP_CON, LDAP_OPT_PROTOCOL_VERSION, 3);
		
            if(@ldap_bind($ADLDAP_CON,$this->ADparm['AD_user'],$this->ADparm['AD_pass'])) //
            {
                $this->log(1,"[".__METHOD__."] ldap_bind => ok");
                foreach($this->ADallUserData['user'] as $k => $v)
                {
                    self::addZero($v['2']);
                    $filter = str_replace('%u',$v['2'],$this->ADallUserData['filter']);
                    $sr = ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], $filter);
                    //$this->logMultidimensional(1,$filter,__METHOD__." filter",0);
                    $result = ldap_get_entries($ADLDAP_CON, $sr);
                    //$this->logMultidimensional(1,$result,__METHOD__." result",0);
                    if($result['count'] == 1)
                    {
                        $this->ADallUserData['user'][$k]['KontoAD']='TAK';
                        //$this->log(1,"[".__METHOD__."] ldap_get_entries == 1");
                        //$this->log(1,"[".__METHOD__."] mail => ".$result[0]['mail'][0]);
                        if(trim($result[0]['mail'][0])!='')
                        {
                            $this->ADallUserData['user'][$k]['KontoEMAIL']='TAK';
                            $this->ADallUserData['user'][$k]['EMAIL']=$result[0]['mail'][0];
                            $this->ADallUserData['user'][$k]['LoginEMAIL']=self::getEmailLogin($result[0]['mail'][0]);
                        }
                        else
                        {
                            $this->ADallUserData['user'][$k]['KontoEMAIL']='NIE';
                        }
                        $tel='';
                        foreach($nr_tel as $e => $t)
                        {
                            if($t['ewid']==$this->ADallUserData['user'][$k][2])
                            {
                                $tel=$t['tel'];
                                UNSET($nr_tel[$e]);
                                break;
                            }
                        }
                        if($tel!=='')
                        {
                            $this->ADallUserData['user'][$k]['Telefon']=$tel;
                        }
                        else
                        {
                            $this->ADallUserData['user'][$k]['Telefon']='BRAK';
                        }
                    }
                    else
                    {
                        //$this->log(1,"[".__METHOD__."] ldap_get_entries != 1");
                        $this->ADallUserData['user'][$k]['KontoAD']='NIE';
                        $this->ADallUserData['user'][$k]['KontoEMAIL']='NIE';
                        $this->ADallUserData['user'][$k]['Telefon']='BRAK';
                        //$this->setError(0,"[ERROR]"," Z danymi autoryzacyjnymi nie jest powiązany żaden użytkownik AD.",0);
                    }	
                    //$this->log(1,$k.",".$v[0].",".$v[1].",".$v[2].",".$this->ADparm['user'][$k]['KontoAD'].",".$this->ADparm['user'][$k]['EMAIL'].",".$this->ADparm['user'][$k]['LoginEMAIL'].",".$this->ADparm['user'][$k]['Telefon']);
               
                    $this->log(1,$v[0].",".$v[1].",".$v[2].",".$this->ADallUserData['user'][$k]['KontoAD'].",".$this->ADallUserData['user'][$k]['EMAIL'].",".$this->ADallUserData['user'][$k]['LoginEMAIL'].",".$this->ADallUserData['user'][$k]['Telefon']);
                }
                @ldap_unbind($ADLDAP_CON);
            }
            else
            {
                $this->log(1,"[".__METHOD__."] ldap_bind == FALSE");
		$this->setError(0,"[ERROR][".__METHOD__."]"," ldap_bind = FALSE");
            }	
            /*
            echo "<pre>";
            print_r($this->ADparm['user']);
            echo "</pre>";
            die(__LINE__);
            */
            return 0;
        }
        private function addZero(&$data)
        {
            $nr_ewid=6;
            $c=mb_strlen($data);
            if($c<$nr_ewid)
            {
                $data=str_repeat("0",($nr_ewid-$c)).$data;
            }
        }
        private function getEmailLogin($data)
        {
            $tmp=explode('@',$data);
            $data= strtolower(trim($tmp[0]));   
            return $data;
        }
	private function clearData($data,$lvl=1)
	{
            /* ltrim
                " " (ASCII 32 (0x20)), an ordinary space.
                "\t" (ASCII 9 (0x09)), a tab.
                "\n" (ASCII 10 (0x0A)), a new line (line feed).
                "\r" (ASCII 13 (0x0D)), a carriage return.
                "\0" (ASCII 0 (0x00)), the NUL-byte.
                "\x0B" (ASCII 11 (0x0B)), a vertical tab.
            */
            $data=ltrim($data);
            if($lvl==0 && $data!='')
            {		
		$patterns = array('/\//','/\*/','/\#/'); // nie moze byc backslash
		foreach($patterns as $value)
		{
                    //echo $value."</br>";
                    $data=preg_replace($value, '', $data);
		}
		$data=strip_tags($data);
		$data=htmlspecialchars($data, ENT_QUOTES);
		//echo $this->css['pS'].$this->css['sOkS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
            }
            //echo $this->css['pS'].$this->css['sOkS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
	return $data;
	}
	function __destruct()
	{	
            $this->log(0,"[".__METHOD__."]");	
	}
}

