import _ from '/js/file_upload.js';

const UPDATE_USER_INFO_URL = '/api/users/update';

$(document).ready(function () {

    window.localStorage.removeItem('image_url');
    let readOnly = true;
    $('#setting-button').click(function () {
        console.log('RUn');
        $('input[readonly]:not(input[id="email-address"])').prop('readOnly', !readOnly);

        if (readOnly) {
            $('#update-button-container').append(`
                      <div class="w-100">
                       <div class="form-group d-block w-100">
                             <label for="password">Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Password">
                       </div>
                       <div class="form-group d-block w-100">
                            <label for="retype-password">Retype password</label>
                            <input type="password" class="form-control" id="retype-password" placeholder="Retype password">
                            <small class="text-danger w-100" id="error-msg"></small>
                       </div>
                    </div>
                    <button id="btn-update-profile" class="btn btn-primary ml-auto">Update your profile</button>
            `)
            $('#update-button-container button').click(handleUpdateUserInfo);
            $('#retype-password').change(function (e) {
                if ($('#password').val() !== $(this).val()) {
                    $('#error-msg').html('Your input password does not match please check it out');
                    $('#update-button-container button').prop('disabled', true);
                } else {
                    $('#update-button-container button').prop('disabled', false);
                }

            });

        } else {
            $('#update-button-container button').off('click');
            $('#update-button-container button').remove();
            $('#update-button-container').html('');
        }
        readOnly = !readOnly;


    });
});


function handleUpdateUserInfo() {
    const firstName = $('#firstname').val();
    const lastName = $('#lastname').val();
    const phoneNumber = $('#phone-number').val();
    const address = $('#contact-information').val();
    const avatar_image_url = $('#avatar-image-url').val();
    const password = $('#password').val();
    const email = $('#email-address').val();
    console.log(window.localStorage.getItem('image_url'))
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



    var settings = {

        "url": "/api/users/update-profile",
        "method": "PUT",
        "data":data
    };

    $.ajax(settings).done(function (response) {
        $('#root-layout-container').html(`
            <div class="modal bd-example-modal-sm">
            <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <span class="text-success">Update Info success</span>
            </div>
            </div>
            </div>
        `)
    });


}