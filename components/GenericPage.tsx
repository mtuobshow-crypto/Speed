
import React from 'react';

interface GenericPageProps {
    title: string;
    content: string;
}

const GenericPage: React.FC<GenericPageProps> = ({ title, content }) => {
    return (
        <div className="w-full max-w-4xl">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-lg p-8 md:p-12">
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 mb-8 text-center">
                    {title}
                </h1>
                <div 
                    className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: content }}
                >
                </div>
            </div>
        </div>
    );
};

export default GenericPage;
