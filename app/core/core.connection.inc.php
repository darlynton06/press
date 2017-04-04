<?php

class Connection
{
    public $DB;
    protected $path_prefix = '';
    
    public function __construct($DBO=NULL)
    {
        if(is_object($DBO))
        {
            $this->DB = $DBO;
        }
        else
        {
            $DSN = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME;
            try
            {
                $this->DB = new PDO($DSN, DB_USER, DB_PASS);
            }
            catch(Exception $e)
            {
                echo '<h1>Server Not Available</h1>';
                echo 'Check that the server is up and running or restart your server and try again<br/>';
                die("<b>MESSAGE:</b> " . $e->getMessage());
            }
        }
    }
}