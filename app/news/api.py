from flask import request, jsonify
from flask_login import current_user
import datetime
from . import news
from ..models import News, User, news_types
from .. import db


@news.route("/SwenNews/api/v1/news", methods=['GET'])
def news_api_news_get():
    args = request.args
    re = {}

    for key in ['news_type', 'time', 'hot']:
        if args.get(key) is None:
            re['status'] = 0
            re['err_mes'] = 'args error'
            return jsonify(re, 400)

    if args['news_type'] not in news_types or \
       args.get['time'] not in [0, 1] or args.get['hot'] not in [0, 1]:
        re['status'] = 0
        re['err_mes'] = 'Not Found'
        return jsonify(re, 404)

    if args['time'] == 1:
        if args['news_type'] != 'all':
            news_list = News.query.filter_by(news_type=args['news_type']).order_by(News.date).all()
        else:
            news_list = News.query.order_by(News.date).all()
        news_list = news_list[:30]
    else:
        if args['news_type'] != 'all':
            news_list = News.query.filter_by(news_type=args['news_type']).all()
        else:
            news_list = News.query.all()
        news_list = news_list[:30]

    if News.query.count() < 30:
        count = News.query.count()
    else:
        count = 30
    for i in range(count):
        user = User.query.filter_by(id=news_list[i].user_id).first()
        re[i] = {
             'id': news_list[i].id,
             'title': news_list[i].title,
             'news_type': news_list[i].news_type,
             'username': user.username,
             'datetime': news_list[i].date
        }
    return jsonify(re, 205)


@news.route("/SwenNews/api/v1/news/<id>", methods=['GET'])
def news_api_news_return(id):
    re = {}
    max_count = News.query.count()
    if id > max_count:
        re['err_mes'] = 'Not Found'
        return jsonify(re, 404)

    one_new = News.query.filter_by(id=id).first()
    one_new.hot_count += 1
    user = User.query.filter_by(id=one_new.user_id).first()
    re = {
        'id': one_new.id,
        'title': one_new.title,
        'content': one_new.content,
        'news_type': one_new.news_type,
        'username': user.username,
        'datetime': one_new.date
    }
    return jsonify(re, 205)


@news.route("/SwenNews/api/v1/news/news", methods=['POST'])
def news_api_create_news():
    args = request.get_json()
    re = {}
    for key in ['title', 'content', 'news_type']:
        if not args.get(key):
            re['status'] = 0
            re['err_mes'] = 'args error'
            return jsonify(re, 400)

    if args['news_type'] not in news_types or len(args['title']) > 64:
        re['status'] = 0
        re['err_mes'] = 'bad request'
        return jsonify(re, 403)

    current_id = current_user.get_id()
    news_create = News(title=args['title'], content=args['content'], news_type=args['news_type'], user_id=current_id)
    db.session.add(news_create)
    db.session.commit()
    re['status'] = 1
    return jsonify(re, 201)


@news.route("/SwenNews/api/v1/news/list", methods=['GET'])
def news_api_return_all_news():
    user = User.query.filter_by(id=current_user.get_id()).first()
    all_news = user.news.all()
    lens = len(user.news.all())
    re = {}
    for i in range(lens):
        re[i] = {
            'id': all_news[i].id,
            'title': all_news[i].title,
            'news_type': all_news[i].news_type,
            'datetime': all_news[i].date
        }
    return jsonify(re, 205)




