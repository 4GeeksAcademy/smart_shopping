from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean(), default=True)

    image_url = db.Column(db.String(500), nullable=True)

    lists = db.relationship('ShoppingList', backref='user', lazy=True)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "image_url": self.image_url
        }


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre
        }


class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)

    precio = db.Column(db.Float, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)

    categoria_id = db.Column(
        db.Integer, db.ForeignKey('category.id'), nullable=True)
    categoria = db.relationship('Category')

    def serialize(self):
        return {
            "id": self.id,
            "nombre": self.nombre,
            "precio": self.precio,
            "categoria": self.categoria.nombre if self.categoria else None,
            "image_url": self.image_url
        }


class ShoppingList(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre_lista = db.Column(db.String(120), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "nombre_lista": self.nombre_lista,
            "user_id": self.user_id
        }


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    lista_id = db.Column(db.Integer, db.ForeignKey(
        'shopping_list.id'), nullable=False)
    producto_id = db.Column(
        db.Integer, db.ForeignKey('product.id'), nullable=False)

    cantidad = db.Column(db.Integer, default=1)
    comprado = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "lista_id": self.lista_id,
            "producto_id": self.producto_id,
            "cantidad": self.cantidad,
            "comprado": self.comprado
        }


class Administrator(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(200), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email
        }
