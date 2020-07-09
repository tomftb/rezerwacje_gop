<?php
class logToFile
{
    protected $filename='';
    private $log=0;
    protected $logName='';

    function __construct()
    {
        self::setLogName();
    }
    public function write($l,$d)
    {
        /*
         * l -> lvl of log
         * d -> data to write
         */
        self::open();
        fwrite($this->filename, "[".date("Y.m.d H:i:s")."] ".$d.PHP_EOL);
    }
    protected function open()
    {
        $this->filename = fopen(self::logName, "a") or die("Unable to open file!");
    }
    protected function getLogLvl()
    {
        return $this->log;
    }
    protected function setLogName()
    {
        $DR=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
        $this->logName=$DR."/log/log-".date("Y-m-d").".php";
    }
    function __destruct()
    {
        fclose($this->filename);
    }
}