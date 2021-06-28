<?php
class Response {
    //put your code here
    private $response=array(
        'status'=>0,
        'info'=>'',
        'type'=>'POST',
        'modul'=>'Employee',
        'data'=>array()
    );
    private $Log;
    private $Error;
    function __construct($m)
    {
        /*
         * m => modul
         */
        $this->Log=Logger::init(__METHOD__);
        $this->Error=New ErrorHandler();
        $this->Log->log(0,"[".__METHOD__."]");
        $this->response['modul']=$m;
    }
    public function setErrResponse($i='',$t='GET')
    {
        $this->Log->log(0,"[".__METHOD__."] ERROR EXIST");
        $this->response['status']=1;
        $this->response['info']=$i;
        $this->response['type']=$t;   
    }
    public function setResponse($m,$d,$f='cModal',$t='GET')
    {
        if($this->Error->getError()!=='')
        {
            $this->setErrResponse($this->Error->getError(),$t);
        }
        else
        {
            $this->Log->log(0,"[".__METHOD__."] NO ERROR");
            $this->response['data']['task']=self::parseTask($m);
            $this->response['data']['function']=$f;
            $this->response['data']['value']=$d;
            $this->response['type']=$t;
        }
        return $this->response;
    }
    public function getErrResponse($i='',$t='GET')
    {
        $this->Log->log(0,"[".__METHOD__."] ERROR EXIST:");
        $this->Log->log(0,$i);
        $this->response['status']=1;
        $this->response['info']='[ERROR] Wystąpił błąd aplikacji! Skontaktuj się z Administratorem!';
        $this->response['type']=$t;   
        return $this->response;
    }
    public function getResponse()
    {
        return ($this->response);
    }
    public function setError($d='',$l=0){
        $this->Error->setError($d,$l);
    }
    public function getError(){
        $this->Error->getError();
    }
    public function setStatus()
    {
        
    }
    public function setType($type='GET')
    {
        $this->response['type']=$type;
    }
    private function parseTask($t)
    {
        $tmp=explode('::',$t);
        return ($tmp[1]);        
    }
}
