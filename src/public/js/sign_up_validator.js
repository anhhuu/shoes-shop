const first_name = document.getElementById('first_name');
const last_name = document.getElementById('last_name');
const phone_number = document.getElementById('phone_number');
const address = document.getElementById('address');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');
const form = document.getElementById('form');


function showError(input, message) {
    const formControl = input.parentElement;
    formControl.className = 'form--control error';

    const small = formControl.querySelector('small');
    small.innerText = message

    setTimeout(()=>{
        small.innerText = '';
        formControl.className = 'form--control';
    },3000);
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.className = 'form--control success'
}

function checkRequired(needLog, ...inputs) {

    let flag = true;
    inputs.forEach(input => {

        if (input.value.trim() === '') {
            if (needLog) {
                showError(input, getFieldName(input) + ' is required');
            }
            flag = false;
        } else {
            if (needLog) {
                showSuccess(input)
            }
        }

    });

    return flag;
}

function getFieldName(input) {
    return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

form.addEventListener('onkeypress', () => {

    if (checkRequired(false, first_name, last_name, email, password, password2, address, phone_number)) {
        return document.querySelector('.form button').className = '';
    }

    document.querySelector('.form button').className = 'disabled';

});

form.addEventListener('submit', function (e) {

    e.preventDefault();
    const required = checkRequired(true, first_name, last_name, email, password, password2, address, phone_number);

    let length = checkLength(first_name, 2, 15)
    length =  checkLength(last_name, 2, 15) && length ;
    length =  checkLength(password, 8, 25) && length;
    if(length){
        checkLength(password2, 8, 25);
    }
    const passwordMatch = checkPasswordMatch(password, password2);
    if (
        required && length &&  passwordMatch
    ) {
        this.submit();
    } else {
        $('#submit-message').html('Can not submit')
        setTimeout(()=>{
            $('#submit-message').html('')
        }, 2000)
    }


})

//Check input length
function checkLength(input, min, max) {

    if (input.value.length < min) {
        showError(input, `${getFieldName(input)} must be at least ${min} charaters`);
    } else if (input.value.length > max) {
        showError(input, `${getFieldName(input)} must be less than ${max} charaters`)
    }

    return min <= input.value.length && input.value.length <= max;
}


function checkPasswordMatch(input1, input2) {

    if (input1.value !== input2.value) {
        showError(input1, `${getFieldName(input1)} does not match`);
        showError(input2, `${getFieldName(input1)} does not match`);
        return false;
    }
    return true;
}

password2.addEventListener('change', function (e) {
    const value = e.target.value;
    if (value !== $('#password').val()) {
        showError(password2, 'The password does not match');
    }
});