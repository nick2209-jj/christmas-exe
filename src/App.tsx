import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Copy, Gift, Heart, Music2, RotateCcw, Share2, Sparkles, VolumeX } from 'lucide-react'
import ChristmasTree from './components/ChristmasTree'
import SantaSleigh from './components/SantaSleigh'
import Snowfall from './components/Snowfall'
import { friendGreetings } from './data/friends'
import { normalizeName, selectGreeting, type PersonalizedGreeting } from './utils/greetings'

type Screen = 'welcome' | 'decorate' | 'delivery' | 'greeting' | 'gift'

const ornaments = [
  { name: 'Ruby red', color: 'red', icon: '●' },
  { name: 'Golden glow', color: 'gold', icon: '●' },
  { name: 'Winter blue', color: 'blue', icon: '●' },
  { name: 'Evergreen', color: 'green', icon: '●' },
  { name: 'Plum sparkle', color: 'purple', icon: '●' },
  { name: 'Silver star', color: 'silver', icon: '★' },
]

const deliveryLines = [
  'Finding your name...',
  'Preparing your Christmas gift...',
  'Wrapping happiness...',
  'Loading Christmas magic...',
  'Delivering love and blessings...',
]

const isValidName = (name: string) =>
  name.length > 0 &&
  name.length <= 80 &&
  /^[\p{L}\p{M}]+(?:[ '\u2019.-][\p{L}\p{M}]+)*$/u.test(name)

function App() {
  const [screen, setScreen] = useState<Screen>('welcome')
  const [nameInput, setNameInput] = useState('')
  const [recipient, setRecipient] = useState('')
  const [personalGreeting, setPersonalGreeting] = useState<PersonalizedGreeting | null>(null)
  const [placed, setPlaced] = useState<number[]>([])
  const [deliveryStep, setDeliveryStep] = useState(0)
  const [giftOpened, setGiftOpened] = useState(false)
  const [copied, setCopied] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [musicError, setMusicError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)
  const [error, setError] = useState('')
  const fullTree = placed.length === ornaments.length

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const friendName = params.get('friend')
    const visitorName = params.get('name')
    const linkedName = normalizeName(friendName || visitorName || '')
    if (!linkedName) return
    setNameInput(linkedName)
    if (isValidName(linkedName)) {
      const selectedGreeting = selectGreeting(linkedName)
      setPersonalGreeting(selectedGreeting)
      setRecipient(selectedGreeting.kind === 'friend' ? selectedGreeting.name : linkedName)
      setScreen('decorate')
    }
  }, [])

  useEffect(() => {
    if (!fullTree || screen !== 'decorate') return
    const timer = window.setTimeout(() => setScreen('delivery'), 1800)
    return () => window.clearTimeout(timer)
  }, [fullTree, screen])

  useEffect(() => {
    if (screen !== 'delivery') return
    setDeliveryStep(0)
    const interval = window.setInterval(() => {
      setDeliveryStep((step) => {
        if (step >= deliveryLines.length) {
          window.clearInterval(interval)
          window.setTimeout(() => setScreen('greeting'), 650)
          return step + 1
        }
        return step + 1
      })
    }, 560)
    return () => window.clearInterval(interval)
  }, [screen])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !musicEnabled
    let waitingForInteraction = false
    const removeInteractionListeners = () => {
      document.removeEventListener('pointerdown', retryAfterInteraction, true)
      document.removeEventListener('keydown', retryAfterInteraction, true)
      waitingForInteraction = false
    }
    const retryAfterInteraction = (event: Event) => {
      if (event.target instanceof Element && event.target.closest('.music-button')) return
      void audio.play().then(() => {
        setMusicError('')
        removeInteractionListeners()
      }).catch(() => {
        setMusicError('Tap the music button to start Jingle Bells.')
      })
    }
    if (musicEnabled) {
      void audio.play().then(() => setMusicError('')).catch((playError: unknown) => {
        if (playError instanceof DOMException && playError.name === 'NotAllowedError') {
          setMusicError('Music will start after your first interaction with the page.')
          if (!waitingForInteraction) {
            document.addEventListener('pointerdown', retryAfterInteraction, true)
            document.addEventListener('keydown', retryAfterInteraction, true)
            waitingForInteraction = true
          }
        } else {
          setMusicError('Could not play Jingle Bells. Check public/sounds/Jingle-Bells.mp3.')
        }
      })
    } else {
      audio.pause()
    }
    return () => {
      removeInteractionListeners()
      audio.pause()
    }
  }, [musicEnabled])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1800)
    return () => window.clearTimeout(timer)
  }, [copied])

  const begin = () => {
    const cleanName = normalizeName(nameInput)
    if (!isValidName(cleanName)) {
      setError('Please enter a valid name to unwrap your greeting.')
      return
    }
    setError('')
    const selectedGreeting = selectGreeting(cleanName)
    setPersonalGreeting(selectedGreeting)
    setRecipient(selectedGreeting.kind === 'friend' ? selectedGreeting.name : cleanName)
    setPlaced([])
    setScreen('decorate')
  }

  const placeOrnament = (index: number) => {
    if (placed.includes(index)) return
    setPlaced((current) => [...current, index])
  }

  const openNewGreeting = () => {
    setNameInput('')
    setRecipient('')
    setPersonalGreeting(null)
    setPlaced([])
    setGiftOpened(false)
    setError('')
    setScreen('welcome')
  }

  const share = async () => {
    const greetingUrl = createGreetingUrl()
    const greetingText = personalGreeting
      ? `${personalGreeting.message}${personalGreeting.signoff ? ` ${personalGreeting.signoff}` : ''}`
      : ''
    const message = `A little Christmas magic for you, ${recipient}!\n\n${greetingText}\n\nOpen your greeting: ${greetingUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const createGreetingUrl = () => {
    const url = new URL(window.location.href)
    url.search = ''
    const friendSlug = friendGreetings.find((profile) => profile.name === recipient)?.name
    url.searchParams.set(friendSlug ? 'friend' : 'name', friendSlug ?? recipient)
    return url.toString()
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(createGreetingUrl())
      setCopied(true)
    } catch {
      setError('Could not copy automatically. Please copy the page address from your browser.')
    }
  }

  return (
    <main className="app-shell">
      <audio ref={audioRef} src="/sounds/Jingle-Bells.mp3" loop preload="auto" />
      <Snowfall intense={screen === 'greeting' || screen === 'gift' || fullTree} />
      <div className="ambient-glow ambient-glow--left" />
      <div className="ambient-glow ambient-glow--right" />
      <header className="site-header">
        <button className="brand" type="button" onClick={openNewGreeting} aria-label="Christmas.exe home">
          <span className="brand-mark">✳</span>
          <span>Christmas<span className="brand-dot">.exe</span></span>
        </button>
        <div className="header-right">
          <span className="season-label"><span /> A LITTLE MAGIC, WRAPPED IN CODE</span>
          <button
            aria-label={musicEnabled ? 'Turn music off' : 'Turn music on'}
            className="icon-button music-button"
            onClick={() => {
              setMusicError('')
              const audio = audioRef.current
              if (musicEnabled && audio && !audio.paused) {
                setMusicEnabled(false)
                return
              }
              setMusicEnabled(true)
              if (audio && musicEnabled) {
                audio.muted = false
                void audio.play().then(() => setMusicError('')).catch(() => {
                  setMusicError('Your browser could not start music. Check public/sounds/Jingle-Bells.mp3.')
                })
              }
            }}
            title={musicEnabled ? 'Music on' : 'Play Jingle Bells'}
            type="button"
          >
            {musicEnabled ? <Music2 size={17} /> : <VolumeX size={17} />}
          </button>
        </div>
        {musicError && <p className="music-notice" role="status">{musicError}</p>}
      </header>

      <AnimatePresence mode="wait">
        {screen === 'welcome' && (
          <motion.section className="welcome-screen page-content" key="welcome" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
            <div className="welcome-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> A NOTE FROM THE NORTH POLE <span className="eyebrow-line" /></span>
              <h1>HO HO HO!<br /><span>SANTA HAS</span><br /><em>A SURPRISE!</em> <span className="title-santa">🎅</span></h1>
              <p className="welcome-subtitle">Someone special deserves a little<br className="desktop-break" /> Christmas magic.</p>
              <form className="name-form" onSubmit={(event) => { event.preventDefault(); begin() }}>
                <label className="sr-only" htmlFor="recipient-name">Your name</label>
                <input
                  autoComplete="name"
                  id="recipient-name"
                  onChange={(event) => { setNameInput(event.target.value); setError('') }}
                  placeholder="Enter your name..."
                  value={nameInput}
                />
                <button className="primary-button" type="submit">Unwrap your surprise <span>🎁</span></button>
                {error && <p className="form-error" role="alert">{error}</p>}
              </form>
              <p className="private-note"><span>✦</span> One name, one little bit of magic.</p>
            </div>
            <div className="welcome-art">
              <div className="art-halo" />
              <span className="floating-spark floating-spark--one">✦</span>
              <span className="floating-spark floating-spark--two">·</span>
              <span className="floating-spark floating-spark--three">✧</span>
              <ChristmasTree placed={[]} lit />
              <SantaSleigh />
              <p className="art-caption"><span>✳</span> SANTA'S WORKSHOP <span>✳</span></p>
            </div>
          </motion.section>
        )}

        {screen === 'decorate' && (
          <motion.section className="decorate-screen page-content" key="decorate" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
            <button className="back-button" onClick={() => setScreen('welcome')} type="button"><ArrowLeft size={16} /> Back</button>
            <div className="section-heading">
              <span className="eyebrow"><span className="eyebrow-line" /> YOUR VERY OWN TREE <span className="eyebrow-line" /></span>
              <h2>Let’s make Christmas <em>magical.</em></h2>
              <p>Santa has picked something special just for you, {recipient}! 🎅</p>
              <p>Your tree is waiting for a little sparkle, {recipient.split(' ')[0]}. Pick an ornament to decorate!</p>
            </div>
            <div className="decorate-layout">
              <div className="tree-panel"><ChristmasTree placed={placed} lit={fullTree} interactive onPlace={placeOrnament} /></div>
              <div className="ornament-panel">
                <div className="progress-copy"><span>YOUR DECORATIONS</span><strong>{placed.length}<i> / 6</i></strong></div>
                <div className="progress-track"><span style={{ width: `${(placed.length / ornaments.length) * 100}%` }} /></div>
                <p className="pick-hint">Tap each ornament to hang it on your tree.</p>
                <div className="ornament-list">
                  {ornaments.map((ornament, index) => (
                    <button
                      className={`ornament-option${placed.includes(index) ? ' ornament-option--placed' : ''}`}
                      disabled={placed.includes(index)}
                      key={ornament.name}
                      onClick={() => placeOrnament(index)}
                      type="button"
                    >
                      <span className={`ornament-icon ornament-icon--${ornament.color}`}>{placed.includes(index) ? <Check size={17} /> : ornament.icon}</span>
                      <span>{ornament.name}</span>
                      <span className="ornament-status">{placed.includes(index) ? 'ON TREE' : 'ADD +'}</span>
                    </button>
                  ))}
                </div>
                <p className="tree-progress">{fullTree ? 'All the magic is yours!' : `Decorating your tree… ${placed.length}/6 ornaments placed`}</p>
              </div>
            </div>
            {fullTree && <motion.div className="magic-unlocked" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}><Sparkles size={18} /> MAGIC UNLOCKED! YOUR TREE IS READY! <span>🎄</span></motion.div>}
          </motion.section>
        )}

        {screen === 'delivery' && (
          <motion.section className="delivery-screen page-content" key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="delivery-card">
              <div className="delivery-icon">🎅</div>
              <span className="eyebrow">NORTH POLE · SECURE DELIVERY</span>
              <h2>Preparing something <em>special.</em></h2>
              <div className="delivery-terminal">
                <div className="terminal-top"><span /><span /><span /><i>christmas.exe</i></div>
                <div className="terminal-body">
                  <p className="terminal-title">SANTA’S DELIVERY SYSTEM</p>
                  {deliveryLines.map((line, index) => (
                    <p className={index < deliveryStep ? 'terminal-done' : 'terminal-pending'} key={line}>
                      <span>{index < deliveryStep ? '✓' : '·'}</span> {line}
                    </p>
                  ))}
                  {deliveryStep > deliveryLines.length && <p className="terminal-success">STATUS: DELIVERY SUCCESSFUL! 🎁</p>}
                </div>
              </div>
              <p className="delivery-recipient">Wrapping up a little joy for <strong>{recipient}</strong></p>
            </div>
          </motion.section>
        )}

        {screen === 'greeting' && (
          <motion.section className="greeting-screen page-content" key="greeting" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.5 }}>
            <div className="greeting-hero">
              <div className="greeting-copy">
                <span className="eyebrow"><span className="eyebrow-line" /> A LITTLE CHRISTMAS MAGIC <span className="eyebrow-line" /></span>
                <h1>Merry Christmas,<br /><em>{recipient}!</em> <span>🎅</span></h1>
                <p className="greeting-message">May your Christmas be filled with love, laughter, kindness, and beautiful memories. May the coming year bring endless opportunities and happiness!</p>
                <div className="greeting-signature"><span className="signature-rule" /> with love & a little code <span className="signature-heart">♥</span></div>
              </div>
              <div className="greeting-tree"><ChristmasTree placed={ornaments.map((_, index) => index)} lit /></div>
            </div>
            <div className="personal-note">
              <div className="personal-icon">{personalGreeting?.icon ?? '✨'}</div>
              <div className="personal-content">
                <span className="card-kicker">A LITTLE NOTE, JUST FOR YOU {personalGreeting && `· ${personalGreeting.theme.toUpperCase()}`}</span>
                <h2>{personalGreeting ? `For ${personalGreeting.name}` : 'For someone wonderful'}</h2>
                <p>{personalGreeting?.message ?? ''}</p>
                {personalGreeting?.signoff && <strong>{personalGreeting.signoff}</strong>}
              </div>
              <span className="note-decoration">✳</span>
            </div>
            <div className="oop-card">
              <div className="oop-heading"><span className="oop-icon">⌘</span><div><span className="card-kicker">A DEVELOPER’S CHRISTMAS WISH</span><h2>May your heart always…</h2></div></div>
              <div className="oop-grid">
                <p><span>01</span> <strong>Inherit</strong> kindness and generosity from everyone who came before you.</p>
                <p><span>02</span> <strong>Encapsulate</strong> love, gratitude, and the people who make you feel at home.</p>
                <p><span>03</span> Let <strong>Polymorphism</strong> teach us that kindness can be expressed in countless ways.</p>
                <p><span>04</span> <strong>Override</strong> every bit of sadness with joy, and extend kindness to everyone.</p>
              </div>
              <p className="oop-footer">Because the best things in life aren’t built alone. <Heart size={13} fill="currentColor" /></p>
            </div>
            <div className="greeting-actions">
              <button className="primary-button" onClick={() => setScreen('gift')} type="button">There’s one more gift <Gift size={16} /></button>
              <button className="secondary-button" onClick={() => { void share() }} type="button"><Share2 size={15} /> Share the Christmas magic</button>
              <button className="text-button" onClick={() => { void copyLink() }} type="button"><Copy size={14} /> {copied ? 'Link copied!' : 'Copy link'}</button>
              {error && <p className="form-error" role="alert">{error}</p>}
            </div>
            <button className="start-over" onClick={openNewGreeting} type="button"><RotateCcw size={13} /> Create another greeting</button>
          </motion.section>
        )}

        {screen === 'gift' && (
          <motion.section className="gift-screen page-content" key="gift" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45 }}>
            <button className="back-button" onClick={() => setScreen('greeting')} type="button"><ArrowLeft size={16} /> Back to your greeting</button>
            <div className="gift-content">
              <span className="eyebrow"><span className="eyebrow-line" /> FROM SANTA, WITH LOVE <span className="eyebrow-line" /></span>
              <h1>One last little<br /><em>something.</em></h1>
              <p className="gift-intro">Santa left one more gift for you, {recipient.split(' ')[0]}.</p>
              <div className={`big-gift${giftOpened ? ' big-gift--opened' : ''}`} aria-label={giftOpened ? 'Opened gift box' : 'Gift box'}>
                <div className="gift-glow" />
                <div className="gift-burst">{Array.from({ length: 12 }, (_, index) => <i key={index} style={{ '--particle': index } as CSSProperties}>✦</i>)}</div>
                <div className="gift-lid"><span /></div>
                <div className="gift-box"><span className="gift-ribbon-vertical" /><span className="gift-ribbon-horizontal" /></div>
                <div className="gift-shadow" />
              </div>
              {!giftOpened ? (
                <button className="primary-button gift-open-button" onClick={() => setGiftOpened(true)} type="button">Open your secret gift <Gift size={17} /></button>
              ) : (
                <motion.div className="secret-message" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
                  <span className="card-kicker">A GIFT TO CARRY WITH YOU</span>
                  <h2>Dear {recipient},</h2>
                  <p>
                    And hey, never forget that the best gifts aren't the ones wrapped in pretty paper, the friends who make us smile, the people who care about us, and all those little memories that make life beautiful. ❤️🎄

                    So keep smiling, keep shining, and never stop being your amazing self! ✨

                    🎅 **Merry Christmas, my friend!** 🎁❤️ May your days be filled with happiness, laughter, and countless reasons to smile. Here's to more crazy moments, beautiful memories, and an awesome year ahead! 🥳🎄
                  </p>
                  <span className="secret-sparkle">✦</span>
                </motion.div>
              )}
              <button className="start-over gift-start-over" onClick={openNewGreeting} type="button"><RotateCcw size={13} /> Create another greeting</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <footer className="site-footer">
        <span>MADE WITH <span className="footer-heart">♥</span> & A LITTLE CHRISTMAS MAGIC</span>
        <span>EST. DECEMBER <span className="footer-year">2026</span></span>
      </footer>
      {screen === 'decorate' && <span className="corner-hint">A LITTLE SPARKLE GOES A LONG WAY <Sparkles size={12} /></span>}
      {screen === 'welcome' && <span className="corner-hint">MADE FOR SOMEONE SPECIAL <Heart size={12} /></span>}
    </main>
  )
}

export default App
