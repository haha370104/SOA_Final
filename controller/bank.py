from flask import Blueprint, current_app, render_template, request, url_for
from model.bank_product import bank_product
import json

bank_bp = Blueprint('bank', __name__)


@bank_bp.route('/update/')
def update():
    return '蓝图测试'


@bank_bp.route('/get_count/<int:bank_type>/')
def get_count(bank_type):
    dic = {1: '中国工商银行', 2: '中国农业银行', 3: '中国建设银行', 4: '交通银行'}
    count = bank_product.query.filter(bank_product.bank_name == dic[bank_type]).count()
    return json.dumps({'count': count})


@bank_bp.route('/get_records/<int:bank_type>/<int:page_num>/<int:page_size>/')
def get_records(bank_type, page_num, page_size):
    dic = {1: '中国工商银行', 2: '中国农业银行', 3: '中国建设银行', 4: '交通银行'}
    products = bank_product.query.filter(bank_product.bank_name == dic[bank_type]).offset(page_num * 14 - 14).limit(
        page_size)
    ajax = []
    for product in products:
        ajax.append(product.to_brief_json())
    return json.dumps(ajax)


@bank_bp.route('/get_detail/<string:ID>/')
def get_detail(ID):
    product = bank_product.query.get(ID)
    if product != None:
        return json.dumps(product.to_json())
    else:
        return json.dumps({'Error': '404'})


@bank_bp.route('/index/')
def index():
    return render_template('Index.html')
