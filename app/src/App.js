import './App.css';

function App() {
  return (
    <div className="App">
      {window.Telegram.WebApp.initData.user ? (
        <h1>Hello, {window.Telegram.WebApp.initData.user.first_name}!</h1>
      ) : (
        <h1>Hello, Guest!</h1>
      )}
      asdas
    </div>
  );
}

export default App;
