import Game from '../components/Game';
import { getWeb } from '../page';


export default async function Home() {
    const web = await getWeb()
    return (
        <main>
          <Game web={web} matchups={null} is_custom={true}/>
        </main> 
    )
}
  