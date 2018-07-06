from flask import render_template, redirect, request, url_for, flash,request,jsonify,current_app
from flask_login import login_user, logout_user, login_required, \
    current_user
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from . import auth
from .. import db
from ..models import User

@auth.route('/unconfirmed')
def unconfirmed():
    if current_user.is_anonymous or current_user.confirmed:
        return 'no need'
        return redirect(url_for('main.index'))
    return 'unconfirmed'
    return render_template('auth/unconfirmed.html')

@auth.route('/confirm/<token>')
#@login_required
def confirm(token):
    s = Serializer(current_app.config['SECRET_KEY'])
    try:
        data = s.loads(token)
    except:
        return False 
    user=User.query.get( data.get('confirm'))
    print(user)
    user.confirmed=1
    db.session.add(user)
    db.session.commit()
    if user.confirmed:
        flash('认证成功')
        return redirect(url_for('snews.index'))
    else:
        flash('认证失败,请重新登录并认证')
    #return redirect(url_for('auth.login')) 

@auth.route('/SwenNews/login.html')
def login():
    return render_template('login.html')

@auth.route('/SwenNews/register.html')
def register():
    return render_template('register.html')

@auth.route('/SwenNews/tips.html')
def tips():
    return render_template('tips.html')

@auth.route('/SwenNews/user_center.html')
def user_center():
    return render_template('user_center.html')