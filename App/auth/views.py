from flask import render_template, redirect, request, url_for, flash
from flask.ext.login import login_user,login_required,logout_user,current_user
from . import auth
from ..models import User
from .forms import LoginForm,RegistrationForm,ChangeForm
from .. import db

@auth.route('/login',methods = ['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
    	user = User.query.filter_by(email=form.email.data).first()
    	if user is not None and user.verify_password(form.password.data):
    		login_user(user,form.remember_me.data)
    		return redirect(request.args.get('next') or url_for('Main.index'))
    	flash('Invalid username or password.')
    return render_template('auth/login.html', form=form)

@auth.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User(email=form.email.data,
                    username=None,
                    password=form.password.data)
        db.session.add(user)
        db.session.commit()
        flash('creat user ok.')
        return redirect(url_for('auth.login'))
    return render_template('auth/register.html', form=form)

@auth.route('/logout')
@login_required
def logout():
	logout_user()
	flash('logout ok')
	return redirect(url_for('Main.index'))

@auth.route('/change', methods=['GET', 'POST'])
def change():
    form = ChangeForm()
    if form.validate_on_submit():
        if current_user.verify_password(form.old_password.data):
        	current_user.password = form.password.data
        	db.session.add(current_user)
        	flash('change password ok.')
        	return redirect(url_for('Main.index'))
        else:
        	flash('Invalid password')
    return render_template('auth/change.html', form=form)