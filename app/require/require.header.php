<?php
    $page = $data['page'];
    $menu = array(
        'home' => '<a href="home/index" class="list-group-item' . ($page == "home" ? " active" : "") . '" style="border-radius: 0;"><i class="fa fa-list"></i> Home</a>',
        'contact' => '<a href="contact/index" class="list-group-item' . ($page == "contact" ? " active" : "") . '" style="border-radius: 0;"><i class="fa fa-list"></i> Contact Us</a>',
        'product' => '<a href="product/index" class="list-group-item' . ($page == "product" ? " active" : "") . '" style="border-radius: 0;"><i class="fa fa-user-plus"></i> Products </a>',
        'about' => '<a href="about/index" class="list-group-item' . ($page == "about" ? " active" : "") . '" style="border-radius: 0;"><i class="fa fa-exclamation"></i> About</a>',
        'service' => '<a href="service/index" class="list-group-item' . ($page == "team" ? " active" : "") . '" style="border-radius: 0;"><i class="fa fa-group"></i> Services</a>'
    );

    $users = array(
        'User' => array('home','about','contact','product','service')
    );

    $output = '';
    $account = '';

    $account = 'User';


    foreach($users[$account] AS $menu_item)
    {
        $output .= $menu[$menu_item];
    }
?>

<header class="navbar navbar-fixed-top navbar-custom">

    <div class="hidden-xs container">
        <div class="row">
            <div class="col-sm-1 col-md-1 col-lg-1">
                <a href="home/index">
                    <img src="assets/images/logo.jpg" class="class-brand-image" />
                </a>
            </div>
            <div class="col-sm-11 col-md-11 col-lg-11">
                <div class="list-inline class-site-menu">
                    <span class="<?= ($page == "home" ? " active" : "") ?>"><a href="home/index"><i class="fa fa-home"></i> Home</a></span>
                    <span><a href="http://www.windox90.blogspot.com" target="__blank"><i class="fa fa-info-circle"></i> About Us</a></span>
                    <span class="<?= ($page == "contact" ? " active" : "") ?>"><a href="contact/index"><i class="fa fa-phone"></i> Contact Us</a></span>
                    <span class="<?= ($page == "product" ? " active" : "") ?>"><a href="products/index"><i class="fa fa-tasks"></i> Products</a></span>
                    <span class="<?= ($page == "team" ? " active" : "") ?>"><a href="access/signup"><i class="fa fa-check-square-o"></i> Services</a></span>
                </div>
            </div>
        </div>
    </div>

    <div class="hidden-sm hidden-md hidden-lg container">
        <div class="row">
            <div class="col-xs-2">
                <h2 style="color: #FFF;" class="pull-left class-slide-menu drawer-toggle"><i class="fa fa-bars"></i></h2>
            </div>
            <div class="col-xs-8 text-center">
                <a href="home/index">
                    <img src="assets/images/logo.jpg" class="class-brand-image" />
                </a>
            </div>
        </div>
        <nav class="drawer-nav" role="navigation">
            <div class="c-drawer-menu list-group list-unstyled">
                <a href="home/index" class="list-group-item active"><i class="fa fa-home"></i> Home</a>
                <a href="http://www.windox90.blogspot.com" class="list-group-item" target="__blank"><i class="fa fa-info-circle"></i> About Us</a>
                <a href="contact/index" class="list-group-item"><i class="fa fa-phone"></i> Contact Us</a>
                <a href="products/index" class="list-group-item"><i class="fa fa-tasks"></i> Products</a>
                <a href="access/signup" class="list-group-item"><i class="fa fa-check-square-o"></i> Services</a>
            </div>
            <p class="text-center">
                All rights reserved <br/> MInc Systems &copy; 2016
            </p>
        </nav>
    </div>
</header>