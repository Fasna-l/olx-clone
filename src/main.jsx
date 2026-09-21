import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Components/Context/Auth.jsx'
import { ItemsContextProvider } from './Components/Context/Item.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
//AuthProvider nu ullil App ne wrap cheythathu kond ;App il ulla ella componenets num ee AuthProvider function available aayirikkum.
<BrowserRouter>  
  <ItemsContextProvider>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </ItemsContextProvider>
</BrowserRouter>
)
