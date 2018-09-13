//

var sendinblue = require('sendinblue-api');

module.exports = {
	createMailer: function(apikey) {

		const SENDER_EMAIL = "support@prologes.com";
		const SENDER_NAME = "Prologes support";

		const receiver = function(to, name) {
			var receiver = {};
			receiver[to] = name ? name : to;
			return receiver;
		}

		const sender = function() {
			return [SENDER_EMAIL, SENDER_NAME];
		}

		const sendTransactionalMail = function(to, subject, content) {
			var sendinClient = new sendinblue({"apiKey": apikey, "timeout": 5000});

			var emailData = {
				"to": receiver(to),
				"from": sender(),
				"html": content,
				// "text": content.text
				"subject": subject
			};

			return new Promise(function(success, fail){
				sendinClient.send_email(emailData, function(err, response){
					if(response.code === 'success') {
						success(response);
					} else {
						fail(response);
					}
				});
			});
		};

		return {
			sendTransactionalMail: sendTransactionalMail
		};
	}
};