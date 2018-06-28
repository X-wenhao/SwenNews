from flask_admin.contrib.sqla import ModelView
from .models import User,News

from . import db,admin

def init_admin():
    #admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(News, db.session))    
