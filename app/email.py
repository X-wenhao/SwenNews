# -*- coding=utf-8 -*-
from . import mail
from flask_mail import Message
from flask import render_template, current_app
from threading import Thread

def send_async_email(app, msg): 
    with app.app_context(): 
        mail.send(msg) 

def send_email(to, subject, content, **kwargs):
    app = current_app._get_current_object()
    msg = Message("【SWENNEWS】："+subject,sender='as_stranger@126.com',recipients=[to])
    msg.body =content
    thr = Thread(target=send_async_email, args=[app, msg]) 
    thr.start() 
    return thr