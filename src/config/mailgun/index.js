const mailgun = require("mailgun-js");
const mg = mailgun({apiKey: process.env.MAIL_GUN_API_KEY, domain: process.env.DOMAIN});


//      template: 'template.test',
//         'v:message': 'Activate your account',
//         'v:link': link
module.exports.sendMailTest = (link,email)=>{
    const data = {
        from: 'admin@localhost.com',
        to: email,
        subject: 'Hello',
        template: 'template.test',
        'v:message': 'Activate you account',
        'v:link':link,
        'v:title': 'ACTIVE YOUR ACCOUNT',
        text: `To activate your account you must click to the link below:
                ${link}
                `
};
    mg.messages().send(data, function (error, body) {
        console.log(body);
    });

}
