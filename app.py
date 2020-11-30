from . import create_app
from flask import render_template
from flask_login import login_required, current_user

app = create_app()


@app.errorhandler(404)
@login_required
def page_not_found(e):
    data = dict(title='Page Not Found', page_404_active=True, name=current_user.name)
    return render_template('404.html', **data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
