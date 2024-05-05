# Send a prompt to Meta Llama 3 and print the response stream in real-time.

import boto3
import json
import os
import pandas as pd
from bert_score import BERTScorer
from rouge import Rouge
import csv
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


def llama3_call(size, messages):
    size = "8b"

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

    # Format the request payload using the model's native structure.
    request = {
        "prompt": prompt,
        # Optional inference parameters:
        "max_gen_len": 1000,
        "temperature": 0.7,
        "top_p": 0.9,
    }

    # Encode and send the request.
    response = client.invoke_model(
        body=json.dumps(request),
        modelId=model_id,
    )

    if "body" in response and response["body"]:
        response_body = json.loads(response["body"].read())
        # Access the generation directly from the body
        generation = response_body.get("generation", "No generation found")
    else:
        generation = "Response body is empty"

    return generation


def create_assessment(data):
    passage = data["passage"]

    standard_code = "NGLS.ELA.Content.NY-8.R.8"
    standard_description = "Trace and evaluate an argument and specific claims in a text, assessing whether the reasoning is valid and the evidence is relevant and sufficient and recognizing when irrelevant evidence is introduced. (RI&RL)"
    grade_level = "8th Grade"
    typeOfQuestion = "Multiple Choice"
    typeOfAssessment = "Class Quiz"
    numOfQuestions = 1
    size = "8b"

    sample_passage = "n a faraway kingdom called Tellus, Aleks signs up for the army. en he finds out what a dishonest and brutal place it is. Slinging his light saddlebag over his shoulders and swallowing his cry of pain at the movement, he pulled his hat low over his forehead and made for the door. He needed his enlistment forms from Shulga’s office; if he could find and destroy them, the army would have no record of him enlisting. Even if he did get caught aer escaping—provided he escaped in the first place—there would be no proof that he was a cadet.1 en all he had to do was reach the stables and get Quicksilver before anyone on the dinner shi noticed what he was doing. Aer that . . . he would find a way out. were had to be one somewhere. . . . There were no guards at the door; the barracks  was down to a skeleton guard for the dinner shi. Aleks silently retraced his steps from earlier in the day, making his way towards Antova’s office. His eyes raced over every door’s nameplate, frowning when none of them was the office he was looking for. He was incredibly short on time; he had to be on Quicksilver and heading for freedom before dinner ended. Finally, he saw it. Lt. Shulga was embossed on a nameplate three doors down from Antova’s. Luckily, the door was unlocked and the room empty; Shulga had obviously gone straight from the time-out room to dinner. The office was decorated in the same way as Antova’s, in blue and dark brown, with a large map of Tellus on the wall instead of the royal crest the commander displayed. Darting across to a metal filing cabinet that took up most of one wall, Aleks wrenched open a drawer at random, ignoring the searing ache in his arms. Again, unlocked. Clearly Shulga was too cocky to think anyone would dare snoop around his office. The drawer was full of neatly filed enlistment forms in alphabetical order; F–J. Aleks’s form would come under V. Shutting the drawer, he reached for the next one, perplexed to find it containing M–P. e drawer aer that didn’t contain enlistment forms at all, but instead held a large stack of account books. Shulga didn’t seem to have any sort of system whatsoever; how did he ever find anything he needed? Growling in frustration, Aleks began to open multiple drawers at a time, rifling through stacks of papers and leather-bound books, his desperation growing with every unsuccessful attempt. Digging through a drawer of miscellaneous files and books closest to the desk, his fingers scrabbled at the bottom of the drawer and it tilted a fraction, sending three stacked files slumping against a small metal box. ‘What the . . .’ He trailed off, pressing harder on the base of the drawer, watching it dip under his fingers. the drawer had a false bottom! Aleks glanced at the clock; he knew he shouldn’t, but he’d always been the curious type. Emptying the drawer, he dug his nails under one side of the fake bottom, prising it up. e secret compartment was fairly narrow, containing only a thin file of papers and a battered leather journal. It was the journal that caught Aleks’s eye, for it had the Anglyan crest embossed in one corner of the cover. What on Tellus was Shulga doing with an Anglyan journal? . .. A door slamming somewhere in the building startled him out of his horrified trance, and a quick look at the clock nearly gave Aleks a heart attack. He barely had ten minutes until the end of dinner! Stuffing the journal in an inner pocket of his coat, he hastily replaced the drawer’s false bottom and contents, shutting it as quietly as he could. Tugging on the two drawers he had yet to check, he swore under his breath. Neither of them contained a V section, and Aleks felt dread creep over him at the realization that his file was likely elsewhere. He didn’t have the time to search any other rooms. Out of options, he straightened up, shoving all the cabinet drawers shut and sprinting for the door.  A quick glance through the glass panel showed the corridor to be empty, so Aleks slipped from the room. Bursting through the door of the building, he turned for the stables, slowing his pace once he hit the cobblestone path, just in case anyone happened to look his way. ere was nothing more suspicious than a lone cadet running. While there was supposed to be at least one stablehand in the building at all times, Aleks couldn’t see a single soul in the stables. Perfect. Hurrying to the tack3 room, he easily found Quicksilver’s saddle and bridle, though carrying the heavy items in his current state nearly sent him crumpling to the floor. Still, he forced himself to ignore the pain, heing the tack across the room towards Quicksilver’s stall. 		 	 	 																				e horse whinnied when he saw the tack, knowing what it meant. Aleks shushed						him, slinging the saddle on the door and slipping inside, easing the bridle on to the horse’s						head. Tossing the saddle on Quicksilver’s back, he fastened it tightly and slung the						saddlebag over the horse’s rear, buckling it swily. He grabbed the reins, running to press						Quicksilver’s nose to his chest for a brief moment. ‘We need to be quiet, boy. No getting					excited.’"
    sample_response = "How does the author’s description of Aleks’s plan in paragraph 1 impact the tone of the story?													 								A  It creates irony because everything happens the way Aleks thinks it will. 														 								B  It creates confidence that Aleks will succeed because he knows what he must do. 														 								C  It creates suspense as the reader wonders if something will go wrong for Aleks. 														 								D  It creates confusion because not everything happens the way Aleks wants it to.  													 																 	 	 																				What important idea does the author develop in paragraphs 1 and 2?													 								A  e Tellus army is poorly prepared for action. 														 								B  Aleks has a plan that is based on the army’s routines. 														 								C  Aleks is unsure about which office has his army enlistment papers. 														 								D  e Tellus army guards will soon return to the barracks from dinner.  													 																 	 	 																				Which sentence states a theme of paragraph 3?													 								A  Overconfidence can lead to carelessness. 														 								B  Pride in one’s kingdom is essential to military success. 														 								C  Pain can prevent a person from reaching one’s goal. 														 								D  Trust is difficult to establish and maintain.  													 																 	 	 																				How does Aleks’s attitude change in paragraph 5?													 								A  It shis from exhausted to curious. 														 								B  It shis from panicked to confident. 														 								C  It shis from distracted to focused. 														 								D  It shis from annoyed to surprised.  													 																 	 	 																				e saying “Don’t let anything stop you” is an encouragement to pursue and achieve a goal despite obstacles. Which quotation from the story best reflects this idea?						A “Aer that . . . he would find a way out. ere had to be one somewhere.” (paragraph 1)						“Luckily, the door was unlocked and the room empty; Shulga had obviously gone straight from the time-out room to dinner.” (paragraph 3)						“Aleks glanced at the clock; he knew he shouldn’t, but he’d always been the curious type.” (paragraph 6)						“A quick glance through the glass panel showed the corridor to be empty, so Aleks slipped from the room.” (paragraph 9) 																 	 	 																				Read these sentences from paragraph 12.						‘We need to be quiet, boy. No getting excited.’						What do these sentences reveal about Aleks?													 								A  He is aware that dangers may still await him. 														 								B  He is questioning his decision to leave the army. 														 								C  He is unfamiliar with how this horse will react. 														 								D  He is reconsidering his plan of escape.  													 																 	 	 																				Which sentence would be most important to include in a summary of the story?													 								A  Aleks notices that Shulga’s office is decorated the same as Antova’s office. 														 								B  Aleks finds an Anglyan journal in a secret compartment in Shulga’s office. 														 								C  Aleks fears someone is coming when he hears a door slam in the building. 														 								D  Aleks slows his pace to avoid suspicion as he approaches the stables."
    assistant_prompt = f"Context: The {standard_code} education standard expects students to be able to {standard_description}. 1) Read the above context and ensure that you understand what the {standard_code} standard is and what you should do to assess student mastery for it. This includes the type of educational standard that it is, the grade level, the subject, what students should be able to answer in order achieve mastery in this standard, and the language of the questions that state exams typically use to assess the {standard_code} standard. 2) Read the following passage:{sample_passage}.4) Add a **Questions** section and use what you just learned about the {standard_code} standard to create standards-alingned questions based on the passage provided.   7) Double check that all of the {typeOfQuestion} questions strictly assess the {standard_code} standard, and make sure that the questions are based on the passage  Do not print or mention your findings from this step in your final response. 9) Complete the whole prompt carefully, step by step. 10) Only give me what I asked for, do not make any additional comments. Follow all of the steps above to create a {numOfQuestions} question, {typeOfQuestion} question {typeOfAssessment} that successfully assesses the student's ability to master {standard_code} standard, which expects students to be able to {standard_description}. Complete the whole prompt carefully, step by step."

    system_promt = f"System Role: Educational Assessment Generator Purpose: To generate exit tickets and quizzes that align with specific educational standards. Input Parameters: Educational Standard or Objective: The specific educational goal or standard the teacher wants to assess. This could be drawn from common educational standards like Common Core, NGSS, etc., or from custom objectives set by the teacher. Assessment Type: Whether the teacher wants an exit ticket or a class quiz. Difficulty Level: Basic, Intermediate, or Advanced. This helps tailor the questions to the appropriate complexity for the students. Number of Questions: How many questions the teacher wants the assessment to have. Question Format: Multiple-choice, short answer, essay, true/false, etc. System Actions: Parse the input parameters, particularly the educational standard or objective. Based on the standard and the assessment type, generate questions that probe understanding of the desired content. Adjust question complexity based on the provided difficulty level. Format the questions based on the specified question format, ensuring they are phrased similarly to how they would be presented in state standardized tests, thus acclimating students to the style and format they might encounter during such exams. If generating an exit ticket, ensure the content is concise and can be completed within 5-10 minutes. If generating a class quiz, ensure it fits within the 10-30 minute completion window. Provide the finalized questions, ensuring the document: Includes formatted spaces for student name and date. Clearly mentions the specific standard or objective being assessed. Comes with an answer key that not only gives the correct answers but also provides explanations for why each answer is correct. Features an encouraging message for students to boost morale and confidence. Output: A formatted assessment (exit ticket or quiz) tailored to the specified educational standard or objective, ready for use in a classroom setting."
    final_prompt = f"Context: The {standard_code} education standard expects students to be able to {standard_description}. 1) Read the above context and ensure that you understand what the {standard_code} standard is and what you should do to assess student mastery for it. This includes the type of educational standard that it is, the grade level, the subject, what students should be able to answer in order achieve mastery in this standard, and the language of the questions that state exams typically use to assess the {standard_code} standard. 2) Read the following passage:{passage}. 4) Add a **Questions** section and use what you just learned about the {standard_code} standard to create standards-alingned questions based on the passage provided.   7) Double check that all of the {typeOfQuestion} questions strictly assess the {standard_code} standard, and make sure that the questions are based on the passage Do not print or mention your findings from this step in your final response. 9) Complete the whole prompt carefully, step by step. 10) Only give me what I asked for, do not make any additional comments. Follow all of the steps above to create a {numOfQuestions} question, {typeOfQuestion} question {typeOfAssessment} that successfully assesses the student's ability to master {standard_code} standard, which expects students to be able to {standard_description}. Complete the whole prompt carefully, step by step. MAKE SURE YOU DO NOT PUT ANY ANSWERS ON THE PAGE - JUST THE QUESTIONS"

    messages = [
        {"role": "system", "content": system_promt},
        {"role": "user", "content": assistant_prompt},
        {"role": "assistant", "content": sample_response},
        {"role": "user", "content": final_prompt},
    ]

    # Check if messages are provided
    if not messages:
        return jsonify({"error": "No messages provided"}), 400

    # Stream the response back to the client
    try:
        return llama3_call(size, messages)
    except Exception as e:
        return e


