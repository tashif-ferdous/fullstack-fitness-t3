import { Lift } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

type LiftCardProps = {
  name: string;
  cues?: string;
  editLink: string;
};

const Lifts: NextPage = () => {
  const lifts = trpc.useQuery(["lift.getAll"])

  return (
    <>
      <Head>
        <title>Fullstack Fitness | Lifts </title>
        <meta name="description" content="do you even lift bro?" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-5xl md:text-[5rem] leading-normal font-extrabold text-gray-700">
          Supported <span className="text-purple-300">Lifts</span>
        </h1>
        <p className="text-2xl text-gray-700">The app supports:</p>
        {lifts.data?renderLifts(lifts.data): <p> Loading... </p> }
      </main>
    </>
  );
};

const renderLifts = (lifts?: Lift[]) => {
  return (
    <div className="grid gap-3 pt-3 mt-3 text-center md:grid-cols-2 lg:w-2/3">
      {lifts?.map(lift => 
        <LiftCard key={lift.id} name={lift.name} cues={lift.cues || undefined} editLink={`/lifts/${lift.id}`}/>
      )}
    </div>
  )
}

const LiftCard = ({
  name,
  cues,
  editLink,
}: LiftCardProps) => {
  return (
    <section className="flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105">
      <h2 className="text-lg text-gray-700">{name}</h2>
      <p className="text-sm text-gray-600">{cues}</p>
      <a
        className="mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2"
        href={editLink}
      >
        Edit
      </a>
    </section>
  );
};

export default Lifts;
