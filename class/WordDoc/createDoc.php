<?php
namespace WordDoc;

final class createDoc extends createDocAbstract {
    private $phpWorld;
    private $fileName='default.docx';
    private $projectData=array();
    private $mainSection;
    private $files=[];
    private $ActFontStyle=array();
    private $paragraphStyle=array();
    private $styleStack=array();
    private $textRun;
    private $Chapter;
    /*
     * VARIABLE DETERMINATES ADD NEW SECTION FOR EACH ELEMENT LINK TITIE, TEXTAREA...
     * false - the same section
     * true - new section
     */
    private $newSection=true;
    /*
     * VARAIBLE DETERMINATES NEW PAGE
     */
    private $newPage=false;
    private $FontStyle=[];
    private $ParagraphStyle=[];
    private $docDir='';
    
    function __construct($projectDetails,$files,$fileName,$ext='',$dir='',$Log){
        parent::construct__($Log);
        $this->Log->log(0,"[".__METHOD__."] FILENAME => ".$fileName);
        $this->Log->log(0,"[".__METHOD__."] EXTENSION => ".$ext);
        /*
         * SETUP DOCUMENT DATA
         */
        $this->projectData=$projectDetails;
        $this->fileName=uniqid($fileName."_").$ext;
        $this->files=$files;
        $this->docDir=$dir;
        /*
         *  Creating the new document...
         */
        require_once APP_ROOT.'/bootstrap.php';
        $settings=new \PhpOffice\PhpWord\Settings();
        $settings::setOutputEscapingEnabled(true);
        $this->phpWord = new \PhpOffice\PhpWord\PhpWord();
        $this->Chapter=new createDocChapter($Log,$this->phpWord,$this);
        
        /*
         * IMPORTANT
         * NO PAGE BACKGROUND COLOR
         */
        //print_r($this->phpWord);
        self::setDocInfo();
        self::setLanguage();
    }
    public function __call($name='',$arg=array()){
        Throw New \Exception("[".__METHOD__.'] Method '.$name.' not found!',1);//Something went wrong! Contact with administrator! Application error occurred! Contact with Administrator!
    }
    private function setDocInfo(){
        $this->Log->log(0,'['.__METHOD__.']');
        //$this->Log->log(0,$_SESSION);
        $properties = $this->phpWord ->getDocInfo();   
        $properties->setCreator($_SESSION['nazwiskoImie']);        
        $properties->setCompany('Geofizyka Toruń S.A.');
        $properties->setTitle('Testowy Etap projektu');
        $properties->setDescription('TEST OPIS');
        $properties->setCategory('TEST KATEGORIA');
        $properties->setLastModifiedBy('OSTATNIA MODYFIKACJA przez ...');
        $properties->setCreated(mktime(0, 0, 0, 3, 12, 2022));
        $properties->setModified(mktime(0, 0, 0, 3, 14, 2022));
        $properties->setSubject('TEMAT DOKUMENTU');
        $properties->setKeywords('SŁOWA KLUCZOWE');
        /*
            $phpWord->getSettings()->setHideGrammaticalErrors(true);
            $phpWord->getSettings()->setHideSpellingErrors(true);
        */
    }
    private function setLanguage(){
        $this->phpWord->getSettings()->setThemeFontLang(new \PhpOffice\PhpWord\Style\Language('PL_PL'));//\PhpOffice\PhpWord\Style\Language::FR_BE francuski belgijski
    }
    public function genProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]");
        //var_dump($this->projectData);
        try{
            self::setReportStagePage();
            $section=$this->phpWord->addSection();
            self::loopStagePart($this->projectData->heading,'addHeader',$section);
            self::loopStagePart($this->projectData->footer,'addFooter',$section);
            /* only first secton true on a;; stage report*/
            $propertyRun=self::getStageStartingProperty();
            /* CHAPTER */
            foreach($this->projectData->stage as $s){
                  $this->Chapter->setReportStageChapterList($s->section);
            }
            $this->Chapter->pageBreak();
            foreach($this->projectData->stage as $s){
                    //var_dump($s);
               
                self::setReportStageSection($s->section,$propertyRun);
            }
            $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
            $objWriter->save($this->docDir.$this->fileName); 
        }
        catch(Exception $e){
            throw new Exception($e, 1);//->getMessage()
        }
    }
    private function loopStagePart($data,$execute,&$section){
        $this->Log->log(0,"[".__METHOD__."] ".$execute);
        foreach($data as $d){
            self::setReportPart($d->section,$execute,'default',$section);
            /* LOOP ONLY ONE */
            return;
         }
    }
     public function genReportStageFooter(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setReportStagePage();
        $section=$this->phpWord->addSection();
        self::setReportPart($this->projectData->section,'addFooter','firstPage',$section);
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
        $objWriter->save($this->docDir.$this->fileName);
    }
     public function genReportStageHeading(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setReportStagePage();
        $section=$this->phpWord->addSection();
        self::setReportPart($this->projectData->section,'addHeader','firstPage',$section);
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord, 'Word2007');
        $objWriter->save($this->docDir.$this->fileName);
    }
    public function genReportStage(){
        $this->Log->log(0,"[".__METHOD__."]");
        self::setReportStagePage();
        $this->Chapter->setReportStageChapterList($this->projectData->section);
        $this->Chapter->pageBreak();
        /* FIRST SECTION ALWAYS FROM NEW PAGE IN STAGE */
        $propertyRun=self::getStageStartingProperty();
        self::setReportStageSection($this->projectData->section,$propertyRun);
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord,'Word2007');
        $objWriter->save($this->docDir.$this->fileName);
    }
    private function getStageStartingProperty(){
        $this->Log->log(0,"[".__METHOD__."]");
        return [
            'firstSection'=>true,
            'breakType'=>'continuous',
            'run'=>null,
            'actListName'=>uniqid('list_'),
            'actTabStopName'=>uniqid('tabstop_')
        ];
    }
    private function setReportStagePage(){
        $this->Log->log(0,"[".__METHOD__."]");
        /* TO DO */
        unset($this->projectData->style);
        unset($this->projectData->property);
    }
    private function setReportPart($Stagesection,$method='addFooter',$type='default',&$section){
        $this->Log->log(0,"[".__METHOD__."] ".$method);
        //$this->Log->log(0,$Stagesection);
        /* MULTIPLE COLUMN (SECTION) IS NOT ACCEPTABLE */
        $propertyRun=[
            'firstRow'=>'1',
            'run'=>null,
            'actListName'=>uniqid('list_'),
            'actTabStopName'=>uniqid('list_')
        ];
        foreach($Stagesection as $s){
            $part = $section->{$method}();
            /* 
                Footer::AUTO default, all pages except if overridden by first or even
                Footer::FIRST each first page of the section
                Footer::EVEN each even page of the section. Will only be applied if the evenAndOddHeaders is set to true in phpWord->settings
             */
            //$part->resetType();
            $part->setType($type);
            //$part->firstPage();
            //$part->evenPage();
            //evenPage Auto - default - odd pages
            foreach($s->subsection as $u){
                foreach($u->subsectionrow as $r){
                     $this->{'newLine'.$r->paragraph->property->valuenewline}($r,$propertyRun,$part);
                }
                $propertyRun['firstRow']=$r->paragraph->property->valuenewline;
            }
        }
    }
    private function setReportStageSection($Stagesection,&$propertyRun=[]){
        $this->Log->log(0,"[".__METHOD__."]");        
        foreach($Stagesection as $s){
            self::setBreakType($s->property->valuenewline,$propertyRun['firstSection'],$propertyRun['breakType']);
            $section = self::setSectionColumn($s->subsection,$propertyRun['breakType']);
            /* COLUMNS */
            foreach($s->subsection as $u){
                self::setSubSectionProperty($u);
                self::setReportStageRow($u,$section,$propertyRun);
            }
            /* AT THE END ADD FAKE section if no more left */
            $propertyRun['firstSection']=false;
        }
    }
    private function setBreakType($valuenewline='1',$firstSection=false,&$breakType='continuous'){
         /* CHECK FOR NEW PAGE */
        if($valuenewline==='1' && $firstSection===false){
                $breakType='newPage';
            }
    }
    private function setSubSectionProperty($u){
        $this->Log->log(0,'['.__METHOD__.']');
        /* TO DO */
        //print_r($u->style);
        //print_r($u->property);
        //print_r($u->subsectionrow);
    }
    private function setReportStageRow($subsection,$section,&$propertyRun){
        $this->Log->log(0,'['.__METHOD__.'] START');
        /* FIRST ROW ALWAYS START FROM NEW LINE */
        $firstRow='1';
        parent::setUpMaxFontSize($subsection->subsectionrow);
        foreach($subsection->subsectionrow as $r){
            $this->Log->log(0,'['.__METHOD__.'] ROW');
            /* DYNAMIC RUN FUNCTION, newLine1 newLine0 (RUN VIA NEW LINE 1,0) */
            self::{'newLine'.$r->paragraph->property->valuenewline}($r,$propertyRun,$section);
            array_walk($r->image,['self','setRunImage'],$propertyRun['run']);
            $firstRow=$r->paragraph->property->valuenewline;
        }
    }
    private function setRunImage($image,$key=0,&$item){
        $this->Log->log(0,"[".__METHOD__."]");
        //$this->Log->log(0,$image);
        parent::firstCheckImage($image);
        if($image->data->tmp==='d'){
            $this->Log->log(0,"[".__METHOD__."] Image tmp = d -> SKIP;");
            return false;
        }
        $imageDir = ($image->data->tmp==='n') ? UPLOAD_DIR : TMP_UPLOAD_DIR;
        parent::secondCheckImage($image);
        /* TO DO
         * infront - przed tekstem
         * tight - przyległe
         * behind - za tekstem
         */
        $item->addImage($imageDir.$image->property->uri,
                            array(  'width' => $image->style->width,
                                    'height' => $image->style->height,
                                    //'positioning' => 'relative',//relative absolute
                                    //'wrappingStyle'=>'infront'//'inline', 'behind', 'infront', 'square', 'tight'
                        ));//, 'alignment' => \PhpOffice\PhpWord\SimpleType\Jc::CENTER
    }
    private function setListStyle($r,$listName=''){
      
        $hanging = parent::getTwip($r->paragraph->style->indentation,$r->paragraph->style->indentationMeasurement);
        $left = $hanging+parent::getTwip($r->paragraph->style->leftEjection,$r->paragraph->style->leftEjectionMeasurement);       
        /* Format List Array */
        $formatList=parent::getFormatList($r->list->style->listType);
        $this->phpWord->addNumberingStyle(
            $listName,
            array(
                'type'   => 'multilevel',
                'levels' => array(
                    /* ('start'=>, 'format'=>, 'text'=>, 'alignment'=>, 'tabPos'=>, 'left'=>, 'hanging'=>, 'font'=>, 'hint'=>) */
                    array('format' => $formatList[0], 'text' => $formatList[1].'%1'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%2'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%3'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%4'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%5'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 360
                    array('format' => $formatList[0], 'text' => $formatList[1].'%6'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily),//, 'tabPos' => 720
                    array('format' => $formatList[0], 'text' => $formatList[1].'%7'.$formatList[2], 'left' => $left, 'hanging' => $hanging,'font' => $r->list->style->fontFamily)//, 'tabPos' => 360
                ),
            )
        );
        //return array('listType' => \PhpOffice\PhpWord\Style\ListItem::TYPE_NUMBER_NESTED);
        return $listName;
    }
    private function setListParagraph($r,$actTabStopName='P-Style'){
        $this->Log->log(0,"[".__METHOD__."] Tab Stop name - ".$actTabStopName);
            /*
            'styleName'           => array(self::READ_VALUE, array('w:pStyle', 'w:name')),
            'alignment'           => array(self::READ_VALUE, 'w:jc'),
            'basedOn'             => array(self::READ_VALUE, 'w:basedOn'),
            'next'                => array(self::READ_VALUE, 'w:next'),
            'indent'              => array(self::READ_VALUE, 'w:ind', 'w:left'),
            'hanging'             => array(self::READ_VALUE, 'w:ind', 'w:hanging'),
            'spaceAfter'          => array(self::READ_VALUE, 'w:spacing', 'w:after'),
            'spaceBefore'         => array(self::READ_VALUE, 'w:spacing', 'w:before'),
            'widowControl'        => array(self::READ_FALSE, 'w:widowControl'),
            'keepNext'            => array(self::READ_TRUE,  'w:keepNext'),
            'keepLines'           => array(self::READ_TRUE,  'w:keepLines'),
            'pageBreakBefore'     => array(self::READ_TRUE,  'w:pageBreakBefore'),
            'contextualSpacing'   => array(self::READ_TRUE,  'w:contextualSpacing'),
            'bidi'                => array(self::READ_TRUE,  'w:bidi'),
            'suppressAutoHyphens' => array(self::READ_TRUE,  'w:suppressAutoHyphens'),
        */
        $this->phpWord->addParagraphStyle($actTabStopName, array('align'=>parent::setAlign($r->paragraph->style),'tabs'=>parent::setTabStop($r->paragraph->tabstop) ,'spaceAfter' => 95));
        return $actTabStopName;
    }
    private function setSectionColumn($subsection,$breakType='continuous'){
        $this->Log->log(0,"[".__METHOD__."]");
        $cols=count(get_object_vars($subsection));
        return $this->phpWord->addSection(
                    array(
                        'colsNum'   =>  $cols, //$cols
                        'breakType' => $breakType, // new word page
                        'colsSpace' => 2880/$cols  // 2880/$cols              
                    )
                );
    }
    private function newLine1($r,&$propertyRun,&$section){
        $this->Log->log(0,"[".__METHOD__."] NEW LINE = TRUE");
        /* DYNAMIC RUN => setpItem, setlItem */
        self::{'set'.$r->paragraph->property->paragraph.'Item'}($r,$propertyRun,$section);
    }
    private function newLine0($r,&$propertyRun){
        $this->Log->log(0,"[".__METHOD__."] NEW LINE = FALSE");
        $propertyRun['run']->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
    }
    private function setpItem($r,&$propertyRun,&$section){
         $this->Log->log(0,"[".__METHOD__."] SET PARAGRAPH ITEM");
         /* TO SET THE sAME TAB STOP - USE FRONT END TO ADD TAB STOP FOR NEW PARAGRAPH */
         $newTextRun = $section->addTextRun(parent::setParagraphProperties($r)); 
         $newTextRun->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));
         $propertyRun['run'] = $newTextRun;
    }
    private function setlItem($r,&$propertyRun,&$section){
        $this->Log->log(0,"[".__METHOD__."] SET LIST ITEM");
        self::{'setNewList_'.$r->list->property->newList}($propertyRun['actListName']);
        self::{'setNewTabStop_'.$r->list->property->newList}($propertyRun['actTabStopName']);
        $listItemRun = $section->addListItemRun($r->list->property->listLevel-1, self::setListStyle($r,$propertyRun['actListName']), self::setListParagraph($r,$propertyRun['actTabStopName']));
        $listItemRun->addText($r->paragraph->property->value,parent::setFont($r->paragraph->style));  
        $propertyRun['run'] = $listItemRun; 
    }
    private function setNewList_y(&$actListName){
        $this->Log->log(0,"[".__METHOD__."] SETUP NEW LIST");
        $actListName=uniqid('list_');
    }
    private function setNewList_n(){
        $this->Log->log(0,"[".__METHOD__."] NO NEW LIST");
    }
    private function setNewTabStop_y(&$actTabStopName){
        $this->Log->log(0,"[".__METHOD__."] SETUP NEW TABSTOP");
        $actTabStopName=uniqid('tabstop_');
    }
    private function setNewTabStop_n(){
        $this->Log->log(0,"[".__METHOD__."] NO NEW TABSTOP");
    }
    public function createProjectReport(){
        $this->Log->log(0,"[".__METHOD__."]"); 
        /* Note: any element you append to a document must reside inside of a Section. */
        // Adding an empty Section to the document...
        $this->Log->log(0,"[".__METHOD__."] BEFORE SECTION");
        $section = $this->phpWord->addSection();
        $this->Log->log(0,"[".__METHOD__."] SECTION");
        $text = "some text";
        $this->phpWord->addFontStyle('r2Style', array('bold'=>false, 'italic'=>false, 'size'=>12));
        $this->phpWord->addParagraphStyle('p2Style', array('align'=>\PhpOffice\PhpWord\SimpleType\Jc::CENTER, 'spaceAfter'=>100));
        $section->addText($text, 'r2Style', 'p2Style');
        $this->Log->log(0,"[".__METHOD__."] AFTER addText");
        // Adding Text element to the Section having font styled by default...
        $section->addText( 'Do Realizacji: '.$this->projectData['rodzaj_umowy'],array('size'=>22,'color' => 'FF8080'));
        $section->addText( 'Numer: '.$this->projectData['rodzaj_umowy']);
        $section->addText( 'Do kierowania grupą (Lider) powołuje : '.$this->projectData['nadzor']);
        $section->addText( 'Temat: '.$this->projectData['rodzaj_umowy']);
        $section->addText( 'Typ: '.$this->projectData['typ_umowy']);
        $section->addText( 'System: '.$this->projectData['system']);
        $this->Log->log(0,"[".__METHOD__."] AFTER multiply addText");
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($this->phpWord,'Word2007');
        $objWriter->save($this->docDir.$this->fileName);
        return true;
    }
    private function addText($tekst){
         $this->mainSection->addText($tekst,$this->FontStyle,$this->ParagraphStyle);
    }
    public function getDocName(){
        return $this->fileName;
    }
    function _desctruct(){
        $this->Log->log(0,"[".__METHOD__."]");
    }
}
