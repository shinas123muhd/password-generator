import { useEffect, useState } from 'react'
import { BASE_URL } from '../constants'
import axios from 'axios'
import { FaRegCopy } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import './App.css'
import { CopyToClipboard } from 'react-copy-to-clipboard';

function App() {
  const [savedPass, setSavedPass] = useState([])
  const [text, setText] = useState('')
  const [passwordLength, setPasswordLength] = useState(8); // Initial length
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSymbols, setIncludeSymbols] = useState(false);

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/api/generate/`, {
        passwordLength,
        includeNumbers,
        includeUppercase,
        includeSymbols
      });
      console.log(response)
      setText(response.data)
    } catch {
      console.log('error')

    }
  }
  const savePassword = async (e) => {
    e.preventDefault();
    try {
      if (!savedPass.some(saved => saved.password === text)) {
        // Add the password to the list of saved passwords
        setSavedPass([...savedPass, { password: text }]);

        
        const response = await axios.post(`${BASE_URL}/api/savepassword/`, {
          password: text,
        });

        console.log(response);
      } else {
        console.log("Password already exists");
      }


    } catch {
      console.log("error")

    }

  }
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/showpasswords`)
        console.log(response.data)
        setSavedPass(response.data)
      } catch {
        console.log("error")
      }
    }
    fetchPasswords();
  }, [])


  return (
    <>
      <div className=' bg-slate-300 h-screen font-abc'>
        <div className='p-5 flex justify-center'>
          <h1 className='mt-10 text-5xl'>Password Generator</h1>
        </div>
        <form onSubmit={submitForm}>
          <div className='px-52  mt-10'>

            <div className='flex justify-between border p-3 border-black rounded-lg'>
              <div>
                <label htmlFor="passwordLength">Length:</label>
                <select
                  id="passwordLength"
                  name="passwordLength"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value, 10))}
                >
                  <option value="8">8</option>
                  <option value="10">10</option>
                  <option value="12">12</option>
                  <option value="16">16</option>
                </select>
              </div>
              <div>
                <label htmlFor="includeUppercase">Uppercase:</label>
                <input
                  type="checkbox"
                  id="includeUppercase"
                  name="includeUppercase"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                />
              </div>
              <div>
                <label htmlFor="includeNumbers">Numbers:</label>
                <input
                  type="checkbox"
                  id="includeNumbers"
                  name="includeNumbers"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                />
              </div>
              <div>
                <label htmlFor="includeSymbols">Symbols:</label>
                <input
                  type="checkbox"
                  id="includeSymbols"
                  name="includeSymbols"
                  checked={includeSymbols}
                  onChange={() => setIncludeSymbols(!includeSymbols)}
                />
              </div>

            </div>
            <div className='flex justify-center mt-5'>
              <button className=' bg-green-500 p-2 rounded-md'>Generate</button>
            </div>


          </div>
        </form>
        <div className='flex justify-center mt-10 relative'>
          <label>

            <div className='relative '>
              <input className='appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' type="text" name="name" value={text} disabled />
              {text && (<CopyToClipboard text={text}>
                <FaRegCopy className='absolute top-2 cursor-pointer right-8' />
              </CopyToClipboard>)}
              {text && (<FaSave className='absolute top-2 cursor-pointer right-3' onClick={(e) => { savePassword(e) }} />)}


            </div>
          </label>
        </div>
        <div className='flex justify-end mr-14'>
          <h1 className='border-b border-green-600'>Saved Passwords</h1>
        </div>
        <div className='max-h-48 overflow-y-auto  p-4 mt-5 w-1/6 border border-black ml-auto mr-5'>
          {savedPass.map((item) => (


            <div key={item.id} className='flex justify-between'>
              <div>
                <h1>{item.password}</h1>

              </div>
              <div>
                <CopyToClipboard text={item.password}>
                  <FaRegCopy className=' cursor-pointer' />
                </CopyToClipboard>

              </div>

            </div>))}
        </div>

      </div>

    </>
  )
}

export default App
