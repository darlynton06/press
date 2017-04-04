<?php

class Home extends Controller
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
          $data = array('page' => 'home',);
          $this->view('home/web.index',$data);
        }
      }




      //  else
        // {
        //     if(!isset($_SESSION['__username']))
        //     {
        //         $this->_route();
        //     }
        //     else
        //     {
        //         switch($_SESSION['__department'])
        //         {
        //             case 'Security':
        //                 $this->model_class = $this->model('Security_Model');
        //                 $data = array(
        //                     'page' => 'log',
        //                     'log' => $this->model_class->_load_all_visit()
        //                 );
        //                 $this->view('security/web.index',$data);
        //                 break;
        //             case 'Human Resource and Administration':
        //                 $this->model_class = $this->model('User_Model');
        //                 $data = array(
        //                     'page' => 'dashboard',
        //                     'users' => $this->model_class->_load_all_user()
        //                 );
        //                 $this->view('admin/web.index',$data);
        //                 break;
        //             default:
        //                 $this->view('user/web.index');
        //                 break;
        //         }
        //     }
        // }
    }

    // private function _route()
    // {
    //     if(!isset($_COOKIE["session_username"]))
    //     {
    //         $this->view('home/web.index');
    //     }
    //     else
        // {
        //     $this->model_class = $this->model('Access_Model');
        //
        //     $form_data = array(
        //         'username' => $this->model_class->_clean_data($_COOKIE["session_username"]),
        //         'password' => $this->model_class->_clean_data($_COOKIE["session_password"])
        //     );
        //
        //     $access_state = $this->model_class->_activate_session($form_data);
        //
        //     if(is_array($access_state))
        //     {
        //         switch($_SESSION['__department'])
        //         {
        //             case 'Security':
        //                 $this->model_class = $this->model('Security_Model');
        //                 $data = array(
        //                     'page' => 'log',
        //                     'log' => $this->model_class->_load_all_visit()
        //                 );
        //                 $this->view('security/web.index',$data);
        //                 break;
        //             case 'Human Resource and Administration':
        //                 $this->model_class = $this->model('User_Model');
        //                 $data = array(
        //                     'page' => 'dashboard',
        //                     'users' => $this->model_class->_load_all_user()
        //                 );
        //                 $this->view('admin/web.index',$data);
        //                 break;
        //             default:
        //                 $this->view('user/web.index');
        //                 break;
        //         }
        //     }
        //     else
        //     {
              //  $this->view('home/web.index');
    //         }
    //     }
       //}
