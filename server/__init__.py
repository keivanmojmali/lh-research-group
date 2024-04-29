from flask import Flask


def create_app():
    app = Flask(__name__)

    # Register the API routes
    from .api import api as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api")

    @app.route("/health")
    def health():
        return {"status": "up"}

    return app
