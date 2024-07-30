import dynamic from 'next/dynamic'
const One = dynamic(() => import('../components/One/One'), { ssr: false })
const Two = dynamic(() => import('../components/Two/Two'), { ssr: false })
const Three = dynamic(() => import('../components/Three/Three'), { ssr: false })
const Four = dynamic(() => import('../components/Four/Four'), { ssr: false })
const Five = dynamic(() => import('../components/Five/Five'), { ssr: false })
const Six = dynamic(() => import('../components/Six/Six'), { ssr: false })
const Seven = dynamic(() => import('../components/Seven/Seven'), { ssr: false })
const Eight = dynamic(() => import('../components/Eight/Eight'), { ssr: false })
const Lights = dynamic(() => import('../components/Lights/Lights'), { ssr: false })
const Shadows = dynamic(() => import('../components/Shadows/Shadows'), { ssr: false })

export default function Home() {
  return (
    <main>
        <Shadows/>
    </main>
  );
}
