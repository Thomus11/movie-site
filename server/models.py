class AdminRefer(db.Model, SerializerMixin):
    __tablename__ = 'admin_refers'
    id = db.Column(db.Integer, primary_key=True)
    admin_code = db.Column(db.String(50), unique=True, nullable=False)
    branch_location = db.Column(db.String(100), nullable=False)
    till_number = db.Column(db.String(50), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('-admin.admin_refer',)


class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    admin_refer_id = db.Column(db.Integer, db.ForeignKey('admin_refers.id'), nullable=False)

    user = db.relationship('User', backref=db.backref('admin', uselist=False))
    admin_refer = db.relationship('AdminRefer', backref='admin')

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    serialize_rules = ('-user.admin', '-admin_refer.admin',)
