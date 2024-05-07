from flask import Flask
from flask_cors import CORS, cross_origin


def create_app():
    app = Flask(__name__)

    # Register the API routes
    from .api import api as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api")

    # Enable CORS for all routes across the entire app
    CORS(app, resources={r"/*": {"origins": "*"}})

    @app.route("/health")
    def health():
        return {"status": "up"}

    # Return the app object so Flask can work with it
    return app
