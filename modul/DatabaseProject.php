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
    private $utilities;
    private $Log;
    private $stageDbId=0;
    private $projectStageDb=[];
    private $stageValueDbId=0;
    private $idProject=0;
    
    protected function __construct(){
        $this->Log=Logger::init(__METHOD__);
        $this->dbLink=LoadDb::load();
        $this->Utilities=NEW Utilities();
    }
    protected function updateProjectDb()
    {
        $this->Log->log(0,"[".__METHOD__."]");
        $sql=[
            ':rodzaj_umowy'=>[$this->inpArray['rodzaj_umowy'][1],'STR'],
            ':rodzaj_umowy_alt'=>[$this->inpArray['rodzaj_umowy'][2],'STR'],
            ':numer_umowy'=>[$this->inpArray['numer_umowy'],'STR'],
            ':temat_umowy'=>[$this->inpArray['temat_umowy'],'STR'],
            ':kier_grupy'=>[$this->inpArray['kier_grupy'][1],'STR'],
            ':kier_grupy_id'=>[$this->inpArray['kier_grupy'][0],'INT'],
            ':term_realizacji'=>[$this->inpArray['d-term_realizacji'],'STR'],
            ':harm_data'=>[$this->inpArray['d-harm_data'],'STR'],
            ':koniec_proj'=>[$this->inpArray['d-koniec_proj'],'STR'],
            ':nadzor'=>[$this->inpArray['nadzor'][1],'STR'],
            ':nadzor_id'=>[$this->inpArray['nadzor'][0],'INT'],
            ':mod_user'=>[$_SESSION["username"],'STR'],
            ':mod_user_id'=>[$_SESSION["userid"],'INT'],
            ':mod_host'=>[RA,'STR'],
            ':dat_kor'=>[CDT,'STR'],
            ':kier_osr'=>[$this->inpArray['gl_kier'][1],'STR'],
            ':kier_osr_id'=>[$this->inpArray['gl_kier'][0],'INT'],
            ':technolog'=>[$this->inpArray['gl_tech'][1],'STR'],
            ':technolog_id'=>[$this->inpArray['gl_tech'][0],'INT'],
            ':r_dane'=>[$this->inpArray['r_dane'],'INT'],
            ':j_dane'=>[$this->inpArray['j_dane'],'STR'],
            ':klient'=>[$this->inpArray['klient'],'STR'],
            ':typ'=>[$this->inpArray['typ_umowy'][1],'STR'],
            ':system'=>[$this->inpArray['system_umowy'][1],'STR'],
            ':rodzaj_umowy_id'=>[$this->inpArray['rodzaj_umowy'][0],'INT'],
            ':typ_id'=>[$this->inpArray['typ_umowy'][0],'INT'],
            ':system_id'=>[$this->inpArray['system_umowy'][0],'INT'],
            ':quota'=>[$this->inpArray['quota'],'INT'],
            ":id"=>[$this->inpArray['id'],'INT']
        ];
        $this->dbLink->query('UPDATE `projekt_nowy` SET `rodzaj_umowy`=:rodzaj_umowy,`rodzaj_umowy_alt`=:rodzaj_umowy_alt,`numer_umowy`=:numer_umowy,`temat_umowy`=:temat_umowy,`kier_grupy`=:kier_grupy,`kier_grupy_id`=:kier_grupy_id,`term_realizacji`=:term_realizacji,`harm_data`=:harm_data,`koniec_proj`=:koniec_proj,`nadzor`=:nadzor,`nadzor_id`=:nadzor_id,`mod_user`=:mod_user,`mod_user_id`=:mod_user_id,`mod_host`=:mod_host,`dat_kor`=:dat_kor,`kier_osr`=:kier_osr,`kier_osr_id`=:kier_osr_id,`technolog`=:technolog,`technolog_id`=technolog_id,`r_dane`=:r_dane,`j_dane`=:j_dane,`klient`=:klient,`typ`=:typ,`system`=:system,`rodzaj_umowy_id`=:rodzaj_umowy_id,`typ_id`=:typ_id,`system_id`=:system_id,`quota`=:quota WHERE id=:id',
        $sql);              
        
    }
}
