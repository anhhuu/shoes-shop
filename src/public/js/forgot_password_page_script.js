const MIN_LENGTH = 8;
let canSubmit = true;

$(window).ready(function () {
    let timeoutHandler;
    $("#form").change(function () {
        clearTimeout(timeoutHandler);
        timeoutHandler = setTimeout(() => {

            const pass1 = $('#password').val()
            const pass2 = $('#retypePassword').val();

            if (!pass1 || !pass2) {
                canSubmit = false;
                return;
            }


            if (pass2 && pass1 && pass2 !== pass1) {
                showError('Passwords do not match please check again', '#password2-err');
                canSubmit = false;
                return;

            }

            if (pass1.length < MIN_LENGTH) {
                canSubmit = false;
                showError('Password must have at least ' + MIN_LENGTH + ' characters', '#password1-err');

            }

            if (pass2.length < MIN_LENGTH) {
                canSubmit = false;
                showError('Password must have at least ' + MIN_LENGTH + ' characters', '#password2-err');

            }

            if(pass2 === pass1 && pass1 && pass2 && pass1>=MIN_LENGTH){
                canSubmit = true;
            }

        }, 700);
    })

    $('#form').submit(function (e) {
        e.preventDefault();
        if (canSubmit) {
            this.submit();
        } else {
            showError('Cannot submit the form please check for validation', 'form-error')
        }
    });
});


function showError(message, selector) {
    console.log($(selector));

    $(selector).css('visibility', 'visible').html(message)
    setTimeout(() => {
        $(selector).css('visibility', 'hidden').html()
    }, 2000)
}
