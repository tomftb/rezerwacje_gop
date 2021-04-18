<?php
define('dbParm',array
            (
                'host'=>'127.0.0.1',
                'db'=>'rezerwacjegop',
                'port'=>3306,
                'user'=>'rezerwacjegop',
                'pass'=>'NURQYnZ1TmlSYnlvVUJUTg==',
                'logLvl'=>0,
                'cipher'=>'y'
            ));
define('ldapParm',array
            (
                'host'=>'geofizyka.geofizyka.pl',
                'filter'=>'(&(sAMAccountName=%u)(objectcategory=person)(objectclass=user))',
                'tree'=>'ou=Geofizyka, dc=geofizyka, dc=pl',
                'port'=>389,
                'user'=>'ldap@geofizyka.pl',
                'password'=>'Ld4p321'
            ));
define('HH',filter_input(INPUT_SERVER,"HTTP_HOST"));
define('APP_NAME',"Rezerwacje GOP");
define('APP_URL','http://rezerwacje-gop.geofizyka.pl:8080/');
//define('APP_URL','http://rezerwacjegop.geofizyka.pl/');