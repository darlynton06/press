<?php

class App_Model extends Connection
{
    protected $App_Life = array();
    protected $Device_IP;
    protected $SQL = '';

    public function __construct($DBO = NULL) {
        parent::__construct($DBO);
    }

    public function _build_app()
    {
        $file_path = ''.SCRIPT_ROOT.'/restricted/app_life.json';
        if(!file_exists($file_path)){
            return FALSE;
        }
        else
        {
            return TRUE;
        }
    }
}
