<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Assets
import heroBg from '@/assets/hero.png'
import s0 from '@/assets/s1.png'
import s1 from '@/assets/s2.png'
import s2 from '@/assets/s3.png'
import s3 from '@/assets/s4.png'
import s4 from '@/assets/s5.png'
import s5 from '@/assets/s6.png'

// State
const email = ref('')

// External links
const handleJoinDiscord = () => {
  window.open('https://discord.com/invite/c7wkbd47CQ', '_blank', 'noopener,noreferrer')
}
const handleWishlist = () => {
  window.open('https://store.steampowered.com/app/3512480/Drownlight/', '_blank', 'noopener,noreferrer')
}
const handleNotifyKickstarter = () => {
  window.open('https://www.kickstarter.com/projects/crytivogames/drownlight', '_blank', 'noopener,noreferrer')

  const handlePrivacyPolicy = () => {
    window.open('https://crytivo.com/privacy-policy/', '_blank', 'noopener,noreferrer')
  }
}

// Menu (mobile)
const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  document.documentElement.classList.toggle('no-scroll', menuOpen.value)
}
const closeMenu = () => {
  menuOpen.value = false
  document.documentElement.classList.remove('no-scroll')
}

// Screenshots + lightbox
const screenshots = ref<string[]>([s0, s1, s2, s3, s4, s5])
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (i: number) => {
  lightboxIndex.value = i
  lightboxOpen.value = true
  document.documentElement.classList.add('no-scroll')
}
const closeLightbox = () => {
  lightboxOpen.value = false
  document.documentElement.classList.remove('no-scroll')
}
const nextShot = () => { lightboxIndex.value = (lightboxIndex.value + 1) % screenshots.value.length }
const prevShot = () => { lightboxIndex.value = (lightboxIndex.value - 1 + screenshots.value.length) % screenshots.value.length }

// Touch swipe
let touchStartX = 0
const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) (dx < 0 ? nextShot() : prevShot())
}

// Parallax via rAF
let rafId = 0
let parallaxEls: HTMLElement[] = []
const parallaxLoop = () => {
  const y = window.scrollY || 0
  for (const el of parallaxEls) {
    const sp = parseFloat(el.dataset.parallaxSpeed || '0.5')
    el.style.transform = `translate3d(0, ${y * sp * -0.5}px, 0)` // subtle
  }
  rafId = requestAnimationFrame(parallaxLoop)
}

// Reveal-on-scroll
let io: IntersectionObserver | null = null
const onResize = () => { if (window.innerWidth >= 768) closeMenu() }

onMounted(() => {
  // parallax init
  parallaxEls = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-speed]'))
  rafId = requestAnimationFrame(parallaxLoop)

  // reveal init
  io = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('is-visible') }),
    { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
  )
  document.querySelectorAll<HTMLElement>('.reveal').forEach(el => io!.observe(el))

  // global listeners
  window.addEventListener('keydown', onKeyGlobal)
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  window.removeEventListener('keydown', onKeyGlobal)
  window.removeEventListener('resize', onResize)
  if (io) io.disconnect()
})

const emailInput = ref<HTMLInputElement | null>(null)

const scrollToSignup = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })

  const start = performance.now()

  const highlight = () => {
    const el = emailInput.value
    if (!el) return
    el.classList.add('pulse-highlight')
    // не даём странице прыгать при фокусе
    el.focus({ preventScroll: true })
    setTimeout(() => el.classList.remove('pulse-highlight'), 3000)
  }

  const waitUntilTop = () => {
    if (window.scrollY <= 2) {
      highlight()
    } else if (performance.now() - start > 800) {
      highlight()
    } else {
      requestAnimationFrame(waitUntilTop)
    }
  }
  requestAnimationFrame(waitUntilTop)
}

const scrollToAbout = () => {
  const el = document.getElementById("about-section")
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
  }
}

const thanksOpen = ref(false)
const openThanks = () => {
  thanksOpen.value = true
  document.documentElement.classList.add('no-scroll')
}
const closeThanks = () => {
  thanksOpen.value = false
  document.documentElement.classList.remove('no-scroll')
}

