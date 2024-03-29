<?php
/*
 * 
 * Author: Tomasz Borczynski
 */
abstract class Page{
    private $Log;
    private $mainPerm='LOG_INTO_APP';
    private $view=[];
    private $mainView=[
        //'/Main/Permissions.php',
        //'/Main/PageLink.php'
    ];
    private $js=[];
    private $css=[];
    private $mainCss=[
        'bootstrap.min.4.5.3.css',
        'bootstrap-datepicker.min.css',
        'header.css',
        'font-awesome.min.4.7.0.css',
        'gt-admin.css' // Must by at last on css list, it fixed some bootstrap bugs
    ];
    private $meta=[];
    private $uid='';
    public $err='';
    public $bgColor='';

    private $mainJs=[
        'jquery-3.3.1.min.js',
        'jquery-ui-1.10.1.custom.min.js',
        'popper.min.js',
        'bootstrap-4.5.3.min.js',
        'bootstrap-datepicker.min.js',
        'fontawesome.min.js',
        'Main/createHtmlElement.js',
        'bootstrap-datepicker.pl-PL.min.js',
        'Main/parseFieldValue.js',
        'Main/Error.js'
    ];
    public function __construct(){
        $this->uid=uniqid();	
        $this->Log=Logger::init();
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
    private function loadCss($css){
	$this->Log->log(0,__METHOD__);
	foreach($css as $c){
            echo '<link rel="stylesheet" href="'.APP_URL.'/css/'.$c.'?'.$this->uid.'"/>';
	}
    }
    private function loadView($view){
        foreach($view as $v){
            include DR_PUBLIC."/view/".$v;
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
        $this->loadCss($this->mainCss);
        $this->loadCss($this->css);
        self::loadVariable();
        $this->loadJs($this->mainJs);
        $this->loadJs($this->js);
        echo '</head>';
    }
    private function loadBody(){
        $this->Log->log(0,__METHOD__);
        echo "<body id\"pageBody\">";//style=\"padding-right:17px;padding-left:17px;\">
        self::loadView($this->mainView);
        self::loadView($this->view);
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
    private function loadVariable(){
        echo '<script>'
            .'window.appUrl ="'.APP_URL.'";'
            .'window.router ="'.APP_URL.'/router.php?task=";'
            .'window.perm ='.self::getPerm().';'
            .'</script>';
    }
    private function getPerm(){
        if(array_key_exists('perm', $_SESSION)){
            return json_encode($_SESSION['perm']);
        }
        else{
            return json_encode([]);
        }
    }
    public function __destruct(){}
}