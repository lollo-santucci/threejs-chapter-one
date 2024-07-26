import dynamic from 'next/dynamic'
const One = dynamic(() => import('../components/One/One'), { ssr: false })
const Two = dynamic(() => import('../components/Two/Two'), { ssr: false })
const Three = dynamic(() => import('../components/Three/Three'), { ssr: false })

export default function Home() {
  return (
    <main>
        <h1>Threejs Project</h1>
        <Three/>
        <br/>
        <Two/>
        <br/>
        <One/>
    </main>
  );
}
