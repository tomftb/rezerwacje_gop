<?php
/*
 * RECEIVER
 */
interface ManageProjectCommand
{
    public function pDelete();
    public function pPDF();
    public function pGenDoc();
    public function getProjectDefaultValues();
    public function pCreate();
    public function pDetails();
    public function pEmail();
    public function getprojectslike();
    public function pClose();
    public function getProjectCloseSlo();
}
final class ManageProject extends DatabaseProject implements ManageProjectCommand
{
    private $responseType='POST';
    private $inpArray=array();
    private $inpArrayDok=array();
    private $lastProjectData=array();
    private $projectDiff=array();
    private $filter='';
    private $mail='';
    private $valueToReturn=null;
    private $projectDocList='';
    private $idProject=null;
    private $projPrac=array();
    private $projectChange=0;
    private $notify='n';
    private $modul=array();
    private $taskPerm= ['perm'=>'','type'=>''];
    private $projectParm=array(
                        'dir'=>array(
                            'old'=>'',
                            'new'=>'',
                            'change'=>false,
                            'field'=>array(
                                'klient'=>'',
                                'temat_umowy'=>'',
                                'typ_umowy'=>'',
                                'd-term_realizacji'=>''
                            )
                        ),
                        'size'=>array(
                            'old'=>'',
                            'old_size'=>'',
                            'new'=>'',
                            'new_size'=>'',
                            'change'=>false,
                            'field'=>array(
                                'r_dane'=>'',
                                'j_dane'=>''
                                )
                        ),
                        'quota'=>array(
                            'quota'=>'',
                            'old_quota'=>'',
                            'change'=>false,
                            'field'=>array(
                                'quota'=>''
                            )
                        ),
                        'size_quota'=>array(
                            'new_size_quota'=>'',
                            'old_size_quota'=>''
                        )
            );
    private $projectParameters=array();
    private $infoArray=array
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
                ),
                "err_mail"=>array
                (
                    "Projekt został utworzony/zaktualizowany. Pojawiły się błędy w wysłaniu powiadomienia.",
                    "Pojawiły się błędy w wysłaniu powiadomienia."
                )
            );
    
    const zm="<span style=\"font-weight:bold;color:#ff0000\">(ZMIANA)</span> &rarr;";
    const spanBlack="<span style=\"font-weight:bold;color:#000000\">";
    const sGreen="<span style=\"font-weight:bold;color:#008000\">";
    const sEnd="</span>";
    private $Log;
    private $dbLink;
    
    public function __construct(){
        parent::__construct();
        $this->Log=Logger::init(__METHOD__);
        $this->Log->log(0,"[".__METHOD__."]");
        $this->notify='n';
        $this->modul['DOCUMENT']=NEW ManageProjectDocument();
        $this->modul['REPORT']=NEW ManageProjectReport();
        $this->modul['FILE']=NEW ManageProjectReport();
        $this->utilities=NEW Utilities();
        $this->response=NEW Response('Project');
        $this->dbLink=LoadDb::load();
    }
    private function setInpArray(){
        $this->utilities->getPost(true,true);
        if($this->utilities->getStatus()===0)
        {
            $this->inpArray=$this->utilities->getData();
        }
        else{
            Throw New Exception ($this->utilities->getInfo(),1);
        }
        $this->inpArrayDok=$this->utilities->getDoc();

        $this->Log->log(0,"[".__METHOD__."] inpArray:");
        $this->Log->logMulti(0,$this->inpArray,"L::".__LINE__."::".__METHOD__);
        $this->Log->log(0,"[".__METHOD__."] inpArrayDok:");
        $this->Log->logMulti(0,$this->inpArrayDok,"L::".__LINE__."::".__METHOD__);
    }
    private function checkDateTypePost($k,$v)
    {
        $tmpArray=array();
        if(preg_match('/^(d-).*/i',$k))
        //if(substr($k, 0,2)==='d-')
        {
            if($v!=='')
            {
                /*
                 * CHECK SEPARATOR
                 */
                $this->Log->log(1,"[".__METHOD__."] FOUND NOT EMPTY DATE => ".$v);
                $tmpArray=explode('.',$v);
                $this->inpArray[$k]=trim($tmpArray[2])."-".trim($tmpArray[1])."-".trim($tmpArray[0]);
            }
            else
            {
                $this->Log->log(1,"[".__METHOD__."] DATE => ".$v." => SET DEFAULT 0000-00-00");
                $this->inpArray[$k]='0000-00-00';
            }
        }
    }
    private function checkDokTypePost($k,$v)
    {
        if(preg_match('/^(dok-).*/i',$k))
        //if(substr($k, 0,7)==='orgDok-')
        {
            if($v!=='')
            {
                $this->Log->log(1,"[".__METHOD__."] FOUND NOT EMPTY DOCUMENT => ".$v);
                $this->inpArrayDok[$k]=$v;
            }
            UNSET($this->inpArray[$k]);
        }
    }
    private function getProjectData($id)
    {
        return ($this->dbLink->squery("SELECT * FROM `v_all_proj_v11` WHERE `i`=:id",[':id'=>[$id,'INT']])[0]);
    }
    public function pPDF()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $this->utilities->isValueEmpty($id);
        $sql[':id']=[$id,'INT'];
        $projectDetails=$this->dbLink->squery('SELECT `create_date`,`create_user_full_name`,`create_user_email`,`rodzaj_umowy`,`numer_umowy`,`temat_umowy`,`kier_grupy`,`term_realizacji` as \'d-term_realizacji\',`harm_data`,`koniec_proj` as \'d-koniec_proj\',`nadzor`,`kier_osr`,`technolog`,`klient`,`typ` as \'typ_umowy\',`system`,`r_dane`,`j_dane`,`quota` FROM `projekt_nowy` WHERE `id`=:id AND `wsk_u`=0',$sql)[0];
        $projectDoc=$this->dbLink->squery('SELECT `nazwa` FROM `projekt_dok` WHERE `id_projekt`=:id AND `wsk_u`=0 ',$sql);   
        $projectTeam=$this->dbLink->squery('SELECT `NazwiskoImie`,`DataOd`,`DataDo` FROM `v_proj_prac_v_pdf` WHERE `idProjekt`=:id',$sql); 
        $PDF = new createPdf($projectDetails,$projectDoc,$projectTeam);
        echo json_encode($this->utilities->getResponse(__METHOD__,$PDF->getPdf(),'downloadProjectPdf','POST'));
    }
    public function pGenDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $this->utilities->isValueEmpty($id);
        $sql[':id']=[$id,'INT'];
        $projectDetails=$this->dbLink->squery('SELECT `create_date`,`create_user_full_name`,`create_user_email`,`rodzaj_umowy`,`numer_umowy`,`temat_umowy`,`klient`,`kier_grupy`,`term_realizacji` as \'d-term_realizacji\',`harm_data`,`koniec_proj` as \'d-koniec_proj\',`nadzor`,`kier_osr`,`technolog`,`klient`,`typ` as \'typ_umowy\',`system`,`r_dane`,`j_dane`,`quota` FROM `projekt_nowy` WHERE `id`=:id AND `wsk_u`=0 ',$sql)[0];
        $doc = new createDoc($projectDetails,$_FILES,'Project_'.$this->utilities->getData(),'.docx');
        $doc->createProjectReport();
        echo json_encode($this->utilities->getResponse(__METHOD__,$doc->getDocName(),'downloadProjectDoc','POST'));
    }
    public function getProjectDefaultValues(){
        $this->Log->log(0,"[".__METHOD__."]");
        echo json_encode($this->utilities->getResponse(__METHOD__, parent::getProjectDefaultValues(),'pCreate','POST'));
    }
    private function getIdDataPost(&$v)
    {
        /*
         * $v => value
         */
        $tmp_data=explode('|',$v);
        $id=$tmp_data[0];
        $value='';
        if(count($tmp_data)>0){
            // remove head
            array_shift($tmp_data);
            $value = implode (" ",$tmp_data);
        }
        $v=array($id,$value);
    }
    private function getIdDataProjectPost()
    {
        /*
         * GET AND EXPLODE ID WITH DATA ON |
         */
        $this->Log->log(0,"[".__METHOD__."]");
        self::getIdDataPost($this->inpArray['typ_umowy']);
        //$this->Log->logMulti(0,$this->inpArray['typ_umowy'],__METHOD__);
        self::getIdDataPost($this->inpArray['system_umowy']);
        self::getIdDataPost($this->inpArray['kier_grupy']);
        self::getIdDataPost($this->inpArray['gl_tech']);
        self::getIdDataPost($this->inpArray['gl_kier']);
        self::getIdDataPost($this->inpArray['nadzor']);
        $this->inpArray['rodzaj_umowy']=explode('|',$this->inpArray['rodzaj_umowy']);
    }
    public function pCreate()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        self::setInpArray();
        $this->response->setType('POST');
        self::isEmpty('Numer',$this->inpArray['numer_umowy']);
        self::isEmpty('Temat',$this->inpArray['temat_umowy']);
        if($this->dbLink->squery('SELECT * FROM `projekt_nowy` WHERE `wsk_u`=\'0\' AND  `numer_umowy`=:numer_umowy',[':numer_umowy'=>[$this->inpArray['numer_umowy'],'STR']])){
           Throw New Exception ($this->infoArray['numer_umowy'][1],0); 
        }

        if($this->dbLink->squery('SELECT * FROM `projekt_nowy` WHERE `wsk_u`=\'0\' AND  `temat_umowy`=:temat_umowy',[':temat_umowy'=>[$this->inpArray['temat_umowy'],'STR']])){
           Throw New Exception ($this->infoArray['temat_umowy'][1],0); 
        }
        self::getIdDataProjectPost();
        self::setProjectDir();
        self::setQuotaField($this->inpArray['quota']);
        self::setProjectParm($this->inpArray);
        self::setProjectSizeQuota();
        self::setProjPrac();
        parent::addProjectDb($this->inpArray);
        self::parseResponse($this->modul['DOCUMENT']->addDok(parent::getProjectId(),$this->inpArrayDok));
        $this->projectChange=1;
        $this->notify='y';
        self::sendNotify(
                        "Zgłoszenie na utworzenie Projektu :: ".$this->inpArray['klient'].', '.$this->inpArray['temat_umowy'].', '.$this->inpArray['typ_umowy'][1],
                        'Zarejestrowano zgłoszenie na utworzenie nowego projektu o specyfikacji:',
                                $this->inpArray);
        echo json_encode(($this->utilities->getResponse(__METHOD__,'','cModal','POST')));
    }
    private function setupInputValue($field='')
    {
        /*
         * GET SPECIFICATION FIELD VALUE
         */
        $this->Log->log(0,"[".__METHOD__."] field => ".$field);
        if(is_array($this->inpArray[$field]))
        //if(is_array($this->inpArray['system_umowy']))
        {
            $this->Log->logMulti(1,$this->inpArray[$field],__METHOD__);
            //$this->Log->logMulti(1,$this->inpArray['system_umowy'],__METHOD__);
            if(!array_key_exists(1, $this->inpArray[$field]))
            //if(!array_key_exists(1, $this->inpArray['system_umowy']))
            {
                $this->response->setError(1,"ARRAY KEY => 1 NOT EXIST IN inpArray[".$field."]");
                return '';
            } 
            return ($this->inpArray[$field][1]);
            //return ($this->inpArray['system_umowy'][1]);
        }
        
        return ($this->inpArray[$field]);
        //return ($this->inpArray['system_umowy']);
    }
    public function pEmail()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->inpArray=filter_input_array(INPUT_POST);
        $this->utilities->validateKey($this->inpArray,'id',true,1);
        $data=$this->dbLink->squery('SELECT `create_user_full_name`,`create_user_email`,`rodzaj_umowy`,`numer_umowy`,`temat_umowy`,`kier_grupy`,`term_realizacji` as \'d-term_realizacji\',`harm_data`,`koniec_proj` as \'d-koniec_proj\',`nadzor`,`kier_osr`,`technolog`,`klient`,`typ` as \'typ_umowy\',`system`,`r_dane`,`j_dane`,`quota` FROM `projekt_nowy` WHERE `id`=:i AND `wsk_u`=0 ',[':i'=>[$this->inpArray['id'],'INT']]);
        if(count($data)!==1){
            Throw New Exception ("[".__METHOD__."] THERE IS MORE THAN ONE OR NO PROJECT WITH `ID`=".$this->inpArray['id']." AND `wsk_u`=0",1); 
        }
        self::setProjectEmailFields($data[0]);
        $this->Log->logMulti(0,$data[0],__METHOD__);
        $this->mail=NEW Email();
        $this->mail->sendMail(
                                $data[0]['subject'],
                                self::projectBodyMailTemplate($data[0]['subject'],$data[0]),
                                self::getRecipient(),
                                $this->infoArray['err_mail'][1],
                                true
        );
        $this->utilities->jsonResponse(__METHOD__,'','cModal','POST'); 
    }
    private function getProjectDoc()
    {
        $tmp=''; 
        foreach($this->dbLink->squery('SELECT `nazwa` FROM `projekt_dok` WHERE `id_projekt`=:i AND `wsk_u`=\'0\' ',[':i'=>[$this->inpArray['id'],'INT']]) as $v)
        {
            $tmp.="-&nbsp;".$v['nazwa']."<br/>";
        }
        return $tmp;
    }
    private function getRecipient()
    {
        $patt=array();
        foreach($this->inpArray as $k => $v)
        {
            if(preg_match('/^e(\d)+$/i',$k) && (trim($v)!==''))
            {
                array_push($patt,array($v,''));
            }
        }
        return $patt;
    }
    private function setProjectEmailFields(&$d)
    {
        $d['size']=$d['r_dane'].$d['j_dane'];
        $d['s_quota']=intval($d['quota'],10)*intval($d['r_dane'],10);
        $d['applicant']=$d['create_user_full_name']."(".$d['create_user_email'].")";
        $d['dir']=self::setDirName($d['klient'],$d['temat_umowy'],$d['typ_umowy'],$d['d-term_realizacji']);
        $d['doc']=self::getProjectDoc();
        $d['users']=$d['nadzor'].", ".$d['kier_grupy'].", ".$d['technolog'].".";
        $d['subject']="Powtórne powiadomienie o założeniu Projektu :: ".$d['klient'].', '.$d['temat_umowy'].', '.$d['typ_umowy'];
    }
    private function setProjPrac()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->logMulti(0,$this->inpArray,__LINE__."::".__METHOD__." inpArray"); 
        array_push($this->projPrac,
                array($this->inpArray['nadzor'][0],$this->inpArray['nadzor'][1]),
                array($this->inpArray['kier_grupy'][0],$this->inpArray['kier_grupy'][1]),
                array($this->inpArray['gl_tech'][0],$this->inpArray['gl_tech'][1]),
                array($this->inpArray['gl_kier'][0],$this->inpArray['gl_kier'][1]));   
    
        //$this->Log->logMulti(0,$this->projPrac,__METHOD__." projPrac"); 
    }
    private function setPostProjPac()
    {
        $emailAddr=array();
        //array_push($this->projPrac,
        foreach($this->inpArray as $key => $value)
        {
            if(substr($key,0,13)==='emailAccount-')
            {
                array_push($emailAddr,array($value,$value));
            }
        }
        $this->Log->logMulti(0,$emailAddr,__METHOD__." emailAddr"); 
        return $emailAddr;
    }
    private function getProjPracList()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $projPracList=$this->inpArray['nadzor'][1].",".$this->inpArray['kier_grupy'][1].",".$this->inpArray['gl_tech'][1].".";
        $this->Log->log(1,"[".__METHOD__."] Project workers list => ".$projPracList);
        return($projPracList);
    }
    private function cNewProjRecMail($admin=0)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $recEmail=[];
        self::getAdminEmail($admin,$recEmail);
        $pracEmail=array();
        $this->Log->logMulti(1,$this->projPrac,__METHOD__." projPrac");
        foreach($this->projPrac as $value)
        {
            $sql=[
                    ':id'=>[$value[0],'INT']
            ];
            $pracEmail=$this->dbLink->squery("SELECT `Email` FROM `v_all_prac_v5` WHERE id=:id",$sql);
            if(count($pracEmail)){
                $pracEmail=array($pracEmail[0]['Email'],$value[1]);
                array_push($recEmail,$pracEmail);
            }
        }
        return ($recEmail);
    }
    private function getAdminEmail($admin,&$recEmail=[]){
        $this->Log->log(0,"[".__METHOD__."] ");
        if(!$admin){ return false; }
        $ad=$this->dbLink->squery("SELECT `WARTOSC` FROM `parametry` WHERE `SKROT`='MAIL_RECIPIENT'");
        $adminUsers=explode(';',$ad[0]['WARTOSC']);
        foreach($adminUsers as $user){
            $this->Log->log(0,"[".__METHOD__."] ".$user);
            array_push($recEmail,array($user,'Admin'));
        }
    }
    private function cNewProjSubjectMail($head){
        return('Zgłoszenie na utworzenie udziału dla Projektu :: '.$head);
    }
    private function cRepeatInfoSubjectMail($head){
        return('Powtórne powiadomienie o utworzonym udziale dla Projektu :: '.$head);
    }
    private function projectBodyMailTemplate($s,$d){
        /*
         * s => subject
         * d => data
         */
        $mailBody="<link href=\"http://fonts.googleapis.com/css?family=Lato:300,400,700&amp;subset=latin,latin-ext\" rel=\"stylesheet\" type=\"text/css\">";
        $mailBody.="<style type=\"text/css\"> table.lato { font-family: 'Lato', Arial,monospace; font-weight:normal;font-size:14px; }p.lato { font-family: 'Lato', Arial,monospace; font-weight:normal;font-size:16px; } </style>";
        $mailBody.="<p class=\"lato\">".$s."</p>";
        $mailBody.="<table class=\"lato\" style=\"border:0px;border-collapse: collapse;\">";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Numer</p></td><td>-&nbsp;".$d['numer_umowy']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Klient</p></td><td>-&nbsp;".$d['klient']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Temat</p></td><td>-&nbsp;".$d['temat_umowy']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Typ</p></td><td>-&nbsp;".$d['typ_umowy']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\"><br/>Rozmiar pliku bazowego</p></td><td><br/>-&nbsp;".$d['size']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">*Mnożnik quota</p></td><td>-&nbsp;".$d['quota']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Sugerowana quota</p></td><td>-&nbsp;".$d['s_quota']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">Przypisani użytkownicy</p></td><td>-&nbsp;".$d['users']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\"></br>Zgłaszający</p></td><td><br/>-&nbsp;".$d['applicant']."</td></tr>";	
        $mailBody.="<tr><td><p style=\"margin:1px;\"><br/>*Katalog</p></td><td><br/>-&nbsp;".$d['dir']."</td></tr>";
        $mailBody.="<tr><td><p style=\"margin:1px;\">*System</p></td><td>-&nbsp;".$d['system']."</td></tr>";
        $mailBody.="<tr><td style=\"vertical-align: top;\" valign=\"top\"><p style=\"margin:1px;\">*Termin realizacji</p></td><td>-&nbsp;".self::sGreen."START".self::sEnd.": ".$d['d-term_realizacji']."<br/>-&nbsp;".self::sGreen."KONIEC".self::sEnd.": ".$d['d-koniec_proj']."</td></tr>";
        $mailBody.="<tr><td style=\"vertical-align: top;\" valign=\"top\"><p style=\"margin:1px;\">*Powiązane dokumenty</p></td><td>".$d['doc']."</td></tr>";
        $mailBody.="</table>";
        $this->Log->log(0,$mailBody);
        return ($mailBody);
    }
    private function getLastProjectData()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $data=$this->dbLink->squery('SELECT * FROM `v_project_post_compare` WHERE `idProject`=:i',['i'=>[$this->inpArray['id'],'INT']]);
        if(count($data)!==1){
            Throw New Exception("[".__METHOD__."] THERE IS MORE THAN ONE PROJECT WITH ID, OR THERE NO PROJECT WITH THIS ID => ".$this->inpArray['id'],1);
        }
        $this->lastProjectData=$data[0];
        $this->Log->logMulti(2,$this->lastProjectData,__METHOD__." lastProjectData"); 
    }
    private function parseLastProjectData()
    {
        if(count($this->lastProjectData)===0) { return false;}
        $this->Log->log(1,"[".__METHOD__."][POST]");
        $this->Log->logMulti(1,$this->inpArray,__METHOD__);
        $this->Log->log(1,"[".__METHOD__."][DB]");
        $this->Log->logMulti(1,$this->lastProjectData,__METHOD__);
        $this->projectDiff = array_diff($this->inpArray, $this->lastProjectData);
        $this->Log->log(1,"[".__METHOD__."][POST<->DB]");
        $this->Log->logMulti(1,$this->projectDiff,__METHOD__);
        $this->projectChange=count($this->projectDiff);
        $this->Log->log(0,"[".__METHOD__."][POST<->DB] count diff => ".$this->projectChange);
    }
    public function pEdit()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->inpArray=filter_input_array(INPUT_POST);
        self::setInpArray();
        $this->utilities->keyExist($this->inpArray,'id');
        $this->utilities->isEmptyKeyValue($this->inpArray,'id',true,0);
        $this->utilities->keyExist($this->inpArray,'numer_umowy');
        $this->utilities->isEmptyKeyValue($this->inpArray,'numer_umowy',true,0);
        $this->utilities->keyExist($this->inpArray,'temat_umowy');
        $this->utilities->isEmptyKeyValue($this->inpArray,'temat_umowy',true,0);

        $this->inpArray['numer_umowy']=trim($this->inpArray['numer_umowy']);
        $this->inpArray['temat_umowy']=trim($this->inpArray['temat_umowy']);
        
        $this->dbLink->checkMaxValuelength('numer_umowy',$this->inpArray['numer_umowy'],'projekt_nowy');
        $this->dbLink->checkMaxValuelength('temat_umowy',$this->inpArray['temat_umowy'],'projekt_nowy');
        self::projectExist('numer_umowy',$this->inpArray['id']);
        self::projectExist('temat_umowy',$this->inpArray['id']);
        self::getLastProjectData();
        self::setQuotaField($this->lastProjectData['quota']);
        self::parseLastProjectData();
        self::setProjectParm($this->lastProjectData);
        self::setProjectDiff();
        self::getIdDataProjectPost();
        self::setProjectDir();
        self::setProjectSizeQuota();
        self::setProjPrac();
        parent::updateProjectDb($this->inpArray); 
        self::parseResponse($this->modul['DOCUMENT']->updateDoc($this->inpArray['id'],$this->inpArrayDok));    
        self::parseNotifyFields();
        self::sendNotify(
                        "Zgłoszenie aktualizacji Projektu :: ".$this->inpArray['klient'].', '.$this->inpArray['temat_umowy'].', '.$this->inpArray['typ_umowy'][1],
                        'Zarejestrowano zgłoszenie na aktualizację projektu o specyfikacji:',
                        $this->lastProjectData);
             
        echo json_encode($this->utilities->getResponse(__METHOD__,'','cModal','POST'));
    }
    private function projectExist($field='',$id=0){
        $this->Log->log(0,"[".__METHOD__."] ".$field." => ".$this->inpArray[$field]);  
        if(empty($this->inpArray[$field])){
            return false;
        }
        $sql=[
            ':id'=>[$id,'INT'],
            ':field'=>[$this->inpArray[$field],'STR'],
            ];
        if (count($this->dbLink->squery('SELECT * FROM `projekt_nowy` WHERE id!=:id AND `'.$field.'`=:field AND wsk_u=0',$sql))>0){
            Throw New Exception($this->infoArray[$field][1],0);
        }
    }
    private function setQuotaField($quota)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->inpArray['quota']=intval($this->projectParameters['PROJ_QUOTA']);
        $this->projectParm['quota']['old_quota']=intval($quota);
    }
    public function pDocEdit()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->setInpArray(filter_input_array(INPUT_POST));
        if(trim($this->inpArray['id'])==='')
        {
            $this->response->setError(1,' KEY ID in $_POST IS EMPTY');
        }
        else
        {
           self::parseResponse($this->modul['DOCUMENT']->updateDoc($this->inpArray['id'],$this->inpArrayDok)); 
        }
        /*
         * IT IS POSSIBLE TO ADD EMAIL NOTYFICATION
         */
        //$this->response->setError(0,'TEST STOP');
        return($this->response->setResponse(__METHOD__,'','cModal','POST'));
    }
    public function pDoc()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $sql=[':id'=>[$this->idProject,'INT']];
        $v['id']= $this->idProject;
        $v['project']=self::getProjectData( $this->idProject);
        $v['dokPowiazane']=$this->dbLink->squery('SELECT ID,NAZWA as "Nazwa" FROM v_proj_dok WHERE ID_PROJEKT=:id ORDER BY id ASC',$sql);
        echo json_encode($this->response->setResponse(__METHOD__,$v,'pDoc','POST'));      
    }

    private function setProjectDiff()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if($this->projectChange===0)
        {
            $this->Log->log(0,"[".__METHOD__."] BRAK ZMIAN WARTOŚCI PROJEKTU");
            //$this->response->setError(0,"BRAK ZMIAN!");
            //return false;
        }
        // update $lastProjectData for email message
        array_walk($this->lastProjectData,array('self', 'prepareDataRemoveId'));
        array_walk($this->projectDiff,array('self', 'prepareDataRemoveId'));  
        array_walk($this->lastProjectData,array('self', 'updateProjectArray'));  
    }
    private function setProjectDir()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * Project data array
         * for new project inpArray
         * for update project lastProjectData
         */
        $this->projectParm['dir']['new']=self::setDirName(
                                                            $this->inpArray['klient'],
                                                            $this->inpArray['temat_umowy'],
                                                            $this->inpArray['typ_umowy'][1],
                                                            $this->inpArray['d-term_realizacji']
        );
        if($this->projectParm['dir']['change'])
        {
            $this->projectParm['dir']['old']=self::setDirName(
                                                            $this->projectParm['dir']['field']['klient'],
                                                            $this->projectParm['dir']['field']['temat_umowy'],
                                                            $this->projectParm['dir']['field']['typ_umowy'],
                                                            $this->projectParm['dir']['field']['d-term_realizacji']
                    )." ".self::zm;
            self::fixNewDir();
        }  
        self::setDir();
    }
    private function setDirName($klient,$temat,$typ,$date)
    {
        //$k=strtr(utf8_decode($k), utf8_decode('àáâãäąçćèéêëęìíîïñòóôõöóùúûüýÿśÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ'), 'aaaaaacceeeeeiiiinoooooouuuuyysAAAAACEEEEIIIINOOOOOUUUUY');
        $k=preg_replace('/ /','_',$klient);
        $t=preg_replace('/ /','_',$temat);
        $u=preg_replace('/\\//','_',$typ);
        $dir=$k."_".$t."_".$u."_".$this->utilities->getYearFromData($date);
        $this->Log->log(0,"[".__METHOD__."] ".$dir);
        return $dir;
    }
    private function fixNewDir()
    {
        $this->projectParm['dir']['new']=self::spanBlack.$this->projectParm['dir']['new']."</span>";
        $this->Log->log(0,"[".__METHOD__."][new-fix] ".$this->projectParm['dir']['new']);
    }
    private function setDir()
    {
          $this->projectParm['dir']['new']=$this->projectParm['dir']['old']." ".$this->projectParm['dir']['new'];
          $this->Log->log(0,"[".__METHOD__."][new-old] ".$this->projectParm['dir']['new']);
    }
    
    private function setProjectSizeQuota()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * Project data array
         * for new project inpArray
         * for update project lastProjectData
         */
        self::setBaseFileSize();
        self::setQuota();
        self::setSuggestedQuota();
    }
    private function setBaseFileSize()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        self::setOldSize();
        if($this->projectParm['size']['change'])
        {
            self::setNewSize();
        }
        self::setEmailSize();
    }
    private function setQuota()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        self::setOldQuota();
        if($this->projectParm['quota']['change'])
        {
            self::setNewQuota();
        }
        self::setEmailQuota();
    }
     private function setSuggestedQuota()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        self::setOldSuggestedQuota();
        if($this->projectParm['quota']['change'] || $this->projectParm['size']['change'])
        {
            self::setNewSuggestedQuota();
        }
        self::setEmailSuggestedQuota();
    }
    private function setNewSize()
    {
        /*
         * $this->inpArray['r_dane']);
         * $this->inpArray['j_dane']);
         * add info about change
         */
        $this->projectParm['size']['new_size']=self::zm." ".self::spanBlack.$this->inpArray['r_dane'].$this->inpArray['j_dane'].self::sEnd;
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['size']['new_size']);   
    }
    private function setOldSize()
    {
        $this->projectParm['size']['old_size']=$this->projectParm['size']['field']['r_dane'].$this->projectParm['size']['field']['j_dane'];
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['size']['old_size']);
    }
    private function setEmailSize()
    {
        $this->projectParm['size']['new_size']=$this->projectParm['size']['old_size']." ".$this->projectParm['size']['new_size'];
    }
    private function setNewQuota()
    {
        /*
         * VALUE Already defined in method setQuotaField;
         * ADD CSS
         */
        $this->projectParm['quota']['quota']=self::zm." ".self::spanBlack.$this->inpArray['quota'].self::sEnd;
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['size']['new_size']);   
    }
    private function setOldQuota()
    {
        /*
         * Already defined in method setQuotaField;
         */
        //$this->projectParm['quota']['old_quota']='';
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['quota']['old_quota']);
    }
    private function setEmailQuota()
    {
        $this->projectParm['quota']['quota']=$this->projectParm['quota']['old_quota'].' '.$this->projectParm['quota']['quota'];
    }
    private function setNewSuggestedQuota()
    {
        /*
         * VALUE Already defined in method setQuotaField;
         * ADD CSS
         */
        if($this->projectParm['size']['change'] && $this->projectParm['quota']['change'])
        {
            $this->Log->log(0,"[".__METHOD__."] CHANGE SIZE (WITH UNIT) AND QUOTA");
            $this->projectParm['size_quota']['new_size_quota']=intval($this->inpArray['r_dane'])*intval($this->inpArray['quota']).$this->inpArray['j_dane'];
        }  
        else if($this->projectParm['size']['change'] && !$this->projectParm['quota']['change'])
        {
            $this->Log->log(0,"[".__METHOD__."] CHANGE SIZE (WITH UNIT)");
            $this->projectParm['size_quota']['new_size_quota']=intval($this->inpArray['r_dane'])*intval($this->projectParm['quota']['old_quota']).$this->inpArray['j_dane'];
        }
        else if(!$this->projectParm['size']['change'] && $this->projectParm['quota']['change'])
        {
            $this->Log->log(0,"[".__METHOD__."] CHANGE QUOTA");
            $this->projectParm['size_quota']['new_size_quota']=intval($this->projectParm['size']['field']['r_dane'])*intval($this->inpArray['quota']).$this->projectParm['size']['field']['j_dane'];
        }
        else
        {
            $this->response->setError(1, 'WRONG CASE !! NOTHING CHANGE !');  
            $this->projectParm['size_quota']['new_size_quota']='ERROR';
        }
        $this->projectParm['size_quota']['new_size_quota']=self::zm." ".self::spanBlack.$this->projectParm['size_quota']['new_size_quota'].self::sEnd;
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['size_quota']['new_size_quota']);   
    }
    private function setOldSuggestedQuota()
    {
        $this->projectParm['size_quota']['old_size_quota']=intval($this->projectParm['size']['field']['r_dane'])*intval($this->projectParm['quota']['old_quota']).$this->projectParm['size']['field']['j_dane'];
        $this->Log->log(0,"[".__METHOD__."] ".$this->projectParm['size_quota']['old_size_quota']);
    }
    private function setEmailSuggestedQuota()
    {
        $this->projectParm['size_quota']['new_size_quota']=$this->projectParm['size_quota']['old_size_quota'].' '.$this->projectParm['size_quota']['new_size_quota'];
    }
    private function updateProjectArray($v,$k)
    {
        if(array_key_exists ( $k ,$this->projectDiff ))
        {
            $this->Log->log(0,"[".__METHOD__."][$k] ".$v." KEY EXISTS -> update ".$this->projectDiff[$k]);
            $this->lastProjectData[$k]=$this->lastProjectData[$k]." ".self::zm." ".self::spanBlack.$this->projectDiff[$k]."</span>";
            $this->Log->log(0,"[".__METHOD__."] ".$this->lastProjectData[$k]); 
            self::checkProjectParmChange($k,$v,$this->projectParm['dir']); 
            self::checkProjectParmChange($k,$v,$this->projectParm['size']); 
            self::checkProjectParmChange($k,$v,$this->projectParm['quota']);
        }
    }
    private function checkProjectParmChange($k,$v,&$parm)
    {
        $this->Log->log(1,"[".__METHOD__."]");
        //$this->Log->log(1,"[".__METHOD__."] original array");
        $this->Log->logMulti(0,$parm,__METHOD__);
        if(array_key_exists($k,$parm['field']) && $parm['change']===false)
        //if(in_array($k,$parm['field']))
        {
            $this->Log->log(0,"[".__METHOD__."][f:$k][v:$v] array_key_exists in parm[field]");
            $parm['change']=true;
        }
    }
    private function setProjectParm($data)
    {
        $this->Log->logMulti(0,$data,__LINE__."::".__METHOD__);
        $this->projectParm['dir']['field']['klient']=$data['klient'];
        $this->projectParm['dir']['field']['temat_umowy']=$data['temat_umowy'];
        $this->projectParm['dir']['field']['typ_umowy']=$data['typ_umowy'];
        $this->projectParm['dir']['field']['d-term_realizacji']=$data['d-term_realizacji'];
        $this->projectParm['size']['field']['r_dane']=$data['r_dane'];
        $this->projectParm['size']['field']['j_dane']=$data['j_dane'];
        $this->projectParm['quota']['field']['quota']=$data['quota'];
    }
    private function prepareDataRemoveId(&$v)
    {
        $tmp_data=explode('|',$v);
        //$this->Log->log(0,"[".__METHOD__."] original array");
        //$this->Log->logMulti(0,$tmp_data,__METHOD__);
        if(count($tmp_data)>1)
        {
            // remove head
            array_shift($tmp_data);
            //$this->Log->log(0,"[".__METHOD__."] after array_shift");
            //$this->Log->logMulti(0,$tmp_data,__METHOD__);
            // scale tail
            $v = implode (" ",$tmp_data);
            //$this->Log->log(0,"[".__METHOD__."] new value, after implode -> ".$v);
        }
    }

    private function getNotifyFields()
    {
        $nf=$this->dbLink->squery('SELECT SUBSTRING(`SKROT`,20) AS "SKRT" FROM `parametry` WHERE `SKROT` LIKE "INFORM_CHANGE_PROJ_%" AND `WARTOSC`=1 ORDER BY `ID` ASC');
        //$this->Log->logMulti(0,$nf,__METHOD__."=>notifyFields");
        return $nf;
    }
    private function parseNotifyFields()
    {
        /*
         * nf = notify fields, array with 0,1 value
         * 0 -> not send on change
         * 1 -> send on change
         * 
         */
        /*
         * ERROR EXIST OR NO CHANGE
         */
        if($this->response->getError() || $this->projectChange===0) { return '';}
        $this->Log->logMulti(0,$this->projectDiff,__METHOD__."=>projectDiff");
         
        foreach(self::getNotifyFields() as $i => $f)
        {
            if(array_key_exists($f['SKRT'], $this->projectDiff))
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND NOTIFY FIELD (".$f['SKRT'].") => setup var notify = y");
                $this->notify='y';
                break;
            }
        }    
    }
    private function sendNotify($subject,$body,$data)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * ERROR EXIST OR NO CHANGE
         */
        if($this->response->getError() || $this->projectChange===0) { return '';}   
        $this->Log->log(0,"[".__METHOD__."] notify var => ".$this->notify);
        if($this->notify==='n'){ return false;}
        /*
         * FIX DATA FOR TEMPLATE
         */
        self::setDataForBodyEmailTemplate($data);
        if($this->response->getError()) { return false; }
        $this->mail=NEW Email();    
        if($this->mail->sendMail($subject,self::projectBodyMailTemplate($body,$data),self::cNewProjRecMail(1),$this->infoArray['err_mail'][0],true)!=='')
        {
            $this->response->setError(0, $this->mail->getErr());        
        }   
    }
    private function setDataForBodyEmailTemplate(&$d)
    {
        $this->Log->logMulti(0,$d,__METHOD__);
        $d['typ_umowy']=self::setupInputValue('typ_umowy');
        $d['size']=$this->projectParm['size']['new_size'];
        $d['quota']=$this->projectParm['quota']['quota'];
        $d['s_quota']=$this->projectParm['size_quota']['new_size_quota'];
        $d['users']=$this->getProjPracList();
        $d['applicant']=$_SESSION['nazwiskoImie']." (".$_SESSION["mail"].")";
        $d['dir']=$this->projectParm['dir']['new'];
        $d['system']=self::setupInputValue('system_umowy'); 
        $d['doc']="- ".$this->projectDocList;
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getAllProjects()
    {
        $valueToReturn=array();
        array_push($valueToReturn,$this->query('SELECT * FROM v_all_proj WHERE 1=? ORDER BY id desc',1));
        array_push($valueToReturn,$_SESSION['perm']);
        $this->valueToReturn=$valueToReturn;
    }
    public function getprojectslike()
    {
        $this->Log->log(0,"[".__METHOD__."] ");
        $wskU=0;
        $s="%".filter_input(INPUT_GET,'s',FILTER_SANITIZE_STRING)."%";
        $f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $this->Log->log(0,"[".__METHOD__."] GET => ".$f);
        $sql=[
            ':f'=>[$f,'STR']
        ];
        $result=$this->dbLink->squery('SELECT 
                        `id` as "i",
                        `numer_umowy` as "n",
                        `klient` as "k",
                        `temat_umowy` as "t",
                        `typ` as "t2",
                        `create_date` as "du",
                        `nadzor` as "l",
                        `kier_grupy` as "m",
                        `term_realizacji` as "ds",
                        `koniec_proj` as "dk",     
                        (case when (`status` = "n") then "Nowy" when (`status` = "c") then "Zamknięty" when (`status` = "d") then "Usunięty" when (`status` = "m") then "W trakcie" else "Błąd" end) as "s"
                 FROM `projekt_nowy` WHERE `wsk_u`=0 AND (`id` LIKE (:f) OR `numer_umowy` LIKE (:f) OR `temat_umowy` LIKE (:f) OR `kier_grupy` LIKE (:f) OR `nadzor` LIKE (:f) OR `term_realizacji` LIKE (:f) OR `typ` LIKE (:f) OR `koniec_proj` LIKE (:f) OR `status` LIKE (:f) OR `klient` LIKE (:f)) ORDER BY `id` desc'
                ,$sql);
        
         //echo json_encode($this->modulData);
        /* OLD VERSION */
        //return ($this->response->setResponse(__METHOD__,$result,''));
        echo (json_encode($this->response->setResponse(__METHOD__,$result,'')));
    }
    # GET PROJECT DETAILS
    public function pDetails()
    {
        $this->idProject=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $sql=[
            ':id'=>[$this->idProject,'INT']
        ];
        $v=$this->dbLink->squery('SELECT `id`,`numer_umowy`,`klient`,`temat_umowy`,`term_realizacji`,`harm_data`,`koniec_proj`,`quota`,`r_dane` FROM v_all_proj_v10 WHERE id=:id',$sql)[0];       
        $v['rodzaj_umowy']=self::setProjectRodzajUmowy($this->dbLink->squery('SELECT `rodzaj_umowy_id` as "ID",`rodzaj_umowy` as "Nazwa",`rodzaj_umowy_alt` as "NazwaAlt" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_um_proj ORDER BY ID ASC'));               
        $v['nadzor']=self::setProjectMember($this->dbLink->squery('SELECT `nadzor_id` as "id",`nadzor` as "ImieNazwisko" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_lider_proj ORDER BY ImieNazwisko ASC'));
        $v['kier_grupy']=self::setProjectMember($this->dbLink->squery('SELECT `kier_grupy_id` as "id",`kier_grupy` as "ImieNazwisko" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_kier_proj ORDER BY ImieNazwisko ASC'));
        $v['gl_tech']=self::setProjectMember($this->dbLink->squery('SELECT `technolog_id` as "id",`technolog` as "ImieNazwisko" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_glow_tech_proj ORDER BY ImieNazwisko ASC'));
        $v['gl_kier']=self::setProjectMember($this->dbLink->squery('SELECT `kier_osr_id` as "id",`kier_osr` as "ImieNazwisko" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_kier_osr_proj ORDER BY ImieNazwisko ASC'));      
        $v['typ_umowy']=self::setProjectDict($this->dbLink->squery('SELECT `typ_id` as "ID",`typ` as "Nazwa" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_typ_um ORDER BY ID ASC'));
        $v['system_umowy']=self::setProjectDict($this->dbLink->squery('SELECT `system_id` as "ID",`system` as "Nazwa" FROM `v_all_proj_v9` WHERE id=:id',$sql),$this->dbLink->squery('SELECT * FROM v_slo_sys_um ORDER BY ID ASC'));
        $v['unitSlo']=self::setProjectUnitSlo($this->dbLink->squery('SELECT `j_dane` FROM `v_all_proj_v10` WHERE id=:id',$sql)[0]['j_dane']);
        $v['project']=self::getProjectData($this->idProject);
        $v['dokPowiazane']=$this->dbLink->squery('SELECT ID,NAZWA as "Nazwa" FROM v_proj_dok WHERE ID_PROJEKT=:id ORDER BY id ASC',$sql);
        echo json_encode($this->response->setResponse(__METHOD__, $v,'pDetails','POST')); 
    }
    private function setProjectUnitSlo($j_dane)
    {
        $slo=$this->dbLink->squery("SELECT `NAZWA` FROM `slo_jednostka_miary` WHERE `ID`>0 AND `WSK_U`='0' ORDER BY ID ASC ");
        $all=array($j_dane);
        foreach($slo as $i => $v)
        {
            if($v['NAZWA']===$j_dane)
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND identical");
                UNSET($slo[$i]);
            }
            else
            {
                array_push($all,$v['NAZWA']);
            }   
        }
        return $all;
    }
    private function setProjectDict($pData,$dic)
    {
        $this->Log->logMulti(0,$pData,__LINE__."::".__METHOD__." Project DATA");
        $this->Log->logMulti(0,$dic,__LINE__."::".__METHOD__." Project dictionary");
        /*
         * check exist, if exist remove
         */
        foreach($dic as $id => $value)
        {
            if($pData[0]['ID']===$value['ID'] && $pData[0]['Nazwa']===$value['Nazwa'] )
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND identical");
                UNSET($dic[$id]);
            }
        }
        return array_merge($pData,$dic);
    }
    private function setProjectRodzajUmowy($pData,$dic)
    {
        $this->Log->logMulti(0,$pData,__LINE__."::".__METHOD__." Project DATA");
        $this->Log->logMulti(0,$dic,__LINE__."::".__METHOD__." Project dictionary");
        /*
         * check exist, if exist remove
         */
        foreach($dic as $id => $value)
        {
            if($pData[0]['ID']===$value['ID'] && $pData[0]['Nazwa']===$value['Nazwa'] && $pData[0]['NazwaAlt']===$value['NazwaAlt'] )
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND identical");
                UNSET($dic[$id]);
            }
        }
        return array_merge($pData,$dic);
    }
    private function setProjectMember($pData,$dic)
    {
        $this->Log->logMulti(0,$pData,__LINE__."::".__METHOD__." Project DATA");
        $this->Log->logMulti(0,$dic,__LINE__."::".__METHOD__." Project dictionary");
         /*
         * check exist, if exist remove
         */
        foreach($dic as $id => $value)
        {
            if($pData[0]['id']===$value['id'] && $pData[0]['ImieNazwisko']===$value['ImieNazwisko'])
            {
                $this->Log->log(0,"[".__METHOD__."] FOUND identical");
                UNSET($dic[$id]);
            }
        }
        return array_merge($pData,$dic);
    }
    public function getProjectEmailData()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->utilities->setGet('id',$this->inpArray);
        $sql=[
            ':id'=>[$this->inpArray['id'],'INT']
        ];
        $v['id']=$this->inpArray['id'];
        $v['project']=self::getProjectData($this->inpArray['id']);
        $v['email']=$this->dbLink->squery('SELECT Pracownik,Pracownik_email AS Email FROM v_all_prac_proj_email WHERE Projekt_id=:id ORDER BY Projekt_id ASC',$sql);
        $this->utilities->jsonResponse(__METHOD__,$v,'pEmail','POST');  
    }
     # RETURN ALL AVALIABLE MEMBERS
    public function getAllavaliableEmployee()
    {
        $this->valueToReturn=$this->query('SELECT * FROM v_udzial_sum_procent_prac WHERE sumProcentowyUdzial<? ORDER BY idPracownik ASC ',100);
    }
    public function pDelete()
    {
        self::setNewProjectStatus('d');
        if($this->response->getError()){ return false; }
        echo json_encode($this->response->setResponse(__METHOD__, '','cModal','POST')); 
    }
    public function pClose(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setNewProjectStatus('c');
        echo json_encode($this->response->setResponse(__METHOD__, '','cModal','POST')); 
    }
    # SET NEW PROJECT STATUS
    private function setNewProjectStatus($status)
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->setInpArray(filter_input_array(INPUT_POST));
        if($this->utilities->checkKeyExistEmpty('id',$this->inpArray)['status']!==0){
            Throw New Exception($this->utilities->getInfo(),1);
        }
        $reason=explode("|",$this->inpArray['reason']);
        if($reason[0]==='0')
        {
            $reason[1]=$this->inpArray['extra'];
        }
        if(trim($reason[1])===''){
            Throw New Exception('Podaj powód!',0);
        }
        $sql=[
            ':dat_kor'=>[CDT,'STR'],
            ':z_u_powod'=>[$reason[1],'STR'],
            ':mod_user'=>[$_SESSION["username"],'STR'],
            ':mod_user_id'=>[$_SESSION["userid"],'INT'],
            ':mod_host'=>[RA,'STR'],
            ':id'=>[$this->inpArray['id'],'INT']
        ];
        switch($status)
        {
            case 'c': # CLOSE PROJECT IN DB
                $sql[':status']=['c','STR'];
                 $this->dbLink->query('UPDATE `projekt_nowy` SET `status`=:status,`dat_kor`=:dat_kor,`z_u_powod`=:z_u_powod,`mod_user`=:mod_user,`mod_user_id`=:mod_user_id,`mod_host`=:mod_host WHERE `id`=:id',$sql);
                break;
            case 'd':# DELETED PROJECT IN DB
                $sql[':status']=['d','STR'];
                $sql[':wsk_u']=[1,'INT'];
                 $this->dbLink->query('UPDATE `projekt_nowy` SET `wsk_u`=:wsk_u,`status`=:status,`dat_kor`=:dat_kor,`z_u_powod`=:z_u_powod,`mod_user`=:mod_user,`mod_user_id`=:mod_user_id,`mod_host`=:mod_host WHERE `id`=:id',$sql);
                break;
            default:
                Throw New Exception('WRONG TASK!',1);
        }
    }
    public function getReturnedValue()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        echo json_encode($this->valueToReturn);
    }
    private function isEmpty($key,$data)
    {
        if(trim($data)===''){
            Throw New Exception ("[".$key."]".$this->infoArray['input'][0],0);
        }
    }
    public function getProjectCloseSlo()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        if($this->utilities->checkInputGetValInt('id')['status']===1){
            Throw New Exception($this->utilities->getInfo(),1);
        }
        $v['id']=$this->utilities->getData();
        $v['project']=self::getProjectData($v['id']);
        $v['slo']=$this->dbLink->squery('SELECT * FROM `v_slo_zamk_proj` ORDER BY `ID` ASC ');
        echo json_encode(($this->response->setResponse(__METHOD__,$v,'pClose','POST')));  
    }
    public function getProjectDeleteSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        if($this->utilities->checkInputGetValInt('id')['status']===1){
            Throw New Exception($this->utilities->getInfo(),1);
        }
        $v['id']=$this->utilities->getData();
        $v['project']=self::getProjectData($v['id']);
        $v['slo']=$this->dbLink->squery('SELECT * FROM `v_slo_usun_proj` ORDER BY `ID` ASC');
        echo json_encode($this->response->setResponse(__METHOD__,$v,'pDelete','POST'));  
        
    }
    private function parseResponse($response)
    {
        if($response['status']===0)
        {
            /*
             * NO CHANGE IN DOCUMENT'S
             * CHECK IS DATA IS ALREADY MODYFIED
             * IF YES, OK
             * IF NO, SET 0
             */
            if($this->projectChange===0){
                // ALREADY SETUP NO CHANGE
                $this->response->setError(0,'BRAK ZMIAN !');
            }
             $this->projectDocList=$response['info'];
        }
        else if($response['status']===1){
            // CHANGE    
            $this->projectDiff['dok']=1;
            $this->projectChange=1;
            $this->projectDocList=$response['info'];
        }
        else if($response['status']===2){
            // ERROR
            Throw New Exception ($response['info'],0);
        }
        else{
            // BAD RESPONSE STATUS
            Throw New Exception ('BAD RESPONSE STATUS FROM MODULE',1);
        }
    }
    public function downloadProjectPdf(){
        $this->Log->log(0,"[".__METHOD__."]");
        $download=new downloadFile();
        $download->getFile(filter_input(INPUT_GET,"file"));
    }
    public function downloadProjectDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $download=new downloadFile();
        $download->getFile(filter_input(INPUT_GET,"file"));
    }
    public function downloadReportDoc(){
        $this->Log->log(0,"[".__METHOD__."]");
        $download=new downloadFile();
        $download->getFile(filter_input(INPUT_GET,"file"));
    }     
    public function showProjectReportFile(){
        $this->Log->log(0,"[".__METHOD__."]");
        $showFile=new showFile();
        $showFile->getFile(filter_input(INPUT_GET,"dir"),filter_input(INPUT_GET,"file"));
    }
    function __destruct(){}
}