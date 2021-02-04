<?php
class manageProjectTeam extends initialDb {
    private $member=array();
    private $teamPostFields=array('pers','percent','ds','de');
    private $idProject='';
    private $actTeamMembers=array();
    private $emailTeamList='';
    private $adminEmailList=array();
    const maxPercentPersToProj=100;
    /*
     * status:
     * false -> error, no change
     * true -> change
     */
    private $response=array(
        'status'=>false,
        'info'=>'',
        'data'
    );
        
    function __construct()
    {
        parent::__construct();
        $this->log(0,"[".__METHOD__."]");
        $this->utilities=NEW utilities();
    }
    public function getTeam($id)
    {
        $this->log(1,"[".__METHOD__."] ID => ".$id);
        return $this->query('SELECT `idPracownik`,`ImieNazwisko`,`procentUdzial`,`datOd`,`datDo` FROM `v_proj_prac_v5` WHERE `idProjekt`=? AND `wskU`=?',$id.',0');
    }
    public function getMemeber($id)
    {
        $this->log(1,"[".__METHOD__."] ID => ".$id);
        $personData=$this->squery('SELECT `imie`,`nazwisko`,`email` FROM `pracownik` WHERE `id`='.$id);
        if(count($personData)>0)
        {
            return($personData[0]);
        }
        else
        {
            $this->setError(0,"[${id}] NO DATA ABOUT PERSON IN DB!");
        }
    }
    public function getTeamFullData($id)
    {
        $this->log(1,"[".__METHOD__."] ID => ".$id);
        return ($this->squery("SELECT `id_pracownik` as 'pers',`imie`,`nazwisko`,`udzial_procent` as 'percent',concat(substr(`projekt_pracownik`.`dat_od`,9,11),'.',substr(`projekt_pracownik`.`dat_od`,6,2),'.',substr(`projekt_pracownik`.`dat_od`,1,4)) as 'ds',concat(substr(`projekt_pracownik`.`dat_do`,9,11),'.',substr(`projekt_pracownik`.`dat_do`,6,2),'.',substr(`projekt_pracownik`.`dat_do`,1,4)) as 'de' FROM `projekt_pracownik` WHERE `id_projekt`=".$id));
    }
    public function getTeamMember($id)
    {
        $this->log(1,"[".__METHOD__."] ID => ".$id);
        return $this->query('SELECT `idPracownik`,`ImieNazwisko`,`procentUdzial`,`datOd`,`datDo` FROM `v_proj_prac_v5` WHERE `idPracownik`=?',$id);
    }
    public function getAvaTeam($idProject)
    {
        $this->log(1,"[".__METHOD__."] ID Project => ".$idProject);
       $team=($this->query("SELECT
		`p`.`id`,
		CONCAT(`p`.`imie`,' ',`p`.`nazwisko`) as 'ImieNazwisko',
          (select (100 - cast(ifnull(sum(`pp`.`udzial_procent`),0) as signed)) FROM `projekt_pracownik` pp WHERE `p`.`id`=`pp`.`id_pracownik` and `pp`.`dat_do`<=curdate() and `pp`.`wsk_u`=? AND `id_projekt`<>?) as 'ava'         
        from 
            `pracownik` p
        where 
            `p`.`wsk_u`=?
                ","0,".$idProject.",0"));
       foreach($team as $id => $value)
        {
            if($value['ava']<0)
            {
               UNSET($team[$id]);
            }
        }
        
        return $team;
        //return $this->query('SELECT * FROM `v_ava_prac_curdate` WHERE `id`>? ORDER BY `id` ASC ',$id);
    }
    public function getAvaTeamMember($id)
    {
        $this->log(1,"[".__METHOD__."] ID => ".$id.", id Project => ".$this->idProject);
        /*
         * RETURN WITH wsk_u=0 , percent 
         */

	return ($this->query("select 
                            `p`.`id` AS `id`,
(select (100 - cast(ifnull(sum(`pp`.`udzial_procent`),0) as signed)) from `projekt_pracownik` `pp` where ((`pp`.`dat_do` > curdate()) and `pp`.`wsk_u` = ? AND `pp`.`id_projekt`<>? and `pp`.`id_pracownik` = `p`.`id`)) AS `ava` from `pracownik` `p` where `p`.id=? AND `p`.`wsk_u` = ?;","0,".$this->idProject.",".$id.",0"));
        
        
        //return $this->query('SELECT * FROM `v_ava_prac_curdate` WHERE `id`=? ORDER BY `id` ASC ',$id);
    }
    public function setTeam($DATA)
    {
        $this->log(1,"[".__METHOD__."]");
        $this->idProject=$DATA['id'];
        $p=$this->squery("SELECT `numer_umowy`,`klient`,`temat_umowy`,`typ` from `projekt_nowy` where id=".$this->idProject)[0];
        UNSET($DATA['id']);
        self::setTeamMembers($DATA);    
        $this->logMulti(0,$this->member,'member');
        array_map(array($this, 'checkTeamMemberConsistency'),$this->member);
        self::setupMember();              
        array_map(array($this, 'checkTeamMemberAvailable'),$this->member); 
        self::setNewTeamMembers(); 
        $this->mail=NEW email();
        if($this->mail->sendMail(
                                    'Zgłoszenie na aktualizację członków zespołu :: '.$p['klient'].', '.$p['temat_umowy'].', '.$p['typ'],
                                    self::emailBody($p),
                                    self::emailRecipient(),
                                    'Uaktualniono członków zespołu. Niestety pojawiły się błędy w wysłaniu powiadomienia.',
                                    true
        )!=='')
        {
            $this->setError(0, $this->mail->getErr()); 
        }
        return  $this->getError();
        //$this->setError(0,"TEST STOP");
    }
    private function setupMember()
    {
        foreach($this->member as $id => $m)
        {
            $p=self::getMemeber($m['pers']);
            $this->member[$id]['imie']=$p['imie'];
            $this->member[$id]['nazwisko']=$p['nazwisko'];
            $this->member[$id]['email']=$p['email'];
            $this->emailTeamList.="<tr><td>".$p['imie'].' '.$p['nazwisko'].'</td><td>'.$this->member[$id]['ds'].'</td><td>'.$this->member[$id]['de'].'</td></tr>';
        }  
    }
    private function setTeamMembers($DATA)
    {
        $this->logMulti(1,$DATA);
        foreach($DATA as $k => $v)
        {
            /* CHECK IS EMPTY */
            if(trim($v)==='')
            {
                $this->setError(1,'['.$k.'] VALUE IS EMPTY');
                return false;
            }
            if(!self::checkAndSetTeamMember($k,$v))
            {
                return false;
            }
        }
        return true;
    }
    private function checkAndSetTeamMember($k,$v)
    {
        /*
         * CHECK FIELDS EXIST
         * pers_
         * percent_
         * ds_
         * de_
         */
        $tmp=explode('_',$k);
        if(!array_key_exists(1, $tmp))
        {
            $this->setError(1,'ARRAY KEY [1] NOT FOUND');
            return false;
        }
        if(!in_array($tmp[0],$this->teamPostFields))
        //if($tmp[0]!=='pers' && $tmp[0]!=='percent' && $tmp[0]!=='ds' && $tmp[0]!=='de')
        {
            $this->setError(1,'KEY NOT EXIST IN ACCEPTED FORM FIELDS => '.$tmp[0]);
            return false;
        }
        /* SETUP PROPER MySQL DATE */
        self::checkDate($tmp,$v);
        $this->member[$tmp[1]][$tmp[0]]=$v;
        return true;
    }
    private function checkDate($tmp,&$v)
    {
        if($tmp[0]==='ds' || $tmp[0]==='de')
        {
           
            if($this->utilities->setMysqlDate($v,'.')['status']!==0)
            {
                $this->setError(0,'Nieprwidłowa data ('.$tmp[0].') w wierszu nr '.$tmp[1]);
                //return false;
            } 
            $v=$this->utilities->getData();
        }
        //return true;
    }
    private function checkTeamMemberConsistency($teamMember)
    {
        $this->log(1,"[".__METHOD__."]");
        if($this->getError()!==''){return false;}
        if(count($teamMember)!==count($this->teamPostFields))
        {
           $this->setError(1,'CONSISTENCY ERROR => count(input_array)!=count(teamPostFields)'); 
        }
    }
    private function checkTeamMemberAvailable($teamMember)
    {
        $this->log(1,"[".__METHOD__."]".$teamMember['pers']);
        if($this->getError()!==''){return false;}
        $member=self::getAvaTeamMember($teamMember['pers']);
        $this->log(1,"[".__METHOD__."] COUNT => ".count($member));
        $this->logMulti(0,$member);
        if(count($member)!=1)
        {
            $this->setError(0,'Pracownik '.$teamMember['imie'].' '.$teamMember['nazwisko'].' nie jest dostępny.');
            return false;
        }
        $this->logMulti(0,$member);
        if($member[0]['ava']<$teamMember['percent'])
        {
            $this->setError(0,'Dla pracownika '.$teamMember['imie'].' '.$teamMember['nazwisko'].' wskazano niedozwoloną wielkość udziału. Dostępna wartość - '.$member[0]['ava']."");
            return false;
        }
    }
    private function setNewTeamMembers()
    {
        $this->log(1,"[".__METHOD__."]");
        if($this->getError()!==''){return false;}
        $this->actTeamMembers=self::getTeamFullData($this->idProject);
        $this->logMulti(0,$this->actTeamMembers,'actTeamMembers');
        /* SET CHANGE */
        $change=false;
        /* REMOVE NOT SENDED */
        foreach($this->actTeamMembers as $a)
        {
            self::rmTeamMember($a,$change);
        } 
        /* SET ACTION */
        foreach($this->member as $id => $m)
        {
            self::updInsMember($id,$m,$change);
        }  
        if(!$change)
        {
            $this->setError(0,'Nie wprowadzono żadnych zmian!');
        }
    }
    private function updInsMember($i,&$m,&$c)
    {
        $this->log(1,"[".__METHOD__."]");
        $f=false;
        foreach($this->actTeamMembers as $a)
        {
            if(intval($a['pers'])===intval($m['pers']) && intval($a['percent'])===intval($m['percent']) && $a['ds']==$m['ds'] && $a['de']==$m['de'])
            {
                $this->log(1,"[".__METHOD__."] FOUND IDENTICAL");
                $f=true;
            }
            else if(intval($a['pers'])===intval($m['pers']))
            {
                $this->log(1,"[".__METHOD__."] FOUND");
                $this->query(
                     'UPDATE projekt_pracownik SET imie=?,nazwisko=?,udzial_procent=?,dat_od=?,dat_do=?,mod_dat=?,mod_user_id=?,mod_user_name=?,wsk_u=? WHERE id_projekt=? AND id_pracownik=?',
                     $a['imie'].','.$a['nazwisko'].','.$m['percent'].','.$m['ds'].','.$m['de'].','.$this->cDT.','.$_SESSION["userid"].','.$_SESSION["username"].',0,'.$this->idProject.','.$m['pers']); 
                $c=true;
                $f=true;
            } 
        }
        if(!$f)
        {
            $c=true;
            $this->query('INSERT INTO projekt_pracownik 
            (id_projekt,id_pracownik,imie,nazwisko,udzial_procent,dat_od,dat_do,mod_dat,mod_user_id,mod_user_name) 
		VALUES
		(?,?,?,?,?,?,?,?,?,?)'
        ,$this->idProject.','.$m['pers'].','.$m['imie'].','.$m['nazwisko'].','.$m['percent'].','.$m['ds'].','.$m['de'].','.$this->cDT.','.$_SESSION["userid"].','.$_SESSION["username"]);  
        }
    }
    private function rmTeamMember($a,&$c)
    {
        $this->log(1,"[".__METHOD__."]");
        $f=false;
        foreach($this->member as $m)
        {
            if(intval($a['pers'])===intval($m['pers']))
            {
                $this->log(1,"[".__METHOD__."] FOUND, NOT REMOVE");
                $f=true;
            }
        }
        if(!$f)
        {
            $this->log(1,"[".__METHOD__."] NOT FOUND, REMOVE ID MEMBER=> ".$a['pers'].", ID PROJECT => ".$this->idProject);
            $this->squery('UPDATE `projekt_pracownik` SET udzial_procent=0,dat_od=\'0000-00-00\',dat_do=\'0000-00-00\',mod_dat=\''.$this->cDT.'\',mod_user_id='.$_SESSION["userid"].',mod_user_name=\''.$_SESSION["username"].'\',wsk_u=\'1\' WHERE id_projekt='.$this->idProject.' AND id_pracownik='.$a['pers']); 
            $c=true;
        }
    }
    public function getProjectPers($t)
    {
        /*
         * t => TABLE OR VIEW
         */
        return $this->query('SELECT * FROM '.$t.' WHERE 1=? ORDER BY ImieNazwisko ASC ',1);
    }
    public function getInfo()
    {
        return $this->getError();
    }
    public function getData()
    {
        return $this->response['data'];
    }
    protected function emailBody($p)
    {     
        $mailBody="<link href=\"http://fonts.googleapis.com/css?family=Lato:300,400,700&amp;subset=latin,latin-ext\" rel=\"stylesheet\" type=\"text/css\">";
        $mailBody.="<style type=\"text/css\"> table.lato { font-family: 'Lato', Arial,monospace; font-weight:normal;font-size:14px; }p.lato { font-family: 'Lato', Arial,monospace; font-weight:normal;font-size:16px; } </style>";
        $mailBody.="<p class=\"lato\">Zarejestrowano aktualizację zgłoszonego projektu o specyfikacji:</p>";
        $mailBody.="<table class=\"lato\" style=\"border:0px;border-collapse: collapse;\">";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Numer:&nbsp;</p></td><td colspan=\"2\">".$p['numer_umowy']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Klient:&nbsp;</p></td><td colspan=\"2\">".$p['klient']."</td></tr>";
        $mailBody.="<tr><td  style=\"padding-bottom:15px;\"><p style=\"margin:1px;\">Temat:&nbsp;</p></td><td colspan=\"2\" style=\"padding-bottom:15px;\">".$p['temat_umowy']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;color:#ff9900;text-align:center;\" >Przypisani członkowie zespołu:&nbsp</p></td><td><p style=\"color: #008000;\">Data od:</p></td><td><p style=\"color: #008000;\">Data do:</p></td></tr>";
        $mailBody.=$this->emailTeamList;
        $mailBody.="<tr><td style=\"padding-top:15px;\"><p style=\"margin:1px;\">Aktualizujący:&nbsp;</p></td><td colspan=\"2\" style=\"padding-top:20px;\">".$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].")</td></tr>";
        $mailBody.="</table>";
        $this->log(0,"[".__METHOD__."] mailBody:");
        return ($mailBody);
    }
    private function emailRecipient()
    {
        $this->log(0,"[".__METHOD__."]");
        /* set admin list */
        $recEmail=$this->adminEmailList;
        $this->logMulti(1,$this->member,__METHOD__." emailRecipient");
        foreach($this->member as $value)
        {
            $pracEmail=array($value['email'],$value['imie']." ".$value['nazwisko']);
            array_push($recEmail,$pracEmail);
        }
        return ($recEmail);
    }
    public function setAdminEmail($a)
    {
        /* array of emaiuls */
        $this->adminEmailList=$a;
    }
    function __destruct()
    {
        
    }
}
