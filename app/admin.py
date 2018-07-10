# -*- coding=utf-8 -*-
from flask_admin.contrib.sqla import ModelView
from .models import User,News,Comment,news_types
from flask_login import current_user
from . import db,admin
import re

che_ch=[-1,0,1]

def init_admin():
    admin.add_view(User_v(db.session))
    admin.add_view(News_v(db.session))
    admin.add_view(Comment_v(db.session))    

class News_v(ModelView):
    #def is_accessible(self):
    #    return current_user.is_authenticated and current_user.username=='admin'
    can_delete=True
    #can_create=False
    column_formatters={
        'User':lambda v, c, m, p: m.username,
        'content':lambda v,c,m,p:re.sub('<.*?>',"",re.sub(
            "<div.*?/div>","",re.sub(
                "<s.*?/script>","",m.content,flags=re.DOTALL
                ),flags=re.DOTALL)
                ).replace("&nbsp;","").strip()[:90]
    }
    column_searchable_list = ['title']
    form_args=dict(checked=dict(coerce=int))
    form_choices = {
        'checked':list((i,i) for i in che_ch),
        "news_type":list((i,i) for i in news_types)
    }

    form_widget_args = {
                    'content': {
                    'rows': 30
                        }
                    }
    column_default_sort = ('checked')

    column_formatters_detail ={
        'User':lambda v, c, m, p: m.username,
        'content':lambda v,c,m,p:re.sub('<.*?>',"",re.sub(
            "<div.*?/div>","",re.sub(
                "<s.*?/script>","",m.content,flags=re.DOTALL
                ),flags=re.DOTALL)
                ).replace("&nbsp;","").strip()[:90]
    }

    def __init__(self, session, **kwargs):
        # You can pass name and other parameters if you want to
        super(News_v, self).__init__(News, session, **kwargs)
    def scaffold_form(self):

        form_class = super(News_v, self).scaffold_form()

        #form_class.content=1234

        return form_class
    
class User_v(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.username=='admin'
    can_delete=True
    #can_create=False

    def __init__(self, session, **kwargs):
        # You can pass name and other parameters if you want to
        super(User_v, self).__init__(User, session, **kwargs)
    
class Comment_v(ModelView):
    def is_accessible(self):
        return current_user.is_authenticated and current_user.username=='admin'
    can_delete=True
    #can_create=False

    def __init__(self, session, **kwargs):
        # You can pass name and other parameters if you want to
        super(Comment_v, self).__init__(Comment, session, **kwargs)