from flask import Blueprint, request, jsonify, Response
from .functions.bedrock import streaming_llama3_call, llama3_call
import json

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


@api.route("/create_assessment_ela", methods=["POST"])
def create_assessment():
    # Get data from request
    data = request.get_json()
    passage = data["passage"]
    typeOfQuestion = data["typeOfQuestion"]
    typeOfAssessment = data["typeOfAssessment"]
    numOfQuestions = data["numberOfQuestions"]
    size = data["size"]  # Default to '8b' if size is not provided

    final_promt = f"Context: 1) Read the above context and ensure that you understand what the standard is and what you should do to assess student mastery for it. This includes the type of educational standard that it is, the grade level, the subject, what students should be able to answer in order achieve mastery in this standard, and the language of the questions that state exams typically use to assess the standard. 2) Read the following passage: . 3) Add an **Instructions** section crafting an immersive narrative that draws students into the activity in an exciting and interactive manner. This section should set the stage for the activity with a captivating story or scenario. Provide clear, student-friendly instructions woven into the storyline, guiding them on how to complete the activity while keeping them engaged and enthusiastic about the {typeOfAssessment}. 4) Add a **Questions** section and use what you just learned about the standard to create standards-alingned questions based on the passage provided.  5) Add a **Message from Teacher** section and leave unique, motivational and encouraging message to the student to cheer them up and celebrate their growth. 6) Add an **Answer Key** section at the bottom of the page, in which you will create an answer key with student friendly explanations for why the answer provided was correct. 7) Double check that all of the {typeOfQuestion} questions strictly assess the standard, and make sure that the questions are based on the passage 8) Double check that the answers on the **Answer Key** section are indeed the correct by ensure that each answer is supported by relevant information or quotations from the passage, to validate the correctness of the response. Do not print or mention your findings from this step in your final response. 9) Complete the whole prompt carefully, step by step. 10) Only give me what I asked for, do not make any additional comments. Follow all of the steps above to create a{numOfQuestions} question, {typeOfQuestion} question {typeOfAssessment} that successfully assesses the student's ability to master standard, which expects students to be able to. Complete the whole prompt carefully, step by step."
    system_promt = f"System Role: Educational Assessment Generator Purpose: To generate exit tickets and quizzes that align with specific educational standards. Input Parameters: Educational Standard or Objective: The specific educational goal or standard the teacher wants to assess. This could be drawn from common educational standards like Common Core, NGSS, etc., or from custom objectives set by the teacher. Assessment Type: Whether the teacher wants an exit ticket or a class quiz. Difficulty Level: Basic, Intermediate, or Advanced. This helps tailor the questions to the appropriate complexity for the students. Number of Questions: How many questions the teacher wants the assessment to have. Question Format: Multiple-choice, short answer, essay, true/false, etc. System Actions: Parse the input parameters, particularly the educational standard or objective. Based on the standard and the assessment type, generate questions that probe understanding of the desired content. Adjust question complexity based on the provided difficulty level. Format the questions based on the specified question format, ensuring they are phrased similarly to how they would be presented in state standardized tests, thus acclimating students to the style and format they might encounter during such exams. If generating an exit ticket, ensure the content is concise and can be completed within 5-10 minutes. If generating a class quiz, ensure it fits within the 10-30 minute completion window. Provide the finalized questions, ensuring the document: Includes formatted spaces for student name and date. Clearly mentions the specific standard or objective being assessed. Comes with an answer key that not only gives the correct answers but also provides explanations for why each answer is correct. Features an encouraging message for students to boost morale and confidence. Output: A formatted assessment (exit ticket or quiz) tailored to the specified educational standard or objective, ready for use in a classroom setting."

    messages = [
        {"role": "system", "content": system_promt},
        {"role": "user", "content": final_promt},
    ]

    # Check if messages are provided
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    # Stream the response back to the client
    try:
        return Response(streaming_llama3_call(size, messages), mimetype="text/plain")
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@api.route("/test", methods=["POST"])
def test():
    # Attempt to get JSON data from request
    try:
        data = request.get_json()
    except Exception as e:
        return jsonify({"error": "Invalid JSON data"}), 400

    # Extract data with default values and logging
    typeOfQuestion = data.get("typeOfQuestion", "Open ended")
    typeOfAssessment = data.get("typeOfAssessment", "Exit ticket")
    numOfQuestions = data.get("numberOfQuestions", 4)
    size = data.get("size", "8b")
    passage = data.get("passage", "Default passage content if not provided.")

    # Construct prompts using the data
    try:
        final_prompt = (
            f"Context: Read the above context and ensure that you understand what the standard is and "
            f"what you should do to assess student mastery for it. This includes the type of educational "
            f"standard that it is, the grade level, the subject, what students should be able to answer "
            f"in order to achieve mastery in this standard, and the language of the questions that state "
            f"exams typically use to assess the standard. Read the following passage: {passage}. "
            f"Add an **Instructions** section... and so on."
        )

        system_prompt = (
            "System Role: Educational Assessment Generator Purpose: To generate exit tickets and quizzes "
            "that align with specific educational standards. Input Parameters: Educational Standard or "
            "Objective: The specific educational goal or standard the teacher wants to assess... and so on."
        )

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": final_prompt},
        ]

    except Exception as e:
        return jsonify({"error": "Error in generating prompts"}), 500

    # Stream the response back to the client
    try:
        content = llama3_call(size, messages)
        return jsonify({"content": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
