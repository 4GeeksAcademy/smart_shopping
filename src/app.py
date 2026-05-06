import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import cloudinary

# ============================
# 🔧 ENV
# ============================
load_dotenv()

app = Flask(__name__)

# 🔥 CORS CORREGIDO (IMPORTANTE)
CORS(app, supports_credentials=True)

app.url_map.strict_slashes = False

# ============================
# ☁️ CLOUDINARY
# ============================
cloudinary.config(
    cloud_name=os.getenv("CLOUD_NAME"),
    api_key=os.getenv("API_KEY"),
    api_secret=os.getenv("API_SECRET")
)

# ============================
# 🔐 JWT
# ============================
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
jwt = JWTManager(app)

# ============================
# 🗄 DATABASE
# ============================
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///tmp.db"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
MIGRATE = Migrate(app, db)

# 🔥 CREAR TABLAS
with app.app_context():
    db.create_all()

# ============================
# ⚙️ ADMIN & COMMANDS
# ============================
setup_admin(app)
setup_commands(app)

# ============================
# 🔗 ROUTES
# ============================
app.register_blueprint(api, url_prefix='/api')

# ============================
# ❌ ERROR HANDLER
# ============================


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ============================
# 🌐 SITEMAP
# ============================


@app.route('/')
def sitemap():
    return generate_sitemap(app)


# ============================
# ▶️ RUN
# ============================
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
