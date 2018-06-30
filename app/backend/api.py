from flask import render_template, redirect, request, url_for, flash,request,jsonify
from flask_login import login_user, logout_user, login_required, \
    current_user
from .. import db
from ..models import User,News
from . import backend

@backend.route("/SwenNews/backend/auth",methods=['GET'])
def backend_api_judge_admin():
    if current_user == "admin":
        return jsonify({'status': 1})
    else:
        return jsonify({'status': 0})

@backend.route("/SwenNews/backend/news",methods=['GET'])
def backend_api_get_unchecked_news():
    #返回审核结果：0拒绝/1通过
    num = News.query.filter_by(checked=0).count()
    news = News.query.filter_by(checked=0).all()
    n=1
    L={}
    for key in news:
        id  = key.id
        title = key.title
        content = key.content
        user = key.user
        datetime = key.datetime
        ele = {'id':id,'title':title,'content':content,'user':user,'datetime':datetime}
        L[str(n)]=ele
        n = n + 1
    return jsonify(L)

@backend.route("/SwenNews/backend/news",methods=['PUT'])
def backend_api_check_news():
    args = request.get_json()
    for key in ['id','checked']:
        if not args.get(key):
            return jsonify({'status': 0})
    id = args['id']
    checked = args['checked']
    if checked==1:
        news_add = News.query.filter_by(id=id).first()
        db.session.add(news_add)
        db.session.commit()
        return jsonify({'status': 1})
    if checked==0:
        return jsonify({'status': 0})



@backend.route("/SwenNews/backend/news/mod_username",methods=['PUT'])
def backend_api_mod_password():
    args = request.get_json()
    for key in ['password']:
        if not args.get(key):
            return jsonify({'status': 0})
    target_user = User.query.filter_by(id=current_user.id).first()
    #target_user.username = args['username']
    target_user.password = args['password']
    db.session.add()
    db.session.commit()
    return jsonify({'status': 1})
