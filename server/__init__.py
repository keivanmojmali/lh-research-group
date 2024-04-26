from flask import Flask, render_template


def create_app():
    app = Flask(
        __name__,
        static_folder="../client",  # Set the folder for static files
        static_url_path="",  # Serve static files at the root URL
        template_folder="templates",  # Location of templates relative to this file
    )

    # Register the API routes
    from .api import api as api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api")

    # Define a route for the homepage
    @app.route("/")
    def home():
        return render_template("index.html")

    return app
