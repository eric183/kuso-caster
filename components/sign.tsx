// import { Alert, AlertIcon } from "@chakra-ui/react";
import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useState } from 'react';

interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const SignComponent: FC<{
  providers: any;
  csrfToken: any;
}> = ({ providers, csrfToken }) => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [signStatus, changeSignStatus] = useState<
    'ldle' | 'signing' | 'signed'
  >('ldle');

  const router = useRouter();
  const goSignIn = async (providers: { credentials: Credentials }) => {
    setLoading(true);
    if (!email.trim()) {
      alert('Email is required');

      setLoading(false);
      return;
    }

    const signInfo = await signIn(providers.credentials.id, {
      email,
      redirect: false,
    });
    setLoading(false);

    if (signInfo?.error) {
      alert(signInfo?.error);
      return;
    }
    router.replace('/home');
  };

  return (
    <form
      className="basis-5/12 relative"
      onSubmit={(evt: any) => {
        evt.preventDefault();
        changeSignStatus('signing');
        goSignIn(providers);
      }}
    >
      <label
        htmlFor="search"
        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
      >
        Input Your Email
      </label>
      <div className="relative">
        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
        <input
          required
          type="search"
          id="search-login"
          className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Input Your Email"
          value={email}
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            setEmail(e.target.value);
            if (e.target.value.length === 0) {
              changeSignStatus('ldle');
              return;
            }
            if (signStatus !== 'ldle') {
              changeSignStatus('ldle');
            }
          }}
        />

        {signStatus === 'ldle' && (
          <motion.button
            type="submit"
            whileTap={{ scale: 0.9 }}
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Login
          </motion.button>
        )}
        {/* {searchingStatus === 'searching' && <Spin />} */}
      </div>
    </form>
  );
};

export default SignComponent;
