from flask import Blueprint, render_template
from flask_login import login_required, current_user

main = Blueprint('main', __name__)


@main.route('/')
@login_required
def index():
    data = dict(title='Dashboard', index_active=True, name=current_user.name)
    return render_template('index.html', **data)


@main.route('/profile')
@login_required
def profile():
    data = dict(title='Profile', profile_active=True, email=current_user.email, name=current_user.name)
    return render_template('profile.html', **data)


@main.route('/css-menu')
@login_required
def css_menu():
    data = dict(title='Top CSS Menu', css_menu_active=True, name=current_user.name)
    return render_template('css-menu.html', **data)
