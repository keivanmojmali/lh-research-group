"use client";
import React from 'react';

// Define a type for your component's props
interface TextareaProps {
    name: string;
    onChange: (value: string) => void; // Specify what onChange should look like
    instructions: string;
    title: string;
    value?: string;
}

// Redefine your component to accept a single props object of type TextareaProps
const Textarea: React.FC<TextareaProps> = ({ name, onChange, instructions = "", title, value = "" }) => {

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    return (
        <div>
            <label htmlFor={name} className="block text-md font-medium leading-6 text-gray-900">
                {title}
            </label>
            <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
                {instructions}
            </label>
            <div className="mt-2">
                <textarea
                    rows={6}
                    name={name}
                    id={name}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={value}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}

export default Textarea;
