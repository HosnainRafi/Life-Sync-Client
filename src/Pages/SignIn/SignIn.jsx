import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import { Helmet } from 'react-helmet';
import { useContext, useState } from 'react';
import { AuthContext } from '../../Firebase/AuthProvider';
import toast from 'react-hot-toast';
import { FaGoogle } from 'react-icons/fa';
function SignIn() {
  const { loginUser, setUser,googleLogin, resetPassword } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [forgetPassword, setForgetPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location?.state || '/';
  const handleLogin = e => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);
    loginUser(email, password)
      .then(result => {
        setUser(result.user);
        toast.success('Login Successfully!');
        navigate(from);
      })
      .catch(() => {
        setError('Wrong Email or Password');
        toast.error('Wrong Email or Password');
      });
  };
    const handleGoogleLogin = () => {
      googleLogin()
        .then(result => {
          setUser(result.user);
          toast.success('SignIn with Google Successfully');
          navigate(from);
        })
        .catch(error => console.log(error));
    };
  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    console.log('Reset Password', email);
    resetPassword(email).then(() =>{
      toast.success('Password reset link sent to your email'),
      setForgetPassword(false);
    })
  };
  const handleGotoResetPassword = () => {
    console.log('Goto Password');
    setForgetPassword(true);
  };
  return (
    <div className="my-10">
      <Helmet>
        <title>Life Sync | Sign In</title>
      </Helmet>
      {!forgetPassword ? (
        <div className="w-full max-w-sm p-6 m-auto mx-auto bg-white rounded-lg shadow-md ">
          <div className="flex justify-center mx-auto">
            <img className="w-32" src={logo} alt="" />
          </div>

          <form onSubmit={handleLogin} className="mt-6">
            <div>
              <label htmlFor="Email" className="block text-sm text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg  dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-md text-black">
                  Password
                </label>
              </div>

              <input
                type="password"
                name="password"
                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg  dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
              <div className="flex justify-end my-2">
                <Link
                  onClick={handleGotoResetPassword}
                  className="text-xs text-gray-600 dark:text-gray-600 hover:underline"
                >
                  Forget Password?
                </Link>
              </div>
            </div>
            <small className="text-red-700 -mb-3 animate__animated animate__shakeX">
              {error}
            </small>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Sign In
              </button>
            </div>
          </form>
          <div className='mt-5'>
            <button
              onClick={handleGoogleLogin}
              className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 flex items-center gap-2 justify-center"
            >
              <FaGoogle className="text-lg text-white" />
              google
            </button>
          </div>
          <p className="mt-8 text-base font-light text-center text-gray-800">
            {' '}
            Do not have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-gray-700 dark:text-gray-600 hover:underline"
            >
              Create One
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          <div className="flex flex-col max-w-lg p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900">
            <div className="mb-8 text-center">
              <h1 className="my-3 text-4xl font-bold">Reset Password</h1>
              <p className="text-sm text-gray-400">
                Please Enter Email for reset password
              </p>
            </div>
            <form
              onSubmit={handleResetPassword}
              noValidate=""
              action=""
              className="space-y-6 ng-untouched ng-pristine ng-valid"
            >
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    placeholder="Enter Your Email Here"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-[#1B1F3B] bg-gray-200 text-gray-900"
                    data-temp-mail-org="0"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignIn;
