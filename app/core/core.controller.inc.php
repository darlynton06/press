<?php

class Controller extends Connection
{
    public function __construct($DBO=NULL){
        parent::__construct($DBO);
    }

    protected function model($model)
    {
        if(file_exists('../app/models/model.' . strtolower($model) . '.php'))
        {
            require_once '../app/models/model.' . strtolower($model) . '.php';
            return new $model;
        }
    }

    protected function view($view, $data = [])
    {
        if(file_exists('../app/views/' . $view . '.php'))
        {
            require_once '../app/views/' . $view . '.php';
        }
    }
}
