import React, {useEffect, useState} from 'react'
import {BiBrightnessHalf} from 'react-icons/bi'


export async function getStaticPaths(){
  const response = await fetch("https://restcountries.com/v3.1/all")
  const data = await response.json()

  const paths = data.map(item => {
    return {
      params: {name: item.name.common} 
    }
  })

  return {paths, fallback: false}
}

export async function getStaticProps({params}){
  const response = await fetch(`https://restcountries.com/v3.1/name/${params.name}`)
  const data = await response.json()
  return {
    props:{
      data
    }
  }
}

export default function Country({data: [country]}) {
  const [neighbourCountries, setNeighbourCountries] = useState([])
  const getHtml = () => document.querySelector('html')

  const giniValue = country.gini ? `${country.gini[Object.keys(country.gini)[0]]}% `: '--'
  const currencyValue = country.currencies[Object.keys(country.currencies)[0]].name

  const switchColorTheme = () =>{
    const $html = getHtml()
    $html.classList.toggle('dark')
  }
  

  useEffect(() =>{
  
    const borderCountries = country.borders
    const url = (country) => `https://restcountries.com/v3.1/alpha/${country}`
    console.log(borderCountries)

    if(borderCountries){

      const getCountryBorder = async (country) =>{
        const response = await fetch(country)
        return await response.json()
        
      }

      async function fetchBorderCountries(){
        const response = await Promise.all(borderCountries.map(country => getCountryBorder(url(country))))
        setNeighbourCountries(response.map( ([country]) => {
          return {name: country.name.common, image: country.flags.svg}
  
        }))
       
      }

      fetchBorderCountries()
    }

    
  },[])
  


  return (
    <>
      <button className='self-center my-2 icon-size' onClick={switchColorTheme} >
        <BiBrightnessHalf />
      </button>
      <main className='grid grid-cols-1 px-4 md:grid-cols-[1fr_2fr] gap-4  max-w-[1000px] w-full mb-4'>
      
        <section className='bg-white dark:bg-black h-fit w-full grid rounded-md shadow-md'>
          <img src={country?.flags?.svg} alt="" />

          <h1 className='
            font-bold text-4xl text-center mt-2
           dark:text-white px-1'>
            {country?.name?.common} 
          </h1>

          {country.continents.map(continent => {
            return (
              <span className='
              text-center mx-auto block 
              capitalize dark:text-white'>
                {continent}
              </span>
              )
            
            })}
          <div className='grid grid-cols-2 mt-auto dark:text-white'>
            <div className='flex flex-col items-center py-4'>
              <span className=''>{country?.population}</span> 
              <span className='
              capitalize text-neutral-500 dark:text-neutral-400
              font-semibold'>
                population
              </span>
            </div>
            <div className='flex flex-col items-center py-4'>
              <span>{country?.area}</span>
              <span className='
              capitalize text-neutral-500 dark:text-neutral-400
              font-semibold'>
                area
              </span>
            </div>
          </div>
        </section>

        <section className='
        bg-white h-full w-full flex flex-col
        dark:bg-black dark:text-white rounded-md shadow-md'> 

          <h2 className='font-semibold p-4 capitalize'>details</h2>
          <article>
            <div className='
                flex justify-between p-4 border-b-2 border-solid
                 border-neutral-400 dark:border-neutral-500 capitalize font-semibold'>
              <span className='font-semibold text-neutral-500 dark:text-neutral-400'>Capital</span>
              <div className="text-end">
                <span>
                  {country.capital.map(capital => capital).join(', ')}
                </span>

              </div>
            </div>
            
            <div className='
                flex justify-between p-4 border-b-2 border-solid
                 border-neutral-400 dark:border-neutral-500 capitalize font-semibold'>
              <span className='text-neutral-500 dark:text-neutral-400'>Languages</span>
              <div className="text-end">
                {Object.entries(country.languages).map(([,language]) => {
                  return language }).join(', ')}

              </div>
            </div>

            <div className='
                flex justify-between p-4 border-b-2 border-solid
                 border-neutral-400 dark:border-neutral-500 capitalize font-semibold'>
              <span className='text-neutral-500 dark:text-neutral-400'>currencies</span>
          
              
              <span className='dark:text-white dark:border-white'>{currencyValue}</span>
            
            </div>

            <div className='
                flex justify-between p-4 border-b-2 border-solid
                 border-neutral-400 dark:border-neutral-500 capitalize font-semibold'>
              <span className='text-neutral-500 dark:text-neutral-400'>Native Name</span>
              <span>{country?.name.official}</span>
            </div>

            <div className='
                flex justify-between p-4 border-b-2 border-solid
                 border-neutral-400 dark:border-neutral-500 capitalize font-semibold'>
              <span className='text-neutral-500 dark:text-neutral-400'>gini</span>
              <span>{giniValue}</span>
            </div>
          </article>

          <article className='px-4'>
            <h2 className='
            text-neutral-500 dark:text-neutral-400 font-semibold
              capitalize p-4 flex justify-between'>
              neigbouring countries

              {neighbourCountries.length === 0 && (
                
                <span className='text-end text-black dark:text-white'>none</span>
              )}
            </h2>
            <div className='flex flex-wrap gap-4 font-semibold'>
              {neighbourCountries.map((country, index) =>{
                return (
                  <div key={index} className='flex flex-col'>
                    <img src={country.image} className='w-40 aspect-video' />
                    <span className='text-center '>{country.name}</span>
                  </div>
                )
              })}
                          
            </div>
          </article>


        </section>
      </main> 
    </>
  )
}
