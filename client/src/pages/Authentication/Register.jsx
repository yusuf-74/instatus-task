import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { AUTH_APIS } from '../../apis/apis';
import { toast } from 'react-toastify';


const Register = () => {
  const RegisterMutation = useMutation({
    mutationFn: async (values) => {
      return await AUTH_APIS.register(values);
    },
    onSuccess: () => {
      window.location.href = '/';
    },
    onError: (error) => {
      toast.error(error);
    }
  })

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('Required'),
      lastName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match').required('Required'),
    }),
    onSubmit: (values) => {
      console.log(values);
      RegisterMutation.mutate(values);
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="flex justify-center items-center w-full max-w-5xl">
        <div className="bg-black text-white p-8 rounded-lg shadow-md w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">instatus</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
          }}>
            <div className="mb-4">
              {/* first name */}
              <label className="block mb-2 text-gray-400" htmlFor="first-name">
                First name
              </label>
              <input
                type="text"
                id="first-name"
                name='firstName'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.firstName}
                className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
                placeholder="Yusuf"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-400" htmlFor="last-name">
                Last name
              </label>
              <input
                type="text"
                id="last-name"
                name='lastName'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.lastName}
                className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
                placeholder="Ashour"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-400" htmlFor="email">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name='email'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
                className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
                placeholder="yusuf@instatus.com"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-400" htmlFor="company-name">
                Password
              </label>
              <input
                type="password"
                id="company-name"
                name='password'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
                className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
                placeholder="Please enter your password"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-gray-400" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                name='confirmPassword'
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
                placeholder="Please confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 text-black py-3 rounded-lg hover:bg-green-600 transition duration-200"
              onClick={formik.handleSubmit}
            >
              Register
            </button>
            <p className="text-center text-gray-400 mt-4">
              Already have an account? <Link to="/login" className='text-green-500 hover:underline'>Login</Link>
            </p>
          </form>
        </div>
        <div className="hidden md:flex justify-center items-center w-1/2 bg-white">
          <div className="p-8">
            <div className="text-center mb-6">
              <svg className="w-12 h-12 mx-auto text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v3a1 1 0 001 1h2a1 1 0 100-2h-1V6zm-1 7a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">All systems operational</p>
              <div className="mt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Website</span>
                  <span>100% uptime</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-gray-600">
                  <span>App</span>
                  <span>100% uptime</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <button className="mt-6 px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                Get updates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
