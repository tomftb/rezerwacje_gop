<?php
/**
 * Description of ManageProjectConsts
 *
 * @author tborczynski
 * MANAGE PROJECT CONSTS
 */
class ManageProjectConstant extends ManageProjectConstantDatabase{
    private $Utilities;
    private $filter=array('getProjectConstants','getProjectDeletedConstants','getProjectHiddenConstants','getProjectHiddenAndDeletedConstants','getProjectAllConstants');
    public function __construct(){
        parent::__construct();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
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
    public function getProjectConstantsList(){
        $this->Utilities->jsonResponse(['all'=>parent::getConstants()],'prepareConst');
    }
    public function confirmProjectConstant(){
        $this->inpArray= filter_input_array(INPUT_POST);
        /* inpArray => ManageProjectConstDatabase() */
        if(!$this->inpArray){
            Throw New Exception('Wprowadź co najmniej jedną stałą.',0); 
        }
        array_walk($this->inpArray, array($this,'parseConstant'));
        array_walk($this->newData, array($this,'parseConstantUnique'));
        if($this->error){
           Throw New Exception($this->error,0); 
        }
        array_map([$this,'dbManageConstant'],$this->newData);
        self::runFilter();
    }
    private function parseConstant(&$value='',$key=''){
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * REMOVE WHITE CHAR FROM BEGINING AND END OF STRING
         */
         /*
         * EXPLODE KEY VIA CHAR `-`
         */
        $tmpKey=explode('-',$key);
        switch($tmpKey[0]){
            case 'nazwa':
                if(!preg_match("/^[a-zA-Z]([a-zA-Z]|\d){2,29}$/",$value)){
                    $this->error.='['.$key.'] Pole zawiera niedozwolone znaki,nie spełnia wymagań co do ilości znaków lub konstrukcji.<br/>';
                }
                $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            case 'wartosc':
                if(!preg_match("/^.{1,1024}$/",$value)){
                    $this->error.='['.$key.'] Pole zawiera niedozwolone znaki,nie spełnia wymagań co do ilości znaków lub konstrukcji.<br/>';
                }
                $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            case 'id':
                    $this->Log->log(0,"[".__METHOD__."] ID => ".$value);
                    $this->newData[$tmpKey[1]][$tmpKey[0]]=$value;
                break;
            /* BLOCK ID - > the same like id... */
            case 'b':
                break;
            /* FILTER -> Filter function to execute, f - input search value */
            case 'f':
            case 'filter':
                break;
            default:
                Throw New Exception('['.__METHOD__.'] UNAVAILABLE KEY -> '.$key,1);
            break;
        }
    }
    private function parseConstantUnique(&$value='',$key=''){
        $this->Log->log(0,"[".__METHOD__."]\r\nKEY => ".$key);
        $this->Log->logMulti(0,$value);
        if(!array_key_exists('id', $value)){
            Throw New Exception('['.__METHOD__.'] KEY `id` NOT EXIST IN POST CONST DATA',1); 
        }
        $value['nazwa']=mb_strtoupper($value['nazwa']);
        $value['id']=intval($value['id'],10);
        /* PARSE CONST UNIQUE */
        parent::checkConstantUnique($key,$value['nazwa'],'nazwa',$value['id']);
        parent::checkConstantUnique($key,$value['wartosc'],'wartosc',$value['id']);
    }
    public function getProjectConstants(){ 
        self::returnConstants(self::getSelectedConstants("s.`wsk_v`='0' AND s.`wsk_u`='0' AND s.`id`>0 AND (s.`id`=:id OR s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f) ORDER BY s.`id` ASC"));
    } 
    public function getProjectDeletedConstants(){ 
        self::returnConstants(self::getSelectedConstants("s.`wsk_v`='0' AND s.`wsk_u`='1' AND s.`id`>0 AND (s.`id`=:id OR s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectHiddenConstants(){ 
        self::returnConstants(self::getSelectedConstants("s.`wsk_v`='1' AND s.`wsk_u`='0' AND s.`id`>0 AND (s.`id`=:id OR s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectHiddenAndDeletedConstants(){ 
        self::returnConstants(self::getSelectedConstants("(s.`wsk_v`='1' OR s.`wsk_u`='1') AND s.`id`>0 AND (s.`id`=:id OR s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f) ORDER BY s.`id` ASC"));
    }
    public function getProjectAllConstants(){ 
        self::returnConstants(self::getSelectedConstants("s.`id`>0 AND (s.`id`=:id OR s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f)  ORDER BY s.`id` ASC"));
    }
    private function getSelectedConstants($SQL="s.`id`>0 AND (s.`nazwa` LIKE :f OR s.`wartosc` LIKE :f) ORDER BY s.`id` ASC"){
        $this->Log->log(0,"[".__METHOD__."]");
        $POST=filter_input_array(INPUT_POST);
        $this->Log->log(0,$POST);
        $f=htmlentities(nl2br($POST['f']), ENT_QUOTES,'UTF-8',FALSE);
        $parm[':f']=['%'.$f.'%','STR'];
        /* reurn 0 when is a char/string, else return number */
        $parm[':id']=array(intval($f,10),'INT');       
        $this->Log->log(0,$SQL);
        $this->Log->log(0,$parm);
        $this->Items->unsetBlock($POST['b'],'slo_project_stage_const','buffer_user_id',$_SESSION['userid']);
        $select="SELECT s.`id` as 'i', s.`nazwa` as 'n',s.`wartosc` as 'v',s.`buffer_user_id` as 'bu',b.`login` as 'bl' FROM `slo_project_stage_const` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $response['data']=parent::getConstantsLike($select." WHERE ".$SQL,$parm);
        $response['headTitle']='Stałe';
        return $response;
    }
    private function returnConstants($response){
        return $this->Utilities->jsonResponse($response,'');
    }
    public function getProjectConstantHideSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=[
            'id'=>filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT)
        ];
        $this->newData['const']=parent::getConstantData($this->newData['id']);
        $this->Items->checkBlock($this->newData['const']['bu'],$this->newData['const']['bl'],$_SESSION['userid']);
        self::block($this->newData['id'],$_SESSION['userid']);
        $this->newData['slo']=$this->Items->getSlo('pcHide');
        $this->Utilities->jsonResponse($this->newData,'pcHide');  
    }
    public function getProjectConstantDelSlo(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=[
            'id'=>filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT)
        ];
        $this->newData['const']=parent::getConstantData($this->newData['id']);
        $this->Items->checkBlock($this->newData['const']['bu'],$this->newData['const']['bl'],$_SESSION['userid']);
        self::block($this->newData['id']);
        $this->newData['slo']=$this->Items->getSlo('pcDelete');
        $this->Utilities->jsonResponse($this->newData,'pcDelete');  
    }
    public function getProjectConstantDetails(){
        $this->Log->log(0,"[".__METHOD__."]");       
        $this->Utilities->jsonResponse(['const'=>parent::getConstantData(filter_input(INPUT_GET,'id',FILTER_VALIDATE_INT))],'pcDetails');
    }
    public function pcDetails(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities->jsonResponse([],'cModal');
    }
    public function pcHide(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason($this->newData);
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'slo_project_stage_const','buffer_user_id');
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        parent::hideConstant();
        self::block($this->newData['id'],$_SESSION['userid']);
        self::runFilter();
    }
    public function pcDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason($this->newData);
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'slo_project_stage_const','buffer_user_id');
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        parent::deleteConstant();
        self::block($this->newData['id'],'');
        self::runFilter();
    }
    public function blockConstant(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=array();
        //$this->newData=$this->Items->setPostId();
        $this->Utilities->setGet('id',$this->newData);
        /* CHECK FOR ACT BLOCK STATUS */
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'slo_project_stage_const','buffer_user_id');
        $this->Log->logMulti(0,$this->newData);   
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        self::block($this->newData['id'],$_SESSION['userid']);
        $this->Utilities->jsonResponse('','');
    }
    private function block($id=0,$user=''){
         $this->Items->setBlock($id,"slo_project_stage_const","buffer_user_id",$user);
    }
}