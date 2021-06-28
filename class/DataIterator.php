<?php
/*
 * Iterator Pattern
 */
class DataIterator implements \Iterator
{
    protected $values = [];

    public function __construct($data=[]){
        self::fill($data);
        $this->rewind();
    }
    public function rewind(){
        reset($this->values);
    }

    public function valid(){
        return false !== $this->current();
    }

    public function next(){
        next($this->values);
    }

    public function current(){
        return current($this->values);
    }
    public function key(){
        return key($this->values);
    }
	public function unFill(){
		$this->values=[];
	}
    public function fill($values){
        /* FIRST CHECK IS RESOURCE */
        self::fillFromResource($values);
        /* SECOND CHECK IS ARRAY */
        self::fillFromArray($values);
        /* THIRD CHECK IS OBJECT */
        self::fillFromObject($values);
		/* FOURTH  CHECK IS DOUBLE */
		self::fillFromDouble($values);
		/* FIFTH  CHECK IS INTEGER */
		self::fillFromInteger($values);
        /* SIXTH CHECK IS STRING */
        self::fillFromString($values);
		/* SEVENTH CHECK IS BOOLEAN */
		self::fillFromBoolean($values);	
    }
    private function fillFromArray($d){
        if(is_array($d)){
            foreach($d as $v){
                $this->values[]=$v;
            } 
        }
    }
    private function fillFromObject($d){
        if(is_object($d)){
            //echo "IS OBJECT\r\n";
            //var_dump(get_object_vars($d));
            foreach(get_object_vars($d) as $v){
                $this->values[]=$v;
            }
        }
    }
    private function fillFromString($d){
        if(is_string($d)){
            for($i=0;$i<mb_strlen($d);$i++){
                $this->values[]=mb_substr($d,$i,1);
            }
        }
    }
    private function fillFromResource($d){
        if(is_resource($d)){
            /* NOT SUPPORTED */
            $this->values[]='';
        }
    }
	private function fillFromBoolean($d){
        if(is_bool($d)){
            $this->values[]=$d;
        }
    }
	private function fillFromInteger($d){
        if(is_integer($d)){
            $this->values[]=$d;
        }
    }
	private function fillFromDouble($d){
        if(is_double($d)){
            $this->values[]=$d;
        }
    }
}