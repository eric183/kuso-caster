import { motion } from 'framer-motion';
import { GetServerSideProps } from 'next';
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface Credentials {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

export default function SignIn({
  providers,
  csrfToken,
}: {
  providers: {
    credentials: Credentials;
  };
  [key: string]: any;
}) {
  const [email, setEmail] = useState<string>('');
  const [, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const goSignIn = async (providers: { credentials: Credentials }) => {
    setLoading(true);

    console.log(providers, 'providers');
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

    router.replace('/kanban');
  };

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div className={'bg-slate-400'} />
      <div className="">
        <div className="">
          <form
            className=""
            onSubmit={(evt) => {
              evt.preventDefault();
              goSignIn(providers);
            }}
          >
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
            <input
              autoComplete="on"
              placeholder="Please enter your email"
              size={30}
              value={email}
              onInput={(evt) => {
                setEmail((evt.target as HTMLInputElement).value);
              }}
              onKeyDown={(evt) => {
                if (evt.key === 'Enter') {
                  goSignIn(providers);
                }
              }}
            />

            <button type="submit">登录</button>
            <hr />
          </form>
        </div>
      </div>
      <motion.img src="/dragon.jpg" alt="Pattern Background" className="" />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  return {
    props: {
      providers,
      csrfToken,
    },
  };
};
