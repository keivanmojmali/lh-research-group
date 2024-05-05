# Send a prompt to Meta Llama 3 and print the response stream in real-time.

import boto3
import json
import os
from dotenv import load_dotenv
from transformers import AutoModelForCausalLM, AutoTokenizer

load_dotenv()

# Load environment variables.
aws_region = os.getenv("AWS_REGION")
aws_access_key_id = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_access_key = os.getenv("AWS_SECRET_ACCESS_KEY")
hugging_face_token = os.getenv("HUGGING_FACE_TOKEN")


# Create a Bedrock Runtime client in the AWS Region of your choice.
client = boto3.client(
    "bedrock-runtime",
    region_name=aws_region,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)


def streaming_llama3_call(size, messages):

    print("messages:", messages)
    # models from aws bedrock
    model = {
        "8b": "meta.llama3-8b-instruct-v1:0",
        "70b": "meta.llama3-12b-v1:0",
    }

    # tokenizers from huggingface
    model_tokenizer = {
        "8b": "meta-llama/Meta-Llama-3-8B-Instruct",
        "70b": "meta-llama/Meta-Llama-3-70B-Instruct",
    }

    # Set the model ID, e.g., Llama 3 8B Instruct.
    model_id = model[size]

    # load the tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        model_tokenizer[size], token=hugging_face_token
    )

    # Apply the chat template to the messages.
    prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    print("Prompt:", prompt)

    # Format the request payload using the model's native structure.
    request = {
        "prompt": prompt,
        # Optional inference parameters:
        "max_gen_len": 1000,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    print("Request:", request)

    # Encode and send the request.
    response_stream = client.invoke_model_with_response_stream(
        body=json.dumps(request),
        modelId=model_id,
    )

    for event in response_stream["body"]:
        chunk = json.loads(event["chunk"]["bytes"])
        if "generation" in chunk:
            yield chunk["generation"]


#### I am not sure if this one works i havnt tested it
def llama3_call(size, messages):

    # models from aws bedrock
    model = {
        "8b": "meta.llama3-8b-instruct-v1:0",
        "70b": "meta.llama3-12b-v1:0",
    }

    # tokenizers from huggingface
    model_tokenizer = {
        "8b": "meta-llama/Meta-Llama-3-8B-Instruct",
        "70b": "meta-llama/Meta-Llama-3-70B-Instruct",
    }

    # Set the model ID, e.g., Llama 3 8B Instruct.
    model_id = model[size]

    # load the tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        model_tokenizer[size], token=hugging_face_token
    )

    # Apply the chat template to the messages.
    prompt = tokenizer.apply_chat_template(
        messages, tokenize=False, add_generation_prompt=True
    )

    print("Prompt:", prompt)

    # Format the request payload using the model's native structure.
    request = {
        "prompt": prompt,
        # Optional inference parameters:
        "max_gen_len": 1000,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    print("Request:", request)

    # Encode and send the request.
    response = client.invoke_model(
        body=json.dumps(request),
        modelId=model_id,
    )

    response_body = json.loads(response.get("body").read())

    # The response from the model now mapped to the answer
    answer = response_body.get("completions")[0].get("data").get("text")

    return {"statusCode": 200, "body": json.dumps({"Answer": answer})}
