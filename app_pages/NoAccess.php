<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of NoAccess
 *
 * @author tborczynski
 */
class NoAccess extends Page{
    private $Log;
    private $perm='';
    private $view=['vNoAccess.php','Main/Footer.php'];
    private $js=[];
    private $css=[
        'bootstrap.min.4.1.1.css',
        'gt-admin.css'
    ];

    private $meta=[
                    'http-equiv="content-type" content="text/html; charset=UTF-8"',
                    'name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"'
            ];
    public function __construct($idPage=0,array $pagePerm){
        $this->Log=Logger::init();
        parent::__construct();
        $this->perm=self::setPerm($idPage,$pagePerm);
        self::checkPerm();
        if($this->err){
            self::setPage();
            parent::load();
            exit();
        }
    }
    public function setPage(){
	$this->Log->log(0,"[".__METHOD__."]");
	parent::setJs($this->js);
        parent::setCSS($this->css);
        parent::setView($this->view);
        parent::setMeta($this->meta);
        parent::setMainPerm($this->perm);
    }
    private function checkPerm(){
        $this->Log->log(0,"[".__METHOD__."]");
        if(!in_array($this->perm,$_SESSION['perm'])){
           $this->err=true;
        }
    }
    private function setPerm($idPage=0,$pagePerm){
        //echo "<pre>";
        //print_r($pagePerm);
        //echo "</pre>";
        $idPage=trim($idPage);
        //$pagePerm=[];
        //echo "ID PAGE => ".$idPage."<br/>";
        //echo "ID PAGE => ".$pagePerm[$idPage]."<br/>";
        if($idPage===''){
            $this->Log->log(0,"[".__METHOD__."] EMPTY ID PAGE, RETURN DEFAULT");
            return array_shift($pagePerm);
        }
        if(!array_key_exists($idPage,$pagePerm)){
            $this->Log->log(0,"[".__METHOD__."] ID PAGE KEY NOT EXIST IN PAGE PERM ARRAY => ".$idPage.", SET DEFAULT");
            return array_shift($pagePerm);
        }
        $this->Log->log(0,"[".__METHOD__."] ID PAGE EXIST IN PAGE PERM ARRAY => ".$idPage);
        return $pagePerm[$idPage];
    }
}
