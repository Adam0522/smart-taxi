
from flask import Blueprint, request, jsonify, session
from src.models.admin import Admin
from src.models.user import db

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'error': 'البيانات ناقصة'}), 400

    admin = Admin.query.filter_by(username=username).first()
    if admin and admin.check_password(password):
        admin.update_last_login()
        db.session.commit()
        session['admin_id'] = admin.id
        return jsonify({
            'message': 'تم تسجيل الدخول بنجاح',
            'admin_id': admin.id,
            'username': admin.username
        })
    return jsonify({'error': 'اسم المستخدم أو كلمة المرور غير صحيحة'}), 401
