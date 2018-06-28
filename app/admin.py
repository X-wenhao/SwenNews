from flask_admin.contrib.sqla import ModelView
from .models import User,News
from flask_login import current_user
from . import db,admin

def init_admin():
    #admin.add_view(ModelView(User, db.session))
    admin.add_view(News_v(db.session))    

class News_v(ModelView):
    '''
    def is_accessible(self):
        return current_user.is_authenticated() and current_user.username=='admin'
    '''
    can_delete=False
    can_create=False
    column_formatters={
        'User':lambda v, c, m, p: m.username
    }

    def __init__(self, session, **kwargs):
        # You can pass name and other parameters if you want to
        super(News_v, self).__init__(News, session, **kwargs)
    