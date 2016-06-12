from flask import Blueprint, render_template
from model.bank_model import product_list, product_detail, check_product, get_list_by_duration
from flask_restful import Api
import json

bank_bp = Blueprint('bank', __name__)
bank_api = Api(bank_bp)

bank_api.add_resource(product_list, '/get_records/<int:bank_id>/<int:page_num>/<int:page_size>/')
bank_api.add_resource(product_detail, '/get_detail/<string:ID>/')
bank_api.add_resource(check_product, '/check_bank/<int:bank_id>/')
bank_api.add_resource(get_list_by_duration,
                      '/get_list_by_duration/<string:bank_id>/<int:duration>/<string:currencies>/<float:money>/')

