import './App.css';
import { RecoilRoot } from 'recoil';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/login/Login';
import Store from './pages/store/Store';
import StoreDetail from './pages/store/StoreDetail';
import StoreAdd from './pages/store/StoreAdd';
import StoreDetailEdit from './pages/store/StoreDetailEdit';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <RecoilRoot>
          <Routes>
            <Route path='/' element={<Login />}></Route>
            <Route path='/store' element={<Store />}></Route>
            <Route path='/store/add' element={<StoreAdd />}></Route>
            <Route path='/store/detail/:storeId' element={<StoreDetail />}></Route>
            <Route path='/store/edit/:storeId' element={<StoreDetailEdit />}></Route>
          </Routes>
        </RecoilRoot>
      </BrowserRouter>
    </div>
  );
}

export default App;
