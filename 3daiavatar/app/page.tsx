import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>3D Ai Avatar</h1>
      <button className="m-4">send post</button>
      <button className="m-4">upload file</button>
    </main>
  );
}
