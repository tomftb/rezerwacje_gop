<?php
/**
 * Description of ManageProjectConsts
 *
 * @author tborczynski
 * MANAGE PROJECT VARIABLE
 */
class ManageProjectVariable extends ManageProjectVariableDatabase{
    private $Utilities;
    //private $Items;
    
    public function __construct(){
        parent::__construct();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
        //$this->Items=;
    }
    public function __destruct(){
        parent::__destruct();
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
        self::getProjectVariablesLike();
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
    public function getProjectVariablesLike(){ 
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        $this->Log->log(0,"[".__METHOD__."] FILTER => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT s.`id` as 'i', s.`name` as 'n',s.`value` as 'v',s.`buffer_user_id` as 'bu',b.`login` as 'bl' FROM `slo_project_stage_variable` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $where='';
        $query_data=[];
        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] FILTER is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $where="WHERE s.`deleted`=:deleted AND s.`hidden`=:hidden AND s.`id` LIKE (s.`id` LIKE :id OR s.`name` LIKE :name) ORDER BY s.`id` ASC";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] FILTER not numeric ");
            $query_data[':value']=array('%'.$f.'%','STR');
            $where="WHERE s.`deleted`=:deleted AND s.`hidden`=:hidden AND (s.`name` LIKE :name OR s.`value` LIKE :value) ORDER BY s.`id` ASC";
        }
        $this->input=null;
        $this->input['u']=$this->Items->setGetWsk('u');
        $this->input['b']=$this->Items->setGetWsk('b');
        $this->input['v']=$this->Items->setGetWsk('v');
        $this->input['buffer']=$this->Items->unsetBlock($this->input['b'],'slo_project_stage_variable','buffer_user_id',$_SESSION['userid']);
        $query_data[':deleted']=array($this->input['u'],'STR');
        $query_data[':hidden']=array($this->input['v'],'STR');
        $query_data[':name']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
 
        $return['data']=parent::getAll($select.$where,$query_data);  
        $return['headTitle']='Stałe';
        // Throw New Exception('['.__METHOD__.']'.__LINE__.' TEST',1);
        
        $this->Utilities->jsonResponse($return,'runModal');
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
        self::getProjectVariablesLike();
    }
    public function pvDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::preapareData();
        parent::changeState('1','deleted','deleted_reason');
        self::block($this->newData['id'],'');
        self::getProjectVariablesLike();
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
}