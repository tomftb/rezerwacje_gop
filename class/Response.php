<?php
class Response extends errorConfirm {
    //put your code here
    private $response=array(
        'status'=>0,
        'info'=>'',
        'type'=>'POST',
        'modul'=>'Employee',
        'data'=>array()
    );
    function __construct($m)
    {
        /*
         * m => modul
         */
        parent::__construct();
        $this->response['modul']=$m;
    }
    public function setErrResponse($s='1',$i='',$t='GET')
    {
        $this->log(0,"[".__METHOD__."] ERROR EXIST");
        $this->response['status']=$s;
        $this->response['info']=$i;
        $this->response['type']=$t;   
    }
    public function setResponse($m,$d,$f='cModal',$t='GET')
    {
        if($this->getError()!=='')
        {
            $this->setErrResponse(1,$this->getError(),$t);
        }
        else
        {
            $this->log(0,"[".__METHOD__."] NO ERROR");
            $this->response['data']['task']=self::parseTask($m);
            $this->response['data']['function']=$f;
            $this->response['data']['value']=$d;
            $this->response['type']=$t;
        }
        return $this->response;
    }
    public function getResponse()
    {
        return ($this->response);
    }
    public function setStatus()
    {
        
    }
    public function setType()
    {
        
    }
    private function parseTask($t)
    {
        $tmp=explode('::',$t);
        return ($tmp[1]);        
    }
}
