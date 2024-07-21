
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Register from './components/Register';
import Login from './components/Login';
import Task from './components/Task';
import { Provider } from 'react-redux';
import store from './redux/app/store';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="">
      <Provider store={store}>
        <Router>
            <Routes>
                <Route path="/" element={<Header />}>
                    <Route path="/register" element={<Register />}></Route>
                    <Route path="/login" element={<Login />}></Route>
                    <Route path="/" element={<ProtectedRoute />}>
                      <Route path="/task" element={<Task />}></Route>
                    </Route> 
                </Route>
            </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
