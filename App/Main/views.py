from datetime import datetime
from flask import render_template,session,redirect,url_for
from flask import render_template

from . import main
from .froms import NameForm
from .. import db
from ..models import User

@main.route('/',methods = ['GET','POST'])
def index():
    #db.create_all()
    form = NameForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.name.data).first() 
        if user is None:
            user = User(username = form.name.data)
            db.session.add(user)
            session['known'] = False
        else:
            session['known'] = True
        session['name'] = form.name.data 
        form.name.data = ''
        return redirect(url_for('.index'))
    #return '<h1>Hello World</h1>'
    return render_template('index.html',
        form = form , name = session.get('name') , known = session.get('known',False) , current_time = datetime.utcnow())

@main.route('/playBall')
def ball():
    return render_template('/play/ball.html')

@main.route('/playSnake')
def snake():
    return render_template('/play/snake.html')

@main.route('/playMini')
def miniPlay():
    return render_template('/mini/miniPlay.html')