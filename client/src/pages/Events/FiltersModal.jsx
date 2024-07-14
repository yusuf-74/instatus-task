import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';


const FiltersModal = ({ isOpen, onClose, filters, setFilters }) => {
    if (!isOpen) return null;
    
    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const initialValues = {
        actorId: filters.actorId,
        actorName: filters.actorName,
        actionId: filters.actionId,
        actionName: filters.actionName,
        targetId: filters.targetId,
        targetName: filters.targetName,
    }

    const validationSchema = Yup.object({
        actorId: Yup.string().nullable(),
        actorName: Yup.string().nullable(),
        actionId: Yup.string().nullable(),
        actionName: Yup.string().nullable(),
        targetId: Yup.string().nullable(),
        targetName: Yup.string().nullable(),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            setFilters(values);
        },
    });

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        onClick={handleBackgroundClick}
        >
            <div className="bg-white p-6 rounded shadow-lg w-1/3">
                <h2 className="text-2xl mb-4">Filter Events</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    formik.handleSubmit();
                    onClose();
                }}>
                    <div className="mb-4 flex">
                        <div className='w-1/2 mr-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actorId">
                                Actor ID
                            </label>
                            <input
                                id="actorId"
                                name="actorId"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.actorId}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                        <div className='w-1/2 ml-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actorName">
                                Actor Name
                            </label>
                            <input
                                id="actorName"
                                name="actorName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.actorName}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex">
                        <div className='w-1/2 mr-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actionId">
                                Action ID
                            </label>
                            <input
                                id="actionId"
                                name="actionId"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.actionId}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                        <div className='w-1/2 ml-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="actionName">
                                Action Name
                            </label>
                            <input
                                id="actionName"
                                name="actionName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.actionName}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="mb-4 flex">
                        <div className='w-1/2 mr-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetId">
                                Target ID
                            </label>
                            <input
                                id="targetId"
                                name="targetId"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.targetId}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                        <div className='w-1/2 ml-2'>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="targetName">
                                Target Name
                            </label>
                            <input
                                id="targetName"
                                name="targetName"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.targetName}
                                type="text"
                                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        {/* reset button */}
                        <button
                            type="button"
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                            onClick={() => {
                                setFilters({
                                    actorId: null,
                                    actionId: null,
                                    targetId: null,
                                    actorName: null,
                                    actionName: null,
                                    targetName: null,
                                    query: null,
                                });
                                formik.resetForm();
                                onClose();
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
                        >
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FiltersModal;
