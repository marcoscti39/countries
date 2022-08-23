import { GoSearch } from 'react-icons/go';
import {BiBrightnessHalf} from 'react-icons/bi'
import { useState, useEffect } from 'react';
import {IoIosArrowDown as ArrowDown} from 'react-icons/io'
import {IoIosArrowUp as ArrowUp} from 'react-icons/io'
import Link from 'next/link'


export async function getStaticProps(){
  const response = await fetch("https://restcountries.com/v3.1/all")
  const data = await response.json()
  data.sort(sortByName)

  return {
    props:{
      data
    }

  }
}

const sortByName = (a,b) =>{
  if(a.name.common < b.name.common){
    return -1
  }
  if(a.name.common < b.name.common){
    return 1
  }

  return 0
}


const sortByNameBackWards = (a,b) =>{
  if(a.name.common > b.name.common){
    return -1
  }
  if(a.name.common < b.name.common){
    return 1
  }

  return 0
}




export default function Home({data}) {

  const [countries, setCountries] = useState([...data])
  const [inputName, setInputName] = useState('')
  const getHtml = () => document.querySelector('html')
  const [handlePopulationArrow, setHandlePopulationArrow] = useState(false)
  const [handleAreaArrow, setHandleAreaArrow] = useState(false)
  const [handleNameArrow, setHandleNameArrow] = useState(false)
  const formatNumber = (number) => {
    const formatter = new Intl.NumberFormat('de-DE')
    return formatter.format(number)
  }

  const switchColorTheme = () =>{
    const $html = getHtml()
    $html.classList.toggle('dark')
  }

  const sortByMostPopulated = () =>{
    const sortedCountries = [...countries].sort((a,b) => b.population - a.population)
    setCountries([...sortedCountries])

  }
  const sortByLessPopulated = () =>{
    const sortedCountries = [...countries].sort((a,b) => a.population - b.population)
    setCountries([...sortedCountries])

  }

  const sortByMostArea = () =>{
    setCountries([...countries].sort((a,b) => b.area - a.area))

  }
  

  const sortByLessArea = () =>{
    setCountries([...countries].sort((a,b) => a.area - b.area))
  }

  const sortByAlphabet = () =>{
    setCountries([...data])
  }

  const sortBybackWardsAlphabet = () =>{
    const sortedCountries = [...countries].sort(sortByNameBackWards)
    setCountries([...sortedCountries])
  }

  const handleSortByArea = () =>{
    setHandlePopulationArrow(false)
    setHandleNameArrow(false)
    if(countries[0].area == 17098242){
      sortByLessArea()
      setHandleAreaArrow(ArrowUp)
      setHandlePopulationArrow(false)
      return
    }
    sortByMostArea()
    setHandleAreaArrow(ArrowDown)
  }

  const handleSortByPopulation = ()=>{
    setHandleAreaArrow(false)
    setHandleNameArrow(false)
    if(countries[0].name.common === "China"){
      sortByLessPopulated()
      setHandlePopulationArrow(ArrowUp)
      return
    }
    sortByMostPopulated()
    setHandlePopulationArrow(ArrowDown)
  }

  const handleSortByName = () =>{
    setHandleAreaArrow(false)
    setHandlePopulationArrow(false)
    if(countries[0].name.common === data[0].name.common){
      sortBybackWardsAlphabet()
      setHandleNameArrow(ArrowUp)
      return
    }

    sortByAlphabet()
    setHandleNameArrow(ArrowDown)
  }
  

  useEffect(() =>{
    const filteredContries = [...data].filter(country => {
      if(country.name.common.toUpperCase().includes(inputName.toUpperCase()) ||
       country.continents[0].toUpperCase().includes(inputName.toUpperCase())){
        return country
      }
    })
    if(inputName.length < 1){
      setCountries([...data])
      return
    }
    setCountries(filteredContries)
  },[inputName])

  return (
    <main className=" 
    w-full
    max-w-6xl
    flex flex-col">
      <button className='self-center my-2 icon-size' onClick={switchColorTheme}>
        <BiBrightnessHalf />
      </button>
      <div className="flex px-2">

        <span className="basis-2/5 dark:text-neutral-400">found {data.length} countries</span>
        <form className="flex flex-1 relative dark:bg-neutral-700 ">
          <div className='bg-white grid place-items-center px-4 dark:bg-neutral-700'>
            <GoSearch/>

          </div>
          <input className="
          text-lg
          dark:bg-neutral-700
          dark:text-white
          p-1
          w-full
          " 
          value={inputName}
          onInput={(e) => setInputName(e.target.value)}
          type="text"
          placeholder='search...'/>
          

        </form>

      </div>

      <table className="w-full mt-4">

        <thead>
          <tr className="bg-gray-200 dark:bg-neutral-800 dark:text-white">
            <th onClick={handleSortByName}>country {handleNameArrow}</th>
            <th onClick={handleSortByPopulation}>population {handlePopulationArrow}</th>
            <th onClick={handleSortByArea}>area(km²) {handleAreaArrow}</th>
            <th>gini</th>
          </tr>
        </thead>
        <tbody className='flex gap-2 flex-col'>
          {countries?.map(({flags: {svg}, name: {common}, population, area, gini}, index) =>{
            const giniValue = gini && `${gini[Object.keys(gini)[0]]}% ` || '--'
            return (
              <tr key={index}>
                <td>
                  <img src={svg}
                      className='object-cover aspect-video w-20 mr-2'/>
                  <div className='flex-1'>
                    <Link href={`/country/${common}`}>
                      
                      <p className='cursor-pointer inline'>{common}</p>
                    </Link>
                  </div>
                  
                </td>
                <td>
                  {formatNumber(population)}
                </td>
                <td>
                  {formatNumber(area)}
                </td>
                <td>{giniValue}</td>
              </tr>
            )

          })}
        </tbody>
        
        
      </table>
      
    </main>
    
  )
}
