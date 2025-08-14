<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import heroBg from '@/assets/hero.png'
import discordBg from '@/assets/discord.png'
import s0 from '@/assets/Screenshot_0.png'
import s1 from '@/assets/Screenshot_1.png'
import s2 from '@/assets/Screenshot_2.png'
import s3 from '@/assets/Screenshot_3.png'
import s4 from '@/assets/Screenshot_4.png'
import s5 from '@/assets/Screenshot_5.png'
import divider from '@/assets/divider.png'

const email = ref('')

const handleSignup = () => {
  console.log('Signup with email:', email.value)
  // TODO: Implement signup logic
}

const handleJoinDiscord = () => {
  window.open('https://discord.com/invite/c7wkbd47CQ', '_blank');
}

const handleWishlist = () => {
  window.open('https://store.steampowered.com/app/3512480/Drownlight/', '_blank');
}

const handleNotifyKickstarter = () => {
  window.open('https://www.kickstarter.com/projects/crytivogames/drownlight', '_blank');
}

// --- PARALLAX ---
let onScrollFn: any = null
onMounted(() => {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax-speed]'))
  const onScroll = () => {
    const y = window.scrollY || 0
    for (const el of els) {
      const sp = parseFloat(el.dataset.parallaxSpeed || '0.2')
      // отрицательное смещение: фон «едет» медленнее контента
      el.style.transform = `translate3d(0, ${y * sp * -0.2}px, 0)`
    }
  }
  onScrollFn = onScroll
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  if (onScrollFn) window.removeEventListener('scroll', onScrollFn)
})

// --- REVEAL-ON-SCROLL ---
let io: IntersectionObserver | null = null

onMounted(() => {
  // существующий код параллакса...
  // ...

  // reveal
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('is-visible')
      })
    },
    { threshold: 0.15 }
  )
  document.querySelectorAll<HTMLElement>('.reveal').forEach(el => io!.observe(el))
})

onBeforeUnmount(() => {
  if (onScrollFn) window.removeEventListener('scroll', onScrollFn)
  if (io) io.disconnect()
})

const screenshots = ref<string[]>([
  s0,
  s1,
  s2,
  s3,
  s4,
  s5,
])

const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const openLightbox = (i: number) => {
  lightboxIndex.value = i
  lightboxOpen.value = true
  document.documentElement.style.overflow = 'hidden' // запрет скролла фоном
}
const closeLightbox = () => {
  lightboxOpen.value = false
  document.documentElement.style.overflow = ''
}
const nextShot = () => { lightboxIndex.value = (lightboxIndex.value + 1) % screenshots.value.length }
const prevShot = () => { lightboxIndex.value = (lightboxIndex.value - 1 + screenshots.value.length) % screenshots.value.length }

// клавиатура
const onKeydown = (e: KeyboardEvent) => {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextShot()
  if (e.key === 'ArrowLeft') prevShot()
}
window.addEventListener('keydown', onKeydown, { passive: true })

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// touch-свайп
let touchStartX = 0
const onTouchStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX }
const onTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 40) { dx < 0 ? nextShot() : prevShot() }
}
</script>

