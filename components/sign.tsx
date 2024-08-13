import styled from '@emotion/styled';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent, FC, useState } from 'react';

interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const SignLayout = styled.form`
  width: 35%;
  padding: 14%;

  .input-wrapper:first-of-type {
    margin-bottom: 3.2rem;
  }

  .label-text {
    margin-bottom: 1rem;
    color: #1c1c1c;

    span:last-child {
      color: #6364e5;
    }
  }

  label {
    border-radius: 10px;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  }

  input {
    border-color: transparent;
    background-color: #fff2ed;
  }

  button {
    width: 18rem;
    height: 4rem;

    background: linear-gradient(90deg, #7155f0 1.21%, #ab3fff 100%);
    box-shadow: 0px 6px 24px #e3c2ff;
    border-radius: 10px;
    margin-top: 2.3rem;
  }
`;

const SignComponent: FC<{
  providers: any;
  csrfToken: any;
}> = ({ providers }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassWord] = useState<string>('');
  const [, setLoading] = useState<boolean>(false);
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
      password,
      redirect: false,
    });

    setLoading(false);

    changeSignStatus('ldle');

    if (signInfo?.error) {
      alert(signInfo?.error);

      return;
    }

    router.replace('/home');
  };

  return (
    <SignLayout
      className="relative flex-1"
      onSubmit={(evt: any) => {
        evt.preventDefault();

        if (signStatus !== 'ldle') {
          return;
        }

        changeSignStatus('signing');
        goSignIn(providers);
      }}
    >
      <motion.div className="input-wrapper">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Input Your Email
        </label>
        <div className="relative kuso-input">
          <div className="flex items-center pointer-events-none label-text">
            Email Address
          </div>
          <input
            required
            type="email"
            id="email-search"
            className="block p-4 pl-10 w-full text-sm rounded-lg border"
            placeholder="Input Your Email"
            value={email}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              setEmail(e.target.value);
            }}
          />
        </div>
      </motion.div>
      <motion.div className="input-wrapper">
        <label
          htmlFor="search"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
        >
          Input Your Password
        </label>
        <div className="relative kuso-input">
          <div className="flex items-center label-text">
            <p className="flex justify-between flex-1">
              <span>Password</span>
              <span
                className="cursor-pointer"
                onClick={async (e: any) => {
                  if (!email.trim() || !email.includes('@')) {
                    alert('Email is required');
                    return;
                  }
                  e.target.classList.add('hidden');

                  const data = await (
                    await fetch(`/api/sendEmailSign?email=${email}`)
                  ).json();

                  if (data.error) {
                    alert(data.error);
                  }
                  e.target.classList.remove('hidden');
                }}
              >
                Forgot password?
              </span>
            </p>
          </div>
          <input
            required
            type="password"
            id="password"
            className="block p-4 pl-10 w-full text-sm rounded-lg border"
            placeholder="Input Your Password"
            value={password}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              setPassWord(e.target.value);
            }}
          />
        </div>
      </motion.div>

      <motion.button
        type="submit"
        whileTap={{ scale: 0.9 }}
        className="text-white"
      >
        Sign In
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.9 }}
        className="text-white"
        onClick={async () => {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          // MetaMask requires requesting permission to connect users accounts
          await provider.send('eth_requestAccounts', []);

          // The MetaMask plugin also allows signing transactions to
          // send ether and pay to change state within the blockchain.
          // For this, you need the account signer...
          const signer = provider.getSigner();
          console.log('Account:', await signer.getAddress());

          // console.log(signer);
          // signer._address
        }}
      >
        Sign In \w MetaMask
      </motion.button>
    </SignLayout>
  );
};

export default SignComponent;
