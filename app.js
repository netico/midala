/*
 * Midala
 *
 * Copyright 2020 netico <netico@riseup.net>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 *
 *
 */

const express = require('express');
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');

const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/assets'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/feather-icons/dist/'));
app.use(express.static(__dirname + '/node_modules/jquery/dist/'));

// Routing
app.get('/', function(req, res){
 	res.render('index', {
        page: 'home'
    });
});

app.get('/manifesto', function(req, res){
 	res.render('manifesto', {
        page: 'manifesto'
    });
});

app.get('/support', function(req, res){
 	res.render('support', {
        page: 'support',
        message: '',
    });
});

app.get('/faq', function(req, res){
 	res.render('faq', {
        page: 'faq'
    });
});

app.post('/send', function (req, res) {
	let transporter = nodeMailer.createTransport({
		host: 'localhost',
		port: 25,
		secure: false,
	});
	let mailOptions = {
		from: '"' + req.body.name + '" <' + req.body.sender + '>',
		to: '"Midala" <info@midala.net>',
		subject: 'Richiesta di supporto da ' + req.body.name,
		text: req.body.body
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.log(error);
		  	res.render('support', {
				page: 'support',
				message: '<div class="alert alert-danger">Si è verificato un problema. Riprova più tardi!</div>'
			});
		} else {
			console.log('Message %s sent: %s', info.messageId, info.response);
			res.render('support', {
				page: 'support',
				message: '<div class="alert alert-success">Messaggio inviato con successo. Grazie!</div>'
			});
		}

	});
});

app.listen(port, 'localhost', function() {
  console.log(`Midala listening at http://localhost:${port}`);
});
