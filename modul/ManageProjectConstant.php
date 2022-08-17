<?php
/**
 * Description of ManageProjectConsts
 *
 * @author tborczynski
 * MANAGE PROJECT CONSTS
 */
class ManageProjectConstant extends ManageProjectConstantDatabase{
    private $Utilities;
    
    public function __construct(){
        parent::__construct();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->Utilities=NEW Utilities();
    }
    public function __destruct(){
        parent::__destruct();
    }
    public function getProjectConstantsList(){
        $this->Utilities->jsonResponse(['all'=>parent::getConstants()],'prepareConst');
    }
    public function confirmProjectConstant(){
        $this->inpArray= filter_input_array(INPUT_POST);
        //echo "POST\r\n";
        /* inpArray => ManageProjectConstDatabase() */
        if(!$this->inpArray){
            Throw New Exception('Wprowadź co najmniej jedną stałą.',0); 
        }
        //print_r($this->inpArray);
        array_walk($this->inpArray, array($this,'parseConstant'));

        array_walk($this->newData, array($this,'parseConstantUnique'));
        if($this->error){
           Throw New Exception($this->error,0); 
        }
        //Throw New Exception('['.__METHOD__.'::'.__LINE__.'] TEST STOP',0); 
        
        array_map([$this,'dbManageConstant'],$this->newData);
        
        //Throw New Exception('['.__METHOD__.'::'.__LINE__.'] TEST STOP',0); 
        self::getprojectsconstantslike();
    }
    private function parseConstant(&$value='',$key=''){
        $this->Log->log(0,"[".__METHOD__."]");
        /*
         * REMOVE WHITE CHAR FROM BEGINING AND END OF STRING
         */
        //$value=trim($value);
        //if($value===''){
        //    $this->error.='['.$key.'] Pole nie może być puste<br/>';
        //}
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
        # RETURN ALL NOT DELETED PROJECT FROM DB
    public function getprojectsconstantslike(){ 
        /*FILTER_SANITIZE_STRING => Remove all HTML tags from a string:*/
        //$f="%".filter_input(INPUT_GET,'filter',FILTER_SANITIZE_STRING)."%";
        $f=htmlentities(nl2br(filter_input(INPUT_GET,'filter')), ENT_QUOTES,'UTF-8',FALSE);
        //$f=filter_input(INPUT_GET,'filter');
        //$f='a';
        $this->Log->log(0,"[".__METHOD__."] FILTER => ".$f);
        $this->Log->logMulti(0,filter_input_array(INPUT_GET));
        $select="SELECT s.`id` as 'i', s.`nazwa` as 'n',s.`wartosc` as 'v',s.`buffer_user_id` as 'bu',b.`login` as 'bl' FROM `slo_project_stage_const` s LEFT JOIN `uzytkownik` as b ON s.`buffer_user_id`=b.`id`";
        $where='';
        $query_data=[];
        if(is_numeric($f)){
            $this->Log->log(0,"[".__METHOD__."] FILTER is numeric ");
            $f_int=intval($f,10);
            $query_data[':id']=array($f_int,'INT');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND s.`id` LIKE (s.`id` LIKE :id OR s.`nazwa` LIKE :nazwa) ORDER BY s.`id` ASC";
        }
        else{
            $this->Log->log(0,"[".__METHOD__."] FILTER not numeric ");
            $query_data[':wartosc']=array('%'.$f.'%','STR');
            $where="WHERE s.`wsk_u`=:wsk_u AND s.`wsk_v`=:wsk_v AND (s.`nazwa` LIKE :nazwa OR s.`wartosc` LIKE :wartosc) ORDER BY s.`id` ASC";
        }
        $this->inpArray['u']=$this->Items->setGetWsk('u');
        $this->inpArray['b']=$this->Items->setGetWsk('b');
        $this->inpArray['v']=$this->Items->setGetWsk('v');
        $this->inpArray['wskb']=$this->Items->unsetBlock($this->inpArray['b'],'slo_project_stage_const','buffer_user_id',$_SESSION['userid']);
        $query_data[':wsk_u']=array($this->inpArray['u'],'STR');
        $query_data[':wsk_v']=array($this->inpArray['v'],'STR');
        $query_data[':nazwa']=array('%'.$f.'%','STR');
        
        /* 
         * TO DO => SEARCH IN VALUE (LEFT JOIN)
           $query_data[':value']=array('%'.$f.'%','STR');
         * 
         */
 
        $return['data']=parent::getConstantsLike($select.$where,$query_data);  
        $return['headTitle']='Stałe';
        // Throw New Exception('['.__METHOD__.']'.__LINE__.' TEST',1);
        $this->Utilities->jsonResponse($return,'runModal');
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
        self::getprojectsconstantslike();
    }
    public function pcDelete(){
        $this->Log->log(0,"[".__METHOD__."]");
        $this->newData=$this->Items->setPostId();
        $this->newData['reason']=$this->Items->setReason($this->newData);
        $this->newData['wskb']= $this->Items->getBufferUserId($this->newData['id'],'slo_project_stage_const','buffer_user_id');
        $this->Items->checkBlock($this->newData['wskb']['bu'],$this->newData['wskb']['bl'],$_SESSION['userid']);
        parent::deleteConstant();
        self::block($this->newData['id'],'');
        self::getprojectsconstantslike();
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