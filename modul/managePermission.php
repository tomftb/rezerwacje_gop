<?php
session_start();
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class managePerm extends initialDb
{
    private $inpArray=array();
    protected $err="";
    protected $valueToReturn=null;
    protected $taskPerm= ['perm'=>'','type'=>''];
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
    protected function editPermUsers($sendedUsers,$allPermUsers,$permId)
    {
        //print_r($sendedUsers);
        //print_r($allPermUsers);
        $changeSessionPerm=false;
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
                //echo "TO DELETE : ".$suser['id']."\n";
                $this->deleteUserPerm($suser['id'],$permId);  
                if($_SESSION['userid']===$suser['id'])
                {
                    $changeSessionPerm=$suser['id'];
                }
            }
            // ADD
            foreach($sendedUsers as $userid)
            {
                //$userid
                //echo "TO ADD: ".$userid."\n";
                $this->addUserPerm($userid,$permId);
                if($_SESSION['userid']===$userid)
                {
                    $changeSessionPerm=$userid;
                }
            }
            if($changeSessionPerm)
            {
                //echo "CHANGE USER LOGED PERM".$changeSessionPerm."\n";
                // GET USER ROLE
                $this->query('SELECT idRola FROM v_all_user WHERE ID=?',$changeSessionPerm);
                $idRole=$this->queryReturnValue();
                $this->setActSessionPermRole($idRole[0]['IdRola'],$changeSessionPerm);
            }
        }
    }
    protected function setActSessionPermRole($idRole,$idUser)
    {
        // UPDATE CURRENT USER SESSION PERM;
        //echo "UPDATE PERM ROLE<br/>";
        $permRole=array();
        if($idRole)
        {
            $this->query('SELECT SKROT FROM v_upr_i_slo_rola_v2 WHERE idRola=?',$idRole);
            $permRole=$this->queryReturnValue();
            //print_r($permRole); 
        }
        $this->query('SELECT SKROT FROM v_uzyt_i_upr_v2 WHERE idUzytkownik=?',$idUser);
        $perm=$this->queryReturnValue();
        $_SESSION['perm']=$this->parsePermRole($perm,$permRole);
        //echo "SESSION PERM ROLE CHANGED\n";
        //print_r($_SESSION);
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
    protected function deleteUserPerm($userId,$idPerm)
    {
        $this->query('DELETE FROM uzyt_i_upr WHERE id_uzytkownik=? AND id_uprawnienie=?',$userId.",".$idPerm);
    }
    protected function addUserPerm($userId,$idPerm)
    {
        $this->query('INSERT INTO uzyt_i_upr (id_uzytkownik,id_uprawnienie) VALUES (?,?)',$userId.",".$idPerm); 
    }
    protected function updatePermUser($POSTDATA)
    {
        // GET SENDED DATA VIA POST
        $this->getPostData($POSTDATA);
        // GET AND CHECK PERM ID
        $id=$this->getSpecField("idPerm");
        
        $sendedUsers=$this->returnUsersTabFromPost($this->inpArray);

        if(!$this->err)
        {
            // GET USERS WITH PERM
            $this->query('SELECT id FROM v_upr_i_uzyt_v2 WHERE idUprawnienie=?',$this->inpArray['idPerm']);
            $allPermUsers=$this->queryReturnValue();
            $this->editPermUsers($sendedUsers,$allPermUsers,$id);
            $this->setActSessionPerm($this->inpArray['idPerm']);
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
    public function getAllPerm()
    {
        $valueToReturn=array();
        $this->query('SELECT * FROM v_upr WHERE 1=? ORDER BY ID asc',1);
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
class checkGetData extends managePerm
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        array("getAllPerm",'LOG_INTO_UPR','user'),
        array("getUsersWithPerm",'SHOW_PERM_USER','user'),
        array('editPermUsers','EDIT_PERM_USER','user')
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
        $this->infoArray['urlTask'][0]='[managePerm]Wrong function to execute';
        $this->infoArray['urlTask'][1]='[managePerm]Task not exists';
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
        
        case "getAllPerm" : // ENUM 0,1
            $this->getAllPerm();
            break;
 
        case "getUsersWithPerm" :
            $this->idData=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getUsersWithPerm($this->idData);
            break;

        case 'editPermUsers':
            $this->updatePermUser($_POST);
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