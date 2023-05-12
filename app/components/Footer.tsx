'use client'

// * THIS IS THE FOOTER COMPONENT
import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BsFacebook, BsTwitter, BsInstagram } from 'react-icons/bs';

export default function Footer() {

// i want to create a function that will check if the user has scrolled to the bottom of the page
// if the user has scrolled to the bottom of the page, the footer will show
// if the user has not scrolled to the bottom of the page, the footer will not show


  return (

    <footer  
    className='bg-neutral lg:fixed md:relative sm:relative bottom-0 w-full text-info-focus py-4 '>
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full sm:w-1/3">
          {/* SOCIAL MEDIA */}
          <h3 className="font-bold text-lg mb-2">Follow us</h3>
          <div className="flex flex-row py-2 space-x-2">
            <BsFacebook width={100} height={100} className='w-5 h-5 ' />
            <BsInstagram width={100} height={100} className='w-5 h-5 '/>
            <BsTwitter width={100} height={100} className='w-5 h-5 '/>
      </div>
    </div>
    
        <div className=" w-full sm:w-1/3">
          <h3 className="font-bold text-lg mb-2">Contact Us</h3>
          <p>3 Rue des tournesols</p>
          <p>Superville, 45700 - France</p>
          <p>contact@monkeybloom.com</p>
        </div>

    <div className="w-full sm:w-1/3">
      <h3 className="font-bold text-lg mb-2">Newsletter</h3>
      <p>Subscribe to our newsletter and get updates once a month!</p>
      <form className="flex mt-4">
        <input
          type="email"
          placeholder="Your email address"
          className="bg-base-200 text-info border-2 border-gray-300 rounded-l px-2 py-1 flex-grow"
        />
        <button className="bg-primary-focus hover:bg-primary text-white rounded-r px-4 py-1">
          Subscribe
        </button>
      </form>
    </div>
  </div>
  <div className="container mx-auto mt-4 flex flex-wrap justify-between">
    <div className="w-full sm:w-1/2">
      <Link href="/privacy">
        <p className="text-gray-500 hover:text-gray-800">
          Privacy Policy
        </p>
      </Link>
    </div>
    <div className="w-full sm:w-1/2 text-right">
    <Link href="/terms">
<p className="text-gray-500 hover:text-gray-800">Terms and Conditions</p>
</Link>
</div>
</div>
</footer>
);
};