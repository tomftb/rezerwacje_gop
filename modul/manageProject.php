<?php
session_start();
require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/redirectToLoginPage.php");
require(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/.cfg/config.php');

class manageProject extends initialDb
{
    private $inpArray=array();
    protected $err="";
    protected $filter='';
    protected $mail='';
    protected $valueToReturn=null;
    protected $idProject=null;
    protected $projPrac=array();
    const maxPercentPersToProj=100;
    protected $taskPerm= ['perm'=>'','type'=>''];
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
                    //echo 'NOT EMPTY'.$value."\n";
                    $tmpArray=explode('.',$value);
                    $this->inpArray[$key]=$tmpArray[2]."-".$tmpArray[1]."-".$tmpArray[0];
                    //echo $key." - ".$this->inpArray[$key];
                }
                else
                {
                    //echo 'EMPTY'.$value."\n";
                    //$this->inpArray[$key]=NULL;
                    $this->inpArray[$key]='0000-00-00';
                   // echo $key.' - '.$this->inpArray[$key]."\n";
                };
            };
        }
    }
    private function checkExistInDb($tableName,$whereCondition,$valueToCheck)
    {
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
        }
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
            $this->query('SELECT udzialProcent FROM v_udzial_prac_proj_percent_v2 WHERE idPracownik=? AND idProjekt=?',$id.','.$this->idProject);
            $percentCurrentProj=$this->queryReturnValue();
            //print_r($percentCurrentProj);
            //echo "count returned values - ".count($percentCurrentProj)."\n";
            if(count($percentCurrentProj)===0)
            {
                $percentCurrentProj[0]['udzialProcent']=0;
            }
            //echo "Percent in current project - ".$percentCurrentProj[0]['udzialProcent']."\n";
            $this->query('SELECT sumProcentowyUdzial FROM v_udzial_sum_procent_prac_v2 WHERE idPracownik=?',$id);
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
                $team[$id]['email']=$persData[0]['email'];
                //$this->manageTeamPersActionIdDb($id,$team);
                $this->manageTeamPersActionIdDb($team[$id]);
                //array_splice($team, $id, 1);
                $this->projPrac[$id][0]=$value[0];
                $this->projPrac[$id][1]=$persData[0]['imie']." ".$persData[0]['nazwisko'];
            }
            $this->removeNotSendedTeamMembers($team);
            if(!$this->err)
            {
                foreach($team as $value)
                {
                    $this->updateTeamInDb($value);
                }
                //print_r($this->projPrac);
                //$this->projPrac=$team;
                $this->mail=NEW email();
                $errHeader='Uaktualniono członków zespołu. Niestety pojawiły się błędy w wysłaniu powiadomienia.';
                $err=$this->mail->sendMail($this->cUpdateProjTeamSubjectMail(),$this->cUpdateProjTeamBodyMail(),$this->cNewProjRecMail(),$errHeader);
                if($err)
                {
                    $this->err.=$err;
                }
            }
        }
    }
    //
    protected function updateProjectDoc($data,$idProject)
    {
            $this->parsePostData($data);
            $documents=$this->getSendedDoc();
            //print_r($documents);
            $this->getProjectDocuments($this->idProject);

            $documentsInDb=$this->valueToReturn;
            //print_r($documentsInDb);
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
        $curretDateTime=date('Y-m-d H:i:s');
        $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
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
                                   'UPDATE projekt_dok SET nazwa=?, wsk_u=?, mod_data=?,mod_user=?,mod_user_id=?,mod_host=? WHERE id_projekt=? AND id=?',
                                 $doc[2].',0,'.$curretDateTime.",".$_SESSION["username"].",".$_SESSION["userid"].",".$modHost.','.$idProject.','.$doc[1]);
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
            $this->query('INSERT INTO projekt_dok (id_projekt,nazwa,mod_data,mod_user,mod_user_id,mod_host) VALUES (?,?,?,?,?,?)',$idProject.','.$doc[2].",".$curretDateTime.",".$_SESSION["username"].",".$_SESSION["userid"].",".$modHost);     
        }
    }
    protected function isEmpty($key,$data)
    {
        if(trim($data)==='')
        {
            $this->err.="[".$key."]".$this->infoArray['input'][0]."<br/>";
        };
    }
    protected function getPdf($idProject)
    {
           $this->getProjectDetails($idProject);
        
            /*
             * [0] Project details
             * [1] Documents
             */
            $projectDetails=array();
            $projectDoc=array();
            $projectTeam=array();
            $projectMainManager=array();
            $projectMainTech=array();

            $projectDetails=$this->valueToReturn[0][0];
            //print_r($projectDetails);
            $projectDoc=$this->valueToReturn[1];

            $this->getProjectTeamPdf($idProject);

            if(count($this->valueToReturn)>0)
            {
                $projectTeam=$this->valueToReturn;

            }
            //print_r($projectTeam);
            $this->getProjectPers('v_slo_kier_osr_proj');

            $projectMainManager=$this->valueToReturn[0];
            //print_r($projectMainManager);
            $this->getProjectPers('v_slo_glow_tech_proj');
            $projectMainTech=$this->valueToReturn[0];
            //print_r($projectMainTech);
            require_once(filter_input(INPUT_SERVER,"DOCUMENT_ROOT").'/modul/createPdf.php'); 
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
            $curretDateTime=date('Y-m-d H:i:s');
            $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
            $idInDb=(string)$value['ID'];
            foreach($sendedDoc as $id => $data)
            {
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
                // UPDATE - DELETE WSK_U=1
                //echo "[DB=${idInDb}]NOT FOUND SET WSK_U=1\n";
                $this->query(
                     'UPDATE projekt_dok SET wsk_u=?,mod_data=?,mod_user=?,mod_user_id=?,mod_host=? WHERE id_projekt=? AND id=?',
                     '1,'.$curretDateTime.",".$_SESSION["username"].",".$_SESSION["userid"].",".$modHost.",".$idProject.','.$idInDb); 
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
                     '0,0000-00-00,0000-00-00,'.$curretDateTime.','.$_SESSION["userid"].','.$_SESSION["username"].',1,'.$this->idProject.','.$key['idPracownik']); 
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
                     $dataArray['imie'].','.$dataArray['nazwisko'].','.$dataArray[1].','.$dataArray[2].','.$dataArray[3].','.$curretDateTime.','.$_SESSION["userid"].','.$_SESSION["username"].',0,'.$this->idProject.','.$dataArray[0]);            
        }
        else
        {
            $this->query('INSERT INTO projekt_pracownik 
            (id_projekt,id_pracownik,imie,nazwisko,udzial_procent,dat_od,dat_do,mod_dat,mod_user_id,mod_user_name) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
        ,$this->idProject.','.$dataArray[0].','.$dataArray['imie'].','.$dataArray['nazwisko'].','.$dataArray[1].','.$dataArray[2].','.$dataArray[3].','.$curretDateTime.','.$_SESSION["userid"].','.$_SESSION["username"]);        
        }            
    }
    protected function getPersonData($id)
    {
        $this->query('SELECT * FROM pracownik WHERE id=?',$id);
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
    protected function getProjectDefaultValues()
    {
        $valueToReturn=array();
        
        $this->getProjectSlo('v_slo_um_proj');	
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectPers('v_slo_lider_proj');
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectPers('v_slo_kier_proj');
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectSlo('v_slo_dok');
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectPers('v_slo_glow_tech_proj');
        array_push($valueToReturn,$this->valueToReturn);
	$this->getProjectPers('v_slo_kier_osr_proj');
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectSlo('v_slo_typ_um');
        array_push($valueToReturn,$this->valueToReturn);
        $this->getProjectSlo('v_slo_sys_um');
        array_push($valueToReturn,$this->valueToReturn);
        $this->valueToReturn=$valueToReturn;
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
    protected function addProject($valueToAdd)
    {
        $this->parsePostData($valueToAdd);
        $this->checkValuesOfProject();
        if(!$this->err)
        {
            // EXPLODE FIELDS:
            $rodzaj_umowy=explode('|',$this->inpArray['rodzaj_umowy']);
            $typ_um=explode('|',$this->inpArray['typ_umowy']);
            $this->inpArray['typ_umowy']=$typ_um[1];
            $sys_um=explode('|',$this->inpArray['system_umowy']);
            $this->inpArray['system_umowy']=$sys_um[1];
            $this->setProjPrac();
            $curretDateTime=date('Y-m-d H:i:s');
            $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
            $this->query('INSERT INTO projekt_nowy 
            (create_user,create_date,rodzaj_umowy,rodzaj_umowy_alt,numer_umowy,temat_umowy,kier_grupy,kier_grupy_id,term_realizacji,harm_data,koniec_proj,nadzor,nadzor_id,mod_user,mod_user_id,mod_host,kier_osr,kier_osr_id,technolog,technolog_id,r_dane,j_dane,klient,typ,system) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        ,$_SESSION["username"].",${curretDateTime},".$rodzaj_umowy[1].",".$rodzaj_umowy[2].",".$this->inpArray['numer_umowy'].",".$this->inpArray['temat_umowy'].",".$this->projPrac['kier_grupy'][1].",".$this->projPrac['kier_grupy'][0].",".$this->inpArray['d-term_realizacji'].",".$this->inpArray['d-harm_data'].",".$this->inpArray['d-koniec_proj'].",".$this->projPrac['nadzor'][1].",".$this->projPrac['nadzor'][0].",".$_SESSION["username"].",".$_SESSION["userid"].",".$modHost.",".$this->projPrac['gl_kier'][1].','.$this->projPrac['gl_kier'][0].','.$this->projPrac['gl_tech'][1].','.$this->projPrac['gl_tech'][0].','.$this->inpArray['r_dane'].','.$this->inpArray['j_dane'].','.$this->inpArray['klient_umowy'].','.$typ_um[1].','.$sys_um[1]);
                 
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                
                $this->addProjectDok($this->queryLastId());  
                $this->mail=NEW email();
                $errHeader='Projekt został założony. Niestety pojawiły się błędy w wysłaniu powiadomienia.';
                $err=$this->mail->sendMail($this->cNewProjSubjectMail(),$this->cProjBodyMail(),$this->cNewProjRecMail(),$errHeader);
                if($err)
                {
                    $this->err.=$err;
                }
            }    
        }     
    }
    protected function sendMailToPers($POST)
    {
        $this->parsePostData($POST);
        $this->query('SELECT * FROM v_all_proj_v5 WHERE id=?',$this->inpArray['id']);
        $projectData=$this->queryReturnValue();
        //print_r($projectData);
        $this->projPrac['nadzor']=$projectData[0]['nadzor'];
        $this->projPrac['kier_grupy']=$projectData[0]['kier_grupy'];
        $this->projPrac['gl_tech']=$projectData[0]['technolog'];
        $this->projPrac['gl_kier']=$projectData[0]['kier_osr'];
        $this->inpArray['r_dane']=$projectData[0]['r_dane'];
        $this->inpArray['j_dane']=$projectData[0]['j_dane'];
        $this->inpArray['temat_umowy']=$projectData[0]['temat_umowy'];
        $this->query('SELECT * FROM v_proj_prac_team_group WHERE idProjekt=?',$this->inpArray['id']);
        $projectData=$this->queryReturnValue();
        $this->projPrac['team']=$projectData[0]['NazwiskoImie'];
        $this->mail=NEW email();
        $errHeader='Pojawiły się błędy w wysłaniu powiadomienia.';
        $err=$this->mail->sendMail($this->cRepeatInfoSubjectMail(),$this->cProjBodyMail(),$this->cNewProjRecMail(),$errHeader);
        if($err)
        {
            $this->err.=$err;
        }
    }
    protected function setProjPrac()
    {
        $this->projPrac['nadzor']=explode('|',$this->inpArray['nadzor']);
        $this->projPrac['kier_grupy']=explode('|',$this->inpArray['kier_grupy']);
        $this->projPrac['gl_tech']=explode('|',$this->inpArray['gl_tech']);
        $this->projPrac['gl_kier']=explode('|',$this->inpArray['gl_kier']);
        //print_r($this->projPrac);      
    }
    protected function getProjPracList()
    {
        $projPracList='';
        $licz=0;
        $sep='';
        $pers='';
        foreach($this->projPrac as $key => $value)
        {
            //echo $key."\n";
            //echo $value."\n";
            //print_r($value);
            if($licz)
            {
               $sep=', ';
            }
            if($key!='gl_kier')
            {
                
                if(is_array($value))
                {
                    $pers=$value[1];
                }
                else
                {
                    $pers=$value;
                }
                $projPracList.=$sep.$pers; 
            }
            
            $licz++;
        }
        return($projPracList);
    }
    protected function getProjPracTeamList()
    {
        
        $projPracList='';
        $licz=0;
        $sep='';
        foreach($this->projPrac as $value)
        {
            if($licz)
            {
               $sep=', ';
            }
            $projPracList.=$sep.$value[1]; 
            $licz++;
        }
        return($projPracList);
    }
    protected function cNewProjRecMail()
    {
        $recEmail=array();
        
        $pracEmail=array();

        foreach($this->projPrac as $value)
        {
            $this->query("SELECT Email FROM v_all_prac_v3 WHERE id=?",$value[0]);
            $pracEmail=$this->queryReturnValue();
            //print_r($pracEmail);
            
            if(count($pracEmail)>0)
            {
                $pracEmail=array($pracEmail[0]['Email'],$value[1]);
                array_push($recEmail,$pracEmail);
            }
        }
        //print_r($recEmail);
        return ($recEmail);
    }
    protected function cNewProjSubjectMail()
    {
        return('Zgłoszenie na utworzenie udziału dla Projektu');
    }
    protected function cRepeatInfoSubjectMail()
    {
        return('Powtórne powiadomienie o utworzonym udziale dla Projektu');
    }
    protected function cUpdateProjSubjectMail()
    {
        return('Zgłoszenie na aktualizację udziału dla Projektu');
    }
    protected function cUpdateProjTeamSubjectMail()
    {
        return('Zgłoszenie na aktualizację członków zespołu dla udziału Projektu');
    }
    protected function cProjBodyMail()
    {
        //print_r($this->inpArray);
        $quota=$this->inpArray['r_dane']*30;
        $mailBody="Zarejestrowano zgłoszenie na utworzenie nowego projektu o specyfikacji:\n\n";
        $mailBody.="Numer\t\t-\t".$this->inpArray['numer_umowy']."\n";
        $mailBody.="Klient\t\t-\t".$this->inpArray['klient_umowy']."\n";
        $mailBody.="Temat\t\t-\t".$this->inpArray['temat_umowy']."\n";
        $mailBody.="Typ\t\t-\t".$this->inpArray['typ_umowy']."\n";
        $mailBody.="\nRozmiar pliku bazowego\t- ".$this->inpArray['r_dane']." ".$this->inpArray['j_dane']."\n";
        $mailBody.="Sugerowana quota\t- ".$quota." ".$this->inpArray['j_dane']."\n";
        $mailBody.="Przypisani użytkownicy\t- ".$this->getProjPracList()."\n\n";
        //$mailBody.="Przypisani użytkownicy\t- \t".$_SESSION['nazwiskoImie'].", ".$this->getProjPracList()."\n\n";
        $mailBody.="Zgłaszający\t\t- ".$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].") \n";	
        $mailBody.="\n*Katalog\t\t- ".$this->inpArray['klient_umowy']."_".$this->inpArray['temat_umowy']."_".$this->inpArray['typ_umowy']."\n";
        $mailBody.="*System\t\t\t- ".$this->inpArray['system_umowy']."\n";
        $mailBody.="*Termin realizacji\t- ".$this->inpArray['d-term_realizacji']."\n";
        return ($mailBody);
    }
   
   
    protected function cUpdateProjTeamBodyMail()
    {
        $this->query("SELECT temat_umowy from v_all_proj where id=?",$this->inpArray['addTeamToProjectid']);
        $id=$this->queryReturnValue();
        
        $mailBody="Zarejestrowano aktualizację zgłoszonego projektu o specyfikacji:\n\n";
        $mailBody.="Nazwa projektu\t\t-\t".$id[0]['temat_umowy']."\n";

        $mailBody.="Przypisani członkowie zespołu\t- ".$this->getProjPracTeamList()."\n\n";
        $mailBody.="Aktualizujący\t\t- \t".$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].") ";	
       
        return ($mailBody);
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
    protected function addProjectDok($id)
    {
        //echo __METHOD__."\n";
        $curretDateTime=date('Y-m-d H:i:s');
        $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
        $docCounter=1;
        if(!$this->err)
        {
            foreach($this->inpArray as $key => $value)
            {
                //echo $key." - ".$value."\n";
                if((strpos($key,'addDoc')!==false || strpos($key,'newDok-')!==false) && $value!=='') 
                {
                    // echo "FOUND\n";
                    $tmp=explode('|',$value);
                    if(!isset($tmp[1]))
                    {
                        $tmp[1]=$tmp[0];
                        $tmp[0]=$docCounter;
                    }   
                    $this->query('INSERT INTO projekt_dok (id_projekt,nazwa,mod_data,mod_user,mod_user_id,mod_host) VALUES (?,?,?,?,?,?)',$id.",".$tmp[1].",".$curretDateTime.",".$_SESSION["username"].",".$_SESSION["userid"].",".$modHost);    
                    
                    if($this->getError()!=='')
                    {
                        $this->err.=$this->getError()."<br/>";
                    }
                    $docCounter++;
                };
            }
        };
    }
    protected function updateProject($projectPost,$idProject)
    {
        $this->parsePostData($projectPost);
        $this->isEmpty('Numer',$this->inpArray['numer_umowy']);
        $this->isEmpty('Temat',$this->inpArray['temat_umowy']);
            /*
             * echo "ID PROJECT: ".$idProject."\n";
             * echo "NUMER: ".$this->inpArray['numer_umowy']."\n";
             * echo "NUMER: ".$this->inpArray['temat_umowy']."\n";
             */
            if($this->checkExistInDb('projekt_nowy','numer_umowy=? AND id!=? AND wsk_u=? ',$this->inpArray['numer_umowy'].','.$idProject.",0")>0)
            {
                $this->err.=$this->infoArray['numer_umowy'][1]."<br/>";
            }
            if($this->checkExistInDb('projekt_nowy','temat_umowy=? AND id!=? AND wsk_u=? ',$this->inpArray['temat_umowy'].','.$idProject.",0")>0)
            {
                $this->err.=$this->infoArray['temat_umowy'][1]."<br/>";
            }
        
        if(!$this->err)
        {
            $this->setProjPrac();
            // EXPLODE FIELDS:
            //echo "<pre>";
            //print_r($this->inpArray);
            //echo "</pre>";
            $rodzaj_umowy=explode('|',$this->inpArray['rodzaj_umowy']);
            $sys_um=explode('|',$this->inpArray['system_umowy']);
            $typ_um=explode('|',$this->inpArray['typ_umowy']);

            $curretDateTime=date('Y-m-d H:i:s');
            $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
            $this->query('UPDATE projekt_nowy SET rodzaj_umowy=?,rodzaj_umowy_alt=?,numer_umowy=?,temat_umowy=?,kier_grupy=?,kier_grupy_id=?,term_realizacji=?, harm_data=?, koniec_proj=?, nadzor=?,nadzor_id=?,mod_user=?,mod_user_id=?,mod_host=?, dat_kor=?,kier_osr=?,kier_osr_id=?,technolog=?,technolog_id=?,r_dane=?,j_dane=?,klient=?,typ=?,system=? WHERE id=?',
            $rodzaj_umowy[1].",".$rodzaj_umowy[2].",".$this->inpArray['numer_umowy'].",".$this->inpArray['temat_umowy'].",".$this->projPrac['kier_grupy'][1].",".$this->projPrac['kier_grupy'][0].",".$this->inpArray['d-term_realizacji'].",".$this->inpArray['d-harm_data'].",".$this->inpArray['d-koniec_proj'].",".$this->projPrac['nadzor'][1].",".$this->projPrac['nadzor'][0].",".$_SESSION["username"].",".$_SESSION["userid"].",${modHost},${curretDateTime},".$this->projPrac['gl_kier'][1].','.$this->projPrac['gl_kier'][0].','.$this->projPrac['gl_tech'][1].','.$this->projPrac['gl_tech'][0].",".$this->inpArray['r_dane'].",".$this->inpArray['j_dane'].",".$this->inpArray['klient_umowy'].",".$typ_um[1].",".$sys_um[1].",${idProject}");
                 
            if($this->getError()!=='')
            {
                $this->err.=$this->getError()."<br/>";
            }
            else
            {
                //print_r($this->inpArray);
                $this->updateProjectDoc($projectPost,$idProject); 
                $this->inpArray['system_umowy']=$sys_um[1];
                $this->inpArray['typ_umowy']=$typ_um[1];
                $this->mail=NEW email();
                $errHeader='Projekt został zaktualizowany. Niestety pojawiły się błędy w wysłaniu powiadomienia.';
                $err=$this->mail->sendMail($this->cUpdateProjSubjectMail(),$this->cProjBodyMail(),$this->cNewProjRecMail(),$errHeader);
                if($err)
                {
                    $this->err.=$err;
                }
                 
            }    
        }     
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllProjects()
    {
        $valueToReturn=array();
        $this->query('SELECT * FROM v_all_proj WHERE 1=? ORDER BY id desc',1);
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
    public function getAllProjectsFilter($wskU,$filter)
    {
        $filter="%${filter}%";
        $valueToReturn=array();
        // OR typ LIKE (?) OR system LIKE (?)
        $this->query('SELECT * FROM v_all_proj_v7 WHERE wskU=? AND (id LIKE (?) OR numer_umowy LIKE (?) OR temat_umowy LIKE (?) OR kier_grupy LIKE (?) OR nadzor LIKE (?) OR term_realizacji LIKE (?) OR harm_data LIKE (?) OR koniec_proj LIKE (?) OR StatusName LIKE (?) OR StatusName LIKE (?) OR klient LIKE (?)) ORDER BY id desc'
                ,$wskU.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter.",".$filter); //.",".$filter.",".$filter
        array_push($valueToReturn,$this->queryReturnValue());
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
     # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getProjectDocuments($idProject)
    {
        $this->query('SELECT ID,NAZWA FROM v_proj_dok WHERE ID_PROJEKT=? ORDER BY id ASC',$idProject);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # RETURN CURRENT PROJECT DETAILS
    public function getProjectDetails($idProject)
    {
        $valueToReturn=array();
        $this->query('SELECT * FROM v_all_proj_v6 WHERE id=?',$idProject);
       
        array_push($valueToReturn,$this->queryReturnValue());
        $this->query('SELECT ID,NAZWA FROM v_proj_dok WHERE ID_PROJEKT=? ORDER BY id ASC',$idProject);

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
    public function getProjectEmplEmail()
    {
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $this->query('SELECT Pracownik,Pracownik_email AS Email FROM v_all_prac_proj_email WHERE Projekt_id=? ORDER BY Projekt_id ASC ',$id);
        $this->valueToReturn=$this->queryReturnValue();
    }
     # RETURN ALL AVALIABLE MEMBERS
    public function getAllavaliableEmployee()
    {
        $this->query('SELECT * FROM v_udzial_sum_procent_prac WHERE sumProcentowyUdzial<? ORDER BY idPracownik ASC ',100);
        $this->valueToReturn=$this->queryReturnValue();
    }
    # SET NEW PROJECT STATUS
    protected function setNewProjectStatus($dataPost,$status)
    {
        $this->parsePostData($dataPost);
        $curretDateTime=date('Y-m-d H:i:s');
        $modHost=filter_input(INPUT_SERVER,"REMOTE_ADDR");
        $reason=explode("|",$this->inpArray['reason']);
        if($reason[0]==='0')
        {
            $reason[1]=$this->inpArray['extra'];
        }
        switch($status)
        {
            case 'c': # CLOSE PROJECT IN DB
                $this->query('UPDATE projekt_nowy SET status=?,dat_kor=?, z_u_powod=?,mod_user=?,mod_user_id=?,mod_host=? WHERE id=?',"c,".$curretDateTime.",".$reason[1].",".$_SESSION["username"].",".$_SESSION["userid"].",${modHost},".$this->inpArray['id']);
                break;
            case 'd':# DELETED PROJECT IN DB
                $this->query('UPDATE projekt_nowy SET wsk_u=?,dat_usn=?,status=?, z_u_powod=?,mod_user=?,mod_user_id=?,mod_host=? WHERE id=?',"1,".$curretDateTime.",d,".$reason[1].",".$_SESSION["username"].",".$_SESSION["userid"].",${modHost},".$this->inpArray['id']);
                break;
            default:
                break;
        }
        //$team=array();
        //$this->idProject=$this->inpArray['id'];
        //$this->removeNotSendedTeamMembers($team);
    }
    # DELETED PROJECT IN DB
    function getProjectTeam($idProject)
    {
        $this->query('SELECT idPracownik,ImieNazwisko,procentUdzial,datOd,datDo FROM v_proj_prac_v2 WHERE idProjekt=?',$idProject);
        $this->valueToReturn=$this->queryReturnValue();
    }
    function getProjectTeamPdf($idProject)
    {
        $this->query('SELECT NazwiskoImie,DataOd,DataDo FROM v_proj_prac_v_pdf WHERE idProjekt=?',$idProject);
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
        array("addProject",'ADD_PROJ','user'),
        array("removeProject",'DEL_PROJ','user'),
        array("getprojects",'LOG_INTO_PROJ','user'),
        array("getprojectslike",'LOG_INTO_PROJ','user'),
        array("getprojectsmember",'','sys'),
        array("getprojectsleader",'','sys'),
        array("getprojectsmanager",'','sys'),
        array("getprojectgltech",'','sys'),
        array("getprojectglkier",'','sys'),
        array("getprojectteam",'SHOW_TEAM_PROJ','user'),
        array('getprojectdetails','SHOW_PROJ','user'),
        array("gettypeofagreement",'','sys'),
        array("getadditionaldictdoc",'','sys'),
        array("getallemployeeprojsumperc",'EDIT_TEAM_PROJ','user'),
        array("getallavaliableemployeeprojsumperc",'','user'),
        array("addTeamToProject",'EDIT_TEAM_PROJ','user'),
        array('getprojectdocuments','SHOW_DOK_PROJ','user'),
        array('closeProject','CLOSE_PROJ','user'),
        array('setprojectdocuments','EDIT_DOK_PROJ','user'),
        array('setprojectdetails','EDIT_PROJ','user'),
        array('getpdf','GEN_PDF_PROJ','user'),
        array('getProjectDefaultValues','','sys'),
        array('getprojectcloseslo','','sys'),
        array('getprojectdelslo','','sys'),
        array('getprojectemplemail','EMAIL_PROJ','user'),
        array('sendEmail','EMAIL_PROJ','user')
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
    private function runTask()
    {
        switch($this->urlGetData['task']):
        
        case "addProject" :
            $this->addProject($_POST);
            break;
        case "addTeamToProject":
            $this->addTeamToProject($_POST);
            break;
        case "removeProject":
            $this->setNewProjectStatus($_POST,'d');
            break;
        case "closeProject":
            $this->setNewProjectStatus($_POST,'c');
            break;
        case "getprojects":
            $this->getAllProjects();
            break;
        case "getprojectslike":
            $this->filter=filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING);
            $this->getAllProjectsFilter('0',$this->filter);
            break;
        case "getprojectdetails":
            $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getProjectDetails($this->idProject);
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
        case "getprojectgltech":
            $this->getProjectPers('v_slo_glow_tech_proj');
            break;
        case "getprojectglkier":
            $this->getProjectPers('v_slo_kier_osr_proj');
            break;
        case "getadditionaldictdoc":
            $this->getProjectSlo('v_slo_dok');
            break;
        case  "getprojectteam":
            $idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            $this->getProjectTeam($idProject);
            break;
        case  "getallemployeeprojsumperc":
            $this->getProjectSlo('v_udzial_sum_procent_prac_v2','idPracownik');
            break;
        case  "getallavaliableemployeeprojsumperc":
            $this->getAllavaliableEmployee();
            break;
        case "setprojectdocuments":
            $this->idProject=filter_input(INPUT_POST,'idProject',FILTER_VALIDATE_INT);
            $this->updateProjectDoc($_POST,$this->idProject);
            //print_r($_POST);
            break;
        case "setprojectdetails": // EDIT PROJECT
            $this->idProject=filter_input(INPUT_POST,'idProject',FILTER_VALIDATE_INT);
            $this->updateProject($_POST,$this->idProject);
            //print_r($_POST);
            break;
        case 'getpdf':
            $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
            //echo ($this->idProject);
            $this->getPdf($this->idProject);
            break;
        case 'getProjectDefaultValues':
            $this->getProjectDefaultValues();
            break;
        case 'getprojectcloseslo':
            $this->getProjectSlo('v_slo_zamk_proj');
            break;
        case 'getprojectdelslo':
            $this->getProjectSlo('v_slo_usun_proj');
            break;
        case 'getprojectemplemail':
            $this->getProjectEmplEmail('v_all_prac_proj_email','Projekt_id');
            break;
        case 'sendEmail':
            $this->sendMailToPers($_POST);
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
class email extends initialDb
{
    protected $emailParm=array();
    protected $email='';

    function __construct()
    {
        parent::__construct();
        $this->loadMail();
        $this->setMailParm();
    }
    public function setMailParm()
    {
        //GET EMAIL PARAMETERS
        $this->query('SELECT SKROT,WARTOSC FROM parametry WHERE UPPER(SKROT) LIKE (?) ','MAIL_%');
        $this->emailParm=$this->parseParm($this->queryReturnValue());
    }
    private function parseParm($data)
    {
        $tmpArray=array();
        foreach($data as $value)
        {
            $tmpArray[$value['SKROT']]=$value['WARTOSC'];
        }
        return($tmpArray);
    }
    protected function loadMail()
    {
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/SMTP.php");
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/Exception.php");
        include_once (filter_input(INPUT_SERVER,"DOCUMENT_ROOT")."/function/PHPMailer-master/src/PHPMailer.php");

        $this->email = new PHPMailer\PHPMailer\PHPMailer();
    }	
    public function sendMail($subject,$body,$recipient,$errHeader)
    {
        $footer="\n\n--\nTa wiadomość została wygenerowana automatycznie z portalu ".filter_input(INPUT_SERVER,"SERVER_NAME").", nie odpowiadaj na nią.";
        $err='';
        
        //echo "SEND MAIL\n";
        //echo print_r($this->emailParm);
        $this->email->IsSMTP();
        $this->email->Timeout  =   10;
        $this->email->Host = $this->emailParm['MAIL_SRV'];
        $this->email->CharSet = $this->emailParm['MAIL_CHARSET'];

        $this->email->SMTPKeepAlive = true;
        $from=explode('@',$this->emailParm['MAIL_USER']);
        $this->email->setFrom($this->emailParm['MAIL_USER'], $from[0]);
        $adminRecipient=explode(';',$this->emailParm['MAIL_RECIPIENT']);
        foreach($adminRecipient as $adminUser)
        {
            array_push($recipient,array($adminUser,'Admin'));
        }
        //$recipient=explode(';',$this->emailParm['MAIL_RECIPIENT']);
        if($this->emailParm['MAIL_SECURE']!='')
        {
            $this->email->SMTPSecure = 'tls'; 
        }
        if($this->emailParm['MAIL_PASS']!='')
        {
            $this->email->Username = $from[0];
            $this->email->Password = $this->emailParm['MAIL_PASS'];
            $this->email->SMTPAuth = true; 
        }
        $this->email->Port = $this->emailParm['MAIL_PORT_OUT']; 
        if($this->emailParm['MAIL_RECV'])
        {
            //print_r($_SESSION);
            array_push($recipient,array($_SESSION['mail'],$_SESSION['nazwiskoImie']));
        }
        foreach($recipient as $emailAdres)
        {
            //print_r($this->email->parseAddresses($emailAdres))."\n";
            //echo "Count: ".count($this->email->parseAddresses($emailAdres))."\n";
            if(count($this->email->parseAddresses($emailAdres[0])))
            {
                $this->email->addAddress($emailAdres[0]);
            }
            else
            {
                $err.="<br/>[".$emailAdres[1]."] Nieprawidłowy adres email - ".$emailAdres[0];
            }
            
        }
        //var_dump(get_class_methods($this->email));
        //print_r();
        //var_dump($this->email->getToAddresses());
        //print_r($this->email->getToAddresses());
        $this->email->Subject  = $subject;
        $this->email->Body     = $body.$footer;
        //die('STOP');
        
        //$this->email->send();
        if(!$this->email->send())
        {
            //echo "ERROR: ".$this->email->ErrorInfo;
            $errMail=explode(".",$this->email->ErrorInfo);
            $err.="<br/>".$errMail[0];
        }
        if($err)
        {
            $err=$errHeader.$err;
        }
        $this->email->SmtpClose(); 
        return($err);
    }
}
$manageProject=NEW checkGetData();