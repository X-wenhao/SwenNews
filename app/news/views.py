from flask import render_template, redirect, request, url_for, flash,request,jsonify,session
from flask_login import current_user
import datetime
from . import snews
from ..models import News, User, news_types
from .. import db
import random

@snews.route('/SwenNews')
def index():
    return render_template('main.html')

