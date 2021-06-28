<?php

abstract class Page{
    private $Log;
    private $mainPerm='LOG_INTO_PROJ';
    private $view=[];
    private $js=[];
    private $uid='';
    public $err='';
    public $bgColor='';
    private $mainJs=[
        'JSCREATEHTML'=>'createHtmlElement.js',
        'JSUTILITIES'=>'utilities.js',
        'JSERROR'=>'error.js',
        'JSRESPONSE'=>'response.js',
        'JSTABLE'=>'mainTable.js',
        'JSXHR'=>'xhr.js',
        'JSPARSE'=>'parseFieldValue.js'
    ];
	
    public function __construct(){
        $this->uid=uniqid();	
        $this->Log=Logger::init();
    }
    public function loadMainJs(){
        $this->loadJs($this->mainJs);
    }
    public function load(){
	$this->Log->log(__METHOD__);
	$this->loadJs($this->js);
	$this->loadView();
    }
    private function loadJs($js=[]){
	$this->Log->log(0,__METHOD__);
	foreach($js as $j){
            echo '<script type="text/javascript" src="'.APP_URL."/js/".$j.'?'.$this->uid.'"></script>';
	}
    }
    private function loadView(){
        $this->Log->log(0,__METHOD__);
	foreach($this->view as $v){
            include DR_PUBLIC."/view/".$v;
	}
    }
    public function setJs($js=[]){
        $this->Log->log(0,__METHOD__);
        $this->js=$js;
    }
    public function setView($v=[]){
        $this->Log->log(0,__METHOD__);
        $this->view=$v;
    }
    public function setMainPerm($perm=''){
        $this->mainPerm=$perm;
    }
    public function setHead(){
        
    }
    public function setBody(){
        
    }
    public function setFooter(){
        
    }
    public function __destruct(){}
}