const MC_ACTION =
  'https://crytivo.us12.list-manage.com/subscribe/post?u=9a67a376226e7f3db13056c73&id=437627bdee&f_id=003a46e0f0'

const MC_TAGS = '12061275'

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const submitToMailchimp = () => {
  const value = email.value.trim()
  if (!isValidEmail(value)) {
    alert('Please enter a valid email.')
    return
  }

  // скрытая форма (без попапов)
  const form = document.createElement('form')
  form.action = MC_ACTION
  form.method = 'POST'
  form.target = 'mc-target'
  form.style.position = 'absolute'
  form.style.left = '-9999px'

  const emailInputEl = document.createElement('input')
  emailInputEl.type = 'email'
  emailInputEl.name = 'EMAIL'
  emailInputEl.value = value
  form.appendChild(emailInputEl)

  const tagsInput = document.createElement('input')
  tagsInput.type = 'hidden'
  tagsInput.name = 'tags'
  tagsInput.value = MC_TAGS
  form.appendChild(tagsInput)

  const honey = document.createElement('input')
  honey.type = 'text'
  honey.name = 'b_9a67a376226e7f3db13056c73_437627bdee'
  honey.value = ''
  form.appendChild(honey)

  document.body.appendChild(form)
  try {
    form.submit()
  } finally {
    setTimeout(() => form.remove(), 600)
  }

  // UX: показываем «спасибо» сразу
  email.value = ''
  openThanks()

  setTimeout(() => {
    handleNotifyKickstarter();
  }, 500)
}

const onKeyGlobal = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (lightboxOpen.value) closeLightbox()
    if (menuOpen.value) closeMenu()
    if (thanksOpen.value) closeThanks()
  }
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowRight') nextShot()
  if (e.key === 'ArrowLeft') prevShot()
}
</script>

