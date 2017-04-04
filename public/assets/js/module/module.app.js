App = window.App || {};

App.extend = function(ns,ns_string)
{
    var parts = ns_string.split("."), parent = ns, pl, i;

    // we want to be able to include or exclude the root namespace
    // So we strip it if it's in the namespace
    if (parts[0] === "App")
    {
        parts = parts.slice(1);
    }

    // loop through the parts and create
    // a nested namespace if necessary

    pl = parts.length;

    for(i = 0; i < pl; i++)
    {
        var part_name = parts[i];
        // check if the current parent already has
        // the namespace declared, if not create it
        if(typeof parent[part_name] === "undefined")
        {
            parent[part_name] = {};
        }
        // get a reference to the deepest element
        // in the hierarchy so far
        parent = parent[part_name];
    }
    // the parent is now completely constructed
    // with empty namespaces and can be used.
    return parent;
};

App.extend(App,"App.Access");

App.Access = function()
{
    var __FEEDBACK__ = new App.Feedback();
    var __FORMS__ = new App.Forms();
    var __REDIRECT__ = new App.Redirect();

    var __state = {
        code: "0",
        message: "Welcome To VLS App"
    };

    var __options = {
        clear_form: false,
        redirect: false,
        form_id: null,
        redirect_path: '#',
        show_processing: true
    };

    var __access = function(access_object)
    {
        __options = access_object.options || __options;

        __options.show_processing && __FEEDBACK__.process(access_object.process_obj,'disable');

        $.ajax({
            url: access_object.action,
            type: 'POST',
            async: true,
            data: access_object.form_data,
            dataType: 'JSON',
            success: function(__response)
            {
                __options.show_processing && __FEEDBACK__.process(access_object.process_obj,'enable');
                __options.clear_form === true && __FORMS__.clear_form(access_object.form_id);
                __FEEDBACK__.set_state({code: 0, message: __response.message});
                __FEEDBACK__.notify('top');
                __options.redirect === true && __REDIRECT__.redirect(__options.redirect_path);
            },
            error: function(__response)
            {
                __options.show_processing && __FEEDBACK__.process(access_object.process_obj,'enable');
                __FEEDBACK__.set_state({code: -1, message: __response.responseText});
                __FEEDBACK__.notify('top');
                __options.clear_form === true && __FORMS__.clear_form(access_object.form_id);
            }
        });

    };

    return {
        access: __access
    };
};

App.extend(App,"App.Feedback");

