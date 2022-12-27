<?php
/**
 * Description of ManageProjectConsts
 *
 * @author tborczynski
 * MANAGE PROJECT VARIABLE
 */
class ManageProjectVariable extends ManageProjectVariableDatabase{
    private $Utilities;
    private $filter=array('getProjectVariables','getProjectHiddenVariables','getProjectDeletedVariables','getProjectHiddenAndDeletedVariables','getProjectAllVariables');
    const OPEN='[';
    const CLOSE=']';
    
    public function __construct(){
        parent::__construct();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
        //$this->Items=;
    }
    public function __destruct(){
        parent::__destruct();
    }
    private function runFilter(){
        $this->Log->log(0,"[".__METHOD__."]");
        $f=filter_input(INPUT_POST,'filter');
        if(in_array($f,$this->filter)){
            self::{$f}();
        }
        else{
            self::{$this->filter[0]}();
        }
    }
    public function getProjectVariablesList(){
        $this->Utilities->jsonResponse(['all'=>parent::getVariables()],'prepareVariable');
    }
    public function confirmProjectVariable(){
        $data=trim(filter_input(INPUT_POST,'data'));
        if($data===''){
             Throw New Exception('Brak data input post!',1); 
        }
        $this->input=json_decode($data);
        if(!is_object($this->input)){
            Throw New Exception ('POST DATA IS NOT A OBJECT',1);
        }
        if(count(get_object_vars($this->input))===0){
            Throw New Exception('Wprowadź co najmniej jedną zmienną.',0); 
        }
        self::parseVariable();
        array_walk($this->input,['parent','manageVariable']);
        self::runFilter();
    }
    private function parse(&$error,&$first,$key='name-0',$value='',$preg='',$type='string'){
        if(!preg_match($preg,$value)){
            $error.=$first.'['.$key.'] Pole zawiera niedozwolone znaki,nie spełnia wymagań co do ilości znaków lub konstrukcji.';
            $first='<br/>';
        }
        if(gettype($value)!==$type){
            $error.=$first.'['.$key.'] Błąd identyfikatora.';
        }
    }
    private function parseVariable(){
        $this->Log->log(0,"[".__METHOD__."]");
        $error='';
        $first='';
        $this->Log->log(0,$this->input);
        foreach($this->input as $k =>$v){        
            self::parse($error,$first,'name-'.$k,$v->name,"/^[a-zA-Z]([a-zA-Z]|\d){2,30}$/",'string');    
            self::parse($error,$first,'value-'.$k,$v->value,"/^.{1,4096}$/",'string');
            self::parse($error,$first,'id-'.$k,$v->id,"/^\d*$/",'integer');
            parent::checkUnique($error,$first,'name-'.$k,mb_strtoupper($v->name),'name',$v->id);
            parent::checkUnique($error,$first,'value-'.$k,$v->value,'value',$v->id);
            $first='<br/>';
        }
        if($error!==''){
            Throw New Exception($error,0);
        }
    }
    # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getProjectVariablesSimpleList(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities->jsonResponse(parent::getSimpleAll());
    }
    public function getProjectVariables(){ 
        self::returnVariables(self::getSelectedVariables("s.`hidden`='0' AND s.`deleted`='0' AND s.`id`>0 AND (s.`id`=:id OR s.`name` LIKE :f OR s.`value` LIKE :f) ORDER BY s.`id` ASC"));
    } 
    public function getProjectDeletedVariables(){ 
        self::returnVariables(self::getSelectedVariables("s.`hidden`='0' AND s.`deleted`='1' AND s.`id`>0 AND (s.`id`=:id OR s.`name` LIKE :f OR s.`value` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectHiddenVariables(){ 
        self::returnVariables(self::getSelectedVariables("s.`hidden`='1' AND s.`deleted`='0' AND s.`id`>0 AND (s.`id`=:id OR s.`name` LIKE :f OR s.`value` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectHiddenAndDeletedVariables(){ 
        self::returnVariables(self::getSelectedVariables("(s.`hidden`='1' OR s.`deleted`='1') AND s.`id`>0 AND (s.`id`=:id OR s.`name` LIKE :f OR s.`value` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectAllVariables(){ 
        self::returnVariables(self::getSelectedVariables("s.`id`>0 AND (s.`id`=:id OR s.`name` LIKE :f OR s.`value` LIKE :f)  ORDER BY s.`id` ASC"));
    }
    private function getSelectedVariables($SQL="s.`id`>0 AND (s.`name` LIKE :f OR s.`value` LIKE :f) ORDER BY s.`id` ASC"){
        $this->Log->log(0,"[".__METHOD__."]");
        $POST=filter_input_array(INPUT_POST);
        $this->Log->log(0,$POST);
        $f=htmlentities(nl2br($POST['f']), ENT_QUOTES,'UTF-8',FALSE);
        $parm[':f']=['%'.$f.'%','STR'];
        /* reurn 0 when is a char/string, else return number */
        $parm[':id']=array(intval($f,10),'INT');       
        $this->Log->log(0,$SQL);
        $this->Log->log(0,$parm);
        $this->Items->unsetBlock($POST['b'],'slo_project_stage_variable','buffer_user_id',$_SESSION['userid']);
        $select="SELECT s.`id` as 'i', s.`name` as 'n',s.`value` as 'v',s.`buffer_user_id` as 'bu',b.`login` as 'bl' FROM `slo_project_stage_variable` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $response['data']=parent::getAll($select." WHERE ".$SQL,$parm);
        $response['headTitle']='Stałe';
        return $response;
    }
    private function returnVariables($response){
        return $this->Utilities->jsonResponse($response,'');
    }
     public function getProjectVariableHideSlo(){
        self::getSlo('pvHide');
    }
    public function getProjectVariableDelSlo(){
         self::getSlo('pvDelete');
    }
    private function getSlo($slo='pvHide'){
        $this->Log->log(0,"[".__METHOD__."]");
        $data=self::getVariable();
        $this->Items->checkBlock($data['variable']['bu'],$data['variable']['bl'],$_SESSION['userid']);
        self::block($data['variable']['i']);
        $data['slo']=$this->Items->getSlo($slo);
        $this->Utilities->jsonResponse($data,$slo); 
    }
    public function getProjectVariableDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities->jsonResponse(self::getVariable(),'');
    }
    private function getVariable(){
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $data['variable']=parent::getVariableData($id);
        $data['variable']['i']=$id;
        return $data;
    }
    public function pvDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities->jsonResponse([],'cModal');
    }
    private function preaparedata(){
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason($this->newData);
        $this->newData['buffer']= $this->Items->getBufferUserId($this->newData['id'],'slo_project_stage_variable','buffer_user_id');
        $this->Items->checkBlock($this->newData['buffer']['bu'],$this->newData['buffer']['bl'],$_SESSION['userid']);
    }
    public function pvHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::preapareData();
        parent::changeState('1','hidden','hidden_reason');
        self::block($this->newData['id'],$_SESSION['userid']);
        self::runFilter();
    }
    public function pvDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::preapareData();
        parent::changeState('1','deleted','deleted_reason');
        self::block($this->newData['id'],'');
        self::runFilter();
    }
    public function blockVariable(){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Utilities->setGet('id',$this->newData);
        $id=filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT);
        $this->Log->log(0,$id);
        /* CHECK FOR ACT BLOCK STATUS */
        $buffer= $this->Items->getBufferUserId($id,'slo_project_stage_variable','buffer_user_id');
        $this->Log->log(0,$buffer);
        $this->Items->checkBlock($buffer['bu'],$buffer['bl'],$_SESSION['userid']);
        self::block($id,$_SESSION['userid']);
        $this->Utilities->jsonResponse('','');
    }
    private function block($id=0,$user=''){
         $this->Items->setBlock($id,"slo_project_stage_variable","buffer_user_id",$user);
    }
    private function swapVariablePropertyWithValue(&$value='',$variable=[]){
        $this->Log->log(2,"[".__METHOD__."]");
        if(count($variable)===0){
            return false;
        }
        $newValue='';
        $open=false;
        $tmpVariable='';
        //echo $value;
        //print_r($variable);
        for($i = 0; $i<strlen($value);$i++){
                 $char = substr($value,$i, 1);
                //console.log(char);
                if($char===self::OPEN){
                    $open=true;     
                    $newValue.=$char;
                    /*SKIP NEXT CHECK*/
                    continue;
                }
                /*IN FUTER SKIP WHITE SPACES */
                if($open===true && $char!==self::CLOSE){
                    $tmpVariable.=$char;
                    /*SKIP NEXT CHECK*/
                    continue;
                }
                if($char===self::CLOSE && $open===true && $tmpVariable!==''){
                    self::swapProperty($newValue,$tmpVariable,$variable);
                    $tmpVariable='';
                    $open=false; 
                    /* skip */
                    continue;
                }
                $newValue.=$char;
            }
            $value=$newValue;
            //echo "new value = ".$newValue."\r\n";
        return true;
    }
    private function swapProperty(&$newValue='',$tmpVariable='',&$variable=[]){
         $this->Log->log(0,"[".__METHOD__."]");
        //echo "tmp value:\r\n";
        //echo $newValue."\r\n";
        //echo "tmp variable:\r\n";
       // echo $tmpVariable."\r\n";
        $tmpVariableList=[];
        $found=false;
        foreach($variable as $v){
            //echo "act variable:\r\n";
            //print_r($v);
            if($v->name===$tmpVariable){
                //echo "found variable name \r\n";
                //echo $tmpVariable."\r\n";
                if($v->type==='zmienna'){
                    //echo " -- zmienna -- \r\n";
                    /* cut last [ char ];*/
                    $newValue=substr($newValue,0,-1);
                    $newValue.=$v->value;
                    //echo "NEW VALUE:\r\n";
                   // echo $newValue."\r\n";
                     $found=true;
                    //$newValue=$v->value;
                }
                /* SKIP */
                continue;
            }
            //echo "set new variable list array\r\n";
            array_push($tmpVariableList,$v);
        }
        /* IF NOT FOUND OR IS A VARIABLE TEXT */
        if(!$found){
            $newValue.=$tmpVariable.']';
        }
        //echo "ACT TMP VARIABLE LIST:\r\n";
       // print_r($tmpVariableList);
        $variable=$tmpVariableList;
        return false;
    }
    public function parsePartVariable(&$part){
        $this->Log->log(2,"[".__METHOD__."]");
        foreach($part->section as $s){
            foreach($s->subsection as $su){
                foreach($su->subsectionrow as $r){
                    self::swapVariablePropertyWithValue($r->paragraph->property->value,$r->paragraph->variable);
                }
            }
        }
    }
}