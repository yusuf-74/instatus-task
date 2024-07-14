import React from 'react';
import { useFormik } from 'formik';
import 'tailwindcss/tailwind.css';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ACTIONS_APIS, AUTH_APIS, EVENTS_APIS } from '../../apis/apis';
import { toast } from 'react-toastify';
import ConfirmationModal from '../../components/ConfirmationModal';
const EventsCreate = () => {
  const [generateModalOpen, setGenerateModalOpen] = React.useState(false);
  const [resetModalOpen, setResetModalOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const UsersQuery = useQuery({
    queryKey: ['users'],
    queryFn: async () => await AUTH_APIS.listUsers(),
  })

  const ActionsQuery = useQuery({
    queryKey: ['actions'],
    queryFn: async () => await ACTIONS_APIS.listActions(),
  });

  const EventsMutation = useMutation({
    mutationKey: ['createEvent'],
    mutationFn: async (data) => await EVENTS_APIS.createEvent(data),
    onSuccess: () => {
      toast.success('Event created successfully');
      queryClient.invalidateQueries('events', { exact: false });
    },
    onError: () => {
      toast.error('Failed to create event');
    }
  })

  const MassGenerationMutation = useMutation({
    mutationKey: ['generateEvents'],
    mutationFn: async () => await EVENTS_APIS.generateEvents(),
    onSuccess: () => {
      toast.success('Events generated successfully');
      queryClient.invalidateQueries('events', { exact: false });
      setGenerateModalOpen(false);
    },
    onError: () => {
      toast.error('Failed to generate events');
    }
  })

  const ResetMutation = useMutation({
    mutationKey: ['resetEvents'],
    mutationFn: async () => await EVENTS_APIS.resetEventsData(),
    onSuccess: () => {
      toast.success('Events reset successfully');
      queryClient.invalidateQueries('events', { exact: false });
      setResetModalOpen(false);
    },
    onError: () => {
      toast.error('Failed to reset events');
    }
  })


  const actionsOptions = ActionsQuery?.data || [];
  const usersOptions = UsersQuery?.data || [];

  const formik = useFormik({
    initialValues: {
      actorId: null,
      actionId: null,
      targetId: null,
    },
    onSubmit: (values) => {
      EventsMutation.mutate(values);
    },
  });

  const handleMassGenerate = () => {
    MassGenerationMutation.mutate();
  };

  const handleReset = () => {
    ResetMutation.mutate();
    toast.success('Events reset successfully');
    queryClient.invalidateQueries('events', { exact: false });
    setResetModalOpen(false);
  };

  return (
    <>
      <ConfirmationModal isOpen={generateModalOpen} onClose={() => setGenerateModalOpen(false)} onConfirm={handleMassGenerate} message="Are you sure you want to generate events? this will create between 30 and 50 record" type="success" />
      <ConfirmationModal isOpen={resetModalOpen} onClose={() => setResetModalOpen(false)} onConfirm={handleReset} message="Are you sure you want to reset events table?" type="danger" />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Create Event</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label htmlFor="actor" className="block text-sm font-medium text-gray-700">
              Actor
            </label>
            <select
              id="actor"
              name="actorId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.actor}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Actor</option>
              {usersOptions.map((option, index) => (
                <option key={index} value={option.id}>{option.email}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="action" className="block text-sm font-medium text-gray-700">
              Action
            </label>
            <select
              id="action"
              name="actionId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.action}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Action</option>
              {actionsOptions.map((option, index) => (
                <option key={index} value={option.id}>{option.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="target" className="block text-sm font-medium text-gray-700">
              Target
            </label>
            <select
              id="target"
              name="targetId"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.target}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Target</option>
              {usersOptions.map((option, index) => (
                <option key={index} value={option.id}>{option.email}</option>
              ))}
            </select>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              disabled={!formik.isValid || formik.isSubmitting}
            >
              Submit
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              onClick={() => setGenerateModalOpen(true)}
            >
              Mass Generate
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              onClick={() => setResetModalOpen(true)}
            >
              Reset
            </button>
          </div>
        </form>
      </div></>
  );
};

export default EventsCreate;
