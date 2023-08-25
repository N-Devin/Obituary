import React, { useState } from "react";
import Card from "./card";

function App() {
  const [isWindowOpen, setIsWindowOpen] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  const [buttonText, setButtonText] = useState(
    "Choose the picture to be uploaded"
  );
  const [dead_pic, setdead_pic] = useState(null);
  const [name, setname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [items, setItems] = useState([]);

  function handleClick() {
    setIsWindowOpen(true);
  }

  function handleClose() {
    setIsWindowOpen(false);
  }

  const handleFileInput = (event) => {
    const file = event.target.files[0];
    setdead_pic(file);
    setButtonText(file.name);
  };

  const handleUploadClick = async () => {
    if (!name || !birthDate || !deathDate || !dead_pic) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    setIsLoading(true);

    // you need to use FormData to store the binary file
    // const data = new FormData();
    // data.append("dead_pic", dead_pic);

    const data = new FormData();
    data.append("name", name);
    data.append("birthDate", birthDate);
    data.append("deathDate", deathDate);
    data.append("dead_pic", dead_pic);

    const newItem = {
      name: name,
      birthDate: birthDate,
      deathDate: deathDate,
      dead_pic: dead_pic,
    };
    setItems([...items, newItem]);
    // localStorage.setItem("items", JSON.stringify(items));

    if (dead_pic) {
      try {
        const res = await fetch(
          "https://brsa5dpz57ef6vs53zzq753dqm0hqtip.lambda-url.ca-central-1.on.aws/",
          {
            method: "POST",
            body: data,
          }
        );
        console.log(res.status);
      } catch (err) {
        console.error(err);
      }
    }
    getNotes();
    setIsLoading(false);
    setIsWindowOpen(false);
  };

  const getNotes = async () => {
    const res = await fetch(
      "https://q7she33glqb6f5fqmlxa3nydk40jrigc.lambda-url.ca-central-1.on.aws/",
      {
        method: "GET",
      }
    );
    if (res.status === 200) {
      const backend_data = await res.json();
      setItems(backend_data);
      console.log(backend_data);
    }
  };

  React.useEffect(() => {
    getNotes();
  }, []);

  return (
    <>
      {IsLoading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div>
          <div className="navbar">
            <div className="Title">
              <h1>The Last Show</h1>
            </div>
            <button className="NewObituary" onClick={handleClick}>
              Add Obituary
            </button>
          </div>
          {isWindowOpen && (
            <div className="overlay">
              <div className="window">
                <button className="close-button" onClick={handleClose}>
                  &#x2715;
                </button>
                <div className="Title">
                  <h1>Create New Obituary</h1>
                </div>
                <img src={require("./Rip.png")} alt="logo" />
                <label htmlFor="fileInput" className="upload-dead_pic">
                  {buttonText}
                </label>
                <input
                  id="fileInput"
                  type="file"
                  onChange={handleFileInput}
                  style={{ display: "none" }}
                />
                <input
                  type="text"
                  placeholder="Name of the deceased"
                  value={name}
                  onChange={(event) => setname(event.target.value)}
                />{" "}
                <div className="date">
                  <h3>Born</h3>
                </div>
                <input
                  type="date"
                  placeholder="Birth Date"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
                <div className="date">
                  <h3>Died</h3>
                </div>
                <input
                  type="date"
                  placeholder="Death Date"
                  value={deathDate}
                  onChange={(event) => setDeathDate(event.target.value)}
                />
                <button className="upload-Button" onClick={handleUploadClick}>
                  Write Obituary
                </button>
              </div>
            </div>
          )}
          <div className="card-container">
            {items.map((item) => (
              <Card
                name={item.name}
                birthDate={item.born_year}
                deathDate={item.died_year}
                Obituary={item.obituary}
                image_url={item.image_url}
                mp3_url={item.mp3_url}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
