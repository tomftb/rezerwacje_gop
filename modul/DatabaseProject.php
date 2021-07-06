<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of DatabaseProject
 *
 * @author tborczynski
 */
class DatabaseProject {
    private $dbLink;
    private $Utilities;
    private $Log;
    private $stageDbId=0;
    private $projectStageDb=[];
    private $stageValueDbId=0;
    private $idProject=0;
    private $input=[];
    
    protected function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Utilities=NEW Utilities();
    }
    protected function updateProjectDb($inp=[])
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $this->input=$inp;
        try{
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            self::update();
            $this->dbLink->commit();  //PHP 5 and new
        }
        catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception(__METHOD__.$e,1);
	}          
    }
    private function update(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Log->logMulti(0,$this->input,__METHOD__);
        $sql=[
            ':rodzaj_umowy'=>[$this->input['rodzaj_umowy'][1],'STR'],
            ':rodzaj_umowy_alt'=>[$this->input['rodzaj_umowy'][2],'STR'],
            ':numer_umowy'=>[$this->input['numer_umowy'],'STR'],
             ':temat_umowy'=>[$this->input['temat_umowy'],'STR'],
             ':kier_grupy'=>[$this->input['kier_grupy'][1],'STR'],
             ':kier_grupy_id'=>[$this->input['kier_grupy'][0],'INT'],
            ':term_realizacji'=>[$this->input['d-term_realizacji'],'STR'],
            ':harm_data'=>[$this->input['d-harm_data'],'STR'],
            ':koniec_proj'=>[$this->input['d-koniec_proj'],'STR'],
            ':nadzor'=>[$this->input['nadzor'][1],'STR'],
            ':nadzor_id'=>[$this->input['nadzor'][0],'INT'],
             ':mod_user'=>[$_SESSION["username"],'STR'],
            ':mod_user_id'=>[$_SESSION["userid"],'INT'],
            ':mod_host'=>[RA,'STR'],
            ':dat_kor'=>[CDT,'STR'],
            ':kier_osr'=>[$this->input['gl_kier'][1],'STR'],
            ':kier_osr_id'=>[$this->input['gl_kier'][0],'INT'],
            ':technolog'=>[$this->input['gl_tech'][1],'STR'],
            ':technolog_id'=>[intval($this->input['gl_tech'][0],10),'INT'],
            ':r_dane'=>[$this->input['r_dane'],'INT'],
            ':j_dane'=>[$this->input['j_dane'],'STR'],
            ':klient'=>[$this->input['klient'],'STR'],
            ':typ'=>[$this->input['typ_umowy'][1],'STR'],
            ':system'=>[$this->input['system_umowy'][1],'STR'],
            ':rodzaj_umowy_id'=>[$this->input['rodzaj_umowy'][0],'INT'],
            ':typ_id'=>[$this->input['typ_umowy'][0],'INT'],
            ':system_id'=>[$this->input['system_umowy'][0],'INT'],
            ':quota'=>[$this->input['quota'],'INT'],

            ":id"=>[$this->input['id'],'INT']
        ];
        $this->dbLink->query('UPDATE `projekt_nowy` SET '
                . '`rodzaj_umowy`=:rodzaj_umowy,'
                . '`rodzaj_umowy_alt`=:rodzaj_umowy_alt,'
                . '`numer_umowy`=:numer_umowy,'
                . '`temat_umowy`=:temat_umowy,'
                . '`kier_grupy`=:kier_grupy,'
                . '`kier_grupy_id`=:kier_grupy_id,'
                . '`term_realizacji`=:term_realizacji,'
                . '`harm_data`=:harm_data,'
                . '`koniec_proj`=:koniec_proj,'
                . '`nadzor`=:nadzor,'
                . '`nadzor_id`=:nadzor_id,'
                . '`mod_user`=:mod_user,'
                . '`mod_user_id`=:mod_user_id,'
                . '`mod_host`=:mod_host,'
                 . '`dat_kor`=:dat_kor,'
                . '`kier_osr`=:kier_osr,'
                . '`kier_osr_id`=:kier_osr_id,'
                . '`technolog`=:technolog,'
                . '`technolog_id`=:technolog_id,'
                . '`r_dane`=:r_dane,'
                . '`j_dane`=:j_dane,'
                . '`klient`=:klient,'
                . '`typ`=:typ,'
                . '`system`=:system,'
                . '`rodzaj_umowy_id`=:rodzaj_umowy_id,'
                . '`typ_id`=:typ_id,'
                . '`system_id`=:system_id,'
                . '`quota`=:quota'
                . ' WHERE '
                . 'id=:id',
        $sql);    
    }
    protected function getProjectDefaultValues(){
        $valueToReturn['rodzaj_umowy']=$this->dbLink->squery('SELECT * FROM v_slo_um_proj ORDER BY ID ASC');
        $valueToReturn['nadzor']=$this->dbLink->squery('SELECT * FROM v_slo_lider_proj ORDER BY ImieNazwisko ASC ');
        $valueToReturn['kier_grupy']=$this->dbLink->squery('SELECT * FROM v_slo_kier_proj ORDER BY ImieNazwisko ASC ');
        $valueToReturn['dokPowiazane']=$this->dbLink->squery('SELECT * FROM v_slo_dok ORDER BY ID ASC ');
        $valueToReturn['gl_tech']=$this->dbLink->squery('SELECT * FROM v_slo_glow_tech_proj ORDER BY ImieNazwisko ASC ');
        $valueToReturn['gl_kier']=$this->dbLink->squery('SELECT * FROM v_slo_kier_osr_proj ORDER BY ImieNazwisko ASC ');
        $valueToReturn['typ_umowy']=$this->dbLink->squery('SELECT * FROM v_slo_typ_um  ORDER BY ID ASC ');
        $valueToReturn['system_umowy']=$this->dbLink->squery('SELECT * FROM v_slo_sys_um ORDER BY ID ASC ');
        $valueToReturn['unitSlo']=self::getProjectUnitSlo();
        $valueToReturn['quota']=$this->dbLink->squery("SELECT `WARTOSC` FROM `parametry` WHERE `SKROT`='PROJ_QUOTA'")[0]['WARTOSC'];
        $valueToReturn['r_dane']=$this->dbLink->squery("SELECT `WARTOSC` FROM `parametry` WHERE `SKROT`='PROJ_BASE_FILE_SIZE'")[0]['WARTOSC'];
        $valueToReturn['id']='';
        $valueToReturn['numer_umowy']='';
        $valueToReturn['klient']='';
        $valueToReturn['temat_umowy']='';
        $valueToReturn['term_realizacji']=date("d.m.Y");  
        $valueToReturn['harm_data']=date("d.m.Y"); 
        $valueToReturn['koniec_proj']=date("d.m.Y"); 
        return $valueToReturn;
    }
    private function getProjectUnitSlo()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $sloIterator=New DataIterator($this->dbLink->squery("SELECT `NAZWA`,`DEF` FROM `slo_jednostka_miary` WHERE `ID`>0 AND `WSK_U`='0' ORDER BY ID ASC "));
        $def='';
        $all=array();
        
        while ($sloIterator->valid()) {
            $current = $sloIterator->current();
            if($current['DEF']==='t') {
                $def=$current['NAZWA'];
            }
            else{
                array_push($all,$current['NAZWA']);
            }
            $sloIterator->next();
        }
        array_unshift ($all,$def);
        return $all;
    }
    protected function addProjectDb($input=[])
    {
        try{
            $sql=[
                ':create_user'=>[$_SESSION["username"],'STR'],
                ':create_user_full_name'=>[$_SESSION["nazwiskoImie"],'STR'],
                ':create_user_email'=>[$_SESSION["mail"],'STR'],
                ':create_date'=>[CDT,'STR'],
                ':rodzaj_umowy'=>[$input['rodzaj_umowy'][1],'STR'],
                ':rodzaj_umowy_alt'=>[$input['rodzaj_umowy'][2],'STR'],
                ':numer_umowy'=>[$input['numer_umowy'],'STR'],
                ':temat_umowy'=>[$input['temat_umowy'],'STR'],
                ':kier_grupy'=>[$input['kier_grupy'][1],'STR'],
                ':kier_grupy_id'=>[$input['kier_grupy'][0],'INT'],
                ':term_realizacji'=>[$input['d-term_realizacji'],'STR'],
                ':harm_data'=>[$input['d-harm_data'],'STR'],
                ':koniec_proj'=>[$input['d-koniec_proj'],'STR'],
                ':nadzor'=>[$input['nadzor'][1],'STR'],
                ':nadzor_id'=>[$input['nadzor'][0],'INT'],
                ':mod_user'=>[$_SESSION["username"],'STR'],
                ':mod_user_id'=>[$_SESSION["userid"],'INT'],
                ':mod_host'=>[RA,'STR'],
                ':kier_osr'=>[$input['gl_kier'][1],'STR'],
                ':kier_osr_id'=>[$input['gl_kier'][0],'INT'],
                ':technolog'=>[$input['gl_tech'][1],'STR'],
                ':technolog_id'=>[$input['gl_tech'][0],'INT'],
                ':r_dane'=>[$input['r_dane'],'INT'],
                ':j_dane'=>[$input['j_dane'],'STR'],
                ':klient'=>[$input['klient'],'STR'],
                ':typ'=>[$input['typ_umowy'][1],'STR'],
                ':system'=>[$input['system_umowy'][1],'STR'],
                ':rodzaj_umowy_id'=>[$input['rodzaj_umowy'][0],'INT'],
                ':typ_id'=>[$input['typ_umowy'][0],'INT'],
                ':system_id'=>[$input['system_umowy'][0],'INT'],
                ':quota'=>[$input['quota'],'INT']
            ];
            $this->dbLink->beginTransaction(); //PHP 5.1 and new
            $this->dbLink->query('INSERT INTO `projekt_nowy` 
                   (create_user,create_user_full_name,create_user_email,create_date,rodzaj_umowy,rodzaj_umowy_alt,numer_umowy,temat_umowy,kier_grupy,kier_grupy_id,term_realizacji,harm_data,koniec_proj,nadzor,nadzor_id,mod_user,mod_user_id,mod_host,kier_osr,kier_osr_id,technolog,technolog_id,r_dane,j_dane,klient,typ,system,rodzaj_umowy_id,typ_id,system_id,quota) 
                    VALUES
                    (:create_user,:create_user_full_name,:create_user_email,:create_date,:rodzaj_umowy,:rodzaj_umowy_alt,:numer_umowy,:temat_umowy,:kier_grupy,:kier_grupy_id,:term_realizacji,:harm_data,:koniec_proj,:nadzor,:nadzor_id,:mod_user,:mod_user_id,:mod_host,:kier_osr,:kier_osr_id,:technolog,:technolog_id,:r_dane,:j_dane,:klient,:typ,:system,:rodzaj_umowy_id,:typ_id,:system_id,:quota)'
                    ,$sql);
            /* Must BEFORE COMMIT, OTHERWISE LAST ID = 0 */
            $this->idProject=$this->dbLink->lastInsertId();
            $this->dbLink->commit();  //PHP 5 and new
        }
	catch (PDOException $e){
            $this->dbLink->rollback(); 
            throw New Exception("DATABASE ERROR: ".$e->getMessage(),1); 
	}
    }
    protected function getProjectId(){
        return $this->idProject;
    }
}
