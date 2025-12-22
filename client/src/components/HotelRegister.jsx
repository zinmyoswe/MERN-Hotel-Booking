import React, { useState } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { Loader } from 'lucide-react';

const HotelRegister = () => {
    const { setIsOwner, setShowHotelRegister } = useAppContext();
    const { getToken } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        description: '',
        videoUrl: '',
        mapUrl: '',
        hotelMainImage: null,
        hotelSubImages: null,
    });

    const countries = [
        "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
        "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
        "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia",
        "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
        "Cono (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
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

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData(prev => ({ ...prev, [name]: files }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const token = await getToken();
            const data = new FormData();
            for (const key in formData) {
                if (key === 'hotelSubImages' && formData[key]) {
                    Array.from(formData[key]).forEach(file => data.append(key, file));
                } else if (key === 'hotelMainImage' && formData[key]) {
                    data.append(key, formData[key][0]);
                }
                 else {
                    data.append(key, formData[key]);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/hotels`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: data
            });

            const responseText = await response.text();
            try {
                const result = JSON.parse(responseText);
                if (result.success) {
                    toast.success(result.message);
                    setIsOwner(true);
                    setShowHotelRegister(false);
                } else {
                    toast.error(result.message || 'An unknown error occurred.');
                }
            } catch (e) {
                console.error("Failed to parse JSON:", responseText);
                throw new Error("Received an invalid response from the server.");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div onClick={() => setShowHotelRegister(false)}
            className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70 overflow-auto py-10'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()}
                className='block bg-white rounded-xl max-w-2xl w-full max-md:mx-2'>
                <div className='relative flex flex-col p-8 md:p-10 w-full'>
                    <img src={assets.closeIcon} alt="close-icon" className='absolute top-4 right-4 h-4 w-4 cursor-pointer'
                        onClick={() => setShowHotelRegister(false)} />
                    <p className='text-2xl font-semibold mt-6 mb-4'>Register Your Hotel</p>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6'>
                        <div className='w-full mt-4'>
                            <label htmlFor='name' className='font-medium text-gray-500'>Hotel Name</label>
                            <input name="name" onChange={handleInputChange} value={formData.name} type='text' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label htmlFor='contact' className='font-medium text-gray-500'>Phone</label>
                            <input name="contact" onChange={handleInputChange} value={formData.contact} id='contact' type='text' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4 md:col-span-2'>
                            <label htmlFor='address' className='font-medium text-gray-500'>Address</label>
                            <input name="address" onChange={handleInputChange} value={formData.address} id='address' type='text' placeholder='Type here' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label htmlFor="city" className='font-medium text-gray-500'>City</label>
                            <input name="city" onChange={handleInputChange} value={formData.city} id="city" type='text' placeholder='Enter city' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>State</label>
                            <input name="state" onChange={handleInputChange} value={formData.state} type='text' placeholder='Enter state' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Country</label>
                            <select name="country" onChange={handleInputChange} value={formData.country} className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required>
                                <option value="">Select Country</option>
                                {countries.map((country) => (<option key={country} value={country}>{country}</option>))}
                            </select>
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Zipcode</label>
                            <input name="zipcode" onChange={handleInputChange} value={formData.zipcode} type='text' placeholder='Enter zipcode' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Video URL</label>
                            <input name="videoUrl" onChange={handleInputChange} value={formData.videoUrl} type='text' placeholder='https://youtube.com/...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Map URL</label>
                            <input name="mapUrl" onChange={handleInputChange} value={formData.mapUrl} type='text' placeholder='https://google.com/maps/...' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Main Image</label>
                            <input name="hotelMainImage" onChange={handleInputChange} type='file' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4'>
                            <label className='font-medium text-gray-500'>Sub Images</label>
                            <input name="hotelSubImages" onChange={handleInputChange} type='file' multiple className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' required />
                        </div>
                        <div className='w-full mt-4 md:col-span-2'>
                            <label className='font-medium text-gray-500'>Description</label>
                            <textarea name="description" onChange={handleInputChange} value={formData.description} placeholder='Enter description' className='border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light' rows={4} required />
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={isLoading}
                        className='bg-primary hover:bg-indigo-500 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6 flex items-center justify-center disabled:bg-gray-400'>
                        {isLoading ? (
                            <>
                                <Loader className="animate-spin mr-2" size={20} />
                                Registering...
                            </>
                        ) : (
                            'Register'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default HotelRegister;