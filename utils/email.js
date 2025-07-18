import { htmlToText } from 'html-to-text';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import pug from 'pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
	constructor(user, url) {
		this.to = user.email;
		this.firstName = user.name.split(' ')[0];
		this.url = url;
		this.from = `Jack Fabruchi <${process.env.EMAIL_FROM}>`;
	}

	newTransport() {
		if (process.env.NODE_ENV === 'production') {
			// Sendgrid or something else
			return nodemailer.createTransport({
				host: process.env.EMAIL_HOST,
				port: process.env.EMAIL_PORT,
				auth: {
					user: process.env.EMAIL_USERNAME,
					pass: process.env.EMAIL_PASSWORD,
				},
				// Activate in gmail "less secure app" option
			});
		}

		return nodemailer.createTransport({
			host: process.env.EMAIL_HOST,
			port: process.env.EMAIL_PORT,
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
			// Activate in gmail "less secure app" option
		});
	}

	// Send the actual email
	async send(template, subject) {
		// 1. Rendeer HTML based on a pug template
		const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
			firstName: this.firstName,
			url: this.url,
			subject,
		});
		// 2. Define email options
		const mailOptions = {
			from: this.from,
			to: this.to,
			subject,
			html,
			text: htmlToText(html),
		};

		// 3. Create a transport and send email

		await this.newTransport().sendMail(mailOptions);
	}

	async sendWelcome() {
		await this.send('welcome', 'Welcome to the Natours Family!');
	}

	async sendPasswordReset() {
		await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
	}
}
