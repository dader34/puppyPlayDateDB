import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopNav from "./components/TopNav";
import SideNav from "./components/SideNav";
import AlertBar from "./components/AlertBar";
import Footer from "./components/Footer";

const App = () => {
  const [isDark, setIsDark] = useState(localStorage.dark === "true");
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState(null);
  const [snackType, setSnackType] = useState("");
  const [dogs, setDogs] = useState([]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    localStorage.setItem("dark", !isDark);
  };

  useEffect(() => {
    const getData = () => {
      fetch("https://puppydb.danner.repl.co/dogs")
        .then((resp) => resp.json())
        .then(setDogs)
        .catch((err) => {
          handleSnackType("error");
          setAlertMessage(err.message);
        });
    };
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddDog = (newDog) => {
    const updatedDogs = [...dogs, newDog];
    setDogs(updatedDogs);
  };

  const handleDeleteDog = (oldDog) => {
    const updatedDogs = dogs.filter((dog) => dog.id !== oldDog.id);
    setDogs(updatedDogs);
  };

  const newSearch = (e) => setSearchTerm(e.target.value);

  const setAlertMessage = (msg) => setMessage(msg);

  const handleSnackType = (type) => setSnackType(type);

  const ctx = {
    dogs,
    searchTerm,
    setAlertMessage,
    handleSnackType,
    handleAddDog,
    handleDeleteDog,
  };

  return (
    <div className={isDark ? "app dark" : "app"}>
      <SideNav />
      <main className="container">
        {message && (
          <AlertBar
            message={message}
            snackType={snackType}
            setAlertMessage={setAlertMessage}
            handleSnackType={handleSnackType}
          />
        )}
        <TopNav
          isDark={isDark}
          searchTerm={searchTerm}
          toggleDarkMode={toggleDarkMode}
          newSearch={newSearch}
        />
        <div className="outlet">
          <Outlet context={ctx} />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default App;
