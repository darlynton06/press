<?php

class Contact extends Controller
{
    protected $state = FALSE;

    public function __construct()
    {
        parent::__construct();
        $this->model_class = $this->model('App_Model');
        $this->state = $this->model_class->_build_app();
    }

    public function index()
    {
        //if(!$this->state)
        {
          $data = array('page' => 'contact',);
          $this->view('contact/web.index',$data);
            // $this->view('contact/web.index');
        }
      }
    }
