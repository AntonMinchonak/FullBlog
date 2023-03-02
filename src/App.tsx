import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Feed from './pages/Feed';
import Detail from './pages/Detail';
import './style/styles.scss'
import Header from './components/Header';
// import { AppDispatch } from './redux/store';
// import { useDispatch } from 'react-redux';
import NotFound from './pages/NotFound';
import Navigation from './components/Navigation';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { useAppDispatch } from './redux/store';
import { fetchMe } from './redux/slices/userSlice';
import UserSearch from './pages/UserSearch';

function App() {
  const dispatch = useAppDispatch()
  React.useEffect(() => {
    dispatch(fetchMe())  
  }, [])
  
  return (
    <div className="App">
      <Header />
      <div className="page-content">
        <Navigation></Navigation>
        <Routes>
          <Route path='/' element={<Feed />}></Route>
          <Route path='*' element={<NotFound />}></Route>
          <Route path='/detail/:id' element={<Detail />}></Route>
          <Route path='/auth/:type' element={<Auth />}></Route>
          <Route path='/profile/:id' element={<Profile />}></Route>
          <Route path='/users' element={<UserSearch />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
