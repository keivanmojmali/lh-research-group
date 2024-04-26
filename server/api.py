from flask import Blueprint, request, jsonify, Response
from .functions.bedrock import streaming_llama3_call


# Create a new Blueprint for the API
api = Blueprint("api", __name__)


# Define a new route for calling the Llama3 function
@api.route("/stream_llama3", methods=["POST"])
def stream_llama3():
    # Get the data from the request JSON
    data = request.get_json()
    size = data.get("size", "8b")  # Default to '8b' if size is not provided
    messages = data.get("messages")

    # Check if messages are provided
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    # Stream the response back to the client
    try:
        return Response(streaming_llama3_call(size, messages), mimetype="text/plain")
    except Exception as e:
        return jsonify({"error": str(e)}), 500
