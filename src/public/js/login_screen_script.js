let loginDOM;
const forgotPasswordTemplate = `
        <form class="form" method="post" action="/users/forgot-password">
            <h2>Forgot password</h2>
            <div class="form--control">
                <label for="username">Email</label>
                <input name="email" type="text" id="email" placeholder="Enter email">
                <small>Error message</small>
            </div>
            <button type="submit" >Submit</button>
        </form>
`

let login = false;

function replaceDOMHandler() {
    if (login) {
        $('.form-container').html(loginDOM);
        $('#forgot-password-text').click(replaceDOMHandler);
        $('#forgot-password-text').html('Forgot password ?')

    } else {
        loginDOM = $('.form-container').html();
        $('.form-container').html(forgotPasswordTemplate);
        $('#forgot-password-text').html('Login')
    }

    login = !login

}

$(window).ready(function () {
    loginDOM = $('.form-container').html();
    $('#forgot-password-text').click(replaceDOMHandler);
})