<template>
  <div class="min-h-screen bg-ocean-dark text-white font-inter overflow-x-hidden">
    <!-- NAV -->
    <nav hidden="true" class="sticky top-0 z-50 bg-nav-dark/80 backdrop-blur border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <div class="flex items-center">
        </div>

        <!-- Burger (mobile) -->
        <button class="md:hidden text-white/90 hover:text-white focus:outline-none" @click="toggleMenu"
          :aria-expanded="menuOpen ? 'true' : 'false'" aria-label="Open menu">
          <svg v-if="!menuOpen" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Links (desktop) -->
        <div class="hidden md:flex items-center space-x-8 text-white font-inter text-base">
          <a href="https://store.steampowered.com/app/3512480/Drownlight/" target="_blank" @click="closeMenu()"
            class="hover:text-gray-300 transition-colors font-light">STEAM PAGE</a>
          <a href="https://discord.com/invite/c7wkbd47CQ" target="_blank" @click="closeMenu()"
            class="hover:text-gray-300 transition-colors font-light">DISCORD</a>
          <a href="https://www.kickstarter.com/projects/crytivogames/drownlight" target="_blank" @click="closeMenu()"
            class="hover:text-gray-300 transition-colors font-light">KICKSTARTER PAGE</a>
        </div>
      </div>

      <!-- Мобильное меню-оверлей -->
      <transition name="sheet">
        <div v-if="menuOpen" class="fixed inset-0 z-[60] md:hidden text-white" aria-modal="true" role="dialog">
          <!-- полупрозрачный фон -->
          <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeMenu"></div>

          <!-- «шторка» сверху -->
          <div class="absolute top-0 inset-x-0 bg-nav-dark/95 border-b border-white/10">
            <!-- хедер шторки с крестиком -->
            <div class="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
              <span class="text-sm text-white/80"></span>
              <button class="p-2 -mr-2 rounded hover:bg-white/10 focus:outline-none" @click="closeMenu"
                aria-label="Close menu">
                <!-- иконка «X» -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- ссылки -->
            <div class="max-w-6xl mx-auto px-4 pt-2 pb-4 flex flex-col space-y-3 text-base">
              <a href="https://store.steampowered.com/app/3512480/Drownlight/" target="_blank"
                class="hover:text-gray-300 transition-colors font-light">STEAM PAGE</a>
              <a href="https://discord.com/invite/c7wkbd47CQ" target="_blank"
                class="hover:text-gray-300 transition-colors font-light">DISCORD</a>
              <a href="https://www.kickstarter.com/projects/crytivogames/drownlight" target="_blank"
                class="hover:text-gray-300 transition-colors font-light">KICKSTARTER PAGE</a>
            </div>
          </div>
        </div>
      </transition>
    </nav>

    <!-- HERO -->
    <section class="hero relative min-h-screen">
      <!-- BG -->
      <div class="bg-cover-center" data-parallax-speed="0.30" :style="{ backgroundImage: `url(${heroBg})` }"></div>
      <div class="veil-dark"></div>

      <!-- Content -->
      <div class="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <div class="flex justify-center">
          <img src="./assets/logo_v5.png" alt="Drownlight Logo"
            class="w-full fhd:w-[80%] 2k:w-full h-auto opacity-90" />
        </div>

        <div class="mb-10 flex justify-center reveal">
          <div style="font-family: 'Sawarabi';" class="launch-badge">
            <img src="./assets/corner.png" class="corner corner-tl" />
            <img src="./assets/corner.png" class="corner corner-tr" />
            <img src="./assets/corner.png" class="corner corner-bl" />
            <img src="./assets/corner.png" class="corner corner-br" />

            KICKSTARTER LAUNCHES<br />
            <span><a style="color: #05ce78;">24</a> MARCH</span>
          </div>
        </div>

        <div class="text-center mb-8 reveal">
          <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-sawarabi text-shadow-game mb-4">SIGN-UP TO PLAY
            THE GAME FIRST</h2>
          <!--          <p class="text-white text-lg md:text-xl font-sawarabi text-shadow-game mb-8 max-w-md mx-auto">
            Sign up for upcoming closed tests, game updates, and exclusive perks.
          </p>-->

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <div class="relative flex-1 w-full">
              <form class="signup" action="#" method="post" @submit.prevent="submitToMailchimp">
                <input ref="emailInput" v-model="email" type="email" placeholder="Enter your email" required />
                <button class="sign-up-btn" type="submit">SIGN-UP</button>
              </form>
            </div>

            <!--            <button
              type="button"
              @click="handleWishlist"
              class="sign-up-btn shrink-0"
              aria-label="Add to Wishlist on Steam"
            >
              ADD TO WISHLIST
            </button>-->
          </div>
          <p class="text-xs text-white/60 mt-1">
            By signing up you agree to receive email updates about Drownlight.
            You can unsubscribe at any time.
          </p>

          <div class="mt-8 flex justify-center">
            <button @click="handleNotifyKickstarter"
              class="mx-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-sawarabi btn"
              style="
      background-color: #fd7100;
      color: white;
      font-weight: 600;
      font-size: 1.5rem;
      letter-spacing: 0.05em;
      height: 80px;
    ">
              <img src="./assets/k.avif" alt="Kickstarter" class="h-7 align-middle" />
              <span>FOLLOW ON KICKSTARTER</span>
            </button>
          </div>


          <div class="mt-8 text-center">
            <p>Be amongst the first to play the game and score some in-game exclusive perks and rewards.</p>
            <p>Follow us on Kickstarter which is launching soon.</p>
          </div>


          <div class="flex justify-center mt-6">
            <button @click="scrollToAbout" class="text-white/80 hover:text-white transition-colors animate-bounce"
              aria-label="Scroll to About the Game">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT -->
    <section id="about-section" class="relative py-16 px-4 bg-ocean-dark reveal">
      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2 class="text-white text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-sawarabi text-shadow-game mb-8">
          ABOUT THE GAME
        </h2>
        <div class="max-w-full mb-8">
          <img class="h-auto mx-auto" src="./assets/divider.png" alt="" decoding="async" />
        </div>

        <p class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi mb-12 max-w-4xl mx-auto leading-relaxed">
          Drownlight is a city-building survival simulator set in a flooded world. Build and expand your city around a
          lighthouse,
          manage resources, and make moral decisions that shape the fate of the survivors. Secrets lurk in the raging
          waters, and
          if the lighthouse goes out, the city may be lost forever.
        </p>

        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <img v-for="(src, i) in screenshots" :key="i" :src="src" :alt="`Game Screenshot ${i + 1}`"
            class="w-full h-48 md:h-56 lg:h-60 object-cover rounded-lg cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
            @click="openLightbox(i)" loading="lazy" decoding="async" />
        </div>

        <button @click="handleWishlist" class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn">
          WISHLIST ON STEAM
        </button>
      </div>
    </section>

    <!-- DISCORD -->
    <section class="relative min-h-[90svh] bg-ocean-dark py-16 px-4 flex items-center justify-center reveal">
      <!-- BG image with top/bottom fades -->
      <div class="absolute inset-0">
        <div class="absolute top-0 inset-x-0 h-40 bg-gradient-to-t from-transparent via-ocean-dark/80 to-ocean-dark">
        </div>
        <img src="./assets/discord.png" alt="Discord background" class="w-full h-full object-cover" />
        <div class="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-ocean-dark/80 to-ocean-dark">
        </div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2
          class="text-white text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-sawarabi text-shadow-game mb-8 btn-glow">
          JOIN OUR DISCORD
        </h2>
        <div class="max-w-full mb-8">
          <img class="h-auto mx-auto" src="./assets/divider.png" alt="" decoding="async" />
        </div>
        <p
          class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi text-shadow-game-soft mb-12 max-w-4xl mx-auto leading-relaxed">
          Connect with fellow adventurers in our Drownlight Discord community! Share strategies, discuss game-related
          topics, and embark on quests with new allies.
          Whether you're a seasoned warrior or just starting your journey, our welcoming community is here to assist
          with any inquiries or challenges.
          Join us today and become part of Drownlight!
        </p>

        <button @click="handleJoinDiscord"
          class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn">
          JOIN NOW
        </button>
      </div>
    </section>

    <!-- KICKSTARTER -->
    <section class="relative py-16 px-4 bg-ocean-dark reveal">
      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2
          class="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sawarabi text-shadow-game mb-8 leading-tight">
          KICKSTARTER<br>LAUNCHING SOON
        </h2>
        <div class="max-w-full mb-8">
          <img class="h-auto mx-auto" src="./assets/divider.png" alt="" decoding="async" />
        </div>
        <p class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi mb-12 max-w-4xl mx-auto leading-relaxed">
          The Drownlight Kickstarter is launching soon! Join us in forging the game into something even more epic and
          receive exclusive rewards.
          Don't miss out on this chance to elevate your adventure experience. Get notified on launch day!
        </p>

        <button @click.prevent="scrollToSignup"
          class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn">
          NOTIFY ME!
        </button>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[#1E2227] py-6 text-center text-gray-500 backdrop-blur border-t border-white/10">
      <div class="max-w-6xl mx-auto px-4 flex flex-col items-center space-y-4">
        <div class="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-4 sm:space-y-0">
          <!-- Лого + надпись -->
          <a href="https://crytivo.com" target="_blank" rel="noopener noreferrer" class="cursor-pointer">
            <div class="relative inline-block">
              <span class="absolute uppercase text-xs font-light text-white left-1/2 -translate-x-1/2 -top-0">PUBLISHED
                BY</span>
              <img src="./assets/CLogo.png" alt="Publisher Logo" class="h-16" />
            </div>
          </a>

          <!-- Соцсети -->
          <div class="flex space-x-4">
            <a href="https://www.facebook.com/Crytivo/" target="_blank" rel="noopener noreferrer"
              class="hover:opacity-80 transition-opacity cursor-pointer">
              <img src="./assets/f.avif" alt="Facebook" class="h-10 w-10" />
            </a>
            <a href="https://x.com/Crytivo" style="padding-top: 4px;" target="_blank" rel="noopener noreferrer"
              class="hover:opacity-80 transition-opacity cursor-pointer">
              <img src="./assets/x2.png" alt="Twitter/X" class="h-8 w-7" />
            </a>

            <a href="https://www.youtube.com/c/CrytivoGames" target="_blank" rel="noopener noreferrer"
              class="hover:opacity-80 transition-opacity cursor-pointer">
              <img src="./assets/yt.avif" alt="YouTube" class="h-10 w-10" />
            </a>
            <a href="https://www.instagram.com/crytivo/" target="_blank" rel="noopener noreferrer"
              class="hover:opacity-80 transition-opacity cursor-pointer">
              <img src="./assets/inst.avif" alt="Instagram" class="h-10 w-10" />
            </a>
          </div>
        </div>

        <a href="https://crytivo.com/privacy-policy" target="_blank"
          class="hover:text-gray-300 transition-colors font-light">Privacy Policy</a>

        <div class="text-xs text-gray-400">
          <p>
            For press and business inquiries contact
            <a href="mailto:pr@cryivo.com" class="underline hover:text-gray-200">pr@cryivo.com</a>
          </p>
          <p>© 2026 Crytivo, Inc. Trademarks belong to their respective owners. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- THANK-YOU MODAL -->
    <div v-if="thanksOpen" class="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog"
      aria-modal="true" @click.self="closeThanks">
      <!-- dim -->
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      <!-- card -->
      <div
        class="relative z-10 w-full max-w-md rounded-2xl bg-[#0f1b2d] border border-white/10 p-6 text-center shadow-2xl animate-in">
        <h3 class="text-2xl font-semibold mb-2">Thanks for subscribing!</h3>
        <p class="text-white/80 mb-6">
          You’re on the list. Want to support the project even more?<br />
          Check out our Kickstarter page.
        </p>

        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <button class="px-5 py-3 rounded-full bg-white/10 hover:bg-white/15 transition" @click="closeThanks">
            Close
          </button>
          <button class="px-5 py-3 rounded-full bg-white text-black font-semibold hover:opacity-90 transition"
            @click="() => { closeThanks(); handleNotifyKickstarter(); }">
            Go to Kickstarter
          </button>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <div v-if="lightboxOpen"
      class="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeLightbox">
      <button @click="closeLightbox"
        class="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
        aria-label="Close" title="Close (Esc)" autofocus>✕</button>

      <button @click.stop="prevShot"
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Previous" title="Previous (←)">‹</button>

      <button @click.stop="nextShot"
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Next" title="Next (→)">›</button>

      <div class="max-w-[92vw] max-h-[85vh] select-none" @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd">
        <img :src="screenshots[lightboxIndex]" :alt="`Screenshot ${lightboxIndex + 1}`"
          class="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl" draggable="false" decoding="async" />
        <div class="text-center text-sm text-white/70 mt-3">
          {{ lightboxIndex + 1 }} / {{ screenshots.length }}
        </div>
      </div>
    </div>
  </div>

  <iframe name="mc-target" style="display:none;" aria-hidden="true" tabindex="-1"></iframe>
</template>

<style scoped>
:root {
  --ocean-dark: #0b1320;
  --nav-dark: #0f1b2d;
  --emerald: #005417;
}

/* Utility */
.no-scroll {
  overflow: hidden;
}

/* Scrollbar (webkit) */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #001833;
}

