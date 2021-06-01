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
        parent::logMulti(0,$stDdata['data']['value']);
        return $stDdata['data']['value'];
    }
    public function getTmpFiles(){

        $this->log(0,"[".__METHOD__."]");
        $this->modul['FILE']=NEW file();
        $this->modul['FILE']->setUrl(APP_URL."function/showFile.php?dir=tmp_upload&file=");
        $this->modul['FILE']->setNewFileName($_SESSION['uid']);
        $this->modul['FILE']->setUploadDir($this->DR."/".TMP_UPLOAD_DIR);
        $this->modul['FILE']->setAcceptedFileExtension(array('image/jpeg'));
        $this->modul['FILE']->setMaxFileSize(100000);
        $this->modul['FILE']->uploadFiles();
        $this->log(0,$this->modul['FILE']->getLog());
        //$this->logMulti(0,$_FILES);
        $this->logMulti(0,$_POST);
        if($this->modul['FILE']->getErr()){
            return array(false,$this->modul['FILE']->getErr());
        }
        return array(true,$this->modul['FILE']->getUploadFiles());

        //return (self::getFilesWithPosition($this->modul['FILE']->getUploadFiles()));
    }
    private function getFilesWithPosition($files){
        $post=filter_input_array(INPUT_POST);
        $newFiles=array();
        $number=array();
        $defaultPosition='-bottom';
        $this->log(0,"[".__METHOD__."]");
        $this->logMulti(0,$files);
        foreach($files as $k => $v){
            $this->log(0,$k.' - '.$v);
            $number=explode('-',$k); 
            if(array_key_exists($number[0].'-fileposition',$post)){
                $newFiles[$k]=array('f'=>$v,'p'=>$post[$number[0].'-fileposition']);
                unset($post[$number[0].'-fileposition']);
            }
            else{
                $newFiles[$k]=array($v,$number[0].$defaultPosition);
            }
        }
        //foreach(filter_input_array(INPUT_POST) as $k => $v){
       //     $this->log(0,$k.' - '.$v);
       // }
        return $newFiles;
    }
    //put your code here
}
//$this->modul['STAGE']=NEW manageProjectStage();