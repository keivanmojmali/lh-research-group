"use client";
import { useState } from 'react';
import AppLayout from '@/components/appLayout';
import TextSingle from '@/components/input';
import Textarea from '@/components/textarea';
import Dropdown from '@/components/dropdown';

interface Option {
    id: string;
    name: string;
}

export default function AssessmentCreator() {
    const [passage, setPassage] = useState('');
    const [typeOfQuestion, setTypeOfQuestion] = useState('');
    const [typeOfAssessment, setTypeOfAssessment] = useState('');
    const [numberOfQuestions, setNumberOfQuestions] = useState('');
    const [loading, setLoading] = useState(true);

    // Define the options for type of question
    const questionOptions: Option[] = [
        { id: '1', name: 'Multiple choice' },
        { id: '2', name: 'Open ended' }
    ];

    // Define the options for type of assessment
    const assessmentOptions: Option[] = [
        { id: '1', name: 'Class quiz' },
        { id: '2', name: 'Exam ticket' }
    ];


    return (
        <AppLayout>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl pt-6 font-bold text-gray-900">Assessment Creator</h1>
                </div>
                <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    {!loading &&
                        <form>
                            <div className=" flex-col items-center justify-center space-y-4">
                                <Textarea title="Passage" name="passage" value={passage} onChange={setPassage} instructions={"Copy/Paste a passage you would like questions created for"} />
                                <Dropdown options={questionOptions} title='Type Of Question' value={typeOfQuestion} onChange={setTypeOfQuestion} />
                                <Dropdown options={assessmentOptions} title='Type of Assessment' value={typeOfAssessment} onChange={setTypeOfAssessment} />
                                <TextSingle title="Number of Questions" type='number' name="numberOfQuestions" value={numberOfQuestions} onChange={setNumberOfQuestions} />
                            </div>
                        </form>
                    }
                    {loading &&
                        <div className="flex justify-center items-center">
                            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                        </div>
                    }



                </div>
            </div>
        </AppLayout>
    )
}