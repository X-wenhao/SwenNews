from flask import Blueprint

snews = Blueprint('snews', __name__)

from . import api,views