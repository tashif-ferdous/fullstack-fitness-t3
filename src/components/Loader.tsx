import Head from 'next/head'

type LoaderProps = {
  title: string,
  text: string,
}

export default function Loader({title, text}: LoaderProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-3xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          {text}
        </h1>    
      </main>
    </>
  )
}