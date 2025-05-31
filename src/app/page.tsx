import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'


export default async function Home() {
  const imageUrl= "https://media.istockphoto.com/id/1359717993/vector/rhinoplasty-icons-set-outline-vector-human-nose.jpg?s=2048x2048&w=is&k=20&c=-2k5YeUMtLDviixe4e8QtLSBB0pFAxHGC6YTWetxgxE="
  const session = await getServerSession(authOptions) ;
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Rhinoplasty AI</h1>
      <p className="mt-4 text-lg">Your AI-powered solution for rhinoplasty consultations.</p>
      <img
        src={imageUrl}
        alt="Rhinoplasty Image"
        width={500}
        height={300}
        className="rounded-lg mt-8"
      />
    </main>
  );
}