<template>
  <div class="min-h-screen bg-ocean-dark text-white font-inter overflow-x-hidden">
    <!-- Navigation Bar -->
    <nav class="w-full h-12 bg-nav-dark/80 backdrop-blur sticky top-0 z-50 border-b border-white/10 flex items-center justify-center">
      <div class="flex space-x-8 text-white font-inter text-lg font-normal">
        <a href="#" @click="handleWishlist" class="hover:text-gray-300 transition-colors">STEAM PAGE</a>
        <a href="#" @click="handleJoinDiscord" class="hover:text-gray-300 transition-colors">DISCORD</a>
        <a href="#" @click="handleNotifyKickstarter" class="hover:text-gray-300 transition-colors">KICKSTARTER PAGE</a>
      </div>
    </nav>

    <!-- Hero Section with Background -->
    <section class="hero relative min-h-screen">
      <!-- Parallax BG -->
      <div
        class="hero__bg"
        data-parallax-speed="0.30"
        :style="{ backgroundImage: `url(${heroBg})` }"
      ></div>
      <div class="hero__veil"></div>

      <!-- Content -->
      <div class="relative z-20 flex flex-col items-center justify-center min-h-screen px-4">
        <!-- Logo -->
        <div class="mb-40">
          <img
            src="./assets/logo_v2.png"
            alt="Drownlight Logo"
            class="w-72 md:w-96 lg:w-[500px] xl:w-[600px] h-auto"
          />
        </div>

        <!-- Sign-up Section -->
        <div class="text-center mb-8 reveal">
          <h2 class="text-white text-2xl md:text-3xl lg:text-4xl font-sawarabi text-shadow-game mb-4">
            SIGN-UP TO PLAY THE GAME FIRST
          </h2>
          <p class="text-white text-lg md:text-xl font-sawarabi text-shadow-game mb-8 max-w-md mx-auto">
            Sign up for upcoming closed tests, game updates,
            and exclusive perks.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <div class="relative flex-1 w-full">
              <form class="signup" action="#" method="post" onsubmit="event.preventDefault(); alert('Subscribed! (wire up to your ESP)');">
                <input type="email" placeholder="Enter your email" required>
                <button @click="handleSignup" class="sign-up-btn" type="submit">SIGN-UP</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About The Game Section -->
    <section class="relative py-16 px-4 bg-ocean-dark reveal">
      <!-- Background with fade effect -->
      <div class="absolute inset-0">
        <div class="h-32 bg-gradient-to-b from-transparent to-ocean-dark"></div>
        <div class="flex-1 bg-ocean-dark"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2 class="text-white text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-sawarabi text-shadow-game mb-8">
          ABOUT THE GAME
        </h2>
        <div class="max-w-full mb-8"><img class="h-auto ml-auto mr-auto" src='./assets/divider.png'/></div>
        <p class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi mb-12 max-w-4xl mx-auto leading-relaxed">
          Drownlight is a city-building survival simulator set in a flooded world. Build and expand your city around a lighthouse, manage resources, and make moral decisions that shape the fate of the survivors. Secrets lurk in the raging waters, and if the lighthouse goes out, the city may be lost forever.
        </p>

        <!-- Screenshots Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          <img
            v-for="(src, i) in screenshots"
            :key="i"
            :src="src"
            :alt="`Game Screenshot ${i+1}`"
            class="w-full h-48 md:h-56 lg:h-60 object-cover rounded-lg cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]"
            @click="openLightbox(i)"
            loading="lazy"
          />
        </div>

        <!-- Wishlist Button -->
        <button
          @click="handleWishlist"
          class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn"
        >
          WISHLIST ON STEAM
        </button>
      </div>
    </section>

    <!-- Discord Section -->
    <section class="relative min-h-[90svh] discord bg-ocean-dark py-16 px-4 flex items-center justify-center reveal">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <div class="absolute top-0 inset-x-0 h-40 bg-gradient-to-t from-transparent via-ocean-dark/80 to-ocean-dark"></div>
        <img
          src="./assets/discord.png"
          alt="Discord background"
          class="w-full h-full object-cover"
        />
        <div class="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-b from-transparent via-ocean-dark/80 to-ocean-dark"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2 class="text-white text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-sawarabi text-shadow-game mb-8 btn-glow">
          JOIN OUR DISCORD
        </h2>
        <div class="max-w-full mb-8"><img class="h-auto ml-auto mr-auto" src='./assets/divider.png'/></div>
        <p class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi text-shadow-game-soft mb-12 max-w-4xl mx-auto leading-relaxed">
          Connect with fellow adventurers in our Drownlight Discord community! Share strategies, discuss game-related topics, and embark on quests with new allies. Whether you're a seasoned warrior or just starting your journey, our welcoming community is here to assist with any inquiries or challenges. Join us today and become part of Drownlight!
        </p>

        <button
          @click="handleJoinDiscord"
          class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn"
        >
          JOIN NOW
        </button>
      </div>
    </section>

    <!-- Kickstarter Section -->
    <section class="relative py-16 px-4 bg-ocean-dark reveal">
      <!-- Background with fade effect -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-b from-ocean-dark via-ocean-dark/80 to-ocean-dark"></div>
      </div>

      <div class="relative z-10 max-w-6xl mx-auto text-center">
        <h2 class="text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-sawarabi text-shadow-game mb-8 leading-tight">
          KICKSTARTER<br>
          LAUNCHING SOON
        </h2>
        <div class="max-w-full mb-8"><img class="h-auto ml-auto mr-auto" src='./assets/divider.png'/></div>
        <p class="text-white text-lg md:text-xl lg:text-2xl font-sawarabi mb-12 max-w-4xl mx-auto leading-relaxed">
          The Drownlight Kickstarter is launching soon! Join us in forging the game into something even more epic and receive exclusive rewards. Don't miss out on this chance to elevate your adventure experience. Get notified on launch day!
        </p>

        <button
          @click="handleNotifyKickstarter"
          class="px-12 py-4 rounded-full bg-white text-black font-sawarabi text-xl btn"
        >
          NOTIFY ME!
        </button>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative">
      <!-- Footer Image -->
      <div class="h-36">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/94b00540e436a9cac3c8f54ae1fbe332f7739503?width=5096"
          alt="Footer design"
          class="w-full h-full object-cover"
        />
      </div>
    </footer>

    <!-- Lightbox -->
    <div
      v-if="lightboxOpen"
      class="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      @click.self="closeLightbox"
    >
      <!-- Кнопка закрытия -->
      <button
        @click="closeLightbox"
        class="absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 focus:outline-none"
        aria-label="Close"
        title="Close (Esc)"
      >✕</button>

      <!-- Prev -->
      <button
        @click.stop="prevShot"
        class="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Previous"
        title="Previous (←)"
      >‹</button>

      <!-- Next -->
      <button
        @click.stop="nextShot"
        class="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 hover:bg-white/20"
        aria-label="Next"
        title="Next (→)"
      >›</button>

      <!-- Image -->
      <div
        class="max-w-[92vw] max-h-[85vh] select-none"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <img
          :src="screenshots[lightboxIndex]"
          :alt="`Screenshot ${lightboxIndex+1}`"
          class="max-h-[85vh] w-auto mx-auto rounded-lg shadow-2xl"
          draggable="false"
        />
        <!-- Index -->
        <div class="text-center text-sm text-white/70 mt-3">
          {{ lightboxIndex+1 }} / {{ screenshots.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root{
  --ocean-dark:#0b1320;
  --nav-dark:#0f1b2d;
  --emerald: #005417;
}

/* Custom scrollbar for webkit browsers */
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

.signup {
  display: inline-flex; gap: 10px; align-items: center;
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.15);
  padding: 8px; border-radius: 999px;
  backdrop-filter: blur(6px);
}
.signup input {
  width: min(58vw, 360px);
  padding: 14px 16px; border: 0; outline: none;
  border-radius: 999px; font-size: 16px;
  color: #005417; background: #f3f6f6;
}
.sign-up-btn { --bg: var(--emerald); ;
  appearance: none; border: 0; cursor: pointer;
  padding: 14px 22px; border-radius: 999px; font-weight: 700;
  color: white; background: #005417; box-shadow: 0 0 18px rgba(25,195,138,.45);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}
.sign-up-btn:hover { box-shadow: 0 0 10px 5px rgba(25,195,138,.72); }

.btn{
  box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.32);
  transition: transform .15s ease, box-shadow .2s ease, background .2s ease;
}
.btn:hover { box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.72); }

