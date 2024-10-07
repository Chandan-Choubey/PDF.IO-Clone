import React, { useEffect, useState } from "react";
import "../Css/Header.css";
import { FaBars, FaTimes } from "react-icons/fa";
import LoginSignupForm from "./LoginSignupForm";
import { jwtDecode } from "jwt-decode";

function Header({ onSelectMenu }) {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isMenuIcon, setIsMenuIcon] = useState(false);
  const [token, setToken] = useState(false);
  const [user, setUser] = useState({
    email: "",
    username: "",
  });

  const toggleMenuIcon = () => {
    setIsMenuIcon(!isMenuIcon);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser({ email: "", username: "" });
  };

  const toggleDropdown = (menu) => {
    setSelectedMenu(selectedMenu === menu ? null : menu);
  };

  const closeDropdowns = () => {
    setSelectedMenu(null);
  };

  const toggleLoginForm = () => {
    setIsLoginFormOpen(!isLoginFormOpen);
  };

  const handleMenuClick = (menu) => {
    onSelectMenu(menu);
    closeDropdowns();
  };

  const menus = [
    {
      id: "pdfTools",
      label: "PDF Tools",
      options: [
        { id: 1, label: "PDF Conversion", link: "pdfConversion" },
        { id: 2, label: "Merge PDF", link: "mergePdf" },
        { id: 3, label: "Rotate PDF", link: "rotatePdf" },
        { id: 4, label: "PDF to PPT", link: "pdfToPpt" },
      ],
    },
    {
      id: "converters",
      label: "Converters",
      options: [
        { id: 1, label: "Image to PDF", link: "imageToPdf" },
        { id: 2, label: "Edit Image", link: "editImage" },
      ],
    },
    {
      id: "utilities",
      label: "Utilities",
      options: [
        { id: 1, label: "File Compressor", link: "fileCompressor" },
        { id: 2, label: "Secure PDF", link: "securePdf" },
      ],
    },
    {
      id: "videoTools",
      label: "Video Tools",
      options: [
        { id: 1, label: "Video Conversion", link: "videoConversion" },
        { id: 3, label: "Screen Recorder", link: "screenRecorder" },
        { id: 4, label: "Add Audio to Video", link: "addAudioToVideo" },
        { id: 5, label: "Add Image to Video", link: "addImageToVideo" },
        { id: 6, label: "Add Text to Video", link: "addTextToVideo" },
        { id: 7, label: "Crop Video", link: "cropVideo" },
        { id: 8, label: "Rotate Video", link: "rotateVideo" },
        { id: 9, label: "Flip Video", link: "flipVideo" },
        { id: 10, label: "Resize Video", link: "resizeVideo" },
        { id: 11, label: "Loop Video", link: "loopVideo" },
        { id: 12, label: "Change Volume", link: "changeVolume" },
        { id: 13, label: "Change Speed", link: "changeSpeed" },
        { id: 14, label: "Merge Videos", link: "mergeVideos" },
      ],
    },
    {
      id: "audioTools",
      label: "Audio Tools",
      options: [
        { id: 1, label: "Trim Audio", link: "trimAudio" },
        { id: 2, label: "Change Audio Volume", link: "changeAudioVolume" },
        { id: 3, label: "Change Audio Speed", link: "changeAudioSpeed" },
        { id: 4, label: "Change Audio Pitch", link: "changeAudioPitch" },
        { id: 5, label: "Equalizer", link: "equalizer" },
        { id: 6, label: "Reverse Audio", link: "reverseAudio" },
        { id: 7, label: "Voice Recorder", link: "voiceRecorder" },
        { id: 8, label: "Audio Joiner", link: "audioJoiner" },
      ],
    },
  ];

  const getToken = () => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode(storedToken);
        setUser({ username: decoded.username, email: decoded.email });
      } catch (error) {
        console.error("Invalid token:", error);
        alert("Invalid token. Please log in again.");
      }
    } else {
      setUser({ email: "", username: "" });
    }
  };

  useEffect(() => {
    getToken();
  }, [token]);

  return (
    <header className="header">
      <div className="header-container">
        <a href="/">
          <h1 className="logo">PDF.io Clone</h1>
        </a>
        <button className="menu-toggle" onClick={toggleMenuIcon}>
          {isMenuIcon ? <FaTimes /> : <FaBars />}
        </button>

        <nav className={`nav ${isMenuIcon ? "open" : ""}`}>
          <ul className="menu">
            {menus.map((menu) => (
              <li key={menu.id} className="menu-item">
                <button
                  className="menu-button"
                  onClick={() => toggleDropdown(menu.id)}
                >
                  {menu.label}
                </button>
                {selectedMenu === menu.id && (
                  <ul
                    className={`dropdown-menu ${
                      menu.id === "videoTools" ? "scrollable-menu" : ""
                    }`}
                  >
                    {menu.options.map((option) => (
                      <li key={option.id}>
                        <a
                          onClick={() => handleMenuClick(option.link)}
                          className="menu-item-btn"
                        >
                          {option.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            <li className="menu-item">
              <button
                className="login-button"
                onClick={token ? handleLogout : toggleLoginForm}
              >
                {token ? "Logout" : "Login"}
              </button>
            </li>
          </ul>
        </nav>
        {isLoginFormOpen && <LoginSignupForm closeForm={toggleLoginForm} />}
      </div>
    </header>
  );
}

export default Header;
