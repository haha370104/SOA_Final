from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from db_config import db_url

app = Flask(__name__, static_url_path='/static')
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'
app.config['SQLALCHEMY_DATABASE_URI'] = db_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['ALLOW_FILE'] = ['jpg', 'jpeg', 'gif', 'png', 'bmp']
db = SQLAlchemy(app)
