$(document).on('ready',function(){

    $("#id-contact-form").on("submit",function(e){
        e.preventDefault();

        var Feedback = Feedback || new App.Feedback();
        var Data = Data || new App.Data();
        var Forms = Forms || new App.Forms();

        var form_data = {
            action: "contact/send",
            form_data: $(this).serialize(),
            options: {
                clear_form: false,
                form_id: "#id-contact-form",
                show_processing: true,
                redirect: false,
                redirect_path: null,
                close_modal: false
            },
            process_obj: {
                button_element_id: "#id-contact-btn",
                button_text: '<i class="fa fa-send"></i> Send Mail'
            }
        };

        if(!Forms.validate_form(form_data.options.form_id))
        {
            Feedback.set_state({code: -1, message: "Some required fields are empty"});
            Feedback.notify('top');
            return false;
        }

        Data.post(form_data);

    });

});
