from flask import render_template, redirect, request, url_for, flash,request,jsonify,session,current_app
from flask_login import login_user, logout_user, login_required, \
    current_user
from . import auth
from .. import db
from ..models import User,News,Comment
from ..email import send_email
from werkzeug.utils import secure_filename
from PIL import Image
import os,random

@auth.before_app_request
def before_request():
    print(request.endpoint)
    if current_user.is_authenticated \
            and not current_user.confirmed \
            and request.endpoint[:5] != 'auth.' \
            and request.endpoint != 'static':
        return redirect(url_for('auth.unconfirmed'))

@auth.route("/SwenNews/api/v1/session",methods=['GET'])
#@login_required
def auth_api_session_get():
    if not current_user.is_authenticated:
        return jsonify({"status":0})
    re={'status': 1}
    re['id']=current_user.id
    re['username']=current_user.username
    re['mail']=current_user.mail
    
    if  re['id'] is None:
        re['id']=-1 
        re['status']=0
        re['error_msg']='can not get info of current user'
        return jsonify(re),403
    re['avatar']=os.path.join(current_app.config['AVATAR_FOLDER'],str(re['id'])+'.jpg')
    if  not os.path.isfile(re['avatar']):    
        re['avatar']="/static/user/avatar/0.jpg"
    return jsonify(re),200


@auth.route("/SwenNews/api/v1/session",methods=['POST'])
def auth_api_session_post():
    args = request.get_json()
    print(args)
    re={'status': 0}
    for key in ['username', 'password']:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400

    user=User.query.filter_by(username=args['username']).first() 
    if user is None or not user.verify_password(args['password']):
        user=User.query.filter_by(mail=args['username']).first() 
        if user is None or not user.verify_password(args['password']):
            re['error_msg']='username or password error'
            return jsonify(re),400
    login_user(user)
    return jsonify({'status': 1}),201


@auth.route("/SwenNews/api/v1/session",methods=['DELETE'])
@login_required
def auth_api_session_delete():
    logout_user()
    return jsonify({'status': 1})


@auth.route("/SwenNews/api/v1/user",methods=['GET'])
def auth_api_user_get():
    args = request.args
    re={'status': 0}
    for key in ['username']:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400

    re={'status': 1,'exist':1}
    if  User.query.filter_by(username=args['username']).first() is None and User.query.filter_by(mail=args['username']).first() is None:
        re['exist']=0
    return jsonify(re),200


@auth.route("/SwenNews/api/v1/user",methods=['POST'])
def auth_api_user_post():
    args = request.get_json()
    re={'status': 0}
    for key in ['username', 'password','mail']:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400
    if len(args['username'])<5 or len(args['username'])>12 :
        return jsonify({"status":0,"error_msg":"args error"}),400

    user=User.query.filter_by(username=args['username']).first() 
    if User.query.filter_by(username=args['username']).first()  is not None or \
            User.query.filter_by(mail=args['mail']).first()  is not None:
        return jsonify({'status': 0,"error_msg":"username exists"}),403
    user=User(username=args['username'],\
                                password=args['password'],
                                mail=args['mail']
                                )
    db.session.add(user)
    db.session.commit()
    try:
        token = user.generate_confirmation_token()  
        send_email(user.mail, 'Confirm Your Account: ',
                url_for('auth.confirm',token=token,_external=True))
        return jsonify({"status":1}),202
    except:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"status":0,"error_msg":"can not send mail"}),500


@auth.route("/SwenNews/api/v1/user",methods=["PUT"])
@login_required
def auth_api_user_username_put():
    args=request.get_json()
    re={"status":0}
    if args.get('username'):
        if  User.query.filter_by(username=args['username']).first():
            re["error_msg"]='args error'
            return jsonify(re),400
        current_user.username=args["username"]
    if args.get("password"):
        current_user.password=args["password"]
    db.session.add(current_user)
    db.session.commit()
    
    return jsonify({"status":1}),200

