import React from "react"
import { graphql, useStaticQuery } from "gatsby";
import '../styles/tailwind.css'

import {Header} from '../components'

export default function Home() {

  const data = useStaticQuery(graphql`
    query{
      site{
        siteMetadata{
          title
          author
        }
      }
    }`
  )

  return (
    <div>
      <Header />
      <div className="bg-gray-50">
  <div className="max-w-screen-xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
    <h2 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
    {data.site.siteMetadata.title}
      <br></br>
      <span className="text-indigo-600">{data.site.siteMetadata.author}</span>
    </h2>
    <div className="mt-8 flex lg:flex-shrink-0 lg:mt-0">
      <div className="inline-flex rounded-md shadow">
        <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
          Get started
        </a>
      </div>
      <div className="ml-3 inline-flex rounded-md shadow">
        <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out">
          Learn more
        </a>
      </div>
    </div>
  </div>
</div>
      <div className="flex justify-center items-center h-screen">
  <div className="card transition duration-300 ease-in-out hover:shadow-sm flex flex-col border m-5 rounded">
    <h1 className="font-mono font-bold text-purple-900 text-lg leading-tight border-b p-3 px-5 my-0">Tailwind CSS Button</h1>
    <div className="card-body p-4">
		<div className="btn-group">
		  <button type="button" className="btn-primary transition duration-300 ease-in-out focus:outline-none focus:shadow-outline bg-purple-700 hover:bg-purple-900 text-white font-normal py-2 px-4 mr-1 rounded">Button</button>
		  <button type="button" className="btn-outline-primary transition duration-300 ease-in-out focus:outline-none focus:shadow-outline border border-purple-700 hover:bg-purple-700 text-purple-700 hover:text-white font-normal py-2 px-4 rounded">Button Outline</button>
		</div>
	</div>
  </div>
</div>
    </div>
    
  );
  }
