import React from 'react'

function ConfirmationModal({ isOpen, onClose, onConfirm, message, type }) {
    if (!isOpen) return null;
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
            onClick={handleBackgroundClick}
        >
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-2xl mb-4">Filter Events</h2>
                <p>
                    {message}
                </p>
                <button
                    type="button"
                    className={`px-4 py-2 bg-${type === 'danger' ? 'red' : 'green'}-500 text-white rounded-md`}
                    onClick={onConfirm}
                >
                    Confirm
                </button>
                <button
                    type="button"
                    className="px-4 py-2 bg-gray-500 text-white rounded-md"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ConfirmationModal