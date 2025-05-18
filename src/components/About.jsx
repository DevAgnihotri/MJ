import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";

import AnimatedTitle from "./AnimatedTitle";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center",
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  });

  return (
    <div id="about" className="min-h-screen w-screen">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="font-general text-sm uppercase md:text-[10px]">
          My OutlierAI Hackathon Submission
        </p>
        <AnimatedTitle
          title="MJ: The <b>K</b>ing <b>o</b>f P<b>o</b>p <br /> leg<b>a</b>cy ex<b>p</b>e<b>r</b>ie<b>n</b>ce"
          containerClass="mt-5 !text-black text-center"
        />
        <div className="about-subtext flex flex-col">
          <p>Celebrating the legendary Michael Jackson through interactive technology.</p>
          <p className="text-gray-500">
            My OutlierAI Hackathon submission features multiple unique MJ-themed mini-apps.
          </p>
        </div>
      </div>
      <div className="h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.webp"
            alt="Michael Jackson Silhouette"
            className="absolute left-0 top-0 size-full object-cover"
          />
          <div className="absolute bottom-10 left-1/2 z-10 max-w-xl -translate-x-1/2 rounded-lg bg-black/70 p-6 text-center text-white">
            <h3 className="mb-2 text-xl font-bold">MJ - HUB Inspired by the King of Pop</h3>
            <div className="flex flex-col gap-2">
              <span>Some Mini-Apps:</span>
              <span>Music Player,
              Color Pallete maker,
              Dice Roller,</span> 
              <span>Memory Matching Game
              Rock-Paper-Scissors</span>
              <span>and more — created for the OutlierAI Hackathon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
