$(function(){

        $("form[name='registration']").validate({
            rules: {
                inputUsername: "required",
                inputEmail: {
                    required: true,
                    email: true
                },
                inputPassword: {
                    required: true,
                    minlength: 5
                }
            },
            messages: {
                inputUsername: "Please enter a username",
                inputEmail: "Please enter a valid email address",
                inputPassword: {
                    required: "Please enter a valid password",
                    minlength: "Your password must be at least 5 characters long"
                }
            },
            submitHandler: function(form){
                form.submit();
            }
        });
});