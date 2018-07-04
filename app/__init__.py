# -*- coding=utf-8 -*-
from flask import Flask
#from flask_bootstrap import Bootstrap
from flask_mail import Mail
from flask_moment import Moment
from flask_sqlalchemy import SQLAlchemy
from .config import Config
import os
from flask_login import LoginManager
from flask_admin import Admin


basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

dbdir=os.path.join(basedir,'data.db')


#bootstrap = Bootstrap()
mail = Mail()
moment = Moment()
db = SQLAlchemy()
admin=Admin( name='SwenNews', template_mode='bootstrap3')

login_manager = LoginManager()
login_manager.session_protection = "strong"
login_manager.login_message = "Please login to access this page."
login_manager.login_message_category = "info"


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    Config.init_app(app)

    #bootstrap.init_app(app)
    mail.init_app(app)
    moment.init_app(app)
    db.init_app(app)
    login_manager.setup_app(app)
    admin.init_app(app)

    from .admin import init_admin
    init_admin()

    app.jinja_env.variable_start_string="{{ "
    app.jinja_env.variable_end_string=" }}"

    from .auth import auth as auth_blueprint
    app.register_blueprint(auth_blueprint)

    from .news import snews as news_blueprint
    app.register_blueprint(news_blueprint)

    return app


def init_db():
    app=create_app()
    with app.app_context():
        from app.models import User,News
        db.create_all()
        db.session.add(User(username='admin',password='admin'))
        db.session.commit()
    return app



if __name__=="__main__":
    app.run(host='127.0.0.1',port=8080,threaded=True,debug=True)