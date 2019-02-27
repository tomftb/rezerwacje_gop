<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageUser extends initialDb
{
    private $inpArray=array();
    protected $err="";
    protected $valueToReturn=null;
    protected $idUser=null;
    const maxPercentPersToProj=100;
    protected $infoArray=array
            (
                "imie_nazwisko"=>array
                (
                    "Podane Imię, Nazwisko lub Login jest za krótkie",
                    "Podane Imię, Nazwisko lub Login jest za długi",
                    "Istnieje już użytkownik o podanym Imieniu i Nazwisku",
                ),
                "login"=>array
                (
                    "Istnieje już użytkownik o podanym Loginie"
                )
            );
    function __construct()
    {
        parent::__construct();
    }
    private function getPostData($postData=array())
    {
        $tmpArray=array();
        foreach($postData as $key =>$value)
        {
            $value=trim($value);
            $this->inpArray[$key]=$value;
            //echo $key." - ".$value."\n";
            if(substr($key, 0,2)==='d-')
            {
                if($value!=='')
                {
                    $tmpArray=explode('.',$value);
                    $this->inpArray[$key]=$tmpArray[2]."-".$tmpArray[1]."-".$tmpArray[0];
                    //echo $key." - ".$this->inpArray[$key];
                }
                else
                {
                    $this->inpArray[$key]='0000-00-00';
                };
            }
        }
    }
    protected function cUser($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkUserValueLength($this->inpArray);
        if($this->checkExistInDb('uzytkownik','login=?',$this->inpArray['login']))
        {
            $this->err.=$this->infoArray['login'][0]."<br/>";
        }
        if($this->checkExistInDb('uzytkownik','imie=? AND nazwisko=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko']))
        {
            $this->err.=$this->infoArray['imie_nazwisko'][2]."<br/>";
        }
        // CHECK PASSWORD INP EXIST
        if(!$this->checkSpecField("haslo"))
        {
            $this->inpArray['haslo']='';
        }
        // CHECK AVALIABLE ROLE
        $permArray=$this->returnPermTabFromPost($this->inpArray);
        $this->checkExistSloPerm($permArray);
        if(!$this->err)
        {
            $this->addUser($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                // EDIT USER PERMISSION
                $this->editUserPerm($permArray,$this->queryLastId()); 
                
            }    
        }
    }
    protected function setActSessionPerm($idUser)
    {
        //echo "ID USER - ".$idUser."\n";
        //print_r($_SESSION);
        if($_SESSION['userid']==$idUser)
        {
            // UPDATE CURRENT USER SESSION PERM;
            //echo "UPDATE PERM<br/>";
            $this->query('SELECT SKROT FROM v_uzyt_i_upr_v2 WHERE idUzytkownik=?',$idUser);
            $_SESSION['perm']=$this->parsePerm($this->queryReturnValue());
            //print_r($_SESSION);
        }
    }
    private function parsePerm($perm)
    {
        $arrToReturn=array();
        foreach($perm as $value)
        {
            array_push($arrToReturn,$value['SKROT']);
        }
        return ($arrToReturn);
    }
    protected function editUser($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkUserValueLength($this->inpArray);
        $this->getSpecField("idUser");
     
        if($this->checkExistInDb('uzytkownik','login=? AND id!=?',$this->inpArray['login'].','.$this->inpArray['idUser']))
        {
            $this->err.=$this->infoArray['login'][0]."<br/>";
        }
        if($this->checkExistInDb('uzytkownik','imie=? AND nazwisko=? AND id!=?',$this->inpArray['imie'].','.$this->inpArray['nazwisko'].','.$this->inpArray['idUser']))
        {
            $this->err.=$this->infoArray['imie_nazwisko'][2]."<br/>";
        }
        // CHECK PASSWORD INP EXIST
        if(!$this->checkSpecField("haslo"))
        {
            $this->inpArray['haslo']='';
        }
        
        // CHECK AVALIABLE DICTIONARY
        $permArray=$this->returnPermTabFromPost($this->inpArray);
        $this->checkExistSloPerm($permArray);
        if(!$this->err)
        {
            $this->updateUser($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->editUserPerm($permArray,$this->inpArray['idUser']);
                $this->setActSessionPerm($this->inpArray['idUser']);
            }    
        }
    }
    protected function editUserPerm($permArray,$userId)
    {
        // print_r($permArray);
        if(!$this->err)
        {
            foreach($permArray as $value)
            {
                //echo $value[0].' - '.$value[1];
                if($value[2]>0)
                {
                    $this->addUserPerm($userId,$value[0]);
                }
                else
                {
                    $this->removeUserPerm($userId,$value[0]);
                }
            }
        }
    }
    protected function updateUserPerm($POSTDATA)
    {
        // GET SENDED DATA VIA POST
        $this->getPostData($POSTDATA);
        $permArray=$this->returnPermTabFromPost($this->inpArray);
        // CHECK AVALIABLE DICTIONARY
        $this->checkExistSloPerm($permArray);
        // GET AND CHECK USER ID
        $id=$this->getSpecField("idUser");

        if(!$this->err)
        {
            $this->editUserPerm($permArray,$id);
            $this->setActSessionPerm($this->inpArray['idUser']);
        }
    }
    protected function getSpecField($field)
    {
        if (array_key_exists($field,$this->inpArray))
        {
            return $this->inpArray[$field];
        }
        else
        {
            $this->err.= '['.$field.']FORM KEY NOT EXIST';
            return (0);
        } 
    }
     protected function checkSpecField($field)
    {
        if (array_key_exists($field,$this->inpArray))
        {
            return (true);
        }
        else
        {
            return (false);
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
                $this->err.="[".$value[1]."]PERMISSION DICTIONARY WAS DELETED<br/>";
            }
        }
    }
    protected function checkUserValueLength($employeeData)
    {
        if(strlen($employeeData['imie'])<3 || strlen($employeeData['nazwisko'])<3 || strlen($employeeData['login'])<3)
        {
            $this->err.=$this->infoArray['imie_nazwisko'][0]."<br/>";
        }
        if(strlen($employeeData['imie'])>30 || strlen($employeeData['nazwisko'])>30 || strlen($employeeData['login'])>30)
        {
            $this->err.=$this->infoArray['imie_nazwisko'][1]."<br/>";
        }
    }
    protected function addUser($uData)
    {
        $curretDateTime=date('Y-m-d H:i:s');
        $this->query('INSERT INTO uzytkownik 
            (imie,nazwisko,login,haslo,email,typ,id_rola,mod_dat,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
            ,$uData['imie'].",".$uData['nazwisko'].",".$uData['login'].",".$uData['haslo'].",".$uData['email'].",".$uData['typkonta'].",".$uData['rola'].",".$curretDateTime.",".$_SESSION["username"].','.$_SESSION["userid"]);
    }
    protected function updateUser($userData)
    {
        $curretDateTime=date('Y-m-d H:i:s');
        $this->query('UPDATE uzytkownik SET imie=?, nazwisko=?, login=?,email=?,haslo=?,typ=?,id_rola=?, mod_dat=?, mod_user=?,mod_user_id=? WHERE id=?'
            ,$userData['imie'].",".$userData['nazwisko'].",".$userData['login'].",".$userData['email'].",".$userData['haslo'].",".$userData['typkonta'].",".$userData['rola'].','.$curretDateTime.",".$_SESSION["username"].','.$_SESSION["userid"].','.$userData['idUser']);
    }
    protected function addUserPerm($userId,$value)
    {
        //echo $employeeId.' - '.$value;
        // CHECK IS EXIST
        if(!$this->checkExistInDb('v_uzyt_i_upr','idUzytkownik=? AND idUprawnienie=?',$userId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->query('INSERT INTO uzyt_i_upr (id_uzytkownik,id_uprawnienie) VALUES (?,?)',$userId.",".$value); 
        }
    }
    protected function removeUserPerm($userId,$value)
    {
        if($this->checkExistInDb('v_uzyt_i_upr','idUzytkownik=? AND idUprawnienie=?',$userId.','.$value))
        {
            // EXIST -> DELETE
            $this->query('DELETE FROM uzyt_i_upr WHERE id_uzytkownik=? AND id_uprawnienie=?',$userId.",".$value); 
        }   
    }
    protected function returnPermTabFromPost($DATA)
    {
        $tmpArray=array();
        $tmpRec=array();
        $id='';
        $name='';
        foreach($DATA as $key => $value)
        {
            //echo $key." - ".$value."\n";
            //echo "STRPOS - ".strpos($key,'cbox')."\n";
            if(strpos($key,'cbox-')!==false) 
            {
                //echo "FOUND\n";
                $tmpData=explode('-',$key);
                //print_r($tmpData);
                // GET ID $tmpData[1]
                // GET NAME $tmpData[2]
                $id=explode(':',$tmpData[1]);
                $name=explode(':',$tmpData[2]);
                array_push($tmpRec,$id[1],$name[1],$value);
                array_push($tmpArray,$tmpRec);
            }
            $tmpRec=[];
        }
        
        //print_r($tmpArray);
        return $tmpArray;
    }
    private function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
        if(trim($valueToCheck)!='')
        {
            $this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)."<br/>";
            return(count($this->queryReturnValue()));
        }
        else
        {
            $this->err.="NO VALUE TO CHECK<br/>";
            return(0);
        }
    }
    private function explodeValue($valueToExplode,$delimiter)
    {
        return $arrayOfValue=explode($delimiter,$valueToExplode);
    }
    protected function isEmpty($key,$data)
    {
        if(trim($data)==='')
        {
            $this->err.="[".$key."]".$this->infoArray['input'][0]."<br/>";
        };
    }
    protected function getPersonData($id)
    {
        $this->query('SELECT * FROM uzytkownik WHERE id=?',$id);
        $personData=$this->queryReturnValue();
        if(count($personData)>0)
        {
            return($personData);
        }
        else
        {
            $this->err.="[${id}] NO DATA ABOUT PERSON IN DB!<br/>";
        }
    }
    # DELETED PROJECT IN DB
    protected function deleteUser($postData)
    {
        $this->getPostData($postData);
        $this->getSpecField("idUser");
        if (!$this->err)
        {
            $this->query('UPDATE uzytkownik SET wsk_u=? WHERE id=?',"1,".$this->inpArray['idUser']);
        }  
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getUsers($wsku)
    {
        $this->query('SELECT ID,Imie,Nazwisko,Login,Email,TypKonta,Rola FROM v_all_user WHERE wskU=? ORDER BY id asc',"${wsku}");
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID')
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB
    public function getUserPerm($idUser)
    {
        // GET DICTIONARY
        $this->getSlo('v_slo_upr');
        // $this->valueToReturn act slo
        // GET EMPLOYEE DICTIONARY 
        $this->query('SELECT * FROM v_uzyt_i_upr WHERE idUzytkownik=? ORDER BY idUprawnienie ASC ',$idUser);
        $emplSlo=$this->queryReturnValue();

        // COMBINE
        $this->valueToReturn=$this->combineSlo($this->valueToReturn,'ID',$emplSlo,'idUprawnienie');
        
    }
    public function getNewUserSlo()
    {
        $arrToReturn=array();
        // SLO UPR
        $this->getSlo('v_slo_upr');
        array_push($arrToReturn,$this->valueToReturn);
        
        // SLO ROLA
        $this->getSlo('v_slo_rola');
        $allSlo=$this->valueToReturn;
        $emptArr=array(array('ID'=>0,'NAZWA'=>'','DEFAULT'=>'t'));
        $userRoleSlo=array_merge($emptArr,$allSlo);
        array_push($arrToReturn,$userRoleSlo);
        $this->valueToReturn=$arrToReturn;
    }
    protected function combineSlo($slo,$sloKey,$usrSol,$sloUserKey)
    {
        // $sloKey = ID
        // $sloUserKey = idUprawnienie
        foreach($slo as $id => $value)
        {
            foreach($usrSol as $key => $valueEmpl)
            {
                if($value[$sloKey]===$valueEmpl[$sloUserKey])
                {
                    $slo[$id]['DEFAULT']='t';
                    unset($usrSol[$key]);
                    break;
                }
            }
        }
        return($slo);
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getUserDetails($idUser)
    {
        if(!$this->err)
        {
            // GET USER
            $valueToReturn=array();
            $this->query('SELECT * FROM v_all_user WHERE ID=?',$idUser);
            
            array_push($valueToReturn,$this->queryReturnValue());
            //print_r($valueToReturn[0][0]);
            //echo $valueToReturn[0][0]['IdRola']."\n";
            //GET USER PERM
            $this->getUserPerm($idUser);
            array_push($valueToReturn,$this->valueToReturn);
            //GET USER ROLE
            array_push($valueToReturn,$this->getUserRole($valueToReturn[0][0]['IdRola']));
            $this->valueToReturn=$valueToReturn;
        }
    }
    public function getUserRole($idUserRole='')
    {
        $userRoleSlo=array();
        // GET ALL ROLE
        $this->query('SELECT * FROM v_slo_rola WHERE 1=?',1);  
        $allRole=$this->queryReturnValue();
        if($idUserRole!='')
        {
                // COMBINE USER DICT
                $emptArr=array('ID'=>0,'NAZWA'=>'');
                $this->query('SELECT * FROM v_slo_rola WHERE ID=?',$idUserRole);  
                $userRole=$this->queryReturnValue();
                array_push($userRole,$emptArr);
                foreach($allRole as $key => $value)
                {
                    if($value['ID']===$userRole[0]['ID'])
                    {
                        unset($allRole[$key]);
                        break;
                    }
                }
                $userRoleSlo=array_merge($userRole,$allRole);
        }
        else
        {
            $emptArr=array(array('ID'=>0,'NAZWA'=>'','DEFAULT'=>'t'));
            //echo 'NO USER ROLE\n';
            $userRoleSlo=array_merge($emptArr,$allRole);
        }
        //print_r($userRoleSlo);
        return ($userRoleSlo);
    }
    public function getReturnedValue()
    {
        echo json_encode($this->valueToReturn);
    }
    public function getErrValue()
    {
        if($this->err)
        {
            echo json_encode(array("1",$this->err));
        }
        else
        {
            echo json_encode(array("0",$this->valueToReturn));
        }
    }
    function __destruct()
    {}
}
class checkGetData extends manageUser
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        "getusers",
        "getNewUserSlo",
        "getPermSlo",
        "cUser",
        'deleteUser',
        'getUserPerm',
        'userPermissions',
        'getUserDetails',
        'getRoleSlo',
        'editUser'
    );
    function __construct()
    {
        parent::__construct();
        $this->addNewTypOfErr();
        $this->getUrlData();
        
        if($this->checkUrlTask())
        {
            if($this->checkTask())
            {
                $this->runTask();
            }
        }
    }
    private function getUrlData()
    {
        foreach($_GET as $key=>$value)
        {
            $this->urlGetData[$key]=$value;
        }
    }
    private function addNewTypOfErr()
    {
        $this->infoArray['urlTask'][0]='[manageUser]Wrong function to execute';
        $this->infoArray['urlTask'][1]='[manageUser]Task not exists';
    }
    private function checkUrlTask()
    {
        if(array_key_exists($this->avaliableFunction["task"], $this->urlGetData))
        {
            return 1;
        }
        else
        {
            $this->err.= $this->infoArray['urlTask'][0];
            return 0;
        }
        return 0;
    }
   
    private function checkTask()
    {
        if (in_array($this->urlGetData['task'],$this->avaliableTask))
        {
            return 1;
        }
        else
        {
            $this->err.= $this->infoArray['urlTask'][1];
            return 0;
        }
        return 0;
    }
    private function runTask()
    {
        switch($this->urlGetData['task']):
        
        case "getusers" : // ENUM 0,1
            $this->getUsers('0');
            break;
        case "getNewUserSlo":
            $this->getNewUserSlo();
            break;
        case "getPermSlo" :
            $this->getSlo('v_slo_upr');
            break;
        case "getRoleSlo" :
            $this->getSlo('v_slo_rola');
            break;
        case "cUser":
            //print_r($_POST);
            $this->cUser($_POST);
            break;
        case 'editUser':
            $this->editUser($_POST);
            break;
        case 'getUserPerm':
            $this->idUser=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getUserPerm($this->idUser);
            break;
        case 'deleteUser':
            $this->deleteUser($_POST);
        case 'userPermissions':
            $this->updateUserPerm($_POST);
            break;
        case 'getUserDetails':
            $this->idUser=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getUserDetails($this->idUser);
        default:
            //no task
            break;
        
        endswitch;
    }
    function __destruct()
    {
        $this->getErrValue();
    }
}
$manageEmployee=NEW checkGetData();