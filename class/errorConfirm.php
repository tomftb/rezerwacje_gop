<?php
class errorConfirm extends logToFile {

    public $error='';
    function __construct()
    {
        parent::__construct();
        //$this->log(0,"[".__METHOD__."]");
    }
    /*##################################################### setError ##########################################*/
    public function setError($errLvl,$data)
    {
        //lvl=0 user error
        //lvl=1 appliaction error
	//lvl=2 critical error       
        $this->log(0,"[ERROR][$errLvl] ".$data);
        $this->parseErrLvl($errLvl,$data);
    }
    private function parseErrLvl($l,$d)
    {
        if ($l===0)
	{
            self::firstError($d);
	}
	else if($l===1)
	{
            $this->error.="[ERROR] Wystąpił błąd aplikacji! Skontaktuj się z Administratorem!";
        }
        else if($l===2)
	{
            $this->error.="[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!";
            die($this->getError());
        }
        else
        {
            $this->log($l,"[ERROR] WRONG ERROR LVL => ".$l);
        }
    }
    /*##################################################### getError ##########################################*/
    public function getError()
    {
        return $this->error;
    }
    public function firstError($d)
    {
        $sep='';
        if($this->error!=='')
        {
            $sep='<br/>';
        }
        $this->error.=$sep.$d;
    }
}
