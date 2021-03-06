from flask import request, jsonify
from flask_login import current_user,login_required
import datetime
from . import snews
from ..models import News, User, news_types
from .. import db
import random
import os
import re as rer
@snews.route("/SwenNews/api/v1/news", methods=['GET'])
def news_api_news_get():
    args ={}
    re = {}
    for key in ['page_num','news_type', 'time', 'hot']:
        if request.args.get(key) is None:
            re['status'] = 0
            re['err_mes'] = 'args error'
            return jsonify(re), 400
        args[key]=request.args.get(key) 
        if key !='news_type':
            args[key]=int(args[key])
    if args['news_type'] not in news_types+['all'] or \
       args['time'] not in [0, 1] or args['hot'] not in [0,1]:
        re['status'] = 0
        re['err_mes'] = 'Not Found'
        return jsonify(re), 404
    print(args)
    news_list=[]
    q=News.query.filter_by(checked=1)
    if args['news_type']!='all':
        q=q.filter_by(news_type=args['news_type'])
    if args['time']==1:
        q=q.order_by(News.date.desc())
    if args['hot']==1:
        q=q.order_by(News.hit_count.desc())
    #print(q.all())
    
    news_list=q.limit(5).offset(5*args['page_num']).all()
    if len(news_list)==0:
        return jsonify({"status":0,'error_msg':'page out of index'}),404
    flag=0
    co=[]
    if current_user.is_authenticated:
        co=current_user.collections
    re={'status':1}
    for i in range(len(news_list)):
        flag=0
        user = User.query.filter_by(id=news_list[i].user_id).first()
        for n in co:
            if news_list[i]==n:
                flag=1
        #print(news_list[i].content)
        #print("``````````````````")
        content=news_list[i].content.strip().replace("\u3000","").replace("\n","  ")
        content=rer.sub("</p>","  ",content)
        content=rer.sub("<div.*?/div>","",content,flags=rer.DOTALL)
        content=rer.sub("<.*?>","",content)
        content=content[:120]
        if len(content[:120])>=120:
            content+='......'
        re[str(i)] = {
             'id': news_list[i].id,
             'title': news_list[i].title,
             'content':content,
             'news_type': news_list[i].news_type,
             'username': user.username,
             'datetime': news_list[i].date.isoformat()[:10],
             'flag':flag
        }
    print(re)
    #print(jsonify(re))
    return jsonify(re), 200


@snews.route("/SwenNews/api/v1/news/<id>", methods=['GET'])
def news_api_news_return(id):
    re = {}
    print(id)
    id=int(id)
    max_count = News.query.count()
    if id > max_count:
        re['err_mes'] = 'Not Found'
        return jsonify(re), 404

    one_new = News.query.filter_by(id=id,checked=1).first()
    if not one_new:
        return jsonify({"status":0,"error_msg":"news not exist"}),404
    one_new.hit_count += random.randint(1,4)
    user = User.query.filter_by(id=one_new.user_id).first()
    flag=0
    co=[]
    if current_user.is_authenticated:
        co=current_user.collections
    for n in co:
        if one_new==n:
            flag=1
    re = {
        'id': one_new.id,
        'title': one_new.title,
        'content': one_new.content,
        'news_type': one_new.news_type,
        'username': user.username,
        'datetime': one_new.date.isoformat()[:10],
         'flag':flag,
        'comments':{}
    }
    for i in range(len(one_new.comments.all())):
        comment=one_new.comments.all()[i]
        user=User.query.get(comment.user_id)
        re['comments'][str(i)]={
            "content":comment.content,
            "user_name":user.username,
            "avatar":"/static/user/avatar/"+str(user.id)+'.jpg',
            'datetime': comment.date.isoformat()[:10]
        }
        if  not os.path.isfile(re['comments'][str(i)]['avatar']):    
            re['comments'][str(i)]['avatar']="/static/user/avatar/0.jpg"
    print(re)
    return jsonify(re), 200


@snews.route("/SwenNews/api/v1/news/news", methods=['POST'])
@login_required
def news_api_create_news():
    args = request.get_json()
    re = {}
    for key in ['title', 'content', 'news_type']:
        if not args.get(key):
            re['status'] = 0
            re['err_mes'] = 'args error'
            return jsonify(re), 400

    if args['news_type'] not in news_types or len(args['title']) > 64:
        re['status'] = 0
        re['err_mes'] = 'bad request'
        return jsonify(re), 403

    current_id = current_user.get_id()
    news_create = News(title=args['title'], content=args['content'], news_type=args['news_type'], user_id=current_id)
    db.session.add(news_create)
    db.session.commit()
    re['status'] = 1
    return jsonify(re), 201


@snews.route("/SwenNews/api/v1/news/list", methods=['GET'])
@login_required
def news_api_return_all_news():
    user = current_user
    all_news = user.news.all()
    lens = len(user.news.all())
    re = {"status":1}
    for i in range(lens):
        re[str(i)] = {
            'id': all_news[i].id,
            'title': all_news[i].title,
            'news_type': all_news[i].news_type,
            'datetime': all_news[i].date.isoformat()[:10],
        }
    return jsonify(re) ,200