App.Feedback = function()
{
    var __current_state = {
        code: "0",
        message: ""
    };

    var __templates = {
        notify_top: "template.notify.top.ejs",
        notify_dialog: "template.notify.dialog.ejs"
    };

    var __html_content = "";

    var __set_state = function(state)
    {
        __current_state = state;
    };

    var __notify = function(type)
    {
        __html_content = new EJS({url: 'assets/templates/' + __templates.notify_top}).render({data: __current_state});
        switch(type)
        {
            case 'top':
                $('#noty_top_layout_container').remove();
                $('body').append(__html_content);
                $('#noty_top_layout_container').slideDown('1000').delay('3000').slideUp('fast');
                break;
            case 'dialog':
                $(__html_content).modal();
                break;
        }
    };

    var __notify_native = function(last_refresh)
    {
        $.ajax({
            url: 'user/feed',
            type: 'POST',
            async: true,
            data: 'last_refresh=' + last_refresh + '&load_feed=true',
            dataType: 'JSON',
            success: function(__response)
            {
                $('#id-last-notify').val(__response.new_time);
                if(!("Notification" in window))
                {
                    __set_state({code: -1, message: 'This browser does not support desktop notification'});
                    __notify('top');
                }
                else if(Notification.permission === "granted")
                {
                    __show_notification(__response.feed);
                }
                else if(Notification.permission !== 'denied')
                {
                    Notification.requestPermission(function(permission){
                        if(!('permission' in Notification))
                        {
                            Notification.permission = permission;
                        }

                        if(permission === "granted")
                        {
                            __show_notification(__response.feed);
                        }
                    });
                }
            },
            error: function(__response)
            {
                __set_state({code: -1, message: __response.responseText});
                __notify('top');
            }
        });
    };

    var __show_notification = function(response)
    {
        if(response.length > 0)
        {
            var notification;
            $.each(response,function(notyIndex,noty){

                $('table.dataTable tbody tr').map(function(){
                    if(parseFloat($(this).data('row_id')) === parseFloat(noty.visit_ID))
                    {
                        $(this).find('a.class-cancel-visit').addClass('hidden');
                        $(this).find('a.class-edit-visit').addClass('hidden');
                        $(this).find('a.class-edit-visit').parents('td').append('<label class="label label-info"><i class="fa fa-check"></i><font class="hidden-xs hidden-sm"> Active</font></label>');
                    }
                });

                if(document['hidden'])
                {
                    var options = {
                        body: noty.message,
                        icon: "assets/images/logo.png",
                        dir : "ltr"
                    };
                    notification = new Notification("VLS Notification",options);
                }
                else
                {
                    var options = {
                        body: noty.message,
                        icon: "assets/images/logo.png",
                        dir : "ltr"
                    };
                    notification = new Notification("VLS Notification",options);
                }
            });
        }
    };

    var __search = function(search_object){
        __options = search_object.options || __options;

        var __FEEDBACK__ = new App.Feedback();

        $.ajax({
            url: search_object.action,
            type: 'POST',
            async: true,
            data: search_object.form_data,
            dataType: 'JSON',
            success: function(__response)
            {
                __html_content = new EJS({url: 'assets/templates/' + __options.template}).render({data: __response.staffs});;
                $("#id-search-result").remove();
                $(__html_content).insertAfter(__options.input_id);
            },
            error: function(__response)
            {
                __FEEDBACK__.set_state({code: -1, message: __response.responseText});
                __FEEDBACK__.notify('top');
            }
        });
    };

    var __process  = function(process_obj,state)
    {
        if(state === 'disable')
        {
            $(process_obj.button_element_id).html('<i class="fa fa-circle-o-notch fa-spin"></i> Please Wait...').prop('disabled',true);
        }

        if(state === 'enable')
        {
            $(process_obj.button_element_id).html(process_obj.button_text).prop('disabled',false);
        }
    };

    return {
        set_state: __set_state,
        notify: __notify,
        notify_native: __notify_native,
        search: __search,
        process: __process
    };
};

App.extend(App,"App.Dialogs");

App.Dialogs = function()
{
    var __FEEDBACK__ = new App.Feedback();
    var __DATA__ = new App.Data();

    var __state = {
        code: "0",
        message: "Loading Dialog"
    };

    var __options = {
        load_data: false,
        template: null,
        attach_webcam: false,
        show_processing: true
    };

    var __html_content = "";

    var __dialog = function(dialog_object){

        __options = dialog_object.options || __options;

        __options.show_processing && __FEEDBACK__.process(dialog_object.process_obj,'disable');

        if(__options.load_data)
        {
            var data = __DATA__.fetch(dialog_object.action_object);
            if(data.length > 0 || data.length !== null)
            {
                __html_content = new EJS({url: 'assets/templates/' + __options.template}).render({data: data});
            }
            else
            {
                __FEEDBACK__.set_state({code: -1, message: data});
                __FEEDBACK__.notify('top');
            }
        }
        else
        {
            __html_content = new EJS({url: 'assets/templates/' + __options.template}).render({});
        }

        $('.modal').remove();
        if(__options.attach_webcam)
        {
            $(__html_content).modal().delay(1000).queue(function(next){
                Webcam.attach('#id-cam-image');
                next();
            });
        }
        else
        {
            $(__html_content).modal();
        }
        __options.show_processing && __FEEDBACK__.process(dialog_object.process_obj,'enable');

    };

    var __confirm_dialog = function(dialog_object)
    {
        __options = dialog_object.options || __options;
        __html_content = new EJS({url: 'assets/templates/' + __options.template}).render({data: dialog_object.action_object.data});
        $('.modal').remove();
        $(__html_content).modal();
    };

    return {
        dialog: __dialog,
        confirm_dialog: __confirm_dialog
    };
};

