import { useState } from 'react'
import './App.css'

function App() {
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', date: '', service: '' })
  const [reviews, setReviews] = useState([
    { id: 1, name: 'Sarah M.', text: 'Best massage experience in Thailand! Highly recommend.', rating: 5 },
    { id: 2, name: 'James K.', text: 'Professional therapists and beautiful ambiance. Will return!', rating: 5 },
  ])
  const [newReview, setNewReview] = useState({ name: '', text: '', rating: 5 })
  const [images, setImages] = useState([])

  const services = [
    { name: 'Thai Traditional Massage', price: '600฿', duration: '60 min' },
    { name: 'Oil Massage', price: '700฿', duration: '60 min' },
    { name: 'Hot Stone Therapy', price: '800฿', duration: '90 min' },
    { name: 'Herbal Compress Massage', price: '750฿', duration: '60 min' },
    { name: 'Foot Reflexology', price: '500฿', duration: '60 min' },
    { name: 'Couples Package', price: '1,400฿', duration: '60 min' },
  ]

  const handleBookingChange = (e) => {
    setBookingForm({ ...bookingForm, [e.target.name]: e.target.value })
  }

  const handleBooking = (e) => {
    e.preventDefault()
    alert(`Booking request submitted! We'll contact you at ${bookingForm.phone}`)
    setBookingForm({ name: '', email: '', phone: '', date: '', service: '' })
  }

  const handleReviewSubmit = (e) => {
    e.preventDefault()
    setReviews([...reviews, { id: reviews.length + 1, ...newReview }])
    setNewReview({ name: '', text: '', rating: 5 })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages([...images, event.target.result])
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="min-h-screen bg-dark-green text-white">
      {/* Navigation */}
      <nav className="bg-emerald border-b-2 border-gold sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gold">Thai Bliss Massage</h1>
          <ul className="flex gap-8">
            <li><a href="#services" className="text-light-gold hover:text-gold transition">Services</a></li>
            <li><a href="#gallery" className="text-light-gold hover:text-gold transition">Gallery</a></li>
            <li><a href="#booking" className="text-light-gold hover:text-gold transition">Book Now</a></li>
            <li><a href="#reviews" className="text-light-gold hover:text-gold transition">Reviews</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald to-dark-green py-20 text-center">
        <h2 className="text-6xl font-bold text-gold mb-4">Experience Luxury Thai Massage</h2>
        <p className="text-xl text-light-gold mb-8 max-w-2xl mx-auto">
          Discover authentic Thai massage therapy in a luxurious setting. Relax, rejuvenate, and restore your body and mind.
        </p>
        <a href="#booking" className="luxury-button">Book Your Session</a>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div key={idx} className="card hover:shadow-xl transition-shadow">
                <h3 className="text-2xl font-bold text-gold mb-3">{service.name}</h3>
                <p className="text-light-gold mb-2">Duration: {service.duration}</p>
                <p className="text-3xl font-bold text-gold">{service.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 px-6 bg-emerald">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Gallery</h2>

          {/* Image Upload Form */}
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <label className="card cursor-pointer hover:shadow-xl transition-shadow">
              <p className="text-light-gold text-lg mb-4">📸 Upload Photos</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className="text-sm text-light-gold opacity-75">Click to select up to 5 images</p>
            </label>
          </div>

          {/* Display Images */}
          {images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-light-gold text-xl">Upload your photos above...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="rounded-lg shadow-lg w-full h-64 object-cover" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="section-title">Book Your Appointment</h2>
          <form onSubmit={handleBooking} className="card space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={bookingForm.name}
              onChange={handleBookingChange}
              required
              className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={bookingForm.email}
              onChange={handleBookingChange}
              required
              className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white placeholder-gray-400"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone"
              value={bookingForm.phone}
              onChange={handleBookingChange}
              required
              className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white placeholder-gray-400"
            />
            <input
              type="date"
              name="date"
              value={bookingForm.date}
              onChange={handleBookingChange}
              required
              className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white"
            />
            <select
              name="service"
              value={bookingForm.service}
              onChange={handleBookingChange}
              required
              className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white"
            >
              <option value="">Select a Service</option>
              {services.map((service, idx) => (
                <option key={idx} value={service.name}>{service.name}</option>
              ))}
            </select>
            <button type="submit" className="luxury-button w-full">Confirm Booking</button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-light-gold mb-4">Or book directly:</p>
            <a href="tel:+66812345678" className="text-gold text-lg font-bold">📞 +66 (0) 812-345-678</a>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-6 bg-emerald">
        <div className="max-w-6xl mx-auto">
          <h2 className="section-title">Guest Reviews</h2>

          {/* Display Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {reviews.map((review) => (
              <div key={review.id} className="card">
                <p className="text-gold text-lg font-bold mb-2">★★★★★</p>
                <p className="text-light-gold mb-4">"{review.text}"</p>
                <p className="text-gold font-bold">— {review.name}</p>
              </div>
            ))}
          </div>

          {/* Add Review Form */}
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gold mb-6">Leave a Review</h3>
            <form onSubmit={handleReviewSubmit} className="card space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={newReview.name}
                onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                required
                className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white placeholder-gray-400"
              />
              <textarea
                placeholder="Your Review"
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                required
                rows="4"
                className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white placeholder-gray-400"
              />
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded bg-dark-green border border-gold text-white"
              >
                <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                <option value="3">⭐⭐⭐ 3 Stars</option>
              </select>
              <button type="submit" className="luxury-button w-full">Submit Review</button>
            </form>
          </div>

          {/* Google Reviews Link */}
          <div className="mt-12 text-center">
            <p className="text-light-gold mb-4">Leave a review on Google:</p>
            <a href="https://www.google.com" target="_blank" rel="noopener noreferrer" className="luxury-button inline-block">
              ⭐ Google Reviews
            </a>
          </div>
        </div>
      </section>

      {/* Social & Contact Footer */}
      <footer className="bg-emerald border-t-2 border-gold py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-gold font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="text-light-gold hover:text-gold transition">Facebook</a>
                <a href="#" className="text-light-gold hover:text-gold transition">Instagram</a>
                <a href="#" className="text-light-gold hover:text-gold transition">TikTok</a>
              </div>
            </div>
            <div>
              <h3 className="text-gold font-bold mb-4">Hours</h3>
              <p className="text-light-gold">Mon - Sun: 10:00 AM - 10:00 PM</p>
            </div>
            <div>
              <h3 className="text-gold font-bold mb-4">Location</h3>
              <p className="text-light-gold">Bangkok, Thailand</p>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gold border-opacity-30">
            <p className="text-light-gold">© 2025 Thai Bliss Massage. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
