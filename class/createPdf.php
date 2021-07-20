<?php
require(DR.'/lib/fpdf181/tfpdf.php');

define("_SYSTEM_TTFONTS", DR.'/lib/fpdf181/font/unifont/lato/');
define("FPDF_FONTPATH",DR.'/lib/fpdf181/font/');

class createPdf extends tFPDF
{
    protected $pdfBodyPartList=array();
    protected $prDetails=array();
    protected $prDocs=array();
    protected $prTeam=array();
    protected $prMainManager=array();
    protected $prMainTech=array();
    private $ROOT='';
    private $createDir='';
    private $log;
    /*
     * I -> OPEN
     * D -> DOWNLOAD
     */
    
    protected $outputType='S';
    function __construct($projectDetails,$projectDoc,$projectTeam,$root='',$createDir='')
    {
        parent::__construct();
        $this->ROOT=$root;
        $this->createDir=$createDir;
        $this->log=Logger::init();
        $this->prDetails=$projectDetails;
        $this->prDocs=$projectDoc;
        $this->prTeam=$projectTeam;
        self::createDocument();
    }
    // Page header
    function Header()
    {     
        $this->AddFont('Lato','','Lato-Regular.ttf',true);
        $this->AddFont('LatoB','','Lato-Bold.ttf',true);
        //$this->AddFont('DejaVu','','DejaVuSans.ttf',true);
        $this->SetFont('Lato','',6);
        $this->SetLeftMargin(20);
        $this->SetRightMargin(20);
        $this->SetTopMargin(20);
        $this->Cell(0,0,'PROCEDURA P-8.5/SP',0,0,'L');
        $this->Cell(0,0,'F.P-8.5',0,0,'R');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,0,'POWOŁANIE GRUPY REALIZUJĄCEJ',0,0,'L');
        $this->Cell(0,0,'DATA: 31.10.2017',0,0,'R');
        $this->Cell(0,3,'',0,1,'C');
        $this->Cell(0,0,'WYDANIE: 6',0,0,'R');
        $this->Cell(0,3,'',0,1,'C');
        $this->Image($this->ROOT.'/lib/fpdf181/gt_line_header.png',20,22,0);
        $this->Ln(5);
    }
    // Page footer
    function Footer()
    {
        // Position at 1.5 cm from bottom
        $this->SetY(-15);
        // Arial italic 8
        $this->SetFont('Lato','',6);
        //$this->SetFont('DejaVu','',6);
        // Page number
        #$this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
        $this->SetTextColor(80,80,80);
        $this->Cell(0,6,'Dokument jest własnością Geofizyki Toruń S.A.',0,0,'C');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,0,'Zabrania się samowolnego dokonywania zmian, kopiowania i rozpowszechniania tego dokumentu',0,0,'C');   
    }
    private function createDocument()
    {
        self::setProjectDetails();
        $this->setProjectDocuments();
        $this->genDetailPdf();
        $this->genProjectTeam();
    }
    private function setProjectDetails()
    {
        $this->log->logMulti(0,$this->prDetails,__METHOD__);
        $this->SetTitle("Powołanie grupy realizującej",true);
        $this->SetAuthor("Tomasz Borczyński" ,true);
        $this->SetSubject("Powołanie grupy sejsmicznej" ,true);
        $this->AliasNbPages();
        $this->AddPage();
        $this->SetFont('LatoB','',14);
        $this->Cell(0,6,'POWOŁANIE GRUPY REALIZUJĄCEJ',0,1,'C');
        $this->SetFont('Lato', '', 11);   
        $this->Cell(0,3,'',0,1,'C');
        $this->Cell(0,6,'do realizacji '.$this->prDetails['rodzaj_umowy'].' nr '.$this->prDetails['numer_umowy'],0,1,'C');
        $this->Cell(0,6,'temat : '.$this->prDetails['klient'].' '.$this->prDetails['temat_umowy'].' '.$this->prDetails['typ_umowy'],0,1,'C');
        $this->Cell(0,10,'',0,1,'C');
        $this->pdfBodyPartList=array(
            array('n','Do kierowania Grupą powołuję - '.$this->prDetails['nadzor']),
            array('n','W skład Grupy włączam pracowników wyszczególnionych w F.PJ-4.9/GOP/002'),
            array('n','Termin  realizacji '.$this->prDetails['rodzaj_umowy'].' '.$this->prDetails['d-term_realizacji'].' - '.$this->prDetails['d-koniec_proj']),
            array('n','Kierującego Grupą (Lidera) zobowiązuję do przedstawienia harmonogramu prac'),
            array('','do dnia '.$this->prDetails['harm_data']),
            array('n','Zobowiązuję do prowadzenia dokumentacji i zapisów zgodnie z procedurami ISO'),
            array('n','Kierującego Grupą (Lidera) zobowiązuję do zakończenia prac i napisania raportu'),
            array('','z realizacji zadania do dnia '.$this->prDetails['d-term_realizacji']),
            array('n','Nadzór nad realizacją  powierzam - '.$this->prDetails['kier_grupy']),
            array('n','Wykaz powiązanych dokumentów:')
        );
    }
    function setProjectDocuments()
    {
        // PROJECT DOCUMENTS DOCUMENT
        $this->log->logMulti(0,$this->prDocs ,__METHOD__);
        foreach($this->prDocs as $valueToAdd)
        {
            //print_r($valueToAdd);
            array_push($this->pdfBodyPartList,array('l',''.$valueToAdd['nazwa']));
        }
        //print_r($pdfBodyPartList);
    }
    function genDetailPdf()
    {
        $this->SetFont('Lato','',11);
        $counter=1;
        $counterLetter=0;
        $letterBig=array("a","b","c","d","e","f","g","h","i","j","k","l","m");
        $createDate=explode(' ',$this->prDetails['create_date']);
        $i=0;
        foreach($this->pdfBodyPartList as $value)
        {
            if($value[0]==='n')
            {
                $this->Cell(0,10,$counter.". ".$value[1],0,1);
                $counter++;
            }
            else if($value[0]==='l')
            {
                // ADD MARGIN LEFT
                $this->Cell(10);
                $this->Cell(0,10,$letterBig[$counterLetter].". ".$value[1],0,1);
                $counterLetter++;
            }
            else
            {
                $this->Cell(10);
                $this->Cell(0,10,$value[1],0,1);
            }
        }
        $this->SetFont('Lato','',9);
        $this->Cell(10);
        $this->Cell(0,10,'',0,0,'L');
        $this->Cell(0,10,'',0,0,'R');
        $this->Cell(0,1,'',0,1,'C');
        $this->Cell(15);
        $this->Cell(0,10,' '.$this->prDetails['kier_grupy'].' ',0,0,'L');
        $this->SetRightMargin(35);
        $this->Cell(0,10,' '.$this->prDetails['technolog'].' ',0,0,'R');
        $this->Cell(0,2,'',0,1,'C');
        $this->Cell(0,10,'............................................................................',0,0,'L');
        $this->SetRightMargin(20);
        $this->Cell(0,10,'............................................................................',0,0,'R');
        $this->Cell(0,10,'',0,1,'C');
        $this->Cell(10);
        $this->Cell(0,0,'/ KIEROWNIK ZESPOŁU /',0,0,'L');
        $this->Cell(0);
        $this->SetRightMargin(30);
        $this->Cell(0,0,'/ GŁÓWNY TECHNOLOG /',0,0,'R');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,10,'',0,0,'R');
        $this->Cell(0,1,'',0,1,'C');
        $this->Cell(0,10,'Zatwierdzam : '.$this->prDetails['kier_osr'].' ',0,0,'R');
        $this->Cell(0,2,'',0,1,'C');
        $this->SetRightMargin(20);
        $this->Cell(0,10,'............................................................................',0,0,'R');
        $this->Cell(0,10,'',0,1,'C');
        $this->SetRightMargin(30);
        $this->Cell(0,0,'/ KIEROWNIK OŚRODKA /',0,0,'R');
        $this->Cell(0,6,'',0,1,'C');
        $this->SetRightMargin(45);
        $this->Cell(0,6,'Data : '.$createDate[0].' ',0,0,'R');
        $this->Cell(0,2,'',0,1,'C');
        $this->SetRightMargin(20);
        $this->Cell(0,5,'..........................................................',0,0,'R');
    }
    function genProjectTeam()
    {
        // TEAM
        $this->AddPage();
        $this->SetFont('Lato','',14);
        $this->Cell(0,8,'IMIENNY WYKAZ PRACOWNIKÓW',0,1,'L');
        $this->SetFont('Lato','',11);
        $this->Cell(0,10,'realizujących '.$this->prDetails['rodzaj_umowy'].' nr '.$this->prDetails['numer_umowy'],0,0,'L');
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,1,'............................................................................................................................................',0,1,'R');
        $this->Cell(0,10,'temat '.$this->prDetails['klient'].' '.$this->prDetails['temat_umowy'].' '.$this->prDetails['typ_umowy'],0,0,'L');
        //Cell(width,height,text,border,ln,align,fill,llink)
        $this->Cell(0,6,'',0,1,'C');
        $this->Cell(0,1,'............................................................................................................................................................................',0,1,'R');
        $this->Cell(0,6,'',0,1,'C');
        // Header
        $header = array('L.P.', 'NAZWISKO I IMIĘ', 'DATA OD','DATA DO', 'PODPIS I DATA');
        $width=34;  
        foreach($header as $id=>$col){
            switch($id){
                case 0:
                     $width=10;
                    break;
                case 1:
                    $width=74; 
                    break;
                case 2:
                case 3:
                    $width=25; 
                    break;
                default:
                    $width=35.5;
                    break;
            }
            $this->Cell($width,10,$col,1,0,'C');
        }
        $this->Ln();      
        // Data
        $lp=1;
        foreach($this->prTeam as $row){
            $this->Cell(10,7,$lp,1,0,'C');
            foreach($row as $id =>$col){
                switch($id){
                    case 'NazwiskoImie':
                        $width=74; 
                        $value=$col;
                        break;
                    case 'DataOd':
                    case 'DataDo':
                        $width=25; 
                        $value=$col;
                        break;
                    default:
                        $width=35.5;
                        $value=$col;
                        break;
                }
                $this->Cell($width,7,$value,1,0,'C');
            }
            // EMPTY CELL FOR PODPIS I DATA
            $this->Cell(35.5,7,'',1,0,'C');
            $lp++;       
            $this->Ln();
        }
    }
    function testData(){
        //TEST DATA CONTENT
        foreach($this->projectDetails as $keyFiled => $valueToAdd){
            $this->Cell(0,10,$keyFiled." - ".$valueToAdd,0,1,'C');  
        }
    }
    public function getPdf(){
        $pdfName='projekt.pdf';
        $this->Output($this->ROOT.$this->createDir.$pdfName,'F');
        return ($pdfName);
    }
    function __destruct(){}
}
