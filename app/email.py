# -*- coding=utf-8 -*-
from . import mail
from flask_mail import Message
from flask import render_template, current_app

def send_email(to, title, content, **kwargs):
    app = current_app._get_current_object()
    msg = Message(title,sender='as_stranger@126.com',recipients=[to])
    msg.body =content
    #msg.html = render_template(template + '.html', **kwargs)
    with app.app_context():
        mail.send(msg) #发射