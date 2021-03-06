class Addresses {

    constructor() {
        this.data = [];
        this.currentSelected = undefined;
    }

    renderOptionsAddress() {
        $('#select-address-delivery').html(this.data.reduce((acc, dat) => acc + `
            <option value="${dat._id}">
                ${dat.address_text}</option>
            `, ''))
        if (this.data.length > 0) {
            if (!this.currentSelected) {
                this.renderAddressSideBar(0);
            } else {
                this.renderAddressSideBar(this.currentSelected);
            }
        }
        $('.select-container').change(() => {
            const index = this.data.findIndex(option => option._id === $('#select-address-delivery').val());
            this.currentSelected = index;
            this.renderAddressSideBar(index);
        });

    }

    renderAddressSideBar(position) {
        let selectProduct = this.data[position];
        $('#user-shipping-address').html(
            `
                <h4 class="w-100 text-center py-3 px-5 mb-3  card-address-title" style="color: white">
                            Your address list</h4>
               <div class="d-flex my-2  px-4 align-items-baseline">
                    <h5>Receiver's name: </h5>
                    <div style="flex:1;"></div>
                    <h5>${selectProduct['full_name']}</h5>
                </div>
                <div class="d-flex my-2  px-4">
                    <h5>Ward: </h5>
                    <div style="flex:1;"></div>
                    <h5>${selectProduct['ward']}</h5>
                </div>
                <div class="d-flex my-2  px-4">
                    <h5>District: </h5>
                    <div style="flex:1;"></div>
                    <h5>${selectProduct['district']}</h5>
                </div>
                <div class="d-flex my-2  px-4">
                    <h5>Province: </h5>
                    <div style="flex:1;"></div>
                    <h5>${selectProduct['province']}</h5>
                </div>

                <div class="d-flex my-2  px-4">
                    <h5>Address: </h5>
                    <div style="flex:1;"></div>
                    <h5>${selectProduct['address_text']}</h5>
                </div>
            `
        )
    }

    showErrorAddressSideBar(error) {

    }

    updateData() {
        fetchData('/api/address/all-addresses').then(r => {
                this.data = r;
                this.renderOptionsAddress();
            }
        )
    }
}

const addresses = new Addresses();

$(window).ready(function () {

    addresses.updateData();

    $('select[name="provinceOrCity"]').change(function () {

        fetchData(`/api/address/district/${$(this).val()}`)
            .then(data => {
                renderOptions($('select[name="district"]'), data, 'district')
            })

    });

    $('select[name="district"]').change(function () {
        fetchData(`/api/address/ward/${$(this).val()}`)
            .then(data => {
                renderOptions($('select[name="ward"]'), data, 'ward');
            })
    });

    $('#add-address-form').submit(function (e) {
        e.preventDefault();
        const data = {
            "phoneNumber": $('#phoneNumber').val(),
            "fullName": $("#fullName").val(),
            "address_text": $("#address").val(),
            "note": $("#note").val(),
            "userID": $("#userID").val(),
            "provinceID": $("#provinceOrCity").val(),
            "districtID": $("#district").val(),
            "wardID": $('#ward').val(),

        };
        const settings = {
            "url": "/api/address/save-address",
            "method": "POST",
            type: "application/json",
            data,
            success: function () {
                showMessage('Added an address', false);
                addresses.updateData();
            },
            error: function () {
                showMessage('Added address fail', true)
            }

        };
        $.ajax(settings);

    })

});

//address-select
//user-shipping-address

function showMessage(message, error = true) {
    $('#message').show();

    if (error) {
        $('#message').addClass('alert-danger')
            .html(message);
    } else {
        $('#message').addClass('alert-success')
            .html(message);
    }

    setTimeout(() => {
        $('#message')
            .hide()
            .removeClass('alert-danger')
            .removeClass('alert-success')
            .html()
        ;
    }, 1500)
}

function fetchData(URL) {
    return fetch(URL).then(result => result.json());
}

function renderOptions(select, data, type) {
    const html = [{name: 'Select ' + type}, ...data].reduce((acc, option) => acc + `<option value="${option._id}">${option.name}</option>`, '');
    select.html(html);
}