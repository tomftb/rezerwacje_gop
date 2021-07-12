<?php
interface ManageProjectTeamCommand
{
    public function getProjectTeam();
}
final class ManageProjectTeam implements ManageProjectTeamCommand{
    private $member=array();
    private $teamPostFields=array('pers','percent','ds','de');
    private $idProject='';
    private $actTeamMembers=array();
    private $emailTeamList='';
    private $adminEmailList=array();
    const maxPercentPersToProj=100;
    private $Log;
    private $dbLink;
        
    function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
        $this->dbLink=LoadDb::load();
    }
    public function getProjectTeam()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $v['id']=intval($id,10);
        $v['team']=self::getTeam($v['id']);
        $v['project']=$this->dbLink->squery("SELECT * FROM `v_all_proj_v11` WHERE `i`=:id",[':id'=>[$v['id'],'INT']])[0];
        $this->Utilities->jsonResponse($v,'pTeamOff');  
    }
    private function getTeam($id=0){
        $this->Log->log(1,"[".__METHOD__."] ID => ".$id);
        return $this->dbLink->squery('SELECT `idPracownik`,`ImieNazwisko`,`procentUdzial`,`datOd`,`datDo` FROM `v_proj_prac_v5` WHERE `idProjekt`=:id AND `wskU`=0',[':id'=>[$id,'INT']]);
    }
    public function getMemeber($id)
    {
        $this->Log->log(1,"[".__METHOD__."] ID => ".$id);
        $personData=$this->dbLink->squery('SELECT `imie`,`nazwisko`,`email` FROM `pracownik` WHERE `id`=:i',[':i'=>[$id,'INT']]);
        if(count($personData)>0){
            return($personData[0]);
        }
        else{
            Throw New Exception("[${id}] NO DATA ABOUT PERSON IN DB!",1);
        }
    }
    private function getTeamFullData()
    {
        return ($this->dbLink->squery("SELECT `id_pracownik` as 'pers',`imie`,`nazwisko`,`udzial_procent` as 'percent',concat(substr(`projekt_pracownik`.`dat_od`,9,11),'.',substr(`projekt_pracownik`.`dat_od`,6,2),'.',substr(`projekt_pracownik`.`dat_od`,1,4)) as 'ds',concat(substr(`projekt_pracownik`.`dat_do`,9,11),'.',substr(`projekt_pracownik`.`dat_do`,6,2),'.',substr(`projekt_pracownik`.`dat_do`,1,4)) as 'de' FROM `projekt_pracownik` WHERE `id_projekt`=".$this->idProject));
    }
    public function getTeamMember($id)
    {
        $this->Log->log(1,"[".__METHOD__."] ID => ".$id);
        return $this->query('SELECT `idPracownik`,`ImieNazwisko`,`procentUdzial`,`datOd`,`datDo` FROM `v_proj_prac_v5` WHERE `idPracownik`=?',$id);
    }
    public function pTeamOff()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $post=filter_input_array(INPUT_POST);
        $this->Utilities->keyExist($post,'id');
        $this->Utilities->isEmptyKeyValue($post,'id',true);
        $v['id']=$this->Utilities->getNumber($post['id']);
        $v['team']=self::getTeam($v['id']);
        $v['ava']=self::getAvaTeam($v['id']);  
        $this->Log->logMulti(2,$v,__LINE__."::".__METHOD__."");
        $this->Utilities->jsonResponse($v,'pTeam');  
    }
    public function pTeam()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->Utilities->keyExist($this->inpArray,'id');
        $this->Utilities->isEmptyKeyValue($this->inpArray,'id',true);
        $this->idProject=$this->Utilities->getNumber($this->inpArray['id']);
        UNSET($this->inpArray['id']);
        /* TO DO
        $this->adminEmailList=self::getAdminEmail();
         * 
         */
        self::setTeam();
        $this->Utilities->jsonResponse('','cModal');  
    }
    public function getAvaTeam($idProject)
    {
        $this->Log->log(1,"[".__METHOD__."] ID Project => ".$idProject);
        $sql[':id']=[$idProject,'INT'];
        $team=($this->dbLink->squery("SELECT
		`p`.`id`,
		CONCAT(`p`.`imie`,' ',`p`.`nazwisko`) as 'ImieNazwisko',
                (select (100 - cast(ifnull(sum(`pp`.`udzial_procent`),0) as signed)) FROM `projekt_pracownik` pp WHERE `p`.`id`=`pp`.`id_pracownik` and `pp`.`dat_do`<=curdate() and `pp`.`wsk_u`=0 AND `id_projekt`<>:id) as 'ava'         
                FROM 
                `pracownik` p
                WHERE 
            `p`.`wsk_u`=0
                ",$sql));
       foreach($team as $id => $value)
        {
            if($value['ava']<0)
            {
               UNSET($team[$id]);
            }
        }
        
        return $team;
    }
    private function getAvaTeamMember($id)
    {
        $this->Log->log(1,"[".__METHOD__."] ID => ".$id.", id Project => ".$this->idProject);
        /*
         * RETURN WITH wsk_u=0 , percent 
         */
        $sql=[
            ':id'=>[$this->idProject,'INT'],
            ':idm'=>[$id,'INT'],
        ];
	return ($this->dbLink->squery("select 
                            `p`.`id` AS `id`,
(select (100 - cast(ifnull(sum(`pp`.`udzial_procent`),0) as signed)) from `projekt_pracownik` `pp` where ((`pp`.`dat_do` > curdate()) and `pp`.`wsk_u` = 0 AND `pp`.`id_projekt`<>:id and `pp`.`id_pracownik` = `p`.`id`)) AS `ava` from `pracownik` `p` where `p`.id=:idm AND `p`.`wsk_u` = 0;",$sql));
        
        
        //return $this->query('SELECT * FROM `v_ava_prac_curdate` WHERE `id`=? ORDER BY `id` ASC ',$id);
    }
    private function setTeam(){
        $this->Log->log(1,"[".__METHOD__."]");
        $sql[":id"]=[$this->idProject,'INT'];
        $p=$this->dbLink->squery("SELECT `numer_umowy`,`klient`,`temat_umowy`,`typ` from `projekt_nowy` where id=:id",$sql)[0];
        self::setTeamMembers();    
        $this->Log->logMulti(0,$this->member,'member');
        array_map(array($this, 'checkTeamMemberConsistency'),$this->member);
        self::setupMember();              
        array_map(array($this, 'checkTeamMemberAvailable'),$this->member); 
        self::setNewTeamMembers(); 
        self::sendNotify($p);
    }
    private function setupMember(){
        foreach($this->member as $id => $m){
            $p=self::getMemeber($m['pers']);
            $this->member[$id]['imie']=$p['imie'];
            $this->member[$id]['nazwisko']=$p['nazwisko'];
            $this->member[$id]['email']=$p['email'];
            $this->emailTeamList.="<tr><td>".$p['imie'].' '.$p['nazwisko'].'</td><td>'.$this->member[$id]['ds'].'</td><td>'.$this->member[$id]['de'].'</td></tr>';
        }  
    }
    private function setTeamMembers()
    {
        $this->Log->logMulti(1,$this->inpArray);
        foreach($this->inpArray as $k => $v)
        {
            /* CHECK IS EMPTY */
            if(trim($v)===''){
                Throw New Exception('['.$k.'] VALUE IS EMPTY',1);
            }
            self::checkAndSetTeamMember($k,$v);
        }
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
        if(!array_key_exists(1, $tmp)){
            Throw New Exception('ARRAY KEY [1] NOT FOUND',1);
        }
        if(!in_array($tmp[0],$this->teamPostFields)){
            Throw New Exception('KEY NOT EXIST IN ACCEPTED FORM FIELDS => '.$tmp[0],1);
        }
        /* SETUP PROPER MySQL DATE */
        self::checkDate($tmp,$v);
        $this->member[$tmp[1]][$tmp[0]]=$v;
    }
    private function checkDate($tmp,&$v)
    {
        if($tmp[0]==='ds' || $tmp[0]==='de'){
            $v=$this->Utilities->getMysqlDate($v,'.');
        }
    }
    private function checkTeamMemberConsistency($teamMember)
    {
        $this->Log->log(1,"[".__METHOD__."]");
        if(count($teamMember)!==count($this->teamPostFields)){
            Throw New Exception('CONSISTENCY ERROR => count(input_array)!=count(teamPostFields)',1);
        }
    }
    private function checkTeamMemberAvailable($teamMember)
    {
        $this->Log->log(1,"[".__METHOD__."]".$teamMember['pers']);
        $member=self::getAvaTeamMember($teamMember['pers']);
        $this->Log->log(1,"[".__METHOD__."] COUNT => ".count($member));
        $this->Log->logMulti(0,$member);
        if(count($member)!=1){
            Throw New Exception('Pracownik '.$teamMember['imie'].' '.$teamMember['nazwisko'].' nie jest dostępny.',0);
        }
        $this->Log->logMulti(0,$member);
        if($member[0]['ava']<$teamMember['percent']){
            Throw New Exception('Dla pracownika '.$teamMember['imie'].' '.$teamMember['nazwisko'].' wskazano niedozwoloną wielkość udziału. Dostępna wartość - '.$member[0]['ava'],0);
        }
    }
    private function setNewTeamMembers()
    {
        $this->Log->log(1,"[".__METHOD__."]");
        $this->actTeamMembers=self::getTeamFullData();
        $this->Log->logMulti(0,$this->actTeamMembers,'actTeamMembers');
        /* SET CHANGE */
        $change=false;
        /* REMOVE NOT SENDED */
        try{
            $sql=[
                ":mod_dat"=>[CDT,"STR"],
                ":mod_user_id"=>[$_SESSION["userid"],'INT'],
                ":mod_user_name"=>[$_SESSION["username"],'STR'],
                ":id_projekt"=>[$this->idProject,'INT']
            ];
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            foreach($this->actTeamMembers as $a){
                self::rmTeamMember($a,$change,$sql);
            } 
            /* SET ACTION */
            foreach($this->member as $id => $m){
                self::updInsMember($id,$m,$change,$sql);
            }  
            $this->dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception("DATABASE ERROR: ".$e->getMessage(),1); 
	} 
        if(!$change){
            Throw New Exception('Nie wprowadzono żadnych zmian!',0);
        }
    }
    private function updInsMember($i,&$m,&$c,$sql)
    {
        $this->Log->log(1,"[".__METHOD__."]");
        $f=false;
        $sql[":udzial_procent"]=[$m['percent'],'INT'];
        $sql[":dat_od"]=[$m['ds'],'STR'];
        $sql[":dat_do"]=[$m['de'],'STR'];
        $sql[":id_pracownik"]=[$m['pers'],'INT'];
        foreach($this->actTeamMembers as $a)
        {
            if(intval($a['pers'])===intval($m['pers']) && intval($a['percent'])===intval($m['percent']) && $a['ds']==$m['ds'] && $a['de']==$m['de'])
            {
                $this->Log->log(1,"[".__METHOD__."] FOUND IDENTICAL");
                $f=true;
            }
            else if(intval($a['pers'])===intval($m['pers']))
            {
                $this->Log->log(1,"[".__METHOD__."] FOUND");
                $sql[":imie"]=[$a['imie'],'STR'];
                $sql[":nazwisko"]=[$a['nazwisko'],'STR'];
                $sql[":wsk_u"]=['0','STR'];

                $this->dbLink->query(
                     'UPDATE `projekt_pracownik` SET imie=:imie,nazwisko=:nazwisko,udzial_procent=:udzial_procent,dat_od=:dat_od,dat_do=:dat_do,mod_dat=:mod_dat,mod_user_id=:mod_user_id,mod_user_name=:mod_user_name,wsk_u=:wsk_u WHERE id_projekt=:id_projekt AND id_pracownik=:id_pracownik',$sql); 
                $c=true;
                $f=true;
            } 
        }
        if(!$f)
        {
            $c=true;
            $sql[":imie"]=[$m['imie'],'STR'];
            $sql[":nazwisko"]=[$m['nazwisko'],'STR'];    
            $this->dbLink->query('INSERT INTO `projekt_pracownik` 
            (id_projekt,id_pracownik,imie,nazwisko,udzial_procent,dat_od,dat_do,mod_dat,mod_user_id,mod_user_name) 
		VALUES
		(:id_projekt,:id_pracownik,:imie,:nazwisko,:udzial_procent,:dat_od,:dat_do,:mod_dat,:mod_user_id,:mod_user_name)'
            ,$sql);  
        }
    }
    private function rmTeamMember($a,&$c,$sql)
    {
        $this->Log->log(1,"[".__METHOD__."]");
        $f=false;
        foreach($this->member as $m)
        {
            if(intval($a['pers'])===intval($m['pers'])){
                $this->Log->log(1,"[".__METHOD__."] FOUND, NOT REMOVE");
                $f=true;
            }
        }
        if(!$f){
            $this->Log->log(1,"[".__METHOD__."] NOT FOUND, REMOVE ID MEMBER=> ".$a['pers'].", ID PROJECT => ".$this->idProject);
            $sql[":id_pracownik"]=[$a['pers'],'INT'];
            $this->dbLink->query('UPDATE `projekt_pracownik` SET udzial_procent=0,dat_od="0000-00-00",dat_do="0000-00-00",mod_dat=:mod_dat,mod_user_id=:mod_user_id,mod_user_name=:mod_user_name,wsk_u="1" WHERE id_projekt=:id_projekt AND id_pracownik=:id_pracownik',$sql); 
            $c=true;
        }
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
        $this->Log->log(0,"[".__METHOD__."] mailBody:");
        return ($mailBody);
    }
    private function emailRecipient()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        /* set admin list */
        $recEmail=self::getAdminEmail();
        $this->Log->logMulti(1,$this->member,__METHOD__." emailRecipient");
        foreach($this->member as $value)
        {
            $pracEmail=array($value['email'],$value['imie']." ".$value['nazwisko']);
            array_push($recEmail,$pracEmail);
        }
        return ($recEmail);
    }
    private function getAdminEmail(){
        /* array of emaiuls */
        $this->Log->log(0,"[".__METHOD__."] ");
        $recEmail=[];
        $ad=$this->dbLink->squery("SELECT `WARTOSC` FROM `parametry` WHERE `SKROT`='MAIL_RECIPIENT'");
        $adminUsers=explode(';',$ad[0]['WARTOSC']);
        foreach($adminUsers as $user){
            $this->Log->log(0,"[".__METHOD__."] ".$user);
            array_push($recEmail,array($user,'Admin'));
        }
        return $recEmail;
    }
    private function sendNotify($p){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->mail=NEW Email();
        $this->mail->sendMail(
                                    'Zgłoszenie na aktualizację członków zespołu :: '.$p['klient'].', '.$p['temat_umowy'].', '.$p['typ'],
                                    self::emailBody($p),
                                    self::emailRecipient(),
                                    'Uaktualniono członków zespołu. Niestety pojawiły się błędy w wysłaniu powiadomienia.',
                                    true);
    }
    function __destruct(){}
}