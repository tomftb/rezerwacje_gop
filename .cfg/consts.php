<?php
define('HH',filter_input(INPUT_SERVER,"HTTP_HOST"));
define('APP_NAME',"Rezerwacje GOP");
define('APP_TITLE',"Rezerwacje GOP");
define('APP_PORT',8080);
define('APP_URL','http://rezerwacje-gop.local:'.APP_PORT);
define('APP_ROOT',mb_substr(filter_input(INPUT_SERVER,"DOCUMENT_ROOT"),0,-7));
define('TMP_UPLOAD_DIR','/tmp_upload/');
define('UPLOAD_DIR',APP_ROOT.'/upload/');
define('UPLOAD_PROJECT_DOC_DIR',UPLOAD_DIR.'project_doc/');
define('UPLOAD_PROJECT_PDF_DIR',UPLOAD_DIR.'project_pdf/');
define('UPLOAD_PROJECT_IMG_DIR',UPLOAD_DIR.'project_img/');
define('UPLOAD_PROJECT_REPORT_DOC_DIR',UPLOAD_DIR.'project_report_doc/');
define('UPLOAD_PROJECT_REPORT_PDF_DIR',UPLOAD_DIR.'project_report_pdf/');
define('UPLOAD_PROJECT_REPORT_IMG_DIR',UPLOAD_DIR.'project_report_img/');
define('CDT',date('Y-m-d H:i:s'));
define('RA',filter_input(INPUT_SERVER,"REMOTE_ADDR"));
define('DR_PUBLIC',filter_input(INPUT_SERVER,"DOCUMENT_ROOT"));
define('APP_AUTHOR',"Autor: Tomasz Borczyński");
/*
	LOG LEVEL:
	0 = basic
	1 = advanced
	2 = extra
*/
define('LOG_LVL',0);