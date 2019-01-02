<?php
//echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_OK\">Załadowano funkcję </span>- ".basename(__FILE__,'.php')."</p>";
//$ADLDAP_CON="";
//if(checkFile('.cfg/users.php')) include('.cfg/users.php');

class ldapAuth {


	private $ADparm=array('AD_url'=>"",'AD_filter'=>"",'AD_tree'=>"",'AD_port'=>"",'AD_user'=>"",'AD_pass'=>"",'AD_log'=>0);
	private $ADuserData=array();
	protected $error="";
	private $ldapConf="";
	private $log=FALSE;
	private $css=array(
			'pS'=>"<p style=\"font-weight:normal;font-size:14px;color:black;margin:0px;\">",
			'pE'=>"</p>",
			'sErrS'=>"<span style=\"color:red\">",
			'sE'=>"</span>",
			'sOkS'=>"<span style=\"color:green\">"
			);
	private $library=array('ldap','curl');
	private $functionLibrary=array('ldap'=>array('ldap_connect','ldap_bind','ldap_search','ldap_get_entries'),'curl'=>array('curl_init'));
	function __construct($AD_url="",$AD_filter="",$AD_tree="",$AD_port="",$AD_user="",$AD_pass="",$AD_log="")
	{
		foreach(get_defined_vars() as $key =>$value)
		{
			if($this->clearData($value)!="")
			{
				
				if($AD_log!="" && $AD_log==1)
				{
					echo $this->css['pS'].$this->css['sOkS']."[".__METHOD__."]".$this->css['sE'].$key." - ".$value.$this->css['pE'];
				};			
				$this->ADparm[$key]=$value;
				
			}
			else
			{
				//echo "[AD=err]$key - $value</br>";
				$this->setError("[ERROR][".__METHOD__."]","Nie wprowadzono konfiguracji - ".$key.".");
			};
		};
		$this->checkLibraryExists($this->library[0],1);
		$this->checkPort($this->ADparm["AD_url"],$this->ADparm["AD_port"]);		
	}
/*----------------------------------------------------- checkLibraryExists -------------------------------*/
	private function checkLibraryExists($library,$lvl)
	{
		if(extension_loaded($library))
		{
			//if(isset($this->ADparm['AD_log']) && $this->ADparm['AD_log']==1)
			if($this->ADparm['AD_log']==1)
			{
				echo $this->css['pS'].$this->css['sOkS'];
				echo "[".__METHOD__."]";
				echo $this->css['sE']."Biblioteka ".$library." jest uwzględniona w konfiguracji PHP.".$this->css['pE'];
			};
			foreach($this->functionLibrary[$library] as $libraryId => $functionName)
			{
				$this->checkFunctionExists($library,$functionName,$lvl);
			};
		return 1;		
		}
		else
		{
			//echo "err</br>";
		$this->setError("[ERROR][".mb_strtoupper($library)."]","Biblioteka ".$library." nie jest uwzględniona w konfiguracji PHP.",$lvl);
		//echo "nie bedzie mozna sprawdzic hosta</br>";		
		return 0;
		};
	return 0;
	}
/*----------------------------------------------------- checkFunctionExists -------------------------------*/
	private function checkFunctionExists($library,$function,$lvl)
	{
		
			if (function_exists($function))
			{
				if($this->ADparm['AD_log']==1)
				{
					echo $this->css['pS'].$this->css['sOkS'];
					echo "[".__METHOD__."]";
					echo $this->css['sE']."Funkcja ".mb_strtoupper($function)." istnieje".$this->css['pE'];
				};				
				return 1;
			}
			else
			{
				$this->setError("[ERROR][".mb_strtoupper($library)."]","Funkcja ".mb_strtoupper($function)." NIE istnieje.",$lvl);
				return 0;			
			};
	return 0;
	}
	/*----------------------------------------------------- showUserLog --------------------------------------*/
	public function showUserLog($lvl="")
	{
		if($lvl!="" && $lvl==1)
		{
			$this->log=TRUE;
			$this->setError("[".__METHOD__."]"," Uruchomiono logowanie na poziomie - ".$this->log.".",2);	
		}
		else
		{
			$this->setError("[".__METHOD__."]"," Przekazano nieprawidłowy poziom logowania informacji.",2);
		};
	}
	/*----------------------------------------------------- END showUserLog ----------------------------------*/
	/*----------------------------------------------------- getUserAdData ------------------------------------*/
	public function getUserAdData($data1="",$data2=0) // ldpa -> array [][]
	{
		if($this->ADparm['AD_log']==1)
		{
			
			echo $this->css['pS'].$this->css['sOkS'];
			echo "[".__METHOD__."]";
			echo $this->css['sE']."Przekazane parametry [".$data1."][".$data2."]".$this->css['pE'];
		};	
		/*
		if(!is_numeric($data2))
		{
			$this->setError("[".__METHOD__."]","Drugi parametr powinien być liczbą.",1);
		}
		*/
		if($data1!="" && $data2>=0)
		{	
			if(in_array($data1,$this->ADuserData))
			{
				if($this->ADparm['AD_log']==1)
				{
					echo $this->css['pS'].$this->css['sOkS'];
					echo '[LDAP]'.$this->css['sE']. $this->ADuserData[$data1][$data2];
					echo $this->css['pE'];
				};
				return $this->ADuserData[$data1][$data2];
			}
			else
			{
				$this->setError("[".__METHOD__."]","Nie odnaleziono szukanego rekordu.",2);
			}
		}
		else
		{
			if($this->ADparm['AD_log']==1)
				{
					echo $this->css['pS'].$this->css['sOkS'];
					echo "[".__METHOD__."]".$this->css['sE']."Zwracam całość";
					echo $this->css['pE'];
				};
			return $this->ADuserData;
		};
	}
	/*-------------------------------------------------- END getUserAdData ------------------------------------*/
	private function checkPort($host,$port) // check host 
	{
		//echo "port";
		$errno="";
		$errstr="";
		$timeout=4;
		try
		{
			$connection = @fsockopen($host,$port,$errno,$errstr,$timeout);//
			if (is_resource($connection))
			{
				if($this->ADparm['AD_log']==1)
				{
					echo $this->css['pS'].$this->css['sOkS'];
					echo '[LDAP]'.$this->css['sE']. $host . ':' . $port . ' ' . '( ';
					echo getservbyport($port, 'tcp') . ') jest otwarty.' .$this->css['pE'];
				};
				fclose($connection);
			}
			else
			{
				$errno=iconv('cp1250', "UTF-8", $errno);
				$errstr=iconv('cp1250', "UTF-8", $errstr);
				$this->setError("[ERROR][".__METHOD__."]","Brak odpowiedzi ".$host.":".$port." [".$errno." - ".$errstr."].");
			};
		}
		catch (Exception $e)
		{
   			echo 'Przechwycono wyjatek: ',  $e->getMessage(), "\n";
		};
	}
	public function loginAd($user="",$password="")
	{
		
		if($this->clearData($user,0)!=null && $this->clearData($password,0)!="")
		{
			foreach(get_defined_vars() as $key =>$value)
			{
				//echo "$key - $value</br>";
				if($this->log)
				{
					echo $this->css['pS'].$this->css['sOkS']."[LDAP][".__METHOD__."]".$this->css['sE'].$key." - ".$value.$this->css['pE'];
				};
				$this->ADparm[$key]=$value;
				$this->ldapConf.=$key." ".$value;
			};
			if($this->connectAD()) return 1;
			else return 0;
			
			// ldap://
			/*
			$this->ADparm["ADlogin"]=$user;
			$this->ADparm["ADpassword"]=$password;
			*/	
			//echo $this->css['pS'].$this->css['sOkS']."[LDAP]".$this->css['sE'].$data.$this->css['pE'];	
		}
		else
		{
			$this->setError("[ERROR]"," Nie wprowadzono danych autoryzacyjnych użytkownika.",0);
		};
	}
	private function setError($function,$data,$lvl=1)
	{
		//echo "set error - $lvl</br>";
		//echo "[error]".$this->error."<br/>";
		if ($lvl==1)
		{
			$this->error.=$this->css['pS'].$this->css['sErrS'].$function.$this->css['sE'].$data.$this->css['pS'];
			die($this->getError());
		}
		else if($lvl==0)
		{
			$this->error.=$function.$data; 
			//echo $this->getError();
		}
		else
		{
			//echo "lvl=2";
			$this->error.=$this->css['pS'].$this->css['sErrS'].$function.$this->css['sE'].$data.$this->css['pS'];
			echo $this->getError();
			$this->error="";
		};
	}
	public function getError()
	{
		return $this->error;
	}
	private function setLdapConf($data)
	{
		$this->LdapConf.=$data;
	}
	public function getLdapConf()
	{
		return $this->ldapConf;
	}
	private function connectAD()
	{	
		$ADLDAP_CON = ldap_connect('ldap://'.$this->ADparm['AD_url']);
		ldap_set_option($ADLDAP_CON, LDAP_OPT_PROTOCOL_VERSION, 3);
		
			if(@ldap_bind($ADLDAP_CON,$this->ADparm['AD_user'],$this->ADparm['AD_pass'])) //
			{
				if($this->log)
				{
				echo $this->css['pS'].$this->css['sOkS']."[".__METHOD__."]".$this->css['sE']."ldap_bind - OK".$this->css['pE'];
				};
				
				$filter = str_replace('%u',$this->ADparm['user'],$this->ADparm['AD_filter']);
				/* 				
				echo "filter - ".$filter."</br>";
				echo "AD_tree - ".$this->ADparm['AD_tree']."</br>";
				*/
				
				//$sr=ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], '(&(sAMAccountName=tborczynski)(objectcategory=person)(objectclass=user))');
				$sr = ldap_search($ADLDAP_CON, $this->ADparm['AD_tree'], $filter);
				$result = ldap_get_entries($ADLDAP_CON, $sr);
				if($result['count'] == 1)
				{
					if($this->ADparm['AD_log']==1)
					{
					echo $this->css['pS'].$this->css['sOkS'];
					echo "[".__METHOD__."]".$this->css['sE']."ldap_get_entries - OK";
					echo $this->css['pE'];
					/* 
						echo $result[0]['dn']."</br>";
						echo $this->ADparm['password']."</br>"; 
					*/				
					};
					if(@ldap_bind($ADLDAP_CON,$result[0]['dn'],$this->ADparm['password']))
					{
						$this->ADuserData=ldap_get_attributes($ADLDAP_CON,ldap_first_entry($ADLDAP_CON, $sr));
						if($this->ADparm['AD_log']==1)
						{
							
							/*
							echo "<pre>";
							print_r($this->ADuserData);
							echo "</pre>";
							echo $this->ADuserData['mail'][0];
							*/
						};
						@ldap_unbind($ADLDAP_CON);
						if($this->ADparm['AD_log']==1)
						{
							echo $this->css['pS'].$this->css['sOkS'];
							echo "[".__METHOD__."]".$this->css['sE']."CONNECT OK";
							echo $this->css['pE'];
						};
						return 1;
					}
					else
					{
						if($this->ADparm['AD_log']==1)
						{
						echo $this->css['pS'].$this->css['sOkS'];
						echo "[".__METHOD__."]".$this->css['sE']."ldap_bind - NO";
						echo $this->css['pE'];
						};
						$this->setError("[ERROR][AD]"," Błędne dane autoryzacyjne.",0);
					};
				}
				else
				{
					if($this->ADparm['AD_log']==1)
					{
					echo $this->css['pS'].$this->css['sOkS'];
					echo "[".__METHOD__."]".$this->css['sE']."ldap_get_entries - NO";
					echo $this->css['pE'];
					};
					$this->setError("[ERROR]"," Z danymi autoryzacyjnymi nie jest powiązany żaden użytkownik AD.",0);
				}				
				@ldap_unbind($ADLDAP_CON);
			}
			else
			{
				$this->setError("[ERROR][".__METHOD__."]"," ldap_bind = FALSE");
			};	
			return 0;
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
			};
			$data=strip_tags($data);
			$data=htmlspecialchars($data, ENT_QUOTES);
			//echo $this->css['pS'].$this->css['sOkS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
		}
		//echo $this->css['pS'].$this->css['sOkS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
	return $data;
	}
	function __destruct()
	{	
		if($this->log)
		{
			echo $this->css['pS'].$this->css['sOkS']."[LDAP]".$this->css['sE']."destruct".$this->css['pE'];
		};
	}
};
/*
Przykład użycia:
$ADcheck = new ldapAuth(urlAD,treeAd,filterAd,portAD,userAD,passAD,logAD);
$ADcheck->loginAd(loginUzytkwonika,hasloUzytkwownika);
$ADcheck->getError() - bez parametru, wyswietla ostrzezenia np. bledne dane autyryzacyjne uzytkownika AD
$ADcheck->log(); - wyswietla log pracy klasy Active Directory;
Wazne !
Krytyczne bledy, takie jak brak biblioteki ldap, wyrzucaja komunuikat error, oraz wywyoluja funkcje die()
*/
//$ADcheck = new ldapAuth('geofizyka.geofizyka.pl','(&(sAMAccountName=%u)(objectcategory=person)(objectclass=user))','ou=Geofizyka, dc=geofizyka, dc=pl',389,'ldap@geofizyka.pl','Ld4p321',0); 
//$ADcheck->showUserLog(1);
//$ADcheck->loginAd($_POST["username"],$_POST["password"]);
//$ADcheck->getUserAdData(array('mail',0));
/*
echo "<pre>";
print_r($ADcheck->getUserAdData());
echo "</pre>";
die("STOP");
*/
/*
echo "<pre>";
print_r($ADcheck->getUserAdData('mail',0));
echo "</pre>";
*/
//echo $ADcheck->getUserAdData('mail',0);
//$err='<p class="p_err">'.$ADcheck->getError().'</p>';
//echo $err;
//die("STOP</br>");
?>
