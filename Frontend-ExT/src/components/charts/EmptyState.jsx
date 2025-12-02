import React from "react";
import { FileQuestion, Ghost } from "lucide-react";

const EmptyState = ({ message, type }) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="text-6xl mb-4">
                {(type == 'chart') ?
                    (<Ghost className="text-purple-800 " size={24} />) :
                    (<FileQuestion className="text-purple-800 " size={24} />)
                }
            </div>
            

            <p className="text-gray-600 font-medium mb-4">{message}</p>
        </div>
    );
};

export default EmptyState;
