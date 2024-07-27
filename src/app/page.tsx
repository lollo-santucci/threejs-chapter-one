import dynamic from 'next/dynamic'
const One = dynamic(() => import('../components/One/One'), { ssr: false })
const Two = dynamic(() => import('../components/Two/Two'), { ssr: false })
const Three = dynamic(() => import('../components/Three/Three'), { ssr: false })
const Four = dynamic(() => import('../components/Four/Four'), { ssr: false })
const Five = dynamic(() => import('../components/Five/Five'), { ssr: false })

export default function Home() {
  return (
    <main>
        <Five/>
    </main>
  );
}
