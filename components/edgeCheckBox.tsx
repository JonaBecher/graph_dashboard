import React from "react";

export default function EdgeCheckBox() {
    return (
        <div className="relative flex items-center align-middle h-5 w-5 mt-2">
            <input
                name="comments"
                type="checkbox"
                className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
            <div className="ml-3 text-md">
                <label className="text-size-lg text-gray-700">
                    Test@test.com
                </label>
            </div>
        </div>
    )
}