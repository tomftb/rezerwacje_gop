<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of manageProjectReport
 *
 * @author tborczynski
 */
class manageProjectReport extends initialDb{
    
    public function getProjectReportData(){
        parent::log(0,"[".__METHOD__."]");
        $stage=new manageProjectStage();
        $stDdata=$stage->getProjectAllStage();
        parent::logMulti(0,$stDdata['value']);
    }
    //put your code here
}
//$this->modul['STAGE']=NEW manageProjectStage();