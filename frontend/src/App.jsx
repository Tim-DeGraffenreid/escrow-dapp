import { useState } from 'react'
import './App.css'
import { SiHiveBlockchain } from "react-icons/si";
import Section from './Components/Section';
import Button from './components/Button';
import Navigation from './components/Navigation';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navigation/>
      <Section>
      <h1>Escrow Dapp</h1>
      <Button href='*' caption='Get Started'></Button>
      </Section>  
      
  
    </>
  )
}

export default App