::-webkit-scrollbar-thumb {
  background: #4A90A4;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5BA3B8;
}

/* Signup */
.signup {
  display: inline-flex;
  gap: 10px;
  align-items: center;
  background: rgb(30, 34, 39);
  border: 1px solid rgba(255, 255, 255, .15);
  padding: 8px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

.signup input {
  width: min(58vw, 360px);
  padding: 14px 16px;
  border: 0;
  outline: none;
  border-radius: 999px;
  font-size: 16px;
  color: #005417;
  background: #f3f6f6;
}

.sign-up-btn {
  appearance: none;
  border: 0;
  cursor: pointer;
  padding: 14px 22px;
  border-radius: 999px;
  font-weight: 700;
  color: white;
  background: #00851e;
  box-shadow: 0 0 18px rgba(25, 195, 138, .45);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}

.sign-up-btn:hover {
  box-shadow: 0 0 10px 5px rgba(25, 195, 138, .72);
}

/* Buttons generic glow */
.btn {
  box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.32);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}

.btn:hover {
  box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.72);
}

/* Hero / BG layers */
.hero {
  position: relative;
  min-height: 100svh;
  isolation: isolate;
}

.bg-cover-center {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

@media (max-width: 640px) {
  .bg-cover-center {
    background-position: 35% center;
  }
}

.veil-dark {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(to bottom, rgba(10, 20, 34, .10) 0%, rgb(0, 24, 52) 100%);
}

/* Reveal on scroll */
.reveal {
  opacity: 0;
  transform: translateY(14px);
  transition: opacity .6s ease, transform .6s ease;
}

.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none;
    opacity: 1;
    transform: none;
  }
}