.hero {
  position: relative;
  min-height: 100svh;
  isolation: isolate;
}

.hero__bg, .discord__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate3d(0,0,0);
  will-change: transform;
}

.hero__veil, .discord__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      to bottom,
      rgba(10,20,34,.10) 0%,
      rgb(0, 24, 52) 100%
    );
  pointer-events: none;
}

/* Секция Discord почти на весь экран, как Hero */
.discord {
  position: relative;
  isolation: isolate;
}

/* Фоновый слой Discord (как у Hero) */
.discord__bg {
  position: absolute;
  inset: 0;
  z-index: -2;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate3d(0,0,0);
  will-change: transform;
}

/* Вуаль Discord — чуть сильнее затемнение по центру/низу для читабельности */
.discord__veil {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(1200px 700px at 50% 40%, rgba(12,139,116,.18), transparent 60%),
    linear-gradient(180deg, rgba(10,20,34,.20) 0%, rgba(10,20,34,.70) 65%, rgba(10,20,34,.95) 100%);
  pointer-events: none;
}

/* Плавный фейд в цвет следующей секции (#0b1320 = var(--ocean-dark)) */
.discord__fade {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 200px;
  z-index: -1;
  background: linear-gradient(
    to bottom,
    rgba(11,19,32,0) 0%,
    rgba(11,19,32,1) 100%
  );
}

/* (опционально) ослабить параллакс на мобильных для FPS */
@media (max-width: 640px) {
  .discord__bg { transform: none !important; }
}

nav { box-shadow: 0 6px 20px rgba(0,0,0,.25); }

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

/* Уважение к reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .reveal { transition: none; opacity: 1; transform: none; }
}
</style>
