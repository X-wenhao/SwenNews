# -*- coding=utf-8 -*-
import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY =os.urandom(64)
    SQLALCHEMY_COMMIT_ON_TEARDOWN = True
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_DATABASE_URI =  'sqlite:///' + os.path.join(basedir, 'data.sqlite')
    #MAIL_SERVER = 'smtp.126.com'
    #MAIL_USE_SSL = True
    #MAIL_USE_TLS = False
    #MAIL_PORT = '465'
    # app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    # app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
   # MAIL_USERNAME = 'as_stranger@126.com'
    #MAIL_PASSWORD = 'test126'
    MAIL_SERVER = 'smtp.126.com'
    MAIL_PORT = 465
    MAIL_USE_SSL = True
    MAIL_USE_TLS = False
    MAIL_USERNAME = 'as_stranger@126.com'
    MAIL_PASSWORD = 'test126'

    AVATAR_FOLDER=os.path.join(basedir,"static/user/avatar")

    @staticmethod
    def init_app(app):
        pass