/* Small fade animation for mobile menu */
.fade-enter-active,
.fade-leave-active {
  transition: opacity .2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Nav drop shadow */
nav {
  box-shadow: 0 6px 20px rgba(0, 0, 0, .25);
}

/* движение панели */
.sheet-enter-active>div:nth-child(2),
.sheet-leave-active>div:nth-child(2) {
  transition: transform .24s ease;
}

.sheet-enter-from>div:nth-child(2) {
  transform: translateY(-100%);
}

.sheet-leave-to>div:nth-child(2) {
  transform: translateY(-100%);
}

@keyframes emailPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(25, 195, 138, 0);
  }

  40% {
    box-shadow: 0 0 10px 12px rgba(25, 195, 138, .28);
  }

  80% {
    box-shadow: 0 0 0 0 rgba(25, 195, 138, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(25, 195, 138, 0);
  }
}

.pulse-highlight {
  animation: emailPulse 1s ease-in-out 3;
}

/* простая анимация появления карточки */
@keyframes zoomFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-in {
  animation: zoomFadeIn .18s ease-out both;
}

/* общая «компактность» */
.btn-compact {
  padding: 10px 16px;
  /* было 12–16+ */
  font-size: 14px;
  /* меньше шрифт */
}

@media (min-width: 768px) {
  .btn-compact {
    font-size: 15px;
    padding: 12px 18px;
  }
}

