import { useState } from 'react'
import './App.css'
import { SiHiveBlockchain } from "react-icons/si";
import Section from './Components/Section';
import Button from './components/Button';
import Navigation from './components/Navigation';
import Input from './components/Input';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navigation/>
      <Section>
      <h1>Escrow Dapp</h1>
      <Button href='/' className='mx-auto' caption='Get Started'></Button>
      <Input  label='Account address'/>
      </Section>  
      
  
    </>
  )
}

export default App
