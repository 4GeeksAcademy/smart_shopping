import os
import requests
from flask import request, jsonify, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from api.models import db, User, Product, ShoppingList, Item, Administrator, Category
import cloudinary.uploader

api = Blueprint('api', __name__)


# 🔐 HELPERS



def is_admin():
    return get_jwt_identity() == "admin"



# 🔐 AUTH


@api.route('/login', methods=['POST'])
def login():
    body = request.json

    user = User.query.filter_by(email=body.get("email")).first()

    if not user or user.password != body.get("password"):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity=str(user.id))

    return jsonify({
        "token": token,
        "role": "user",
        "user_id": user.id,
        "email": user.email,
        "image_url": user.image_url
    })


@api.route('/admin/login', methods=['POST'])
def admin_login():
    body = request.json

    admin = Administrator.query.filter_by(email=body.get("email")).first()

    if not admin or admin.password != body.get("password"):
        return jsonify({"msg": "Credenciales inválidas"}), 401

    token = create_access_token(identity="admin")

    return jsonify({
        "token": token,
        "role": "admin"
    })



# 👤 USERS


@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify([u.serialize() for u in User.query.all()])


@api.route('/users', methods=['POST'])
def create_user():
    body = request.json

    user = User(
        email=body.get("email"),
        password=body.get("password"),
        image_url=body.get("image_url")
    )

    db.session.add(user)
    db.session.commit()

    return jsonify(user.serialize()), 201


