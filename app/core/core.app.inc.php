<?php

class App
{
    protected $controller = 'home';

    protected $method = 'index';

    protected $parameter = [];

    public function __construct()
    {
        $url = $this->parseUrl();

        if(file_exists('../app/controllers/controller.' . $url[0] . '.php'))
        {
            $this->controller = $url[0];
            unset($url[0]);
        }

        require_once '../app/controllers/controller.' . $this->controller . '.php';

        $this->controller = new $this->controller;

        if(isset($url[1]))
        {
            if(method_exists($this->controller, $url[1]))
            {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        $this->parameter = $url ? array_values($url) : [];

        call_user_func_array([$this->controller, $this->method], $this->parameter);
    }

    protected function parseUrl()
    {
        if(filter_input(INPUT_GET, 'url'))
        {
            return $url = explode('/', filter_var(rtrim(filter_input(INPUT_GET, 'url'), '/'), FILTER_SANITIZE_URL));
        }
    }
}