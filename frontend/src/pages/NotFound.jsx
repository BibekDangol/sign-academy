import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import imgop from './img/imag109.png';
import './NotFound.css'; // Import CSS file for additional styles
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const vehicleRef = useRef(null);

  useEffect(() => {
    const vehicleAnimation = anime({
      targets: vehicleRef.current,
      translateX: '-100vw', // Move the vehicle from right to left
      duration: 10000, // Duration of the animation in milliseconds
      easing: 'linear', // Use linear easing for constant speed
      loop: true, // Loop the animation infinitely
    });

    return () => {
      vehicleAnimation.pause(); // Pause the animation when the component unmounts
    };
  }, []);

  return (
    <div className="relative h-[99.5vh] w-[99.9vw] overflow-hidden bg-[#f0f0f0]">
      <div className="road"></div> {/* Road animation */}
      <div className="clouds"></div> {/* Passing clouds animation */}
      <img
        ref={vehicleRef}
        src={imgop}
        alt="Vehicle"
        className="absolute top-[63%] right-0 -translate-y-1/2 h-[100px] w-[200px] md:h-[200px] md:w-[400px]"
      /> {/* Vehicle animation */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
        <h1 className="text-2xl md:text-[2rem]">404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
        <Button asChild className="bg-[#333] text-base text-white hover:bg-[#ffcc00] hover:text-black"><Link to="/">Go Home</Link></Button> {/* Switch button */}
      </div>
    </div>
  );
}

export default NotFound;
