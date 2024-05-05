import React, { useState } from 'react';

interface Props {
    // Define your component's props here
}

const LessonExtractor: React.FC<Props> = () => {
    const [page, setPage] = useState('planner') //planner || how-to

    return (
        <div>
            <div id='navbar'></div>
            <div id='main-content'>

            </div>
            <div id='footer'></div>
        </div>
    );
};

export default LessonExtractor;