// import { Alert, AlertIcon } from "@chakra-ui/react";
import { GetServerSideProps } from 'next';
import { getCsrfToken, getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

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

    // router.replace('/kanban');
  };

  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      {/* <Alert status="info" className="z-50">
        <AlertIcon />
        Chakra is going live on August 30th. Get ready!
      </Alert> */}
      {/* <Header /> */}
      <div className="bg-slate-400" />
      <div className="">
        <div className="">
          {/* <Image
            src="/katalog_full.svg"
            width="196px"
            height="64px"
            alt="App Logo"
            style={{ height: "85px", marginBottom: "20px" }}
          /> */}
          <form
            onSubmit={(evt) => {
              evt.preventDefault();
              // goSignIn('email');
              goSignIn(providers);
              // goSignIn('providers');
            }}
          >
            <input name="csrfToken" type="hidden" defaultValue={'csrfToken'} />
            <input
              autoComplete="on"
              placeholder="Please enter your email"
              size={30}
              value={email}
              onInput={(evt) => {
                setEmail((evt.target as HTMLInputElement).value);
              }}
              onKeyDown={(evt) => {
                // if (evt.key === 'Enter') {
                //   goSignIn(providers);
                // }
              }}
            />

            <button type="submit">登录</button>
            <hr />
            {/* {providers &&
              Object.values(providers).map((provider) => (
                <div key={provider.name} style={{ marginBottom: 0 }}>
                  <button onClick={() => signIn(provider.id, { email })}>
                    登录
                  </button>
                </div>
              ))} */}
          </form>
        </div>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/dragon.jpg" alt="Pattern Background" />
    </div>
  );
};

export default SignComponent;