App.extend(App,"App.Forms");

App.Forms = function()
{
    var __error;
    var __validate_form = function(form_id)
    {
        __error = 0;
        $(form_id + ' input.required').map(function(){
            if($(this).val() === '')
            {
                /*$(this).parents('div.form-group').removeClass('has-error has-success').addClass('has-error has-feedback');
                $(this).parent('div.input-group').find('span.form-control-feedback').removeClass('fade')
                                                .find('i.fa').removeClass('fa-check fa-remove').addClass('fa-remove');*/
                __error++;
            }
            /*
            else
            {
                $(this).parents('div.form-group').removeClass('has-error has-success').addClass('has-success has-feedback');
                $(this).parent('div.input-group').find('span.form-control-feedback').removeClass('fade')
                                                .find('i.fa').removeClass('fa-check fa-remove').addClass('fa-check');
            }*/
        });
        return __error > 0 ? false : true;
    };

    var __clear_form = function(form_id)
    {
        $(form_id+' :input.form-control').map(function(){
            $(this).val('');
        });
        return;
    };

    return {
        validate_form: __validate_form,
        clear_form: __clear_form
    };
};

App.extend(App,"App.Data");

App.Data = function()
{
    var __data;

    var __options = {
        clear_form: false,
        form_id: null,
        show_processing: true,
        change_attr: false,
        element_id: null,
        redirect: false,
        redirect_path: null,
        close_modal: false,
        render_data: false,
        template: null,
        target_element: null,
        hide_element: false,
        hide_element_id: null,
        use_table: false,
        data_table_id: null,
        data_table_scroll: false,
        data_table_vertical_height: null,
        data_table_paginate: false,
        row_id: null,
        update_row: false,
        remove_row: false
    };

    var __fetch = function(action_object)
    {
        $.ajax({
            url: action_object.action,
            type: 'POST',
            async: false,
            data: action_object.data || "",
            dataType: 'JSON',
            success: function(__response)
            {
                __data = __response;
            },
            error: function(__response)
            {
                __data = __response.responseText;
            }
        });
        return __data;
    };

    var __refresh_visit = function(action_object)
    {
        $.ajax({
            url: action_object.action,
            type: 'POST',
            async: false,
            data: action_object.form_data,
            dataType: 'JSON',
            success: function(__response)
            {
                $('#id-last-refresh').val(__response.new_time);
                if(__response.log.length > 0)
                {
                    $.each(__response.log,function(logIndex,log){
                        var comp_btn = (log.time_in !== null && log.time_out !== null) ? "" : " hidden";
                        var out_btn = (log.time_in !== null && log.time_out === null) ? "" : " hidden";
                        var in_btn = log.time_in !== null ? " hidden" : "";

                        var new_row = [
                            log.visitor_name,
                            log.tag_number,
                            log.visit_type,
                            log.whom_to_see,
                            log.department_name,
                            '<label class="label label-success' + comp_btn + ' ">Completed <i class="fa fa-check"></i></label> <a class="btn btn-sm btn-danger class-check-out' + out_btn + ' " id="id-check-out-btn" data-visit_id=" ' + log.ID + ' "><i class="fa fa-check"></i> Check Out</a> <a class="btn btn-sm btn-success class-check-in' + in_btn + '" data-visit_id=" ' + log.ID + ' "><i class="fa fa-check"></i> Check In</a>'
                        ];
                        var index = visit_log.row.add(new_row).index();
                        visit_log.rows(index).nodes().to$().attr('data-row_id',log.ID).addClass('c-log-item');
                        visit_log.draw(false);
                    });
                }
            },
            error: function(__response)
            {
                console.log(__response.responseText);
            }
        });
    };

    var __post = function(action_object)
    {

        var __FEEDBACK__ = new App.Feedback();
        var __FORMS__ = new App.Forms();
        var __REDIRECT__ = new App.Redirect();

        __options = action_object.options || __options;

        __options.show_processing && __FEEDBACK__.process(action_object.process_obj,'disable');

        $.ajax({
            url: action_object.action,
            type: 'POST',
            async: true,
            data: action_object.form_data,
            dataType: 'JSON',
            success: function(__response)
            {
                if(__options.change_attr)
                {
                    $(__options.element_id).removeClass('btn-success')
                    .removeClass('btn-danger')
                    .removeClass('btn-warning')
                    .addClass(__response.theme)
                    .html(__response.status + ' <i class="fa fa-caret-down"></i>');
                }

                __options.show_processing && __FEEDBACK__.process(action_object.process_obj,'enable');

                __options.hide_element && $(__options.hide_element_id).addClass('hidden');

                __options.clear_form === true && __FORMS__.clear_form(__options.form_id);
                __FEEDBACK__.set_state({code: 0, message: __response.message});
                __FEEDBACK__.notify('top');

                __options.render_data && $(__options.target_element).hide().html(new EJS({url: 'assets/templates/' + __options.template}).render({data: __response})).fadeIn();

                if(__options.use_table)
                {
                    $(__options.data_table_id).DataTable({
                        scrollY: __options.data_table_scroll ? __options.data_table_vertical_height : null,
                        scrollCollapse: __options.data_table_scroll,
                        paging: __options.data_table_paginate,
                        sortable: false,
                        stateSave: true
                    });
                }

                if(__options.update_row)
                {
                    if(__options.row_id)
                    {
                        alert('osasksss');
                        $('table.dataTable tbody tr').map(function(){
                            if(parseFloat($(this).data('row_id')) === parseFloat(__options.row_id))
                            {
                                $(this).find('a.class-check-out').addClass('hidden');
                                $(this).find('label.label').removeClass('hidden');
                                var row = visit_log.row($(this));
                                row.remove().draw();
                            }
                        });
                    }

                    if(__response.id)
                    {
                        $('table.dataTable tbody tr').map(function(){
                            if(parseFloat($(this).data('row_id')) === parseFloat(__response.id))
                            {
                                $(this).find('a.class-check-out').removeClass('hidden');
                                $(this).find('a.class-check-in').addClass('hidden');

                                if(__options.tag_number)
                                {
                                    $(this).find("td:nth-child(2)").text(__options.tag_number);
                                }

                            }
                        });
                    }

                    if(__response.rows_id)
                    {
                        alert('osask');
                        $.each(__response.rows_id,function(rowIndex,row){
                            $('table.dataTable tbody tr').map(function(){
                                if(parseFloat($(this).data('row_id')) === parseFloat(row))
                                {
                                    $(this).find('a.class-check-out').addClass('hidden');
                                    $(this).find('label.label').removeClass('hidden');
                                    var row = visit_log.row($(this));
                                    row.remove().draw();
                                }
                            });
                        });
                    }
                }

                __options.close_modal && $('div.modal').fadeOut('1000').queue(function(next){
                    $('div.modal-backdrop').fadeOut('1000').delay('500').remove();
                    $('div.modal').remove();
                    next();
                });

                __options.redirect && __REDIRECT__.redirect(__options.redirect_path);
            },
            error: function(__response)
            {
                __options.show_processing && __FEEDBACK__.process(action_object.process_obj,'enable');
                __FEEDBACK__.set_state({code: -1, message: __response.responseText});
                __FEEDBACK__.notify('top');
                __options.clear_form && __FORMS__.clear_form(__options.form_id);
            }
        });
    };

    return {
        fetch: __fetch,
        refresh_visit: __refresh_visit,
        post: __post
    };
};

App.extend(App,"App.Redirect");

App.Redirect = function()
{
    var __redirect = function(redirect_path)
    {
        window.location.href = redirect_path;
    };

    return {
        redirect: __redirect
    };
};
