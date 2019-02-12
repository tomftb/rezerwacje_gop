<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageProject extends initialDb
{
    private $inpArray=array();
    private $user="";
    protected $err="";
    protected $valueToReturn=null;
    protected $idProject=null;
    const maxPercentPersToProj=100;
    protected $infoArray=array
            (
                "numer_umowy"=>array
                (
                    "Nie podano numeru umowy",
                    "Istnieje już projekt o podanym numerze umowy"
                ),
                "temat_umowy"=>array
                (
                    "Nie podano tematu projektu",
                    "Istnieje już projekt o podanym temacie"
                ),
                "id_projekt"=>array
                (
                    "Musisz wskazać co najmniej jedną osobę do projektu",
                    "Pracownik jest już przypisany do projektu"
                ),
                "input"=>array
                (
                    "Nie uzupełniono pola.",
                    "Wprowadzona wartość jest za długa",
                    "Wprowadzona wartość jest za krótka"
                )
            );
    
    function __construct()
    {
        parent::__construct();
    }
    
    private function parsePostData($postData=array())
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
            };
        }
    }
    public function setUser($user)
    {
        $this->user=$user;
    }
    private function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
        $arrayOfWhere=$this->explodeValue($whereCondition,'=');
        //print_r($arrayOfWhere);
        //echo $valueToCheck;
        if(trim($valueToCheck)!='')
        {
            $this->query('SELECT * FROM '.$tableName.' WHERE '.$whereCondition,$valueToCheck)."<br/>";
            return(count($this->queryReturnValue()));
        }
        else
        {
            $this->err.="NO VALUE TO CHECK<br/>";
            return(0);
        };
    }
    private function explodeValue($valueToExplode,$delimiter)
    {
        return $arrayOfValue=explode($delimiter,$valueToExplode);
    }
    protected function getTeamValueToFind()
    {
        if(!$this->err)
        {
            $teamValueToFind=array(
                                    'team_czlonek_grupy_pers', 
                                    'team_czlonek_grupy_percent',
                                    'd-start_team_czlonek_grupy',
                                    'd-end_team_czlonek_grupy'
            );
            return($teamValueToFind);
        }
    }
    protected function checkAndAddignTeamValue($key,$value,&$teamValueToFind,&$persAttributes,&$allPers,&$counter,$teamValueToFindLength)
    {
        $found=strpos($key,$teamValueToFind);
        if($found!==null && trim($found)!=='')
        {    
            //echo 'str pos - '.$found."\n";
            $persAttributes[$counter]=$value;
            $counter++;
            if($counter===$teamValueToFindLength)
            {
                // LAST ELEMENT OF PERS
                array_push($allPers,$persAttributes);
                $counter=0;
            }
        }
    }
    protected function getSendedTeam()
    {
        $teamValueToFind=$this->getTeamValueToFind();
        $teamValueToFindLength=count($teamValueToFind);
        $persAttributes=array();
        $allPers=array();
        $counter=0;
        if(!$this->err)
        {
            foreach($this->inpArray as $key =>$value)
            {
                //echo $key.' - '.$value.' - '.$teamValueToFind[$counter]."\n";
                if($key==='addTeamToProjectid')
                {
                    $this->idProject=$value;
                }
                $this->checkAndAddignTeamValue($key,$value,$teamValueToFind[$counter],$persAttributes,$allPers,$counter,$teamValueToFindLength);
            }
            //print_r($allPers);
            return($allPers);
        }
        return($allPers);
    }
    protected function getSendedDoc()
    {
        $documentList=array();
        $tmpArray=array();
        $tmpId=array();
        $isDoc=false;
        $err=false;
        $inputCounter=1;
        if(!$this->err)
        {
            foreach($this->inpArray as $key =>$value)
            {
                $this->isEmpty("Pole - ".$inputCounter,$value);
                    if(substr($key,0,7)==='orgDok-')
                    {
                        //echo "UPDATE";
                        $tmpId=explode('-',$key);
                        array_push($tmpArray,'org',$tmpId[1],$value);
                        $isDoc=true;
                        
                    }
                    else if(substr($key,0,7)==='newDok-')
                    {
                        //echo "INSERT";
                        array_push($tmpArray,'new','n',$value);
                        $isDoc=true;
                    }
                    else {};
                    if($isDoc)
                    {
                       array_push($documentList,$tmpArray); 
                    }
                    $tmpArray=[];
                    $tmpId=[];
                    $isDoc=false;
                    $inputCounter++;
            }
        }
        return($documentList);
    }
    protected function checkPersPercent($dataArray)
    {
        $id=$dataArray[0];
        $percentToSetup=$dataArray[1];
        /*
        echo __METHOD__."\n";
        echo "id - ${id}\n";
        echo "id project - ".$this->idProject."\n";
        echo "percent to setup - ${percentToSetup}\n";
         */
        // MAX 100% percent per person
        $percentOverall=0;
        $percentCurrentProj=0;
        $overallPercent=0;
        $percentToChange=0;
        $maxAvaliable=0;
        if(trim($id)!='')
        {
            $this->query('SELECT udzialProcent FROM v_udzial_prac_proj_percent WHERE idPracownik=? AND idProjekt=?',$id.','.$this->idProject);
            $percentCurrentProj=$this->queryReturnValue();
            //print_r($percentCurrentProj);
            //echo "count returned values - ".count($percentCurrentProj)."\n";
            if(count($percentCurrentProj)===0)
            {
                $percentCurrentProj[0]['udzialProcent']=0;
            }
            //echo "Percent in current project - ".$percentCurrentProj[0]['udzialProcent']."\n";
            $this->query('SELECT sumProcentowyUdzial FROM v_udzial_sum_procent_prac WHERE idPracownik=?',$id);
            $percentOverall=$this->queryReturnValue();
            if(count($percentOverall)===0)
            {
                $percentOverall[0]['sumProcentowyUdzial']=0;
            }
            //echo "Percent overall - ".$percentOverall[0]['sumProcentowyUdzial']."\n";
            $overallPercent=$percentOverall[0]['sumProcentowyUdzial']-$percentCurrentProj[0]['udzialProcent'];
            //echo "Percent used in antoher project - ".$overallPercent."\n";
            //$overallPercent+=$percentToSetup;
            //echo "const - ".self:: maxPercentPersToProj."\n";
            $maxAvaliable=self:: maxPercentPersToProj-$overallPercent;
            //echo "Max percent to setup - ".$maxAvaliable."\n";
            $availablePercent=self:: maxPercentPersToProj-($percentOverall[0]['sumProcentowyUdzial']-$percentCurrentProj[0]['udzialProcent']);
            if($maxAvaliable>=$percentToSetup)
            {
                //echo "Percent can be setup - (max avaliable - ${availablePercent}%)\n";
                return true;
            }
            $percentToChange=$percentToSetup-$maxAvaliable;
            //echo $this->err;
            $this->err.="[".$dataArray['imie']." ".$dataArray['nazwisko']."]Too much percent to setup - (must remove ${percentToChange}%)</br>";
            return false;
        }
        $this->err.="NO VALUE TO CHECK<br/>";
        return false;
    }
    protected function addTeamToProject($valueToAdd)
    {
        /*
         * team[][0] - id
         * team[][1] - percent to setup
         * team[][2] - data start
         * team[][3] - data end
         */
        $this->parsePostData($valueToAdd);
        $team=$this->getSendedTeam();
        $persData=array();
        if(!$this->err)
        {
            // PARSE SENDED TEAM
            foreach($team as $id => $value)
            {
                //echo "${id} - ${value[0]}\n";
                $persData=$this->getPersonData($value[0]);
                $team[$id]['imie']=$persData[0]['imie'];
                $team[$id]['nazwisko']=$persData[0]['nazwisko'];
                //$this->manageTeamPersActionIdDb($id,$team);
                $this->manageTeamPersActionIdDb($team[$id]);
                //array_splice($team, $id, 1);
            }
            $this->removeNotSendedTeamMembers($team);
            if(!$this->err)
            {
                foreach($team as $value)
                {
                    $this->updateTeamInDb($value);
                }
            }
        }
    }
    //
    protected function updateProjectDoc($data,$idProject)
    {
        $this->parsePostData($data);
        $documents=$this->getSendedDoc();
        $this->getProjectDocuments($this->idProject);
        $documentsInDb=$this->valueToReturn;
        $this->valueToReturn=[];
        //print_r($documents);
        if(!$this->err)
        {
            // PARSE SENDED TEAM
            foreach($documents as $key => $value)
            {
                $this->manageSendedDocActionInDb($documentsInDb,$value,$idProject);
                //print_r($value);
            }
            $this->removeNotSendedDoc($documentsInDb,$documents,$idProject);
        }
    }
    protected function manageSendedDocActionInDb(&$documentsInDb,&$doc,$idProject)
    {
        $insTask=true;
        //print_r($documentsInDb);
        if($doc[1]!=='n')
        {
            foreach($documentsInDb as $key => $value)
            {
                if($value['ID']===$doc[1])
                {   // UPDATE
                    if(trim($value['NAZWA'])!==trim($doc[2]))
                    {
                        //echo "[".$doc[1]."]UPDATE DOC NAME IN DB - different name\n";
                        $this->query(
                                   'UPDATE projekt_dok SET nazwa=?, wsk_u=? WHERE id_projekt=? AND id=?',
                                 $doc[2].',0,'.$idProject.','.$doc[1]);
                                }
                        $insTask=false;
                        break;
                    }
                }  
        }
        if($insTask)
        {
            // INSERT
            //echo "[]INSERT INTO DB NEW DOC\n";
            $this->query('INSERT INTO projekt_dok (id_projekt,nazwa) VALUES (?,?)',$idProject.','.$doc[2]);     
        }
    }
    protected function isEmpty($key,$data)
    {
        if(trim($data)==='')
        {
            $this->err.="[".$key."]".$this->infoArray['input'][0]."<br/>";
        };
    }
    protected function removeNotSendedDoc(&$documentsInDb,$sendedDoc,$idProject)
    {
        $found=false;
        $idInDb='';
        $idInDoc='';
        //echo "Sended documents:\n";
        //print_r($sendedDoc);
        //echo "Documents in database:\n";
        //print_r($documentsInDb);
        
        foreach($documentsInDb as $key => $value)
        {
            foreach($sendedDoc as $id => $data)
            {
                $idInDb=(string)$value['ID'];
                $idInDoc=(string)$data[1];
                if($idInDb===$idInDoc)
                {
                    //echo "[DB=${idInDb}]FOUND IN SENDED DOC\n";
                    $found=true;
                    break;
                }
            }
            if(!$found)
            {
                // UPDATE - DELETE WSK_U=0
                //echo "[DB=${idInDb}]NOT FOUND SET WSK_U=0\n";
                $this->query(
                     'UPDATE projekt_dok SET wsk_u=? WHERE id_projekt=? AND id=?',
                     '1,'.$idProject.','.$idInDb); 
            }
            $found=false;
            //print_r($value);
        }
    }
    //
    protected function removeNotSendedTeamMembers(&$team)
    {
        // GET TEAM FROM DB
        $this->getProjectTeam($this->idProject);
        $this->valueToReturn;
        $curretDateTime=date('Y-m-d H:i:s');
        $found=false;
        //print_r($this->valueToReturn);
        // PARSE REMAIN TEAM
        foreach($this->valueToReturn as $key)
        {
                /*  [idPracownik]
                 *  [procentUdzial]
                 *  [datOd]
                 *  [datDo]
                 */
                //echo $key['idPracownik']."\n";
                foreach($team as $id)
                {
                   //echo $id[0]."\n";
                   if($id[0]==$key['idPracownik'])
                   {
                       //echo "FOUND\n";
                       $found=true;
                       break;
                   }
                }
                if(!$found)
                {
                    //echo "REMOVE FROM DB.\n";
                    $this->query(
                     'UPDATE projekt_pracownik SET udzial_procent=?,dat_od=?,dat_do=?,mod_dat=?,mod_user_id=?,mod_user_name=?,wsk_u=? WHERE id_projekt=? AND id_pracownik=?',
                     '0,0000-00-00,0000-00-00,'.$curretDateTime.',1,'.$this->user.',1,'.$this->idProject.','.$key['idPracownik']); 
                    // REMOVE FROM DB
                }
                $found=false;
        }
        $this->valueToReturn=null;
    }
    protected function manageTeamPersActionIdDb(&$teamRow)
    {
        // CHECK PERCENT
        if($this->checkPersPercent($teamRow))
        {
            $count=$this->checkExistInDb('projekt_pracownik','id_projekt=? AND id_pracownik=? ',$this->idProject.','.$teamRow[0]);
            if($count>0)
            {
                // UPDATE
                array_push($teamRow,'UPDATE');
            }
            else
            {
                // INSERT
                array_push($teamRow,'INSERT');
            }
        }
    }
    protected function updateTeamInDb($dataArray)
    {
        $curretDateTime=date('Y-m-d H:i:s');
        if(end($dataArray)==='UPDATE')
        {
             $this->query(
                     'UPDATE projekt_pracownik SET imie=?,nazwisko=?,udzial_procent=?,dat_od=?,dat_do=?,mod_dat=?,mod_user_id=?,mod_user_name=?,wsk_u=? WHERE id_projekt=? AND id_pracownik=?',
                     $dataArray['imie'].','.$dataArray['nazwisko'].','.$dataArray[1].','.$dataArray[2].','.$dataArray[3].','.$curretDateTime.',1,'.$this->user.',0,'.$this->idProject.','.$dataArray[0]);            
        }
        else
        {
            $this->query('INSERT INTO projekt_pracownik 
            (id_projekt,id_pracownik,imie,nazwisko,udzial_procent,dat_od,dat_do,mod_dat,mod_user_id,mod_user_name) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
        ,$this->idProject.','.$dataArray[0].','.$dataArray['imie'].','.$dataArray['nazwisko'].','.$dataArray[1].','.$dataArray[2].','.$dataArray[3].','.$curretDateTime.',1,'.$this->user);        
        }            
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
        };
    }
    protected function checkValuesOfProject()
    {
        $valueToCheck=array(
            'numer_umowy',
            'temat_umowy'
        );
        foreach($valueToCheck as $value)
        {
            if(trim($this->inpArray[$value])==='')
            {
                $this->err.=$this->infoArray[$value][0]."<br/>";
            }
            else
            {
                if($this->checkExistInDb('projekt_nowy',$value.'=? AND wsk_u=? ',$this->inpArray[$value].",0")>0)
                {
                    $this->err.=$this->infoArray[$value][1]."<br/>";
                }
            }
        } 
    }
    protected function addNewProject($valueToAdd)
    {
        $this->parsePostData($valueToAdd);
        $this->checkValuesOfProject();
        
        if(!$this->err)
        {
            // EXPLODE FIELDS:
            $typ_umowy=explode('|',$this->inpArray['typ_umowy']);
            $kier_grupy=explode('|',$this->inpArray['kier_grupy']);
            $nadzor=explode('|',$this->inpArray['nadzor']);
            $curretDateTime=date('Y-m-d H:i:s');
            
            $this->query('INSERT INTO projekt_nowy 
            (create_user,create_date,typ_umowy,typ_umowy_alt,numer_umowy,temat_umowy,kier_grupy,kier_grupy_id,term_realizacji,harm_data,koniec_proj,nadzor,nadzor_id,mod_user,mod_user_id) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        ,$this->user.",${curretDateTime},".$typ_umowy[1].",".$typ_umowy[2].",".$this->inpArray['numer_umowy'].",".$this->inpArray['temat_umowy'].",".$kier_grupy[1].",".$kier_grupy[0].",".$this->inpArray['d-term_realizacji'].",".$this->inpArray['d-harm_data'].",".$this->inpArray['d-koniec_proj'].",".$nadzor[1].",".$nadzor[0].",".$this->user.",1");
                 
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                $this->addNewProjectDok($this->queryLastId());  
            }    
        }     
    }
    protected function addNewProjectDok($id)
    {
        //echo __METHOD__."\n";
        $docCounter=1;
        if(!$this->err)
        {
            foreach($this->inpArray as $key => $value)
            {
                //echo $key." - ".$value."\n";
                if((strpos($key,'addDoc')!==false || strpos($key,'pdfExtra')!==false) && $value!=='') 
                {
                    // echo "FOUND\n";
                    $tmp=explode('|',$value);
                    if(!isset($tmp[1]))
                    {
                        $tmp[1]=$tmp[0];
                        $tmp[0]=$docCounter;
                    }
                    //$this->query('INSERT INTO projekt_dok (id_projekt,nazwa,external_id,external_type) VALUES (?,?,?,?)',$id.",".$tmp[1].",".$tmp[0].",".$key);    
                    $this->query('INSERT INTO projekt_dok (id_projekt,nazwa) VALUES (?,?)',$id.",".$tmp[1]);    
                    
                    if($this->getError()!=='')
                    {
                        $this->err.=$this->getError()."<br/>";
                    }
                    $docCounter++;
                };
            }
        };
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllProjects()
    {
        $this->query('SELECT * FROM v_all_proj WHERE 1=? ORDER BY id desc',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getProjectDocuments($idProject)
    {
        $this->query('SELECT ID,NAZWA FROM v_proj_dok WHERE ID_PROJEKT=? ORDER BY id ASC',$idProject);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getProjectDetails()
    {
        $valueToReturn=array();
        $this->query('SELECT * FROM v_all_proj WHERE id=?',$this->idProject);
       
        array_push($valueToReturn,$this->queryReturnValue());
        $this->query('SELECT ID,NAZWA FROM v_proj_dok WHERE ID_PROJEKT=? ORDER BY id ASC',$this->idProject);

        array_push($valueToReturn,$this->queryReturnValue());
        $this->valueToReturn=$valueToReturn;
    }
    # RETURN ALL NOT DELETED PROJECTs Members,LEADERs,SLO and other FROM DB
    public function getProjectPers($tableToSelect)
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY ImieNazwisko ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
     # RETURN ALL NOT DELETED DICTIONARY and other FROM DB
    public function getProjectSlo($tableToSelect,$order='ID')
    {
        $this->query('SELECT * FROM '.$tableToSelect.' WHERE 1=? ORDER BY '.$order.' ASC ',1);
        $this->valueToReturn=$this->queryReturnValue();
    }
     # RETURN ALL AVALIABLE MEMBERS
    public function getAllavaliableEmployee()
    {
        $this->query('SELECT * FROM v_udzial_sum_procent_prac WHERE sumProcentowyUdzial<? ORDER BY idPracownik ASC ',100);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # DELETED PROJECT IN DB
    function deleteProject($valueToDelete)
    {
        $this->parsePostData($valueToDelete);
        $this->query('UPDATE projekt_nowy SET wsk_u=? WHERE id=?',"1,".$this->inpArray['removeProjectid']);
        $team=array();
        $this->idProject=$this->inpArray['removeProjectid'];
        $this->removeNotSendedTeamMembers($team);
    }
    # CLOSE PROJECT IN DB
    function closeProject($valueToDelete)
    {
        $this->parsePostData($valueToDelete);
        $this->query('UPDATE projekt_nowy SET status=? WHERE id=?',"c,".$this->inpArray['closeProjectid']);
        $team=array();
        $this->idProject=$this->inpArray['closeProjectid'];
        $this->removeNotSendedTeamMembers($team);
    }
    # DELETED PROJECT IN DB
    function getProjectTeam($idProject)
    {
        $this->query('SELECT idPracownik,ImieNazwisko,procentUdzial,datOd,datDo FROM v_proj_prac_v2 WHERE idProjekt=?',$idProject);
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
};
class checkGetData extends manageProject
{
    private $avaliableFunction=array(
        "task"=>"task"
    );
    private $urlGetData=array();
    private $avaliableTask=array(
        "add",
        "edit",
        "del",
        "getprojects",
        "getprojectsmember",
        "getprojectsleader",
        "getprojectsmanager",
        "getprojectteam",
        'getprojectdetail',
        "gettypeofagreement",
        "getadditionaldictdoc",
        "getallemployeeprojsumperc",
        "getallavaliableemployeeprojsumperc",
        "addteam",
        'getprojectdocuments',
        'closeProject',
        'setprojectdocuments',
        'setprojectdetails'
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
        $this->infoArray['urlTask'][0]='Wrong function to execute';
        $this->infoArray['urlTask'][1]='Task not exists';
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
        
        case "add" :
            $this->setUser($_SESSION["username"]);
            $this->addNewProject($_POST);
            break;
        case "addteam":
            $this->setUser($_SESSION["username"]);
            $this->addTeamToProject($_POST);
            break;
        case "edit":
            break;
        case "removeProject":
            $this->deleteProject($_POST);
            break;
        case "closeProject":
            $this->closeProject($_POST);
            break;
        case "getprojects":
            $this->getAllProjects();
            break;
        case "getprojectdetail":
            $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getProjectDetails();
            break;
        case 'getprojectdocuments':
            $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getProjectDocuments($this->idProject);
            break;
        case "getprojectsmember":
            $this->getProjectPers('v_slo_czlonek_proj');
            break;
        case "getprojectsleader":
            $this->getProjectPers('v_slo_lider_proj');
            break;
        case "getprojectsmanager":
            $this->getProjectPers('v_slo_kier_proj');
            break;
        case "gettypeofagreement":
            $this->getProjectSlo('v_slo_um_proj');
            break;
        case "getadditionaldictdoc":
            $this->getProjectSlo('v_slo_dok');
            break;
        case  "getprojectteam":
            $idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getProjectTeam($idProject);
            break;
        case  "getallemployeeprojsumperc":
            $this->getProjectSlo('v_udzial_sum_procent_prac','idPracownik');
            break;
        case  "getallavaliableemployeeprojsumperc":
            $this->getAllavaliableEmployee();
            break;
        case "setprojectdocuments":
            //echo "setprojectdocuments\n";
            $this->setUser($_SESSION["username"]);
            $this->idProject=filter_input(INPUT_POST,'idProject',FILTER_VALIDATE_INT);
            $this->updateProjectDoc($_POST,$this->idProject);
            //print_r($_POST);
            break;
        case "setprojectdetails":
            $this->setUser($_SESSION["username"]);
            print_r($_POST);
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
$manageProject=NEW checkGetData();