/* Steam Wishlist (под палитру) */
.wishlist-btn {
  background: #0a8a5e;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, .2);
  box-shadow: 0 0 18px rgba(25, 195, 138, .45);
  transition: transform .2s ease, box-shadow .25s ease, background .2s ease, filter .2s ease;
}

.wishlist-btn:hover {
  background: #10a874;
  transform: translateY(-2px);
  box-shadow: 0 0 14px rgba(25, 195, 138, .45), 0 10px 24px rgba(0, 0, 0, .35);
}

/* Kickstarter — компактнее и оранжевый, но не «кричит» */
.kickstarter-btn {
  background: #ff9600;
  /* твой оранжевый */
  color: #0b1524;
  border: 1px solid rgba(255, 255, 255, .18);
  box-shadow: 0 0 18px rgba(25, 195, 138, .45);
  transition: transform .2s ease, box-shadow .25s ease, background .2s ease, filter .2s ease;
  line-height: 1.1;
  text-align: center;
  max-width: 420px;
  /* чтобы визуально не растягивалась */
}

.kickstarter-btn:hover {
  background: #ffab33;
  /* лёгкое осветление на ховере */
  transform: translateY(-2px);
  box-shadow: 0 0 14px rgba(25, 195, 138, .45), 0 10px 24px rgba(0, 0, 0, .35);
}

/* маленькая подпись во 2-й строке */
.kickstarter-btn .kick-sub {
  display: block;
  font-size: 11px;
  letter-spacing: .08em;
  margin-top: 2px;
  opacity: .95;
}

.launch-badge {
  display: inline-block;
  padding: 14px 32px;
  background: rgba(0,0,0,0.45);
  border: 1px solid rgba(255,255,255,0.25);
  color: white;
  font-family: "Sawarabi", sans-serif;
  font-size: 18px;
  letter-spacing: 0.08em;
  text-align: center;
  backdrop-filter: blur(6px);
  box-shadow: 0 0 20px rgba(0,0,0,0.35);
}

.launch-badge span {
  display: block;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

/* общий стиль уголков */
.corner {
  position: absolute;
  width: 28px;
  height: 28px;
  pointer-events: none;
}

/* правый верхний — оригинал */
.corner-tr {
  top: 4px;
  right: 4px;
}

/* левый верхний */
.corner-tl {
  top: 4px;
  left: 4px;
  transform: rotate(270deg);
}

/* левый нижний */
.corner-bl {
  bottom: 4px;
  left: 4px;
  transform: rotate(180deg);
}

/* правый нижний */
.corner-br {
  bottom: 4px;
  right: 4px;
  transform: rotate(90deg);
}
</style>
