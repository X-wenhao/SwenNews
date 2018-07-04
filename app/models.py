# -*- coding=utf-8 -*-
from datetime import datetime
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask import current_app, request, url_for
from flask_login import UserMixin, AnonymousUserMixin
#from app.exceptions import ValidationError
from . import db,login_manager

news_types=['时政','娱乐']

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    #email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    #role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    mail = db.Column(db.String(128) ,index=True)
    confirmed = db.Column(db.Boolean, default=False)
    news = db.relationship('News', backref='user',
                                lazy='dynamic')
    

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def generate_confirmation_token(self,expiration=3600):
        s = Serializer(current_app.config['SECRET_KEY'], expiration)
        return s.dumps({'confirm':self.id})

    def confirm(self,token):
        s = Serializer(current_app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except:
            return False 
        if data.get('confirm') != self.id:
            return False
        self.confirmed = True
        db.session.add(self)
        return True 
    
    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User %r>' % self.username


class AnonymousUser(AnonymousUserMixin):
    def can(self, permissions):
        return False

    def is_administrator(self):
        return False

login_manager.anonymous_user = AnonymousUser

@login_manager.user_loader
def load_user(user_id):
    """Load the user's info."""
    return User.query.filter_by(id=user_id).first()

class News(db.Model):
    ___tablename__="news"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), unique=True, index=True)
    content=db.Column(db.Text)
    news_type=db.Column(db.String(10), index=True)
    
    date=db.Column(db.DateTime,default=datetime.now())
    hit_count=db.Column(db.Integer,default=0)
    checked=db.Column(db.Integer,default=-1)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def __init__(self, **kwargs):
        super(News, self).__init__(**kwargs)

    def __repr__(self):
        return '<News %r>' % self.title


