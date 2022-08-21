import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react"

const LoginLanding = () => {
  return (
    <>
      <p className="text-2xl text-gray-700">See where your lifts stack up!</p>
      <button 
        onClick={() => signIn("discord")}
        className="mt-5 flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105"
      >
        <h2 className="text-xl text-gray-700">Sign in with discord</h2>
      </button>
    </>
  )
}

const Landing = () => {
  const { data: session } = useSession()
  const name = session?.user?.name
  return (
    <>
      <p className="text-3xl text-gray-700">
        <span className="text-purple-300">
          {name}
        </span>, ready to lift 🚀 ?
      </p>
      <section className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
        <button 
          onClick={() => signOut()}
          className="mt-5 flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105"
        >
          <h2 className="text-xl text-gray-700">Sign out</h2>
        </button> 
      </section>
    </>
  )
}

const Home: NextPage = () => {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <p className="text-2xl text-gray-700">Logging In...</p>
    )
  }

  return (
    <>
      <Head>
        <title>Fullstack Fitness</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
        Fullstack <span className="text-purple-300">Fitness</span> 
        </h1>
        {session? <Landing />:  <LoginLanding /> }
      </main>
    </>
  )
}

export default Home
