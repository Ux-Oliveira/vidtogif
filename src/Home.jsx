import { useState, useRef } from "react";

export default function Home() {
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthorize, setShowAuthorize] = useState(false);
  const [showTooLong, setShowTooLong] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const fileInputRef = useRef();

  const handleUpload = () => {
    const authorized = localStorage.getItem("mediaAuthorized");
    if (!authorized) {
      setShowAuthorize(true);
      return;
    }
    fileInputRef.current.click();
  };

  const authorize = () => {
    localStorage.setItem("mediaAuthorized", "true");
    setShowAuthorize(false);
    fileInputRef.current.click();
  };

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ CHECK DURATION BEFORE UPLOAD
    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = URL.createObjectURL(file);

    video.onloadedmetadata = async () => {
      URL.revokeObjectURL(video.src);

      if (video.duration > 180) {
        setShowTooLong(true);
        return;
      }

      setLoading(true);
      setDone(false);

      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch(
        "https://vidtogif-server.onrender.com/convert",
        { method: "POST", body: formData }
      );

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "converted.gif";
      a.click();

      setLoading(false);
      setDone(true);
      setTimeout(() => setDone(false), 2000);
    };
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="title">Turn your vids into gifs</div>
        <i
          className="fa-solid fa-star star"
          onClick={() => setShowMenu(true)}
        ></i>
      </nav>

      {/* MAIN */}
      <div className="layout">
        <div className="quadrant">

          <div className="quadrantContent">
            <div className="mobileText">
              <h1>
                Wanna post a video to{" "}
                <img
                  src="/piffylogo.png"
                  className="piffy"
                  onClick={() => window.open("https://pify.com", "_blank")}
                />
                ?
              </h1>
              <p>
                This will convert your videos into a 10 seconds gif you can post there!
                Videos cannot be longer than 3 minutes!
              </p>
            </div>

            {loading && (
              <div className="loadingBox">
                <p>Working on it...</p>
                <div className="bar"></div>
              </div>
            )}

            {done && <p className="done">Done!</p>}
          </div>

          {!loading && !done && (
            <button onClick={handleUpload} className="uploadBtn">
              Upload Video
            </button>
          )}

          <input
            type="file"
            accept="video/*"
            hidden
            ref={fileInputRef}
            onChange={handleFile}
          />
        </div>

        {/* DESKTOP TEXT */}
        <div className="textSide">
          <h1>
            Wanna post a video to{" "}
            <img
              src="/piffylogo.png"
              className="piffy"
              onClick={() => window.open("https://www.pi.fyi/", "_blank")}
            />
            ?
          </h1>
          <p id="quick">
            This will convert your videos into a 10 seconds gif you can post there!
            Videos cannot be longer than 3 minutes!
          </p>
        </div>
      </div>

      {/* MENU MODAL */}
      {showMenu && (
        <div className="modal" onClick={() => setShowMenu(false)}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <h1>What about it?</h1>
            <h1 id="priv"><a href="/privacy">Our Privacy Policy</a></h1>
            <span />
            <a
              id="patreon"
              href="https://www.patreon.com/c/ricksahuman"
              target="_blank"
              rel="noreferrer"
            >
              <i className="fa-brands fa-patreon"></i> Support the projects creator!
            </a>
          </div>
        </div>
      )}

      {/* AUTHORIZE MODAL */}
      {showAuthorize && (
        <div className="modal" onClick={() => setShowAuthorize(false)}>
          <div
            className="modalContent authCompact"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Allow media selection? We only get what you select!</h2>
            <button onClick={authorize}>Yes</button>
          </div>
        </div>
      )}

      {/* TOO LONG MODAL */}
      {showTooLong && (
        <div className="modal" onClick={() => setShowTooLong(false)}>
          <div
            className="modalContent authCompact"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>
              The video is too long. We only accept videos up to 3 minutes long.
            </h2>
            <button onClick={() => setShowTooLong(false)}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}
