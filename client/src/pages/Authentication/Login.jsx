import React from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { AUTH_APIS } from '../../apis/apis';
import { toast } from 'react-toastify';


const Login = () => {
  const LoginMutation = useMutation({
    mutationFn: async (values) => {
      return await AUTH_APIS.login(values);
    },
    onSuccess: (data) => {
      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);
      localStorage.setItem('authUser', JSON.stringify(data.authUser));
      window.location.href = '/';
    },
    onError: (error) => {
      toast.error(error);
    }
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      LoginMutation.mutate(values);
    },
  });


  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-black text-white p-8 rounded-lg shadow-md w-full max-w-md bg-gray-900 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">instatus</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit();
        }}>
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
            {formik.errors.email && formik.touched.email ? (
              <div className="text-red-500 text-sm mt-2">{formik.errors.email}</div>
            ) : null}
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-gray-400" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name='password'
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full p-3 border rounded-lg bg-gray-900 border-gray-700 text-white outline-none"
              placeholder="Enter your password"
            />
            {formik.errors.password && formik.touched.password ? (
              <div className="text-red-500 text-sm mt-2">{formik.errors.password}</div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-black py-3 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-4">
          Don't have an account? <Link to="/register" className='text-green-500 hover:underline'>Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