def score_questions(generated_questions, regents_questions):
    # Initialize scorers
    scorer = BERTScorer(lang="en", rescale_with_baseline=True)
    rouge = Rouge()

    bert_scores = []
    rouge_scores = []

    # Combine all Regents questions into a single reference text
    combined_regents_questions = " ".join(regents_questions)

    # Compute scores for each generated question against the combined set of Regents questions
    for gen_q in generated_questions:
        # Compute BERTScore
        P, R, F1 = scorer.score([gen_q], [combined_regents_questions])
        bert_scores.append(F1.mean().item())  # Taking the mean F1 score

        # Compute ROUGE scores
        scores = rouge.get_scores(gen_q, combined_regents_questions)
        rouge_scores.append(scores[0])  # Assuming you want the first set of scores

    return bert_scores, rouge_scores


def save_to_csv(data, filename="output.csv"):
    keys = data[0].keys()
    with open(filename, "w", newline="") as output_file:
        dict_writer = csv.DictWriter(output_file, keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)


def generate_questions(passage, num_questions):
    # Prepare data to pass to the assessment function
    data = {"passage": passage}

    # This will store all generated questions
    all_generated_questions = []

    # Generate questions until the desired number is reached
    while len(all_generated_questions) < num_questions:
        # Call the create_assessment function which now generates questions based on the passage
        new_questions = create_assessment(data)

        # Append new questions to the list
        all_generated_questions.extend(new_questions)

        # If we have more than needed, break early (optional, depends on your exact requirement)
        if len(all_generated_questions) >= num_questions:
            break

    # Return only the number of requested questions
    return all_generated_questions[:num_questions]


