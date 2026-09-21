import { useMemo, useRef, useState } from 'react'
import './App.css'
import {
  categories,
  colleges,
  mainEvents,
  registrations,
  subEvents,
} from './data/mockData'

const studentPortal = {
  home: 'home',
  discover: 'discover',
  categories: 'categories',
  college: 'college',
  mainEvent: 'mainEvent',
  subEvent: 'subEvent',
  register: 'register',
  confirmation: 'confirmation',
  bookings: 'bookings',
}

const organiserPortal = {
  dashboard: 'dashboard',
  myEvents: 'myEvents',
  createEvent: 'createEvent',
  eventDetails: 'eventDetails',
  addSubEvent: 'addSubEvent',
  registrations: 'registrations',
  qr: 'qr',
}

const mockStudent = {
  name: 'Meera Iyer',
  college: 'SRM Institute of Science and Technology',
  dept: 'CSE',
  year: '3rd Year',
}

const organiserCollege = colleges.find((college) => college.id === 'srm') ?? colleges[0]

function App() {
  const carouselRef = useRef(null)
  const carouselDrag = useRef({ active: false, startX: 0, scrollLeft: 0 })
  const [authView, setAuthView] = useState('roleSelect')
  const [portal, setPortal] = useState(null)
  const [events, setEvents] = useState(mainEvents)
  const [subEventRecords, setSubEventRecords] = useState(subEvents)
  const [registrationRecords, setRegistrationRecords] = useState(() => registrations.map((registration) => ({
    ...registration,
    eventId: 'bugthon-2026',
  })))
  const [screen, setScreen] = useState(studentPortal.home)
  const [selectedCategory, setSelectedCategory] = useState('Hackathon')
  const [selectedCollegeId, setSelectedCollegeId] = useState('srm')
  const [selectedMainEventId, setSelectedMainEventId] = useState('technova-2026')
  const [selectedSubEventId, setSelectedSubEventId] = useState('bugthon-2026')
  const [discoverQuery, setDiscoverQuery] = useState('')
  const [discoverFilter, setDiscoverFilter] = useState('All')
  const [showDiscoverFilters, setShowDiscoverFilters] = useState(false)
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    banner: '',
  })
  const [newSubEvent, setNewSubEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    category: 'Technical',
    tags: '',
    banner: '',
  })
  const [registrationForm, setRegistrationForm] = useState({
    name: mockStudent.name,
    college: mockStudent.college,
    department: mockStudent.dept,
    year: mockStudent.year,
    email: 'meera.iyer@email.com',
  })
  const [router, setRouter] = useState({
    student: studentPortal.home,
    organiser: organiserPortal.dashboard,
  })

  const selectedMainEvent = useMemo(
    () => events.find((event) => event.id === selectedMainEventId) ?? events[0],
    [events, selectedMainEventId],
  )

  const selectedSubEvent = useMemo(
    () => subEventRecords.find((event) => event.id === selectedSubEventId) ?? subEventRecords[0],
    [selectedSubEventId, subEventRecords],
  )

  const categoryEvents = subEventRecords.filter((event) => event.category === selectedCategory)
  const collegeEvents = events.filter((event) => event.collegeId === selectedCollegeId)
  const organiserEvents = events.filter((event) => event.collegeId === organiserCollege.id)
  const organiserSubEvents = subEventRecords.filter((event) => organiserEvents.some((mainEvent) => mainEvent.id === event.mainEventId))
  const organiserRegistrations = registrationRecords.filter((registration) => organiserSubEvents.some((event) => event.id === registration.eventId))
  const myBookings = registrationRecords.filter((registration) => registration.name === registrationForm.name)
  const mainEventSubEvents = subEventRecords.filter((event) => event.mainEventId === selectedMainEventId)
  const discoverEvents = events.filter((event) => {
    const query = discoverQuery.trim().toLowerCase()
    const matchesQuery = !query || `${event.name} ${event.collegeName} ${event.venue}`.toLowerCase().includes(query)
    const matchesFilter = discoverFilter === 'All' || event.collegeId === selectedCollegeId
    return matchesQuery && matchesFilter
  })

  const goStudentScreen = (nextScreen) => {
    setPortal('student')
    setScreen(nextScreen)
    setRouter((prev) => ({ ...prev, student: nextScreen }))
  }

  const goOrganiserScreen = (nextScreen) => {
    setPortal('organiser')
    setScreen(nextScreen)
    setRouter((prev) => ({ ...prev, organiser: nextScreen }))
  }

  const handleStudentNav = (tab) => {
    if (tab === 'feed') goStudentScreen(studentPortal.home)
    if (tab === 'discover') goStudentScreen(studentPortal.discover)
    if (tab === 'bookings') goStudentScreen(studentPortal.bookings)
  }

  const startCarouselDrag = (event) => {
    if (!carouselRef.current) return
    carouselDrag.current = {
      active: true,
      startX: event.clientX,
      scrollLeft: carouselRef.current.scrollLeft,
    }
    carouselRef.current.classList.add('is-dragging')
  }

  const moveCarouselDrag = (event) => {
    if (!carouselDrag.current.active || !carouselRef.current) return
    const distance = event.clientX - carouselDrag.current.startX
    carouselRef.current.scrollLeft = carouselDrag.current.scrollLeft - distance
  }

  const stopCarouselDrag = () => {
    carouselDrag.current.active = false
    carouselRef.current?.classList.remove('is-dragging')
  }

  const scrollCarouselWithWheel = (event) => {
    if (!carouselRef.current || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return
    event.preventDefault()
    carouselRef.current.scrollLeft += event.deltaY
  }

  const loginAsStudent = () => {
    setPortal('student')
    setAuthView('authenticated')
    setScreen(router.student)
  }

  const loginAsOrganiser = () => {
    setPortal('organiser')
    setAuthView('authenticated')
    setScreen(router.organiser)
  }

  const logout = () => {
    setPortal(null)
    setAuthView('roleSelect')
    setScreen(studentPortal.home)
  }

  const updateNewEvent = (field, value) => {
    setNewEvent((current) => ({ ...current, [field]: value }))
  }

  const updateBanner = (field, file) => {
    if (!file) return
    const previewUrl = URL.createObjectURL(file)
    if (field === 'event') updateNewEvent('banner', previewUrl)
    if (field === 'subEvent') updateNewSubEvent('banner', previewUrl)
  }

  const updateNewSubEvent = (field, value) => {
    setNewSubEvent((current) => ({ ...current, [field]: value }))
  }

  const updateRegistrationForm = (field, value) => {
    setRegistrationForm((current) => ({ ...current, [field]: value }))
  }

  const createEvent = () => {
    const event = {
      id: `event-${Date.now()}`,
      name: newEvent.name.trim() || 'New College Event',
      collegeId: organiserCollege.id,
      collegeName: organiserCollege.name,
      description: newEvent.description.trim() || 'A new event listed by the organising college.',
      startDate: newEvent.startDate || 'Date to be announced',
      endDate: newEvent.endDate || newEvent.startDate || 'Date to be announced',
      venue: newEvent.venue.trim() || `${organiserCollege.name} Campus`,
      banner: newEvent.banner || mainEvents[0].banner,
    }
    setEvents((current) => [...current, event])
    setSelectedMainEventId(event.id)
    setNewEvent({ name: '', description: '', startDate: '', endDate: '', venue: '', banner: '' })
    goOrganiserScreen(organiserPortal.eventDetails)
  }

  const deleteEvent = (eventId) => {
    setEvents((current) => current.filter((event) => event.id !== eventId))
    setSubEventRecords((current) => current.filter((event) => event.mainEventId !== eventId))
    if (selectedMainEventId === eventId) {
      setSelectedMainEventId('')
      goOrganiserScreen(organiserPortal.myEvents)
    }
  }

  const createSubEvent = () => {
    const subEvent = {
      id: `sub-event-${Date.now()}`,
      title: newSubEvent.title.trim() || 'New Sub Event',
      mainEventId: selectedMainEventId,
      category: newSubEvent.category,
      tags: newSubEvent.tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      date: newSubEvent.date || 'Date to be announced',
      time: newSubEvent.time || 'Time to be announced',
      venue: newSubEvent.venue.trim() || selectedMainEvent?.venue || 'Venue to be announced',
      description: newSubEvent.description.trim() || 'A new event activity listed by the organising college.',
      banner: newSubEvent.banner || mainEvents[0].banner,
      seats: 100,
      fee: 'Free',
    }
    setSubEventRecords((current) => [...current, subEvent])
    setSelectedSubEventId(subEvent.id)
    setNewSubEvent({ title: '', description: '', date: '', time: '', venue: '', category: 'Technical', tags: '', banner: '' })
    goOrganiserScreen(organiserPortal.eventDetails)
  }

  const deleteSubEvent = (subEventId) => {
    setSubEventRecords((current) => current.filter((event) => event.id !== subEventId))
  }

  const registerStudent = () => {
    const registration = {
      id: `REG-${Date.now()}`,
      eventId: selectedSubEvent?.id,
      name: registrationForm.name.trim() || 'Student',
      college: registrationForm.college.trim() || 'College not provided',
      department: registrationForm.department.trim() || 'Department not provided',
      year: registrationForm.year.trim() || 'Year not provided',
      email: registrationForm.email.trim(),
      status: 'Pending',
      date: selectedSubEvent?.date ?? 'Date to be announced',
    }
    setRegistrationRecords((current) => [...current, registration])
    goStudentScreen(studentPortal.confirmation)
  }

  const renderAuth = () => {
    if (authView === 'roleSelect') {
      return (
        <div className="auth-shell">
          <div className="auth-brand-mark">EH</div>
          <p className="eyebrow">Welcome to EventHub</p>
          <h1>Where campus moments begin.</h1>
          <p className="auth-copy">Choose how you want to continue.</p>
          <div className="role-grid">
            <button className="role-card" onClick={() => setAuthView('studentLogin')}>
              <span className="role-icon">S</span>
              <strong>Student</strong>
              <small>Discover and book college events</small>
              <span className="role-arrow">→</span>
            </button>
            <button className="role-card organiser-role" onClick={() => setAuthView('organiserLogin')}>
              <span className="role-icon">O</span>
              <strong>College organiser</strong>
              <small>List and manage your college events</small>
              <span className="role-arrow">→</span>
            </button>
          </div>
        </div>
      )
    }

    const organiserLogin = authView === 'organiserLogin'
    return (
      <div className="auth-shell login-shell">
        <button className="back-btn auth-back" onClick={() => setAuthView('roleSelect')}>←</button>
        <div className="auth-brand-mark small-mark">{organiserLogin ? 'O' : 'S'}</div>
        <p className="eyebrow">{organiserLogin ? 'College organiser' : 'Student portal'}</p>
        <h1>{organiserLogin ? 'Manage your events.' : 'Welcome back!'}</h1>
        <p className="auth-copy">
          {organiserLogin
            ? `Sign in to manage events for ${organiserCollege.name}.`
            : 'Sign in to discover campus events and reserve your seat.'}
        </p>

        <div className="auth-form">
          <label>{organiserLogin ? 'College email' : 'Student email'}
            <input type="email" placeholder={organiserLogin ? 'organiser@college.edu' : 'you@college.edu'} />
          </label>
          <label>Password
            <input type="password" placeholder="Enter your password" />
          </label>
          <button className="primary-btn full" onClick={organiserLogin ? loginAsOrganiser : loginAsStudent}>
            {organiserLogin ? 'Continue' : 'Login'}
          </button>
        </div>

        <button className="auth-switch" onClick={() => setAuthView(organiserLogin ? 'studentLogin' : 'organiserLogin')}>
          Login as {organiserLogin ? 'student' : 'organiser'} instead
        </button>
      </div>
    )
  }

  const renderStudentHome = () => (
    <div className="screen app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Hi there!</p>
          <h2>EventHub</h2>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <button className="avatar-btn">MI</button>
        </div>
      </header>

      <section className="hero-panel">
        <span className="chip-tag">Featured</span>
        <h1>Experience college events together</h1>
        <button className="primary-btn" onClick={() => goStudentScreen(studentPortal.discover)}>
          Explore events
        </button>
      </section>

      <section className="section-block">
        <div className="heading-row">
          <h3>Featured Events</h3>
          <button className="link-btn" onClick={() => goStudentScreen(studentPortal.discover)}>See all</button>
        </div>
        <div
          ref={carouselRef}
          className="carousel"
          onWheel={scrollCarouselWithWheel}
          onMouseDown={startCarouselDrag}
          onMouseMove={moveCarouselDrag}
          onMouseUp={stopCarouselDrag}
          onMouseLeave={stopCarouselDrag}
        >
          {events.map((event) => (
            <button
              key={event.id}
              className="poster-card"
              onClick={() => {
                setSelectedMainEventId(event.id)
                goStudentScreen(studentPortal.mainEvent)
              }}
            >
              <img src={event.banner} alt={event.name} />
              <div className="poster-info">
                <span>{event.name}</span>
                <small>{event.startDate}</small>
              </div>
            </button>
          ))}
        </div>
        <div className="carousel-footer">
          <div className="carousel-dots" aria-label="Featured event slides">
            {events.map((event, index) => (
              <span key={event.id} className={`carousel-dot ${index === 0 ? 'active' : ''}`} />
            ))}
          </div>
          <span className="carousel-hint">Swipe to explore</span>
        </div>
      </section>

      <BottomNav active="feed" onChange={handleStudentNav} />
    </div>
  )

  const renderDiscover = () => (
    <div className="screen app-shell">
      <header className="discover-header">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.home)}>←</button>
        <div>
          <p className="eyebrow">Chennai</p>
          <h2>Discover</h2>
        </div>
        <button className="icon-btn" onClick={() => setShowDiscoverFilters((current) => !current)} aria-label="Open filters">☷</button>
      </header>

      <div className="discover-search">
        <span>⌕</span>
        <input value={discoverQuery} onChange={(event) => setDiscoverQuery(event.target.value)} placeholder="Search events, colleges..." />
        {discoverQuery && <button onClick={() => setDiscoverQuery('')} aria-label="Clear search">×</button>}
      </div>

      {showDiscoverFilters && (
        <aside className="filter-drawer">
          <div>
            <strong>Filter events</strong>
            <small>Refine your browse</small>
          </div>
          <div className="filter-drawer-actions">
            <button className={discoverFilter === 'All' ? 'active' : ''} onClick={() => setDiscoverFilter('All')}>All events</button>
            <button className={discoverFilter === 'College' ? 'active' : ''} onClick={() => setDiscoverFilter('College')}>My college</button>
          </div>
        </aside>
      )}

      <div className="browse-strip">
        <span>Popular near you</span>
        <button className="filter-btn active" onClick={() => setShowDiscoverFilters((current) => !current)}>Filters</button>
      </div>

      <section className="section-block">
        <div className="category-rail">
          {['All', ...categories.slice(0, 5)].map((category) => (
            <button
              key={category}
              className={`tag ${((category === 'All' && discoverFilter === 'All') || selectedCategory === category) ? 'active' : ''}`}
              onClick={() => {
                if (category === 'All') {
                  setDiscoverFilter('All')
                  return
                }
                setSelectedCategory(category)
                goStudentScreen(studentPortal.categories)
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="heading-row">
          <h3>{discoverQuery ? 'Search results' : 'Featured events'}</h3>
          <button className="link-btn" onClick={() => setDiscoverQuery('')}>See all</button>
        </div>
        <div className="discover-event-rail">
          {discoverEvents.map((event) => (
            <button
              key={event.id}
              className="discover-event-card"
              onClick={() => {
                setSelectedMainEventId(event.id)
                goStudentScreen(studentPortal.mainEvent)
              }}
            >
              <img src={event.banner} alt={event.name} />
              <div>
                <strong>{event.name}</strong>
                <small>{event.startDate} · {event.collegeName}</small>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="section-block college-strip-section">
        <div className="heading-row">
          <h3>Browse colleges</h3>
          <span>{colleges.length} places</span>
        </div>
        <div className="college-rail">
          {colleges.slice(0, 4).map((college) => (
            <button key={college.id} className="college-pill" onClick={() => {
              setSelectedCollegeId(college.id)
              goStudentScreen(studentPortal.college)
            }}>
              <span>{college.name.charAt(0)}</span>
              <strong>{college.name}</strong>
            </button>
          ))}
        </div>
      </section>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderCategory = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.discover)}>←</button>
        <div>
          <p className="eyebrow">Category</p>
          <h2>{selectedCategory}</h2>
        </div>
      </header>

      <div className="list-stack">
        {categoryEvents.map((event) => (
          <button
            key={event.id}
            className="event-item"
            onClick={() => {
              setSelectedSubEventId(event.id)
              goStudentScreen(studentPortal.subEvent)
            }}
          >
            <img src={event.banner} alt={event.title} />
            <div className="event-item-copy">
              <span className="chip-tag light">{event.category}</span>
              <strong>{event.title}</strong>
              <small>{event.date} • {event.venue}</small>
            </div>
          </button>
        ))}
      </div>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderCollege = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.discover)}>←</button>
        <div>
          <p className="eyebrow">College</p>
          <h2>{colleges.find((c) => c.id === selectedCollegeId)?.name}</h2>
        </div>
      </header>

      <div className="list-stack">
        {collegeEvents.map((event) => (
          <button
            key={event.id}
            className="event-item"
            onClick={() => {
              setSelectedMainEventId(event.id)
              goStudentScreen(studentPortal.mainEvent)
            }}
          >
            <img src={event.banner} alt={event.name} />
            <div className="event-item-copy">
              <span className="chip-tag light">Main Event</span>
              <strong>{event.name}</strong>
              <small>{event.startDate} • {event.venue}</small>
            </div>
          </button>
        ))}
      </div>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderMainEvent = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.home)}>←</button>
        <div>
          <p className="eyebrow">Main Event</p>
          <h2>{selectedMainEvent.name}</h2>
        </div>
      </header>

      <div className="cover-image">
        <img src={selectedMainEvent.banner} alt={selectedMainEvent.name} />
      </div>

      <div className="detail-box">
        <div className="detail-line">
          <span>College</span>
          <strong>{selectedMainEvent.collegeName}</strong>
        </div>
        <div className="detail-line">
          <span>Dates</span>
          <strong>{selectedMainEvent.startDate} - {selectedMainEvent.endDate}</strong>
        </div>
        <div className="detail-line">
          <span>Venue</span>
          <strong>{selectedMainEvent.venue}</strong>
        </div>
        <p>{selectedMainEvent.description}</p>
      </div>

      <div className="section-block compact">
        <div className="heading-row">
          <h3>Sub Events</h3>
          <span>{mainEventSubEvents.length} listed</span>
        </div>

        <div className="list-stack">
          {mainEventSubEvents.map((event) => (
            <button
              key={event.id}
              className="small-list-item"
              onClick={() => {
                setSelectedSubEventId(event.id)
                goStudentScreen(studentPortal.subEvent)
              }}
            >
              <img src={event.banner} alt={event.title} />
              <div>
                <strong>{event.title}</strong>
                <small>{event.date}</small>
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderSubEvent = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.mainEvent)}>←</button>
        <div>
          <p className="eyebrow">Sub Event</p>
          <h2>{selectedSubEvent.title}</h2>
        </div>
      </header>

      <div className="cover-image tall">
        <img src={selectedSubEvent.banner} alt={selectedSubEvent.title} />
      </div>

      <div className="detail-box">
        <div className="tags-wrap">
          <span className="chip-tag">{selectedSubEvent.category}</span>
          {selectedSubEvent.tags.map((tag) => (
            <span key={tag} className="mini-tag">{tag}</span>
          ))}
        </div>

        <div className="detail-line">
          <span>Date</span>
          <strong>{selectedSubEvent.date}</strong>
        </div>
        <div className="detail-line">
          <span>Time</span>
          <strong>{selectedSubEvent.time}</strong>
        </div>
        <div className="detail-line">
          <span>Venue</span>
          <strong>{selectedSubEvent.venue}</strong>
        </div>
        <p>{selectedSubEvent.description}</p>
      </div>

      <div className="cta-row">
        <div>
          <small>{selectedSubEvent.seats} seats left</small>
          <strong>{selectedSubEvent.fee}</strong>
        </div>
        <button className="primary-btn" onClick={() => goStudentScreen(studentPortal.register)}>Book Tickets</button>
      </div>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderRegister = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goStudentScreen(studentPortal.subEvent)}>←</button>
        <div>
          <p className="eyebrow">Select Tickets</p>
          <h2>{selectedSubEvent.title}</h2>
        </div>
      </header>

      <div className="ticket-card">
        <div className="registration-heading">
          <h3>Student details</h3>
          <small>Needed for your registration</small>
        </div>
        <label className="inline-form-label">Full name<input value={registrationForm.name} onChange={(event) => updateRegistrationForm('name', event.target.value)} /></label>
        <label className="inline-form-label">College<input value={registrationForm.college} onChange={(event) => updateRegistrationForm('college', event.target.value)} /></label>
        <div className="form-grid">
          <label className="inline-form-label">Department<input value={registrationForm.department} onChange={(event) => updateRegistrationForm('department', event.target.value)} /></label>
          <label className="inline-form-label">Year<input value={registrationForm.year} onChange={(event) => updateRegistrationForm('year', event.target.value)} /></label>
        </div>
        <label className="inline-form-label">Email<input type="email" value={registrationForm.email} onChange={(event) => updateRegistrationForm('email', event.target.value)} /></label>
        <div className="ticket-row">
          <div>
            <strong>Regular</strong>
            <span>₹999</span>
          </div>
          <div className="counter-box">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>
        </div>
        <div className="ticket-row">
          <div>
            <strong>Premium</strong>
            <span>₹1,499</span>
          </div>
          <div className="counter-box">
            <button>-</button>
            <span>0</span>
            <button>+</button>
          </div>
        </div>
        <div className="order-sum">
          <span>Total Amount</span>
          <strong>₹1,098</strong>
        </div>
      </div>

      <button className="primary-btn full" onClick={registerStudent}>
        Continue to Payment
      </button>

      <BottomNav active="discover" onChange={handleStudentNav} />
    </div>
  )

  const renderConfirmation = () => (
    <div className="screen app-shell center-shell">
      <div className="confirmation-box">
        <div className="success-badge">✓</div>
        <p className="eyebrow success-text">Booking Confirmed!</p>
        <h2>{selectedSubEvent.title}</h2>
        <div className="qr-wrap">
          <div className="qr-code" />
        </div>
        <div className="info-line">
          <span>Name</span>
          <strong>{registrationForm.name}</strong>
        </div>
        <div className="info-line">
          <span>College</span>
          <strong>{registrationForm.college}</strong>
        </div>
        <div className="info-line">
          <span>Department / Year</span>
          <strong>{registrationForm.department} · {registrationForm.year}</strong>
        </div>
        <div className="info-line">
          <span>Ticket Type</span>
          <strong>Regular</strong>
        </div>
        <div className="info-line">
          <span>Quantity</span>
          <strong>1</strong>
        </div>
        <div className="confirm-actions">
          <button className="secondary-btn" onClick={() => goStudentScreen(studentPortal.home)}>Home</button>
          <button className="primary-btn" onClick={() => goStudentScreen(studentPortal.discover)}>Explore</button>
        </div>
      </div>
    </div>
  )

  const renderBookings = () => (
    <div className="screen app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Student</p>
          <h2>My bookings</h2>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <button className="avatar-btn">MI</button>
        </div>
      </header>

      <div className="booking-list">
        {myBookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◇</div>
            <h3>No bookings yet</h3>
            <p>Book a campus event and it will appear here.</p>
            <button className="primary-btn" onClick={() => goStudentScreen(studentPortal.discover)}>Explore events</button>
          </div>
        ) : (
          myBookings.map((booking) => {
            const event = subEventRecords.find((subEvent) => subEvent.id === booking.eventId)
            const mainEvent = events.find((main) => main.id === event?.mainEventId)

            return (
              <article className="booking-card" key={booking.id}>
                <div className="booking-card-top">
                  <div>
                    <p className="eyebrow">{mainEvent?.name ?? 'EventHub booking'}</p>
                    <h3>{event?.title ?? 'Event booking'}</h3>
                  </div>
                  <span className={`booking-status ${booking.status === 'Checked In' ? 'checked-in' : ''}`}>{booking.status}</span>
                </div>
                <div className="booking-meta">
                  <span>{event?.date ?? booking.date}</span>
                  <span>{event?.venue ?? 'Venue to be announced'}</span>
                </div>
                <div className="booking-student">
                  <span>{booking.name}</span>
                  <span>{booking.college} · {booking.department} · {booking.year}</span>
                </div>
                <small>{booking.id}</small>
              </article>
            )
          })
        )}
      </div>

      <BottomNav active="bookings" onChange={handleStudentNav} />
    </div>
  )

  const renderOrganiserHome = () => (
    <div className="screen app-shell organiser-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Organiser console</p>
          <h2>Good morning</h2>
          <span className="workspace-name">{organiserCollege.name}</span>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={logout}>Logout</button>
          <button className="avatar-btn">OA</button>
        </div>
      </header>

      <div className="stats-row organiser-stats">
        <div className="stat-box">
          <strong>{organiserEvents.length}</strong>
          <span>Main Events</span>
        </div>
        <div className="stat-box">
          <strong>{organiserSubEvents.length}</strong>
          <span>Sub Events</span>
        </div>
        <div className="stat-box">
          <strong>{organiserRegistrations.length}</strong>
          <span>Registrations</span>
        </div>
      </div>

      <div className="section-block organiser-upcoming">
        <div className="heading-row">
          <div>
            <p className="eyebrow">Your listings</p>
            <h3>Upcoming events</h3>
          </div>
          <button className="link-btn" onClick={() => goOrganiserScreen(organiserPortal.myEvents)}>View</button>
        </div>
        <div className="list-stack">
          {organiserEvents.map((event) => (
            <div
              key={event.id}
              className="event-item"
              role="button"
              tabIndex="0"
              onClick={() => {
                setSelectedMainEventId(event.id)
                goOrganiserScreen(organiserPortal.eventDetails)
              }}
            >
              <img src={event.banner} alt={event.name} />
              <div className="event-item-copy">
                <span className="event-source">{event.collegeName}</span>
                <strong>{event.name}</strong>
                <small>{event.startDate} • {event.venue}</small>
              </div>
              <span className="delete-btn" role="button" tabIndex="0" onClick={(clickEvent) => {
                clickEvent.stopPropagation()
                deleteEvent(event.id)
              }}>Delete</span>
            </div>
          ))}
        </div>
      </div>

      <div className="organiser-create-bar">
        <button className="primary-btn full" onClick={() => goOrganiserScreen(organiserPortal.createEvent)}>+ Create main event</button>
      </div>

      <BottomNav organiser active="dashboard" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderCreateEvent = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goOrganiserScreen(organiserPortal.dashboard)}>←</button>
        <div>
          <p className="eyebrow">Create</p>
          <h2>Main Event</h2>
        </div>
      </header>

      <div className="form-card">
        <label>Main Event Name<input value={newEvent.name} onChange={(event) => updateNewEvent('name', event.target.value)} placeholder="TECHNOVA 2K26" /></label>
        <label>College<input value={organiserCollege.name} readOnly /></label>
        <label>Description<textarea value={newEvent.description} onChange={(event) => updateNewEvent('description', event.target.value)} placeholder="Describe your event" /></label>
        <label>Start Date<input value={newEvent.startDate} onChange={(event) => updateNewEvent('startDate', event.target.value)} placeholder="10 Mar 2026" /></label>
        <label>End Date<input value={newEvent.endDate} onChange={(event) => updateNewEvent('endDate', event.target.value)} placeholder="12 Mar 2026" /></label>
        <label>Venue<input value={newEvent.venue} onChange={(event) => updateNewEvent('venue', event.target.value)} placeholder={`${organiserCollege.name} Campus`} /></label>
        <div className="upload-field">
          <div>
            <span className="field-caption">Event banner</span>
            <small>Use a landscape image for the best card preview.</small>
          </div>
          <label className="upload-button">
            <input type="file" accept="image/*" onChange={(event) => updateBanner('event', event.target.files?.[0])} />
            {newEvent.banner ? 'Change banner' : 'Upload banner'}
          </label>
          {newEvent.banner && <img className="upload-preview" src={newEvent.banner} alt="Event banner preview" />}
        </div>
        <button className="primary-btn full" onClick={createEvent}>Create Event</button>
      </div>

      <BottomNav organiser active="events" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderMyEvents = () => (
    <div className="screen app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">{organiserCollege.name}</p>
          <h2>My events</h2>
        </div>
        <button className="primary-btn small" onClick={() => goOrganiserScreen(organiserPortal.createEvent)}>New</button>
      </header>

      <div className="list-stack">
        {organiserEvents.map((event) => (
            <div
            key={event.id}
            className="event-item"
              role="button"
              tabIndex="0"
            onClick={() => {
              setSelectedMainEventId(event.id)
              goOrganiserScreen(organiserPortal.eventDetails)
            }}
          >
            <img src={event.banner} alt={event.name} />
            <div className="event-item-copy">
              <span className="chip-tag light">{event.collegeName}</span>
              <strong>{event.name}</strong>
              <small>{event.startDate}</small>
            </div>
              <span className="delete-btn" role="button" tabIndex="0" onClick={(clickEvent) => {
                clickEvent.stopPropagation()
                deleteEvent(event.id)
              }}>Delete</span>
            </div>
        ))}
      </div>

      <BottomNav organiser active="events" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderEventDetails = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goOrganiserScreen(organiserPortal.dashboard)}>←</button>
        <div>
          <p className="eyebrow">{organiserCollege.name}</p>
          <h2>{selectedMainEvent.name}</h2>
        </div>
      </header>

      <div className="cover-image">
        <img src={selectedMainEvent.banner} alt={selectedMainEvent.name} />
      </div>

      <div className="detail-box">
        <div className="detail-line">
          <span>College</span>
          <strong>{organiserCollege.name}</strong>
        </div>
        <div className="detail-line">
          <span>Dates</span>
          <strong>{selectedMainEvent.startDate} - {selectedMainEvent.endDate}</strong>
        </div>
        <div className="detail-line">
          <span>Venue</span>
          <strong>{selectedMainEvent.venue}</strong>
        </div>
      </div>

      <div className="section-block compact">
        <div className="heading-row">
          <h3>Sub Events</h3>
          <button className="link-btn" onClick={() => goOrganiserScreen(organiserPortal.addSubEvent)}>Add</button>
        </div>
        <div className="list-stack">
          {mainEventSubEvents.map((event) => (
            <div
              key={event.id}
              className="small-list-item"
              role="button"
              tabIndex="0"
              onClick={() => {
                setSelectedSubEventId(event.id)
                goOrganiserScreen(organiserPortal.registrations)
              }}
            >
              <img src={event.banner} alt={event.title} />
              <div>
                <strong>{event.title}</strong>
                <small>{event.date}</small>
              </div>
              <span className="delete-btn" role="button" tabIndex="0" onClick={(clickEvent) => {
                clickEvent.stopPropagation()
                deleteSubEvent(event.id)
              }}>Delete</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav organiser active="events" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderAddSubEvent = () => (
    <div className="screen app-shell">
      <header className="topbar simple">
        <button className="back-btn" onClick={() => goOrganiserScreen(organiserPortal.eventDetails)}>←</button>
        <div>
          <p className="eyebrow">Add</p>
          <h2>Sub Event</h2>
        </div>
      </header>

      <div className="form-card">
        <label>Sub Event Name<input value={newSubEvent.title} onChange={(event) => updateNewSubEvent('title', event.target.value)} placeholder="BUGTHON 2026" /></label>
        <label>Description<textarea value={newSubEvent.description} onChange={(event) => updateNewSubEvent('description', event.target.value)} placeholder="Describe the activity" /></label>
        <label>Date<input value={newSubEvent.date} onChange={(event) => updateNewSubEvent('date', event.target.value)} placeholder="11 Mar 2026" /></label>
        <label>Time<input value={newSubEvent.time} onChange={(event) => updateNewSubEvent('time', event.target.value)} placeholder="09:30 AM" /></label>
        <label>Venue<input value={newSubEvent.venue} onChange={(event) => updateNewSubEvent('venue', event.target.value)} placeholder="Innovation Hall A" /></label>
        <div className="upload-field">
          <div>
            <span className="field-caption">Sub-event banner</span>
            <small>Use a landscape image for the event card.</small>
          </div>
          <label className="upload-button">
            <input type="file" accept="image/*" onChange={(event) => updateBanner('subEvent', event.target.files?.[0])} />
            {newSubEvent.banner ? 'Change banner' : 'Upload banner'}
          </label>
          {newSubEvent.banner && <img className="upload-preview" src={newSubEvent.banner} alt="Sub-event banner preview" />}
        </div>
        <div className="category-picker">
          <span className="field-caption">Category</span>
          <div className="category-options">
            {categories.slice(0, 6).map((category) => (
              <button key={category} type="button" className={`category-option ${newSubEvent.category === category ? 'active' : ''}`} onClick={() => updateNewSubEvent('category', category)}>{category}</button>
            ))}
          </div>
        </div>
        <label>Tags<input value={newSubEvent.tags} onChange={(event) => updateNewSubEvent('tags', event.target.value)} placeholder="Coding, AI, Programming" /></label>
        <button className="primary-btn full" onClick={createSubEvent}>Add Sub Event</button>
      </div>

      <BottomNav organiser active="events" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderRegistrations = () => (
    <div className="screen app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Registrations</p>
          <h2>{selectedSubEvent?.title ?? 'Registrations'}</h2>
        </div>
      </header>

      <div className="search-box">Search student name or registration ID</div>

      <div className="reg-list">
        {organiserRegistrations.map((student) => (
          <button key={student.id} className="reg-item" onClick={() => goOrganiserScreen(organiserPortal.qr)}>
            <div>
              <strong>{student.name}</strong>
              <small>{student.college}</small>
            </div>
            <div className="reg-meta">
              <span>{student.department}</span>
              <span>{student.year}</span>
            </div>
            <div className="reg-bottom">
              <span>{student.id}</span>
              <em className={student.status === 'Checked In' ? 'green' : 'amber'}>{student.status}</em>
            </div>
          </button>
        ))}
      </div>

      <BottomNav organiser active="events" onChange={(tab) => {
        if (tab === 'dashboard') goOrganiserScreen(organiserPortal.dashboard)
        if (tab === 'events') goOrganiserScreen(organiserPortal.myEvents)
        if (tab === 'qr') goOrganiserScreen(organiserPortal.qr)
      }} />
    </div>
  )

  const renderQR = () => (
    <div className="screen app-shell center-shell">
      <div className="qr-card">
        <p className="eyebrow">QR check-in</p>
        <h2>Scan attendee</h2>
        <div className="qr-code-box"><div className="qr-matrix" /></div>
        <button className="primary-btn" onClick={() => goOrganiserScreen(organiserPortal.dashboard)}>Mark checked in</button>
      </div>
    </div>
  )

  const currentPortalView = portal === 'student'
    ? (() => {
        switch (screen) {
          case studentPortal.discover:
            return renderDiscover()
          case studentPortal.categories:
            return renderCategory()
          case studentPortal.college:
            return renderCollege()
          case studentPortal.mainEvent:
            return renderMainEvent()
          case studentPortal.subEvent:
            return renderSubEvent()
          case studentPortal.register:
            return renderRegister()
          case studentPortal.confirmation:
            return renderConfirmation()
          case studentPortal.bookings:
            return renderBookings()
          default:
            return renderStudentHome()
        }
      })()
    : (() => {
        switch (screen) {
          case organiserPortal.myEvents:
            return renderMyEvents()
          case organiserPortal.createEvent:
            return renderCreateEvent()
          case organiserPortal.eventDetails:
            return renderEventDetails()
          case organiserPortal.addSubEvent:
            return renderAddSubEvent()
          case organiserPortal.registrations:
            return renderRegistrations()
          case organiserPortal.qr:
            return renderQR()
          default:
            return renderOrganiserHome()
        }
      })()

  return (
    <div className="app-root">
      <div className="phone-frame">
        <div className="screen-wrapper">
          {authView === 'authenticated' ? currentPortalView : renderAuth()}
        </div>
      </div>
    </div>
  )
}

function BottomNav({ active, organiser = false, onChange }) {
  const items = organiser
    ? [
        { id: 'dashboard', label: 'Home' },
        { id: 'events', label: 'Events' },
        { id: 'qr', label: 'QR' },
      ]
    : [
        { id: 'feed', label: 'Home' },
        { id: 'discover', label: 'Discover' },
        { id: 'bookings', label: 'Bookings' },
      ]

  return (
    <nav className={`bottom-nav ${organiser ? 'organiser-nav' : ''}`}>
      {items.map((item) => (
        <button
          key={item.id}
          className={active === item.id ? 'active' : ''}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}

export default App