@api.route('/users/<int:id>', methods=['GET'])
@jwt_required()
def get_user(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify(User.query.get(id).serialize())


@api.route('/users/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    user = User.query.get(id)
    user.email = request.json.get("email", user.email)

    db.session.commit()
    return jsonify(user.serialize())


@api.route('/users/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    user = User.query.get(id)
    db.session.delete(user)
    db.session.commit()

    return jsonify({"msg": "Usuario eliminado"})



# 👑 ADMINS


@api.route('/admins', methods=['GET'])
@jwt_required()
def get_admins():
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify([a.serialize() for a in Administrator.query.all()])


@api.route('/admins', methods=['POST'])
@jwt_required()
def create_admin():
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    body = request.json

    admin = Administrator(
        email=body.get("email"),
        password=body.get("password")
    )

    db.session.add(admin)
    db.session.commit()

    return jsonify(admin.serialize()), 201


@api.route('/admins/<int:id>', methods=['GET'])
@jwt_required()
def get_admin(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify(Administrator.query.get(id).serialize())


@api.route('/admins/<int:id>', methods=['PUT'])
@jwt_required()
def update_admin(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    admin = Administrator.query.get(id)
    body = request.json

    admin.email = body.get("email", admin.email)

    if body.get("password"):
        admin.password = body.get("password")

    db.session.commit()
    return jsonify(admin.serialize())


@api.route('/admins/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_admin(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    admin = Administrator.query.get(id)
    db.session.delete(admin)
    db.session.commit()

    return jsonify({"msg": "Admin eliminado"})



# 🗂 CATEGORIES


@api.route('/categories', methods=['GET'])
def get_categories():
    return jsonify([c.serialize() for c in Category.query.all()])


@api.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    category = Category(nombre=request.json.get("nombre"))
    db.session.add(category)
    db.session.commit()

    return jsonify(category.serialize()), 201


@api.route('/categories/<int:id>', methods=['PUT'])
@jwt_required()
def update_category(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    category = Category.query.get(id)
    category.nombre = request.json.get("nombre")

    db.session.commit()
    return jsonify(category.serialize())


@api.route('/categories/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    category = Category.query.get(id)
    db.session.delete(category)
    db.session.commit()

    return jsonify({"msg": "Categoría eliminada"})



# 📦 PRODUCTS


@api.route('/products', methods=['GET'])
@jwt_required()
def get_products():
    return jsonify([p.serialize() for p in Product.query.all()])


@api.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    body = request.json

    product = Product(
        nombre=body.get("nombre"),
        precio=body.get("precio", 0),
        categoria_id=body.get("categoria_id", 1),
        image_url=body.get("image_url")
    )

    db.session.add(product)
    db.session.commit()

    return jsonify(product.serialize()), 201


@api.route('/products/<int:id>', methods=['PUT'])
@jwt_required()
def update_product(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    product = Product.query.get(id)
    body = request.json

    product.nombre = body.get("nombre", product.nombre)
    product.precio = body.get("precio", product.precio)
    product.categoria_id = body.get("categoria_id", product.categoria_id)
    product.image_url = body.get("image_url", product.image_url)

    db.session.commit()
    return jsonify(product.serialize())


@api.route('/products/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_product(id):
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    product = Product.query.get(id)
    db.session.delete(product)
    db.session.commit()

    return jsonify({"msg": "Producto eliminado"})



# 🛒 LISTS


@api.route('/lists', methods=['GET'])
@jwt_required()
def get_lists():
    identity = get_jwt_identity()
    return jsonify([l.serialize() for l in ShoppingList.query.filter_by(user_id=int(identity)).all()])


@api.route('/lists', methods=['POST'])
@jwt_required()
def create_list():
    identity = get_jwt_identity()

    new_list = ShoppingList(
        nombre_lista=request.json.get("nombre_lista"),
        user_id=int(identity)
    )

    db.session.add(new_list)
    db.session.commit()

    return jsonify(new_list.serialize()), 201


@api.route('/lists/<int:id>', methods=['GET'])
@jwt_required()
def get_list(id):
    identity = get_jwt_identity()
    lista = ShoppingList.query.get(id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify(lista.serialize())


@api.route('/lists/<int:id>', methods=['PUT'])
@jwt_required()
def update_list(id):
    identity = get_jwt_identity()
    lista = ShoppingList.query.get(id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    lista.nombre_lista = request.json.get("nombre_lista")

    db.session.commit()
    return jsonify(lista.serialize())


@api.route('/lists/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_list(id):
    identity = get_jwt_identity()
    lista = ShoppingList.query.get(id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    db.session.delete(lista)
    db.session.commit()

    return jsonify({"msg": "Lista eliminada"})



# 🧾 ITEMS (🔒 SEGURO)


@api.route('/items/<int:id>', methods=['GET'])
@jwt_required()
def get_item(id):
    identity = get_jwt_identity()

    item = Item.query.get(id)
    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404

    lista = ShoppingList.query.get(item.lista_id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    return jsonify(item.serialize())


@api.route('/lists/<int:list_id>/items', methods=['POST'])
@jwt_required()
def add_item(list_id):
    identity = get_jwt_identity()

    lista = ShoppingList.query.get(list_id)
    if not lista or lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    body = request.json

    existing = Item.query.filter_by(
        lista_id=list_id,
        producto_id=body.get("producto_id")
    ).first()

    if existing:
        existing.cantidad += 1
        db.session.commit()
        return jsonify(existing.serialize())

    item = Item(
        lista_id=list_id,
        producto_id=body.get("producto_id"),
        cantidad=1
    )

    db.session.add(item)
    db.session.commit()

    return jsonify(item.serialize()), 201


@api.route('/items/<int:id>', methods=['PUT'])
@jwt_required()
def update_item(id):
    identity = get_jwt_identity()

    item = Item.query.get(id)
    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404

    lista = ShoppingList.query.get(item.lista_id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    item.comprado = request.json.get("comprado")

    db.session.commit()
    return jsonify(item.serialize())


@api.route('/items/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_item(id):
    identity = get_jwt_identity()

    item = Item.query.get(id)
    if not item:
        return jsonify({"msg": "Item no encontrado"}), 404

    lista = ShoppingList.query.get(item.lista_id)

    if lista.user_id != int(identity):
        return jsonify({"msg": "No autorizado"}), 403

    db.session.delete(item)
    db.session.commit()

    return jsonify({"msg": "Item eliminado"})



# 🔗 LISTS WITH ITEMS


@api.route('/lists-with-items', methods=['GET'])
@jwt_required()
def get_lists_with_items():
    identity = get_jwt_identity()

    lists = ShoppingList.query.filter_by(user_id=int(identity)).all()
    result = []

    for lista in lists:
        items = Item.query.filter_by(lista_id=lista.id).all()

        items_data = []
        for item in items:
            product = Product.query.get(item.producto_id)

            items_data.append({
                "id": item.id,
                "producto_nombre": product.nombre if product else None,
                "cantidad": item.cantidad,
                "comprado": item.comprado
            })

        result.append({
            "id": lista.id,
            "nombre_lista": lista.nombre_lista,
            "items": items_data
        })

    return jsonify(result)



# ☁️ CLOUDINARY


@api.route('/upload', methods=['POST'])
def upload_file():
    file = request.files.get("file")

    if not file:
        return jsonify({"msg": "No file"}), 400

    upload_result = cloudinary.uploader.upload(file)

    return jsonify({
        "url": upload_result["secure_url"]
    })



# 👤 PROFILE


@api.route('/profile/image', methods=['PUT'])
@jwt_required()
def update_profile_image():
    identity = get_jwt_identity()

    user = User.query.get(int(identity))
    user.image_url = request.json.get("image_url")

    db.session.commit()

    return jsonify(user.serialize())


@api.route('/admin/profile/image', methods=['PUT'])
@jwt_required()
def update_admin_image():
    if not is_admin():
        return jsonify({"msg": "No autorizado"}), 403

    body = request.json

    admin = Administrator.query.first()  # simple por ahora

    if not admin:
        return jsonify({"msg": "Admin no encontrado"}), 404

    admin.image_url = body.get("image_url")

    db.session.commit()

    return jsonify(admin.serialize())


# 🤖 IA RECETAS (GEMINI)



@api.route('/ai/recipe', methods=['POST'])
@jwt_required()
def generate_recipe_ingredients():
    data = request.json
    receta = data.get("receta")

    if not receta:
        return jsonify({"msg": "Receta requerida"}), 400

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "GEMINI_API_KEY no configurada"}), 500

    prompt = (
        f"Devuelve SOLO un array JSON válido con los ingredientes principales "
        f"para preparar: {receta}. "
        f"Cada elemento debe ser el nombre del ingrediente en singular y minúsculas, "
        f"sin cantidades ni descripciones. "
        f'Ejemplo de respuesta válida: ["huevo", "harina", "leche", "sal"]. '
        f"NO incluyas explicaciones, texto adicional, ni markdown. "
        f"Devuelve únicamente el array JSON."
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    modelos = [
        "gemini-2.0-flash",
        "gemini-flash-latest",
        "gemini-1.5-flash",
        "gemini-2.5-flash",
    ]

    last_error = None

    for modelo in modelos:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{modelo}:generateContent?key={api_key}"

        try:
            response = requests.post(url, json=payload, timeout=30)
            print(
                f"\n=== Modelo: {modelo} | Status: {response.status_code} ===")

            if response.status_code != 200:
                last_error = f"{modelo}: {response.text[:200]}"
                continue

            result = response.json()

            if "candidates" not in result or not result["candidates"]:
                last_error = f"{modelo}: sin candidates"
                continue

            text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
            print("Respuesta cruda:", text[:300])

            text = text.replace("```json", "").replace("```", "").strip()

            import json
            ingredientes = json.loads(text)

            if not isinstance(ingredientes, list):
                last_error = f"{modelo}: respuesta no es lista"
                continue

            ingredientes = [
                str(i).strip().lower()
                for i in ingredientes
                if isinstance(i, (str, int, float)) and str(i).strip()
            ]
            ingredientes = list(dict.fromkeys(ingredientes))[:20]

            print(" Ingredientes:", ingredientes)
            return jsonify(ingredientes)

        except Exception as e:
            last_error = f"{modelo}: {str(e)}"
            print(f" Error con {modelo}:", str(e))
            continue

    return jsonify({
        "error": "Ningún modelo respondió correctamente",
        "ultimo_error": last_error
    }), 500
