import _ from '/js/file_upload.js';

const MIN_LENGTH_PASSWORD = 8;

const UPDATE_USER_INFO_URL = '/api/users/update';

$(document).ready(function () {

    window.localStorage.removeItem('image_url');

    $('.custom-form .btn-danger').click(handleDeleteAddress);

    $('#setting-button').click(handleSettingBtnClick);
    $('#close-modal, .close').click(handleCloseModal);

    $('#update-button-container').hide();
    hideMessage();
});

function showMessage(message, error = true) {
    if (error) {
        $('#password-error-alert').attr('class', 'alert alert-danger');
    } else {
        $('#password-error-alert').attr('class', 'alert alert-success');
    }

    $('#password-error-alert').html(message);
    $('#password-error-alert').show();
}

function hideMessage() {
    $('#password-error-alert').hide();
}

function handleCloseModal() {
    $('#alert-modal').modal('hide');
}

function handleDeleteAddress() {
    const addressID = $(this).parent().find('input[type="hidden"]').val();
    const self = this;

    $.ajax({
        url: `/api/address/delete/${addressID}`,
        type: 'delete',
        success: function () {
            $(`div[id=${addressID}]`).css('z-index', '9999')
                .addClass('animate__animated animate__hinge');
            $(`div[id=${addressID}]`).on('animationend', function () {
                $(this).hide(
                    250, function () {
                        $(this).remove();
                    })
            })
        },
        error: function () {
            $('#alert-modal').modal('show');
        }
    })
}

let readOnly = true;


function handleSettingBtnClick() {

    $('input:not(input[id="email-address"])').prop('readOnly', !readOnly);
    $('#update-button-container').toggle();
    $('#update-button-container button').click(handleUpdateUserInfo);
    $('#retype-password').change(handleCheckEqualPassword);

    $('#password').blur(handleCompleteTypingPassword)
    readOnly = !readOnly;

    // console.log(readOnly);

}

function handleCheckEqualPassword() {
    if ($('#password').val() !== $('#retype-password').val()) {
        showMessage('Passwords do not match please check again');
        $('#update-button-container button').prop('disabled', true);
    } else {
        hideMessage();
        $('#update-button-container button').prop('disabled', false);
    }
}

function handleCompleteTypingPassword() {
    if ($(this).val().length < MIN_LENGTH_PASSWORD) {
        showMessage(`The password must have at least ${MIN_LENGTH_PASSWORD} characters`);
        setTimeout(() => hideMessage(), 1000);
    }
}

function handleUpdateUserInfo() {
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const phoneNumber = $('#phone-number').val();
    const address = $('#contact-information').val();
    const avatar_image_url = $('#avatar-image-url').val();
    const password = $('#password').val();
    const email = $('#email-address').val();

    const data = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        password,
        address,
        email,
        avatar_image_url: window.localStorage.getItem('image_url') &&
            window.localStorage.getItem('image_url').split('"')[1] ||
            avatar_image_url
    };


    const settings = {

        "url": "/api/users/update-profile",
        "method": "PUT",
        "data": data
    };

    $.ajax(settings).done(function (response) {
        showMessage('Update user info success fully', false);
        setTimeout(() => {
            hideMessage();
        }, 1000)
    });
}