import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { useNavigate } from "react-router-dom";

import Button from "./Button";

const navItems = ["Game HUB", "Github","404", "PMD", "to play song ->"];

const NavBar = () => {
  // State for toggling audio and visual indicator
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const navigate = useNavigate();

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIsIndicatorActive((prev) => !prev);
  };

  // Manage audio playback
  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">          {/* Logo and button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />            <Button
              id="product-button"
              title="MOONWALK"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
              onClick={() => navigate('/moonwalk')}
            />
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">              {navItems.map((item, index) => {
                // Handle different navigation items
                if (item === "Game HUB") {
                  return (
                    <a
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/gamebar");
                      }}
                      href="/gamebar"
                      className="nav-hover-btn cursor-pointer"
                    >
                      {item}
                    </a>
                  );
                } else if (item === "404") {
                  return (
                    <a
                      key={index}
                      href="/404/index.html"
                      className="nav-hover-btn cursor-pointer"
                    >
                      {item}
                    </a>
                  );                } else if (item === "Github") {
                  return (
                    <a
                      key={index}
                      href="https://github.com/DevAgnihotri/MJ"
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="nav-hover-btn cursor-pointer"
                    >
                      {item}
                    </a>
                  );                  } else if (item === "PMD") {
                  return (
                    <a
                      key={index}
                      href="/PMD-clock/index.html"
                      className="nav-hover-btn cursor-pointer"
                    >
                      {item}
                    </a>
                  );
                } else {
                  return (
                    <a
                      key={index}
                      href={`#${item.toLowerCase()}`}
                      className="nav-hover-btn"
                    >
                      {item}
                    </a>
                  );
                }
              })}
            </div>

            <button
              onClick={toggleAudioIndicator}
              className="ml-10 flex items-center space-x-0.5"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
