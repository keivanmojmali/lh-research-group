"use client";
import { useState } from 'react';
import AppLayout from '@/components/appLayout';
import TextSingle from '@/components/input';
import Textarea from '@/components/textarea';
import Dropdown from '@/components/dropdown';
import LoadingSpinner from '@/components/loadingSpinner';

interface Option {
    id: string;
    name: string;
}

export default function AssessmentCreator() {
    const [passage, setPassage] = useState('');
    const [typeOfQuestion, setTypeOfQuestion] = useState('Multiple choice');
    const [typeOfAssessment, setTypeOfAssessment] = useState('Class quiz');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');  // State to store the result

    console.log('passage', passage)
    console.log('typeOfQuestion', typeOfQuestion)
    console.log('typeOfAssessment', typeOfAssessment)
    console.log('numberOfQuestions', numberOfQuestions)

    // Define the options for type of question
    const questionOptions: Option[] = [
        { id: '1', name: 'Multiple choice' },
        { id: '2', name: 'Open ended' }
    ];

    // Define the options for type of assessment
    const assessmentOptions: Option[] = [
        { id: '1', name: 'Class quiz' },
        { id: '2', name: 'Exit ticket' }
    ];

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const formData = {
            passage,
            typeOfQuestion,
            typeOfAssessment,
            numberOfQuestions,
            size: "8b" //being manually set for now to 8b
        };

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create_assessment_ela`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Safeguard against null body
            if (response.body === null) {
                throw new Error('Response body is null');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            let resultText = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                resultText += decoder.decode(value, { stream: true });
            }

            resultText += decoder.decode(); // Complete decoding
            setResult(resultText);
        }
        catch (error) {
            console.error('Failed to fetch data:', error);
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl pt-6 font-bold text-gray-900">Assessment Creator</h1>
                </div>
                <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    {!loading && result && (
                        <div className="mt-4 p-4 bg-gray-100 border rounded mb-4">
                            <Textarea title="Result" name="result" value={result} onChange={setResult} instructions={""} />
                        </div>
                    )}
                    {!loading &&
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Textarea title="Passage" name="passage" value={passage} onChange={setPassage} instructions={"Copy/Paste a passage you would like questions created for"} />
                            <Dropdown options={questionOptions} title='Type Of Question' value={typeOfQuestion} onChange={setTypeOfQuestion} />
                            <Dropdown options={assessmentOptions} title='Type of Assessment' value={typeOfAssessment} onChange={setTypeOfAssessment} />
                            <TextSingle title="Number of Questions" type='number' name="numberOfQuestions" value={numberOfQuestions} onChange={setNumberOfQuestions} />
                            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300">
                                {loading ? <LoadingSpinner /> : 'Submit'}
                            </button>
                        </form>
                    }
                    {loading &&
                        <div className="flex justify-center items-center">
                            <LoadingSpinner />
                        </div>
                    }
                </div>
            </div>
        </AppLayout>
    );
}
