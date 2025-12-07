import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';

const HotelRegister = () => {

   const { getToken, setIsOwner, setShowHotelRegister, axios } = useAppContext();

   const [name, setName] = useState('');
   const [address, setAddress] = useState('');
   const [contact, setContact] = useState('');
   const [city, setCity] = useState('');
   const [state, setState] = useState('');
   const [country, setCountry] = useState('');
   const [zipcode, setZipcode] = useState('');
   const [description, setDescription] = useState('');

   const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
    "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
    "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
    "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
    "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
    "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea",
    "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
    "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
    "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (Burma)", "Namibia", "Nauru", "Nepal",
    "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain",
    "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand",
    "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda",
    "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
  ];


   const onSubmitHandler = async (event) => {
       try {
           event.preventDefault();
           const {data} = await axios.post('/api/hotels', {
               name,
               contact,
               city,
               address,
               state,
               country,
               zipcode,
               description
           }, {
               headers: {
                   Authorization: `Bearer ${await getToken()}`}})
               if(data.success){
                   toast.success(data.message)
                   setIsOwner(true);
                   setShowHotelRegister(false);
               }else{
                   toast.error(data.message)
               }


       } catch (error) {
           toast.error(error.message)
       }
   }

  return (
    <div
    onClick={() => setShowHotelRegister(false)}
    className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70'>
        <form
        onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}

        className='block bg-white rounded-xl max-w-2xl w-full max-md:mx-2'>

            {/* Removed the image tag here: <img src={assets.regImage} alt="reg-image" className='w-1/2 rounded-xl hidden md:block'/> */}

            {/* The main content div now takes full width (w-full) */}
            <div className='relative flex flex-col p-8 md:p-10 w-full'>
                <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4
                h-4 w-4 cursor-pointer'
                onClick={() => setShowHotelRegister(false)}
                />
                <p className='text-2xl font-semibold mt-6 mb-4'>Register Your Hotel</p>

                {/* Form Fields Container - This is where we create the two-column layout */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>

                    {/* Hotel Name (Column 1 / cols-6 equivalent) */}
                    <div className='w-full mt-4'>
                        <label htmlFor='name' className='font-medium text-gray-500'>
                            Hotel Name
                        </label>
                        <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type='text' placeholder='Type here' className='border border-gray-200 rounded w-full
                        px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* Phone (Column 2 / cols-6 equivalent) */}
                   <div className='w-full mt-4'>
                        <label htmlFor='contact' className='font-medium text-gray-500'>
                            Phone
                        </label>
                        <input
                        onChange={(e) => setContact(e.target.value)}
                        value={contact}
                        id='contact' type='text' placeholder='Type here' className='border border-gray-200 rounded w-full
                        px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* Address (Full Width/cols-12 equivalent) */}
                    <div className='w-full mt-4 md:col-span-2'>
                        <label htmlFor='address' className='font-medium text-gray-500'>
                            Address
                        </label>
                        <input
                        onChange={(e) => setAddress(e.target.value)}
                        value={address}
                        id='address' type='text' placeholder='Type here' className='border border-gray-200 rounded w-full
                        px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>


                    {/* City (Column 1 / cols-6 equivalent) */}
                    <div className='w-full mt-4'>
                        <label htmlFor="city" className='font-medium text-gray-500'>City</label>

                        <input
                        onChange={(e) => setCity(e.target.value)}
                        value={city}
                        id="city" type='text' placeholder='Enter city' className='border border-gray-200 rounded w-full
                        px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                    </div>

                    {/* State (Column 2 / cols-6 equivalent) */}
                    <div className='w-full mt-4'>
                        <label className='font-medium text-gray-500'>State</label>
                        <input
                            onChange={(e) => setState(e.target.value)}
                            value={state}
                            type='text'
                            placeholder='Enter state'
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
                            required
                        />
                    </div>

                    {/* Country (Column 1 / cols-6 equivalent) */}
                    <div className='w-full mt-4'>
                        <label className='font-medium text-gray-500'>Country</label>
                        <select
                            onChange={(e) => setCountry(e.target.value)}
                            value={country}
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
                            required
                        >
                            <option value="">Select Country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                        </select>
                    </div>

                    {/* Zipcode (Column 2 / cols-6 equivalent) */}
                    <div className='w-full mt-4'>
                        <label className='font-medium text-gray-500'>Zipcode</label>
                        <input
                            onChange={(e) => setZipcode(e.target.value)}
                            value={zipcode}
                            type='text'
                            placeholder='Enter zipcode'
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
                            required
                        />
                    </div>

                    {/* Description (Full Width/cols-12 equivalent) */}
                    <div className='w-full mt-4 md:col-span-2'>
                        <label className='font-medium text-gray-500'>Description</label>
                        <textarea
                            onChange={(e) => setDescription(e.target.value)}
                            value={description}
                            placeholder='Enter description'
                            className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light'
                            rows={4}
                            required
                        />
                    </div>
                </div> {/* End of grid container */}

                <button className='bg-primary hover:bg-indigo-500 transition-all text-white
                mr-auto px-6 py-2 rounded cursor-pointer mt-6'>
                    Register
                </button>
            </div>
        </form>
    </div>
  )
}

export default HotelRegister