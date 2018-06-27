from datetime import datetime
import hashlib
from werkzeug.security import generate_password_hash, check_password_hash
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from flask import current_app, request, url_for
from flask_login import UserMixin, AnonymousUserMixin
#from app.exceptions import ValidationError
from . import db, login_manager

news_types=['时政','娱乐']

class User(UserMixin, db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    #email = db.Column(db.String(64), unique=True, index=True)
    username = db.Column(db.String(64), unique=True, index=True)
    #role_id = db.Column(db.Integer, db.ForeignKey('roles.id'))
    password_hash = db.Column(db.String(128))
    confirmed = db.Column(db.Boolean, default=False)
    news = db.relationship('News', backref='user',
                                lazy='dynamic')
    
    '''
    #name = db.Column(db.String(64))
    #location = db.Column(db.String(64))
    #about_me = db.Column(db.Text())
    #member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    #last_seen = db.Column(db.DateTime(), default=datetime.utcnow)
    #avatar_hash = db.Column(db.String(32))
    #posts = db.relationship('Post', backref='author', lazy='dynamic')
    #followed = db.relationship('Follow',
                               foreign_keys=[Follow.follower_id],
                               backref=db.backref('follower', lazy='joined'),
                               lazy='dynamic',
                               cascade='all, delete-orphan')
    #followers = db.relationship('Follow',
                                foreign_keys=[Follow.followed_id],
                                backref=db.backref('followed', lazy='joined'),
                                lazy='dynamic',
                                cascade='all, delete-orphan')
    #comments = db.relationship('Comment', backref='author', lazy='dynamic')
    '''

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

    from models import User
    return User.query.filter_by(id=user_id).first()

class News(db.Model):
    ___tablename__="news"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(64), unique=True, index=True)
    content=db.Column(db.Text)
    news_type=db.Column(db.String(10), index=True)
    date=db.Column(db.DateTime)
    checked=db.Column(db.Integer,default=-1)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    def __init__(self, **kwargs):
        super(News, self).__init__(**kwargs)

    def __repr__(self):
        return '<News %r>' % self.title