# Main execution logic
regents_questions = [
    "Why does the author use the phrase “my finned fishy friends” in paragraph 2? A to highlight the serious issues facing ocean life B to make readers feel a connection to the article C to establish the importance of SoFi’s fin technology D to help readers understand the ocean environment",
    "Which detail about SoFi best supports the idea expressed in this sentence? A SoFi may contribute to the protection of endangered marine life. B SoFi can swim at speeds that are similar to some fish. C Fish are not scared by SoFi and sometimes swim with her. D Divers issue commands to SoFi using a simple controller.",
    "Which detail from the article best shows the author’s point of view about SoFi? A “Robotic fish like her could be essential to understanding and protecting marine life in danger of disappearing…” B “is foot-and-a-half long robot mimics a real fish.” C “I was amazed at how well it worked, how well i was able to get this tail beat back and forth or swim left and right…” D “And the fish can,t be as big as a submarine-unless we wanted to build a whale.”",
    "Which statement best explains how the ideas in paragraph 8 relate to the details in paragraphs 12 through 14? A Engineers want to build a robot to explore marine life. B Engineers create a system to guide SoFi underwater. C Engineers focus on design requirements to achieve their goal. D Engineers develop SoFi to think and act like a small fish.",
    "One aspect of technology that is often stressed is its negative impact on the environment. Which detail from the article presents a contrast to this idea? A “They explained how their finned robot was created, and how her first ocean swim on a coral reef outside of Fiji went.” B “But without a line giving her away by connecting her to a boat . . . she doesn’t seem to bother or scare off real fish.” C “SoFi started as a nine-inch silicon tail that wiggled with the assistance of a hydraulic pump.” D “The high-pitched signals only travel about 65 feet and are inaudible to fish, although it’s possible some whales or dolphins could hear them . . .”",
    "In paragraph 21, Mr. Katzschmann reacts positively to the idea that a shark might eat SoFi because that would A lead to further funding and research B test the strength of the underwater system C help biologists understand how to protect marine life D support the goal of studying animal interactions",
    "Which idea would be most important to include in a summary of the article? A SoFi uses coded messages to communicate. B SoFi receives commands from a remote control. C SoFi is an important tool for understanding ocean life. D SoFi is designed to swim at different speeds in the ocean.",
]
passage = "You’re a fish in the ocean. It’s 2023 and humans have begun deploying swarms of sentinel robot fish along the reef where you live that will monitor your environment, track pollution and collect intelligence on your behavior. Welcome to the future, my finned fishy friends. O.K., so you’re not a fish. And this sci-fi fishland doesn’t exist. But it could—not long from now. Allow me to introduce SoFi—like “Sophie,” but short for “So Robotic Fish,” revealed in Science Robotics, by scientists at the Massachusetts Institute of Technology Computer Science and Artificial Intelligence Lab. ey explained how their finned robot was created, and how her first ocean swim on a coral reef outside of Fiji went. Robotic fish like her could be essential to understanding and protecting marine life in danger of disappearing in a fragile ocean environment, threatened by human activity and climate change. is foot-and-a-half long robot mimics a real fish. She can swim in the ocean at speeds up to half-its-body-length a second and at depths up to 60 feet below the surface. SoFi has a battery that will last 45 minutes before she shuts down. She’s not quite fish flesh, but she’s not a typical marine robot either. Although critical for studying the ocean, remote operated vehicles and submersibles1 can be expensive to build and operate. ey also can startle the sea creatures they’re supposed to study. But without a line giving her away by connecting her to a boat, a noisy propeller or the big, rigid, awkward or angular body of a metallic land-alien, she doesn’t seem to bother or scare off real fish. Some even swim along with her. Sleek, untethered, relatively inexpensive and well-tolerated, SoFi may provide biologists a fish’s-eye view of animal interactions in changing marine ecosystems. For this group of MIT roboticists, SoFi was a dream, combining their love of diving with their work on so robots. She was also an engineering challenge. SoFi started as a nine-inch silicon tail that wiggled with the assistance of a hydraulic pump. “I was amazed at how well it was working, how well I was able to get this tail to beat back and forth or swim le and right, like a shark or some other fish,” said Robert Katzschmann, a graduate student at MIT who led the team. “But we wanted to show this wasn’t just working on a test bench or table top.” SoFi had to swim in the ocean—at multiple depths. is meant waterproofing, buoyancy control, tweaking weight distributions and figuring out an unobtrusive way to share information underwater. It also meant compact equipment. “We wanted to build a fish,” said Mr. Katzschmann. “And the fish can’t be as big as a submarine—unless we wanted to build a whale.” A couple years later SoFi had a finned body and head equipped with a camera, two- way hydrophone, battery, environmental sensors, operating system and communication system that allowed a diver to issue commands using a souped-up Super Nintendo controller. e communication system was the biggest challenge, said Mr. Katzschmann, because normally it requires a cable. Common remote signals used for piloting aerial drones don’t travel below water. But sound waves do. ey built their own language, sending coded messages on high-pitched sound waves between SoFi and the diver. Different bits of information were assigned their own tones, kind of like how numbers are represented by dial tones when you make a phone call. A processing system decoded and relayed the messages to tell the diver things like “SoFi is currently swimming forward” or command her to “turn le, 20 degrees.” e high-pitched signals only travel about 65 feet and are inaudible to fish, although it’s possible some whales or dolphins could hear them, which may require future research. “Our primary goal was to make something for biologists,” said Mr. Katzschmann. He envisions a future network of sensor-clad SoFis for studying schooling dynamics3 or monitoring pollution over time. Currently he’s working on primitive A.I. so SoFi can use her footage to identify and track real fish. But what if a real fish—or a shark—tracks SoFi instead? “If a shark would have come and ate our fish, that would have been the most amazing footage,” Mr. Katzschmann said. "
data = {
    "passage": passage,
}
num_questions = 1


generated_questions = generate_questions(passage, num_questions)
print(generated_questions)
bert_scores, rouge_scores = score_questions(generated_questions, regents_questions)

# Prepare data for CSV
csv_data = []
for i, (gen_q, bert_score, rouge_score) in enumerate(
    zip(generated_questions, bert_scores, rouge_scores)
):
    print("GEN !", gen_q)
    csv_data.append(
        {
            "Question Number": i + 1,
            "Generated Question": gen_q,
            "BERTScore": bert_score,
            "ROUGE Score": json.dumps(
                rouge_score
            ),  # Storing ROUGE scores as JSON string
        }
    )

save_to_csv(csv_data)
