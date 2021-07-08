<?php
class PagePagin
{
    private $recOnPage=0;
    private $pages=0;
    private $mainPage='';
    private $tableRows=0;
    private $noPage=false;
    private $IDS=0;
    private $pageStart=0;
    private $pageEnd=0;
    private $link='';
    private $log='';
    private $class=array('actPage'=>'','avaPage'=>'');
    private $hr='';
    private $form=array(
                        '<FORM name="" TYPE="POST">',
                        '</FORM>'
        );
    
    public function __construct()
    {
    }
    public function setPage($PAGE)
    {
        $this->log.="[".__METHOD__."] PAGE => ".$PAGE."\r\n";
        $this->mainPage=$PAGE;
        self::checkRecords();
        self::countPages();
        self::generateLink();
    }
    private function setForm($input,$pageNr)
    {
        
    }
    public function setInput()
    {
        
    }
    private function checkRecords()
    {
        $this->log.="[".__METHOD__."] TABLE RECORDS => ".$this->tableRows."\r\n";
        $this->log.="[".__METHOD__."] RECORDS ON PAGE => ".$this->recOnPage."\r\n";
        /*
         * tableRows===recOnPage NO PAGE
         */
        if($this->tableRows===$this->recOnPage)
        {
            $this->log.="[".__METHOD__."] TABLE RECORDS AND RECORDS ON PAGE = 0 OR ARE EQUAL SETUP NO PAGE\r\n";
            $this->noPage=true;
            return '';
        }
        if($this->tableRows!==0 && $this->recOnPage===0)
        {
            $this->log.="[".__METHOD__."] TABLE RECORDS > 0 AND RECORDS ON PAGE = 0 SETUP REC ON PAGE = TABLE ROWS\r\n";
            $this->noPage=true;
            $this->recOnPage=$this->tableRows;
            return '';
        }
        if($this->recOnPage > $this->tableRows)
        {
            $this->log.="[".__METHOD__."] NO PAGES, TABLE RECORDS ARE LOWER THAN PAGE COUNT\r\n";
            $this->noPage=true;
        }
    }
    public function setRecOnPage($rec)
    {
        $this->recOnPage=intval($rec);
        $this->log.="[".__METHOD__."] RECORDS ON PAGE => ".$rec."\r\n";
    }
    public function setDbRec($dbRec)
    {
        $this->tableRows=intval($dbRec,10);
        $this->log.="[".__METHOD__."] TABLE ROWS => ".$this->tableRows."\r\n";
    }
    private function countPages()
    {
        if($this->noPage) {return'';}
        //if($this->tableRows===0) {$this->tableRows=1;}
        $this->pages=ceil($this->tableRows/$this->recOnPage);
        $this->log.="[".__METHOD__."] PAGES CEIL() => ".$this->pages."\r\n";  
    }
    private function generateLink()
    {
        if($this->noPage) {return'';}
        /*
         * CHECK IDS
         */
        self::checkIDS();
        $this->log.="[".__METHOD__."]\r\n";   
        $j=1;
        $this->link='<p '.$this->class['avaPage'].'> Str. - ';
        
        for($i=0;$i<$this->pages;$i++)
        {
            $this->link.='<a style="margin-left:1px;margin-right:1px;" href="'.$this->mainPage.'&IDS='.$j.'">'.self::setActPage($j).'</a>';
            $j++;
        }
        $this->link.='</p>';
        $this->log.="[".__METHOD__."] LINK => ".$this->link."\r\n";   
    }
    public function getPostPageLink()
    {
        
    }
    public function getPageLink($hrPosition)
    {
        $this->log.="[".__METHOD__."]\r\n"; 
        if($this->noPage) {return'';}
        return  self::setHRposition($hrPosition);
    }
    private function setHRposition($hrPosition)
    {

        $hrLink=$this->link.$this->hr;
        if($hrPosition!=='s')
        {
            $hrLink=$this->hr.$this->link;
        }
        return $hrLink;
    }
    private function setActPage($j)
    {
        if($this->IDS===$j || ($this->IDS===0 && $j===1))
        {
            return('<span '.$this->class['actPage'].'>'.$j.'</span>');
        }
        return $j;
    }
    private function checkIDS()
    {
        $this->IDS=intval(filter_input(INPUT_GET,'IDS'),10);
        $this->log.="[".__METHOD__."] CURRENT IDS => ".$this->IDS."\r\n";
    }
    public function getStartLimit()
    {
        if($this->noPage)
        {
            /* return 0 */
        }
        if($this->IDS>0)
        {
            $this->pageStart=($this->recOnPage*($this->IDS-1));
            //$this->pageStart=($this->recOnPage*($this->IDS)-$this->recOnPage);
        }
        $this->log.="[".__METHOD__."] RETURN => ".$this->pageStart."\r\n";
        return $this->pageStart;
    }
    public function getEndLimit()
    {
        if($this->noPage)
        {
            /* return table rows */
            $this->pageEnd=$this->tableRows;
        }
        if($this->IDS>=0)
        {
            $this->pageEnd=$this->recOnPage;  
        }
        $this->log.="[".__METHOD__."] RETURN => ".$this->pageEnd."\r\n";
        return $this->pageEnd;
    }
    public function getIDS()
    {
        return $this->IDS;
    }
    public function getLog()
    {
        return $this->log;
    }
    public function setActPageClass($c='')
    {
        $this->log.="[".__METHOD__."] ".$c."\r\n";
        $this->class['actPage']=$c;
    }
    public function setAvaPageClass($c='')
    {
        $this->log.="[".__METHOD__."] ".$c."\r\n";
        $this->class['avaPage']=$c;
    }
    public function setHr($on=false,$class='')
    {
        if($on)
        {
            $this->hr='<hr '.$class.'></hr>';
        }
    }
    public function __destruct()
    {
        
    }
}
