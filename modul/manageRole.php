<?php
session_start();
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageRole extends initialDb
{
    protected $idRole=0;
    private $inpArray=array();
    protected $err="";
    protected $valueToReturn=null;
    protected $filter='';
    protected $taskPerm= ['perm'=>'','type'=>''];
    protected $infoArray=array
            (
                "nazwa"=>array
                (
                    "Podana Nazwa jest za krótka",
                    "Podana Nazwa jest za długa",
                    "Istnieje już rola o podanej nazwie",
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
    protected function setActSessionPermRole($idRole,$idUser)
    {
        //echo "ID USER - ".$idUser."\n";
        //print_r($_SESSION);
        // GET CURRENT LOGED IN USER ROLE IF ROLE IS THE SAME UPDATE PERM
        $this->query('SELECT idRola FROM v_all_user WHERE IdRola=? AND ID=?',$idRole.','.$idUser);
        $userRole=$this->queryReturnValue();
        //print_r($userRole);
        //GET CURRENT UPDATED ROLE
        $this->query('SELECT ID FROM v_slo_rola WHERE ID=?',$idRole);
        $role=$this->queryReturnValue();
        //print_r($role);
        if(count($userRole)>0 && count($role)>0)
        {
            if($userRole[0]['IdRola']==$role[0]['ID'])
            {
                // UPDATE CURRENT USER SESSION PERM;
                //echo "UPDATE PERM ROLE<br/>";
                $this->query('SELECT SKROT FROM v_upr_i_slo_rola_v2 WHERE idRola=?',$role[0]['ID']);
                $permRole=$this->queryReturnValue();
                //print_r($permRole);
                $this->query('SELECT SKROT FROM v_uzyt_i_upr_v2 WHERE idUzytkownik=?',$idUser);
                $perm=$this->queryReturnValue();
                //print_r($perm);
                //print_r($this->parsePermRole($perm,$permRole));
                $_SESSION['perm']=$this->parsePermRole($perm,$permRole);
                //print_r($_SESSION);
            }
        }
        
    }
    private function parsePermRole($perm,$permRole)
    {
        $array1=array();
        $array2=array();
        // FLATTEN 1
        foreach($perm as $value)
        {
            array_push($array1,$value['SKROT']);
        }
        //print_r($array1);
        // FLATTEN 2
        foreach($permRole as $value)
        {
            if(!in_array($value['SKROT'],$array1))
            {
                array_push($array2,$value['SKROT']);
            }
        }
        //print_r($array2);
        return (array_merge($array1,$array2));
    }
    protected function editPermUsers($sendedUsers,$allPermUsers,$permId)
    {
        //print_r($sendedUsers);
        //print_r($allPermUsers);
        if(!$this->err)
        {
            foreach($sendedUsers as $key=> $userid)
            {
                //echo $userid."\n";
                foreach($allPermUsers as $id => $user)
                {
                    if($userid===$user['id'])
                    {
                        //echo "FOUND - UNSET\n";
                        UNSET($sendedUsers[$key]);
                        UNSET($allPermUsers[$id]);
                    }
                }
            }
            //echo 'USERS TO ADD:';
            //print_r($sendedUsers);
            //echo 'USERS TO DELETE';
            //print_r($allPermUsers);
            // DELETE
            foreach($allPermUsers as $suser)
            {
                //$suser['id']
                $this->deleteUserPerm($suser['id'],$permId);  
            }
            // ADD
            foreach($sendedUsers as $userid)
            {
                //$userid
                $this->addUserPerm($userid,$permId);
            }
        }
    }
    protected function deleteUserPerm($userId,$idPerm)
    {
        $this->query('DELETE FROM uzyt_i_upr WHERE id_uzytkownik=? AND id_uprawnienie=?',$userId.",".$idPerm);
    }
    protected function addUserPerm($userId,$idPerm)
    {
        $this->query('INSERT INTO uzyt_i_upr (id_uzytkownik,id_uprawnienie) VALUES (?,?)',$userId.",".$idPerm); 
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



   
    protected function removeUserPerm($userId,$value)
    {
        if($this->checkExistInDb('v_uzyt_i_upr','idUzytkownik=? AND idUprawnienie=?',$userId.','.$value))
        {
            // EXIST -> DELETE
            $this->query('DELETE FROM uzyt_i_upr WHERE id_uzytkownik=? AND id_uprawnienie=?',$userId.",".$value); 
        }   
    }
    protected function returnUsersTabFromPost($DATA)
    {
        $tmpArray=array();
        foreach($DATA as $key => $value)
        {
            //echo $key." - ".$value."\n";
            //echo "STRPOS - ".strpos($key,'cbox')."\n";
            if(strpos($key,'pers_')!==false) 
            {
                //echo "FOUND\n";
                array_push($tmpArray,$value);

            }
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
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllRole($wsku)
    {
        $valueToReturn=array();
        $this->query('SELECT ID,Nazwa,Opcje FROM v_slo_rola_all WHERE WSK_U=? ORDER BY ID asc',$wsku);
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
    public function getAllRoleLike($wsku,$filter)
    {
        $filter="%${filter}%";
        $valueToReturn=array();
        $this->query('SELECT ID,Nazwa,Opcje FROM v_slo_rola_all WHERE WSK_U=? AND (ID LIKE (?) OR Nazwa LIKE (?)) ORDER BY ID asc'
                ,$wsku.",".$filter.",".$filter);
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
    # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getSlo($tableToSelect,$order='ID')
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN ALL EMPLOYEE SPEC DICTIONARY and other FROM DB

    public function getUsersWithPerm($idPerm)
    {
        $valueToReturn=array();
        $this->query('SELECT id, ImieNazwisko FROM v_upr_i_uzyt_v3 WHERE idUprawnienie=?',$idPerm);
        array_push($valueToReturn,$this->queryReturnValue());
        // GET ALL USERS
        $this->query('SELECT ID as "id",CONCAT(Imie," ",Nazwisko) AS "ImieNazwisko" FROM v_all_user WHERE wskU=? ORDER BY ID asc',"0");
        array_push($valueToReturn,$this->queryReturnValue());
        $this->valueToReturn=$valueToReturn;
    }
    public function getNewRoleSlo()
    {
        $arrToReturn=array();
        // SLO ROLA
        $this->getSlo('v_slo_rola');
        array_push($arrToReturn,$this->valueToReturn);
        // SLO UPR
        $this->getSlo('v_slo_upr');
        array_push($arrToReturn,$this->valueToReturn);
        // USER UPR
        
        $this->valueToReturn=$arrToReturn;
    }
    protected function dRole($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        if($this->getSpecField("id"))
        {
             $this->query('UPDATE slo_rola SET WSK_U=? WHERE ID=?','1,'.$this->inpArray['id']);
        }
    }
    protected function cRole($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkRoleValueLength($this->inpArray);
        if($this->checkExistInDb('v_slo_rola','NAZWA=?',$this->inpArray['nazwa']))
        {
            $this->err.=$this->infoArray['nazwa'][2]."<br/>";
        }
        // CHECK AVALIABLE ROLE
        $permArray=$this->returnPermTabFromPost($this->inpArray);
        $this->checkExistSloPerm($permArray);
        if(!$this->err)
        {
            $this->addRole($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                // EDIT ROLE PERMISSION
                $this->editRolePerm($permArray,$this->queryLastId()); 
            }    
        }
    }
    protected function editRole($POSTDATA)
    {
        $this->getPostData($POSTDATA);
        $this->checkRoleValueLength($this->inpArray);
        $this->getSpecField("id");
     
        if($this->checkExistInDb('v_slo_rola','NAZWA=? AND ID!=?',$this->inpArray['nazwa'].','.$this->inpArray['id']))
        {
            $this->err.=$this->infoArray['nazwa'][2]."<br/>";
        }
    
        // CHECK AVALIABLE DICTIONARY
        $permArray=$this->returnPermTabFromPost($this->inpArray);
        $this->checkExistSloPerm($permArray);
        if(!$this->err)
        {
            $this->updateRole($this->inpArray);
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->editRolePerm($permArray,$this->inpArray['id']); 
                $this->setActSessionPermRole($this->inpArray['id'],$_SESSION['userid']);
            }    
        }
    }
    protected function addRole($uData)
    {
        $this->query('INSERT INTO slo_rola (NAZWA) VALUES (?)',$uData['nazwa']);
    }
    protected function updateRole($uData)
    {
        $this->query('UPDATE slo_rola SET NAZWA=? WHERE ID=?',$uData['nazwa'].','.$uData['id']);
    }
    protected function editRolePerm($permArray,$id)
    {
        // print_r($permArray);
        if(!$this->err)
        {
            foreach($permArray as $value)
            {
                //echo $value[0].' - '.$value[1];
                if($value[2]>0)
                {
                    $this->addRolePerm($id,$value[0]);
                }
                else
                {
                    $this->removeRolePerm($id,$value[0]);
                }
            }
        }
    }
    protected function addRolePerm($roleId,$value)
    {
        //echo $employeeId.' - '.$value;
        // CHECK IS EXIST
        if(!$this->checkExistInDb('upr_i_slo_rola','id_rola=? AND id_upr=?',$roleId.','.$value))
        {
            // NOT EXIST -> ADD
            $this->query('INSERT INTO upr_i_slo_rola (id_rola,id_upr) VALUES (?,?)',$roleId.",".$value); 
        }
    }
    protected function removeRolePerm($roleId,$value)
    {
        if($this->checkExistInDb('upr_i_slo_rola','id_rola=? AND id_upr=?',$roleId.','.$value))
        {
            // EXIST -> DELETE
            $this->query('DELETE FROM upr_i_slo_rola WHERE id_rola=? AND id_upr=?',$roleId.",".$value); 
        }   
    }
    public function getRoleDetails($id)
    {
        if(!$this->err)
        {
            $valueToReturn=array();
            $this->query('SELECT ID,Nazwa,WSK_U FROM v_slo_rola_all WHERE ID=?',$id);
            array_push($valueToReturn,$this->queryReturnValue());
            $this->getSlo('v_slo_upr');
            $this->query('SELECT * FROM v_upr_i_slo_rola WHERE idRola=? ORDER BY idUpr ASC ',$id);
            $uprRole=$this->queryReturnValue();

            // COMBINE
            array_push($valueToReturn,$this->combineSlo($this->valueToReturn,'ID',$uprRole,'idUpr'));
            $this->valueToReturn=$valueToReturn;
        }
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
                    $slo[$id]['DEFAULT']='t';
                    unset($uprRole[$key]);
                    break;
                }
            }
        }
        return($slo);
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
    protected function checkRoleValueLength($data)
    {
        if(strlen($data['nazwa'])<3)
        {
            $this->err.=$this->infoArray['nazwa'][0]."<br/>";
        }
        if(strlen($data['nazwa'])>30)
        {
            $this->err.=$this->infoArray['nazwa'][1]."<br/>";
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
    public function getRoleUsers($id)
    {
        $this->query('SELECT Imie as "Imię", Nazwisko,Login,Email FROM v_all_user WHERE idRola=? AND wskU=? ORDER BY Nazwisko,Imie,ID ASC ',$id.',0');
        $this->valueToReturn=$this->queryReturnValue();
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
class checkGetData extends manageRole
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        array("getAllRole",'LOG_INTO_ROLE','user'),
        array("getAllRoleLike",'LOG_INTO_ROLE','user'),
        array("getNewRoleSlo",'ADD_ROLE','user'),
        array("cRole",'ADD_ROLE','user'),
        array("getUsersWithPerm",'SHOW_PERM_USER','user'),
        array('editRole','EDIT_ROLE','user'),
        array('getRoleDetails','SHOW_ROLE','user'),
        array('getRoleUsers','SHOW_ROLE_USERS','sys'),
        array('dRole','DEL_ROLE','user')
    );
    function __construct()
    {
        parent::__construct();
        $this->addNewTypOfErr();
        $this->getUrlData();
        
        if($this->checkUrlTask())
        {
            // CHECK PERM
            $this->checkTask();
            if($this->taskPerm['type']==='user')
            {
                $this->checkLoggedUserPerm('LOG_INTO_APP');
                $this->checkLoggedUserPerm($this->taskPerm['name']);
            }
            if(!$this->err)
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
        $this->infoArray['urlTask'][0]='[manageRole]Wrong function to execute';
        $this->infoArray['urlTask'][1]='[manageRole]Task not exists';
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
        foreach($this->avaliableTask as $id =>$task)
        {
            if($task[0]==$this->urlGetData['task'])
            {
                $this->setTaskPerm($this->avaliableTask[$id][1],$this->avaliableTask[$id][2]);
                return 1;
            }
        }
        $this->err.= $this->infoArray['urlTask'][1];
        return 0;
    }
    private function setTaskPerm($permName='',$permType='')
    {
        $this->taskPerm['name']=$permName;
        $this->taskPerm['type']=$permType;
    }
    protected function checkLoggedUserPerm($perm)
    {
        if(!in_array($perm,$_SESSION['perm']))
        {
           $this->err.="[${perm}] Brak uprawnienia";
           return 0;
        }
        else
        {
            return 1;
        }
    }
    private function runTask()
    {
        switch($this->urlGetData['task']):
        
           
        case "getAllRole" : // ENUM 0,1
            $this->getAllRole('0');
            break;
        case "getAllRoleLike":
            $this->filter=filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING);
            $this->getAllRoleLike('0',$this->filter);
            break;
        case 'getNewRoleSlo':
            $this->getNewRoleSlo();
            break;
        case 'cRole':
            $this->cRole($_POST);
            break;
        case "getUsersWithPerm" :
            $this->idData=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getUsersWithPerm($this->idData);
            break;
        case 'getRoleDetails':
            $this->idRole=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getRoleDetails($this->idRole);
            break;
        case 'editRole':
            $this->editRole($_POST);
            break;
        case 'getRoleUsers':
            $this->idRole=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getRoleUsers($this->idRole);
            break;
        case 'dRole':
            $this->dRole($_POST);
            break;
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