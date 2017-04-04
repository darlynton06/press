<?php
define('SCRIPT_ROOT', filter_input(INPUT_SERVER, 'DOCUMENT_ROOT'));

/**
* Include the necessary configuration info
*/
session_start();
if(file_exists('../app/core/config.db-cred.inc.php'))
{
    require_once 'config.db-cred.inc.php';
}

/**
* Define constants for configuration info
*/
foreach($DB_CONN as $name => $val)
{
    define($name, $val);
}

/**
* Create a PDO object
*/
$DSN = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;

try
{
    $DBO = new PDO($DSN, DB_USER, DB_PASS);
}
catch(Exception $e)
{
    echo '<h1>Server Not Available</h1>';
    echo 'Check that the server is up and running or restart your server and try again<br/>';
    die("<b>MESSAGE:</b> " . $e->getMessage());
}