@auth.route("/SwenNews/api/v1/user/password",methods=["PUT"])
@login_required
def auth_api_user_password_put():
    args=request.get_json()
    re={"status":0}
    if not args.get("password"):
        re['error_msg']='args error'
        return jsonify(re),400
    if not args.get("auth_code") or args["auth_code"]!=session["auth_code"]:
        return jsonify({"status":0,"error_msg":"auth code error"}),403
    current_user.password=args["password"]
    db.session.add(current_user)
    db.session.commit()
    #session.remove("auth_code")
    return jsonify({"status":1}),200

@auth.route("/SwenNews/api/v1/user/avatar",methods=["POST"])
@login_required
def auth_api_user_avatar_put():
    if not current_user.is_authenticated :
        return jsonify({"status":0,"error_msg":"args error"}),400
    try:
        file = request.files['file']
        if not file:
            return jsonify({"status":0})
        size = (192, 192)
        im = Image.open(file)
        im.resize(size)
        if file and allowed_file(file.filename):
            filename = str(current_user.id) + '.jpg' 
            im.save(os.path.join(current_app.config['AVATAR_FOLDER'],filename))
        return jsonify({"status":1}),200
    except:
        return jsonify({"status":0,"error_msg":"can not upload avatat"}),500

@auth.route("/SwenNews/api/v1/mail/<type>",methods=["GET"])
#@login_required
def auth_api_mail_get(type):
    if type=="confirm":
        try:
            token = current_user.generate_confirmation_token()  
            send_email(current_user.mail, 'Confirm Your Account: ',
                    url_for('auth.comfirm',token=token,_external=True))
            return jsonify({"status":1}),202
        except:
            return jsonify({"status":0,"error_msg":"can not send mail"}),500
    if type=="auth_code":
        try:
            auth_code=  random.randint(100000,999999)
            send_email(current_user.mail, 'Your Auth Code: ',auth_code)
            return jsonify({"status":1}),202
        except:
            return jsonify({"status":0,"error_msg":"can not send mail"}),500

def allowed_file(filename):
	return '.' in filename and filename.rsplit('.',1)[1] in ['png','jpg','jpeg']

@auth.route("/SwenNews/api/v1/collection",methods=["GET"])
@login_required
def auth_api_collection_get():
    if int(request.args.get("user_id"))!=current_user.id:
        return jsonify({"status":0}),400
    user = current_user
    print(user.collections)
    all_news = user.collections
    lens = len(all_news)
    re = {"status":1}
    for i in range(lens):
        re[str(i)] = {
            'id': all_news[i].id,
            'title': all_news[i].title,
            'news_type': all_news[i].news_type,
            'datetime': all_news[i].date.isoformat()[:10],
        }
    return jsonify(re) ,200

@auth.route("/SwenNews/api/v1/collection",methods=["POST"])
@login_required
def auth_api_collection_post():
    args=request.get_json()
    print(args)
    re={"status":0}
    for key in ["user_id","news_id"]:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400
    if args.get("user_id")!=current_user.id:
        return jsonify(re),400
    news=News.query.get(args["news_id"])
    if not news:
        return jsonify(re),400
    current_user.collections.append(news)
    db.session.add(current_user)
    db.session.commit()
    return jsonify({"status":1}),200

@auth.route("/SwenNews/api/v1/collection",methods=["DELETE"])
@login_required
def auth_api_collection_delete():
    args=request.get_json()
    re={"status":0}
    for key in ["user_id","news_id"]:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400
    if args.get("user_id")!=current_user.id:
        return jsonify(re),400
    news=News.query.get(args["news_id"])
    print(news)
    if not news:
        return jsonify(re),400
    current_user.collections.remove(news)
    db.session.add(current_user)
    db.session.commit()
    return jsonify({"status":1}),200

@auth.route("/SwenNews/api/v1/comment",methods=["POST"])
@login_required
def auth_api_comment_post():
    args=request.get_json()
    re={"status":0}
    for key in ["user_id","news_id","content"]:
        if not args.get(key):
            re['error_msg']='args error'
            return jsonify(re),400
    if args.get("user_id")!=current_user.id:
        return jsonify(re),400
    news=News.query.get(args["news_id"])
    print(news)
    if not news:
        return jsonify(re),400
    comment_create = Comment( content=args['content'],  user_id=current_user.id,news_id=args['news_id'])
    db.session.add(comment_create)
    db.session.commit()
    return jsonify({"status":1})