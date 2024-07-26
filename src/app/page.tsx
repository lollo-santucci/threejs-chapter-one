import dynamic from 'next/dynamic'
const One = dynamic(() => import('../components/One/One'), { ssr: false })

export default function Home() {
  return (
    <main>
        <h1>Threejs Project</h1>
        <One/>
    </main>
  );
}
