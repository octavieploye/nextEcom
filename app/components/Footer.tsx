'use client'
import React from 'react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function Footer() {

// i want to create a function that will check if the user has scrolled to the bottom of the page
// if the user has scrolled to the bottom of the page, the footer will show
// if the user has not scrolled to the bottom of the page, the footer will not show


  return (
    <footer  
    className='bg-base-300 lg:fixed md:relative sm:relative bottom-0 w-full text-info-focus py-4 '>
      <div className="container mx-auto flex flex-wrap justify-between">
        <div className="w-full sm:w-1/3">
          <h3 className="font-bold text-lg mb-2">Follow us</h3>
          <div className="flex">
            <a href="#" className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="currentColor"
              >
                <path d="M12 0a12 12 0 0 0-3.807 23.272v-6.707h-2.83v-2.829h2.83v-1.815c0-2.785 1.693-4.303 4.183-4.303a17.315 17.315 0 0 1 2.042.104v2.893l-1.398.001c-1.1 0-1.315.524-1.315 1.29v1.693h2.63l-.344 2.83h-2.285v6.707a12.007 12.007 0 0 0 6.686-11.01c0-6.378-4.603-11.642-10.677-12.807l-.908-.147z" />
              </svg>
            </a>
            <a href="#" className="mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2a9.955 9.955 0 0 0-3.258.544 1.006 1.006 0 0 0-.54.54 9.946 9.946 0 0 0-.545 3.259 10.016 10.016 0 0 0 10.016 10.016 9.946 9.946 0 0 0 3.259-.544 1.006 1.006 0 0 0 .54-.54 10.016 10.016 0 0 0 .545-3.259 9.955 9.955 0 0 0-.544-3.258 1.006 1.006 0 0 0-.54-.54 9.946 9.946 0 0 0-3.259-.545 10.016 10.016 0 0 0-10.016 10.016 9.946 9.946 0 0 0 .544 3.259 1.006 1.006 0 0 0 .54.54 10.016 10.016 0 0 0 3.259.545 9.955 9.955 0 0 0 3.258-.544 1.006 1.006 0 0 0 .54-.54 9.946 9.946 0 0 0  2.12-.545 3.259a9.955 9.955 0 0 0 .544-3.258 1.006 1.006 0 0 0-.54-.54 9.946 9.946 0 0 0-3.259-.545 10.016 10.016 0 0 0-6.019 0zM18.897 8.361c-.151 0-.302.044-.433.134-.371.251-.444.754-.193 1.125l.001.001 1.3 1.915a.777.777 0 0 1-.187 1.081.773.773 0 0 1-1.076-.187l-.001-.001-.965-1.423v3.198a.775.775 0 0 1-.775.775H7.61a.775.775 0 0 1-.775-.775V9.997l-1.07 1.58a.772.772 0 0 1-1.077.187.777.777 0 0 1-.186-1.08l1.3-1.915c.25-.371.177-.874-.193-1.125a.772.772 0 0 1-.347-.656c0-.36.247-.67.596-.758 1.796-.485 3.787-.53 5.776-.136a.778.778 0 0 1 .671.758v.68c0 .426.348.774.774.774s.774-.348.774-.774v-.68a.778.778 0 0 1 .671-.758c1.99-.394 3.98-.348 5.776.136.349.089.596.398.596.758a.772.772 0 0 1-.347.656.775.775 0 0 1-.344.134z" />
          </svg>
          </a>
      </div>
    </div>
    <div className="w-full sm:w-1/3">
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