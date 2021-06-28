<?php

abstract class Page{
    private $Log;
    private $mainPerm='LOG_INTO_PROJ';
    private $view=[];
    private $js=[];
    private $css=[];
    private $meta=[];
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
        $this->loadHead();
	$this->loadBody();
    }
    private function loadJs($js=[]){
	$this->Log->log(0,__METHOD__);
	foreach($js as $j){
            echo '<script type="text/javascript" src="'.APP_URL."/js/".$j.'?'.$this->uid.'"></script>';
	}
    }
    private function loadCss(){
	$this->Log->log(0,__METHOD__);
	foreach($this->css as $c){
            echo '<link rel="stylesheet" href="'.APP_URL.'/css/'.$c.'?'.$this->uid.'"/>';
	}
    }
    private function loadMeta(){
	$this->Log->log(0,__METHOD__);
	foreach($this->meta as $m){
            echo '<meta '.$m.' />';
	}
    }
    private function loadHead(){
        echo '<!DOCTYPE html><html><head>';
        $this->loadMeta();
        echo "<title>".APP_TITLE."</title>";
        $this->loadCss($this->css);
        $this->loadJs($this->js);
        
        echo '</head>';
    }
    private function loadBody(){
        $this->Log->log(0,__METHOD__);
        echo "<body>";
	foreach($this->view as $v){
            include DR_PUBLIC."/view/".$v;
	}
        echo "</body>";
        echo "</html>";
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
    public function setCSS($css=[]){
        $this->Log->log(0,__METHOD__);
        $this->css=$css;
    }
    public function setMeta($meta=[]){
        $this->Log->log(0,__METHOD__);
        $this->meta=$meta;
    }
    public function setTitle(){
        
    }
    public function setBody(){
        
    }
    public function __destruct(){}
}