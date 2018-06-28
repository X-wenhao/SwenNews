from flask import render_template, redirect, request, url_for, flash,request,jsonify
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import auth
from .. import db
from ..models import User
from ..email import send_email

@auth.before_app_request
def before_request():
    if current_user.is_authenticated \
            and not current_user.confirmed \
            and request.endpoint[:5] != 'auth.' \
            and request.endpoint != 'static':
        return redirect(url_for('auth.unconfirmed'))

@auth.route("/SwenNews/api/v1/session",methods=['GET'])
#@login_required
def auth_api_session_get():
    re={'status': 1}
    re['user_id']=current_user.get_id()
    print(current_user)
    if  re['user_id'] is None:
        re['user_id']=-1 
        re['status']=0
    return jsonify(re)


@auth.route("/SwenNews/api/v1/session",methods=['POST'])
def auth_api_session_post():
    args = request.get_json()
    for key in ['username', 'password']:
        if not args.get(key):
            return jsonify({'status': 0})

    user=User.query.filter_by(username=args['username']).first() 
    if user is None or not user.verify_password(args['password']):
        return jsonify({'status': 0})
    user=User.query.filter_by(mail=args['username']).first() 
    if user is None or not user.verify_password(args['password']):
        return jsonify({'status': 0})
    login_user(user)
    print(user)
    print(current_user)
    return jsonify({'status': 1})


@auth.route("/SwenNews/api/v1/session",methods=['DELETE'])
#@login_required
def auth_api_session_delete():
    logout_user()
    return jsonify({'status': 1})


@auth.route("/SwenNews/api/v1/user",methods=['GET'])
def auth_api_user_get():
    args = request.get_json()
    for key in ['username']:
        if not args.get(key):
            return jsonify({'status': 0})

    re={'status': 1,'exist':1}
    if  User.query.filter_by(username=args['username']).first() is None:
        re['exist']=0
    return jsonify(re)


@auth.route("/SwenNews/api/v1/user",methods=['POST'])
def auth_api_user_post():
    args = request.get_json()
    for key in ['username', 'password','mail']:
        if not args.get(key):
            return jsonify({'status': 0})
    
    user=User.query.filter_by(username=args['username']).first() 
    if user is not None:
        return jsonify({'status': 0})
    db.session.add(User(username=args['username'],\
                                password=args['password'],
                                mail=args['mail']
                                ))
    db.session.commit()
    login_user(user)
    try:
        token = current_user.generate_confirmation_token()  
        send_email(current_user.mail, 'Confirm Your Account: ',
                url_for('auth.comform',token))
        return jsonify({"status":1})
    except:
        return jsonify({"status":0})
    return jsonify({'status': 1})

@auth.route("/SwenNews/api/v1/mail",methods=["GET"])
#@login_required
def auth_api_mail_get():   
    try:
        token = current_user.generate_confirmation_token()  
        send_email(current_user.mail, 'Confirm Your Account: ',
                url_for('auth.comform',token))
        return jsonify({"status":1})
    except:
        return jsonify({"status":0})

