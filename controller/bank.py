from flask import Blueprint, render_template
from model.bank_model import product_list, product_detail, check_product
from flask_restful import Api

bank_bp = Blueprint('bank', __name__)
bank_api = Api(bank_bp)

bank_api.add_resource(product_list, '/get_records/<int:bank_id>/<int:page_num>/<int:page_size>/')
bank_api.add_resource(product_detail, '/get_detail/<string:ID>/')
bank_api.add_resource(check_product, '/check_bank/<int:bank_id>/')


@bank_bp.route('')
@bank_bp.route('/index/')
def index():
    return render_template('Index.html')
