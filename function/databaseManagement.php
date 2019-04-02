<?php

class dbManage
{
    private $error="";
    private $log=FALSE;
    private $dbLink;
    private $Parm=array('host'=>'','database'=>'','port'=>0,'user'=>'','password'=>'','log_lvl'=>0);
    private $css=array(
                        'pS'=>'<p style="font-family:Times New Roman;font-weight:normal;font-size:16px;color:#000000;margin:0px;padding:0px;\">',
			'pE'=>"</p>",
			'sErrS'=>"<span style=\"color:#ff0000;\">",
			'sE'=>"</span>",
			'sGreenS'=>"<span style=\"color:#00b300;\">",
			'sPurpleS'=>"<span style=\"color:#6600ff;\">",
			'sOrangeS'=>"<span style=\"color:#ff9900;\">",
			'sInfoBlueS'=>"<span style=\"color:#0088cc;\">",
			'sFontBoldS'=>"<span style=\"font-weight:bold;\">",
    );
			private $wynikXmlData=array();
			private $returnValue=array();			
			private $library=array('PDO');
			//private $lastInsertedId=0;
			private $functionLibrary=array('PDO'=>array());
			
			/*##################################################### construct #########################################*/
			function __construct($host="",$database="",$port="",$user="",$password="",$log_lvl=0)
			{
				foreach(get_defined_vars() as $key =>$value)
				{
					if($this->clearData($value,0)!="")
					{
						if($log_lvl!="" && $log_lvl>0)
						{
							//echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."]".$this->css['sE'].$key." - ".$value.$this->css['pE'];
						};			
						$this->Parm[$key]=$value;
					}
					else
					{
						$this->showInfoConnect();
						$this->setError("[ERROR][".__METHOD__."]","Nie wprowadzono konfiguracji - ".$key.".");
					};
				};
				//$this->checkHost($this->Parm['host'],$this->Parm['port']); otwiera polaczenie, ale go nie zamyka !! nie uzywac (testowo ddoana metoda)
				$this->checkLibraryExists($this->library[0],0);
				$this->connectDB();
			}
			/*##################################################### checkLibraryExists ###############################*/
			private function checkLibraryExists($library,$lvl)
				{
					if(extension_loaded($library))
					{
						if($this->Parm['log_lvl']>0)
						{
							echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."][$library]".$this->css['sE']."Biblioteka ".$library." jest uwzględniona w konfiguracji PHP.".$this->css['pE'];
						};
						foreach($this->functionLibrary[$library] as $libraryId => $functionName)
						{
							$this->checkFunctionExists($library,$functionName,$lvl);
						};
					return 1;		
					}
					else
					{
						$this->setError("[ERROR][".__METHOD__."][$library]","Biblioteka ".$library." nie jest uwzględniona w konfiguracji PHP.",$lvl);	
						return 0;
					};
				return 0;
				}
			/*##################################################### checkFunctionExists ###############################*/
			private function checkFunctionExists($library,$function,$lvl)
			{
				
					if (function_exists($function))
					{
						if($this->Parm['log_lvl']>0) 
						{
							echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."][".$library."]".$this->css['sE']."Funkcja $function istnieje".$this->css['pE'];
						};
						return 1;
					}
					else
					{
						$this->setError("[ERROR][".__METHOD__."][".$library."]","Funkcja $function NIE istnieje.",$lvl);
						return 0;			
					};
			return 0;
			}
			/*##################################################### checkHost ##########################################*/
			private function checkHost() // check host port=array
			{
				$errno="";
				$errstr="";
				$timeout=4;
				try
				{
					$connection = @fsockopen($this->Parm['host'],$this->Parm['port'],$errno,$errstr,$timeout);//
					if (is_resource($connection))
					{
						if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sGreenS'].'['.__METHOD__.']'.$this->css['sE'].$this->Parm['host'].':'.$this->Parm['port'] .' '.'('.getservbyport($this->Parm['port'], 'tcp').') jest otwarty.'.$this->css['pE'];
						fclose($connection);
					}
					else
					{
						//echo mb_detect_encoding($errno, "UTF-8,ISO-8859-1");
						//$enc=mb_detect_encoding($errstr, "UTF-8,ISO-8859-1");
						//echo mb_detect_encoding($errstr, "UTF-8,ISO-8859-1,ISO-8859-2");
						$errstr=iconv('cp1250', "UTF-8", $errstr);
						$this->setError("[ERROR][".__METHOD__."]","Brak odpowiedzi ".$this->Parm['host'].":".$this->Parm['port']." [".$errno." - ".$errstr."].");
					};
				}
				catch (Exception $e)
				{
					echo $this->setError("[ERROR][".__METHOD__."]". $e->getMessage()." ");
				};
			}
			/*##################################################### setError ##########################################*/
			private function setError($function,$data,$lvl=0)
			{
				//lvl=0 critical error
				//lvl=1 normal error
				//lvl=2 user error
				//echo "set error - $lvl</br>";
				//echo "[error]".$this->error."<br/>";
				if ($lvl==0)
				{
					$this->error.=$this->css['pS'].$this->css['sErrS'].$function.$this->css['sE'].$data.$this->css['pS'];
					die($this->getError());
                                        //echo $this->getError();
                                        //die();
				}
				else if($lvl==1)
				{
					$this->error.=$this->css['pS'].$this->css['sErrS'].$function.$this->css['sE'].$data.$this->css['pS'];
					//echo $this->getError();
					//$this->error="";
					//echo $this->getError();
				}
				else
				{
					//echo "lvl=2"; and greater
					$this->error.=$function.$data; 
				};
			}
			/*##################################################### getError ##########################################*/
			public function getError()
			{
				return $this->error;
			}
			/*##################################################### getParm ############################################*/
			public function getParm()
			{
				return $this->Parm;
			}
			/*##################################################### showInfoConnect ####################################*/
			private function showInfoConnect()
			{
				$tabInfoAction=array(
									" - host"," - name"," - port"," - user"," - password"," * log lvl info (default 0)"
				);
				echo $this->css['pS'].$this->css['sPurpleS']."W konstruktorze należy podać :".$this->css['sE'].$this->css['pE'];
				foreach($tabInfoAction as $akcja => $opis)
				{
					echo $this->css['pS'].$this->css['sPurpleS'].$akcja.$this->css['sE'].$opis.$this->css['pE'];
				};
			}
			/*##################################################### showParm ###########################################*/
			public function showParm()
			{
				echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metode.".$this->css['pE'];
				print "<pre>";
				print_r($this->Parm);
				print "</pre>";
			}
			/*##################################################### connectDB ##########################################*/
			public function connectDB()
			{
				if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metodę.".$this->css['pE'];
				try
				{
					$this->dbLink = new PDO("mysql:host=".$this->Parm['host'].";dbname=".$this->Parm['database'].";port=".$this->Parm['port'].";encoding=utf8", $this->Parm['user'], $this->Parm['password']);

					$this->dbLink->exec("set names utf8");
                                        $this->dbLink->setAttribute( PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // parametr ,a nastepnie wartosc dla paraemtru // PDO::ERRMODE_EXCEPTION
					$this->dbLink->setAttribute( PDO::ATTR_EMULATE_PREPARES,true); // production set to - false
					$this->dbLink->setAttribute( PDO::ATTR_PERSISTENT, 0); // false
					//$this->dbLink->setAttribute( PDO::ATTR_AUTOCOMMIT,0);
				}
				catch (PDOException $e)
				{
					// pelny blad piszemy samo $e
					$this->setError("[ERROR][".__METHOD__."]","Wystąpił błąd bazy danych :</br>".$e->getMessage()."</br>Powiadom administratora Tomasza Borczyńskiego.");
				};
				
			}
			/*##################################################### query ##############################################*/
			//public function query($sqlAction="",$sqlValue=array()"",$pdoResult=PDO::FETCH_ASSOC)
			public function query($sqlAction="",$sqlValue="",$pdoResult=PDO::FETCH_ASSOC)
			{
				
				if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metodę.".$this->css['pE'];
				
				$check=TRUE; // FALSE
				//$counterValues=0;
				$sqlKeyCount=substr_count($sqlAction, '?');
				foreach(get_defined_vars() as $key =>$value)
				{
					//$counterValues++;
					//echo " key = ".$key." - value = ".$value."<br/>";
					if(is_array($value))
					{
						$arrayCount=count($value);
						
						if($arrayCount===$sqlKeyCount)
						{
							//echo "arrayCount - $arrayCount , sqlKeyCount - $sqlKeyCount<br/>";
							//die("STOP</br>");
						}
						else
						{
							if($check) $check=FALSE;
							break;
						}
					}
					else
					{
						if($this->clearData($value,0)!="")
						{
							if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."]".$this->css['sE'].$key." - ".$value.$this->css['pE'];	
						}
						/* $check=TRUE; */
						else
						{
							if($check) $check=FALSE;
							break;
						};
					};
					
				};
				/*
				if(is_array($sqlValue))
				{
					echo "array()";
					die("STOP</br>");
				};
				*/
				if($check) //$check
				{
					//$curretDateTime=date('Y-m-d h:m:s');
                                        //$curretDateTime=date('Y-m-d H:m:s');
                                        $curretDateTime=date('Y-m-d H:i:s');
					//echo $curretDateTime."</br>";
					//echo "SQL ACTION - ".htmlspecialchars($sqlAction)."</br>";
					//$sqlValue=$this->clearData($sqlValue,0);
					//echo $sqlValue."<br/>";
					if(!is_array($sqlValue))
					{
						$sqlValueArray=explode(',',$sqlValue);
						foreach($sqlValueArray as $id => $wartosc)
						{
							$sqlValueArray[$id]=$this->clearData($sqlValueArray[$id],0);
						};
						/*
						echo "SQL VALUES<pre>";
						print_r($sqlValueArray);
						echo "</pre>";
					*/
						// WARUNEK DLA FUNKCJI NOW() - aktualna data i czas
						if(strpos($sqlValue,'NOW()')!==false) 
						{
							//echo "znalazlem</br>";
							$sqlValue=str_replace('NOW()',$curretDateTime,$sqlValue);
						}
					}
					else
					{
						$sqlValueArray=array();
						foreach($sqlValue as $id => $wartosc)
						{
							$sqlValueArray[$id]=$this->clearData($sqlValue[$id],0);
							if(strpos($sqlValueArray[$id],'NOW()')) 
							{
								//echo "znalazlem</br>";
								$sqlValueArray[$id]=str_replace('NOW()',$curretDateTime,$sqlValueArray[$id]);
							}
						};
					};
					/*
				echo "<pre>";
				print_r($sqlValueArray);
				echo "</pre>";
				*/	
					try
					{
						//$returnValue=array();
						$iValue=0;
						$query = $this->dbLink->prepare($sqlAction);
						$this->dbLink->beginTransaction(); //PHP 5.1 and new
						//$counterValue=count($sqlValueArray );
						$pdoType=PDO::PARAM_STR;
						for($i=1;$i<count($sqlValueArray)+1;$i++)
						{
							//echo "$i - $value <br/>";
							if(is_numeric($value)) $pdoType=PDO::PARAM_INT; //echo "is numeric $value - ".is_numeric($value)."</br>";
							$query->bindValue($i,"'".$value."'",$pdoType);
							$pdoType=PDO::PARAM_STR;
						};
						$finishQuery=$query->execute($sqlValueArray);
						$this->dbLink->commit();  //PHP 5 and new
						//die('STOP<br/>');
						// check action;
						//echo "|$sqlAction|";
						$sqlAction=ltrim($sqlAction);
						$action=substr($sqlAction,0,6);
						$action=strtoupper($action);
						//echo "substr - ".$action."<br/>";
						if($action=='SELECT')
						{
							//echo "SELECT<br/>";
							$this->returnValue = $query->fetchAll($pdoResult); //
							//print_r($query->fetchAll($pdoResult));
						};
						return $finishQuery;
					}
					catch (PDOException $e)
					{
						$this->dbLink->rollback(); 
						$this->setError("[ERROR][".__METHOD__."]","Wystąpił błąd zapytania - $sqlAction  :</br>".$e->getMessage()); //
					};
				}
				else
				{
					$this->setError("[ERROR][".__METHOD__."]","Nie uzupełniono wszystkich wymaganych pól.",1);
				}
			}
			/*##################################################### queryLastId ########################################*/
			public function queryLastId()
			{
				// default 0
				// dziala jezeli istnieje kolumna ID z auto icrement
				//if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metodę.".$this->css['pE'];
					try
					{
						$stmt = $this->dbLink->query("SELECT LAST_INSERT_ID()");
						$lastId = $stmt->fetchColumn();
						//echo "1 - ".$this->dbLink->lastInsertId()." - last id<br/>";
						//$this->lastInsertedId=$this->dbLink->lastInsertId(); 
						//$this->lastInsertedId=$lastId;
						//echo "2 - ".$lastId." - last id<br/>";
						//echo "Last id : ".$lastId."<br/>";
						//return $this->lastInsertedId;
						return $lastId;
					}
					catch (PDOException $e)
					{
						$this->setError("[ERROR][".__METHOD__."]","Wystąpił błąd zapytania :</br>".$e->getMessage()); //
					};
			}
			/*##################################################### queryReturnValue ###################################*/
			public function queryReturnValue()
			{
				//if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metodę.".$this->css['pE'];
					try
					{
						/*
						echo "<pre>";
						print_r($this->returnValue);
						echo "</pre>";
						*/
						//die('STOP</br>');
						
						return $this->returnValue;
					}
					catch (PDOException $e)
					{
						$this->setError("[ERROR][".__METHOD__."]","Wystąpił błąd zapytania :</br>".$e->getMessage()); //
					};
			}
			/*##################################################### checkTypeValue ####################################*/
			private function checkTypeValue(&$value="",&$type="")
			{
				//if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."]".$this->css['sE']."Uruchamiam metodę.".$this->css['pE'];
				//echo "value - $value , type - $type </br>";
				$checkDate=TRUE;
				if(is_numeric($value)) 
							{
								//echo "is numeric $value - ".is_numeric($value)."</br>";
								$pdoType=PDO::PARAM_INT;
							};
							if(strpos($value,'-')) 
							{
								echo "</br>Znalazlem '-'";
								$tmpArrayDate=explode('-',$value);
								foreach($tmpArrayDate as $idDate => $valueDate)
								{
									if(!is_numeric($valueDate)) 
									{
										if($checkDate) $checkDate=FALSE;
										break;
									};
								}
								if($checkDate==TRUE)
								{
									echo "</br>Znalazlem date - ".$value;
									$value = date($value);
									echo "</br>DATA : ".$value;
								}
							};
			}	
			/*##################################################### clearData #########################################*/
			private function clearData($data,$lvl=1)
			{
				//echo $this->css['pS'].$this->css['sOrangeS'].'['.__METHOD__.']'.$this->css['sE']."Uruchomiono metodę.".$this->css['pE'];
				//if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."]".$this->css['sE']."Uruchamiam metodę.".$this->css['pE'];
				$data=trim($data);
			
				//echo "data |".$data."|<br/>";
				//$data=trim($data); // ltrim
				if($lvl==0 && $data!='')
				{
					$patterns = array('/\#/');
					//$patterns = array('/\//','/\#/'); // nie moze byc backslash '/\*/', -- select * from
					foreach($patterns as $value)
					{
						//echo $value."</br>";
						$data=preg_replace($value, '', $data);
					};
					$data=strip_tags($data);
					$data=htmlspecialchars($data, ENT_QUOTES);
					//echo $this->css['pS'].$this->css['sGreenS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
				}
				//echo $this->css['pS'].$this->css['sGreenS']."[LDAP][clearData]".$this->css['sE'].$data.$this->css['pE'];
			return $data;
			}
			/*##################################################### destruct ##########################################*/
			function __destruct()
			{
				if($this->Parm['log_lvl']>0) echo $this->css['pS'].$this->css['sGreenS']."[".__METHOD__."]".$this->css['sE']."destruct".$this->css['pE'];
				$this->dbLink = null;
				
			}
	};
        ?>
