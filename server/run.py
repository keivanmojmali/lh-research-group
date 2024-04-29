import os
from server import create_app

# Set the FLASK_APP environment variable programmatically
os.environ["FLASK_APP"] = "server:create_app"

app = create_app()  # Create an instance of the Flask application

if __name__ == "__main__":
    app.run(debug=True)  # Run the Flask application
